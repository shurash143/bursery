import express from "express";
import { upload } from "../config/cloudinary.js";
import Document from "../models/Document.js";

const router = express.Router();

// Upload multiple files
router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Extract Cloudinary URLs
    const urls = req.files.map((file) => file.path);

    // Save to MongoDB
    const doc = new Document({
      name: req.body.name || "Unnamed Document",
      urls,
    });
    await doc.save();

    res.status(201).json({ message: "Files uploaded successfully", doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
