import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { maskPhone, validatePhone } from '../../utils/phoneFormatter';

const CustomerRegistrationScreen = () => {
  const { companyAlias } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const phoneInputRef = useRef(null);

  // Fetch company details by alias
  useEffect(() => {
    const fetchCompanyByAlias = async () => {
      if (!companyAlias) {
        setError('Company alias is required');
        setIsLoadingCompany(false);
        return;
      }

      try {
        setIsLoadingCompany(true);
        setError(null);

        const response = await fetch(`/api/company/alias/${companyAlias}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
            const companyData = await response.json();
            setCompany(companyData);
            localStorage.setItem('selectedCompanyId', companyData.id);
        } else {
            setError('Failed to load company details');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setError(error.message || 'Failed to load company details');
      } finally {
        setIsLoadingCompany(false);
      }
    };

    fetchCompanyByAlias();
  }, [companyAlias]);

  // Focus phone input on mount
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  // Load saved customer name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('savedCustomerName');
    if (savedName) {
      setFormData(prev => ({
        ...prev,
        name: savedName
      }));
    }
  }, []);

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!company?.id) {
      setError('Company information not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const registrationData = {
        name: formData.name.trim(),
        cellphone: formData.phone,
        companyId: company.id
      };

      // You mentioned the endpoint but it was cut off - I'll use a common pattern
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : 'Registration failed';

        // Handle specific field errors
        if (errorMessage.toLowerCase().includes('cellphone')) {
          setFormErrors({ phone: errorMessage });
        } else if (errorMessage.toLowerCase().includes('name')) {
          setFormErrors({ name: errorMessage });
        } else {
          setError(errorMessage);
        }
        return;
      }

      const responseData = await response.json();

      if (responseData.token) {
        localStorage.setItem('jwtToken', responseData.token);
        localStorage.setItem('isAuthenticated', 'true');
      }
      if (responseData.expiresAt) {
         localStorage.setItem('jwtTokenExpiresAt', responseData.expiresAt);
      }
      if (responseData.cellphone) {
         localStorage.setItem('customerCellphone', responseData.cellphone);
      }
      if (responseData.id) {
        localStorage.setItem('customerId', responseData.id);
      }
      if (responseData.name) {
        localStorage.setItem('customerName', responseData.name);
      }

      // Navigate to customer dashboard or booking screen
      navigate('/customer-dashboard');

    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field-specific errors
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePhoneChange = (value) => {
    const formattedPhone = maskPhone(value);
    handleInputChange('phone', formattedPhone);
  };

  const handleNameChange = (value) => {
    if (value.trim()) {
      localStorage.setItem('savedCustomerName', value.trim());
    }
      handleInputChange('name', value);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Loading state
  if (isLoadingCompany) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  // Error state - company not found
  if (error && !company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">Company Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-soft border border-border p-6">
          <div className="text-center mb-6">
              {company?.pictureUrl && !imageError && (
                  <img
                    src={company.pictureUrl}
                    alt="Company"
                    className="w-8 h-8 rounded-full object-cover mx-auto mb-4"
                    onError={handleImageError}
                  />
              )}
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to {company?.name}
            </h1>
            <p className="text-muted-foreground">
              Please provide your details to book an appointment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+00 00 00000 0000"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              error={formErrors.phone}
              required
              ref={phoneInputRef}
              autoFocus
            />

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-error" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            )}

              <Input
                  label="Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  error={formErrors.name}
                  required
              />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
            >
              Continue
            </Button>
          </form>

          {/* Company Info */}
          {company?.description && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">About {company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.description}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6">
        <a
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
        >
          Click here to manage your company's bookings
        </a>
      </footer>
    </div>
  );
};

export default CustomerRegistrationScreen;
