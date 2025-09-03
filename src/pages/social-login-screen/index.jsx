import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import {isCompanyRegistered, clearAuthData} from '../../utils/auth';
import useGoogleAuth from '../../utils/useGoogleAuth';

// Helper function to decode JWT token
const decodeJWT = (token) => {
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

const SocialLoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isGoogleLoaded, isFedCMSupported, signInWithGoogle } = useGoogleAuth();

  // Check if user is already authenticated and registered on component mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (token && isAuthenticated === 'true') {
      // User is already authenticated, check if company is registered
      if (isCompanyRegistered()) {
        navigate('/company-dashboard');
      } else {
        navigate('/company-registration-screen');
      }
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const googleAuthResult = await signInWithGoogle();
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleAuthResult.credential })
      });

      if (!response.ok) {
        clearAuthData();
        navigate('/');
      } else {
          const tokenData = await response.json();
          const decodedToken = decodeJWT(tokenData.token);

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('authProvider', 'google');
          localStorage.setItem('jwtToken', tokenData.token);
          localStorage.setItem('userEmail', decodedToken.email);
          localStorage.setItem('userName', decodedToken.name);
          localStorage.setItem('userPicture', decodedToken.pictureUrl);
          localStorage.setItem('userRole', decodedToken.role);

          // Check if company is already registered and redirect accordingly
          if (isCompanyRegistered()) {
              navigate('/company-dashboard');
          } else {
              navigate('/company-registration-screen');
          }
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Booking Management System
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Users" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to create your company account and start managing bookings
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-soft border border-border p-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground text-center mb-6">
                Choose your sign-in method
              </h2>

              {/* FedCM Support Indicator */}
              {isFedCMSupported && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={16} className="text-success" />
                    <p className="text-sm text-success">
                      Using enhanced security with FedCM authentication
                    </p>
                  </div>
                </div>
              )}

              {/* Configuration Warning */}
              {!isGoogleLoaded && !isFedCMSupported && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertCircle" size={16} className="text-warning" />
                    <p className="text-sm text-warning">
                      Loading authentication services... Please wait.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <p className="text-sm text-error">{error}</p>
                  </div>
                </div>
              )}

              {/* Google Login */}
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading || (!isGoogleLoaded && !isFedCMSupported)}
                className="w-full justify-center space-x-3 h-12"
              >
                <Icon name="Chrome" size={20} />
                <span>Continue with Google</span>
              </Button>

              {/* Other social login buttons can be added here */}

              {isLoading && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  {isFedCMSupported ? 'Authenticating with FedCM...' : 'Authenticating with Google...'}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={16} className="text-accent mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Your data is secure. We use industry-standard encryption and never store your social login credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Booking Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-smooth">
                Help Center
              </a>
              <a href="#" className="hover:text-foreground transition-smooth">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialLoginScreen;
