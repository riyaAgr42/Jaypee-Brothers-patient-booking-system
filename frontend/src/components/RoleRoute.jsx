import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const roleHome = {
  admin: "/admin",
  doctor: "/doctor",
  patient: "/dashboard"
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return children;
};

export default RoleRoute;
