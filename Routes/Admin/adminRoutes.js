import express from 'express'
const router = express.Router()

import { allUsers,userManage } from '../../Controllers/adminController.js'

router.get('/users',allUsers)
router.put('/manageuser/:id',userManage)

export default router