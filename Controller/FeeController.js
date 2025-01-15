// feeSubmission


const signupModel= require("../Models/signupModel")
const classModel= require("../Models/classModel")
const SubjectModel= require("../Models/SubjectModel")
const sectionModel= require("../Models/Section")
const TeacherModel= require("../Models/TeacherModel")
const FeeModel= require("../Models/feeModel")
const studentModel= require("../Models/StudentModel")


const classdata= async(req,res)=>{

    try {
console.log(req.body)



  const found = await  classModel.find({})
        
if(found){
    return res.status(200).json({
        message:"class data successfully found",
        succes:true,
        class:found
    })
}
return res.status(400).json({
    message:"classs data not found",
    succes:false
})
    } catch (error) {
        // Handle any errors that occur during the database queries
        res.status(500).json({
            message: error.message || "An error occurred",
            error: true,
            success: false,
        });
    }
}




// const feeSubmission= async(req,res)=>{

//     try {
// console.log(req.body)
// const {selectedUser,feeDetails}=req.body
// const date = new Date(req.body.date);

// // if (isNaN(date)) {
// //   return res.status(400).json({ error: 'Invalid dateOfPayment provided.' });
// // }

// // Extract month name and year
// // const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date); // e.g., "November"
// // const year = date.getFullYear();

//       const pay=  await FeeModel.create({
//          amount:feeDetails.amount,
//          date:feeDetails.date,
//          remarks:feeDetails.remarks,
//         studentId:selectedUser._id,
//         class:selectedUser.class,
//         section:selectedUser.section,

//         // month:month,
//         // year:year,
//        })
        
// if(pay){
//     return res.status(200).json({
//         message:"Fee paid successfully",
//         succes:true
//     })
// }
// return res.status(400).json({
//     message:"Fee not paid",
//     succes:false
// })
//     } catch (error) {
//         // Handle any errors that occur during the database queries
//         res.status(500).json({
//             message: error.message || "An error occurred",
//             error: true,
//             success: false,
//         });
//     }
// }



const feeSubmission = async (req, res) => {
    try {
        console.log(req.body);
        const { selectedUser, feeDetails } = req.body;
        const date = new Date(feeDetails.date);

        if (isNaN(date)) {
            return res.status(400).json({ error: 'Invalid dateOfPayment provided.' });
        }

        // Extract month and year from the date
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date); // e.g., "November"
        const year = date.getFullYear();

        // Declare feeRecord variable to be accessible in the entire function
        let feeRecord;

        // Check if a fee record already exists for this student in the current month
        feeRecord = await FeeModel.findOne({
            studentId: selectedUser._id,
            month: month,
            year: year,
        });

        if (feeRecord) {
            // Check if the fee has already been paid for the current month
            if (feeRecord.status === "paid") {
                return res.status(400).json({ message: 'Fee already paid this month' });
            }
        } else {
            // If no record exists for this month, create a new one for the month
            feeRecord = await FeeModel.create({
                studentId: selectedUser._id,
                month: month,
                year: year,
                amount: 0,  // Set initial fee amount to 0 or set the base amount if you want
                status: 'unpaid',  // Default status is unpaid
                class: selectedUser.class,
                section: selectedUser.section,
            });

            if (!feeRecord) {
                return res.status(400).json({ message: 'Failed to create fee record.' });
            }
        }

        // Now update the fee status for the current month when payment is made
        const pay = await FeeModel.updateOne(
            { _id: feeRecord._id },  // Use the correct feeRecord's ID (either existing or newly created)
            {
                amount: feeDetails.amount,
                date: feeDetails.date,
                remarks: feeDetails.remarks,
                studentId: selectedUser._id,
                class: selectedUser.class,
                section: selectedUser.section,
                month: month,
                year: year,
                status: 'paid',  // Set status to paid
            }
        );

        if (pay.modifiedCount > 0) {
            return res.status(200).json({
                message: 'Fee paid successfully',
                success: true,
            });
        }

        return res.status(400).json({
            message: 'Fee not paid',
            success: false,
        });
    } catch (error) {
        // Handle any errors that occur during the database queries
        res.status(500).json({
            message: error.message || 'An error occurred',
            error: true,
            success: false,
        });
    }
};




