// Import required modules 
import express from 'express';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Import your route modules
import userAuth from './Routes/User/userAuthRoutes.js';
import doctorAuth from './Routes/Doctor/doctorAuthRoutes.js'
import adminAuth from './Routes/Admin/adminAuthRoutes.js'

import UserRoutes from './Routes/User/userRoutes.js';
import DoctorRoutes from './Routes/Doctor/doctorRoutes.js';
import AdminRoutes from './Routes/Admin/adminRoutes.js';

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGODBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MONGODB CONNECTED");
}).catch(err =>{
    console.log(err.message);
})

app.use(cors({
    origin:['http://localhost:5173'],
    methods:["GET","POST"],
    credentials:true
}))

app.use('/user/auth',userAuth)
app.use('/doctor/docAuth',doctorAuth)
app.use('/admin/adminAuth',adminAuth)


app.use('/user',UserRoutes)
app.use('/doctor',DoctorRoutes)
app.use('/admin',AdminRoutes)

app.listen(process.env.PORTNUMBER,()=>{
    
    console.log(`server connected to port ${process.env.PORTNUMBER}`);
})