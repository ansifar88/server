import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res, next) => {
  try {
    console.log("adminlogin");
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email });
    if (!admin) {
      return res.status(201).json({ access: false, message: "user not found" });
    }
    if (admin.is_admin == true) {
      const isCorrect = await bcrypt.compare(password, admin.password);
      if (!isCorrect)
        return res
          .status(201)
          .json({ access: false, message: "invalid password" });
      const token = jwt.sign({ adminId: admin._id }, process.env.JWTADMINSECRET, {
        expiresIn: "24hr",
      });
      return res
        .status(200)
        .json({ access: true, token, admin, message: "logged in" });
    } else {
      if (!isCorrect)
        return res
          .status(201)
          .json({ access: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
