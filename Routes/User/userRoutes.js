import express from 'express';
const router = express.Router()
import { allDoctors,doctorSingle,getUser } from '../../Controllers/userController.js';

router.get('/SnDOC/:id',doctorSingle)
router.get('/doctors',allDoctors)
router.get('/profile/:id',getUser)

export default router 