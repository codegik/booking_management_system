import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { maskPhone } from '../../../utils/phoneFormatter';

const RegistrationForm = ({ formData, setFormData, errors = {} }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (value) => {
    const formattedPhone = maskPhone(value);
    handleInputChange('phone', formattedPhone);
  };

  // Business Hours logic
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots?.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDayToggle = (day, checked) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev?.businessHours,
        [day]: checked ? {
          isOpen: true,
          openTime: '09:00',
          closeTime: '17:00'
        } : {
          isOpen: false,
          openTime: '',
          closeTime: ''
        }
      }
    }));
  };

  const handleTimeChange = (day, timeType, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev?.businessHours,
        [day]: {
          ...prev?.businessHours?.[day],
          [timeType]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-8">
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
            disabled={true}
            readOnly={true}
          />

          <Input
            label="Business Email"
            type="email"
            placeholder="business@company.com"
            value={formData?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
            disabled={true}
            readOnly={true}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+00 00 00000 0000"
            value={formData?.phone || ''}
            onChange={(e) => handlePhoneChange(e?.target?.value)}
            error={errors?.phone}
            required
          />
        </div>

        <div className="space-y-4">
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
          <Input
            label="Business Description"
            type="text"
            placeholder="Brief description of your business"
            value={formData?.description || ''}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            error={errors?.description}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Business Hours Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Business Hours</h2>
            <p className="text-sm text-muted-foreground">
              Set your operating hours for each day of the week
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {daysOfWeek?.map(day => {
            const dayData = formData?.businessHours?.[day?.key] || { isOpen: false, openTime: '', closeTime: '' };

            return (
              <div key={day?.key} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 sm:w-32">
                  <Checkbox
                    checked={dayData?.isOpen}
                    onChange={(e) => handleDayToggle(day?.key, e?.target?.checked)}
                  />
                  <span className="font-medium text-foreground">{day?.label}</span>
                </div>
                {dayData?.isOpen ? (
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <Select
                        placeholder="Open"
                        options={timeSlots}
                        value={dayData?.openTime}
                        onChange={(value) => handleTimeChange(day?.key, 'openTime', value)}
                        className="w-32"
                      />
                    </div>

                    <span className="text-muted-foreground">to</span>

                    <Select
                      placeholder="Close"
                      options={timeSlots}
                      value={dayData?.closeTime}
                      onChange={(value) => handleTimeChange(day?.key, 'closeTime', value)}
                      className="w-32"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="text-muted-foreground italic">Closed</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors?.businessHours && (
          <p className="text-sm text-error">{errors?.businessHours}</p>
        )}

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Time Slot System</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your business hours determine when customers can book appointments.
                The system uses 30-minute time slots, providing 48 booking slots per day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
