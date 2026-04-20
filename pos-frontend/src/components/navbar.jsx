import { useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-full bg-white shadow-md border-b px-6 py-3 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">
        POS System
      </h1>

      {/* Search */}
      <div className="w-1/3">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <span className="text-gray-600 capitalize">{role}</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;