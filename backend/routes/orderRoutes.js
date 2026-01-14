import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(protect, getOrderById); // Users/Admins can get a specific order
router.route("/:id/shipping").put(protect, admin, updateOrderStatus);

router.route("/:id/pay").put(protect, updateOrderToPaid); // Users can mark order as paid

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // Admin can mark order as delivered

export default router;
