import Application from "../models/Application.js";

/**
 * @desc Leader Dashboard: Aggressive Fetch Logic
 */
export const leaderDashboard = async (req, res) => {
  try {
    // These come from the 'protect' middleware
    const { role, ward, constituency, county } = req.user;
    
    // Convert role to uppercase to handle 'mp' vs 'MP'
    const normalizedRole = role?.toUpperCase();
    let filter = {};

    // 🛠️ RELAXED FILTERING STRATEGY
    // Instead of failing, we search for ANY application that matches the role type
    if (normalizedRole === "MP") {
      filter.role = "mp"; 
      // Only filter by constituency if it actually exists in the leader's profile
      if (constituency) {
        filter.constituency = { $regex: new RegExp(`^${constituency}$`, "i") };
      }
    } 
    else if (normalizedRole === "MCA") {
      filter.role = "mca";
      if (ward) {
        filter.ward = { $regex: new RegExp(`^${ward}$`, "i") };
      }
    }
    else if (normalizedRole === "WOMEN_REP") {
      filter.role = "womenRep";
      if (county) {
        filter.county = { $regex: new RegExp(`^${county}$`, "i") };
      }
    }

    // DEBUG: This helps you see exactly what the code is asking Atlas for
    console.log("Final Database Query:", JSON.stringify(filter));

    const applications = await Application.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Internal Server Error during fetch" });
  }
};

/**
 * @desc Student: Submit Application
 */
export const applyBursary = async (req, res) => {
  try {
    const { 
      studentName, schoolName, admissionNumber, familyIncome, 
      county, constituency, ward, reason, role 
    } = req.body;

    const application = new Application({
      student: req.user.id,
      studentName,
      schoolName,
      admissionNumber,
      familyIncome: Number(familyIncome),
      county,
      constituency,
      ward,
      reason,
      role: role?.toLowerCase(), // Standardize to lowercase for the DB
      documents: {
        idCopy: req.files?.idCopy ? req.files.idCopy[0].path : null,
        admissionLetter: req.files?.admissionLetter ? req.files.admissionLetter[0].path : null,
        feeStructure: req.files?.feeStructure ? req.files.feeStructure[0].path : null,
      },
      status: "pending"
    });

    await application.save();
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * @desc Delete Application
 * @route DELETE /api/applications/:id
 */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the application first (to check if it exists)
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 2. Optional: Check if the leader has permission (optional safety check)
    // if (req.user.role !== 'ADMIN' && application.constituency !== req.user.constituency) {
    //   return res.status(403).json({ message: "Not authorized to delete this" });
    // }

    // 3. Remove from Database
    await Application.findByIdAndDelete(id);

    res.json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

/**
 * @desc Update Status
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, awardedAmount } = req.body;
    
    const app = await Application.findByIdAndUpdate(
      id,
      { 
        status, 
        remarks, 
        awardedAmount: Number(awardedAmount) || 0, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true } // new: true returns the updated document
    );
    
    if (!app) return res.status(404).json({ message: "Application not found" });

    // Return the app directly so React's setApplications works perfectly
    res.json(app); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Other Fetchers
 */
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate("student").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const myApplications = async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};