import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  updateDoctorAppointmentStatus
} from "../controllers/appointmentController.js";
import { doctorOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch("/:id/doctor-status", protect, doctorOnly, updateDoctorAppointmentStatus);

export default router;
