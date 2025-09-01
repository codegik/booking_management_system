import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingHistory = ({ bookings = [], onRebook }) => {
  const navigate = useNavigate();
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'no-show':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredBookings = bookings?.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking?.status === filterStatus;
  });

  const toggleExpanded = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleRebook = (booking) => {
    navigate('/create-edit-booking-screen', {
      state: {
        selectedService: {
          id: booking?.serviceId,
          name: booking?.serviceName,
          price: booking?.price,
          duration: booking?.duration
        },
        mode: 'create',
        isRebooking: true
      }
    });
  };

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  if (bookings?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="History" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Booking History</h3>
        <p className="text-muted-foreground">Your completed and past bookings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Booking History</h2>
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-3 py-1 text-sm border border-border rounded-md bg-card text-foreground"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-3">
        {filteredBookings?.map((booking) => (
          <div key={booking?.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-smooth"
              onClick={() => toggleExpanded(booking?.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{booking?.serviceName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Icon name="Calendar" size={14} className="mr-1" />
                      {formatDate(booking?.date)}
                    </div>
                    <div className="flex items-center">
                      <Icon name="Clock" size={14} className="mr-1" />
                      {formatTime(booking?.startTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
                    {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
                  </span>
                  <Icon 
                    name={expandedBooking === booking?.id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={12} color="white" />
                  </div>
                  <span className="text-sm text-muted-foreground">{booking?.employeeName}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">${booking?.price}</span>
              </div>
            </div>

            {expandedBooking === booking?.id && (
              <div className="px-4 pb-4 border-t border-border bg-muted/20">
                <div className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-medium text-foreground">{booking?.duration} min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Booking ID:</span>
                      <span className="ml-2 font-mono text-foreground">#{booking?.id}</span>
                    </div>
                  </div>

                  {booking?.notes && (
                    <div className="p-3 bg-card rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <Icon name="MessageSquare" size={14} className="inline mr-1" />
                        {booking?.notes}
                      </p>
                    </div>
                  )}

                  {booking?.rating && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      <div className="flex items-center">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < booking?.rating ? "text-warning fill-current" : "text-muted"}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking?.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRebook(booking)}
                      >
                        <Icon name="RotateCcw" size={14} className="mr-1" />
                        Book Again
                      </Button>
                    )}
                    {booking?.status === 'completed' && !booking?.rating && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Handle rating */}}
                      >
                        <Icon name="Star" size={14} className="mr-1" />
                        Rate Service
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Handle receipt download */}}
                    >
                      <Icon name="Download" size={14} className="mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredBookings?.length === 0 && filterStatus !== 'all' && (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No {filterStatus} bookings</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filter to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;