import React , { useEffect , useContext , useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../context/userContext'
import Cookies from "js-cookie";



const userAuth = ({children}) => {
      const navigate = useNavigate();
      const { user } = useContext(userContext);
      const [loading, setLoading] = useState(true)
      const token = Cookies.get("token");
      
    
      useEffect(() => {
        
        if(!token){
          navigate('/login')
          
        }
        else{
             setLoading(false)
        }
        
        
         if(!user) {
            navigate('/login')
          setLoading(false)
        }
        else if(user){
          setLoading(false)
        }

      }, [user, token, navigate])

      if(loading){
        return <div>Loading...</div>
      }
      

  return (
    <>
    { children }
    </>
  )
}

export default userAuth
