import { validationResult } from "express-validator";
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";

export async function createProject(req , res){
    const result = validationResult(req);

    if(!result.isEmpty()){
        return res.status(400).json({"error" : result.array()[0]})
    }
try{

    const { name } = req.body;
    
    const email = req.user.email;

    const loggedInUser = await userModel.findOne({
        email: email
    })
    
    const project = await projectModel.create({
        name, 
        userId: [loggedInUser._id]
    })

    res.status(200).json({ message : "Project created successfully" , 
        project
    })
   
} catch(err){
   return res.status(400).json({"error": err})
}

}

export async function  allProject(req , res){
    const result = validationResult(req);

    if(!result.isEmpty){
        return res.status(400).json({"error" : result.array()[0]})
    }
try {
    
    const user = req.user;
   
    const loggedInUser = await userModel.findOne({
        email: user.email 
    })
    if(!loggedInUser){
        throw new Error("There is no project user belong")
    }
    
    const projects = await projectModel.find({
        userId : loggedInUser._id
    })

    if(!projects){
        throw new Error("There is no project exist from this user id")
    }

    res.status(200).json({
        message: "Projects fetched successfully",
        projects
    })
} catch (err) {
    res.status(400).json({
        err : err.message
    })
}
}

export async function addUser(req , res){
    const result = validationResult(req);

    if(!result.isEmpty()){
        return res.status(400).json({"error" : result.array()[0]})
    }
    try {
        
        const { projectId , users } = req.body;
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })
        const user = req.user 
        const userId = user._id
       
        if(!projectId){
            throw new Error("projectId are require");
        }
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            throw new Error("Invalid projectId")
        }
       
        if(!users){
            throw new Error("Users are require")
        }
     
        if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))){
            throw new error("Invalid userId(s) in users array")
            
        }
        
        if(!userId){
            throw new Error("userId is required")
        }
        
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new Error("Invaild userId")
        }
       
        const project = await projectModel.findOne({
            _id: projectId,
            userId: userId
        })
        
        if(!project){
            throw new Error("User not belong to this project")
        }
     
        const updatedProject = await projectModel.findByIdAndUpdate({
            _id: projectId
        }, {
            $addToSet: {
                userId: {
                    $each: users
                }
            }
        },{
            new: true
        })
       

        res.status(200).json({
            message: "users added successfully", 
            updatedProject
        })

    } catch (err) {
         console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export async function userInProject(req , res){
    const { projectId }  = req.query;
    if(!projectId){
        throw new Error("propjectID is require");
    }

    const users = await projectModel.findById(projectId).populate("userId");
    if(!users){
        throw new Error("users not found in this project");
    }

    

    return res.status(200).json({"users": users})

    
}