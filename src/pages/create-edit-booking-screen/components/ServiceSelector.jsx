import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ServiceSelector = ({ 
  selectedService, 
  onServiceChange, 
  disabled = false,
  error = null 
}) => {
  const [serviceDetails, setServiceDetails] = useState(null);

  // Mock service data
  const services = [
    { 
      value: '1', 
      label: 'Hair Cut & Styling', 
      description: '45 min • $35.00',
      duration: 45,
      price: 35.00,
      category: 'Hair Services'
    },
    { 
      value: '2', 
      label: 'Hair Color Treatment', 
      description: '120 min • $85.00',
      duration: 120,
      price: 85.00,
      category: 'Hair Services'
    },
    { 
      value: '3', 
      label: 'Facial Treatment', 
      description: '60 min • $65.00',
      duration: 60,
      price: 65.00,
      category: 'Skin Care'
    },
    { 
      value: '4', 
      label: 'Deep Cleansing Facial', 
      description: '90 min • $95.00',
      duration: 90,
      price: 95.00,
      category: 'Skin Care'
    },
    { 
      value: '5', 
      label: 'Manicure & Pedicure', 
      description: '75 min • $45.00',
      duration: 75,
      price: 45.00,
      category: 'Nail Services'
    },
    { 
      value: '6', 
      label: 'Gel Nail Application', 
      description: '60 min • $55.00',
      duration: 60,
      price: 55.00,
      category: 'Nail Services'
    },
    { 
      value: '7', 
      label: 'Full Body Massage', 
      description: '90 min • $120.00',
      duration: 90,
      price: 120.00,
      category: 'Wellness'
    },
    { 
      value: '8', 
      label: 'Aromatherapy Session', 
      description: '60 min • $80.00',
      duration: 60,
      price: 80.00,
      category: 'Wellness'
    }
  ];

  useEffect(() => {
    if (selectedService) {
      const service = services?.find(s => s?.value === selectedService);
      setServiceDetails(service);
    } else {
      setServiceDetails(null);
    }
  }, [selectedService]);

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  return (
    <div className="space-y-4">
      <Select
        label="Select Service"
        description="Choose the service to be booked"
        placeholder="Search services..."
        options={services}
        value={selectedService}
        onChange={onServiceChange}
        searchable
        clearable
        disabled={disabled}
        error={error}
        required
      />
      {serviceDetails && (
        <div className="bg-muted rounded-lg p-4 border border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">
                {serviceDetails?.label}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {serviceDetails?.category}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {formatDuration(serviceDetails?.duration)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(serviceDetails?.price)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Scissors" size={20} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;