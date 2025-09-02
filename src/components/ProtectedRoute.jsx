import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated || isAuthenticated !== 'true') {
      // Redirect to login if not authenticated
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Check authentication status
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!isAuthenticated || isAuthenticated !== 'true') {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default ProtectedRoute;
