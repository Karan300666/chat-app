import userModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'
import { validationResult } from 'express-validator'
import redisclient from '../service/redis.service.js'
import nodemailer from 'nodemailer'




export async function registerUser(req , res){
    const result = validationResult(req);
     if(!result.isEmpty()){
        return res.status(400).json({error : result.array()[0] })

    }
try {
    
    const {userName , email , password} = req.body

    if(!userName || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }

const isUserAlreadyExist = await userModel.findOne({email});

if(isUserAlreadyExist){
return res.status(400).json({
message: "User Already Exist"
})
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await userModel.create({
  userName,
  email,
  password: hashedPassword
});

const token = jwt.sign({
id : user._id,
} , process.env.JWT_SECRET , {
    expiresIn : "24h"
})

res.cookie("token" , token)

res.status(200).json({
message: "User register successfully",
user: {
_id: user._id,
userName: user.userName,
email : user.email
}
})
} catch (err) {
    return res.status(400).json({"error": err})
}
}

export async function loginUser(req , res){
 try {
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "email and password are required"})
    }
const isUserExist = await userModel.findOne({email})
if(!isUserExist){
   return res.status(400).json({message: "Email or password incorect"})

}
const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);

if (!isPasswordCorrect) {
  return res.status(400).json({ message: "Email or password incorrect" });
}

console.log("Password matched for user", isUserExist.email);

const token = jwt.sign({
        id: isUserExist._id,
     } , process.env.JWT_SECRET)

     res.cookie("token" , token)

     res.status(201).json({
        message: "User login successfully",
        user:{
            _id: isUserExist._id,
            UserName: isUserExist.userName,
            email: isUserExist.email
        }
     })
 } catch (err) {
   return res.status(400).json({"error": err})
    
 }
}

export function logoutUser(req , res){
    try {
        
        const token = req.cookie.token;

        redisclient.set(token , 'logout' , 'Ex' , 60 * 60 * 24)

        res.status(200).json({
            message: 'Logged out successfully'
        })


    } catch(err) {
        return res.status(400).json({"error": err})
        
    }
}

export async function allUsers(req , res){

try {
    

    const userId = req.user._id;

    if(!userId){
        throw new Error('Invalid user')
    }

    const users = await userModel.find({
        _id: {$ne: userId}
    })

    return res.status(200).json({
        users: users
    })
    } catch (err) {
    res.status(400).json({error: err.message})
    
    }
}