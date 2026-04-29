import React, { useState, useEffect } from "react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["General"]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "General",
    description: "",
    price: "",
    cost: "",
    tax: "",
    stock: "",
    minStock: "",
    sku: "",
    barcode: "",
    image: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updated;
    if (form.id) {
      updated = products.map((p) => (p.id === form.id ? form : p));
    } else {
      const newProduct = { ...form, id: Date.now().toString() };
      updated = [...products, newProduct];
    }

    saveProducts(updated);
    setForm({
      id: "",
      name: "",
      category: "General",
      description: "",
      price: "",
      cost: "",
      tax: "",
      stock: "",
      minStock: "",
      sku: "",
      barcode: "",
      image: "",
    });
  };

  const editProduct = (p) => setForm(p);

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const filtered = products.filter((p) => {
    return (
      (filterCategory === "all" || p.category === filterCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.includes(search))
    );
  });

  const lowStock = products.filter((p) => p.stock < p.minStock);
  const outOfStock = products.filter((p) => p.stock === 0);

  const addCategory = (name) => {
    if (!categories.includes(name)) setCategories([...categories, name]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Management</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 mt-4">
        <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2" />

        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2">
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border p-2" />

        <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2" />

        <input placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="border p-2" />

        <input placeholder="Tax %" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} className="border p-2" />

        <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border p-2" />

        <input placeholder="Min Stock" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className="border p-2" />

        <input placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="border p-2" />

        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border p-2 col-span-3" />

        <button className="bg-blue-500 text-white p-2 col-span-3">
          {form.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* SEARCH & FILTER */}
      <div className="mt-4 flex gap-2">
        <input placeholder="Search" className="border p-2" onChange={(e) => setSearch(e.target.value)} />

        <select onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="all">All</option>
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>
      </div>

      {/* ALERTS */}
      <div className="mt-4">
        <h2 className="text-red-500">Low Stock</h2>
        {lowStock.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}

        <h2 className="text-red-700">Out of Stock</h2>
        {outOfStock.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>

      {/* TABLE */}
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="text-center border">
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </td>
              <td>
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
