
const mongoose= require ("mongoose")


const Teacherschema= new  mongoose.Schema({
userid:{
    // type:String,
   type:mongoose.Schema.Types.ObjectId,
    ref:"signup"
},
idCardNumber :String,
Gender:String,
Religion:String,


})

const  Teachermodel= mongoose.model("Teacherdetail",Teacherschema)
module.exports=Teachermodel