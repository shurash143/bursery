import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// GET Reports based on jurisdiction
router.get('/', async (req, res) => {
  try {
    const { role, ward, constituency } = req.query;
    let filter = {};
    
    // Normalize filtering logic
    if (role === 'MCA') filter = { ward: ward };
    else if (role === 'MP') filter = { constituency: constituency };

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST New Report
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT Update Report (Makes the Edit button work)
router.put('/:id', async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Report (Makes the Trash button work)
router.delete('/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRITICAL FIX: Change module.exports to export default
export default router;