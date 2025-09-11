import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/sales/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Owner Dashboard</h2>
      <p>Daily Sales: ${data.dailySales}</p>
      <p>Weekly Sales: ${data.weeklySales}</p>
      <p>Monthly Sales: ${data.monthlySales}</p>

      <h3 className="mt-4">Low Stock Products</h3>
      <ul>
        {data.lowStock.map(p => (
          <li key={p.id}>{p.name} - {p.stock} left</li>
        ))}
      </ul>
    </div>
  );
}
