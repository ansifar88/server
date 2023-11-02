import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const reviewSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },

    reviewText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
