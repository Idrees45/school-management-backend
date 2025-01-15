// const mongoose = require('mongoose');

// const ExamSchema = new mongoose.Schema({

//     className:{
//           type:mongoose.Schema.Types.ObjectId,
//     ref:"Allclasses"
//     },
//   sectionName: String,
//   examName:String,
//   subjectName:String,
//   date: { type: Date },
//   time: {
//     type: String,
//   },

// });

// const Exam = mongoose.model('Exam',ExamSchema);
// module.exports = Exam;



const mongoose = require('mongoose');

const ExamSchema =  mongoose.Schema({
  className: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Allclasses",
  },
  sectionName: String,
  examName: String,
  subjectName: String,
  date: { type: Date },
  time: String,
},{ autoIndex: false });

const Exam = mongoose.model("Exam", ExamSchema);
module.exports = Exam;
