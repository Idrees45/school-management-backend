
const signupModel= require("../Models/signupModel")
const classModel= require("../Models/classModel")
const SubjectModel= require("../Models/SubjectModel")
const sectionModel= require("../Models/Section")
const TeacherModel= require("../Models/TeacherModel")

const fetchclass= async(req,res)=>{

    try {
        // const {Grade,Teacher,id,section,subject}=req.body
    
    //   const subjectvalues =  subject.map((ele,index)=>{
    //         return ele.value
    //     })
    //     const sectionvalues = section.map((ele,index)=>{
    //         return ele.value
    //     })
    
    const classes = await classModel.find({});
        
        if (!classes.length) {
            return res.status(404).json({
                message: "No classes found",
                success: false,
            });
        }

        // Find all teachers and populate the `userid` field
        const teachers = await TeacherModel.find()
        .select("userid") // Select only 'userid' from TeacherModel
        .populate({
            path: "userid",
            select: "name email" // Replace with the fields you want from the 'userid' model
        });
    
    
        if (!teachers.length) {
            return res.status(404).json({
                message: "No teachers found",
                success: false,
            });
        }

        // Send response if both classes and teachers are found
        return res.status(200).json({
            message: "Data found",
            TeacherData: teachers,
            classData: classes,
            success: true,
        });

    } catch (error) {
        // Handle any errors that occur during the database queries
        res.status(500).json({
            message: error.message || "An error occurred",
            error: true,
            success: false,
        });
    }
}



    module.exports={
        fetchclass
    }