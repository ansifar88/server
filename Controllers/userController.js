import Doctor from "../Models/doctorModel.js";
import User from "../Models/userModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const allDoctors = async (req, res, next) => {
  try {
    console.log("all doctors");
    const doctors = await Doctor.find({
      verified: true,
      is_blocked: false,
    }).populate("department");
    if (doctors) {
      return res.status(200).json({ data: doctors, message: "Success" });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const doctorSingle = async (req, res, next) => {
  try {
    console.log("insider the functin");
    const id = req.params.id;
    console.log(id);
    const doctor = await Doctor.findOne({ _id: id }).populate("department");
    console.log(doctor);
    if (doctor) {
      res.status(200).json({ data: doctor, message: "success" });
    } else {
      res.status(200).json({ message: "data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId, "user updateProfile");
    const { gender, city, dob, height, weight, blood } = req.body;
    const updatedUser = await User.updateOne(
      { _id: userId },
      {
        $set: {
          gender: gender,
          city: city,
          dob: dob,
          weight: weight,
          height: height,
          blood: blood,
          completed: true,
        },
      }
    );
    if (updatedUser) {
      console.log("updated", updatedUser);
      return res
        .status(200)
        .json({ data: updatedUser, message: "profile updated" });
    } else {
      return res.status(200).json({ message: "profile updation failed" });
    }

    console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
};
export const editProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId, "user editProfile");
    const { name, gender, city, dob, height, weight, blood } = req.body;
    const editedUser = await User.updateOne(
      { _id: userId },
      {
        $set: {
          name: name,
          gender: gender,
          city: city,
          dob: dob,
          weight: weight,
          height: height,
          blood: blood,
        },
      }
    );
    if (editedUser) {
      console.log("editedUser", editedUser);
      return res
        .status(200)
        .json({ data: editedUser, message: "profile edited" });
    } else {
      return res.status(200).json({ message: "profile edit failed" });
    }

    console.log(req.body);
  } catch (error) {
    console.log(error.message);
  }
};

export const updateDp = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId, "dpdpdpdpdpdpd");
    const img = req.file.path;
    const uploadDp = await uploadToCloudinary(img, "dp");
    const updatedDp = await User.updateOne(
      { _id: userId },
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
