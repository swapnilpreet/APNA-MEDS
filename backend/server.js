import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local
      "https://apna-meds-frontend.onrender.com/", // production frontend
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes); //done 1 not using
app.use("/api/medicine", medicineRoutes); //done
app.use("/api/orders", orderRoutes); //done
app.use("/api/users", userRoutes);
app.use("/api/patient", patientRoutes); //done
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
 
const PORT=process.env.PORT||3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
