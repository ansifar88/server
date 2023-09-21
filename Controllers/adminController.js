import Department from "../Models/departmentModel.js";
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
        console.log("block",user);
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
    try {console.log("hhhh");
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