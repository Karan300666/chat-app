import express from 'express'
import { body } from 'express-validator';
import authUserMiddleware from '../middleware/auth.middleware.js';
import { createProject } from '../controller/project.controller.js';
import { allProject } from '../controller/project.controller.js';
import { addUser } from '../controller/project.controller.js';
import { userInProject } from '../controller/project.controller.js';

const router = express.Router();

router.post('/create' , 
       body('name')
      .isString()
      .withMessage('project name must be a string'),
     authUserMiddleware , 
    createProject


)

router.get('/all' ,
    authUserMiddleware , 
    allProject
 )

 router.put('/add-users' , 
    authUserMiddleware,
    body('projectId').isString().withMessage('projectId is require'),
    body("users").isArray({ min: 1 }).withMessage('users must be an array').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each userId must be a string'),
    addUser
 )

 router.get('/users-project' ,  userInProject)

export default router;