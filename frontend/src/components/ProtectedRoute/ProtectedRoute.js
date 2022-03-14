import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// Adapted from https://reactjs.org/docs/conditional-rendering.html
export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" />;
}
