import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Prediction failed. Please try again. ' + (err.response ? err.response.data.error : err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container d-flex flex-column align-items-center justify-content-center min-vh-100 text-white"
    
    >
      <h1 className="mb-4 text-center text-black font-weight-900 display-3 ">Yoga Pose Classifier 🧘‍♂</h1>

      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control mb-3"
        />
        <button type="submit" className="predictButton  w-100 d-flex justify-content-center align-items-center">
          {loading ? (
            <>
              <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Predicting...</span>
            </>
          ) : (
            'Predict Pose'
          )}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3 w-100 text-center" style={{ maxWidth: '400px' }}>{error}</div>}

      {result && (
        <div className="card result-card mt-5 p-4 shadow text-dark">
          <h2 className="text-center">Prediction Result</h2>
          <p><strong>Pose:</strong> {result.predicted_class}</p>
          {/* <p><strong>Confidence:</strong> {result.confidence}%</p> */}
          <p><strong>Match Accuracy:</strong> {result.match_accuracy}%</p>

          <div className="row mt-4">
            <div className="col-md-6 text-center mb-3">
              <h5>Uploaded Image</h5>
              <img
                src={result.uploaded_image}
                alt="Uploaded"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '300px' }}
              />
            </div>
            <div className="col-md-6 text-center mb-3">
              <h5>Best Matched Reference</h5>
              <img
                src={result.best_reference_image_url}
                alt="Matched"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
