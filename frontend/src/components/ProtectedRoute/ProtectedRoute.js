import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Adapted from https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" />;
}
