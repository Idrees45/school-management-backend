
const userModel=  require ("../Models/signupModel")
const TeacherModel= require("../Models/TeacherModel")
const centerModel= require("../Models/TeachercenterModel")
const bcrypt= require("bcrypt")
const Teacherregister= async(req,res)=>{
    try {
        // const {email,name,password,roleno,Religion}=req.body
        // const hashedpassword= await bcrypt.hash(password,10)
        console.log(req.body)
       const saved= await   userModel.create({
        name:req.body.firstName,
        ...req.body
       })
       if(saved){
        
        const Studentdetail=  await  TeacherModel.create({
            userid:saved._id,
              ...req.body
        })
           if (Studentdetail) {
               return res.status(200).json({
                   message: "User successfully register",
                   Data: saved
               })

           }}
       
       return res.json({
        message:"user not save"
       })
    } catch (error) {
        return res.status(500).json({message:error.message||error})
    }
}

const teacherhub=async(req,res)=>{
try {
    console.log("Data",req.body)
   const saved= await  centerModel.create({
    teacherId:req?.body?.teacher,
    classId:req?.body?.class,
    ...req.body
   })
   if(saved){
    return res.json({
        message:"Successfully save",
        status:200,
        success:true,
        Data:saved
    })
   }
   return res.json({
    message:"not saved save",
    success:false,
})
} catch (error) {
    return res.status(500).json({message:error.message||error})
}

}

const teacherfetch=async(req,res)=>{
    try {
        console.log("Data",req.body)
        const found = await centerModel.find({}).populate("teacherId").populate("classId");
        if (found) {
            return res.json({
                message: "Successfully saved",
                status: 200,
                success: true,
                Data: found,
               
            });

        }
    
        return res.json({
            message: "No records found",
            status: 404,
            success: false
        });
    } catch (error) {
        return res.status(500).json({message:error.message||error})
    }
    
    }
    



    const ClassTiming =async(req,res)=>{
        try {
const fetch=  await centerModel.find({}).populate({
    path: "classId",
    select: "class" 
}).lean()

             if(fetch){
                return res.status(200).json({
                    message:"userFound successfully",
                    Data:fetch
                })
             }
        res.status(400).json({
            message:"users Not found"
        })
        } catch (error) {
            return res.status(500).json({message:error.message||error})
        }
        
        }



module.exports={
    Teacherregister,
    teacherhub,
    teacherfetch,
    ClassTiming
}