import express from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllAppointments,
  getAllDoctors,
  getDashboardStats,
  getPatients,
  updateDoctorApproval,
  updateAppointmentStatus,
  updateDoctor
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/doctors", getAllDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.patch("/doctors/:id/approval", updateDoctorApproval);
router.delete("/doctors/:id", deleteDoctor);
router.get("/appointments", getAllAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.get("/patients", getPatients);

export default router;
