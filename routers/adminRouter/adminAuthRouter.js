import express from 'express'
import { client } from '../../dbConfig.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const myDB = client.db("myEcommerce");
const Admins = myDB.collection("admins");

router.post('/admin/register', async (req, res) =>{
    console.log(req.body.name);
    if(!req.body.firstName || !req.body.lastName || !req.body.phone || !req.body.password || !req.body.email){
        res.send("please fill out complete form");
    }
    else{
        const userEmail=req.body.email.toLowerCase();

        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

if(userEmail.match(emailFormat) && req.body.password.match(passwordValidation)){

    const checkAdmin = await Admins.findOne({email: userEmail})

    if(checkAdmin){
        return res.send("Email already exist");
    }
    else{

       const hashedPassword = await bcrypt.hashSync(req.body.password)
        const user={
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            
        }
        
        
        const response=  await Admins.insertOne(user);
        if(response){
            return res.send("user added successfully")
        }
        else{
            return res.send("something went wrong")
        }
    }
        }else{
            return res.send("invalid email or password")
        }
    }

})



router.post('/admin/login', async (req, res) =>{
  try{

  
 if( !req.body.password || !req.body.email){
 return res.send({
        status : 0,
        message : "Email or Password is required"
      })
    }
    
        const email=req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!email.match(emailFormat)){
      return res.send({
        status : 0,
        message : "Email is Invalid"
      })
    }
        const Admin = await Admins.findOne({email: email})
        if(!Admin){
              return res.send({
        status : 0,
        message : "Email is not registered!"
      })
        }
   const matchPassword = await bcrypt.compareSync(req.body.password, Admin.password)
    if(!matchPassword){
      return res.send({
        status : 0,
        message : "Email or Password is incorrect"
      })
    }
    const token= await jwt.sign({
        email,
        firstName:Admin.firstName,
    }, process.env.SECRET_KEY, {expiresIn: "1h"})
    
    res.cookie("token", token,{
      httpOnly:true,
      secure: true
    })
return res.send({
    status : 1,
      message : "Login Successful",
      token,
      data : {
        firstName: Admin.firstName,
        email:Admin.email
      }
})

}
catch(error){
return res.send({
  status : 0,
      error : error,
      message : "Something Went Wrong"
})
}

})


router.post('/admin/forgotpassword', async (req, res)=>{
if(!req.body.email){
return res.send({
        status : 0,
        message : "Enter Your Email!"
      })
}
const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const email=req.body.email.toLowerCase();
if(!email.match(emailFormat)){
    return res.send({
        status : 0,
        message : "Email is Invalid"
      })
}
const Admin= await Admins.findOne({email:email});
if(!Admin){
      return res.send({
        status : 0,
        message : "Email is not registered!"
})
}
return res.send("OTP sent")
})

router.post('/admin/resetpassword',(req, res)=>{

})
export default router;