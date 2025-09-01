import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AdminAccountForm = ({ formData, setFormData, errors = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      adminAccount: {
        ...prev?.adminAccount,
        [field]: value
      }
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password?.length >= 8) score++;
    if (/[a-z]/?.test(password)) score++;
    if (/[A-Z]/?.test(password)) score++;
    if (/[0-9]/?.test(password)) score++;
    if (/[^A-Za-z0-9]/?.test(password)) score++;

    if (score < 2) return { strength: 25, label: 'Weak', color: 'bg-error' };
    if (score < 4) return { strength: 50, label: 'Fair', color: 'bg-warning' };
    if (score < 5) return { strength: 75, label: 'Good', color: 'bg-accent' };
    return { strength: 100, label: 'Strong', color: 'bg-success' };
  };

  const passwordStrength = getPasswordStrength(formData?.adminAccount?.password || '');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Administrator Account</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create the main administrator account for your company
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          value={formData?.adminAccount?.firstName || ''}
          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          value={formData?.adminAccount?.lastName || ''}
          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="admin@company.com"
          value={formData?.adminAccount?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="lg:col-span-2"
          description="This will be your login email address"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData?.adminAccount?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        <Input
          label="Job Title"
          type="text"
          placeholder="Manager, Owner, etc."
          value={formData?.adminAccount?.jobTitle || ''}
          onChange={(e) => handleInputChange('jobTitle', e?.target?.value)}
          error={errors?.jobTitle}
        />
      </div>
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Account Security</h4>
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData?.adminAccount?.password || ''}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        {formData?.adminAccount?.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength?.label === 'Weak' ? 'text-error' :
                passwordStrength?.label === 'Fair' ? 'text-warning' :
                passwordStrength?.label === 'Good' ? 'text-accent' : 'text-success'
              }`}>
                {passwordStrength?.label}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                style={{ width: `${passwordStrength?.strength}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData?.adminAccount?.confirmPassword || ''}
            onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
      </div>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Security Requirements</h4>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Password must be at least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number and special character</li>
              <li>• This account will have full administrative privileges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountForm;