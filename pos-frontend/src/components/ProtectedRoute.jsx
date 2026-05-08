import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const isAuthenticated = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

export default function ProtectedRoute({
  children,
  layoutRole,
  className,
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const userRole = getRole();

  // If role is missing for any reason, block access (prevents accidental route access)
  if (!userRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Layout role={layoutRole || userRole}>
      <div className={className || ""}>{children}</div>
    </Layout>
  );
}


