import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import EmployeeAssignment from './EmployeeAssignment';

const ServiceForm = ({ 
  service = null, 
  employees = [],
  onSave = () => {},
  onCancel = () => {},
  onDuplicate = () => {},
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    isActive: true,
    assignedEmployeeIds: []
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Duration options based on 48-slot system (30-minute slots)
  const durationOptions = [
    { value: 30, label: '30 minutes (1 slot)' },
    { value: 60, label: '1 hour (2 slots)' },
    { value: 90, label: '1.5 hours (3 slots)' },
    { value: 120, label: '2 hours (4 slots)' },
    { value: 150, label: '2.5 hours (5 slots)' },
    { value: 180, label: '3 hours (6 slots)' },
    { value: 240, label: '4 hours (8 slots)' },
    { value: 300, label: '5 hours (10 slots)' },
    { value: 360, label: '6 hours (12 slots)' },
    { value: 480, label: '8 hours (16 slots)' }
  ];

  useEffect(() => {
    if (service) {
      setFormData({
        name: service?.name || '',
        description: service?.description || '',
        duration: service?.duration || 30,
        price: service?.price || 0,
        isActive: service?.isActive !== undefined ? service?.isActive : true,
        assignedEmployeeIds: service?.assignedEmployeeIds || []
      });
      setIsDirty(false);
    } else {
      // Reset form for new service
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        isActive: true,
        assignedEmployeeIds: []
      });
      setIsDirty(false);
    }
    setErrors({});
  }, [service]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear field error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Service name is required';
    } else if (formData?.name?.length < 3) {
      newErrors.name = 'Service name must be at least 3 characters';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Service description is required';
    } else if (formData?.description?.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData?.duration < 30) {
      newErrors.duration = 'Duration must be at least 30 minutes';
    } else if (formData?.duration % 30 !== 0) {
      newErrors.duration = 'Duration must be in 30-minute increments';
    }

    if (formData?.price < 0) {
      newErrors.price = 'Price cannot be negative';
    } else if (formData?.price > 10000) {
      newErrors.price = 'Price cannot exceed $10,000';
    }

    if (formData?.assignedEmployeeIds?.length === 0) {
      newErrors.assignedEmployeeIds = 'At least one employee must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDuplicate = () => {
    if (service) {
      const duplicatedData = {
        ...formData,
        name: `${formData?.name} (Copy)`,
        isActive: false // New duplicated services start as inactive
      };
      onDuplicate(duplicatedData);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(price);
  };

  const isNewService = !service;

  return (
    <div className={`h-full flex flex-col bg-card ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isNewService ? 'Create New Service' : 'Edit Service'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isNewService 
                ? 'Configure a new bookable service with pricing and duration' :'Update service details and employee assignments'
              }
            </p>
          </div>
          
          {!isNewService && (
            <Button
              variant="outline"
              onClick={handleDuplicate}
              iconName="Copy"
              iconPosition="left"
              iconSize={16}
            >
              Duplicate
            </Button>
          )}
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <Input
              label="Service Name"
              type="text"
              placeholder="Enter service name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe the service in detail..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />
              {errors?.description && (
                <p className="text-sm text-error mt-1">{errors?.description}</p>
              )}
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Pricing & Duration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Duration"
                description="Duration must align with 30-minute booking slots"
                options={durationOptions}
                value={formData?.duration}
                onChange={(value) => handleInputChange('duration', value)}
                error={errors?.duration}
                required
              />

              <Input
                label="Price (USD)"
                type="number"
                placeholder="0.00"
                value={formData?.price}
                onChange={(e) => handleInputChange('price', parseFloat(e?.target?.value) || 0)}
                error={errors?.price}
                min="0"
                max="10000"
                step="0.01"
                required
              />
            </div>

            {/* Price Preview */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price Preview:</span>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(formData?.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Employee Assignment */}
          <div className="space-y-4">
            <EmployeeAssignment
              employees={employees}
              assignedEmployeeIds={formData?.assignedEmployeeIds}
              onAssignmentChange={(ids) => handleInputChange('assignedEmployeeIds', ids)}
            />
            {errors?.assignedEmployeeIds && (
              <p className="text-sm text-error">{errors?.assignedEmployeeIds}</p>
            )}
          </div>

          {/* Service Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Service Status</h3>
            
            <div className="p-4 border border-border rounded-lg">
              <Checkbox
                label="Active Service"
                description="Active services are available for booking by customers"
                checked={formData?.isActive}
                onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
              />
            </div>
          </div>
        </form>
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDirty && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              {isNewService ? 'Create Service' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;