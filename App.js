require('dotenv').config();

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
// app.use(cors({
//     origin:process.env.FRONTEND_URL,
//     credentials:true
// }))
const frontendUrl = 'https://school-management-frontend-h560y7mli.vercel.app';

app.use(cors({
  origin: frontendUrl, // Only allow the specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const port=process.env.port||3000

app.use("/api",router)

app.listen(3000,()=>{
    console.log("app is running on port  3000")
})