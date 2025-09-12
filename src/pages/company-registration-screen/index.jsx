import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegistrationForm from './components/RegistrationForm';
import {
    enhanceTokenAuth,
    getAuthToken,
    handleLogout,
    makeAuthenticatedRequest,
    markCompanyAsRegistered
} from '../../utils/auth';
import useCompanyDetails from '../../utils/useCompanyDetails';
import RoleBasedHeader from "../../components/ui/RoleBasedHeader";

const CompanyRegistrationScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Use company details hook to fetch existing data
  const { company, isLoading: isLoadingCompany, error: companyError, fetchCompanyDetails } = useCompanyDetails();

  const [formData, setFormData] = useState({
    // Company Details
    name: '',
    alias: '',
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

  // Load existing company data when component mounts
  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  // Convert workDays array back to business hours object
  const parseWorkDays = (workDays) => {
    const businessHours = {
      monday: { isOpen: false, openTime: '', closeTime: '' },
      tuesday: { isOpen: false, openTime: '', closeTime: '' },
      wednesday: { isOpen: false, openTime: '', closeTime: '' },
      thursday: { isOpen: false, openTime: '', closeTime: '' },
      friday: { isOpen: false, openTime: '', closeTime: '' },
      saturday: { isOpen: false, openTime: '', closeTime: '' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    };

    if (workDays && Array.isArray(workDays)) {
      const dayMap = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday'
      };

      workDays.forEach(workDay => {
        const dayName = dayMap[workDay.workDay];
        if (dayName) {
          businessHours[dayName] = {
            isOpen: true,
            openTime: workDay.startTime || '09:00',
            closeTime: workDay.endTime || '18:00'
          };
        }
      });
    }

    return businessHours;
  };

  // Update form data when company data is loaded
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        alias: company.alias || '',
        phone: company.cellphone || '',
        email: company.email || '',
        address: company.address || '',
        description: company.description || '',
        businessHours: parseWorkDays(company.workDays)
      });
    }
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    // Company Alias validation
    if (!formData?.alias?.trim()) {
      newErrors.alias = 'Company Alias is required';
    } else {
      // Check if alias contains only alphanumeric characters (0-9, a-z, A-Z)
      const aliasRegex = /^[a-zA-Z0-9]+$/;
      if (!aliasRegex.test(formData.alias)) {
        newErrors.alias = 'Company Alias can only contain letters (a-z, A-Z) and numbers (0-9)';
      } else if (formData.alias.length < 3) {
        newErrors.alias = 'Company Alias must be at least 3 characters long';
      } else if (formData.alias.length > 20) {
        newErrors.alias = 'Company Alias must be no more than 20 characters long';
      }
    }

    // Company Details validation - Remove validation for read-only fields
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
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
      // Convert business hours to workDays format - array of objects
      const workDays = Object.entries(formData.businessHours)
        .filter(([, hours]) => hours.isOpen)
        .map(([day, hours]) => {
          const dayMap = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 7
          };
          return {
            workDay: dayMap[day],
            startTime: hours.openTime,
            endTime: hours.closeTime
          };
        })
        .sort((a, b) => a.workDay - b.workDay);

      // Prepare the request payload according to the API contract
      const registrationData = {
        name: formData.name,
        alias: formData.alias.toLowerCase(), // Convert to lowercase for consistency
        email: formData.email,
        cellphone: formData.phone,
        address: formData.address,
        description: formData.description,
        pictureUrl: '',
        workDays: workDays
      };

      // Call the company registration API with JWT authentication
      const response = await makeAuthenticatedRequest('/api/company/add', {
        method: 'POST',
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 404) {
          handleLogout(navigate);
          return;
        }

        const errorMessage = errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : 'Registration failed';

        if (errorMessage.toLowerCase().includes('phone') ||
            errorMessage.toLowerCase().includes('already exists') ||
            errorMessage.toLowerCase().includes('duplicate')) {
          setErrors({ phone: errorMessage });
        } else if (errorMessage.toLowerCase().includes('alias')) {
          setErrors({ alias: errorMessage });
        } else {
          setErrors({ submit: errorMessage });
        }
        return;
      }

      await response.json();
      await enhanceTokenAuth(getAuthToken());
      markCompanyAsRegistered();

      navigate('/company-dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <RoleBasedHeader
            company={company}
        />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-soft border border-border p-6 lg:p-8">
          {/* Loading State */}
          {isLoadingCompany && (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading company details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {companyError && !isLoadingCompany && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <div>
                  <h3 className="text-lg font-semibold text-error">Failed to load company details</h3>
                  <p className="text-sm text-muted-foreground mt-1">{companyError}</p>
                  <button
                    onClick={fetchCompanyDetails}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Content - Only show when not loading */}
          {!isLoadingCompany && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">
                  Configuration
                </h1>
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
                    Confirm
                  </Button>
                </div>
              </div>
            </>
          )}
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
