import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const isAuthenticated = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

export default function ProtectedRoute({
  children,
  requiredRole,
  layoutRole,
  className,
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const userRole = getRole();

  if (requiredRole && userRole !== requiredRole) {
    const fallback = userRole === "admin" ? "/admin/products" : "/pos";
    return <Navigate to={fallback} replace />;
  }

  return (
    <Layout role={layoutRole || userRole}>
      <div className={className || ""}>{children}</div>
    </Layout>
  );
}

