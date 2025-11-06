import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn === null) return <></>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
