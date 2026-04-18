// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-900 text-white h-screen p-4">

      <h2 className="text-lg font-bold mb-6">Menu</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/pos" className="hover:bg-gray-700 p-2 rounded">
          POS
        </Link>

        <Link to="/products" className="hover:bg-gray-700 p-2 rounded">
          Products
        </Link>

        <Link to="/inventory" className="hover:bg-gray-700 p-2 rounded">
          Inventory
        </Link>
      </nav>
    </div>
  );
}