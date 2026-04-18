// src/pages/Inventory.jsx
export default function Inventory() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Product</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2">Product 1</td>
            <td className="p-2">10</td>
            <td className="p-2 text-red-500">Low</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}