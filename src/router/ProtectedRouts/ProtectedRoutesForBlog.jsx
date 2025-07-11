// components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMyContext } from '../../Context/MyContextProvider';

const ProtectedRoutesForBlog = ({ children, allowedRoles }) => {
  const { userRole } = useMyContext();

  return allowedRoles.includes(userRole) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoutesForBlog;
