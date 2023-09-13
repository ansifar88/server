import express from 'express';

import { Signup,verification,login,SignupWithGoogle } from "../../Controllers/userAuthController.js"
const router = express.Router();

router.post('/signup', Signup);
router.get("/:id/verify/:token", verification);
router.post('/login',login)
router.post('/googleSignup',SignupWithGoogle)

export default router;
