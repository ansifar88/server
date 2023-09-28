import Department from "../Models/departmentModel.js";
import Doctor from "../Models/doctorModel.js";
import { uploadToCloudinary,MultiUploadCloudinary } from "../utils/cloudinary.js";

export const updateProfile =async(req,res,next) => {
    try {
        console.log("profile update");
        const doctorId = req.params.id
        const{ currentHospital,department,qualification,experience,description} = req.body
        const uploadedImages = await MultiUploadCloudinary(req.files, "certificates");
        const depName =await Department.findById({_id:department})
        const updatedDoctor = await Doctor.updateOne({_id:doctorId},{$set:{
            currentHospital:currentHospital,
            department:depName,
            qualification:qualification,
            experience :experience,
            description:description,
            certificates:uploadedImages,
            requested:true
        }}) 
        if (updatedDoctor) {
            return res.status(200).json({data:updatedDoctor,message:"updated"})
        }else{
            return res.status(200).json({message:"updation failed"})

        }

        
    } catch (error) {
        console.log(error.message); 
    } 
}

export const getDoctor= async (req,res,next)=>{
    try {
        const id = req.params.id
        const data = await Doctor.findById(id).populate('department')
        if (data) {
            return res.status(200).json({data:data})
        }else{

            return res.status(200).json({message:"Data not found"}) 
        }
    } catch (error) {
        console.log(error.message); 
    }
}
export const updateDp = async(req,res,next)=>{
    try {
        console.log("dpdpdpdpdpdpd");
        const doctorId = req.params.id
        const img = req.file.path
        const uploadDp = await uploadToCloudinary(img,"dp")
        const updatedDp = await Doctor.updateOne({_id:doctorId},{$set:{
            displaypicture : uploadDp.url
        }})
        if (updatedDp) {
            console.log("dp updated",updatedDp);
            return res.status(200).json({data:updatedDp,message:"updated"})
        }else{
            return res.status(200).json({message:"updation failed"})
        }

    } catch (error) {
        console.log(error.message);
    }
}