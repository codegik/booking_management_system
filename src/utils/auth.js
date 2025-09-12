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
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userPicture');
  localStorage.removeItem('userRole');
  localStorage.removeItem('selectedCompanyId');
  localStorage.removeItem('jwtTokenExpiresAt');
  localStorage.removeItem('customerCellphone');
  localStorage.removeItem('customerId');
  localStorage.removeItem('customerName');
};

export const isCompanyRegistered = () => {
  return localStorage.getItem('companyRegistered') === 'true';
};

export const markCompanyAsRegistered = () => {
  localStorage.setItem('companyRegistered', 'true');
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();

  // Check if body is FormData - if so, don't set Content-Type header
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    // Only set Content-Type to application/json if it's not FormData
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If unauthorized, clear auth data and redirect to login
  if (response.status === 401) {
    clearAuthData();
    window.location.href = '/';
    throw new Error('Authentication expired. Please login again.');
  }

  return response;
};

export function handleLogout(navigate) {
  clearAuthData();
  navigate('/');
}

export const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT token:', error);
        return null;
    }
};

export const registerAuthToken = (token) => {
    const decodedToken = decodeJWT(token);
    const isRegistered = decodedToken.alias != null && decodedToken.alias !== '';

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authProvider', 'google');
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userEmail', decodedToken.email);
    localStorage.setItem('userName', decodedToken.name);
    localStorage.setItem('userPicture', decodedToken.pictureUrl);
    localStorage.setItem('userRole', decodedToken.role);

    return isRegistered;
}

export const enhanceTokenAuth = async (token) => {
  return await fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token })
  });
};
