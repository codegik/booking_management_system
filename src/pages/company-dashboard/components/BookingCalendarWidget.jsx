import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock booking data for today
  const todaysBookings = [
    {
      id: 1,
      time: "09:00",
      customer: "Sarah Johnson",
      service: "Hair Cut & Style",
      employee: "Emma Wilson",
      status: "confirmed",
      duration: 60,
      price: 85
    },
    {
      id: 2,
      time: "10:30",
      customer: "Michael Brown",
      service: "Beard Trim",
      employee: "James Smith",
      status: "pending",
      duration: 30,
      price: 35
    },
    {
      id: 3,
      time: "11:00",
      customer: "Lisa Davis",
      service: "Color Treatment",
      employee: "Emma Wilson",
      status: "confirmed",
      duration: 120,
      price: 150
    },
    {
      id: 4,
      time: "14:00",
      customer: "Robert Taylor",
      service: "Full Service",
      employee: "James Smith",
      status: "completed",
      duration: 90,
      price: 120
    },
    {
      id: 5,
      time: "15:30",
      customer: "Amanda White",
      service: "Manicure",
      employee: "Sophie Chen",
      status: "confirmed",
      duration: 45,
      price: 45
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(newDate?.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(newDate?.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
          <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousDay}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextDay}>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      {/* Bookings List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todaysBookings?.length > 0 ? (
          todaysBookings?.map((booking) => (
            <div
              key={booking?.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{booking?.time}</p>
                  <p className="text-xs text-muted-foreground">{booking?.duration}min</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {booking?.customer}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {booking?.service} • {booking?.employee}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground">
                  ${booking?.price}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking?.status)}`}>
                  {booking?.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings scheduled for this day</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {todaysBookings?.length} appointments today
        </p>
        <Link to="/create-edit-booking-screen">
          <Button variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            New Booking
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingCalendarWidget;