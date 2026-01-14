import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addmedicalhistory,
  toggleCartItem,
  GetmyCartItem,
  clearUserCart,
  editMedicalHistory,
  deleteMedicalHistory,
  getMedicalHistory,
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getUsers); //

router.route('/cart')
  .post(protect, toggleCartItem); 

router.route('/getcart')
  .get(protect, GetmyCartItem) 

router.route('/clear-cart')
  .delete(protect, clearUserCart)
  
router.route('/medical-history')
  .get(protect, getMedicalHistory) // user can get medical history
  .post(protect,upload.single("image"), addmedicalhistory); // user can add ,edical history

router.route('/profile')
  .get(protect, getUserProfile) // Users can get their own profile
  .put(protect,upload.single("image"), updateUserProfile); // Users can update their own profile

router.route('/medical-history/:id')
  .put(protect, upload.single("image"),editMedicalHistory) // Users can update their medical history by ID
  .delete(protect, deleteMedicalHistory); // Users can delete their medical history by ID

router.route('/:id')
  .delete(protect, admin, deleteUser) // Admin can delete users
  .get(protect, admin, getUserById) // Admin can get user by ID
  .put(protect, admin, updateUser); // Admin can update user by ID


export default router;