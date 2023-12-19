import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tokenmodel from "../Models/token.js";

import sendMail from "../utils/sendMail.js";

import crypto from "crypto";

export const Signup = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res
        .status(200)
        .json({ created: false, message: "email already exist" });
    } else {
      const date = new Date();
      const hashpass = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: name,
        email: email,
        mobile: mobile,
        password: hashpass,
        joinDate: date,
      });
      let user = await newUser.save().then(console.log("Registered"));

      const emailtoken = await new Tokenmodel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.SERVERURL}/${user._id}/verify/${emailtoken.token}`;
      await sendMail(user.email, "Verify Email", url);
      console.log("email Succes");
      return res.status(200).json({
        created: true,
        emailtoken,
        message: "verification mail has been sent to your Gmail",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const verification = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: "invalid link" });
    }
    const token = await Tokenmodel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ message: "invalid link" });
    }
    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Tokenmodel.deleteOne({ _id: token._id });

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWTUSERSECRET, {
      expiresIn: "1h",
    });
    const redirectUrl = process.env.REDIRECTURL;
    res.redirect(redirectUrl);
    // res.status(200).json({user:user,jwtToken,message:"email verification success"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || user.is_admin === true) {
      return res.status(201).json({ access: false, message: "user not found" });
    }
    if (user.is_blocked === true) {
      return res
        .status(201)
        .json({ access: false, message: "You are blocked by admin" });
    }
    if (user.verified === false) {
      return res
        .status(201)
        .json({ access: false, message: "Please verify your email" });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect)
      return res
        .status(201)
        .json({ access: false, message: "invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWTUSERSECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ access: true, token, user, message: "logged in" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ access: false, message: "Internal Server Error" });
  }
};
export const googleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || user.is_admin === true) {
      return res.status(201).json({ access: false, message: "user not found" });
    }
    if (user.is_blocked === true) {
      return res
        .status(201)
        .json({ access: false, message: "You are blocked by admin" });
    }
   
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect)
      return res
        .status(201)
        .json({ access: false, message: "invalid password or email" });

    const token = jwt.sign({ userId: user._id }, process.env.JWTUSERSECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ access: true, token, user, message: "logged in" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ access: false, message: "Internal Server Error" });
  }
};

export const SignupWithGoogle = async (req, res, next) => {
  try {
    console.log("SignupWithGoogle");
    const { name, email, id } = req.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res
        .status(200)
        .json({ created: false, message: "email Already exists" });
    } else {
      const date = new Date();
      const hashPass = await bcrypt.hash(id, 10);
      const newUser = new User({
        name: name,
        email: email,
        password: hashPass,
        joinDate: date,
      });
      let user = await newUser.save().then(console.log("saved"));
      await User.updateOne({ _id: user._id }, { $set: { verified: true } });
      const token = jwt.sign({ userId: user._id }, process.env.JWTUSERSECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        created: true,
        token: token,
        user,
        message: "Account Registered",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
