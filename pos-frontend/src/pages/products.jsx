<<<<<<< HEAD
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
=======
// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { API } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg font-medium text-gray-600">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-4">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
feature/product-list-ui
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
          Add Product
        </button>
 main
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">
                      <span
                        className={`py-1 px-2 rounded text-xs font-semibold ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf
