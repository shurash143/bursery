import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  ward: String,
  constituency: String,
  leader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

// Change this line from module.exports to export default
const Report = mongoose.model('Report', reportSchema);
export default Report;