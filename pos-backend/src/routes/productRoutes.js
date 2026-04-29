import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE → admin, manager
router.post("/", protect, authorizeRoles("admin", "manager"), createProduct);

// GET → all logged-in users
router.get("/", protect, getProducts);

// UPDATE → admin, manager
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProduct);

// DELETE → only admin
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

export default router;
