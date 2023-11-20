import Chat from "../Models/chatModel.js";
import Doctor from "../Models/doctorModel.js";
import Prescription from "../Models/prescriptionModel.js";
import Review from "../Models/reviewModel.js";
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
    const id = req.params.id;
    const doctor = await Doctor.findOne({ _id: id }).populate("department");
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
    console.log("user in");
    const id = req.headers.userId
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

export const fetchChats = async (req, res) => {
  try {
    console.log("reached fetchchat");
    const { userId } = req.params;
    const result = await Chat.find({ "users.user": userId })
      .populate("users.user", "-password")
      .populate("users.doctor", "-password")
      .populate("latestMessage")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender.doctor" ? "sender.doctor" : "sender.user",
          select: "-password",
        },
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender.user",
          select: "-password",
        },
      })
      .then((result) => {
        console.log(result), res.send(result);
      });
  } catch (error) {
    console.log(error.message);
  }
};

export const searchUsers = async (req, res) => {
  console.log("reached");
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await Doctor.find(keyword); //.find({ _id: { $ne: req.user._id } });
  console.log(users);
  res.status(200).json(users);
};

export const getPrescription = async (req, res, next) => {
  try {
    console.log("inside prescription ");
    const id = req.params.id;
    console.log(req.params.id);
    const prescription = await Prescription.findOne({
      appointmentId: id,
    }).populate("appointmentId");
    console.log(prescription);
    if (prescription) {
      return res.status(200).json({ data: prescription });
    } else {
      return res.status(200).json({ message: "data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const addReview = async (req, res, next) => {
  try {
    console.log("review in");
    const userId = req.headers.userId;
    const { rating, review, id } = req.body;
    const newReview = new Review({
      user: userId,
      doctor: id,
      reviewText: review,
      rating: rating,
    });
    newReview.save();
    if (newReview) {
      return res
        .status(200)
        .json({ created: true, message: "Thank You for Your support" });
    } else {
      return res
        .status(200)
        .json({ created: false, message: "somthing went wrong" });
    }
  } catch (error) {
    console.log(error.massage);
  }
};

export const getReview = async (req, res, next) => {
  try {
    console.log("get Review in");
    const id = req.params.id;

    const reviews = await Review.find({ doctor: id })
    .populate("doctor","-password")
    .populate("user","-password");
    const count = reviews.length;

    let avgRating = 0
    if (count > 0) {
      const totalRating = reviews.reduce(
        (total, review) => total + review.rating, 0
      );
      const avgRatingStr = (totalRating / count).toFixed(1);
      avgRating = Number(avgRatingStr);
    } else {
      console.log("No reviews found.");
    }
    if (reviews) {
      return res.status(200).json({data:reviews,count:count,avgRating:avgRating})
      
    } else {
      return res.status(200).json({mesaage:"Reviws not found"})
      
    }
  } catch (error) {
    console.log(error.message);
  }
};
