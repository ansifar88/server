import Department from "../Models/departmentModel.js";
import Doctor from "../Models/doctorModel.js";
import User from "../Models/userModel.js";
import { upperCase } from "upper-case";

export const allUsers = async(req,res,next) => {
    try {
        const users = await User.find({is_admin : false})
        
        return res.status(200).json({data:users})
   } catch (error) {
        console.log(error.message);
    }
}
export const userManage = async(req,res,next) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (user) {
            await User.updateOne({_id:id},{$set:{is_blocked:!user.is_blocked}})
            res.status(200).json({ message: user.is_blocked ? "User Blocked" : "User UnBlocked" });
        }else{
            res.status(404).json({message:"usernot found"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

export const addDepartment = async(req,res,next)=>{
    try {
        const{departmentName,description} = req.body
        console.log(departmentName,description);
        const department =upperCase(departmentName) 
        const exist = await Department.findOne({departmentName:department})
        if(exist){
            return res.status(200).json({created:false,message:"Department Already exist"})
        }else{
            const newDep = new Department({
                departmentName:department,
                description:description
            })
            let newdepartment = await newDep.save()
            if (newdepartment) {
                return res.status(200).json({created:true,message:"Department Added"})
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
export const allDepartments = async(req,res,next) => {
    try {
        const departments = await Department.find()
        if (departments) {
            
            return res.status(200).json({data:departments})
        }else{
            return res.status(200).json({message:"Departments not found"})

        }
   } catch (error) {
        console.log(error.message);
    }
}
export const notVerified = async(req,res,next)=>{
    try {
        const notVerified = await Doctor.find({verified:false,requested:true})
        if (notVerified) {
            return res.status(200).json({data:notVerified})
        }else{

            return res.status(200).json({message:"Data not found"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
export const getDoctor = async(req,res,next)=>{
    try {
        const id = req.params.id
        const data = await Doctor.findById(id)
        if (data) {
            return res.status(200).json({data:data})
        }else{

            return res.status(200).json({message:"Data not found"}) 
        }
    } catch (error) {
        console.log(error.message);
    }
}
export const verifyDoctor = async(req,res,next)=>{
    try {
        console.log("verifyDoctor");
        const id = req.params.id
        const verified = await Doctor.findOneAndUpdate({_id:id},{$set:{verified:true}})
        if (verified) {
            return res.status(200).json({verified:true,message:"doctor vrification Success"})
        }else{
            return res.status(200).json({created:false,message:"doctor verification failed"})
        }
    } catch (error) {
        console.log(error.message);
    }
}

export const allDoctors =async(req,res,next) =>{
    try {
        const doctors = await Doctor.find()
        if (doctors) {
            return res.status(200).json({data:doctors,message:"success"})  
        }else{
            return res.status(200).json({message:"data not found"})
        }
    } catch (error) {
        console.log(error.message);
    }
}