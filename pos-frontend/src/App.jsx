import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import Login from "./pages/login";
import Products from "./pages/products";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

