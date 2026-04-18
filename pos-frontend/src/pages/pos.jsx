// src/pages/POS.jsx
// import { useCartStore } from "../store/useCartStore";

export default function POS() {
  const { cart, addToCart } = useCartStore();

  const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
  ];

  return (
    <div className="flex gap-4">

      {/* Product List */}
      <div className="w-2/3 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Products</h2>

        <div className="grid grid-cols-3 gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white p-3 shadow rounded cursor-pointer hover:bg-blue-100"
            >
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-2">Cart</h2>

        {cart.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}

        <hr className="my-2" />

        <h3 className="font-bold">
          Total: ₹{cart.reduce((a, b) => a + b.price, 0)}
        </h3>

        <button className="bg-green-500 text-white w-full mt-3 py-2 rounded">
          Checkout
        </button>
      </div>

    </div>
  );
}