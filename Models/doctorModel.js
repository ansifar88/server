import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  currentHospital: {
    type: String,
  },
  cunsultationFee: {
    type: Number,
  },
  requested: {
    type: Boolean,
    default: false,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
  },
  experience: {
    type: Number,
  },
  qualification: {
    type: String,
  },
  wallet: {
    type: Number,
  },
  description: {
    type: String,
  },
  certificates: {
    type: Array,
  },
  languages: {
    type: Array,
  },
  slot: {
    type: Number,
  },
  displaypicture: {
    type: String,
    default: "",
  },
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
