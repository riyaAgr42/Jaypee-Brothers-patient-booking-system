import express from "express";
import { getProfileSummary, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfileSummary);
router.put("/profile", protect, updateProfile);

export default router;
