import { useState } from "react";
import Login from "./components/Login";
import POS from "./components/POS";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (token) => {
    setToken(token);

    // Decode JWT to get role
    const payload = JSON.parse(atob(token.split(".")[1]));
    setRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Inventory System</h1>
      {role === "owner" ? <Dashboard /> : <POS />}
    </div>
  );
}

export default App;
