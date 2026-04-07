import React from 'react'
import { useContext } from 'react'
import { useRef , useState , useEffect} from 'react'
import 'remixicon/fonts/remixicon.css'
import { useFetchers, useLocation , useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { initializeSocket } from '../config/socket'
import { sendMessage , receiveMessage } from '../config/socket'
import { userContext } from '../context/userContext'
import Markdown from 'markdown-to-jsx'

const Chat = () => {
  const [text, setText] = useState("");
  const textAreaRef = useRef(null);
  const userPannelRef = useRef(null)
  const [addUserPannel, setAddUserPannel] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState(new Set())
  const [msg, setMsg] = useState([])
  const [usersInProject , setUsersInProject] = useState([]);
  

  const location = useLocation()
  const { user } = useContext(userContext)
  
  const navigate = useNavigate();
  

  useEffect(() => {

    const textArea = textAreaRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";
  }, [text]);


  useEffect(() => {
    initializeSocket(location.state.project._id)
    axios.get('http://localhost:3000/api/auth/user/all' , {
        withCredentials: true
       }).then((res) => {
       
          setUsers(res.data.users)
       })
       
  
   
  }, [])
  

  function handleUserClick(id){
      setSelectedUserIds(prevSelectedUserIds => {
         const newSelectIds = new Set(prevSelectedUserIds);
         if(newSelectIds.has(id)){
             newSelectIds.delete(id)
         }
         else{
            newSelectIds.add(id)
         }
           return newSelectIds
      })
  }
  
  async function addCollaborators(){
    axios.put('http://localhost:3000/api/project/add-users' , {
      projectId : location.state.project._id ,
      users : Array.from(selectedUserIds)
    } ,{
      withCredentials: true
    }).then((res) => {
      console.log("Users added successfully")
      console.log("res: " , res)
    }).catch((err) => {
      console.log("error: " , err);
    })
}

function send(){
  
  sendMessage('message' , {
     text,
     sender: user._id,
     email: user.email

  })
  setText("")
  setMsg(prev => [...prev , { sender : user._id , email: user.email, text }])
 
  
}
useEffect(() => {
  initializeSocket(location.state.project._id)

  receiveMessage('message' , data => {
    
   
    setMsg(prev => [...prev , data])
  })
 
  
},[])

function presentUsersInProject(){
  userPannelRef.current.style.left = "0%"
  
  axios.get('http://localhost:3000/api/project/users-project', {
           params: {
            projectId: location.state.project._id
         },
          }, {
        withCredentials: true
       }).then((res) => {
        setUsersInProject(res.data.users.userId)
       }).catch((err) => {
            console.log("error" , err)
        })
}


  return (
    <div className='w-full h-screen bg-[#333333] relative' >
      

      <div className='bg-[#313131]  h-full w-full  md:w-[40%] relative overflow-y-scroll overflow-x-hidden chat-box '>
        <div className='bg-[#414040] text-white" w-full  md:w-[40%] fixed h-12  flex items-center justify-between'>
          <div className='text-xl font-bold  h-full flex gap-2 items-center '
          onClick={() => setAddUserPannel(true)}
          >
          <h2 className='text-white cursor-pointer whitespace-nowrap ml-4'
          >Add Collaborators  </h2>
           <i className="text-white ri-add-fill"></i>
          </div>
          <div className=' h-full text-end py-2 px-4'
          onClick={presentUsersInProject}
          >
            <button className='hover:bg-[#726f6f3f] cursor-pointer rounded-full w-8 h-8 '>
            <i className="ri-user-3-fill"></i>
            </button>
            </div>
        </div>
       <div
        
        className='text-sm text-white m-2 w-full mt-14 mb-28'>
       {msg.map((m , index) => (
         
         <div
         
         key={index}
         className={`max-w-80 h-auto break-words  whitespace-pre-wrap overflow-x-hidden overflow-y-auto my-4 ${m.sender === user._id ? "ml-52" : "ml-2"} bg-[#3d3f42] py-2 px-4 rounded-2xl`}>
          <small
          className=''
          >{m.email}</small>
         <p className='text-lg font-semibold'>{m.text}</p>
          
          </div>

        
      ))}
        
         
        </div>
       
        
        <div className="w-full md:w-[40%] bottom-0 fixed left-0  px-3 ">
          <div className="relative w-full">

          
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              placeholder=""
              className={"bg-[#3d3f42] text-white pr-16  w-full  rounded-xl px-4 py-4 focus:outline-none resize-none  overflow-hidden"}
            />
             <button className={`${text? "bg-white" : "bg-[#888383]"} ml-10 h-10 w-10  rounded-full flex justify-center items-center absolute right-4 top-2`}
             onClick={send}
             >
             <i className="ri-send-plane-2-fill text-xl"></i>
            </button>

           
            {!text && (
              <span
                className="absolute left-4 top-7 -translate-y-1/2 text-gray-400 pointer-events-none select-none"
              >
                Your message...
              </span>
            )}
          </div>
          </div>

          <div 
          ref={userPannelRef}
          className='w-full h-full absolute top-0 -left-full transition-all duration-600 ease-linear bg-[#3e3f41]'>
                   <div className='text-end px-4 py-2'>
                    <button className='hover:bg-[#7e7c7c31] cursor-pointer rounded-full w-8 h-8 '
                    onClick={() => {
                      userPannelRef.current.style.left = "-100%"
                    }}
                    >
                      
                    <i className="ri-close-fill text-xl font-semibold"></i>
                    </button>
                   </div>

                   <div className='flex flex-col '>
                    {usersInProject.map((user , index) => (
                    <div key={index} className='w-full h-14  hover:bg-[#5f5f5f] flex items-center gap-2'>
                      <i className="ri-account-circle-line text-white text-4xl"></i>
                      <p className='text-lg font-semibold text-white'>{user.email}</p>
                    </div>
                    ))}
                    
                   </div>

          </div>
        

      </div>
      {addUserPannel && (
        
          <div className='absolute left-[10%]  lg:left-[40%] top-[10%] lg:top-[30%] w-80 max-h-[200px] bg-[#777a79] rounded-xl flex flex-col justify-between items-center overflow-auto addUserPannel'>
            <div className='w-full px-4 py-2'>
{              users.map(user => (
               <div 
               key={user._id}
               onClick={() => handleUserClick(user._id)}
              
                 className={`w-full h-14 cursor-pointer hover:bg-[#5f5f5f] flex items-center gap-2 ${Array.from(selectedUserIds).indexOf(user._id) != -1 ? 'bg-[#5f5f5f]' : "" }`}>
                      <i className="ri-account-circle-line text-white text-4xl"></i>
                      <p className='text-lg font-semibold text-white'>{user.userName}</p>
                    </div>
               ))}
            </div>
   <div className='fixed  mt-48'>
             <button className='p-2 bg-blue-500 rounded-lg text-white font-medium mt-4 cursor-pointer text-center hover:bg-blue-400'
             onClick={() => addCollaborators()}
             >Add Collaborator</button>
              <button className='p-2 bg-red-500 rounded-lg text-white font-medium mt-4 ml-2 cursor-pointer hover:bg-red-400'
              onClick={() => setAddUserPannel(false)}
              >Cancel </button>
              </div>
          </div>
      
      )}
    </div>
  );
};

export default Chat
