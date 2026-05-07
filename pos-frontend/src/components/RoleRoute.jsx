import { Navigate } from "react-router-dom";

const getStoredRole = () => localStorage.getItem("role");

export default function RoleRoute({ allowedRoles = [], children, fallbackPath = "/unauthorized" }) {
  const role = getStoredRole();

  if (!allowedRoles.length) return children;
  if (!role) return <Navigate to={fallbackPath} replace />;

  const hasAccess = allowedRoles.includes(role);
  if (!hasAccess) return <Navigate to={fallbackPath} replace />;

  return children;
}

