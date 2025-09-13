import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DateTimePicker = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange,
  serviceDuration = 60,
  employeeId = null,
  disabled = false,
  dateError = null,
  timeError = null 
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Generate time slots (48 slots per day - 30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        slots?.push(time);
      }
    }
    return slots;
  };

  // Mock existing bookings for availability checking
  const mockBookings = {
    '2025-01-15': ['09:00', '10:30', '14:00', '16:30'],
    '2025-01-16': ['09:30', '11:00', '13:30', '15:00'],
    '2025-01-17': ['10:00', '12:00', '14:30', '17:00']
  };

  useEffect(() => {
    if (selectedDate && employeeId) {
      setIsLoadingSlots(true);
      
      // Simulate API call for availability
      setTimeout(() => {
        const allSlots = generateTimeSlots();
        const bookedSlots = mockBookings?.[selectedDate] || [];
        
        const available = allSlots?.filter(slot => {
          // Check if slot is already booked
          if (bookedSlots?.includes(slot)) return false;
          
          // Check if there's enough time for the service duration
          const [hours, minutes] = slot?.split(':')?.map(Number);
          const slotTime = hours * 60 + minutes;
          const endTime = slotTime + serviceDuration;
          
          // Check if service would extend beyond working hours (18:00 = 1080 minutes)
          if (endTime > 1080) return false;
          
          // Check for conflicts with subsequent bookings
          const nextBookedSlot = bookedSlots?.find(bookedSlot => {
            const [bookedHours, bookedMinutes] = bookedSlot?.split(':')?.map(Number);
            const bookedTime = bookedHours * 60 + bookedMinutes;
            return bookedTime > slotTime && bookedTime < endTime;
          });
          
          return !nextBookedSlot;
        });
        
        setAvailableSlots(available);
        setIsLoadingSlots(false);
      }, 500);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, employeeId, serviceDuration]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString?.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMinDate = () => {
    const today = new Date();
    return today?.toISOString()?.split('T')?.[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate?.setMonth(maxDate?.getMonth() + 3); // 3 months ahead
    return maxDate?.toISOString()?.split('T')?.[0];
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <Input
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e?.target?.value)}
          min={getMinDate()}
          max={getMaxDate()}
          disabled={disabled}
          error={dateError}
          required
        />
        {selectedDate && (
          <p className="text-sm text-muted-foreground mt-2">
            {formatDate(selectedDate)}
          </p>
        )}
      </div>
      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Select Time Slot
          <span className="text-error ml-1">*</span>
        </label>
        
        {!selectedDate || !employeeId ? (
          <div className="bg-muted rounded-lg p-6 text-center">
            <Icon name="Calendar" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Please select a date and employee first
            </p>
          </div>
        ) : isLoadingSlots ? (
          <div className="bg-muted rounded-lg p-6 text-center">
            <Icon name="Loader2" size={32} className="text-muted-foreground mx-auto mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading available time slots...
            </p>
          </div>
        ) : availableSlots?.length === 0 ? (
          <div className="bg-muted rounded-lg p-6 text-center">
            <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No available time slots for this date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots?.map((slot) => (
              <Button
                key={slot}
                variant={selectedTime === slot ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeChange(slot)}
                disabled={disabled}
                className="justify-center"
              >
                {formatTime(slot)}
              </Button>
            ))}
          </div>
        )}
        
        {timeError && (
          <p className="text-sm text-error mt-2">{timeError}</p>
        )}
        
        {selectedTime && (
          <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Selected: {formatTime(selectedTime)} on {formatDate(selectedDate)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Duration: {serviceDuration} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;