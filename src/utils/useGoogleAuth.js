import { useState, useEffect } from 'react';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFedCMSupported, setIsFedCMSupported] = useState(false);

  useEffect(() => {
    // Check if FedCM is supported
    if ('IdentityCredential' in window && 'navigator' in window && 'credentials' in navigator) {
      setIsFedCMSupported(true);
      console.log('FedCM is supported');
    } else {
      console.warn('FedCM is not supported in this browser, falling back to Google Identity Services');
    }

    // Check if Google Identity Services is loaded (fallback)
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        if (!isFedCMSupported) {
          initializeGoogleAuth();
        }
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, [isFedCMSupported]);

  const initializeGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your-google-oauth-client-id-here') {
      console.warn('Google OAuth Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: () => {}, // Will be set when login is triggered
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
    }
  };

  const signInWithFedCM = async () => {
    if (!isFedCMSupported) {
      throw new Error('FedCM is not supported in this browser');
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your-google-oauth-client-id-here') {
      throw new Error('Google OAuth Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
    }

    try {
      const credential = await navigator.credentials.get({
        identity: {
          providers: [{
            configURL: 'https://accounts.google.com/.well-known/web-identity',
            clientId: clientId,
            nonce: generateNonce(),
          }]
        }
      });

      if (credential) {
        // Parse the credential token
        const userInfo = parseJWT(credential.token);
        return {
          credential: credential.token,
          userInfo: userInfo,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub // Google user ID
        };
      } else {
        throw new Error('No credential received from FedCM');
      }
    } catch (error) {
      console.error('FedCM authentication failed:', error);
      throw new Error(error.message || 'FedCM authentication failed');
    }
  };

  const signInWithGoogleIdentityServices = () => {
    return new Promise((resolve, reject) => {
      if (!isGoogleLoaded) {
        reject(new Error('Google Auth not loaded'));
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        reject(new Error('Google OAuth Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file'));
        return;
      }

      // Set up the callback for this specific login attempt
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            // Decode the JWT token to get user info
            try {
              const userInfo = parseJWT(response.credential);
              resolve({
                credential: response.credential,
                userInfo: userInfo,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                sub: userInfo.sub // Google user ID
              });
            } catch (error) {
              reject(new Error('Failed to parse Google credential'));
            }
          } else {
            reject(new Error('No credential received from Google'));
          }
        },
        error_callback: (error) => {
          reject(new Error(error.message || 'Google authentication failed'));
        }
      });

      // Trigger the Google Sign-In popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to render button approach
          const tempDiv = document.createElement('div');
          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            type: 'standard'
          });
          // Simulate click on the button
          const button = tempDiv.querySelector('div[role="button"]');
          if (button) {
            button.click();
          }
        }
      });
    });
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);

    try {
      // Try FedCM first if supported, fallback to Google Identity Services
      if (isFedCMSupported) {
        console.log('Using FedCM for authentication');
        return await signInWithFedCM();
      } else {
        console.log('Using Google Identity Services for authentication');
        return await signInWithGoogleIdentityServices();
      }
    } catch (error) {
      // If FedCM fails, try fallback method
      if (isFedCMSupported && error.message.includes('FedCM')) {
        console.log('FedCM failed, falling back to Google Identity Services');
        try {
          return await signInWithGoogleIdentityServices();
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a random nonce for FedCM
  const generateNonce = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Helper function to decode JWT without verification (client-side only)
  const parseJWT = (token) => {
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
      throw new Error('Invalid JWT token');
    }
  };

  return {
    isGoogleLoaded,
    isLoading,
    isFedCMSupported,
    signInWithGoogle
  };
};

export default useGoogleAuth;
