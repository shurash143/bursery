import express from "express";
import protect from "../middleware/authMiddleware.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * 🔐 ADMIN CHECK (FIXED: uses uppercase)
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

/**
 * =========================
 * 📌 APPLICATION MANAGEMENT
 * =========================
 */

// Get all applications
router.get("/applications", protect, isAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Fetch Applications Error:", err);
    res.status(500).json({ message: "Server error fetching applications" });
  }
});

// Update application
router.put("/applications/:id", protect, isAdmin, async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update Application Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * =========================
 * 👔 LEADER MANAGEMENT
 * =========================
 */

// 1. Get all leaders
router.get("/leader", protect, isAdmin, async (req, res) => {
  try {
    const leaders = await User.find({
      role: { $in: ["MP", "MCA", "WOMEN_REP"] } // ✅ FIXED roles
    }).select("-password");

    res.json(leaders);
  } catch (err) {
    console.error("Fetch Leaders Error:", err);
    res.status(500).json({ message: "Server error fetching leaders" });
  }
});

// 2. Create new leader
router.post("/leader", protect, isAdmin, async (req, res) => {
  try {
    let { name, email, role, password, county, constituency, ward } = req.body;

    // ✅ Normalize role
    role = role?.toUpperCase();

    const allowedRoles = ["MP", "MCA", "WOMEN_REP"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password || "Leader@123", 10);

    const newLeader = await User.create({
      name,
      email,
      role,
      password: hashedPassword,

      // ✅ IMPORTANT for dashboard filtering
      county,
      constituency,
      ward
    });

    res.status(201).json({
      _id: newLeader._id,
      name: newLeader.name,
      email: newLeader.email,
      role: newLeader.role,
      county: newLeader.county,
      constituency: newLeader.constituency,
      ward: newLeader.ward
    });

  } catch (err) {
    console.error("Create Leader Error:", err);
    res.status(500).json({ message: "Failed to create leader account" });
  }
});

// 3. Update leader
router.put("/leader/:id", protect, isAdmin, async (req, res) => {
  try {
    let { role } = req.body;

    // ✅ Normalize role if updating
    if (role) {
      req.body.role = role.toUpperCase();
    }

    const updatedLeader = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedLeader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json(updatedLeader);

  } catch (err) {
    console.error("Update Leader Error:", err);
    res.status(500).json({ message: "Error updating leader" });
  }
});

// 4. Delete leader
router.delete("/leader/:id", protect, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Leader not found" });
    }

    res.json({ message: "Leader removed successfully" });

  } catch (err) {
    console.error("Delete Leader Error:", err);
    res.status(500).json({ message: "Error deleting leader" });
  }
});

export default router;