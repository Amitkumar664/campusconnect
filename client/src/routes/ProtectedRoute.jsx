import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-campus-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-campus-primary/20 border-t-campus-primary rounded-full animate-spin" />
          <p className="text-xs text-campus-textMuted uppercase tracking-wider font-mono">
            Verifying Authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized role to their respective home dashboard
    if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

