import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Check both token existence and authentication flag
    if (!token || !isAuthenticated || isAuthenticated !== 'true') {
      // Redirect to login if not authenticated
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Check authentication status
  const token = getAuthToken();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!token || !isAuthenticated || isAuthenticated !== 'true') {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default ProtectedRoute;
