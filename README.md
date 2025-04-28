**🧘 Yoga Pose Classification and Detection**
This project is a Yoga Pose Classification System that allows users to upload a yoga pose image and get:

✅ The predicted yoga pose name (from the Yoga-82 dataset)

✅ The confidence score (how accurately the pose matches)

**🛠️ Technologies Used**
Layer	Technology	Description:
Frontend	React.js	User uploads an image and receives prediction
Backend	Node.js + Express.js	Handles API requests and server communication
Model API	Flask	Loads MobileNetV2 model and predicts yoga pose
Deep Learning Model	MobileNetV2 (TensorFlow/Keras)	Pre-trained on Yoga-82 dataset, fine-tuned
**🏗️ How it Works**
User uploads a yoga pose image using the React frontend.

Image is sent to Node.js server.

Node.js forwards the image to the Flask API.

**Flask:**

Loads MobileNetV2 model.

Classifies the yoga pose.

Calculates the confidence score.

Flask sends the result (pose name + confidence %) back.

Frontend displays the predicted pose and confidence to the user.

**🧠 Model Details**
Architecture: MobileNetV2 (Transfer Learning)

Pre-trained on: ImageNet dataset

Fine-tuned on: Yoga-82 dataset

Input Image Size: 224x224 pixels

Loss Function: Categorical Crossentropy

**Optimizer**: Adam

Techniques Used: Transfer Learning, Fine-tuning, EarlyStopping

🚀 How to Run Locally
**1. Clone the repository**
bash
Copy
Edit
git clone https://github.com/your-repo/yoga-pose-classification.git
cd yoga-pose-classification
**2. Backend Setup (Node.js + Express.js)**
bash
Copy
Edit
cd backend
npm install
npm start
**3. Flask API Setup**
bash
Copy
Edit
cd flask-api
pip install -r requirements.txt
python app.py
**4. Frontend Setup (React.js)**
bash
Copy
Edit
cd frontend
npm install
npm start
**📸 Sample Output**
Pose Name: Warrior II Pose

Confidence: 92.7%

**✨ Key Features**
📤 Upload any yoga pose image

⚡ Get pose name prediction in seconds

📈 Display of confidence score for predictions

🖥️ Fast and responsive web interface

🧩 Lightweight model (MobileNetV2) for quick deployment

**🛠️ Tech Stack**
Frontend: React.js, Axios

Backend: Node.js, Express.js

Model API: Flask, TensorFlow, Keras

Deep Learning Model: MobileNetV2

**📚 Future Improvements**
➡️ Add Top-3 predictions with their confidence scores

➡️ Allow real-time webcam detection

➡️ Deploy on cloud platforms (AWS, Azure, GCP)
