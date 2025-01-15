
const signupModel= require("../Models/signupModel")
const classModel= require("../Models/classModel")
const SubjectModel= require("../Models/SubjectModel")
const sectionModel= require("../Models/Section")
const TeacherModel= require("../Models/TeacherModel")
const ExamModel= require("../Models/ExamModel")
const studentModel= require("../Models/StudentModel")
const GradeModel= require("../Models/GardeModel")

const fetchExamclass= async(req,res)=>{
try {
    
        const found= await  classModel.find({})
        if(found){
            return  res.status(200).json({
                messag:"classes found",
                Data:found
            })
        }

return res.status(400).json({
    message:"classes not found"
})

} catch (error) {
    res.status(500).json({
        message: error.message || "An error occurred",
        error: true,
        success: false,
    });
}

}



// const ExamPost= async(req,res)=>{
//     try {
//         console.log("body-exam",{...req.body})

//         const {  date,time, examName, className,subjectName,sectionName}=req.body
//   const save = await ExamModel.create({
//     date: date,
//     time: time,
//      examName:examName,  
//      className:className,
//      subjectName:subjectName,
//      sectionName: sectionName
  

// })
    
//   if(save){

//     return res.status(200).json({
//         message:"Exam added sucessfully",
//         success:true
//     })
//   }

//   return res.status(400).json({
//     message:"Exam not added",
//     success:false

//   })
//     } catch (error) {
//         res.status(500).json({
//             message: error.message || "An error occurred",
//             error: true,
//             success: false,
//         });
//     }
    
//     }



const ExamPost = async (req, res) => {
    try {
        console.log("body-exam", { ...req.body });

        const { date, time, examName, className, subjectName, sectionName } = req.body;

        // Check if an exam already exists with the same class, section, and subject
        const existingExam = await ExamModel.findOne({
            className: className,
            sectionName: sectionName,
            subjectName: subjectName
        });

        if (existingExam) {
            return res.status(400).json({
                message: "An exam for this class, section, and subject already exists.",
                success: false
            });
        }

        // If no existing exam, proceed to create the new exam
        const save = await ExamModel.create({
            date: date,
            time: time,
            examName: examName,
            className: className,
            subjectName: subjectName,
            sectionName: sectionName
        });

        if (save) {
            return res.status(200).json({
                message: "Exam added successfully",
                success: true
            });
        }

        return res.status(400).json({
            message: "Exam not added",
            success: false
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred",
            error: true,
            success: false,
        });
    }
};



const GradePost = async (req, res) => {
    try {
        console.log("body-exam", { ...req.body });

        const { totalMarks, obtainedMarks, rollNumber, date, examName, className, subjectName, sectionName, studentName } = req.body;

        // Find the student by both className and rollNumber
        const student = await studentModel.findOne({
           class:className,
           RollNo: rollNumber,
          section:sectionName
            
        });

        if (!student) {
            return res.status(400).json({
                message: "Student not found with the provided roll number and class",
                success: false
            });
        }

        // Create the grade record
        const save = await GradeModel.create({
            date: date,
            examName: examName,
            className: className,
            subjectName: subjectName,
            sectionName: sectionName,
            totalMarks: totalMarks,
            obtainedMarks: obtainedMarks,
            studentName: studentName, // or map the student's actual name if necessary
            studentId: student._id,  // Storing student's ID as a reference
            rollNumber: rollNumber  // Saving the roll number
        });

        if (save) {
            return res.status(200).json({
                message: "Grade added successfully",
                success: true
            });
        }

        return res.status(400).json({
            message: "Grade not added",
            success: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "An error occurred",
            error: true,
            success: false,
        });
    }
};







module.exports={
    fetchExamclass,
    ExamPost,
    GradePost
}