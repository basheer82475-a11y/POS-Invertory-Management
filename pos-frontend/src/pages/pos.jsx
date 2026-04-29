import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

// ===================== POS PAGE =====================
export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [received, setReceived] = useState(0);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  // Load Products
  useEffect(() => {
    setProducts([
      { id: "123", name: "Item A", price: 100 },
      { id: "456", name: "Item B", price: 200 },
      { id: "789", name: "Item C", price: 300 },
    ]);
  }, []);

  // Barcode Scanner
  useEffect(() => {
    if (scannerActive) {
      const reader = new BrowserMultiFormatReader();
      reader.decodeFromVideoDevice(null, "video", (result) => {
        if (result) {
          handleScan(result.text);
          setScannerActive(false);
          reader.reset();
        }
      });
    }
  }, [scannerActive]);

  const handleScan = (barcode) => {
    const product = products.find((p) => p.id === barcode);
    if (product) addToCart(product);
    else alert("Product not found");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const balance = received - total;

  const placeOrder = () => {
    const order = {
      id: Date.now(),
      items: cart,
      total,
      paymentMethod,
      customer,
      time: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...orders, order]));

    window.dispatchEvent(new Event("orderPlaced"));

    printBill(order);
    setCart([]);
  };

  const printBill = (order) => {
    const w = window.open("", "PRINT", "height=600,width=400");
    w.document.write(`
      <h2>Receipt</h2>
      <p>${new Date(order.time).toLocaleString()}</p>
      <p>${order.customer.name} (${order.customer.phone})</p>
      <ul>
        ${order.items
          .map((i) => `<li>${i.name} x${i.qty} = ₹${i.price * i.qty}</li>`)
          .join("")}
      </ul>
      <h3>Total: ₹${order.total}</h3>
      <p>Payment: ${order.paymentMethod}</p>
    `);
    w.print();
    w.close();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search)
  );

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {/* LEFT */}
      <div>
        <h2 className="text-xl font-bold">Search / Scan</h2>
        <input
          placeholder="Search name / SKU / barcode"
          className="border p-2 w-full mt-2"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setScannerActive(true)}
          className="bg-blue-500 text-white px-3 py-2 mt-2"
        >
          Scan
        </button>
        {scannerActive && <video id="video" width="250" />}

        {filteredProducts.map((p) => (
          <div key={p.id} className="border p-2 mt-2">
            {p.name} - ₹{p.price}
            <button
              onClick={() => addToCart(p)}
              className="bg-green-500 text-white px-2 ml-2"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div>
        <h2 className="text-xl font-bold">Cart</h2>
        {cart.map((i) => (
          <div key={i.id} className="border p-2 mt-2">
            {i.name} - ₹{i.price}
            <div>
              <button onClick={() => updateQty(i.id, -1)}>-</button>
              {i.qty}
              <button onClick={() => updateQty(i.id, 1)}>+</button>
              <button onClick={() => removeItem(i.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* BILLING */}
      <div>
        <h2 className="text-xl font-bold">Billing</h2>
        <p>Subtotal: ₹{subtotal}</p>
        <p>GST: ₹{tax.toFixed(2)}</p>
        <p>Total: ₹{total.toFixed(2)}</p>

        <select onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        <input
          placeholder="Received Amount"
          type="number"
          className="border p-2 w-full mt-2"
          onChange={(e) => setReceived(Number(e.target.value))}
        />

        <p>Balance: ₹{balance.toFixed(2)}</p>

        <input
          placeholder="Customer Name"
          className="border p-2 w-full mt-2"
          onChange={(e) =>
            setCustomer((c) => ({ ...c, name: e.target.value }))
          }
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mt-2"
          onChange={(e) =>
            setCustomer((c) => ({ ...c, phone: e.target.value }))
          }
        />

        <button
          onClick={placeOrder}
          className="bg-purple-600 text-white px-4 py-2 mt-4 w-full"
        >
          Generate & Print
        </button>

        <button
          onClick={() => setCart([])}
          className="bg-red-500 text-white px-4 py-2 mt-2 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ===================== DASHBOARD =====================
export function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(data);
    };

    load();
    window.addEventListener("orderPlaced", load);
    return () => window.removeEventListener("orderPlaced", load);
  }, []);

  const today = new Date().toLocaleDateString();

  const todaySales = orders
    .filter((o) => new Date(o.time).toLocaleDateString() === today)
    .reduce((sum, o) => sum + o.total, 0);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const productMap = {};
  orders.forEach((o) => {
    o.items.forEach((i) => {
      productMap[i.name] = (productMap[i.name] || 0) + i.qty;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recent = [...orders].slice(-5).reverse();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-100 p-3">Today: ₹{todaySales}</div>
        <div className="bg-green-100 p-3">Revenue: ₹{totalRevenue}</div>
        <div className="bg-yellow-100 p-3">Orders: {orders.length}</div>
        <div className="bg-purple-100 p-3">
          Products: {Object.keys(productMap).length}
        </div>
      </div>

      <h2 className="mt-6 font-bold">Top Products</h2>
      {topProducts.map(([name, qty], i) => (
        <div key={i}>{name} - {qty}</div>
      ))}

      <h2 className="mt-6 font-bold">Recent Transactions</h2>
      {recent.map((o) => (
        <div key={o.id}>
          ₹{o.total} - {o.paymentMethod}
        </div>
      ))}
    </div>
  );
}
