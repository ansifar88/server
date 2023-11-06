// Import required modules 
import express from 'express';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
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
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT"],
    credentials:true
}))

app.use('/user/auth',userAuth)
app.use('/doctor/docAuth',doctorAuth)
app.use('/admin/adminAuth',adminAuth)


app.use('/user',UserRoutes)
app.use('/doctor',DoctorRoutes)
app.use('/admin',AdminRoutes)

const server = app.listen(process.env.PORTNUMBER,()=>{
    
    console.log(`server connected to port ${process.env.PORTNUMBER}`);
})
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: ['http://localhost:5173',"https://virtualcares.vercel.app"]
    }
  });
  io.on("connection",(socket)=>{
    console.log('connected to socket.io');
  
    socket.on("setup",(userData)=>{
      socket.join(userData._id)
      socket.emit('connected')
    })
  
    socket.on('join chat',(room)=>{
      socket.join(room)
      console.log('user joined in the room: '+room);
    })
  
    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))
  
    socket.on('new message', (newMessageRecieved) => {
      const chat = newMessageRecieved.chat;
      console.log(newMessageRecieved.sender);
    
      const userKeys = Object.keys(chat.users);
    
      userKeys.forEach((userKey) => {
        const user = chat.users[userKey];
        const senderUserId = newMessageRecieved.sender.user
          ? newMessageRecieved.sender.user._id
          : newMessageRecieved.sender.doctor._id;
    
        if (userKey !== senderUserId) {
          console.log(user);
          let access = user.user ? user.doctor : user.user;
          console.log(access);
          socket.to(access).emit("message received", newMessageRecieved);
        }
      });
    });
    
  
  })