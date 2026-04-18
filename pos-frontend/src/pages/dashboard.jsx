// src/pages/Dashboard.jsx
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2>Total Sales</h2>
          <p className="text-xl font-bold">₹10,000</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2>Orders</h2>
          <p className="text-xl font-bold">120</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2>Products</h2>
          <p className="text-xl font-bold">80</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2>Low Stock</h2>
          <p className="text-xl font-bold text-red-500">5</p>
        </div>
      </div>
    </div>
  );
}