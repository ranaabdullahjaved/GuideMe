import React from 'react';
import { Navigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode'; // Adjusted import

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwt_decode(token); // Use jwt_decode as usual
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken');
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('authToken');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
