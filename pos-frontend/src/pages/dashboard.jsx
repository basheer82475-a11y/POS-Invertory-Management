import React, { useEffect, useState } from "react";

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

    // Listen for updates from POS
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
