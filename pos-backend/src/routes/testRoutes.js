import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public route (no login required)
router.get("/test", (req, res) => {
  res.json({ message: "Backend Working !" });
});

// ✅ Only logged-in users
router.get("/user", protect, (req, res) => {
  res.json({ message: "User access granted" });
});

// ✅ Only admin allowed
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;
