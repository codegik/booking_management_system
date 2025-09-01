import React from 'react';
import Input from '../../../components/ui/Input';

const CompanyDetailsForm = ({ formData, setFormData, errors = {} }) => {
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Business Description</h3>
        
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