import { Navigate, Outlet } from "react-router-dom";
import { getAdminToken } from "../../api/client";

export default function ProtectedRoute() {
  if (!getAdminToken()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
