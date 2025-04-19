from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import cv2
import os
import base64
import tempfile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import mediapipe as mp

app = Flask(__name__)
CORS(app)

model = load_model('yoga_pose_classifier_high_acc.h5')
print("✅ Model loaded!")

DATASET_DIR = './train'
CLASS_NAMES = sorted(os.listdir(DATASET_DIR))

mp_pose = mp.solutions.pose
pose_detector = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

@app.route('/')
def upload_form():
    return "Flask backend running..."

@app.route('/train/<pose_class>/<filename>')
def serve_train_image(pose_class, filename):
    folder = os.path.join('train', pose_class)
    return send_from_directory(folder, filename)

def preprocess_image_for_model(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def extract_keypoints(img_path):
    img = cv2.imread(img_path)
    if img is None:
        print(f"Failed to load image from {img_path}")
        return []
    try:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    except Exception as e:
        print(f"Error converting image to RGB: {e}")
        return []
    results = pose_detector.process(img_rgb)
    if results.pose_landmarks:
        return [[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark]
    return []

def compare_keypoints(ref_kp, learner_kp):
    if len(ref_kp) != len(learner_kp) or not ref_kp or not learner_kp:
        return 0
    distances = [np.linalg.norm(np.array(r) - np.array(l)) for r, l in zip(ref_kp, learner_kp)]
    avg_distance = np.mean(distances)
    return max(0, 100 - avg_distance * 100)

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict_pose():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    temp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    try:
        file.save(temp.name)
        temp.close()  # Close the file immediately after saving

        input_tensor = preprocess_image_for_model(temp.name)
        prediction = model.predict(input_tensor)[0]
        pred_index = np.argmax(prediction)
        predicted_class = CLASS_NAMES[pred_index]
        confidence = float(np.max(prediction) * 100)

        class_dir = os.path.join(DATASET_DIR, predicted_class)
        best_score = -1
        best_match_path = None
        learner_kp = extract_keypoints(temp.name)

        for img_name in os.listdir(class_dir):
            ref_path = os.path.join(class_dir, img_name)
            ref_kp = extract_keypoints(ref_path)
            if ref_kp:
                score = compare_keypoints(ref_kp, learner_kp)
                if score > best_score:
                    best_score = score
                    best_match_path = img_name

        matched_image_url = f"http://localhost:8000/train/{predicted_class}/{best_match_path}"

        # Read the file again for base64 encoding
        with open(temp.name, "rb") as f:
            uploaded_img_bytes = f.read()
        uploaded_img_base64 = "data:image/jpeg;base64," + base64.b64encode(uploaded_img_bytes).decode('utf-8')

        return jsonify({
            'predicted_class': predicted_class,
            'confidence': round(confidence, 2),
            'match_accuracy': round(best_score, 2),
            'uploaded_image': uploaded_img_base64,
            'best_reference_image_url': matched_image_url
        })

    finally:
        # Ensure file is deleted even if an error occurs
        try:
            os.unlink(temp.name)
        except PermissionError as e:
            print(f"Warning: Could not delete temp file {temp.name}: {e}")
if __name__ == '__main__':
    app.run(port=8000, debug=True)
