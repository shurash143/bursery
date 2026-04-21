import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/allowRoles.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * @desc Get all leaders (ADMIN only)
 */
router.get("/", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const leaders = await User.find({
      role: { $in: ["MP", "MCA", "WOMEN_REP", "mp", "mca", "womenRep"] }
    }).select("-password").sort({ createdAt: -1 });

    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching leaders" });
  }
});

/**
 * @desc Create new leader (ADMIN only)
 */
router.post("/", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    let { name, email, role, password, county, constituency, ward } = req.body;

    // Normalize role to lowercase to match your Controller's logic
    const normalizedRole = role?.toLowerCase(); 
    const allowedRoles = ["mp", "mca", "womenrep"];
    
    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password || "Leader@123", 10);

    const newLeader = await User.create({
      name,
      email,
      role: normalizedRole, // Stored as 'mp', 'mca', etc.
      password: hashedPassword,
      county,
      constituency,
      ward
    });

    res.status(201).json({ message: "Leader created", id: newLeader._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @desc Update leader
 */
router.put("/:id", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { name, email, role, county, constituency, ward, password } = req.body;
    
    const updateData = { name, email, county, constituency, ward };
    if (role) updateData.role = role.toLowerCase();

    // Only hash and update password if it's actually being changed
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedLeader = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedLeader) return res.status(404).json({ message: "Leader not found" });

    res.json(updatedLeader);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * @desc Delete leader
 */
router.delete("/:id", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Leader removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;