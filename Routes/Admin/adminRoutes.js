import express from 'express'
const router = express.Router()

import { allUsers,userManage,addDepartment,allDepartments } from '../../Controllers/adminController.js'

router.get('/users',allUsers)
router.put('/manageuser/:id',userManage)
router.post('/department',addDepartment)
router.get('/department',allDepartments)

export default router