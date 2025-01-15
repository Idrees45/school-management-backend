const signupModel= require("../Models/signupModel")
const classModel= require("../Models/classModel")
const SubjectModel= require("../Models/SubjectModel")
const sectionModel= require("../Models/Section")
const AttendenceModel= require("../Models/AttendencesheetModel")

const Noticeboard=require ("../Models/NoticeBoard")
const admin = require("firebase-admin");
const serviceAccount = require("../service.json");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const register= async(req,res)=>{

    try {
        const data= req.body
    const {password}= req.body
    const hashedpassword= await bcrypt.hash(password,10)

        if(!data){
            return res.json({message:"All fields required"})
        }
        const save= await signupModel.create({...data,

            password:hashedpassword
        })
        if(save){
            return res.status(200).json({
                message:"Register successfully",
                error:false,
                userdata:save
            })
        }
        return("user not saved")
    } catch (error) {
        console.log(error.message)
    }

}



const login= async(req,res)=>{

    try {
        const data= req.body
    const {password,email}= req.body
  
    if (!password || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const userfound= await signupModel.findOne({email})

    if (!userfound){
  return res.status(400).json({message:"user not found"})

    }

   const compared=  await bcrypt.compare(password,userfound.password)
if(!compared){
   return res.status(400).json({message:"Invalid credintials"})
}else{
const userdetail={
    id:userfound._id,
    email:userfound.email,
    role:userfound.role
}
const token= jwt.sign(userdetail,"123456",{ expiresIn: '9h' })
const tokenoption= {
    httpOnly:true,
    secure:true

  }
  return res.status(200).cookie("token", token, tokenoption).json({
    message: "Login successfully",
    data: token,
    Data:userfound,
    success: true,
    error: false
});

   
}
  


    } catch (error) {
        console.log("server error",error.message)
    }

}




const fetchuser= async(req,res)=>{

    try {
        const id= req.user.id
if(!id){
        return res.status(400).json({
            message:"Please login....",
            error:true,
            success:false
        })}

  const found= await signupModel.findOne({ _id: id })
  if(!found){
return res.status(400).json({message:"user not found"})
  }
  return res.status(200).json({message:"user found",
    Data:found
  })
   
} catch (error) {
        console.log("server error",error.message)
    }

}

///logout


const userlogout= async(req,res)=>{
    try {
        
        res.clearCookie("token")
        res.status(200).json({
            message:"logout successfully",
            error:false,
            success:true,
            data:[]
            })
    } catch (error) {
        res.json({
            message:error.message||error,
            error:true,
            success:false
            })
    }
}


// All users with role fetch  



const fetchAllUsers= async(req,res)=>{
    try {
        const id= req.user.id
        if(!id){
            return res.status(400).json({
                message:"Please login....",
                error:true,
                success:false
            })}

            if(req.user?.role!== "Admin"){
                // return  res.status(400).json({message:"Permission denied"})
                throw new Error("Permission denied")
            }
       const found=  await  signupModel.find({})
      
       if(found.length >0 ){
        return res.status(200).json({
            message:"All usr found",
            Data:found
        })
        
       }else{
        return res.status(404).json({
            message:"User not found",
          
        })
       }
     
    } catch (error) {
       res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
            })
    }
}









const fetchAlluserandAttendence= async(req,res)=>{
    try {
        const id= req.user.id
        if(!id){
            return res.status(400).json({
                message:"Please login....",
                error:true,
                success:false
            })}

            if(req.user?.role!== "Admin"){
                // return  res.status(400).json({message:"Permission denied"})
                throw new Error("Permission denied")
            }
       const found=  await  signupModel.find({})
       if(!found){
        return res.status(404).json({
            message:"User not found",
          
        })
       }
       const today = new Date();
       const startOfDay = new Date(today);
       startOfDay.setHours(0, 0, 0, 0);  // Start of today (00:00:00)
       
       const endOfDay = new Date(today);
       endOfDay.setHours(23, 59, 59, 999);  // End of today (23:59:59)
       
       const studentAttendance = await AttendenceModel.find({
         isPresent: true,
         date: {
           $gte: startOfDay,
           $lt: endOfDay
         }
       }).lean();
       
       console.log("Today's Attendance:", studentAttendance);
       
       

      if(studentAttendance){
        return res.status(200).json({
                    message:"All user found",
                    Data:found,
                    Attendce:studentAttendance
                })

      }
  
    //   return res.status(404).json({
    //     message:"User not found",
      
    // })
       
     
    } catch (error) {
       res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
            })
    }
}

// update-role/


