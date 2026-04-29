<<<<<<< HEAD
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
=======
import React, { useEffect, useRef, useState } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button";

// NOTE: Uses html5-qrcode for camera scanning // npm install html5-qrcode import { Html5Qrcode } from "html5-qrcode";

const PRODUCTS = [ { id: 1, name: "Item A", price: 100, barcode: "111" }, { id: 2, name: "Item B", price: 200, barcode: "222" }, { id: 3, name: "Item C", price: 300, barcode: "333" } ];

export default function POSPage() { const [cart, setCart] = useState([]); const [search, setSearch] = useState(""); const [barcodeInput, setBarcodeInput] = useState(""); const [customer, setCustomer] = useState({ name: "", phone: "" }); const [discount, setDiscount] = useState(0); const [paymentMode, setPaymentMode] = useState("Cash");

const scannerRef = useRef(null); const html5QrCodeRef = useRef(null);

useEffect(() => { html5QrCodeRef.current = new Html5Qrcode("reader"); }, []);

const startScanner = async () => { try { await html5QrCodeRef.current.start( { facingMode: "environment" }, { fps: 10, qrbox: 250 }, (decodedText) => { handleBarcode(decodedText); } ); } catch (err) { console.error("Camera error", err); } };

const stopScanner = async () => { try { await html5QrCodeRef.current.stop(); } catch {} };

const handleBarcode = (code) => { const product = PRODUCTS.find((p) => p.barcode === code); if (product) addToCart(product); };

const addToCart = (product) => { setCart((prev) => { const exists = prev.find((item) => item.id === product.id); if (exists) { return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item ); } return [...prev, { ...product, qty: 1 }]; }); };

const updateQty = (id, delta) => { setCart((prev) => prev .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item ) .filter((item) => item.qty > 0) ); };

const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0); const discountAmt = (subtotal * discount) / 100; const gst = (subtotal - discountAmt) * 0.18; const total = subtotal - discountAmt + gst;

const handleCheckout = () => { const newOrder = { id: Date.now(), cart, total, customer, paymentMode, date: new Date() };

const oldOrders = JSON.parse(localStorage.getItem("ordersList") || "[]");
const updatedOrders = [...oldOrders, newOrder];

localStorage.setItem("ordersList", JSON.stringify(updatedOrders));

// DASHBOARD AUTO UPDATE EVENT
window.dispatchEvent(new Event("dataUpdated"));

alert("Order placed!");
setCart([]);

};

const filteredProducts = PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) );

return ( <div className="p-4 grid grid-cols-3 gap-4"> {/* LEFT - PRODUCTS */} <div className="col-span-2"> <input placeholder="Search product" className="border p-2 w-full mb-2" onChange={(e) => setSearch(e.target.value)} />

<input
      placeholder="Scan barcode manually"
      className="border p-2 w-full mb-2"
      value={barcodeInput}
      onChange={(e) => setBarcodeInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBarcode(barcodeInput);
      }}
    />

    <div className="flex gap-2 mb-2">
      <Button onClick={startScanner}>Start Camera</Button>
      <Button onClick={stopScanner}>Stop Camera</Button>
    </div>

    <div id="reader" className="mb-4" />

    <div className="grid grid-cols-3 gap-2">
      {filteredProducts.map((p) => (
        <Card key={p.id} onClick={() => addToCart(p)}>
          <CardContent>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>

  {/* RIGHT - CART */}
  <div>
    <h2 className="text-lg font-bold mb-2">Cart</h2>

    {cart.map((item) => (
      <div key={item.id} className="flex justify-between mb-2">
        <span>{item.name}</span>
        <div>
          <button onClick={() => updateQty(item.id, -1)}>-</button>
          <span className="mx-2">{item.qty}</span>
          <button onClick={() => updateQty(item.id, 1)}>+</button>
>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf
        </div>
      </div>
    ))}

<<<<<<< HEAD
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
=======
    <input
      placeholder="Customer Name"
      className="border p-2 w-full mt-2"
      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
    />

    <input
      placeholder="Phone"
      className="border p-2 w-full mt-2"
      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
    />

    <select
      className="border p-2 w-full mt-2"
      onChange={(e) => setDiscount(Number(e.target.value))}
    >
      <option value={0}>No Discount</option>
      <option value={5}>5%</option>
      <option value={10}>10%</option>
      <option value={15}>15%</option>
    </select>

    <select
      className="border p-2 w-full mt-2"
      onChange={(e) => setPaymentMode(e.target.value)}
    >
      <option>Cash</option>
      <option>Card</option>
      <option>UPI</option>
    </select>

    <div className="mt-4">
      <p>Subtotal: ₹{subtotal}</p>
      <p>GST (18%): ₹{gst.toFixed(2)}</p>
      <p>Total: ₹{total.toFixed(2)}</p>
    </div>

    <Button className="mt-4 w-full" onClick={handleCheckout}>
      Checkout
    </Button>
  </div>
</div>

); }
>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf
