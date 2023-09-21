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
  is_verified: {
     type: Boolean
 },
  is_blocked: {
     type: Boolean
 },
  currentHospital: {
     type: String
 },
//   YearOfGraduation: {
//      type: Date 
// },
  department: {
     type: Schema.Types.ObjectId ,
     ref:"Department"
},
  experience: {
     type: Number 
},
  hospitals: {
     type: Array,  
},
  description: {
     type: String
 },
  dertificates: {
     type: Array,  
},
  slot: {
     type: Number 
},
  displaypcture: {
     type: String 
},
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export default Doctor;

