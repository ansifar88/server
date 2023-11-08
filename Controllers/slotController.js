import Slot from "../Models/slotModel.js";
import Doctor from "../Models/doctorModel.js";
import moment from "moment";
import mongoose from "mongoose";
import Stripe from "stripe";
import Appointment from "../Models/appointmentModel.js";
import sendMail from "../utils/sendMail.js";
import User from "../Models/userModel.js";
import Payments from "../Models/paymentHistoryModel.js";
// const {  ObjectId } = mongoose;

export const addSlots = async (req, res, next) => {
  try {
    console.log("add slot function");
    const doctorId = req.headers.doctorId;
    const { startTime, endTime, startDate, endDate } = req.body;
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date must be greater than or equal to start date",
      });
    }
    const slotDuration = 30;

    // Loop through the date range and generate slots for each day
    const createdSlots = [];

    const currentDate = new Date(startDate); // Start from the startDate
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      const date = currentDate.toLocaleDateString();

      // Check if slots exist for the current day and time range
      const findSlotExist = await Slot.findOne({
        doctor: doctorId,
        slotes: {
          $elemMatch: {
            slotDate: date,
            $or: [
              {
                slotTime: { $gte: startTime, $lt: endTime },
              },
              {
                slotTime: { $lte: startTime },
                endTime: { $gt: startTime },
              },
              {
                slotTime: { $lt: endTime },
                endTime: { $gte: endTime },
              },
            ],
          },
        },
      });
      // console.log(findSlotExist);
      if (findSlotExist) {
        return res.status(409).json({ message: "Slot already exists" });
      }

      const createSlots = generateTimeSlots(
        startTime,
        endTime,
        slotDuration,
        date
      );
      createdSlots.push({
        date: currentDate,
        slots: createSlots,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // created slots for each day within the date range

    // Save these slots
    const slotData = createdSlots.map((slotObj) => {
      return {
        doctor: doctorId,
        slotes: slotObj.slots,
      };
    });

    // Use the create method to save the slots to the database
    const savedSlots = await Slot.create(slotData);

    return res.status(200).json(savedSlots);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

function generateTimeSlots(startTime, endTime, slotDuration, date) {
  const slots = [];

  const end = new Date(`${date} ${endTime}`);
  const start = new Date(` ${date} ${startTime} `);

  while (start < end) {
    const slotTime = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const slotDoc = {
      slotTime: slotTime,
      slotDate: date,
      date: start,
      isBooked: false,
    };

    slots.push(slotDoc);
    start.setMinutes(start.getMinutes() + slotDuration);
  }

  return slots;
}

export const getSlotDate = async (req, res, next) => {
  try {
    const doctorId = req.headers.doctorId;
    const result = await Slot.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
        },
      },
      { $unwind: "$slotes" },
      {
        $group: {
          _id: "$slotes.slotDate",
          slotDates: { $addToSet: "$slotes.slotDate" },
        },
      },
      {
        $project: {
          _id: 0,
          slotDates: 1,
        },
      },
    ]);
    if (result) {
      const slotArray = result.map((item) => item.slotDates);
      const slotDates = slotArray.flat();
      return res.status(200).json({ data: slotDates, message: "success" });
    } else {
      return res.status(200).json({ message: "No slots" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "please select Date" });
    }
    const doctorId = req.headers.doctorId;

    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    console.log(yesterday, "yesterday");

    // Remove slots older than or equal to yesterday
    await Slot.updateMany(
      {
        doctor: doctorId,
        "slotes.slotDate": { $lte: yesterday },
      },
      {
        $pull: {
          slotes: {
            slotDate: { $lte: yesterday },
          },
        },
      }
    );

    const availableSlots = await Slot.find({
      doctor: doctorId,
      "slotes.slotDate": { $eq: new Date(date) },
    }).exec();

    if (availableSlots) {
      return res.status(200).json({ data: availableSlots, message: "success" });
    } else {
      return res.status(200).json({ message: "slot not available" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getSlotDateUser = async (req, res, next) => {
  try {
    const { doctorId } = req.query;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    const result = await Slot.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
          "slotes.slotDate": { $gte: tomorrow },
        },
      },
      { $unwind: "$slotes" },
      {
        $group: {
          _id: "$slotes.slotDate",
          slotDates: { $addToSet: "$slotes.slotDate" },
        },
      },
      {
        $project: {
          _id: 0,
          slotDates: 1,
        },
      },
    ]);
    if (result) {
      const slotArray = result.map((item) => item.slotDates);
      const slotDates = slotArray.flat();

      return res.status(200).json({ data: slotDates, message: "success" });
    } else {
      return res.status(200).json({ message: "No slots" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getSlotsUser = async (req, res, next) => {
  try {
    const { date, doctorId } = req.query;
    if (!date) {
      return res.status(400).json({ message: "please select Date" });
    }

    const availableSlots = await Slot.find({
      doctor: doctorId,
      "slotes.slotDate": new Date(date),
      "slotes.isBooked": false,
    }).exec();

    if (availableSlots) {
      const mergedObject = availableSlots.reduce((result, slot) => {
        slot.slotes.forEach((slotInfo) => {
          if (slotInfo.slotDate) {
            if (!result[slotInfo.slotDate]) {
              result[slotInfo.slotDate] = [];
            }
            result[slotInfo.slotDate].push(slotInfo);
          }
        });
        return result;
      }, {});
      const mergedArray = [].concat(...Object.values(mergedObject));

      return res.status(200).json({ data: mergedArray, message: "success" });
    } else {
      return res.status(200).json({ message: "slote not avilble" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const payment = async (req, res, next) => {
  try {
    console.log("iside stripe");
    const stripe = new Stripe(
      "sk_test_51O11IzSJfBiixPMTuMIQ5XnJMHD2niq1bWmFC9qjOQ11GIMxsADIsMfJ4azYq8PKqCKkp5KEmFkLzaZsmdoguEZl00WG2wrBwR"
    );
   
    const doctor = await Doctor.findById(req.params.id);
    const cunsultationFee = doctor.cunsultationFee;
    console.log(typeof( cunsultationFee));
    //create paymentintent
    const paymentintent = await stripe.paymentIntents.create({
      amount: 100 * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.status(200).json({
      clientSecret: paymentintent.client_secret,
    });
  } catch (error) {
    console.log(error);
  }
};
export const addAppointment = async (req, res, next) => {
  try {
    console.log("book data");
    const { docId, slotId, paymentstatus, slotDate, slotTime } =
      req.body.bookData;
    const doctor = await Doctor.findById(docId);
    const userId = req.headers.userId;

    const cunsultationFee = doctor.cunsultationFee;
    if (paymentstatus == "success") {
      const updatedSlot = await Slot.findOneAndUpdate(
        {
          doctor: docId,
          slotes: {
            $elemMatch: { _id: slotId },
          },
        },
        { $set: { "slotes.$.isBooked": true } }
      );

      const Appoinment = new Appointment({
        doctor: docId,
        user: userId,
        consultingFee: doctor.cunsultationFee,
        paymentStatus: paymentstatus,
        scheduledAt: {
          slotTime: slotTime,
          slotDate: slotDate,
          // date: date
        },
      });
      await Appoinment.save();
      if (Appoinment) {
        await Doctor.updateOne(
          { _id: docId },
          { $inc: { wallet: cunsultationFee } }
        );
        const payment = new Payments({
          doctor: docId,
          user: userId,
          date: Date.now(),
          amount: doctor.cunsultationFee,
        });
        await payment.save();
        return res
          .status(200)
          .json({ created: true, message: "Appoinment added successfully" });
      }
    } else {
      console.log("payment error");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getAppointmentDate = async (req, res, next) => {
  try {
    const doctorId = req.headers.doctorId;

    const result = await Appointment.aggregate([
      {
        $match: {
          doctor: new mongoose.Types.ObjectId(doctorId),
        },
      },
      { $unwind: "$scheduledAt" },
      {
        $group: {
          _id: "$scheduledAt.slotDate",
          appointmentDates: { $addToSet: "$scheduledAt.slotDate" },
        },
      },
      {
        $project: {
          _id: 0,
          appointmentDates: 1,
        },
      },
    ]);
    if (result) {
      const mergedDates = result.reduce((results, obj) => {
        return results.concat(obj.appointmentDates);
      }, []);
      // console.log(mergedDates,"result");
      return res.status(200).json({ data: mergedDates, message: "success" });
    } else {
      return res.status(200).json({ message: "No slots" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Please select a Date" });
    }
    const doctorId = req.headers.doctorId;
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    await Appointment.updateMany(
      {
        doctor: doctorId,
        "scheduledAt.slotDate": { $lte: yesterday },
      },
      {
        $set: {
          AppoinmentStatus: "expired",
        },
      }
    );

    const appointments = await Appointment.find({
      doctor: doctorId,
      "scheduledAt.slotDate": date,
    })
      .populate("user")
      .exec();

    if (appointments) {
      return res.status(200).json({ data: appointments, message: "Success" });
    } else {
      return res.status(200).json({ message: "No appointments available" });
    }
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const appointmentsUser = async (req, res, next) => {
  try {
    const id = req.headers.userId;
    const appointments = await Appointment.find({ user: id })
      .populate("doctor")
      .populate("user");

    let currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);
    const formattedCurrentDate = currentDate.toLocaleString();

    if (appointments) {
      return res.status(200).json({ data: appointments, message: "success" });
    } else {
      return res.status(200).json({ message: "somthing went wrong" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const shareLink = async (req, res, next) => {
  try {
    const { link, id } = req.body;
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          callId: link,
        },
      }
    ).populate("user");
    const email = updatedAppointment.user.email;
    console.log(email);
    await sendMail(email, "please join", link);
    if (updatedAppointment) {
      return res.status(200).json({ created: true });
    } else {
      return res.status(200).json({ created: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    console.log("Cancel Appointment");
    const userId = req.headers.userId;
    const id = req.body.id;
    const appointment = await Appointment.findOne({ _id: id }).populate(
      "doctor"
    );
    const doctorId = appointment.doctor._id;
    const cunsultationFee = appointment.doctor.cunsultationFee;
    let scheduledDate = new Date(appointment.scheduledAt.slotDate);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const formattedScheduledDate = scheduledDate.toLocaleString();
    const formattedCurrentDate = currentDate.toLocaleString();

    if (scheduledDate > currentDate) {
      const updated = await Appointment.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            status: "cancelled",
          },
        }
      );

      if (updated) {
        await Doctor.findByIdAndUpdate(
          { _id: doctorId },
          { $inc: { wallet: -cunsultationFee } }
        );
        await User.findByIdAndUpdate(
          { _id: userId },
          { $inc: { wallet: cunsultationFee } }
        );
        const payment = new Payments({
          doctor: doctorId,
          user: userId,
          date: Date.now(),
          amount: -cunsultationFee,
        });
        await payment.save();
        return res
          .status(200)
          .json({ updated: true, message: "your appointment is canceled" });
      } else {
        return res.status(200).json({
          updated: false,
          message: "somthing went wrong please try later",
        });
      }
    } else {
      return res
        .status(200)
        .json({ message: "You Cant Cancel today Appointment" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
