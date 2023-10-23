import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { updateProfile ,getDoctor,updateDp,editProfile,allDepartments, fetchChats, searchUsers} from '../../Controllers/doctorController.js';
import { doctorAuth } from '../../MiddleWares/Auth.js';
import { addSlots, getSlotDate,getSlots ,getAppointmentDate,getAppointments, shareLink} from '../../Controllers/slotController.js';
import { doctorMessage } from '../../Controllers/chatController.js';

router.get('/profile/:id',doctorAuth,getDoctor) 
router.get('/department',doctorAuth,allDepartments)
router.put('/profile/:id',upload.array("certificates",10),updateProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)
router.put('/editprofile/:id',editProfile)

router.post('/addslots',doctorAuth,addSlots)
router.get('/slotDate',doctorAuth,getSlotDate)
router.get('/slots',doctorAuth,getSlots)

router.get('/appointmentDate',doctorAuth,getAppointmentDate)
router.get('/appointments',doctorAuth,getAppointments)
router.post('/sharelink',doctorAuth,shareLink)

router.get('/fetchchat/:userId',fetchChats)
router.get('/usersearch',searchUsers)
router.post('/message',doctorMessage)

export default router