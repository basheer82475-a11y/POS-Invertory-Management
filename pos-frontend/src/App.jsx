import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import Products from "./pages/products";
import AdminProducts from "./pages/adminProducts";
import Inventory from "./pages/inventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/" element={<Login />} />

        {/* Admin-only routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin" layoutRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin" layoutRole="admin" className="p-6">
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        {/* Shared authenticated routes */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <Pos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute className="p-6">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute className="p-6">
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

