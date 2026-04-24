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
    return <p className="text-gray-600">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Product
      </button>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="p-2">{product.name}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

