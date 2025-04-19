const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.send("backend is running successfully")
})

app.post("/api/predict", upload.single("image"), async (req, res) => {
  console.log("📥 Received prediction request");

  if (!req.file) {
    console.log("❌ No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    console.log(`📂 Processing file: ${filePath}`);
    
    const imageBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    formData.append("image", imageBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log("📤 Forwarding to Flask...");
    const flaskResponse = await axios.post(
      "http://localhost:8000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("✅ Received from Flask:", flaskResponse.data);
    res.json(flaskResponse.data);

  } catch (error) {
    console.error("🚨 Full error:", error);
    if (error.response) {
      console.error("Flask response error:", error.response.data);
    }
    res.status(500).json({ 
      error: "Prediction failed",
      details: error.message 
    });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("⚠️ Cleanup error:", err);
    });
  }
});
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`)
);
