const mongoose = require( "mongoose");

const classSchema = new mongoose.Schema({
  class: {
      type: String,
  
    },
    sections:[String],
    Teacher:String,
    subject:[String]

  });
  

const classModel=   mongoose.model("Allclasses",classSchema)

module.exports = classModel