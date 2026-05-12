import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const createOrder = async (req, res) => {
  // Mongo transactions require replica set.
  // If the DB isn't configured for transactions, we must avoid calling withTransaction.
  let session = null;
  try {
    session = await mongoose.startSession();
  } catch {
    session = null;
  }

  try {
    const { cart = [], customer = {}, paymentMode, discount } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart
      .map((i) => {
        const qty = toNumber(i.qty);
        const productId = i.productId || i.id || i._id;
        if (!productId || qty < 1) return null;
        return { productId, qty };
      })
      .filter(Boolean);

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart items are invalid" });
    }

    const runCreateOrder = async () => {
      // Helpful debugging: log what we received (avoid logging sensitive fields)
      // eslint-disable-next-line no-console
      console.log("createOrder payload:", {
        cartLen: Array.isArray(cart) ? cart.length : null,
        cart: items,
        discount,
        paymentMode,
        customer: { name: customer?.name, phone: customer?.phone },
      });
      // Lock products for update to prevent overselling under concurrency.
      // Without transactions, this is still safe-ish because stock decrement uses
      // a conditional update: { stock: { $gte: qty } }.
      const productIds = items.map((i) => i.productId);

      const products = await Product.find({ _id: { $in: productIds } })
        .session(session || undefined)
        .select("_id name price stock barcode");

      const byId = new Map(products.map((p) => [String(p._id), p]));

      // Validate all products exist + have sufficient stock
      for (const { productId, qty } of items) {
        const p = byId.get(String(productId));
        if (!p) {
          const err = new Error(`Product not found: ${productId}`);
          err.statusCode = 404;
          throw err;
        }
        if (p.stock < qty) {
          const err = new Error(
            `Insufficient stock for ${p.name}. Available: ${p.stock}, Requested: ${qty}`
          );
          err.statusCode = 409;
          err.available = p.stock;
          err.requested = qty;
          err.productName = p.name;
          throw err;
        }
      }

      // Decrement stock atomically (inside transaction if supported)
      for (const { productId, qty } of items) {
        const result = await Product.updateOne(
          { _id: productId, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { session: session || undefined }
        );

        if (result.matchedCount === 0) {
          const p = byId.get(String(productId));
          const err = new Error(`Stock conflict for ${p?.name || "product"}`);
          err.statusCode = 409;
          throw err;
        }
      }

      // Compute totals server-side from authoritative product prices
      const subtotal = items.reduce((sum, { productId, qty }) => {
        const p = byId.get(String(productId));
        return sum + p.price * qty;
      }, 0);

      const discPct = Math.max(0, toNumber(discount));
      const discountAmt = (subtotal * discPct) / 100;
      const taxable = subtotal - discountAmt;
      const gst = taxable * 0.18;
      const total = taxable + gst;

      const orderItems = items.map(({ productId, qty }) => {
        const p = byId.get(String(productId));
        return {
          product: p._id,
          name: p.name,
          price: p.price,
          qty,
          barcode: p.barcode,
        };
      });

      const order = await Order.create(
        [
          {
            items: orderItems,
            customer: {
              name: customer?.name || "",
              phone: customer?.phone || "",
            },
            paymentMode: paymentMode || "Cash",
            discount: discPct,
            subtotal,
            gst,
            total,
            createdBy: req.user?.id,
          },
        ],
        { session: session || undefined }
      );

      res.status(201).json({ order: order[0] });
    };

    // NOTE: We intentionally do NOT use MongoDB transactions here.
    // The current MongoDB setup throws:
    // "Transaction numbers are only allowed on a replica set member or mongos".
    // So we always run without withTransaction.
    await runCreateOrder();
  } catch (error) {
    const status = error?.statusCode || 500;
    // Return error details in development to unblock debugging.
    const debug = process.env.NODE_ENV !== "production" ? {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    } : undefined;

    console.error("createOrder failed:", {
      status,
      name: error?.name,
      message: error?.message,
    });

    return res.status(status).json({
      message: error?.message || "Failed to create order",
      ...(debug ? { debug } : {}),
    });
  } finally {
    // session may be null if transactions aren't supported
    if (session) session.endSession();
  }
};

