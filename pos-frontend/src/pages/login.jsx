import { useState } from "react";
import { useNavigate } from "react-router-dom";
 feature/product-list-ui
import { API } from "../services/api";

import API from "../services/api";
main

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
feature/product-list-ui
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  main

  const navigate = useNavigate();

  const handleLogin = async () => {
 feature/product-list-ui
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Store data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "manager") {
        navigate("/inventory");
      } else {
        navigate("/pos");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
main
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}
main

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

