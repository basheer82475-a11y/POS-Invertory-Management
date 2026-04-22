import { useState } from "react";

const initialProducts = [
  { id: 1, name: "Product A", category: "Food", price: 50, stock: 20, barcode: "111" },
  { id: 2, name: "Product B", category: "Drinks", price: 30, stock: 5, barcode: "222" },
];

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const totalProducts = products.length;
  const stockValue = products.reduce((a, p) => a + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const categories = new Set(products.map(p => p.category)).size;

  const saveProduct = () => {
    if (form.id) {
      setProducts(products.map(p => (p.id === form.id ? form : p)));
    } else {
      setProducts([...products, { ...form, id: Date.now() }]);
    }
    setForm(null);
    alert("Saved!");
  };

  const deleteProduct = id => {
    setProducts(products.filter(p => p.id !== id));
    alert("Deleted!");
  };

  const stockBadge = stock => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Products" value={totalProducts} />
        <Stat title="Stock Value" value={`₹${stockValue}`} />
        <Stat title="Low Stock" value={lowStock} />
        <Stat title="Categories" value={categories} />
      </div>

      {/* Search + Add */}
      <div className="flex gap-4">
        <input
          className="border p-2 w-full"
          placeholder="Search by name, category, barcode"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4"
          onClick={() => setForm({ name: "", category: "", price: 0, stock: 0, barcode: "" })}
        >
          Add
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} className="text-center border-t">
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <span className={`text-white px-2 ${stockBadge(p.stock)}`}>
                  {p.stock === 0 ? "OUT" : p.stock <= 5 ? "LOW" : "IN"}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  className="bg-yellow-500 px-2"
                  onClick={() => setForm(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 space-y-3 w-80">
            <h2 className="font-bold">Product</h2>
            {['name','category','price','stock','barcode'].map(field => (
              <input
                key={field}
                className="border p-2 w-full"
                placeholder={field}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
              />
            ))}
            <div className="flex justify-between">
              <button className="bg-green-600 text-white px-4" onClick={saveProduct}>Save</button>
              <button className="bg-gray-400 px-4" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white shadow p-4 text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
