import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { allDoctors,doctorSingle,getUser,updateProfile,updateDp,editProfile, fetchChats, searchUsers, getPrescription, addReview, getReview } from '../../Controllers/userController.js';
import { userAuth } from '../../MiddleWares/Auth.js';
import { getSlotDateUser,getSlotsUser, payment ,addAppointment, appointmentsUser,cancelAppointment} from '../../Controllers/slotController.js';
import { accessChat, allMessages, sendMessage } from '../../Controllers/chatController.js';

router.get('/SnDOC/:id',userAuth,doctorSingle)
router.get('/doctors',userAuth,allDoctors)
router.get('/profile',userAuth,getUser)
router.put('/profile/:id',updateProfile)
router.put('/editProfile/:id',editProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)

router.get('/slotdate',userAuth,getSlotDateUser)
router.get('/slotsuser',userAuth,getSlotsUser)
router.post('/payment/:id',userAuth,payment)
router.post('/paymentsuccess',userAuth,addAppointment)
router.get('/appointments',userAuth,appointmentsUser)
router.put('/cancelAppointment',userAuth,cancelAppointment)

router.post('/accesschat',accessChat)
router.get('/fetchchat/:userId',fetchChats)
router.get('/usersearch',searchUsers)
router.post('/message',sendMessage)
router.get('/message/:chatId',allMessages)
router.get('/prescription/:id',userAuth,getPrescription)

router.post('/review',userAuth,addReview)
router.get('/review/:id',userAuth,getReview)

export default router 