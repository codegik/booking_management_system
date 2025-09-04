import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddEmployeeModal = ({ 
  isOpen = false, 
  onClose = () => {},
  onSave = () => {},
  availableServices = [],
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'technician',
    status: 'active',
    assignedWorks: [],
    pictureUrl: ''
  });

  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'technician', label: 'Technician' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'manager', label: 'Manager' },
    { value: 'specialist', label: 'Specialist' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (serviceId, checked) => {
    setFormData(prev => ({
      ...prev,
      assignedWorks: checked
        ? [...prev?.assignedWorks, serviceId]
        : prev?.assignedWorks?.filter(id => id !== serviceId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData?.pictureUrl && !isValidUrl(formData?.pictureUrl)) {
      newErrors.pictureUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'technician',
      status: 'active',
      assignedWorks: [],
      pictureUrl: ''
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card rounded-lg border border-border shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Add New Employee</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new employee account and assign services
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter employee name"
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    error={errors?.name}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="employee@company.com"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    error={errors?.email}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    error={errors?.phone}
                    required
                  />
                  
                  <Input
                    label="Picture URL"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={formData?.pictureUrl}
                    onChange={(e) => handleInputChange('pictureUrl', e?.target?.value)}
                    error={errors?.pictureUrl}
                    description="Optional link to employee's profile picture"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Role"
                    options={roleOptions}
                    value={formData?.role}
                    onChange={(value) => handleInputChange('role', value)}
                    required
                  />
                  
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData?.status}
                    onChange={(value) => handleInputChange('status', value)}
                    required
                  />
                </div>

                {/* Picture Preview */}
                {formData?.pictureUrl && isValidUrl(formData?.pictureUrl) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Picture Preview</label>
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-muted/30">
                      <img
                        src={formData?.pictureUrl}
                        alt="Employee preview"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/public/assets/images/no_image.png';
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Profile Picture</p>
                        <p className="text-xs text-muted-foreground truncate">{formData?.pictureUrl}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Assignment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground">Service Assignment</h3>
                  <span className="text-sm text-muted-foreground">
                    {formData?.assignedWorks?.length} of {availableServices?.length} selected
                  </span>
                </div>
                
                {availableServices?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-border rounded-lg p-4">
                    {availableServices?.map((service) => (
                      <div key={service?.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
                        <Checkbox
                          checked={formData?.assignedWorks?.includes(service?.id)}
                          onChange={(e) => handleServiceToggle(service?.id, e?.target?.checked)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{service?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {service?.duration} min • ${service?.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-border rounded-lg">
                    <Icon name="Settings" size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No services available. Create services first to assign them.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Reset Form
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Add Employee
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;