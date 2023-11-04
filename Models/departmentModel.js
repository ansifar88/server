import mongoose from "mongoose";
const{ Schema } = mongoose;

const departmentSchema = new Schema({
    departmentName :{
        type :String,
        required: true
    },
    description :{
        type :String,
        required : true
    },
    icon :{
        type :String,
       
    },
    status :{
        type :Boolean,
        default : true
    }
});

const Department = mongoose.model('Department',departmentSchema);

export default Department;