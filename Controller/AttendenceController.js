
const userModel=  require ("../Models/signupModel")
const studentModel= require("../Models/StudentModel")
const classModel= require("../Models/classModel")

const AttendenceModel= require("../Models/AttendencesheetModel")


    
    const Atedence=async(req,res)=>{
        try {
        
            
            const classes = await classModel.find({});
            if (classes) {
               
               const studentdetail= await  studentModel.find({}).populate("userid")
               if(studentdetail){
                    return res.status(200).json({
                message: " classes found",
                success: true,
                classData:classes,
                studentData:studentdetail
            });
               }else{
                return res.status(404).json({
                    message: "No studentdata found",
                    success: false,
                });
               }
            }
 
            return res.status(404).json({
                message: "No classes found",
                success: false,
            });
    

        
        } catch (error) {
            return res.status(500).json({message:error.message||error})
        }
        
        }

      
        // const   Atedencesave = async (req, res) => {
        //     try {
        //       const { selectedSection, attendance, selectedClass, selectedDate } = req.body;


        //       const existingAttendance = await AttendenceModel.findOne({
        //         class: selectedClass,
        //         section: selectedSection,
        //         date: selectedDate,
        //       });
          
        //       if (existingAttendance) {
        //         return res.status(400).json({
        //           message: "Attendance for this day, class, and section already exists.",
        //           success: false,
        //         });
        //       }

              


          
        //       // Convert the 'attendance' object to an array of attendance records
        //       const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
        //         student: studentId, // Student ID
        //         class: selectedClass, // Class name (string)
        //         section: selectedSection, // Section name (string)
        //         date: selectedDate, // Date of attendance
        //         isPresent, // Whether the student is present
        //       }));
          
        //       // Insert many records at once
        //       const saved = await AttendenceModel.insertMany(attendanceRecords);
          
        //       if (saved) {
        //         return res.status(200).json({
        //           message: "Attendance saved successfully",
        //           success: true,
        //           data: saved,
        //         });
        //       }
          
        //       return res.status(400).json({
        //         message: "Attendance not saved",
        //         success: false,
        //       });
        //     } catch (error) {
        //       return res.status(500).json({ message: error.message || error });
        //     }
        //   };
          
        

        const Atedencesave = async (req, res) => {
          try {
            const { selectedSection, attendance, selectedClass, selectedDate } = req.body;
        
            // Parse the selected date and compare only the date part
            const moment = require('moment');
            const selectedDateFormatted = moment(selectedDate).startOf('day').toDate();
        
            // Check if attendance for the day, class, and section already exists
            const existingAttendance = await AttendenceModel.findOne({
              class: selectedClass,
              section: selectedSection,
              date: { $gte: selectedDateFormatted, $lt: moment(selectedDateFormatted).add(1, 'days').toDate() },
            });
        
            if (existingAttendance) {
              return res.status(400).json({
                message: "Attendance for this day, class, and section already exists.",
                success: false,
              });
            }
        
            // Convert the 'attendance' object to an array of attendance records
            const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
              student: studentId, // Student ID
              class: selectedClass, // Class name (string)
              section: selectedSection, // Section name (string)
              date: selectedDate, // Date of attendance
              isPresent, // Whether the student is present
            }));
        
            // Insert many records at once
            const saved = await AttendenceModel.insertMany(attendanceRecords);
        
            if (saved) {
              return res.status(200).json({
                message: "Attendance saved successfully",
                success: true,
                data: saved,
              });
            }
        
            return res.status(400).json({
              message: "Attendance not saved",
              success: false,
            });
          } catch (error) {
            console.error("Error in attendance save:", error);
            return res.status(500).json({ message: error.message || error });
          }
        };
        




          // const fetchAtedence=async(req,res)=>{
          //   try {
            
                
          //       const Attendancesheet = await AttendenceModel.find({}).populate("student");
          //       if ( Attendancesheet) {
                   
                 
          //     return res.status(200).json({   message: " Attendence sheet found",
          //         success: true,
          //         Data:Attendancesheet
          //     })
                   
          //       }
     
          //       return res.status(404).json({
          //           message: "No sheet found",
          //           success: false,
          //       });
        
    
            
          //   } catch (error) {
          //       return res.status(500).json({message:error.message||error})
          //   }
            
          //   }

          const fetchAtedence = async (req, res) => {
            try {
              const { class: classFilter, section: sectionFilter, date: dateFilter } = req.body;
          
              let filter = {};
          
              // Check if class and section filters are provided
              if (classFilter) filter.class = classFilter;
              if (sectionFilter) filter.section = sectionFilter;
          
              // If date is provided, normalize it to YYYY-MM-DD for comparison
              if (dateFilter) {
                // Normalize the date to start of the day (no time portion) to handle date-only comparison
                const startDate = new Date(dateFilter);
                startDate.setHours(0, 0, 0, 0);  // Set the time to midnight to strip time
          
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);  // Add one day to get the end of the day
          
                filter.date = { $gte: startDate, $lt: endDate };  // Filter for records within that date range
              }
          
              const Attendancesheet = await AttendenceModel.find(filter)
                .populate({
                  path: "student",
                  select: "firstName lastName class section imgpath"
                })
                .select("class section date isPresent student");
          
              if (Attendancesheet.length > 0) {
                return res.status(200).json({
                  message: "Attendance sheet found",
                  success: true,
                  Data: Attendancesheet
                });
              }
          
              return res.status(404).json({
                message: "No sheet found",
                success: false,
              });
            } catch (error) {
              return res.status(500).json({ message: error.message || error });
            }
          };
          

        module.exports={

            Atedence,
            Atedencesave,
            fetchAtedence
        }