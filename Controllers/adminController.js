import Department from "../Models/departmentModel.js";
import Doctor from "../Models/doctorModel.js";
import User from "../Models/userModel.js";
import { upperCase } from "upper-case";
import { sendRejectionMail } from "../utils/sendMail.js";

export const allUsers = async (req, res, next) => {
  try {
    const { page, filter, search } = req.query;
    console.log(page, filter, search);
    let query = { is_admin: false };

    if (filter === "active") {
      query.is_blocked = false;
    } else if (filter === "blocked") {
      query.is_blocked = true;
    }

    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    const perPage = 4;
    const skip = (page - 1) * perPage;


    const count = await User.find(query).countDocuments()
    const users = await User.find(query).skip(skip).limit(perPage);
    console.log(count)
    return res.status(200).json({ data: users,count,pageSize:perPage,page });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userManage = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      await User.updateOne(
        { _id: id },
        { $set: { is_blocked: !user.is_blocked } }
      );
      res
        .status(200)
        .json({ message: user.is_blocked ? "User Blocked" : "User UnBlocked" });
    } else {
      res.status(404).json({ message: "usernot found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const addDepartment = async (req, res, next) => {
  try {
    const { departmentName, description } = req.body;
    const department = upperCase(departmentName);
    const exist = await Department.findOne({ departmentName: department });
    if (exist) {
      return res
        .status(200)
        .json({ created: false, message: "Department Already exist" });
    } else {
      const newDep = new Department({
        departmentName: department,
        description: description,
      });
      let newdepartment = await newDep.save();
      if (newdepartment) {
        return res
          .status(200)
          .json({ created: true, message: "Department Added" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};



export const allDepartments = async (req, res, next) => {
  try {
    const { page, filter, search } = req.query;
    console.log(page, filter, search);
    let query = { is_admin: false };

    if (filter === "active") {
      query.status = true;
    } else if (filter === "deleted") {
      query.status = false;
    }

    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    } 

    const perPage = 4;
    const skip = (page - 1) * perPage;


    const count = await Department.find(query).countDocuments()
    const departments = await Department.find(query).skip(skip).limit(perPage);
    console.log(count)
    return res.status(200).json({ data: departments,count,pageSize:perPage,page });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const notVerified = async (req, res, next) => {
  try {
    const notVerified = await Doctor.find({ verified: false, requested: true });
    if (notVerified) {
      return res.status(200).json({ data: notVerified });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getDoctor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Doctor.findById(id);
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const verifyDoctor = async (req, res, next) => {
  try {
    console.log("verifyDoctor");
    const id = req.params.id;
    const verified = await Doctor.findOneAndUpdate(
      { _id: id },
      { $set: { verified: true } }
    );
    if (verified) {
      return res
        .status(200)
        .json({ verified: true, message: "doctor vrification Success" });
    } else {
      return res
        .status(200)
        .json({ created: false, message: "doctor verification failed" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


export const allDoctors = async (req, res, next) => {
  try {
    const { page, filter, search } = req.query;
    console.log(page, filter, search);
    let query = { is_admin: false };

    if (filter === "active") {
      query.is_blocked = false;
    } else if (filter === "blocked") {
      query.is_blocked = true;
    } else if(filter === "notVerified"){
      query.verified = false
    }

    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    const perPage = 4;
    const skip = (page - 1) * perPage;


    const count = await Doctor.find(query).countDocuments()
    const doctors = await Doctor.find(query).skip(skip).limit(perPage);
    console.log(count)
    return res.status(200).json({ data: doctors,count,pageSize:perPage,page });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const doctorManage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    if (doctor) {
      await Doctor.updateOne(
        { _id: id },
        { $set: { is_blocked: !doctor.is_blocked } }
      );
      res.status(200).json({
        message: doctor.is_blocked ? "doctor Blocked" : "doctor UnBlocked",
      });
    } else {
      res.status(404).json({ message: "usernot found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const departmentManage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const department = await Department.findById(id);
    if (department) {
      await Department.updateOne(
        { _id: id },
        { $set: { status: !department.status } }
      );
      res.status(200).json({
        message: department.status ? "department Deleted" : "department Listed",
      });
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const rejectDoctor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const reject = await Doctor.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          requested: false,
        },
      }
    );
    await sendRejectionMail(reject.email, "verification rejected", reason);

    return res.status(200).json({ reject: true, message: "doctor rejected" });
  } catch (error) {
    console.log(error.message);
  }
};
