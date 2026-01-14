import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import MedicineModel from "../models/Medicine.js";
import { sendEmail } from "../utills/sendEmail.js";

const addOrderItems = asyncHandler(async (req, res) => {
  const uniqueOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const {
    orderItems,
    shippingAddress,
    patientDetails,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    shippingStatus,
    orderId,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.send({
      success: false,
      message: "No order items found",
    });
  }

  for (const item of orderItems) {
    const medicine = await MedicineModel.findById(item.Medicine);

    if (!medicine) {
      return res.send({
        success: false,
        message: `Product not found`,
      });
    }

    if (medicine.countInStock < item.qty) {
      return res.send({
        success: false,
        message: `Not enough stock for ${medicine.name}`,
      });
    }
  }

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      Medicine: item.Medicine,
    })),
    user: req.user._id,
    shippingAddress,
    patientDetails,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt: Date.now(),
    shippingStatus: shippingStatus || "Packed",
    orderId: orderId || uniqueOrderId,
  });

  const createdOrder = await order.save();

  for (const item of orderItems) {
    await MedicineModel.findByIdAndUpdate(item.Medicine, {
      $inc: { countInStock: -item.qty },
    });
  }

  const orderHtml = `
   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; padding: 20px; color: #333333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">

    <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Order Confirmed!</h1>
      <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">Thank you for your purchase.</p>
    </div>

    <div style="padding: 25px 30px;">
      <h2 style="color: #4CAF50; font-size: 22px; font-weight: 600; margin-top: 0;">Hello , ${
        req.user.name
      },</h2>
      <p style="font-size: 16px;">Your order <b style="color:#2E7D32;">#${
        createdOrder.orderId
      }</b> has been successfully placed. We'll send you another email when it ships. 🚀</p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

      <h3 style="font-size: 18px; color: #555555; margin-bottom: 15px;">🛍️ Order Summary</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${createdOrder.orderItems
          .map(
            (item) => `
          <li style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
            <div style="flex-grow: 1;">
              <div style="font-weight: 500;">${item.name}</div>
              <div style="font-size: 14px; color: #777777; margin-top: 5px;"> Qty: <b>${item.qty}</b></div>
              <div style="font-size: 14px; color: #2E7D32; margin-top: 5px;"> Price: <b>₹${item.price}</b></div>
            </div>
          </li>
        `
          )
          .join("")}
      </ul>

      <div style="text-align: right; margin-top: 20px;">
        <p style="font-size: 18px; font-weight: 600; margin: 0;">
          Total: <span style="color: #2E7D32; font-size: 24px;">₹${
            createdOrder.totalPrice
          }</span>
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

      <h3 style="font-size: 18px; color: #555555; margin-bottom: 15px;">🚚 Shipping Address</h3>
      <p style="font-size: 15px; margin: 0;">
        <b>${shippingAddress.name || req.user.name}</b><br>
        ${shippingAddress.address}, <br>
        ${shippingAddress.city}, ${shippingAddress.country} - ${
    shippingAddress.postalcode
  }
      </p>

    </div>

    <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
      <p style="margin: 0;">If you have any questions, feel free to contact us.</p>
      <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} APNA-MED. All rights reserved.</p>
    </div>
  </div>
</div>
  `;

  // ✅ send order confirmation email
  await sendEmail(req.user.email, "Order Confirmation", orderHtml);

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: createdOrder,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// used
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  // console.log(orders.length);
  if (orders.length === 0) {
    return res.send({
      success: false,
      data: [],
      message: "You don't have any orders yet.",
    });
  }

  return res.status(200).json({
    success: true,
    data: orders,
    message: "Orders fetched successfully",
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");

  if (orders.length === 0) {
    return res.send({
      success: false,
      data: [],
      message: "No orders found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: orders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { shippingStatus } = req.body;
  const allowedSteps = [
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  if (!allowedSteps.includes(shippingStatus)) {
    return res.send({
      success: false,
      message: "Invalid shipping status",
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  order.shippingStatus = shippingStatus;
  if (shippingStatus === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  const updatedOrder = await order.save();
  res.status(200).json({
    success: true,
    message: "Shipping status updated successfully",
    data: updatedOrder,
  });
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
