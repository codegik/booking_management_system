import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BusinessHoursForm = ({ formData, setFormData, errors = {} }) => {
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  // Generate time slots (48 slots per day - every 30 minutes)
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

  const setStandardHours = () => {
    const standardHours = {};
    daysOfWeek?.forEach(day => {
      if (day?.key === 'sunday') {
        standardHours[day.key] = { isOpen: false, openTime: '', closeTime: '' };
      } else {
        standardHours[day.key] = { isOpen: true, openTime: '09:00', closeTime: '17:00' };
      }
    });
    
    setFormData(prev => ({
      ...prev,
      businessHours: standardHours
    }));
  };

  const set24Hours = () => {
    const allDayHours = {};
    daysOfWeek?.forEach(day => {
      allDayHours[day.key] = { isOpen: true, openTime: '00:00', closeTime: '23:30' };
    });
    
    setFormData(prev => ({
      ...prev,
      businessHours: allDayHours
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Business Hours</h3>
          <p className="text-sm text-muted-foreground">
            Set your operating hours for each day of the week
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={setStandardHours}
            className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-smooth"
          >
            Standard Hours
          </button>
          <button
            type="button"
            onClick={set24Hours}
            className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-smooth"
          >
            24/7 Hours
          </button>
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
  );
};

export default BusinessHoursForm;