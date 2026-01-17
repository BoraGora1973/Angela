
// git add .
// git commit -m "code 1"
// git push -u origin main

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config (מה-ENV)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// תחליף לכתובת של האתר שלך ב-Vercel אחרי שתעלה
app.use(cors({ origin: "*" }));

/************************************************************************************/
/* 											REST API 								*/
/************************************************************************************/
//
// העלאת תמונה => /api/upload
//
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "angela-gallery"
    });

    res.json({
      id: result.public_id,
      url: result.secure_url
    });
  } catch (e) {
    res.status(500).json({ error: "Upload failed", details: String(e) });
  }
});

//
// רשימת תמונות (קבועה)
//
app.get("/api/images", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:angela-gallery AND resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const images = (result.resources || []).map((r) => ({
      id: r.public_id,
      url: r.secure_url,
      createdAt: r.created_at
    }));

    res.json({ images });
  } catch (e) {
    res.status(500).json({ error: "List failed", details: String(e) });
  }
});

//
// Test Backend Ok => /health
// 
app.get("/health", (req, res) => res.json({ok: true }));

//
// Test Backend Request Response => /api/hello
// 

app.get("/api/hello", (req, res) => {
  res.json({ message: "Message From Boris Backend, V01" });
});

//
// Test Backend Request Response => /test
// 

app.get("/api/hello", (req, res) => {
  res.json({ message: "Test Message From Boris Backend, V01" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server listening on", port));
