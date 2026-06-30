import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.toUpperCase(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful:", user.email);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toUpperCase(),
        county: user.county,
        constituency: user.constituency,
        ward: user.ward,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= REGISTER =================
export const register = async (req, res) => {
  console.log("========== REGISTER HIT ==========");
  console.log("Request Body:", req.body);

  try {
    const {
      name,
      email,
      password,
      role,
      county,
      constituency,
      ward,
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      console.log("User already exists");
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role ? role.toUpperCase() : "STUDENT",
      county,
      constituency,
      ward,
    });

    console.log("User created successfully:", user.email);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("========== REGISTER ERROR ==========");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({
      success: true,
      message: "Reset link sent",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};