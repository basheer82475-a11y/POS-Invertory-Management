import React from "react";

const Dashboard = () => {
  // 👉 Sample data (replace with API later)
  const purchases = [
    { id: 1, product: "Laptop", price: 50000, quantity: 1, date: "2026-04-18" },
    { id: 2, product: "Mouse", price: 500, quantity: 2, date: "2026-04-18" },
    { id: 3, product: "Keyboard", price: 1500, quantity: 1, date: "2026-04-19" },
  ];

  // 👉 Calculations
  const totalRevenue = purchases.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalOrders = purchases.length;

  const totalItems = purchases.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // 👉 Top product
  const productCount = {};
  purchases.forEach((item) => {
    productCount[item.product] =
      (productCount[item.product] || 0) + item.quantity;
  });

  const topProduct = Object.keys(productCount).reduce((a, b) =>
    productCount[a] > productCount[b] ? a : b
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Sales Dashboard
      </h1>

      {/* 🔷 Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold text-blue-600">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Items Sold</h2>
          <p className="text-2xl font-bold text-purple-600">
            {totalItems}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Top Product</h2>
          <p className="text-xl font-bold text-orange-600">
            {topProduct}
          </p>
        </div>

      </div>

      {/* 🔷 Recent Purchases Table */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2">Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{item.product}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;