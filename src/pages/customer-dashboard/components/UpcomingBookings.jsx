import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingBookings = ({ bookings = [], onReschedule, onCancel, onAddToCalendar }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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

  const handleCancelClick = (booking) => {
    setShowConfirmDialog({
      type: 'cancel',
      booking,
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel your appointment for ${booking?.serviceName}?`,
      confirmText: 'Cancel Booking',
      confirmVariant: 'destructive'
    });
  };

  const handleConfirmAction = () => {
    if (showConfirmDialog?.type === 'cancel') {
      onCancel(showConfirmDialog?.booking?.id);
    }
    setShowConfirmDialog(null);
  };

  if (bookings?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Bookings</h3>
        <p className="text-muted-foreground mb-4">You don't have any scheduled appointments.</p>
        <Button variant="default" className="mt-2">
          <Icon name="Plus" size={16} className="mr-2" />
          Book a Service
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Upcoming Bookings</h2>
        <span className="text-sm text-muted-foreground">{bookings?.length} appointments</span>
      </div>
      <div className="space-y-3">
        {bookings?.map((booking) => (
          <div key={booking?.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-smooth">
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
                    {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
                {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{booking?.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{booking?.employeeRole}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${booking?.price}</p>
                <p className="text-xs text-muted-foreground">{booking?.duration} min</p>
              </div>
            </div>

            {booking?.notes && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <Icon name="MessageSquare" size={14} className="inline mr-1" />
                  {booking?.notes}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(booking?.id)}
                disabled={booking?.status === 'cancelled'}
              >
                <Icon name="Calendar" size={14} className="mr-1" />
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelClick(booking)}
                disabled={booking?.status === 'cancelled'}
              >
                <Icon name="X" size={14} className="mr-1" />
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddToCalendar(booking)}
              >
                <Icon name="Download" size={14} className="mr-1" />
                Add to Calendar
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center mr-3">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{showConfirmDialog?.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{showConfirmDialog?.message}</p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button
                variant={showConfirmDialog?.confirmVariant}
                onClick={handleConfirmAction}
                className="flex-1"
              >
                {showConfirmDialog?.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;