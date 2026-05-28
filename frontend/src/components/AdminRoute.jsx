import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading admin access..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
