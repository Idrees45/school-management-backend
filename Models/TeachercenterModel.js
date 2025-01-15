
const mongoose= require("mongoose")

const TeachingAssignmentSchema = mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'signup', required: true },
    classId: { type:mongoose.Schema.Types.ObjectId, ref: 'Allclasses', required: true },
    days:[{type:String}],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    subject:String,
    section:String

  });
  
  const TeachingAssignment = mongoose.model('TeacherCenterCollection', TeachingAssignmentSchema);
  module.exports = TeachingAssignment;
  