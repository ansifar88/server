import express from 'express'
const router = express.Router()

import { allUsers,userManage,addDepartment,allDepartments,notVerified,getDoctor,verifyDoctor,allDoctors, doctorManage,departmentManage } from '../../Controllers/adminController.js'
import { adminAuth } from '../../MiddleWares/Auth.js'

router.get('/users',adminAuth,allUsers)
router.put('/manageuser/:id',adminAuth,userManage)
router.post('/department',adminAuth,addDepartment)
router.get('/department',adminAuth,allDepartments)
router.get('/notVerified',adminAuth,notVerified)
router.get('/doctor/:id',adminAuth,getDoctor)
router.put('/verify/:id',verifyDoctor)
router.get('/doctors',adminAuth,allDoctors)
router.put('/managedoctor/:id',doctorManage)
router.put('/managedepartment/:id',departmentManage)


export default router