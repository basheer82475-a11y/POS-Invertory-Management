import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Pos from "./pages/pos";
import Login from "./pages/login";

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
            <Layout role="admin">
              <Dashboard />
            </Layout>
          }
        />

        {/* User POS */}
        <Route
          path="/pos"
          element={
            <Layout role="user">
              <Pos />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;