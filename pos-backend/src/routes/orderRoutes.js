import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

// POS order confirmation
// allowed: admin, manager, cashier
router.post("/", protect, authorizeRoles("admin", "manager", "cashier"), (req, res) => {
  // Ensure backend always receives valid JSON; if body-parser failed earlier, this won't run.
  // createOrder handles all validation + transactions.
  return createOrder(req, res);
});


export default router;

