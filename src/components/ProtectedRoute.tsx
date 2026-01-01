import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useBackend } from '@/context/MockBackendContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { authState } = useBackend();
  const location = useLocation();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && authState.user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
