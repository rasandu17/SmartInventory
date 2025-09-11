import { useEffect, useState } from "react";
import api from "../api/api";
import { jsPDF } from "jspdf";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      let salesData = [];
      for (const item of cart) {
        const res = await api.post("/sales", {
          productId: item.id,
          quantity: item.quantity,
          soldBy: 2, // replace with logged-in staff ID
        });
        salesData.push(res.data);
      }

      setLastSale({ cart, total, date: new Date() });
      generateReceipt(cart, total);

      alert("Sale completed!");
      setCart([]);
    } catch (err) {
      alert("Error processing sale");
    }
  };

  const generateReceipt = (cart, total) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Smart Inventory & Billing System", 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);

    let y = 40;
    doc.text("Items:", 20, y);
    y += 10;

    cart.forEach((item) => {
      doc.text(
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`,
        20,
        y
      );
      y += 10;
    });

    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    // Save PDF
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🛒 POS System</h2>

      {/* Products */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {products.map((p) => (
          <div key={p.id} className="border p-3 rounded-lg shadow-sm">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-gray-600">${p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Cart</h3>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b">
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-gray-300 px-2 rounded"
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => updateQuantity(item.id, +1)}
                      className="bg-gray-300 px-2 rounded"
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2">${item.price}</td>
                  <td className="p-2">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Total + Checkout */}
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Checkout & Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
