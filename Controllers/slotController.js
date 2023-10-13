import Slot from "../Models/slotModel.js";
import Doctor from "../Models/doctorModel.js";
import moment from "moment";
import mongoose from "mongoose";
// const {  ObjectId } = mongoose;

// export const addSlots = async(req,res,next) => {
//     try {
//         console.log("add slot function");
//         const doctorId = req.headers.doctorId
//         const {startTime, endTime ,date} = req.body
//         const startingTime = moment(startTime, 'h:mm A');
//         const currentDate = new Date();
//         const slotDate = moment(date);
//         const endingTime = moment(endTime, 'h:mm A');
//         const slotDuration = 60;

//         if (slotDate.toDate() <= currentDate) {
//             return res.status(400).send('Slot must be in the future');
//         }

//         if (endingTime.isBefore(startingTime)) {
//             console.log('Ending time cannot be less than starting time');
//             return res.status(400).send('Ending time cannot be less than starting time');
//         }

//         const durationInMinutes = endingTime.diff(startingTime, 'minutes');
//         if (durationInMinutes < slotDuration) {
//             console.log('Minimum slot duration is 1 hour');
//             return res.status(400).send('Minimum slot duration is 1 hour');
//         }

//         const findSlotExist = await Slot.findOne({
//             doctor: doctorId,

//             'slotes': {
//                 $elemMatch: {
//                     'slotTime': { $gte: startingTime.format('h:mm A'), $lt: endingTime.format('h:mm A') }
//                 }
//             }
//         })

//         if (findSlotExist) {
//             return res.status(409).send({ message: "Slot already exists" });
//         }

//         const findSlots = await Slot.findOne({ doctor: doctorId })

//         const createSlots = generateTimeSlots(startTime, endTime, slotDuration, date);

//         function generateTimeSlots(startTime, endTime, slotDuration, date) {
//             console.log("end time", endTime);
//             console.log("start time", startTime);
//             const slots = [];

//             const end = new Date(`${date} ${endTime}`);
//             const start = new Date(` ${date} ${startTime} `);

//             console.log({ start });
//             console.log({ end });
//             while (start < end) {
//                 const slotTime = start.toLocaleTimeString('en-US', {
//                     hour: 'numeric',
//                     minute: '2-digit',
//                     hour12: true
//                 });

//                 const slotDoc = {
//                     slotTime: slotTime,
//                     slotDate: date,
//                     date: slotDate.toDate(),
//                     isBooked: false
//                 };
//                 // console.log(slotDoc);
//                 slots.push(slotDoc);
//                 start.setMinutes(start.getMinutes() + slotDuration);
//             }
//             // console.log(slots);
//             return slots;
//         }
//         if (!findSlots) {
//             const newSlot = new Slot({
//                 doctor: doctorId,
//                 slotes: createSlots
//             });

//             const createdSlot = await newSlot.save();
//             return res.status(201).json(createdSlot);
//         }

//         createSlots.forEach(slot => {
//             findSlots.slotes.push(slot);
//         });

//         await findSlots.save();
//         return res.status(200).json(findSlotExist);

//         console.log(findSlots);
//     } catch (error) {
//         console.log(error.message);
//     }
// }
export const addSlots = async (req, res, next) => {
  try {
    console.log("add slot function");
    const doctorId = req.headers.doctorId;
    console.log(doctorId);
    const { startTime, endTime, startDate, endDate } = req.body; // Add startDate and endDate to specify the date range
    //   console.log(startDate, endDate);
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
      console.log(findSlotExist);
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

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Now you have an array of created slots for each day within the date range
    //   console.log(createdSlots);

    // Save these slots in your database using Mongoose
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
  console.log(start,"slot date");

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
      return res.status(200).json({data:slotDates,message:"success"})
    }else{
        return res.status(200).json({message:"No slots"})

    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getSlots = async (req, res, next) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({message:"please select Date"})
      }
// const formattedDate = moment(date).format('YYYY-MM-DD')
//       console.log(formattedDate,"fffffffffffffffffffffff");
      const doctorId = req.headers.doctorId;
  
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      console.log(yesterday,"yesterday");
  
      // Remove slots older than or equal to yesterday
      await Slot.updateMany(
        {
          doctor: doctorId,
          'slotes.slotDate': { $lte: yesterday }, 
        },
        {
          $pull: {
            'slotes': {
              slotDate: { $lte: yesterday },
            },
          },
        }
      );
  
      const availableSlots = await Slot.find({
        doctor: doctorId,
        'slotes.slotDate': { $eq: new Date(date) },
      }).exec();
  
      console.log(availableSlots, "ssssssssssssssss");
      if (availableSlots) {
        return res.status(200).json({data:availableSlots,message:"success"})
    }else{
          return res.status(200).json({message:"slote not avilble"})

      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export const getSlotDateUser = async (req, res, next) => {
    try {
        console.log("innnnn");
      const {doctorId} = req.query;
      const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() )
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
       
        return res.status(200).json({data:slotDates,message:"success"})
      }else{
          return res.status(200).json({message:"No slots"})
  
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  export const getSlotsUser = async (req, res, next) => {
    try {
      const { date,doctorId } = req.query;
      console.log("getSlotsUser");
      console.log(date,doctorId,"gfgfgfg");
      if (!date) {
        return res.status(400).json({message:"please select Date"})
      }
// const formattedDate = moment(date).format('YYYY-MM-DD')
//       console.log(formattedDate,"fffffffffffffffffffffff");
    //   const doctorId = req.headers.doctorId
  
    //   const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  
  
      // Remove slots older than or equal to yesterday
    //   await Slot.updateMany(
    //     {
    //       doctor: doctorId,
    //       'slotes.slotDate': { $lte: yesterday }, 
    //     },
    //     {
    //       $pull: {
    //         'slotes': {
    //           slotDate: { $lte: yesterday },
    //         },
    //       },
    //     }
    //   );
  
      const availableSlots = await Slot.find({
        doctor: doctorId,
        'slotes.slotDate': { $eq: new Date(date) },
      }).exec();
  
      console.log(availableSlots, "ssssssssssssssss");
      if (availableSlots) {
        return res.status(200).json({data:availableSlots,message:"success"})
    }else{
          return res.status(200).json({message:"slote not avilble"})

      }
    } catch (error) {
      console.log(error.message);
    }
  };