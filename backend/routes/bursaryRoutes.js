import express from "express";
import {
  createBursary,
  getBursaries,
  getBursary,
  updateBursary,
  deleteBursary,
} from "../controllers/bursaryController.js";

const router = express.Router();

// Create
router.post("/", createBursary);

// Get all
router.get("/", getBursaries);

// Get one
router.get("/:id", getBursary);

// Update
router.put("/:id", updateBursary);

// Delete
router.delete("/:id", deleteBursary);

export default router;