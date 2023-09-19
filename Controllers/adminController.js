import User from "../Models/userModel.js";

export const allUsers = async(req,res,next) => {
    try {
        const users = await User.find({is_admin : false})
        
        return res.status(200).json({data:users})
   } catch (error) {
        console.log(error.message);
    }
}
export const userManage = async(req,res,next) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        console.log("block",user);
        if (user) {
            await User.updateOne({_id:id},{$set:{is_blocked:!user.is_blocked}})
            res.status(200).json({ message: user.is_blocked ? "User Blocked" : "User UnBlocked" });
        }else{
            res.status(404).json({message:"usernot found"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}