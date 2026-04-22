import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

// Pages
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import InventoryPage from "./pages/Inventorypage"; // ✅ correct path
import Products from "./pages/products";

// 🔐 Role-based protection
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role"); // "admin" or "user"

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Login */}
        <Route path="/" element={<Login />} />

        {/* 🛠 Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Layout role="admin">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute role="admin">
              <Layout role="admin">
                <InventoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Layout role="admin">
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 💰 User POS */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute role="user">
              <Layout role="user">
                <Pos />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;