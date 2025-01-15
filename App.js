const express= require("express")
const app= express()
const DB= require("./db")

DB()
const cors= require("cors")
const router= require("./router")
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser());
// const admin = require("firebase-admin");
// const serviceAccount = require("./service.json");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api",router)





app.listen(3000,()=>{
    console.log("app is running on port  3000")
})