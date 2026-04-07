import express from 'express'
import { registerUser , loginUser, logoutUser, allUsers } from '../controller/auth.controller.js'
import { body } from 'express-validator';
import authUserMiddleware from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/user/signup' , 
     body('userName')
     .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
     body('email')
     .isEmail()
     .withMessage('Not a valid e-mail address') ,
     body('password')
     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'), 
      registerUser
)

router.post('/user/login' , loginUser);

router.get('/user/logout' , logoutUser);

router.get('/user/all' , 
          authUserMiddleware ,
          allUsers)




export default router