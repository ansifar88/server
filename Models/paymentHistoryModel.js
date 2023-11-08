import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const paymentHistorySchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
});

const Payments = mongoose.model("Payments", paymentHistorySchema);

export default Payments;
