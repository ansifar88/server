import Appointment from "../Models/appointmentModel.js";
import Chat from "../Models/chatModel.js";
import Department from "../Models/departmentModel.js";
import Doctor from "../Models/doctorModel.js";
import Prescription from "../Models/prescriptionModel.js";
import User from "../Models/userModel.js";
import {
  uploadToCloudinary,
  MultiUploadCloudinary,
} from "../utils/cloudinary.js";

export const updateProfile = async (req, res, next) => {
  try {
    console.log("profile update");
    const doctorId = req.params.id;
    const {
      currentHospital,
      // cunsultationFee,
      department,
      qualification,
      experience,
      description,

    } = req.body;
    const uploadedImages = await MultiUploadCloudinary(
      req.files,
      "certificates"
    );
    const depName = await Department.findById({ _id: department });
    const updatedDoctor = await Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          currentHospital: currentHospital,
          // cunsultationFee : cunsultationFee,
          department: depName,
          qualification: qualification,
          experience: experience,
          description: description,
          certificates: uploadedImages,
          requested: true,
        },
      }
    );
    if (updatedDoctor) {
      return res.status(200).json({ data: updatedDoctor, message: "updated" });
    } else {
      return res.status(200).json({ message: "updation failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getDoctor = async (req, res, next) => {
  try {
    console.log("doctor in");
    const id = req.params.id;
    const data = await Doctor.findById(id).populate("department");
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const updateDp = async (req, res, next) => {
  try {
    console.log("dpdpdpdpdpdpd");
    const doctorId = req.params.id;
    const img = req.file.path;
    const uploadDp = await uploadToCloudinary(img, "dp");
    const updatedDp = await Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          displaypicture: uploadDp.url,
        },
      }
    );
    if (updatedDp) {
      console.log("dp updated", updatedDp);
      return res.status(200).json({ data: updatedDp, message: "updated" });
    } else {
      return res.status(200).json({ message: "updation failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    console.log("profile update");
    const doctorId = req.params.id;
    const {
      name,
      currentHospital,
      cunsultationFee,
      department,
      qualification,
      experience,
      description,
    } = req.body;
    const depName = await Department.findById({ _id: department });
    const editedDoctor = await Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          name: name,
          currentHospital: currentHospital,
          department: depName,
          qualification: qualification,
          experience: experience,
          cunsultationFee: cunsultationFee,
          description: description,
        },
      }
    );
    if (editedDoctor) {
      return res.status(200).json({ data: editedDoctor, message: "edited" });
    } else {
      return res.status(200).json({ message: "edit failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const allDepartments = async(req,res,next)=>{
  try {
    const department = await Department.find()
    if (department) {
      return res.status(200).json({data : department,message:"data found"})
    }else{
      return res.status(200).json({message:"data not found"})

    }
  } catch (error) {
    console.log(error.message);
  }
}

export const fetchChats=async(req,res)=>{
  try {
      console.log('reached');
      const {userId}=req.params
      const result = await Chat.find({ "users.doctor": userId }).populate('users.user', '-password') 
      .populate('users.doctor', '-password')
      .populate('latestMessage').populate({
          path: 'latestMessage',
          populate: {
            path: 'sender.doctor',
            select: '-password',
          },
        }).populate({
          path: 'latestMessage', 
          populate: {
            path: 'sender.user',
            select: '-password',
          },
        }).then((result)=>{console.log(result),res.send(result)});
  } catch (error) {
      console.log(error.message);
  }
}
export const searchUsers=async(req,res)=>{
  try {
      console.log('reached');
      const keyword = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
        console.log(keyword);
    
      const users = await User.find(keyword) //.find({ _id: { $ne: req.user._id } });
      console.log(users);
      res.status(200).json(users);
  } catch (error) {
      console.log(error.message);
  }
}

export const addPrescription = async (req, res, next) => {
  try {
    const { id, medicine, instruction } = req.body;

    const appointment = await Appointment.findOne({ _id: id });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.prescription = medicine;

    await appointment.save();

    return res.status(200).json({ created: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const confirmCunsult=async(req,res,next) =>{
  try {
    console.log(req.params.id,"innn");
    const updated = await Appointment.updateOne({_id :req.params.id},{$set:{isConsulted : true,status : "cunsulted"}})
    if (updated) {
      res.status(200).json({updated :true})
    }else{
      res.status(200).json({updated :false})

    }
  } catch (error) {
    console.log(error.message);
  }
}