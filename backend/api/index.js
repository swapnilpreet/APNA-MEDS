import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import medicineRoutes from "../routes/medicineRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import patientRoutes from "../routes/patientRoutes.js";
import recommendationRoutes from "../routes/recommendationRoutes.js";
import mailRoutes from "../routes/mailRoutes.js";
import { notFound, errorHandler } from "../middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

/* 🔹 DB CONNECT (IMPORTANT) */
connectDB();

/* 🔹 Middlewares */
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://apna-meds-frontend.onrender.com",
  "https://apna-meds.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* 🔹 Routes */
app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/mail", mailRoutes);

app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});

/* 🔹 Error handling */
app.use(notFound);
app.use(errorHandler);

/* ❌ DO NOT app.listen() */
export default app;
