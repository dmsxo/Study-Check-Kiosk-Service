import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) return <></>;
  else return !isLoggedIn ? children : <Navigate to="/" replace />;
}
