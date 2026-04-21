import Application from "../models/Application.js";
import Leader from "../models/Leader.js";

/**
 * @desc Leader Dashboard: Fetch applications assigned to their specific jurisdiction
 * Handles MP (Constituency), MCA (Ward), and Women Rep (County)
 */
export const getLeaderApplications = async (req, res) => {
  try {
    // 1. Destructure jurisdiction and role from the authenticated user
    // Ensure your Auth Middleware is passing these from the JWT
    const { ward, constituency, county, role: userRole } = req.user;
    
    if (!userRole) {
      return res.status(403).json({ message: "User role not found in session" });
    }

    const normalizedRole = userRole.toLowerCase();
    let filter = {};

    /**
     * 2. Dynamic Filter Construction
     * We match the 'role' field in the Application document (from your screenshot)
     * and the geographical boundary of the logged-in leader.
     */
    if (normalizedRole.includes("mp") || normalizedRole.includes("parliament")) {
      filter = { 
        role: "mp", 
        constituency: { $regex: new RegExp(`^${constituency}$`, "i") } 
      };
    } 
    else if (normalizedRole.includes("mca") || normalizedRole.includes("ward")) {
      filter = { 
        role: "mca", 
        ward: { $regex: new RegExp(`^${ward}$`, "i") } 
      };
    } 
    else if (normalizedRole.includes("women") || normalizedRole.includes("rep")) {
      filter = { 
        role: "womenRep", 
        county: { $regex: new RegExp(`^${county}$`, "i") } 
      };
    } else {
      return res.status(403).json({ message: "Unauthorized role for this dashboard" });
    }

    // DEBUG: Logs to your terminal so you can see why a query might return []
    console.log(`[DEBUG] Fetching for ${normalizedRole}:`, filter);

    // 3. Execute Query
    const applications = await Application.find(filter)
      .populate("student", "name email phoneNumber") // Links student data
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Internal server error fetching applications" });
  }
};

/**
 * @desc Update Application Status (Approve/Reject)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, awardedAmount } = req.body;

    // Validate status input
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status, 
          remarks: remarks || `Processed by ${req.user.role}`,
          awardedAmount: Number(awardedAmount) || 0,
          updatedAt: Date.now()
        } 
      },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: `Application ${status} successfully`, updatedApp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get Stats for Leader Dashboard
 */
export const getLeaderStats = async (req, res) => {
    try {
        // Reuse the same logic to get the filter for the specific leader
        const { ward, constituency, county, role: userRole } = req.user;
        let filter = {};
        const normalizedRole = userRole.toLowerCase();

        if (normalizedRole.includes("mp")) filter = { role: "mp", constituency };
        else if (normalizedRole.includes("mca")) filter = { role: "mca", ward };
        else if (normalizedRole.includes("women")) filter = { role: "womenRep", county };

        const stats = await Application.aggregate([
            { $match: filter },
            { $group: {
                _id: null,
                totalApps: { $sum: 1 },
                totalAwarded: { $sum: "$awardedAmount" },
                pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
            }}
        ]);

        res.json(stats[0] || { totalApps: 0, totalAwarded: 0, pendingCount: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};