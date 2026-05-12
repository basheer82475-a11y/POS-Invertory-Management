import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";

import Products from "./pages/products";
import Inventory from "./pages/Inventorypage";
import AdminProducts from "./pages/adminProducts";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <Dashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />



        {/* Inventory */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <Inventory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Products (shared catalog for admin/manager) */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <div className="p-6">
                  <Products />
                </div>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* POS */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager", "cashier"]}>
                <Pos />
              </RoleRoute>
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


