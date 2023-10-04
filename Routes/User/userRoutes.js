import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { allDoctors,doctorSingle,getUser,updateProfile,updateDp,editProfile } from '../../Controllers/userController.js';
import { userAuth } from '../../MiddleWares/Auth.js';

router.get('/SnDOC/:id',userAuth,doctorSingle)
router.get('/doctors',userAuth,allDoctors)
router.get('/profile/:id',userAuth,getUser)
router.put('/profile/:id',updateProfile)
router.put('/editProfile/:id',editProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)

export default router 