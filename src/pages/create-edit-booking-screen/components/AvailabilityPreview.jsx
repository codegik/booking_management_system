import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilityPreview = ({ 
  selectedDate, 
  selectedEmployee, 
  selectedTime,
  serviceDuration = 60,
  className = '' 
}) => {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock employee names
  const employeeNames = {
    '1': 'Sarah Mitchell',
    '2': 'Jessica Chen',
    '3': 'Maria Rodriguez',
    '4': 'Amanda Johnson',
    '5': 'Rachel Green'
  };

  // Mock schedule data
  const mockSchedules = {
    '2025-01-15': [
      { time: '09:00', duration: 60, customer: 'John Smith', service: 'Hair Cut', status: 'confirmed' },
      { time: '10:30', duration: 90, customer: 'Sarah Johnson', service: 'Hair Color', status: 'confirmed' },
      { time: '14:00', duration: 45, customer: 'Mike Brown', service: 'Styling', status: 'pending' },
      { time: '16:30', duration: 60, customer: 'Emily Davis', service: 'Hair Cut', status: 'confirmed' }
    ],
    '2025-01-16': [
      { time: '09:30', duration: 75, customer: 'David Wilson', service: 'Manicure', status: 'confirmed' },
      { time: '11:00', duration: 60, customer: 'Lisa Anderson', service: 'Facial', status: 'confirmed' },
      { time: '13:30', duration: 90, customer: 'Robert Taylor', service: 'Massage', status: 'pending' },
      { time: '15:00', duration: 45, customer: 'Jennifer Martinez', service: 'Styling', status: 'confirmed' }
    ],
    '2025-01-17': [
      { time: '10:00', duration: 120, customer: 'Alex Thompson', service: 'Hair Color', status: 'confirmed' },
      { time: '12:00', duration: 60, customer: 'Maria Garcia', service: 'Hair Cut', status: 'confirmed' },
      { time: '14:30', duration: 75, customer: 'James Wilson', service: 'Manicure', status: 'pending' },
      { time: '17:00', duration: 45, customer: 'Anna Johnson', service: 'Styling', status: 'confirmed' }
    ]
  };

  useEffect(() => {
    if (selectedDate && selectedEmployee) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const daySchedule = mockSchedules?.[selectedDate] || [];
        setSchedule(daySchedule);
        setIsLoading(false);
      }, 300);
    } else {
      setSchedule([]);
    }
  }, [selectedDate, selectedEmployee]);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString?.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'new':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'new':
        return 'Plus';
      default:
        return 'Circle';
    }
  };

  const generateTimeGrid = () => {
    const grid = [];
    for (let hour = 9; hour < 18; hour++) {
      grid?.push(`${hour?.toString()?.padStart(2, '0')}:00`);
      grid?.push(`${hour?.toString()?.padStart(2, '0')}:30`);
    }
    return grid;
  };

  const isTimeSlotBooked = (timeSlot) => {
    return schedule?.some(booking => {
      const bookingStart = booking?.time;
      const [startHour, startMin] = bookingStart?.split(':')?.map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = startTime + booking?.duration;
      
      const [slotHour, slotMin] = timeSlot?.split(':')?.map(Number);
      const slotTime = slotHour * 60 + slotMin;
      
      return slotTime >= startTime && slotTime < endTime;
    });
  };

  const isNewBookingSlot = (timeSlot) => {
    if (!selectedTime) return false;
    
    const [selectedHour, selectedMin] = selectedTime?.split(':')?.map(Number);
    const selectedStartTime = selectedHour * 60 + selectedMin;
    const selectedEndTime = selectedStartTime + serviceDuration;
    
    const [slotHour, slotMin] = timeSlot?.split(':')?.map(Number);
    const slotTime = slotHour * 60 + slotMin;
    
    return slotTime >= selectedStartTime && slotTime < selectedEndTime;
  };

  if (!selectedDate || !selectedEmployee) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Availability Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a date and employee to view their schedule
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Schedule Preview
            </h3>
            <p className="text-sm text-muted-foreground">
              {employeeNames?.[selectedEmployee]} • {formatDate(selectedDate)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location?.reload()}
            disabled={isLoading}
          >
            <Icon name="RefreshCw" size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      {/* Schedule Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="text-muted-foreground mx-auto mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading schedule...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Time Grid */}
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {generateTimeGrid()?.map((timeSlot) => {
                const isBooked = isTimeSlotBooked(timeSlot);
                const isNewBooking = isNewBookingSlot(timeSlot);
                const booking = schedule?.find(b => b?.time === timeSlot);
                
                return (
                  <div
                    key={timeSlot}
                    className={`flex items-center justify-between p-2 rounded-md border transition-smooth ${
                      isNewBooking
                        ? 'bg-primary/10 border-primary/20'
                        : isBooked
                        ? getStatusColor(booking?.status)
                        : 'bg-muted/50 border-border hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-foreground w-16">
                        {formatTime(timeSlot)}
                      </span>
                      
                      {isNewBooking ? (
                        <div className="flex items-center space-x-2">
                          <Icon name="Plus" size={14} className="text-primary" />
                          <span className="text-sm font-medium text-primary">
                            New Booking
                          </span>
                        </div>
                      ) : isBooked && booking ? (
                        <div className="flex items-center space-x-2">
                          <Icon name={getStatusIcon(booking?.status)} size={14} />
                          <div>
                            <span className="text-sm font-medium">
                              {booking?.customer}
                            </span>
                            <p className="text-xs opacity-75">
                              {booking?.service} • {booking?.duration}min
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success/20 border border-success/20 rounded"></div>
                  <span className="text-muted-foreground">Confirmed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning/20 border border-warning/20 rounded"></div>
                  <span className="text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary/20 border border-primary/20 rounded"></div>
                  <span className="text-muted-foreground">New Booking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted border border-border rounded"></div>
                  <span className="text-muted-foreground">Available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityPreview;