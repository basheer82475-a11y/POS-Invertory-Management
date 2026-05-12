import Order from "../models/Order.js";
import Product from "../models/Product.js";

const toInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

const toDateStartOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

// GET /api/admin/metrics?lowStockThreshold=10
export const getAdminMetrics = async (req, res) => {
  try {
    const lowStockThreshold = toInt(req.query.lowStockThreshold, 10);

    const [ordersCount, revenueAgg, lowStockCount, recentOrders] =
      await Promise.all([
        Order.countDocuments({}),
        Order.aggregate([
          { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]),
        Product.countDocuments({ stock: { $lte: lowStockThreshold } }),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate({
            path: "items.product",
            select: "name barcode", // lightweight; frontend uses item.name anyway
          })
          .select(
            "items customer paymentMode discount subtotal gst total createdAt"
          ),
      ]);

    const revenue = revenueAgg?.[0]?.revenue ?? 0;

    // Normalize recent orders shape for frontend
    const recent = recentOrders.map((o) => ({
      id: String(o._id),
      createdAt: o.createdAt,
      paymentMode: o.paymentMode,
      customer: o.customer,
      discount: o.discount,
      subtotal: o.subtotal,
      gst: o.gst,
      total: o.total,
      items: (o.items || []).map((it) => ({
        name: it.name,
        qty: it.qty,
        price: it.price,
        barcode: it.barcode,
      })),
    }));

    return res.json({
      revenue,
      ordersCount,
      lowStockCount,
      lowStockThreshold,
      recentOrders: recent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/sales-chart?rangeDays=30
export const getSalesChart = async (req, res) => {
  try {
    const rangeDays = Math.min(Math.max(toInt(req.query.rangeDays, 30), 1), 90);

    const end = new Date();
    const start = toDateStartOfDay(new Date(end.getTime() - (rangeDays - 1) * 24 * 60 * 60 * 1000));

    // Group by day using createdAt
    const agg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          total: 1,
        },
      },
      {
        $group: {
          _id: "$day",
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a complete series for the frontend
    const map = new Map((agg || []).map((x) => [x._id, x]));
    const labels = [];
    const revenueSeries = [];
    const ordersSeries = [];

    for (let i = 0; i < rangeDays; i++) {
      const d = toDateStartOfDay(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
      const key = d.toISOString().slice(0, 10);
      labels.push(key);
      revenueSeries.push(map.get(key)?.revenue ?? 0);
      ordersSeries.push(map.get(key)?.orders ?? 0);
    }

    return res.json({ labels, revenueSeries, ordersSeries, rangeDays });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/top-products?limit=5
export const getTopProducts = async (req, res) => {
  try {
    const limit = Math.min(Math.max(toInt(req.query.limit, 5), 1), 50);

    const agg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          qtySold: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
        },
      },
      { $sort: { qtySold: -1 } },
      { $limit: limit },
    ]);

    return res.json({
      topProducts: (agg || []).map((x) => ({
        id: String(x._id),
        name: x.name,
        qtySold: x.qtySold,
        revenue: x.revenue,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

