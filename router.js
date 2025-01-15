const express= require("express")
const { register, login, fetchuser, userlogout, fetchAllUsers, updaterole, Addclass, Addsubject, NoticeBoard, getnotice, fetchAlluserandAttendence, } = require("./Controller/signup")
const authtoken = require("./middelware/auth")
const { Register, fetchstudents, SMSstudent, fetchGeneder, StudentPromtion, Promtionsections, fetchstudentsforsection, updatestudent } = require("./Controller/StudentController")
const { Teacherregister, teacherhub, teacherfetch, ClassTiming } = require("./Controller/TeacherController")
const { fetchclass } = require("./Controller/classcontroller")
const upload =require ("./middelware/Multer")
const { Atedence, Atedencesave, fetchAtedence } = require("./Controller/AttendenceController")
const { feeSubmission, classdata, getFeeStatusForMultipleStudents, feecollection } = require("./Controller/FeeController")
const { fetchExamclass, ExamPost, GradePost } = require("./Controller/ExamContoller")
// const { getAnalyticsData, getTokens, getAuthUrl } = require("./Controller/Analytics")



const router= express.Router()
// Step 2: Create a route for initiating OAuth
// router.get('/auth/google', (req, res) => {
//     getAuthUrl();
//     res.send('Visit the console to authorize therouter!');
//   });
  
//   // Step 3: Create a route for handling the OAuth callback and getting tokens
//  router.get('/auth/google/callback', getTokens);
  
//   // Step 4: Create a route to fetch analytics data
//  router.get('/analytics/data', getAnalyticsData);

router.post("/signup",register)
router.post("/login",login)
router.get("/fetchuser",authtoken,fetchuser)
router.delete("/logout",authtoken,userlogout)
router.get("/all-user",authtoken,fetchAllUsers)
router.put("/update-role",authtoken,updaterole)
router.post("/class-add",Addclass)
router.post("/Add-subject",Addsubject)
router.get("/fetchclass",fetchclass)
router.post("/send-notice",NoticeBoard)
router.get("/get-Notice",authtoken,getnotice)
//Dashboard
router.get("/get-Alluser-Attendence",authtoken,fetchAlluserandAttendence)

// --------StdentRoutes---------
router.post("/register",upload.single('image'),Register)
router.get("/all-students",fetchstudents)
router.post("/send-sms",SMSstudent)
router.get("/student-Geneder",fetchGeneder)
router.get("/student-promotion",StudentPromtion)
router.get("/class-sections/:id",Promtionsections)
router.get("/students/:class/:section",fetchstudentsforsection)
router.put("/promote-students",updatestudent)
// ---------TeacherRoute--------
router.post("/Teacherpost",Teacherregister)
router.post("/Teacher-hub",teacherhub)
router.get("/fetch-tracher",teacherfetch)
router.get("/class-timing",ClassTiming)
// ------AttendceModule------------
router.get("/Atedenceform",Atedence)
router.post("/Atedencesave",Atedencesave)
router.post("/fetchAttendence",fetchAtedence)
// ---------------FeeModules-----------------
router.post("/feeSubmission",feeSubmission)
router.get("/classdata",classdata)
router.post("/fee-status",getFeeStatusForMultipleStudents)
router.get("/fee-collection",feecollection)
// --------------ExamModules-----------------
router.get("/Exam-class",fetchExamclass)
router.post("/ExamPost",ExamPost)
router.post("/Add-Grade",GradePost)

module.exports=router
