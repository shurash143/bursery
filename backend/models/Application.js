import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // 🔥 ADD THIS (VERY IMPORTANT)
    role: {
      type: String,
      enum: ["mp", "mca", "womenRep"],
      required: true
    },

    county: { type: String, required: true },
    constituency: { type: String, required: true },
    ward: { type: String, required: true },

    schoolName: { type: String, required: true },
    admissionNumber: { type: String, required: true },
    familyIncome: { type: Number, required: true },
    reason: { type: String },

    documents: {
      idCopy: String,
      admissionLetter: String,
      feeStructure: String
    },

    // 🔥 SIMPLIFIED (based on role)
    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    awardedAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);