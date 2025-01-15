const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: {
    type: String,
    required: true,
    // unique: true,
  },
  subjectCode: {
    type: String,
    // unique: true,
    required: true,
  },
  subjectType: {
    type: String,
  },
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