const updaterole= async(req,res)=>{
    try {
        const id= req.user.id
        // console.log("Role", req.user.role)
        if(!id){
            return res.status(400).json({
                message:"Please login....",
                error:true,
                success:false
            })}

            if(req.user?.role!== "Admin"){
                // return  res.status(400).json({message:"Permission denied"})
                throw new Error("Permission denied")
            }

            const {userId,role}=req.body
         
       const update=  await  signupModel.findByIdAndUpdate(
        userId,                  // The ID of the user you want to update
        { role: role },      // The new role you want to set
        { new: true }           // Options: return the modified document
      );
       if(update){
        return res.status(200).json({
            message:"useupdateed successfully",
            Data:update
        })}
        return res.status(400).json({
            message:"user not update or found"})
           
         } catch (error) {
       res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
            })
    }
}



// ----- Add new classs logic------------


const Addclass= async(req,res)=>{

try {
    const {Grade,Teacher,id,section,subject}=req.body

  const subjectvalues =  subject.map((ele,index)=>{
        return ele.value
    })
    const sectionvalues = section.map((ele,index)=>{
        return ele.value
    })

const saved= await classModel.create({
    class:Grade,
    subject:subjectvalues,
    Teacher: Teacher[0].value,
    sections:sectionvalues
    

 
   
})
if(saved){
    // return res.status(200).json({
    //     message:"successfully Added new class",
    //     Data:saved
    // })
    for (const ele of sectionvalues) {
        const savedSection = await sectionModel.create({
          classId: saved._id,
          name: ele
        });}

 return res.status(200).json({
        message:"successfully Added new class",
        Data:saved
    })
}
return res.json({
    message:"class not created"
})
} catch (error) {
    res.status(500).json({
        message:error.message||error,
        error:true,
        success:false
        })
}

}
// ------Add new subject------------



const Addsubject= async(req,res)=>{

    try {
        
    const {subjectName,subjectType,subjectCode}=req.body
    const saved= await SubjectModel.create({
        subjectName:subjectName,
        subjectType: subjectType,
        subjectCode: subjectCode
    })
    if(saved){
        return res.status(200).json({
            message:"successfully Added new subject",
            Data:saved
        })
    }
    return res.json({
        message:"subect not created"
    })
    } catch (error) {
        res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
            })
    }
    
    }




    
// const NoticeBoard= async(req,res)=>{

//     try {
        
//     const saved= await Noticeboard.create({
//         ...req.body
//     })

//     if(saved){

//         return res.status(200).json({message:"notice save sucessfully",sucess:true})
//     }
    
//     return res.status(400).json({message:"notice not save",sucess:false})
// console.log("Notice",req.body)
//     } catch (error) {
//         res.status(500).json({
//             message:error.message||error,
//             error:true,
//             success:false
//             })
//     }
    
//     }


// const  NoticeBoard = async (req, res) => {
//     const { groupRecipients, individualRecipients, Notice } = req.body;
//   console.log(req.body)
//     try {
//       const notice = new Noticeboard({
//         notice: Notice,
//         recipients: groupRecipients || [], // Default to an empty array if null
//         individualRecipients: individualRecipients || [], // Default to an empty array if null
//       });
  
//       await notice.save();
//       res.status(201).json({ message: "Notice sent successfully!", success: true });
//     } catch (error) {
//       res.status(500).json({ message: error.message, success: false });
//     }
//   };
  






// const NoticeBoard = async (req, res) => {
//     const { groupRecipients, individualRecipients, Notice } = req.body;

//     try {
//         // Save notice to the database
//         const notice = new Noticeboard({
//             notice: Notice,
//             recipients: groupRecipients || [], // Default to an empty array if null
//             individualRecipients: individualRecipients || [], // Default to an empty array if null
//         });

//         await notice.save();

//         // Prepare notification message
//         const notificationMessage = {
//             notification: {
//                 title: "New Notice",
//                 body: Notice,
//             },
//             tokens: [], // Array to hold device tokens
//         };

//         // Fetch device tokens of recipients
//         if (groupRecipients && groupRecipients.length > 0) {
//             // Fetch group recipient tokens from database (Example: Teachers or Students group)
//             const groupTokens = await getDeviceTokensForGroup(groupRecipients);
//             notificationMessage.tokens.push(...groupTokens);
//         }

//         if (individualRecipients && individualRecipients.length > 0) {
//             // Fetch individual recipient tokens from database
//             const individualTokens = await getDeviceTokensForIndividuals(individualRecipients);
//             notificationMessage.tokens.push(...individualTokens);
//         }

//         // Send notifications via FCM
//         if (notificationMessage.tokens.length > 0) {
//             const response = await admin.messaging().sendMulticast(notificationMessage);
//             console.log("Notification Response:", response);
//         }

