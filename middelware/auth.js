const jwt = require('jsonwebtoken');
require('dotenv').config();
const authtoken= async(req,res,next)=>{
    try {
        const token=req.cookies?.token||req.header
        if(!token){
            return res.status(400).json({
                message:"Please login....",
                error:true,
                success:false
            })
        }s
        // console.log("token ha ?",token)
        jwt.verify(token,process.env.TOKEN,(err,decode)=>{
          
            // console.log("decodetoken",decode)
            if(err){
                console.log("errr",err)
            }
            // req.user.id=decode?._id
           
            req.user = req.user || {};
            req.user.id = decode?.id; // Safe to assign now
            req.user.role= decode?.role
            next()
        })

    } catch (error) {
        res.status(400).json({
            message:error.message||error,
            data:[],
            error:true,
            success:false
        })
    }
}
module.exports=authtoken