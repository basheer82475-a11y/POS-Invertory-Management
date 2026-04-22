import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    stock: 0,
    lowStock: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const loadData = () => {
    try {
      const revenue = Number(localStorage.getItem("revenue")) || 0;

      const orders = JSON.parse(localStorage.getItem("ordersList") || "[]");
      const products = JSON.parse(localStorage.getItem("products") || "[]");

      const totalStock = products.reduce(
        (sum, p) => sum + (p?.stock || 0),
        0
      );

      const lowStock = products.filter(
        (p) => p?.stock > 0 && p.stock <= 5
      ).length;

      setStats({
        revenue,
        orders: orders.length,
        stock: totalStock,
        lowStock,
      });

      setRecentOrders(orders.slice(-5).reverse());
      setProducts(products);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("dataUpdated", loadData);
    return () => window.removeEventListener("dataUpdated", loadData);
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Revenue" value={`₹${stats.revenue}`} />
        <Card title="Orders" value={stats.orders} />
        <Card title="Stock" value={stats.stock} />
        <Card title="Low Stock" value={stats.lowStock} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 shadow">
        <h2 className="font-bold mb-2">Recent Orders</h2>

        {(recentOrders || []).length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={i}>
                  <td>{o?.id}</td>
                  <td>₹{o?.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stock */}
      <div className="bg-white p-4 shadow">
        <h2 className="font-bold mb-2">Stock</h2>

        {(products || []).length === 0 ? (
          <p>No products</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p) => (
                <tr key={p?.id}>
                  <td>{p?.name}</td>
                  <td className={p?.stock <= 5 ? "text-red-500" : ""}>
                    {p?.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow p-4 text-center">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}