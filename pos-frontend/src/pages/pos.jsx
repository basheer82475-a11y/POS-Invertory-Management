import { useEffect, useState } from "react";

export default function Pos() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("Cash");

  // Load products
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const exists = cart.find((c) => c.id === product.id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c.id === product.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Barcode add
  const handleBarcode = (e) => {
    if (e.key === "Enter") {
      const found = products.find((p) => p.barcode === barcode);
      if (found) addToCart(found);
      setBarcode("");
    }
  };

  // Update qty
  const updateQty = (id, type) => {
    setCart(
      cart
        .map((c) =>
          c.id === id
            ? { ...c, qty: type === "inc" ? c.qty + 1 : c.qty - 1 }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const discountAmount = (subtotal * discount) / 100;
  const gst = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + gst;

  // PAYMENT
  const handlePayment = () => {
    if (cart.length === 0) return alert("Cart is empty");

    const newOrder = {
      
      id: Date.now(),
      items: cart,
      total,
      payment,
      customer,
      date: new Date().toLocaleString(),
    };

    // Save orders
    const oldOrders = JSON.parse(localStorage.getItem("ordersList")) || [];
    localStorage.setItem(
      "ordersList",
      JSON.stringify([...oldOrders, newOrder])
    );

    // Update revenue
    const revenue = Number(localStorage.getItem("revenue")) || 0;
    localStorage.setItem("revenue", revenue + total);

    // Update stock
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const updated = allProducts.map((p) => {
      const found = cart.find((c) => c.id === p.id);
      return found ? { ...p, stock: p.stock - found.qty } : p;
    });

    localStorage.setItem("products", JSON.stringify(updated));

    // 🔔 Trigger dashboard update
    window.dispatchEvent(new Event("dataUpdated"));

    // Reset
    setCart([]);
    setCustomer({ name: "", phone: "" });

    alert("Payment Successful!");
  };

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">

      {/* LEFT - PRODUCTS */}
      <div>
        <h2 className="font-bold mb-2">Products</h2>

        <input
          placeholder="Scan barcode"
          className="border p-2 w-full mb-2"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleBarcode}
        />

        <div className="grid grid-cols-2 gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="border p-2 cursor-pointer"
              onClick={() => addToCart(p)}
            >
              <p>{p.name}</p>
              <p>₹{p.price}</p>
              <p className={p.stock <= 5 ? "text-red-500" : ""}>
                Stock: {p.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - CART */}
      <div>
        <h2 className="font-bold mb-2">Cart</h2>

        {/* Customer */}
        <input
          placeholder="Customer Name"
          className="border p-2 w-full mb-2"
          value={customer.name}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mb-2"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
        />

        {/* Cart items */}
        {cart.map((c) => (
          <div key={c.id} className="flex justify-between border p-2 mb-1">
            <span>{c.name}</span>
            <div>
              <button onClick={() => updateQty(c.id, "dec")}>-</button>
              <span className="px-2">{c.qty}</span>
              <button onClick={() => updateQty(c.id, "inc")}>+</button>
            </div>
            <span>₹{c.price * c.qty}</span>
            <button onClick={() => removeItem(c.id)}>x</button>
          </div>
        ))}

        {/* Discount */}
        <select
          className="border p-2 w-full mt-2"
          onChange={(e) => setDiscount(Number(e.target.value))}
        >
          <option value="0">No Discount</option>
          <option value="5">5%</option>
          <option value="10">10%</option>
          <option value="15">15%</option>
        </select>

        {/* Payment */}
        <select
          className="border p-2 w-full mt-2"
          onChange={(e) => setPayment(e.target.value)}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        {/* Summary */}
        <div className="mt-3 space-y-1">
          <p>Subtotal: ₹{subtotal}</p>
          <p>Discount: ₹{discountAmount}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <h2 className="font-bold">Total: ₹{total.toFixed(2)}</h2>
        </div>

        <button
          onClick={handlePayment}
          className="bg-green-600 text-white w-full mt-3 p-2"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}