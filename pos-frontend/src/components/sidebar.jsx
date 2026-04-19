const role = localStorage.getItem("role");

{role === "admin" && (
  <>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/products">Products</Link>
    <Link to="/inventory">Inventory</Link>
  </>
)}

{role === "user" && (
  <>
    <Link to="/pos">POS</Link>
  </>
)}