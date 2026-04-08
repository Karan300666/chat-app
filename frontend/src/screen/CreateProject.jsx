import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import axios from 'axios'
import { useEffect } from 'react'
import 'remixicon/fonts/remixicon.css'
import { useNavigate } from 'react-router-dom'

const CreateProject = () => {
   
    const [isModel, setIsModel] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [projects, setProjects] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
     axios.get('https://live-chat-app-0vfn.onrender.com/api/project/all' , {
        withCredentials: true
      }).then((res) => {
        setProjects(res.data.projects)
      })
   },[])
   async function createProject(){

       axios.post('https://live-chat-app-0vfn.onrender.com/api/project/create' , {
        name: projectName
       } , {
        withCredentials: true
       }).then((res) => {
          setProjectName("")
          setIsModel(false)
       }).catch((err) => {
        console.log("error: " , err)
       })
   }

   
      
  return (
    <div className='w-full h-screen md:overflow-y-hidden  overflow-y-scroll  bg-[#272727] '>
      
       <div>
        <button className='text-white p-3 bg-blue-500 mt-5 ml-5 rounded-lg font-medium hover:bg-blue-400 hover:cursor-pointer'
        
        onClick={() => {
            setIsModel(true)
        }}>
            Create Project
            <i className="ri-link pl-2"></i>

        </button>
       </div>
     <div className='w-full flex flex-wrap px-5 mt-10 gap-3'> 
       {
        projects.map((project) => (
            <div key={project._id} className='min-w-52  bg-[#9c9b9b] h-32 flex flex-col  rounded-lg cursor-pointer hover:bg-[#8d8a8a] '
            onClick={() => navigate(`/chat?projectId=${project._id}`, {
              state: { project }
            })}
            >
            <h2 className='font-semibold text-2xl m-2'>{project.name}</h2>
            <div className='px-2 flex gap-2 mt-8 '>
              <i className="ri-user-line "> Collaborator: </i>
              <p className=''>{project.userId.length}</p>
            </div>
            </div>
          
        ))
       }
       </div>
      
       {isModel && (
         <div
           className='fixed inset-0 flex justify-center items-center  '
          
         >
           <form
             action=""
             onSubmit={(e) => e.preventDefault()}
             className="bg-[#202123] w-[300px] h-[200px] rounded-lg p-4 relative z-10 flex flex-col justify-center items-center" >
                <h1 className="text-3xl font-bold text-center  text-white" >Create Project</h1>
              <input type="text" placeholder='Enter the project name' className='text-black bg-white h-10 rounded-lg p-3 mt-5' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              <div>
              <button className='p-2 bg-blue-500 rounded-lg text-white font-medium mt-4  text-center hover:bg-blue-400' onClick={createProject}>Create Project</button>
              <button className='p-2 bg-red-500 rounded-lg text-white font-medium mt-4 ml-2 hover:bg-red-400' onClick={() => setIsModel(false)}>Cancel </button>
              </div>
           </form>
         </div>
       )}
     

    </div>
  )
}

export default CreateProject
