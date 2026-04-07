import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'

async function authUserMiddleware(req , res , next){
    const token = req.cookies.token

    if(!token){
        res.status(401).json({
            message: "Unauthorised access"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded.id)
        req.user = user;
        next();
    } catch (err) {
         return res.status(400).json({error: err})
    }
}

export default authUserMiddleware