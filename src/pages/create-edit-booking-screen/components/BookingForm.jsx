import React, { useState, useEffect } from 'react';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookingForm = ({ 
  bookingData,
  onBookingDataChange,
  onSave,
  onSaveAndCreateAnother,
  onCancel,
  isLoading = false,
  hasUnsavedChanges = false,
  userRole = 'admin'
}) => {
  const [notes, setNotes] = useState(bookingData?.notes || '');
  const [status, setStatus] = useState(bookingData?.status || 'pending');
  const [priority, setPriority] = useState(bookingData?.priority || 'normal');

  // Status options based on user role
  const statusOptions = userRole === 'admin' ? [
    { value: 'pending', label: 'Pending Confirmation', description: 'Awaiting approval' },
    { value: 'confirmed', label: 'Confirmed', description: 'Booking approved' },
    { value: 'in-progress', label: 'In Progress', description: 'Service started' },
    { value: 'completed', label: 'Completed', description: 'Service finished' },
    { value: 'cancelled', label: 'Cancelled', description: 'Booking cancelled' },
    { value: 'no-show', label: 'No Show', description: 'Customer did not arrive' }
  ] : [
    { value: 'pending', label: 'Pending Confirmation', description: 'Awaiting approval' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Standard booking' },
    { value: 'normal', label: 'Normal Priority', description: 'Regular booking' },
    { value: 'high', label: 'High Priority', description: 'Urgent booking' },
    { value: 'vip', label: 'VIP Priority', description: 'Premium customer' }
  ];

  useEffect(() => {
    setNotes(bookingData?.notes || '');
    setStatus(bookingData?.status || 'pending');
    setPriority(bookingData?.priority || 'normal');
  }, [bookingData]);

  const handleNotesChange = (e) => {
    const value = e?.target?.value;
    setNotes(value);
    onBookingDataChange({ ...bookingData, notes: value });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    onBookingDataChange({ ...bookingData, status: value });
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    onBookingDataChange({ ...bookingData, priority: value });
  };

  const calculateTotalPrice = () => {
    // Mock service prices
    const servicePrices = {
      '1': 35.00,
      '2': 85.00,
      '3': 65.00,
      '4': 95.00,
      '5': 45.00,
      '6': 55.00,
      '7': 120.00,
      '8': 80.00
    };

    const basePrice = servicePrices?.[bookingData?.service] || 0;
    const priorityMultiplier = priority === 'vip' ? 1.2 : priority === 'high' ? 1.1 : 1;
    
    return basePrice * priorityMultiplier;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  const getPriorityColor = (priorityValue) => {
    switch (priorityValue) {
      case 'low':
        return 'text-muted-foreground';
      case 'normal':
        return 'text-foreground';
      case 'high':
        return 'text-warning';
      case 'vip':
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'pending':
        return 'text-warning';
      case 'confirmed':
        return 'text-success';
      case 'in-progress':
        return 'text-accent';
      case 'completed':
        return 'text-success';
      case 'cancelled':
        return 'text-error';
      case 'no-show':
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const isFormValid = () => {
    return bookingData?.customer && 
           bookingData?.service && 
           bookingData?.employee && 
           bookingData?.date && 
           bookingData?.time;
  };

  return (
    <div className="space-y-6">
      {/* Booking Status */}
      {userRole === 'admin' && (
        <Select
          label="Booking Status"
          description="Set the current status of this booking"
          options={statusOptions}
          value={status}
          onChange={handleStatusChange}
          disabled={isLoading}
        />
      )}
      {/* Priority Level */}
      <Select
        label="Priority Level"
        description="Set the priority level for this booking"
        options={priorityOptions}
        value={priority}
        onChange={handlePriorityChange}
        disabled={isLoading}
      />
      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Special Instructions & Notes
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add any special instructions, preferences, or notes for this booking..."
          disabled={isLoading}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {notes?.length}/500 characters
        </p>
      </div>
      {/* Booking Summary */}
      {bookingData?.service && (
        <div className="bg-muted rounded-lg p-4 border border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Receipt" size={16} className="mr-2" />
            Booking Summary
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price:</span>
              <span className="text-foreground">
                {formatPrice(calculateTotalPrice() / (priority === 'vip' ? 1.2 : priority === 'high' ? 1.1 : 1))}
              </span>
            </div>
            
            {priority !== 'normal' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Priority Adjustment ({priority === 'vip' ? '+20%' : priority === 'high' ? '+10%' : '0%'}):
                </span>
                <span className={getPriorityColor(priority)}>
                  +{formatPrice(calculateTotalPrice() - (calculateTotalPrice() / (priority === 'vip' ? 1.2 : priority === 'high' ? 1.1 : 1)))}
                </span>
              </div>
            )}
            
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total Amount:</span>
                <span className="text-foreground text-lg">
                  {formatPrice(calculateTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Current Status Display */}
      <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Current Status:</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(status)?.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm font-medium ${getStatusColor(status)}`}>
            {statusOptions?.find(opt => opt?.value === status)?.label || 'Unknown'}
          </span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={onSave}
          loading={isLoading}
          disabled={!isFormValid()}
          iconName="Save"
          iconPosition="left"
          className="flex-1"
        >
          Save Booking
        </Button>
        
        {userRole === 'admin' && (
          <Button
            variant="outline"
            onClick={onSaveAndCreateAnother}
            loading={isLoading}
            disabled={!isFormValid()}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            Save & Create Another
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
      </div>
      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm text-warning font-medium">
            You have unsaved changes
          </span>
        </div>
      )}
    </div>
  );
};

export default BookingForm;