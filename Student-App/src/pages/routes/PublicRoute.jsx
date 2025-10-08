import { Navigate } from 'react-router-dom';

export default function PublicRoute({ isLoggedIn, children }) {
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
}
