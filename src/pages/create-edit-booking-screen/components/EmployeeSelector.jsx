import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const EmployeeSelector = ({ 
  selectedEmployee, 
  onEmployeeChange, 
  selectedDate,
  disabled = false,
  error = null 
}) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Mock employee data with availability status
  const employees = [
    { 
      value: '1', 
      label: 'Sarah Mitchell', 
      description: 'Hair Specialist • Available',
      specialties: ['Hair Cut', 'Hair Color', 'Styling'],
      rating: 4.9,
      availability: 'available',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    { 
      value: '2', 
      label: 'Jessica Chen', 
      description: 'Skin Care Expert • Busy',
      specialties: ['Facial Treatment', 'Skin Analysis', 'Anti-aging'],
      rating: 4.8,
      availability: 'busy',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    { 
      value: '3', 
      label: 'Maria Rodriguez', 
      description: 'Nail Technician • Available',
      specialties: ['Manicure', 'Pedicure', 'Nail Art'],
      rating: 4.7,
      availability: 'available',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    { 
      value: '4', 
      label: 'Amanda Johnson', 
      description: 'Massage Therapist • Limited',
      specialties: ['Deep Tissue', 'Swedish', 'Aromatherapy'],
      rating: 4.9,
      availability: 'limited',
      avatar: 'https://randomuser.me/api/portraits/women/38.jpg'
    },
    { 
      value: '5', 
      label: 'Rachel Green', 
      description: 'Beauty Specialist • Available',
      specialties: ['Makeup', 'Eyebrow Shaping', 'Lash Extensions'],
      rating: 4.6,
      availability: 'available',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
    }
  ];

  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees?.find(e => e?.value === selectedEmployee);
      setEmployeeDetails(employee);
    } else {
      setEmployeeDetails(null);
    }
  }, [selectedEmployee]);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'text-success';
      case 'busy':
        return 'text-error';
      case 'limited':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'available':
        return 'CheckCircle';
      case 'busy':
        return 'XCircle';
      case 'limited':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Fully Booked';
      case 'limited':
        return 'Limited Slots';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      <Select
        label="Assign Employee"
        description="Choose an employee to handle this booking"
        placeholder="Search employees..."
        options={employees}
        value={selectedEmployee}
        onChange={onEmployeeChange}
        searchable
        clearable
        disabled={disabled}
        error={error}
        required
      />
      {employeeDetails && (
        <div className="bg-muted rounded-lg p-4 border border-border">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={employeeDetails?.avatar} 
                alt={employeeDetails?.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Icon name="User" size={20} color="white" style={{ display: 'none' }} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">
                  {employeeDetails?.label}
                </h4>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm font-medium text-foreground">
                    {employeeDetails?.rating}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <Icon 
                  name={getAvailabilityIcon(employeeDetails?.availability)} 
                  size={14} 
                  className={getAvailabilityColor(employeeDetails?.availability)} 
                />
                <span className={`text-sm font-medium ${getAvailabilityColor(employeeDetails?.availability)}`}>
                  {getAvailabilityText(employeeDetails?.availability)}
                  {selectedDate && ` for ${selectedDate}`}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {employeeDetails?.specialties?.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelector;