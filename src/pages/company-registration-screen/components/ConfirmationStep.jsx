import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfirmationStep = ({ formData, agreements, setAgreements, errors = {} }) => {
  const handleAgreementChange = (field, checked) => {
    setAgreements(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const formatBusinessHours = (businessHours) => {
    if (!businessHours) return 'Not configured';
    
    const openDays = Object.entries(businessHours)?.filter(([_, data]) => data?.isOpen)?.map(([day, data]) => {
        const dayName = day?.charAt(0)?.toUpperCase() + day?.slice(1);
        const openTime = new Date(`2000-01-01T${data.openTime}`)?.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const closeTime = new Date(`2000-01-01T${data.closeTime}`)?.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return `${dayName}: ${openTime} - ${closeTime}`;
      });
    
    return openDays?.length > 0 ? openDays?.join(', ') : 'No operating days set';
  };

  const businessTypeLabels = {
    'salon': 'Beauty Salon',
    'spa': 'Spa & Wellness',
    'fitness': 'Fitness Center',
    'medical': 'Medical Practice',
    'automotive': 'Automotive Service',
    'home_services': 'Home Services',
    'consulting': 'Consulting',
    'other': 'Other'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Review & Confirm</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please review your information before creating your account
        </p>
      </div>
      {/* Company Information Summary */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Icon name="Building2" size={20} className="mr-2" />
          Company Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Company Name:</span>
            <p className="font-medium text-foreground">{formData?.companyName || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Business Type:</span>
            <p className="font-medium text-foreground">
              {businessTypeLabels?.[formData?.businessType] || 'Not selected'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium text-foreground">{formData?.email || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <p className="font-medium text-foreground">{formData?.phone || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Address:</span>
            <p className="font-medium text-foreground">
              {formData?.address ? 
                `${formData?.address}, ${formData?.city}, ${formData?.state} ${formData?.zipCode}` : 
                'Not provided'
              }
            </p>
          </div>
        </div>
      </div>
      {/* Business Hours Summary */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Icon name="Clock" size={20} className="mr-2" />
          Business Hours
        </h4>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Operating Schedule:</span>
          <p className="font-medium text-foreground mt-1">
            {formatBusinessHours(formData?.businessHours)}
          </p>
        </div>
      </div>
      {/* Administrator Account Summary */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Icon name="UserCheck" size={20} className="mr-2" />
          Administrator Account
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <p className="font-medium text-foreground">
              {formData?.adminAccount?.firstName && formData?.adminAccount?.lastName ? 
                `${formData?.adminAccount?.firstName} ${formData?.adminAccount?.lastName}` : 
                'Not provided'
              }
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium text-foreground">
              {formData?.adminAccount?.email || 'Not provided'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <p className="font-medium text-foreground">
              {formData?.adminAccount?.phone || 'Not provided'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Job Title:</span>
            <p className="font-medium text-foreground">
              {formData?.adminAccount?.jobTitle || 'Not provided'}
            </p>
          </div>
        </div>
      </div>
      {/* Terms and Agreements */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Terms & Agreements</h4>
        
        <div className="space-y-3">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={agreements?.termsAccepted || false}
            onChange={(e) => handleAgreementChange('termsAccepted', e?.target?.checked)}
            error={errors?.termsAccepted}
            required
          />
          
          <Checkbox
            label="I consent to receive important updates and notifications via email"
            checked={agreements?.emailConsent || false}
            onChange={(e) => handleAgreementChange('emailConsent', e?.target?.checked)}
          />
          
          <Checkbox
            label="I confirm that all information provided is accurate and complete"
            checked={agreements?.informationAccuracy || false}
            onChange={(e) => handleAgreementChange('informationAccuracy', e?.target?.checked)}
            error={errors?.informationAccuracy}
            required
          />
        </div>
      </div>
      {/* Next Steps Information */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">What happens next?</h4>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Your account will be created immediately</li>
              <li>• A verification email will be sent to your admin email</li>
              <li>• You'll be redirected to your company dashboard</li>
              <li>• You can start adding employees and services right away</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;