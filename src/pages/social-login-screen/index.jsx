import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { isCompanyRegistered } from '../../utils/auth';

// Simple UUID v4 generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const SocialLoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate UUIDs for entityId and tenant
      const entityId = generateUUID();
      const tenant = generateUUID();

      // Call the JWT generation API
      const response = await fetch('/induction/generate-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityId: entityId,
          tenant: tenant
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const tokenData = await response.json();
      console.log('JWT Token generated:', tokenData);

      // Store the authentication data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authProvider', 'google');
      localStorage.setItem('jwtToken', tokenData.token);
      localStorage.setItem('entityId', tokenData.entityId);
      localStorage.setItem('tenant', tokenData.tenant);
      localStorage.setItem('tokenExpiresAt', tokenData.expiresAt);

      // Check if company is already registered and redirect accordingly
      if (isCompanyRegistered()) {
        // Company already registered, go to dashboard
        navigate('/company-dashboard');
      } else {
        // Company not registered yet, go to registration
        navigate('/company-registration-screen');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtherSocialLogin = async (provider) => {
    setIsLoading(true);
    setError(null);

    try {
      // For other providers, use mock authentication for now
      console.log(`Logging in with ${provider} (mock)`);

      // Mock authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authProvider', provider);

      // Redirect to company registration
      navigate('/company-registration-screen');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Authentication failed. Please try again.');
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
                disabled={isLoading}
                className="w-full justify-center space-x-3 h-12"
              >
                <Icon name="Chrome" size={20} />
                <span>Continue with Google</span>
              </Button>

              {/* Microsoft Login */}
              <Button
                variant="outline"
                onClick={() => handleOtherSocialLogin('microsoft')}
                disabled={isLoading}
                className="w-full justify-center space-x-3 h-12"
              >
                <Icon name="Users" size={20} />
                <span>Continue with Microsoft</span>
              </Button>

              {/* GitHub Login */}
              <Button
                variant="outline"
                onClick={() => handleOtherSocialLogin('github')}
                disabled={isLoading}
                className="w-full justify-center space-x-3 h-12"
              >
                <Icon name="Github" size={20} />
                <span>Continue with GitHub</span>
              </Button>

              {/* Apple Login */}
              <Button
                variant="outline"
                onClick={() => handleOtherSocialLogin('apple')}
                disabled={isLoading}
                className="w-full justify-center space-x-3 h-12"
              >
                <Icon name="Apple" size={20} />
                <span>Continue with Apple</span>
              </Button>

              {isLoading && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Authenticating...
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
