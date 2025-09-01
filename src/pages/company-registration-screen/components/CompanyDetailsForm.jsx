import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyDetailsForm = ({ formData, setFormData, errors = {} }) => {
  const businessTypes = [
    { value: 'salon', label: 'Beauty Salon' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'fitness', label: 'Fitness Center' },
    { value: 'medical', label: 'Medical Practice' },
    { value: 'automotive', label: 'Automotive Service' },
    { value: 'home_services', label: 'Home Services' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          type="text"
          placeholder="Enter your company name"
          value={formData?.companyName || ''}
          onChange={(e) => handleInputChange('companyName', e?.target?.value)}
          error={errors?.companyName}
          required
          className="lg:col-span-2"
        />

        <Select
          label="Business Type"
          placeholder="Select your business type"
          options={businessTypes}
          value={formData?.businessType || ''}
          onChange={(value) => handleInputChange('businessType', value)}
          error={errors?.businessType}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Input
          label="Business Email"
          type="email"
          placeholder="business@company.com"
          value={formData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="lg:col-span-2"
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Business Address</h3>
        
        <Input
          label="Street Address"
          type="text"
          placeholder="123 Main Street"
          value={formData?.address || ''}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          error={errors?.address}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="New York"
            value={formData?.city || ''}
            onChange={(e) => handleInputChange('city', e?.target?.value)}
            error={errors?.city}
            required
          />

          <Input
            label="State"
            type="text"
            placeholder="NY"
            value={formData?.state || ''}
            onChange={(e) => handleInputChange('state', e?.target?.value)}
            error={errors?.state}
            required
          />

          <Input
            label="ZIP Code"
            type="text"
            placeholder="10001"
            value={formData?.zipCode || ''}
            onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
            error={errors?.zipCode}
            required
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Website (Optional)"
            type="url"
            placeholder="https://www.company.com"
            value={formData?.website || ''}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            error={errors?.website}
          />

          <Input
            label="Tax ID (Optional)"
            type="text"
            placeholder="12-3456789"
            value={formData?.taxId || ''}
            onChange={(e) => handleInputChange('taxId', e?.target?.value)}
            error={errors?.taxId}
          />
        </div>

        <Input
          label="Business Description"
          type="text"
          placeholder="Brief description of your business services"
          value={formData?.description || ''}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          error={errors?.description}
          description="This will be visible to customers when booking services"
        />
      </div>
    </div>
  );
};

export default CompanyDetailsForm;