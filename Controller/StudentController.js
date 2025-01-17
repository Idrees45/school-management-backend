
const userModel=  require ("../Models/signupModel")
const studentModel= require("../Models/StudentModel")
const FeeModel= require("../Models/feeModel")
const axios= require("axios")
const bcrypt = require('bcrypt');
const feeModel = require("../Models/feeModel");
const classModel= require("../Models/classModel")
const gradeModel= require("../Models/GardeModel")
const attdenceModel= require("../Models/AttendencesheetModel")
const generator = require('generate-password');
const Emailsender= require ("../utilities/email")
require('dotenv').config();

const mongoose = require('mongoose');
const Register = async (req, res) => {
  try {
    const randompassword = generator.generate({
      length: 10,
      numbers: true
    });
   const hashpassword=  await bcrypt.hash(randompassword,10)
      const { email, firstName, ...rest } = req.body;

      // Create User
      console.log(hashpassword)
      const savedUser = await userModel.create({ email, name: firstName ,password:hashpassword});
      if (!savedUser) {
          return res.status(500).json({ message: 'Failed to save user.' });
      }

      // Create Student Details
      const studentDetails = await studentModel.create([{
          // userid: savedUser[0]._id,
          userid: savedUser._id, 
          imgpath: req.file.path, // Cloudinary URL
          parentInfo: { ...rest },
          ...rest,
      }]);
      if (!studentDetails) {
          return res.status(500).json({ message: 'Failed to save student details.' });
      }

      // Create Fee Record
      const currentDate = new Date();
      const feeData = await FeeModel.create([{
          studentId: studentDetails[0]._id,
          month: currentDate.toLocaleString('default', { month: 'long' }),
          year: currentDate.getFullYear(),
          amount: 0,
          status: 'unpaid',
      }]);
      if (!feeData) {
          return res.status(500).json({ message: 'Failed to save fee data.' });
      }

          Emailsender(email,randompassword)
      return res.status(200).json({
          message: 'User successfully registered.',
          data: savedUser[0],
      });
  } catch (error) {
      return res.status(500).json({
          message: error.message || 'An error occurred while processing the request.',
      });
  }
};






const fetchstudents = async (req, res) => {
    try {
        // const found = await studentModel.find({ role: "Student" 
         
        // }, "-password");
                const found = await studentModel.find({}).populate("userid");


        if (found && found.length > 0) {  // Check if students are found and non-empty
            return res.status(200).json({
                message: "student found",
                Data: found
            });
        }

        // Only executed if no students are found
        return res.status(404).json({
            message: "student not found"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message || error });
    }
};


