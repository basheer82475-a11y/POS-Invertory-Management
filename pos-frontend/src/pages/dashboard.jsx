import React, { useEffect, useState } from "react";

<<<<<<< HEAD
export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const ordersData = JSON.parse(localStorage.getItem("orders")) || [];
      const productsData = JSON.parse(localStorage.getItem("products")) || [];
      setOrders(ordersData);
      setProducts(productsData);
    };

    loadData();
    window.addEventListener("orderPlaced", loadData);

    return () => window.removeEventListener("orderPlaced", loadData);
  }, []);

  // ================= CALCULATIONS =================

  const today = new Date().toLocaleDateString();

  const todaySales = orders
    .filter((o) => new Date(o.time).toLocaleDateString() === today)
    .reduce((sum, o) => sum + o.total, 0);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const weeklyRevenue = orders
    .slice(-7)
    .reduce((sum, o) => sum + o.total, 0);

  const monthlyRevenue = orders
    .slice(-30)
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;

  // Top Products
  const productMap = {};
  orders.forEach((o) => {
    o.items.forEach((i) => {
      productMap[i.name] = (productMap[i.name] || 0) + i.qty;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Low Stock Alert
  const lowStock = products.filter((p) => p.stock && p.stock < 5);

  // Recent Transactions
  const recent = [...orders].slice(-5).reverse();

  // ================= UI =================

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <p>Today's Sales</p>
          <h2>₹{todaySales}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p>Total Revenue</p>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <p>Total Orders</p>
          <h2>{totalOrders}</h2>
        </div>

        <div className="bg-purple-100 p-4 rounded">
          <p>Total Products</p>
          <h2>{products.length}</h2>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Sales Overview</h2>
        <p>Weekly Revenue: ₹{weeklyRevenue}</p>
        <p>Monthly Revenue: ₹{monthlyRevenue}</p>
      </div>

      {/* Top Products */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Top Products</h2>
        {topProducts.map(([name, qty], index) => (
          <div key={index} className="border p-2 mt-2">
            {name} - Sold: {qty}
          </div>
        ))}
      </div>

      {/* Low Stock */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-red-600">
          Low Stock Alert
        </h2>
        {lowStock.length === 0 ? (
          <p>No low stock items</p>
        ) : (
          lowStock.map((p) => (
            <div key={p.id} className="border p-2 mt-2 text-red-500">
              {p.name} - Stock: {p.stock}
            </div>
          ))
        )}
      </div>

      {/* Recent Transactions */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        {recent.map((o) => (
          <div key={o.id} className="border p-2 mt-2">
            ₹{o.total} - {o.paymentMethod}
          </div>
        ))}
      </div>

      {/* Simple Graph */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Revenue Trend</h2>
        <div className="flex gap-2 items-end h-40 bg-gray-100 p-2">
          {orders.slice(-10).map((o, i) => (
            <div
              key={i}
              className="bg-blue-500 w-6"
              style={{ height: `${o.total / 10}px` }}
              title={`₹${o.total}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
=======
const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const loadData = () => {
    const storedOrders = JSON.parse(localStorage.getItem("ordersList")) || [];

    setOrders(storedOrders);

    const totalRevenue = storedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    setRevenue(totalRevenue);
  };

  useEffect(() => {
    loadData();

    // 🔥 Listen for updates from POS
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("dataUpdated", handleUpdate);

    return () => {
      window.removeEventListener("dataUpdated", handleUpdate);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Revenue */}
        <div style={cardStyle}>
          <h3>Revenue</h3>
          <p>₹ {revenue}</p>
        </div>

        {/* Orders */}
        <div style={cardStyle}>
          <h3>Orders</h3>
          <p>{orders.length}</p>
        </div>

        {/* Stock (Static for now) */}
        <div style={cardStyle}>
          <h3>Stock</h3>
          <p>120</p>
        </div>

        {/* Low Stock */}
        <div style={cardStyle}>
          <h3>Low Stock</h3>
          <p>5 items</p>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ marginTop: "30px" }}>
        <h3>Recent Orders</h3>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={orderStyle}>
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Total:</b> ₹ {order.total}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  flex: 1,
  padding: "20px",
  background: "#f5f5f5",
  borderRadius: "10px",
  textAlign: "center",
};

const orderStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  marginTop: "10px",
  borderRadius: "5px",
};

export default Dashboard;
>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf
