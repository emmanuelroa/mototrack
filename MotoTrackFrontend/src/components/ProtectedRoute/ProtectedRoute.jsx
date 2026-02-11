import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, isAuthenticated }) => {
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;