import express from 'express';
import { createServer } from 'http'
import 'dotenv/config'
import authRoute from './routes/auth.routes.js'
import cookie from 'cookie-parser'
import cors from 'cors'
import projectRoute from './routes/project.routes.js'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import AIRoute from './routes/AI.routes.js'
import getAIResult from './service/ai.service.js'

const app = express();
const server = createServer(app)


const corsOptions = {
  origin: 'https://chat-app-red-one-27.vercel.app/', 
  credentials: true, 
};

app.use(cors(corsOptions))
app.use(cookie())
app.use(express.json())
app.use('/api/auth' , authRoute)
app.use('/api/project' , projectRoute)
app.use('/api/ai' , AIRoute)

const io = new Server(server, {
  cors: corsOptions
});


io.use(async(socket , next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if(!token){
            return next(new Error("Authentication error"))
        }
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error('Invalid projectId'))
        }
      
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        socket.project = await projectModel.findById(projectId);
        
        if(!decoded){
            return next(new Error("Invalid token ")); // More specific error message
        }
               
                socket.user = decoded;
                next();
    } catch (error) {
        console.log(error)
    }
})

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()
    socket.join(socket.roomId)
   

    socket.on('message' , async data => {
        

    socket.broadcast.to(socket.roomId).emit('message' , data)
        if(data.text.includes('@ai')){
            const prompt = data.text.replace('@ai' , "")
           const result = await getAIResult(prompt)
          console.log(result)
           io.to(socket.roomId).emit('message' ,{text: result , sender: 'ai' , email: 'ai'})
        }
    })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
}); 


app.get('/' , (req , res) => {
    res.send("hello")
})

export default server;
