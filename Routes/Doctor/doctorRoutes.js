import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { updateProfile ,getDoctor,updateDp} from '../../Controllers/doctorController.js';

router.get('/profile/:id',getDoctor)
router.put('/profile/:id',upload.array("certificates",10),updateProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)

export default router