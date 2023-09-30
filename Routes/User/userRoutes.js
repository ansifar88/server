import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { allDoctors,doctorSingle,getUser,updateProfile,updateDp } from '../../Controllers/userController.js';

router.get('/SnDOC/:id',doctorSingle)
router.get('/doctors',allDoctors)
router.get('/profile/:id',getUser)
router.put('/profile/:id',updateProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)

export default router 