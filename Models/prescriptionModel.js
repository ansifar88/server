import { Schema } from "mongoose";
import mongoose from "mongoose";
const prescriptionSchema = new Schema({
    appointmentId: {
        type: String,
        
      },
      medicines :{
        type: Array,
        default : []
      },
      instructions :{
        type: String,
        default : ""
      }
})

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;