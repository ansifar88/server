import express from 'express';
const router = express.Router()
import upload from '../../MiddleWares/multer.js';

import { allDoctors,doctorSingle,getUser,updateProfile,updateDp,editProfile, fetchChats, searchUsers } from '../../Controllers/userController.js';
import { userAuth } from '../../MiddleWares/Auth.js';
import { getSlotDateUser,getSlotsUser, payment ,addAppointment, appointmentsUser} from '../../Controllers/slotController.js';
import { accessChat, allMessages, sendMessage } from '../../Controllers/chatController.js';

router.get('/SnDOC/:id',userAuth,doctorSingle)
router.get('/doctors',userAuth,allDoctors)
router.get('/profile/:id',userAuth,getUser)
router.put('/profile/:id',updateProfile)
router.put('/editProfile/:id',editProfile)
router.put('/dp/:id',upload.single("dp"),updateDp)

router.get('/slotdate',userAuth,getSlotDateUser)
router.get('/slotsuser',userAuth,getSlotsUser)
router.post('/payment/:id',userAuth,payment)
router.post('/paymentsuccess',userAuth,addAppointment)
router.get('/appointments',userAuth,appointmentsUser)

router.post('/accesschat',accessChat)
router.get('/fetchchat/:userId',fetchChats)
router.get('/usersearch',searchUsers)
router.post('/message',sendMessage)
router.get('/message/:chatId',allMessages)

export default router 