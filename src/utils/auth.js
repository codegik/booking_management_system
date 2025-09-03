// Utility functions for handling JWT authentication

export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};


export const clearAuthData = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('authProvider');
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('companyRegistered');
};

export const isCompanyRegistered = () => {
  return localStorage.getItem('companyRegistered') === 'true';
};

export const markCompanyAsRegistered = () => {
  localStorage.setItem('companyRegistered', 'true');
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  // If unauthorized, clear auth data and redirect to login
  if (response.status === 401) {
    clearAuthData();
    window.location.href = '/';
    throw new Error('Authentication expired. Please login again.');
  }

  return response;
};
