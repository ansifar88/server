import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import Doctor from "../Models/doctorModel.js";

import dotenv from "dotenv";

dotenv.config();

export const userAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTUSERSECRET);
      const user = await User.findOne({
        _id: decoded.userId,
      });
      if (user) {
        if (user.is_blocked === false) {
          next();
        } else {
          return res
            .status(403)
            .json({ data: { message: "You are blocked by admin " } });
        }
      } else {
        return res
          .status(400)
          .json({ message: "user not authorised or inavid user" });
      }
    } else {
      return res.status(400).json({ message: "user not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const doctorAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTDOCTORSECRET);
      const doctor = await Doctor.findOne({
        _id: decoded.doctorId,
      });
      if (doctor) {
        if (doctor.is_blocked === false) {
          next();
        } else {
          return res
            .status(403)
            .json({ data: { message: "You are blocked by admin " } });
        }
      } else {
        return res
          .status(400)
          .json({ message: "user not authorised or inavid user" });
      }
    } else {
      return res.status(400).json({ message: "user not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const adminAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTADMINSECRET);
      const admin = await User.findOne({
        _id: decoded.adminId,
        is_admin: true,
      });
      if (admin) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: "user not authorised or inavid user" });
      }
    } else {
      return res.status(400).json({ message: "user not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
