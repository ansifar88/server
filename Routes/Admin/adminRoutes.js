import express from 'express'
const router = express.Router()

import { allUsers,userManage,addDepartment,allDepartments,notVerified,getDoctor,verifyDoctor,allDoctors } from '../../Controllers/adminController.js'

router.get('/users',allUsers)
router.put('/manageuser/:id',userManage)
router.post('/department',addDepartment)
router.get('/department',allDepartments)
router.get('/notVerified',notVerified)
router.get('/doctor/:id',getDoctor)
router.put('/verify/:id',verifyDoctor)
router.get('/doctors',allDoctors)


export default router