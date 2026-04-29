import express from "express";
import { getTotalUsers } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/total", protect, authorizeRoles("admin"), getTotalUsers);

export default router;
