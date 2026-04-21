import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/allowRoles.js";
import { upload } from "../config/cloudinary.js";

// Import all controllers
import {  
  applyBursary, 
  myApplications,
  leaderDashboard, 
  updateReviewStatus,
  deleteApplication, // <--- New Controller
  getAllApplications
} from "../controllers/applicationController.js";

const router = express.Router();

/**
 * @section Student Routes
 */

// Submit a new application with file uploads
router.post(
  "/apply",
  protect,
  upload.fields([
    { name: "idCopy", maxCount: 1 },
    { name: "admissionLetter", maxCount: 1 },
    { name: "feeStructure", maxCount: 1 }
  ]),
  applyBursary
);

// Get applications belonging to the logged-in student
router.get("/my", protect, myApplications);


/**
 * @section Leader & Admin Management Routes
 */

// Get applications filtered by Leader's jurisdiction (MP/MCA/WOMEN_REP)
router.get(
  "/leader",
  protect,
  allowRoles("MP", "MCA", "WOMEN_REP", "ADMIN"),
  leaderDashboard
);

// Update application status (Approve/Pending/Remarks)
// Using PATCH because we are performing a partial update
router.patch(
  "/:id",
  protect,
  allowRoles("MP", "MCA", "WOMEN_REP", "ADMIN"),
  updateReviewStatus
);

// Delete an application permanently
router.delete(
  "/:id",
  protect,
  allowRoles("MP", "MCA", "WOMEN_REP", "ADMIN"),
  deleteApplication
);


/**
 * @section Super Admin Routes
 */

// Get every application in the system regardless of jurisdiction
router.get(
  "/all", 
  protect, 
  allowRoles("ADMIN"), 
  getAllApplications
);

export default router;