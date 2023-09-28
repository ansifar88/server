import Doctor from '../Models/doctorModel.js'
import User from '../Models/userModel.js'

export const allDoctors = async(req,res,next)=>{
    try {
        const doctors = await Doctor.find({verified:true,is_blocked:false}).populate("department")
        if (doctors) {
            return res.status(200).json({data:doctors,message:"Success"}) 
        }else{
            return res.status(200).json({message:"Data not found"}) 
        }
    } catch (error) {
        console.log(error.message);
    } 
} 
export const doctorSingle =async(req,res,next)=>{
    try {
        console.log("insider the functin");
        const id = req.params.id
        console.log(id);
        const doctor = await Doctor.findOne({_id:id}).populate('department')
        console.log(doctor);
        if (doctor) {
            res.status(200).json({data:doctor,message:"success"})
        }else{
            res.status(200).json({message:"data not found"})

        }
    } catch (error) {
        console.log(error.message);
    }
}


export const getUser= async (req,res,next)=>{
    try {
        const id = req.params.id
        const data = await User.findById(id)
        if (data) {
            return res.status(200).json({data:data})
        }else{

            return res.status(200).json({message:"Data not found"}) 
        }
    } catch (error) {
        console.log(error.message); 
    }
}