//         res.status(201).json({ message: "Notice sent successfully!", success: true });
//     } catch (error) {
//         console.error("Error in NoticeBoard:", error);
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

// // Example helper functions to fetch device tokens
// const getDeviceTokensForGroup = async (groupRecipients) => {
//     // Query database for device tokens of all members in the group
//     // Example:
//     const groupUsers = await UserModel.find({ group: { $in: groupRecipients } });
//     return groupUsers.map((user) => user.deviceToken).filter(Boolean);
// };

// const getDeviceTokensForIndividuals = async (individualRecipients) => {
//     // Query database for device tokens of individual recipients
//     const individualUsers = await UserModel.find({ _id: { $in: individualRecipients } });
//     return individualUsers.map((user) => user.deviceToken).filter(Boolean);
// };




// const admin = require("firebase-admin");
// const serviceAccount = require("./path-to-your-service-account-file.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const { groupRecipients, individualRecipients, Notice } = req.body;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db= admin.firestore();
const NoticeBoard = async (req, res) => {
  const { groupRecipients, individualRecipients, Notice } = req.body;
  
  try {
    // Prepare the data for the notice document
    const noticeData = {
      message: Notice,
      recipients: {
        group: groupRecipients || [],
        individual: individualRecipients || []
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the notice to Firestore
    await db.collection('notices').add(noticeData);

    res.status(201).json({ message: "Notice sent successfully!" });
  } catch (error) {
    console.error("Error sending notice: ", error);
    res.status(500).json({ message: "Failed to send notice.", error: error.message });
  }
};




    
    // const getnotice = async (req, res) => {
    //     try {
    //       const id = req.user.id; // Assuming `req.user` contains the authenticated user's data
    //       console.log("Notice_id:", id);
      
    //       // Find notices where the current user's ID is in the recipients array
    //       const found = await Noticeboard.find({
    //         recipients: { $in: [id] }
    //       });
      
    //       if (found.length > 0) {
    //         return res.status(200).json({
    //           message: "Notice(s) found successfully",
    //           success: true,
    //           data: found.map(notice => notice.Notice), // Extracting Notice field from the results
    //         });
    //       }
      
    //       return res.status(404).json({
    //         message: "No notices found for this user",
    //         success: false,
    //       });
    //     } catch (error) {
    //       res.status(500).json({
    //         message: error.message || "Server Error",
    //         error: true,
    //         success: false,
    //       });
    //     }
    //   };
      

    // const getnotice = async (req, res) => {
    //     try {
    //       const userId = req.user.id; // Assuming req.user contains the authenticated user's data
      
    //       console.log("Notice_id:", userId);
      
    //       // Find notices where the user's ID is in either recipients or individualRecipients
    //       const notices = await Noticeboard.find({
    //         $or: [
    //           { recipients: { $in: [userId] } },
    //           { individualRecipients: { $in: [userId] } },
    //         ],
    //       })
    //         .sort({ createdAt: -1 }) // Sort by most recent
    //         .select('-__v'); // Exclude the __v field (optional)
      
    //       if (notices.length > 0) {
    //         return res.status(200).json({
    //           message: "Notices found successfully",
    //           success: true,
    //           data: notices, // Returning the entire notice object
    //         });
    //       }
      
    //       return res.status(404).json({
    //         message: "No notices found for this user",
    //         success: false,
    //       });
    //     } catch (error) {
    //       res.status(500).json({
    //         message: error.message || "Server Error",
    //         error: true,
    //         success: false,
    //       });
    //     }
    //   };
      
      


    const getnotice = async (req, res) => {
        try {
          const userId = req.user.id; // Get the logged-in user's ID
      
          console.log("Notice_id:", userId);
      
          // Query for notices where the user is either in recipients or individualRecipients
          const notices = await Noticeboard.find({
            $or: [
              { recipients: { $in: [userId] } },
              { individualRecipients: { $in: [userId] } },
            ],
          })
            .sort({ createdAt: -1 }) // Sort by the most recent notices
            .select('notice createdAt'); // Include only notice and createdAt fields
      
          if (notices.length > 0) {
            return res.status(200).json({
              message: "Notices found successfully",
              success: true,
              data: notices.map(({ notice, createdAt }) => ({
                notice,
                createdAt,
              })), // Return only the required fields
            });
          }
      
          return res.status(404).json({
            message: "No notices found for this user",
            success: false,
          });
        } catch (error) {
          res.status(500).json({
            message: error.message || "Server Error",
            error: true,
            success: false,
          });
        }
      };
      


module.exports={
    register,
    login,
    fetchuser,
    userlogout,
    fetchAllUsers,
    updaterole,
    Addclass,
    Addsubject,
    NoticeBoard,
    getnotice,
    fetchAlluserandAttendence
}