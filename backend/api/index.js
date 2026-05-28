import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDatabase from "../config/db.js";
import loadEnv from "../config/loadEnv.js";
import authRoutes from "../routes/authRoutes.js";
import doctorRoutes from "../routes/doctorRoutes.js";
import appointmentRoutes from "../routes/appointmentRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";

loadEnv();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(morgan("dev"));

app.get("/api/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "DocEase API is running"
  });
});

app.use(async (request, response, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
