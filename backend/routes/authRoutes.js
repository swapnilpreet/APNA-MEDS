import express from 'express';
import { changepassword, loginUser, registerUser, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);
router.put('/password',protect,changepassword); // not using 
router.post('/login',loginUser);
router.get("/verifyemail", verifyEmail);

export default router;