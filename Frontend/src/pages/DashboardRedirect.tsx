import { Navigate } from "react-router-dom";
import { useAuth, ROLE_DASHBOARD_ROUTE } from "./AuthContext";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={ROLE_DASHBOARD_ROUTE[user.role]} replace />;
}
