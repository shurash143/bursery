const Report = require('../models/Report');

exports.getReports = async (req, res) => {
  try {
    const { role, ward, constituency } = req.query;
    let filter = {};
    
    // Filter logic based on the leader's jurisdiction
    if (role === 'MCA') filter = { ward };
    else if (role === 'MP') filter = { constituency };

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching reports" });
  }
};

exports.createReport = async (req, res) => {
  try {
    const newReport = new Report(req.body);
    const saved = await newReport.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error saving report" });
  }
};