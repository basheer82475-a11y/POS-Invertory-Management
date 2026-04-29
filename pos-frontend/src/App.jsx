import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

<<<<<<< HEAD
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
=======
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import Login from "./pages/login";
import Products from "./pages/products";

const isAuthenticated = () => !!localStorage.getItem("token");
>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD

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

=======
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <Layout role="admin">
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Shared Routes */}
        <Route
          path="/pos"
          element={
            isAuthenticated() ? (
              <Layout role="user">
                <Pos />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Products page for cashier/admin */}
        <Route
          path="/products"
          element={
            isAuthenticated() ? (
              <Layout role="user">
                <div className="p-6">
                  <Products />
                </div>
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
>>>>>>> 79d119e8966b018fe6d96fae329216075b094abf
      </Routes>
    </BrowserRouter>
  );
}

export default App;

