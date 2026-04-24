import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import Login from "./pages/login";
import Products from "./pages/products";
import AdminProducts from "./pages/adminProducts";

const isAuthenticated = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
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

        {/* User POS */}
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

        {/* Products page for all logged-in users */}
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

        {/* Admin Product Management */}
        <Route
          path="/admin/products"
          element={
            isAuthenticated() && getRole() === "admin" ? (
              <Layout role="admin">
                <div className="p-6">
                  <AdminProducts />
                </div>
              </Layout>
            ) : (
              <Navigate to="/products" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

