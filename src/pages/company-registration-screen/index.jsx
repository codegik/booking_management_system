import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegistrationForm from './components/RegistrationForm';

const CompanyRegistrationScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    
    // Business Hours
    businessHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: false, openTime: '', closeTime: '' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    }
  });

  const validateForm = () => {
    const newErrors = {};

    // Company Details validation
    if (!formData?.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Email is invalid';
    if (!formData?.address?.trim()) newErrors.address = 'Address is required';

    // Business Hours validation
    const hasOpenDays = Object.values(formData?.businessHours)
      ?.some(day => day?.isOpen);
    if (!hasOpenDays) {
      newErrors.businessHours = 'At least one business day must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Convert business hours to workDays format (1=Monday, 7=Sunday)
      const workDays = Object.entries(formData.businessHours)
        .filter(([, hours]) => hours.isOpen)
        .map(([day]) => {
          const dayMap = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7
          };
          return dayMap[day];
        })
        .sort((a, b) => a - b)
        .join(',');

      // Prepare the request payload according to the API contract
      const registrationData = {
        name: formData.companyName,
        email: formData.email,
        cellphone: formData.phone,
        address: formData.address,
        description: formData.description || '',
        pictureUrl: '', // Optional field, can be added later
        workDays: workDays
      };

      // Call the company registration API
      const response = await fetch('/api/company/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);

      // Redirect to company dashboard
      navigate('/company-dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = () => {
    // Save draft functionality
    localStorage.setItem('companyRegistrationDraft', JSON.stringify({ formData }));
    alert('Draft saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Booking Management System
              </span>
            </Link>
            
            <Link
              to="/customer-dashboard"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-soft border border-border p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Company Registration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in your company details and business hours to get started
            </p>
          </div>

          <div className="space-y-6">
            <RegistrationForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />

            {errors?.submit && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-error" />
                  <p className="text-sm text-error">{errors?.submit}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
              <Button
                variant="default"
                onClick={handleSubmit}
                loading={isLoading}
                iconName="Check"
                iconPosition="right"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} Booking Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-smooth">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-foreground transition-smooth">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-foreground transition-smooth">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyRegistrationScreen;
