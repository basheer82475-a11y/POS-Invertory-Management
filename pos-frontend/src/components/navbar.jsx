// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">

      {/* Left */}
      <h1 className="text-xl font-bold">POS System</h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded"
        />

        {/* Profile */}
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Profile
        </button>

        {/* Logout */}
        <button className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>

      </div>
    </div>
  );
}