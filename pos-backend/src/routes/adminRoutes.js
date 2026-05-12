import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAdminMetrics,
  getSalesChart,
  getTopProducts,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin analytics
// allowed roles: admin only (you can add "manager" if you want)
router.get(
  "/metrics",
  protect,
  authorizeRoles("admin"),
  (req, res) => getAdminMetrics(req, res)
);

router.get(
  "/sales-chart",
  protect,
  authorizeRoles("admin"),
  (req, res) => getSalesChart(req, res)
);

router.get(
  "/top-products",
  protect,
  authorizeRoles("admin"),
  (req, res) => getTopProducts(req, res)
);

export default router;

