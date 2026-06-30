import Bursary from "../models/Bursary.js";

// ==========================
// CREATE BURSARY
// ==========================
export const createBursary = async (req, res) => {
  try {
    const bursary = await Bursary.create(req.body);

    res.status(201).json(bursary);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// GET ALL BURSARIES
// ==========================
export const getBursaries = async (req, res) => {
  try {
    const bursaries = await Bursary.find().sort({
      createdAt: -1,
    });

    res.json(bursaries);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// GET ONE BURSARY
// ==========================
export const getBursary = async (req, res) => {
  try {
    const bursary = await Bursary.findById(req.params.id);

    if (!bursary) {
      return res.status(404).json({
        message: "Bursary not found",
      });
    }

    res.json(bursary);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// UPDATE BURSARY
// ==========================
export const updateBursary = async (req, res) => {
  try {
    const bursary = await Bursary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!bursary) {
      return res.status(404).json({
        message: "Bursary not found",
      });
    }

    res.json(bursary);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// DELETE BURSARY
// ==========================
export const deleteBursary = async (req, res) => {
  try {
    const bursary = await Bursary.findById(req.params.id);

    if (!bursary) {
      return res.status(404).json({
        message: "Bursary not found",
      });
    }

    await bursary.deleteOne();

    res.json({
      success: true,
      message: "Bursary deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};