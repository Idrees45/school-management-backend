


const mongoose = require('mongoose');

const GradeSchema =  mongoose.Schema({
  className:String,
  sectionName: String,
  examName: String,
  subjectName: String,
  rollNumber:String,
  studentId:String,
  totalMarks:String,
  obtainedMarks:String,
  date: { type: Date },
},{ autoIndex: false });

const Grade = mongoose.model("Grade", GradeSchema);
module.exports = Grade;
