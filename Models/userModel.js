import mongoose from 'mongoose';

const { Schema, ObjectId } = mongoose;

const UserSchema = new Schema({
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
  dob: { 
    type: Date 
  },
  weight: { 
    type: Number 
  },
  blood: { 
    type: String 
  },
  gender: { 
    type: String 
  },
  height: { 
    type: Number 
  },
  joinDate: { 
    type: Date 
  },
  displaypicture: { 
    type: String ,
    default:""
  }, 
  is_blocked: { 
    type: Boolean ,
    default:false
  },
  verified: { 
    type: Boolean,
    default:false
  },
  completed: { 
    type: Boolean,
    default:false
  },
  is_admin: { 
    type: Boolean ,
    default:false
  },
});

const User = mongoose.model('User', UserSchema);

export default User;