const SMSstudent = async (req, res) => {
    try {
      const { message, phoneNumbers } = req.body;
  
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and should be a non-empty string' });
      }
  
      if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        return res.status(400).json({ error: 'Phone numbers are required and should be an array' });
      }
  
      const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY; 
    //   const senderNumber = '03054464483'; // Replace with your actual sender number
    const senderNumber = "03054464483"; 
    const staticNumber = "+923054464483"; 
      // Prepare data for sending
      const postData = {
        messages: phoneNumbers.map((phone) => ({
        //   destinations: [{ to: phone }],
        
        // destinations: [{"to":"+923427433897"}],
        destinations: [{ "to":staticNumber }],
        
        //   from: senderNumber,
        from: senderNumber,
        // from: "447491163443",
          text: message,
        })),
      };
  
      const response = await axios.post(
        'https://lqxyr2.api.infobip.com/sms/2/text/advanced',
        postData,
        {
          headers: {
        //     'Authorization': `App ${INFOBIP_API_KEY}`,
        'Authorization': `App ${INFOBIP_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      console.log('Infobip response:', response.data); // Log response data for debugging
      const messageDetails = response.data.messages[0]; // Assuming you're sending one message
console.log('Message ID:', messageDetails.messageId);
console.log('Message status:', messageDetails.status);  // Log the status object for detailed info
console.log('Message sent to:', messageDetails.to);

  
      if (response.status === 200 || response.status === 202) { // Check if the response is successful
        return res.status(200).json({ success: 'SMS sent successfully!' });
      } else {
        return res.status(500).json({ error: 'Failed to send SMS', details: response.data });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return res.status(500).json({ error: 'Error sending SMS', details: error.message });
    }
  };



//   const fetchGeneder = async (req, res) => {
//     try {
//         // const found = await studentModel.find({ role: "Student" 
         
//         // }, "-password");
//                 const found = await studentModel.findOne({});


//         if (found && found.length > 0) {  // Check if students are found and non-empty
//             return res.status(200).json({
//                 message: "student Geneder found",
//                 Gender: found
//             });
//         }

//         // Only executed if no students are found
//         return res.status(404).json({
//             message: "studentGeneder not found"
//         });

//     } catch (error) {
//         return res.status(500).json({ message: error.message || error });
//     }
// };


// Express route handler or function
const fetchGeneder = async (req, res) => {
  try {
    // Aggregate to group students by gender and count them
    const genderDistribution = await studentModel.aggregate([
      {
        $addFields: {
          Gender: { $trim: { input: { $toLower: "$Gender" } } }, // Normalize the gender field
        },
      },
      {
        $group: {
          _id: "$Gender",  // Group by normalized Gender
          totalStudents: { $sum: 1 },  // Count number of students in each gender
        },
      },
    ]);

    // Check if any gender distribution data was found
    if (genderDistribution.length > 0) {
      const genderCounts = {
        Male: 0,
        Female: 0,
        Other: 0,
      };

      // Fill the genderCounts object with the actual counts
      genderDistribution.forEach(item => {
        if (item._id === "male") {
          genderCounts.Male = item.totalStudents;
          console.log("MaleGender", genderCounts.Male);
        } else if (item._id === "female") {
          genderCounts.Female = item.totalStudents;
          console.log("FemaleGender", genderCounts.Female);
        } else {
          // Set the total count for 'Other'
          genderCounts.Other = item.totalStudents;
          console.log("OtherGender", genderCounts.Other);
        }
      });

      // Send the data to the front end
      return res.status(200).json({
        message: "Gender distribution fetched successfully",
        genderCounts,
      });
    } else {
      return res.status(404).json({ message: "No students found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching gender distribution", error });
  }
};




const StudentPromtion= async(req, res) => {
  try {

      const classdata=   await classModel.find({})
if(classdata){
  return res.status(200).json({
    message:"class data found sucess fully",
    Data:classdata
  })
}

return res.status(400).json({
  message:"Class Data not found"
})

  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
};




const Promtionsections = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from route parameters

    if (!id) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    // Query the database for sections of the specified class
    const classData = await classModel.findById(id).select("sections");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.status(200).json({
      message: "Sections retrieved successfully",
      Data: classData.sections, // Return only the sections field
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({
      message: error.message || "An error occurred while fetching sections",
    });
  }
};


const fetchstudentsforsection = async (req, res) => {
  try {
    const { class: className, section } = req.params;
console.log("classandsection for studens",className )
    // Find students that match the class and section
    const students = await studentModel.find({ class: className, section: section });

    // If students found, return them, otherwise return a message
    if (students.length > 0) {
      res.json({ Data: students });
    } else {
      res.status(404).json({ message: "No students found for this class and section." });
    }
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




// const updatestudent= async(req,res)=>{

//   const { students, toClass, toSection } = req.body;

//   if (!students || !Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({ error: 'No students selected for promotion.' });
//   }

//   if (!toClass || !toSection) {
//     return res.status(400).json({ error: 'Target class and section are required.' });
//   }

//   try {
//     // Update students in the database
//     const result = await studentModel.updateMany(
//       { _id: { $in: students } },
//       { $set: { class: toClass, section: toSection } }
//     );

//     if (result.modifiedCount > 0) {
//         await  gradeModel.deleteMany({studentId:{ $in: students }})
//       res.status(200).json({ message: 'Students promoted successfully.' });
//     } else {
//       res.status(404).json({ error: 'No students found to promote.' });
//     }
//   } catch (error) {
//     console.error('Error promoting students:', error);
//     res.status(500).json({ error: 'An error occurred while promoting students.',
//       message: error.message
//      });
//   }

// }


// const updatestudent = async (req, res) => {
//   const { students, toClass, toSection } = req.body;

//   // Validate input
//   if (!students || !Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({ error: 'No students selected for promotion.' });
//   }

//   if (!toClass || !toSection) {
//     return res.status(400).json({ error: 'Target class and section are required.' });
//   }

//   try {
//     // Update students' class and section in the database
//     const result = await studentModel.updateMany(
//       { _id: { $in: students } },
//       { $set: { class: toClass, section: toSection } }
//     );

//     // Check if any students were updated
//     if (result.modifiedCount > 0) {
//       // Delete grades for the promoted students
//       const gradeDeleted = await gradeModel.deleteMany({ studentId: { $in: students } });

//       if (gradeDeleted) {
//         // Delete attendance for the promoted students
//         const attendanceDeleted = await attdenceModel.deleteMany({ student: { $in: students } });
//         if (attendanceDeleted) {
//           res.status(200).json({ message: 'Students promoted successfully.' });
//         } else {
//           res.status(500).json({ error: 'Failed to delete attendance records.' });
//         }
//       } else {
//         res.status(500).json({ error: 'Failed to delete grade records.' });
//       }
//     } else {
//       res.status(404).json({ error: 'No students found to promote.' });
//     }
//   } catch (error) {
//     console.error('Error promoting students:', error);
//     res.status(500).json({
//       error: 'An error occurred while promoting students.',
//       message: error.message,
//     });
//   }
// };

const moment = require('moment');

const updatestudent = async (req, res) => {
  const { students, toClass, toSection } = req.body;

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'No students selected for promotion.' });
  }

  if (!toClass || !toSection) {
    return res.status(400).json({ error: 'Target class and section are required.' });
  }

  try {
    const currentMonth = moment(); // Get the current date

    for (const studentId of students) {
      // Fetch student admission date
      const student = await studentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: `Student with ID ${studentId} not found.` });
      }

      const admissionDate = moment(student.admissionDate);

      // Ensure the admission date is not in the future
      if (admissionDate.isAfter(currentMonth)) {
        return res.status(400).json({ error: `Invalid admission date for student ${studentId}.` });
      }

      // Calculate the number of months between the admission date and the current date
      const monthsToCheck = currentMonth.diff(admissionDate, 'months');

      // Loop through each month from the admission date to the current month
      for (let i = 0; i <= monthsToCheck; i++) {
        const monthToCheck = moment(admissionDate).add(i, 'months');

        // Check if the fee is paid for that month
        const feeStatus = await feeModel.findOne({
          studentId,
          month: monthToCheck.format('MMMM'), // e.g., "December"
          year: monthToCheck.year(), // e.g., 2024
          status: 'paid',
        });

        // If the fee for this month is missing (not paid), stop and don't promote
        if (!feeStatus) {
          return res.status(400).json({
            error: `Fee for ${monthToCheck.format('MMMM YYYY')} is missing or not paid.`,
          });
        }
      }

      // Check if the fee for the current month is already paid
      const currentFeeRecord = await feeModel.findOne({
        studentId,
        month: currentMonth.format('MMMM'),
        year: currentMonth.year(),
      });

      if (currentFeeRecord && currentFeeRecord.status === 'paid') {
        // Archive the fee record instead of creating a new one
        await feeModel.updateOne(
          { _id: currentFeeRecord._id },
          { $set: { isArchived: true } }
        );
      } else {
        // Create a new fee record for the promoted student if not paid
    // Example new fee amount
        await feeModel.create({
          studentId,
          month: currentMonth.format('MMMM'),
          year: currentMonth.year(),
          amount: 0,
          status: 'unpaid',
          class: toClass,
          section: toSection,
          isArchived: false,
        });
      }

      // Promote the student
      await studentModel.findByIdAndUpdate(studentId, {
        class: toClass,
        section: toSection,
      });

      console.log(`Student ${studentId} promoted successfully.`);
    }

    res.status(200).json({ message: 'Students promoted successfully with fees verified.' });
  } catch (error) {
    console.error('Error promoting students:', error);
    res.status(500).json({
      error: 'An error occurred while promoting students.',
      message: error.message,
    });
  }
};




module.exports={
    Register,
    fetchstudents,
    SMSstudent,
    fetchGeneder,
    StudentPromtion,
    Promtionsections,
    fetchstudentsforsection ,
    updatestudent
}