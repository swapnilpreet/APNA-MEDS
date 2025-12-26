import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
// import prescriptionRoutes from './routes/prescriptionRoutes.js'; // New route for prescriptions
import recommendationRoutes from './routes/recommendationRoutes.js'; // New route for recommendations
import "./config/redis.js";

const app = express();
app.use(express.json()); 


app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local
      "https://apna-meds.vercel.app"    // production frontend
    ],
    credentials: true
  })
);

// Serverless-safe DB connect
// let isDbConnected = false;
// app.use(async (req, res, next) => {
//   if (!isDbConnected) {
    await connectDB();
//     isDbConnected = true;
//   }
//   next();
// });


// Routes
app.use('/api/auth', authRoutes); //done
app.use('/api/medicine', medicineRoutes); //done
app.use('/api/orders', orderRoutes); //done
app.use('/api/users', userRoutes);
app.use('/api/patient', patientRoutes); //done
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

app.listen(3000, async() => {
  await connectDB();
  console.log(`Server running is running on port ${3000}`);
});


// export default app;