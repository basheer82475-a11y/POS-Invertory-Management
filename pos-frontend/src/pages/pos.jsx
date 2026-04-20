import { useState } from "react";

export default function POS() {
  const [cart, setCart] = useState([]);

  // ✅ Products with name & price
  const products = [
    { id: 1, name: "laptop", price: 50000 },
    { id: 2, name: "Mouse", price: 500 },
    { id: 3, name: "Keyboaed", price: 1500 },
  ];

  // ✅ Add to cart
  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);

    if (exist) {
      // increase quantity
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      // add new item
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ➕ Increase qty
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // ➖ Decrease qty
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ❌ Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="flex gap-4">

      {/* 🛍 Products */}
      <div className="w-2/3 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Products</h2>

        <div className="grid grid-cols-3 gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-100"
            >
              <h3 className="font-semibold">{p.name}</h3>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧾 Cart */}
      <div className="w-1/3 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Cart</h2>

        {cart.length === 0 && <p>No items</p>}

        {cart.map((item) => (
          <div key={item.id} className="mb-3 border-b pb-2">

            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>₹{item.price * item.qty}</span>
            </div>

            {/* Quantity controls */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => decreaseQty(item.id)}
                className="bg-gray-300 px-2 rounded"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => increaseQty(item.id)}
                className="bg-gray-300 px-2 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 text-white px-2 rounded ml-auto"
              >
                Remove
              </button>
            </div>

          </div>
        ))}

        <hr className="my-3" />

        <h3 className="font-bold text-lg">Total: ₹{total}</h3>

        <button className="bg-green-500 text-white w-full mt-3 py-2 rounded">
          Checkout
        </button>
      </div>

    </div>
  );
}