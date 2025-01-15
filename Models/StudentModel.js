const mongoose= require ("mongoose")


const studentschema= new  mongoose.Schema({
userid:{
    // type:String,
   type:mongoose.Schema.Types.ObjectId,
    ref:"signup"
},
// className:{
//       type:mongoose.Schema.Types.ObjectId,
//     ref:"Allclasses"
// },
firstNam:String,
lastName:String,
Gender:String,
class:String,
section:String,
RollNo:String,
admissionNo:String,
Religion:String,
PermanentAddress:String,
PresentAddres:String,
birthCertificateNumber:String,
email:String,
section:String,
admissionDate: { type: Date, default: Date.now },
dateofbirth: {
    type: Date,
    required: true
  },
  imgpath:String,
  parentInfo: {
    
fatherName:String,
fatherOccupation:String,
motherName:String,
motherOccupation:String,
phone:String,
idCardNumber:String

 }


})

const  studentmodel= mongoose.model("Studentdetail",studentschema)
module.exports=studentmodel