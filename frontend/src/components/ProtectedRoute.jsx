import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Checking your session..." />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
