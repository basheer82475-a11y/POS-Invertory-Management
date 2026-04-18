// src/pages/Products.jsx
export default function Products() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Product
      </button>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2">Product 1</td>
            <td className="p-2">₹100</td>
            <td className="p-2">50</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}