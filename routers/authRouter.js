import express from 'express'
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const myDB = client.db("myEcommerce");
const Users = myDB.collection("users");

router.post('/register', async (req, res) =>{
    console.log(req.body.name);
    if(!req.body.firstName || !req.body.lastName || !req.body.phone || !req.body.password || !req.body.email){
        res.send("please fill out complete form");
    }
    else{
        const userEmail=req.body.email.toLowerCase();

        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

if(userEmail.match(emailFormat) && req.body.password.match(passwordValidation)){

    const checkUser = await Users.findOne({email: userEmail})

    if(checkUser){
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
            status:"active",
            isVerified: false
        }
        
        
        const response=  await Users.insertOne(user);
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



router.post('/login', async (req, res) =>{
 if( !req.body.password || !req.body.email){
 return res.send({
        status : 0,
        message : "Email or Password is required"
      })
    }
    else{
        const email=req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!email.match(emailFormat)){
      return res.send({
        status : 0,
        message : "Email is Invalid"
      })
    }
        const user = await Users.findOne({email: email})
        if(!user){
              return res.send({
        status : 0,
        message : "Email is not registered!"
      })
        }
   const matchPassword = await bcrypt.compareSync(req.body.password, user.password)
    if(!matchPassword){
      return res.send({
        status : 0,
        message : "Email or Password is incorrect"
      })
    }
    const token= await jwt.sign({
        email,
        firstName:user.firstName,
    }, "secret", {expiresIn: "1h"}
)
return res.send({
    status : 1,
      message : "Login Successful",
      token,
      data : user
})

    }
})


router.post('/forgotpassword', async (req, res)=>{
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
const user= await Users.findOne({email:email});
if(!user){
      return res.send({
        status : 0,
        message : "Email is not registered!"
})
}
return res.send("OTP sent")
})

router.post('/resetpassword',(req, res)=>{

})
export default router;