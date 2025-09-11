import { useEffect, useState } from "react";
import api from "../api/api";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        await api.post("/sales", {
          productId: item.id,
          quantity: item.quantity,
          soldBy: 2 // staff ID, replace dynamically
        });
      }
      alert("Sale completed!");
      setCart([]);
    } catch (err) {
      alert("Error processing sale");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">POS</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-2">
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)} className="bg-green-500 text-white p-1 mt-2">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3>Cart Total: ${total.toFixed(2)}</h3>
        <button onClick={handleCheckout} className="bg-blue-500 text-white p-2 mt-2">
          Checkout
        </button>
      </div>
    </div>
  );
}
