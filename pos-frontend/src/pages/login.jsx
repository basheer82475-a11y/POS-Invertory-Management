import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy users (replace with backend later)
    const users = [
      { email: "admin@gmail.com", password: "1234", role: "admin" },
      { email: "manager@gmail.com", password: "1234", role: "manager" },
      { email: "user@gmail.com", password: "1234", role: "user" },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    // Save user
    localStorage.setItem("user", JSON.stringify(user));

    // Role-based navigation
    if (user.role === "admin") {
      navigate("/dashboard");
    } else if (user.role === "manager") {
      navigate("/inventory");
    } else {
      navigate("/pos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mt-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mt-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 mt-4"
        >
          Login
        </button>

        
      </form>
    </div>
  );
}
