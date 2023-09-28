import express from 'express';
const router = express.Router()
import { allDoctors,doctorSingle, } from '../../Controllers/userController.js';

router.get('/SnDOC/:id',doctorSingle)
router.get('/doctors',allDoctors)

export default router 