import express  from "express";
const router = express.Router();
import { Signup,SignupWithGoogle ,Login } from "../../Controllers/doctorAuthController.js";

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/googleSignup',SignupWithGoogle)

export default router