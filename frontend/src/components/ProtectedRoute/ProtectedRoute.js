import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Adapted from https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();

  const location = useLocation();

  return loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
