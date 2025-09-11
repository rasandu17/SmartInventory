import { useEffect, useState } from "react";
import api from "../api/api";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/sales/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  // Prepare chart data
  const salesData = [
    { name: "Daily", sales: data.dailySales },
    { name: "Weekly", sales: data.weeklySales },
    { name: "Monthly", sales: data.monthlySales }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Owner Dashboard</h2>

      {/* Sales Chart */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">⚠️ Low Stock Products</h3>
        {data.lowStock.length === 0 ? (
          <p className="text-green-600">All products are in stock ✅</p>
        ) : (
          <ul className="list-disc pl-6">
            {data.lowStock.map((p) => (
              <li key={p.id} className="text-red-600">
                {p.name} - {p.stock} left
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
