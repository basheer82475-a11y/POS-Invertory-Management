import React, { useEffect, useMemo, useState } from "react";
// NOTE: recharts can break in some React/react-dom combinations.
// This dashboard uses simple SVG charts to avoid hook/context issues.


import { API } from "../services/api";

const cardStyle = {
  flex: 1,
  padding: "18px",
  background: "#ffffff",
  borderRadius: "14px",
  textAlign: "center",
  border: "1px solid #eef2ff",
  boxShadow: "0 10px 24px rgba(17, 24, 39, 0.05)",
};


const orderCardStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  marginTop: "10px",
  borderRadius: "8px",
  background: "#fff",
};

const fmtINR = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "₹0";
  return `₹${x.toLocaleString("en-IN")}`;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [revenue, setRevenue] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  const [recentOrders, setRecentOrders] = useState([]);

  const [chartRangeDays, setChartRangeDays] = useState(30);
  const [labels, setLabels] = useState([]);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [ordersSeries, setOrdersSeries] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const loadAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [metricsRes, chartRes, topRes] = await Promise.all([
        API.get(`/admin/metrics?lowStockThreshold=${lowStockThreshold}`),
        API.get(`/admin/sales-chart?rangeDays=${chartRangeDays}`),
        API.get(`/admin/top-products?limit=5`),
      ]);

      const metrics = metricsRes.data || {};
      setRevenue(metrics.revenue ?? 0);
      setOrdersCount(metrics.ordersCount ?? 0);
      setLowStockCount(metrics.lowStockCount ?? 0);
      setLowStockThreshold(metrics.lowStockThreshold ?? lowStockThreshold);
      setRecentOrders(metrics.recentOrders ?? []);

      const chart = chartRes.data || {};
      setLabels(chart.labels ?? []);
      setRevenueSeries(chart.revenueSeries ?? []);
      setOrdersSeries(chart.ordersSeries ?? []);

      const top = topRes.data || {};
      setTopProducts(top.topProducts ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Update dashboard when POS places an order
    const handleUpdate = () => {
      loadAll();
    };

    window.addEventListener("dataUpdated", handleUpdate);
    return () => window.removeEventListener("dataUpdated", handleUpdate);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [lowStockThreshold, chartRangeDays]);


  const chartData = useMemo(() => {
    const out = [];
    const len = Math.min(labels.length, revenueSeries.length, ordersSeries.length);
    for (let i = 0; i < len; i++) {
      out.push({
        day: labels[i],
        revenue: revenueSeries[i],
        orders: ordersSeries[i],
      });
    }
    return out;
  }, [labels, revenueSeries, ordersSeries]);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {error && (
        <div
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: 12,
            border: "1px solid #f5c2c7",
            background: "#f8d7da",
            borderRadius: 8,
          }}
        >
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <div style={cardStyle}>
          <h3>Revenue</h3>
          <p>{fmtINR(revenue)}</p>
        </div>
        <div style={cardStyle}>
          <h3>Orders</h3>
          <p>{ordersCount}</p>
        </div>
        <div style={cardStyle}>
          <h3>Low Stock</h3>
          <p>
            {lowStockCount} items (≤ {lowStockThreshold})
          </p>
        </div>
        <div style={cardStyle}>
          <h3>Range</h3>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <select
              value={chartRangeDays}
              onChange={(e) => setChartRangeDays(Number(e.target.value))}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
            </select>
          </div>
        </div>
      </div>

  


      <div style={{ marginTop: 22 }}>
        <h3>Top selling products</h3>
        {topProducts.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {topProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 14,
                  minWidth: 220,
                }}
              >
                <b>{p.name}</b>
                <div style={{ marginTop: 8 }}>Qty sold: {p.qtySold}</div>
                <div style={{ marginTop: 4 }}>Revenue: {fmtINR(p.revenue)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "26px" }}>
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} style={orderCardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div>
                    <b>Order ID:</b> {order.id}
                  </div>
                  <div>
                    <b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>
                    <b>Total:</b> {fmtINR(order.total)}
                  </div>
                  <div>
                    <b>Payment:</b> {order.paymentMode || "-"}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, color: "#555" }}>
                <b>Customer:</b> {order.customer?.name || "-"} ({order.customer?.phone || "-"})
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <b>Items:</b>
                  <ul style={{ margin: "8px 0 0 18px" }}>
                    {order.items.slice(0, 6).map((it, idx) => (
                      <li key={`${it.name}-${idx}`}>
                        {it.name} — {it.qty} × {fmtINR(it.price)}
                      </li>
                    ))}
                    {order.items.length > 6 && <li>…and {order.items.length - 6} more</li>}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 18, color: "#888", fontSize: 12 }}>
        Data is fetched from backend: <code>/api/admin/*</code>
      </div>
    </div>
  );
};

export default Dashboard;

