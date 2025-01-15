
const mongoose= require("mongoose")

const signupschema= mongoose.Schema({

name:{
    type:String,
required:true
},
email:{
    type:String,
required:true
},
password:{
    type:String,

},
role:{
    type:String,
    default:"General"
}

})

   const signupModel=  mongoose.model("signup",signupschema)

   module.exports= signupModel
   