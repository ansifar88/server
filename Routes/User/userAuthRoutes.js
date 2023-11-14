import express from 'express';

import { Signup,verification,login,SignupWithGoogle, googleLogin } from "../../Controllers/userAuthController.js"
const  router = express.Router();

router.post('/signup', Signup);
router.get("/:id/verify/:token", verification);
router.post('/login',login)
router.post('/googlelogin',googleLogin)
router.post('/googleSignup',SignupWithGoogle)

export default router;
