import React, { useState, useEffect } from "react";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    cost: "",
    category: "",
    barcode: "",
    stock: "",
  });

  // Load products
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  // Save products
  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };

  // Add or Update Product
  const handleSubmit = (e) => {
    e.preventDefault();

    let updated;
    if (form.id) {
      updated = products.map((p) =>
        p.id === form.id ? { ...form, stock: Number(form.stock) } : p
      );
    } else {
      const newProduct = {
        ...form,
        id: Date.now().toString(),
        stock: Number(form.stock),
      };
      updated = [...products, newProduct];
    }

    saveProducts(updated);
    setForm({ id: "", name: "", price: "", cost: "", category: "", barcode: "", stock: "" });
  };

  const editProduct = (p) => setForm(p);

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  // Stock update
  const updateStock = (id, change) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stock: p.stock + change } : p
    );
    saveProducts(updated);
  };

  // Filters
  const filtered = products.filter((p) => {
    return (
      (categoryFilter === "all" || p.category === categoryFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.includes(search))
    );
  });

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2" />
        <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2" />
        <input placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="border p-2" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2" />
        <input placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="border p-2" />
        <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border p-2" />

        <button className="bg-blue-500 text-white p-2 col-span-3">
          {form.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* FILTERS */}
      <div className="mt-4 flex gap-2">
        <input placeholder="Search" className="border p-2" onChange={(e) => setSearch(e.target.value)} />
        <select onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2">
          <option value="all">All</option>
          {[...new Set(products.map((p) => p.category))].map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>
      </div>

      {/* ALERTS */}
      <div className="mt-4">
        <h2 className="text-red-500">Low Stock</h2>
        {lowStock.map((p) => (
          <div key={p.id}>{p.name} ({p.stock})</div>
        ))}

        <h2 className="text-red-700 mt-2">Out of Stock</h2>
        {outOfStock.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>

      {/* TABLE */}
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>ID</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="text-center border">
              <td>{p.name}</td>
              <td>{p.id}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => updateStock(p.id, 1)}>+1</button>
                <button onClick={() => updateStock(p.id, -1)}>-1</button>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
