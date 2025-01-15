const mongoose = require('mongoose');

// Attendance Schema (updated)
const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Studentdetail', // Reference to Student model
      required: true
    },
    class: { 
      type: String,
      required: true
    },
    section: { 
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    isPresent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
