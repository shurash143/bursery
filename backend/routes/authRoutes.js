import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Register and login
router.post("/register", register);
router.post("/login", login);

// Forgot password → generates reset token
router.post("/forgot-password", forgotPassword);

// Reset password → sets new password using token
router.post("/reset-password/:token", resetPassword);

export default router;
