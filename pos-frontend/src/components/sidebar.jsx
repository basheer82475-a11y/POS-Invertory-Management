import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      <ul className="space-y-3">
        {role === "admin" && (
          <>
            <li>
              <Link
                to="/dashboard"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Manage Products
              </Link>
            </li>
            <li>
              <Link
                to="/inventory"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Inventory
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/pos" className="block p-2 rounded hover:bg-gray-700">
            POS
          </Link>
        </li>

        <li>
          <Link
            to="/products"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Products
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

