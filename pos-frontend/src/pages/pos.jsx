import { useState, useEffect } from "react";
import { API } from "../services/api";

export default function POS() {
  const [cart, setCart] = useState([]);
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
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

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
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* 🛍 Products */}
      <div className="w-2/3 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => addToCart(p)}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-100 transition"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹{p.price}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Stock: {p.stock}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🧾 Cart */}
      <div className="w-1/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Cart</h2>

        {cart.length === 0 && <p className="text-gray-500">No items</p>}

        {cart.map((item) => (
          <div key={item._id} className="mb-3 border-b pb-2">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>₹{item.price * item.qty}</span>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => decreaseQty(item._id)}
                className="bg-gray-300 px-2 rounded"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => increaseQty(item._id)}
                className="bg-gray-300 px-2 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-500 text-white px-2 rounded ml-auto"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <hr className="my-3" />

        <h3 className="font-bold text-lg">Total: ₹{total}</h3>

        <button className="bg-green-500 text-white w-full mt-3 py-2 rounded hover:bg-green-600 transition">
          Checkout
        </button>
      </div>
    </div>
  );
}

