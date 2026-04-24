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

