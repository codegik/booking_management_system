import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load jwtToken from localStorage
  const jwtToken = localStorage.getItem('jwtToken');

  // Helper for fetch with auth
  const fetchWithAuth = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  // Fetch bookings for the company for the selected date
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await fetchWithAuth(`/api/company/bookings?startDate=${dateString}&endDate=${dateString}`);
        if (!response.ok) throw new Error('Failed to load bookings');
        const data = await response.json();
        // The response is an array of objects, each with a date and bookings array
        const entry = data.find(d => d.date === dateString);
        setBookings(entry?.bookings || []);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [selectedDate, jwtToken]);

  // Bookings are already filtered by date from the API response
  const todaysBookings = bookings;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-success/10 text-success border-success/20';
      case 'PENDING':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'COMPLETED':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'CANCELLED':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
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
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousDay}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
              <div>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
              </div>
          <Button variant="outline" size="sm" onClick={goToNextDay}>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      {/* Bookings List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader" size={32} className="animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Icon name="AlertCircle" size={32} className="text-error mx-auto mb-4" />
            <p className="text-error">{error}</p>
          </div>
        ) : todaysBookings?.length > 0 ? (
          todaysBookings?.map((booking) => (
            <div
              key={booking?.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{booking?.startDateTime ? new Date(booking.startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                  <p className="text-xs text-muted-foreground">{booking?.stopDateTime && booking?.startDateTime ? `${Math.round((new Date(booking.stopDateTime) - new Date(booking.startDateTime)) / 60000)}min` : ''}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {booking?.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {booking?.workName} • {booking?.employeeName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground">
                  {booking?.price ? `$${(booking.price / 100).toFixed(2)}` : ''}
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
      </div>
    </div>
  );
};

export default BookingCalendarWidget;

