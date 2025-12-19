import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";

import connectDB from "../config/db.js";
import { notFound, errorHandler } from "../middlewares/errorMiddleware.js";

import authRoutes from "../routes/authRoutes.js";
import medicineRoutes from "../routes/medicineRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import patientRoutes from "../routes/patientRoutes.js";
import recommendationRoutes from "../routes/recommendationRoutes.js";

dotenv.config();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://apna-meds.vercel.app"
    ],
    credentials: true
  })
);

/* ---------- DB Connection (Serverless Safe) ---------- */
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.send("API running on Vercel 🚀");
});

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

/* ---------- EXPORT ONLY ---------- */
export default app;
