import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const DoctorSchema = new Schema({
  name: {
     type: String,
     required: true 
},
  email: {
     type: String,
     required: true 
},
  mobile: {
     type: Number,
},
  password: {
     type: String,
     required: true 
},
  Is_verified: {
     type: Boolean
 },
  Is_blocked: {
     type: Boolean
 },
  CurrentHospital: {
     type: String
 },
  YearOfGraduation: {
     type: Date 
},
  Department: {
     type: Schema.Types.ObjectId 
},
  Experience: {
     type: Number 
},
  Hospitals: {
     type: Array,  
},
  Description: {
     type: String
 },
  Certificates: {
     type: Array,  
},
  Slot: {
     type: Number 
},
  Photo: {
     type: String 
},
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export default Doctor;

