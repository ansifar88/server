import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { updateProfile } from '../../Controllers/doctorController.js';

router.put('/profile/:id',upload.array("certificates",10),updateProfile)

export default router