// const getFeeStatusFromAdmissionMonth = async (studentId, year, admissionMonth) => {
//     try {
//         // Fetch all fee records for the student in the given year
//         const feeRecords = await FeeModel.find({
//             studentId: studentId,
//             year: year,
//         }).sort({ month: 1 }); // Sort by month to get records in chronological order

//         // Define all months of the year
//         const allMonths = [
//             'January', 'February', 'March', 'April', 'May', 'June', 
//             'July', 'August', 'September', 'October', 'November', 'December'
//         ];

//         // Create an object to store the fee status for each month
//         const feeStatus = {};

//         // Start tracking from the admission month onward
//         const startIndex = allMonths.indexOf(admissionMonth);  // Get the index of the admission month

//         // Iterate over all months starting from the admission month
//         allMonths.slice(startIndex).forEach((month) => {
//             const monthRecord = feeRecords.find(record => record.month === month);

//             if (monthRecord) {
//                 // If a record exists, use the status from the fee record
//                 feeStatus[month] = monthRecord.status || 'unpaid';
//             } else {
//                 // If no record exists, set the status to 'unpaid'
//                 feeStatus[month] = 'unpaid';
//             }
//         });

//         // Return the fee status for months starting from the admission month
//         return {
//             year: year,
//             feeStatus: feeStatus
//         };

//     } catch (error) {
//         console.error(error);
//         return { message: 'An error occurred while fetching fee status.' };
//     }
// };

// const getFeeStatusForMultipleStudents = async (req, res) => {
//     const { students } = req.body; // Expecting an array of objects: [{ studentId, admissionMonth, year }]

//     if (!students || !Array.isArray(students) || students.length === 0) {
//         return res.status(400).json({ message: 'Invalid input: students data is required.' });
//     }

//     try {
//         // Define all months of the year
//         const allMonths = [
//             'January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'
//         ];

//         const feeStatus = {}; // Object to store the fee status for each student

//         for (const student of students) {
//             const { studentId, admissionMonth, year } = student;

//             // Validate the required fields
//             if (!studentId || !admissionMonth || !year) {
//                 continue; // Skip this student if any data is missing
//             }

//             // Normalize `admissionMonth` to ensure case insensitivity
//             const normalizedAdmissionMonth = admissionMonth.charAt(0).toUpperCase() + admissionMonth.slice(1).toLowerCase();
//             const startIndex = allMonths.indexOf(normalizedAdmissionMonth);

//             if (startIndex === -1) {
//                 continue; // Skip if the admissionMonth is invalid
//             }

//             // Fetch the full details of the student, populate all necessary fields
//             const studentDetails = await studentModel.findById(studentId)
//                 .populate('RollNo') // Populate necessary fields like name and admissionDate
//                 .select('name admissionDate'); // Select only the necessary fields (you can add others if needed)

//             if (!studentDetails) {
//                 console.log(`Student not found for ID: ${studentId}`);
//                 continue; // Skip if student details are not found
//             }

//             // Fetch all fee records for the student in the given year
//             const studentFeeRecords = await FeeModel.find({
//                 studentId: studentId,
//                 year: year,
//             }).sort({ month: 1 }); // Sort by month

//             if (!studentFeeRecords) {
//                 console.log(`No fee records found for student ID: ${studentId} for year: ${year}`);
//             }

//             // Create an entry for the current student in the feeStatus object
//             feeStatus[studentId] = {
//                 studentDetails, // Add full student details
//                 feeStatus: {}   // Object to store monthly fee status
//             };

//             // Populate fee status for each month from the admission month onwards
//             allMonths.slice(startIndex).forEach((month) => {
//                 // Find the fee record for the given month
//                 const record = studentFeeRecords.find(record => record.month === month);

//                 // If a record exists, use its status, otherwise mark as 'unpaid'
//                 feeStatus[studentId].feeStatus[month] = record ? record.status || 'unpaid' : 'unpaid';
//             });
//         }

//         // Send the fee status for all students as a response, including full student details
//         res.status(200).json(feeStatus);

//     } catch (error) {
//         // Log the error for debugging and send a generic error response
//         console.error("Error in getFeeStatusForMultipleStudents:", error);
//         res.status(500).json({ message: 'An error occurred while fetching fee status for multiple students.' });
//     }
// };


