import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StepIndicator from './components/StepIndicator';
import CompanyDetailsForm from './components/CompanyDetailsForm';
import BusinessHoursForm from './components/BusinessHoursForm';
import AdminAccountForm from './components/AdminAccountForm';
import ConfirmationStep from './components/ConfirmationStep';
import RegistrationSidebar from './components/RegistrationSidebar';

const CompanyRegistrationScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    },
    
    // Admin Account
    adminAccount: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      password: '',
      confirmPassword: ''
    }
  });

  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    emailConsent: false,
    informationAccuracy: false
  });

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.companyName?.trim()) newErrors.companyName = 'Company name is required';
        if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!formData?.email?.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Email is invalid';
        if (!formData?.address?.trim()) newErrors.address = 'Address is required';
        break;

      case 2:
        const hasOpenDays = Object.values(formData?.businessHours)?.some(day => day?.isOpen);
        if (!hasOpenDays) {
          newErrors.businessHours = 'At least one business day must be selected';
        }
        break;

      case 3:
        if (!formData?.adminAccount?.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData?.adminAccount?.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData?.adminAccount?.email?.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/?.test(formData?.adminAccount?.email)) newErrors.email = 'Email is invalid';
        if (!formData?.adminAccount?.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!formData?.adminAccount?.password) newErrors.password = 'Password is required';
        else if (formData?.adminAccount?.password?.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData?.adminAccount?.password !== formData?.adminAccount?.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 4:
        if (!agreements?.termsAccepted) newErrors.termsAccepted = 'You must accept the terms of service';
        if (!agreements?.informationAccuracy) newErrors.informationAccuracy = 'You must confirm information accuracy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call - simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      console.log('Registration Data:', { formData, agreements });
      
      // Redirect to company dashboard
      navigate('/company-dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = () => {
    // Mock save draft functionality
    localStorage.setItem('companyRegistrationDraft', JSON.stringify({ formData, currentStep }));
    alert('Draft saved successfully!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyDetailsForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <BusinessHoursForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <AdminAccountForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            formData={formData}
            agreements={agreements}
            setAgreements={setAgreements}
            errors={errors}
          />
        );
      default:
        return null;
    }
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-lg shadow-soft border border-border p-6 lg:p-8">
              <StepIndicator currentStep={currentStep} totalSteps={4} />
              
              <div className="space-y-6">
                {renderStepContent()}
                
                {errors?.submit && (
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="AlertCircle" size={20} className="text-error" />
                      <p className="text-sm text-error">{errors?.submit}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
                  <div className="flex items-center space-x-3">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isLoading}
                        iconName="ChevronLeft"
                        iconPosition="left"
                      >
                        Previous
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      onClick={saveDraft}
                      disabled={isLoading}
                      iconName="Save"
                      iconPosition="left"
                      className="hidden sm:flex"
                    >
                      Save Draft
                    </Button>
                  </div>

                  <Button
                    variant="default"
                    onClick={handleNext}
                    loading={isLoading}
                    iconName={currentStep === 4 ? "Check" : "ChevronRight"}
                    iconPosition="right"
                  >
                    {currentStep === 4 ? 'Create Account' : 'Continue'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <RegistrationSidebar currentStep={currentStep} />
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