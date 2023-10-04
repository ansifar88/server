import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { updateProfile ,getDoctor,updateDp,editProfile} from '../../Controllers/doctorController.js';
import { doctorAuth } from '../../MiddleWares/Auth.js';

router.get('/profile/:id',doctorAuth,getDoctor)
router.put('/profile/:id',upload.array("certificates",10),updateProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)
router.put('/editprofile/:id',editProfile)

export default router