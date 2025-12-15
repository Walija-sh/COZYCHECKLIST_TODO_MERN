import express from 'express';
import { registerUser,loginUser,getMe,logout,updatePassword } from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const AuthRouter=express.Router();

AuthRouter.post('/register',registerUser);
AuthRouter.post('/login',loginUser);
AuthRouter.get('/logout',logout);
AuthRouter.use(protect);
AuthRouter.get('/me',getMe);
AuthRouter.post('/updatePassword',updatePassword)

export default AuthRouter;