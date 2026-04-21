// models/Leader.js
import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ["MP", "MCA", "WOMEN_REP"],
    required: true
  },
  county: String,
  constituency: String,
  ward: String
});

export default mongoose.model("Leader", leaderSchema);
