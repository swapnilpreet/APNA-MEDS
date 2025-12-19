import express from "express";
import {
  getMedicine,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createMedicineReview,
} from "../controllers/medicineController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
// import { userLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router
  .route("/")
  .get(protect,getMedicine)
  .post(protect,admin,upload.single("image"), createMedicine); // Admin can create Medicine

router.route("/:id/reviews").post(protect, createMedicineReview); // Users can review Medicine

router
  .route("/:id")
  .get(protect, getMedicineById)
  .put(protect, admin, upload.single("image"), updateMedicine) // Admin can update Medicine
  .delete(protect, admin, deleteMedicine); // Admin can delete Medicine

export default router;