const getFeeStatusForMultipleStudents = async (req, res) => {
    const { students } = req.body; // Expecting an array of objects: [{ studentId, admissionMonth, year }]

    if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: 'Invalid input: students data is required.' });
    }

    try {
        // Define all months of the year
        const allMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const feeStatus = {}; // Object to store the fee status for each student

        for (const student of students) {
            const { studentId, admissionMonth, year } = student;

            // Validate the required fields
            if (!studentId || !admissionMonth || !year) {
                continue; // Skip this student if any data is missing
            }

            // Normalize `admissionMonth` to ensure case insensitivity
            const normalizedAdmissionMonth = admissionMonth.charAt(0).toUpperCase() + admissionMonth.slice(1).toLowerCase();
            const startIndex = allMonths.indexOf(normalizedAdmissionMonth);

            if (startIndex === -1) {
                continue; // Skip if the admissionMonth is invalid
            }

            // Fetch the full student details
            const studentDetails = await studentModel.findById(studentId)
                .populate('RollNo')
                .select('name admissionDate'); // Populate necessary fields

            if (!studentDetails) {
                console.log(`Student not found for ID: ${studentId}`);
                continue; // Skip if student details are not found
            }

            // Fetch all fee records for the student in the given year
            const studentFeeRecords = await FeeModel.find({
                studentId: studentId,
                year: year,
            }).sort({ month: 1 }); // Sort by month

            // Create an entry for the current student in the feeStatus object
            feeStatus[studentId] = {
                studentDetails, // Add full student details
                feeStatus: {}   // Object to store monthly fee status
            };

            // Populate fee status for each month from the admission month onwards
            allMonths.slice(startIndex).forEach((month) => {
                // Find the fee record for the given month
                const record = studentFeeRecords.find(record => record.month === month);

                // If a record exists, use its status, otherwise mark as 'unpaid'
                feeStatus[studentId].feeStatus[month] = record ? record.status || 'unpaid' : null; // Set to null if no fee record
            });
        }

        // Send the fee status for all students as a response, including full student details
        res.status(200).json(feeStatus);

    } catch (error) {
        // Log the error for debugging and send a generic error response
        console.error("Error in getFeeStatusForMultipleStudents:", error);
        res.status(500).json({ message: 'An error occurred while fetching fee status for multiple students.' });
    }
};


const feecollection = async (req, res) => {
    try {
      const { month, year } = req.query;
  console.log("quara",req.query)
      // Ensure the month is converted to the correct zero-based index for comparison (e.g., January = 0)
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  
      // Start and end of the month in UTC
      const startDate = new Date(Date.UTC(year, monthIndex, 1)); // Start of the month (UTC)
      const endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)); // End of the month (UTC)
  
    //   console.log("Start Date:", startDate);
    //   console.log("End Date:", endDate);
  
      // Use `find` first to check if data matches the query
      const feeDataCheck = await FeeModel.find({
        month: month, // Match the exact month
        year: year, // Match the exact year
        status: 'paid', // Only paid records
        date: { $gte: startDate, $lte: endDate }, // Date range match
      });
  

  
      // Proceed with aggregation if `find` returns data correctly
      const feeData = await FeeModel.aggregate([
        {
          $match: {
            month: month, // Match the exact month
            year: year, // Match the exact year
            status: 'paid', // Only paid records
            date: { $gte: startDate, $lte: endDate }, // Date range match
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$date" }, // Group by day of the month
            totalAmount: { $sum: "$amount" }, // Sum the amount for each day
          },
        },
        {
          $sort: { _id: 1 }, // Sort by day of the month
        },
      ]);
  
      // If no data is found after aggregation, send the found data (if any)
      if (feeData.length === 0) {
        return res.json(feeDataCheck); // Return feeDataCheck if aggregation results in no data
      }
  
      // Send the aggregated data if found
      res.json(feeData);
    } catch (error) {
      console.error("Error fetching fee collection:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  

module.exports={
    feeSubmission,
    classdata,
    // getFeeStatusFromAdmissionMonth,
    getFeeStatusForMultipleStudents,
    feecollection
}




