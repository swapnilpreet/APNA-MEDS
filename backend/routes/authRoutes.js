import express from 'express';
import { changepassword, loginUser, registerUser, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
// import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();


router.post('/register', registerUser);
router.put('/password',protect,changepassword);
router.post('/login',loginUser);
router.get("/verify-email", verifyEmail);

export default router;