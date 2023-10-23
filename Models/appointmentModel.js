import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const appointmentSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    consultingFee: { type: Number, required: true },
    isConsulted: { type: Boolean, default: false },
    callId: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "consulted",
        "cancelled",
        "notConsulted",
        // "cancellation-requested",
      ],
      default: "notConsulted",
    },
    AppoinmentStatus: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    scheduledAt: {
      slotTime: { type: String },
      slotDate: { type: String },
    //   date: { type: Date },
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
