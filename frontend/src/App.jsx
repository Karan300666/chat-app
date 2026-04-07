import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from './auth/Register.auth'
import Login from './auth/Login.auth'
import CreateProject from './screen/CreateProject'
import { useContext } from 'react'
import Chat from './screen/Chat'
import UserAuth from './auth/user.auth'

function App() {
 
   return (
    <div>
      <Routes>
        <Route path="/signup" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={  <UserAuth><CreateProject/></UserAuth>  } />
        <Route path='/chat' element={ <UserAuth><Chat/></UserAuth>}/>
      </Routes>
      </div>
   )
    
  
}
export default App
