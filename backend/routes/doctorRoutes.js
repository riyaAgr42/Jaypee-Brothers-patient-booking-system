import express from "express";
import {
  getMyDoctorProfile,
  getDoctorById,
  getDoctors,
  updateMyDoctorProfile
} from "../controllers/doctorController.js";
import { doctorOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, doctorOnly, getMyDoctorProfile);
router.put("/me", protect, doctorOnly, updateMyDoctorProfile);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

export default router;
