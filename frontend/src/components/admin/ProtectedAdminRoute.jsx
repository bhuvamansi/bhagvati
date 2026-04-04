import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const ProtectedAdminRoute = ({ children }) => {
  const { adminLoading, isAdminAuthenticated } = useAdmin();

  if (adminLoading) {
    return <div className="min-h-screen grid place-items-center pt-24 text-stone">Loading admin panel...</div>;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
