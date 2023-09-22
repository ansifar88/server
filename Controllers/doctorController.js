import Department from "../Models/departmentModel.js";
import Doctor from "../Models/doctorModel.js";
import { uploadToCloudinary,MultiUploadCloudinary } from "../utils/cloudinary.js";

export const updateProfile =async(req,res,next) => {
    try {
        console.log("profile update");
        const doctorId = req.params.id
        const{ currentHospital,department,qualification,experience,description} = req.body
        const uploadedImages = await MultiUploadCloudinary(req.files, "certificates");
        console.log(uploadedImages);
        const updatedDoctor = await Doctor.updateOne({_id:doctorId},{$set:{
            currentHospital:currentHospital,
            department:department,
            qualification:qualification,
            experience :experience,
            description:description,
            certificates:uploadedImages
        }}) 
        if (updatedDoctor) {
            console.log("updated");
        }

        
    } catch (error) {
        console.log(error.message); 
    } 
}