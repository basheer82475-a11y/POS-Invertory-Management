import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Html5Qrcode } from "html5-qrcode";


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
        </div>
      </div>
    ))}

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
