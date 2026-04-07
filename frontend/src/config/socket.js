import socket from 'socket.io-client'
import Cookies from "js-cookie";



let socketInstance = null;


export const initializeSocket = (projectId) => {
    const token = Cookies.get("token");

    socketInstance = socket('http://localhost:3000' , {
       
         auth: {
            token: token
         }, 
         query: {
            projectId
         }
         
    })
  
    return socketInstance;
}

export const receiveMessage = (eventName , cb) => {
    socketInstance.on(eventName , cb)
}

export const sendMessage = (eventName , data) => {
    socketInstance.emit(eventName , data)
}