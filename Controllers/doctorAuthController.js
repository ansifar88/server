import Doctor from "../Models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Signup = async(req,res,next) => {
    try {
        console.log("Doctor signup");
        const {name,email,mobile,password} = req.body
        const exist = await Doctor.findOne({email:email})
        if(exist){
            return res.status(200).json({created:false,message:"email already exist"})

        }else{
            const hashPass = await bcrypt.hash(password,10)
            const newDoctor = new Doctor({
                name:name,
                email:email,
                mobile:mobile,
                password:hashPass
            })
            let doctor = await newDoctor.save().then(console.log("Registered"))
            const token = jwt.sign({ doctorId:newDoctor._id },process.env.JWTKEY,{expiresIn:"24hr"})
            return res.status(200).json({created:true,token:token,message:"registration"})
        }

    } catch (error) {
        console.log(error.message);
    }
}


export const Login = async (req,res,next)=>{
    try {
        const {email,password} = req.body
        const doctor = await Doctor.findOne({email:email})
        if (!doctor) {
            return res.status(201).json({access:false,message:"user not found"})
        }
        const isCorrect = await bcrypt.compare(password,doctor.password)
        if(!isCorrect)return res.status(201).json({access:false,message:"invalid password"}) 
        
        const token = jwt.sign({doctorId:doctor._id},process.env.JWTKEY, {expiresIn:"24hr"}) 

        
        return res.status(200).json({access:true,token,doctor,message:"logged in"})
    } catch (error) {
        console.log(error.message);
    }
 }

export const SignupWithGoogle = async(req,res,next) => {
    try {
        console.log("doctor signupgoogle")
        const {name,email,id} = req.body
        const exist = await Doctor.findOne({email:email})
        if (exist) {
            return res.status(200).json({created:false,message:"email Already exists"})
        }else{
            const hashPass = await bcrypt.hash(id,10)
            const newDoctor = new Doctor({
                name:name,
                email:email,
                password:hashPass
            })
            let doctor = await newDoctor.save().then(
                console.log("saved")
            )
            const token = jwt.sign({doctorId:doctor._id},process.env.JWTKEY,{expiresIn : "24hr"})
            return res.status(200).json({created:true,token:token,doctor,message: "Account Registered"})

        }
    } catch (error) {
        console.log(error.message);
    }
}