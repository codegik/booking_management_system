import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CustomerBookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

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

  // Fetch company info from localStorage (set during registration)
  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) return;
    fetchWithAuth(`/api/company/id/${companyId}`)
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(() => setError('Failed to load company info'));
  }, [jwtToken]);

  // Fetch customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth('/api/customer/bookings');

        if (!response.ok) {
          throw new Error('Failed to load booking history');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message || 'Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [jwtToken]);

  // Format date for display
  const formatDate = (dateString) => {
    // Parse the date string and treat it as local time to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    // Handle timezone issues by parsing the datetime string manually
    // Expected format: "2025-09-08T14:30:00" or similar ISO format
    const date = new Date(dateTimeString);

    // If the datetime string doesn't include timezone info, treat it as local time
    if (dateTimeString.indexOf('T') !== -1 && dateTimeString.indexOf('Z') === -1 && dateTimeString.indexOf('+') === -1 && dateTimeString.indexOf('-', 10) === -1) {
      // Parse manually to avoid timezone conversion for local datetime strings
      const [datePart, timePart] = dateTimeString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hour, minute, second || 0);

      return localDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
    }

    // For datetime strings with timezone info, use normal parsing
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Cancel booking function
  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingBookingId(bookingId);
      setError(null);

      const response = await fetchWithAuth(`/api/customer/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Update the booking status in the local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'CANCELLED' }
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError(error.message || 'Failed to cancel booking');
    } finally {
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/customer-dashboard')}
                className="p-2"
              >
                  <Icon name="Home" size={16} className="mr-1" />
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              {company?.pictureUrl && (
                <img src={company.pictureUrl} alt="Company" className="w-8 h-8 rounded-full object-cover" />
              )}
              <span className="text-sm text-muted-foreground">{company?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't made any appointments yet. Book your first appointment to get started.
            </p>
            <Button onClick={() => navigate('/customer-dashboard')}>
              Book Your First Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Appointments ({bookings.length})
            </h2>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      {/* Work picture */}
                      {booking.workPictureUrl || booking.pictureUrl ? (
                        <img
                          src={booking.workPictureUrl || booking.pictureUrl}
                          alt={booking.workName}
                          className="w-10 h-10 rounded object-cover border border-border mr-2"
                          onError={e => { e.target.onerror = null; e.target.src = '/assets/images/no_image.png'; }}
                        />
                      ) : (
                        <img
                          src="/assets/images/no_image.png"
                          alt="No work picture"
                          className="w-10 h-10 rounded object-cover border border-border mr-2"
                        />
                      )}
                      <h3 className="font-semibold text-foreground">{booking.workName}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        {/* Employee picture */}
                        {booking.employeePictureUrl ? (
                          <img
                            src={booking.employeePictureUrl}
                            alt={booking.employeeName}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                            onError={e => { e.target.onerror = null; e.target.src = '/assets/images/no_image.png'; }}
                          />
                        ) : (
                          <img
                            src="/assets/images/no_image.png"
                            alt="No employee picture"
                            className="w-6 h-6 rounded-full object-cover border border-border"
                          />
                        )}
                        <span>{booking.employeeName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <Icon name="Calendar" size={14} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <Icon name="Clock" size={14} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatTime(booking.startDateTime)} - {formatTime(booking.stopDateTime)}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                          <Icon name="FileText" size={14} className="flex-shrink-0 mt-0.5" />
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingBookingId === booking.id}
                      >
                        <Icon name="X" size={14} />
                        <span>{cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}</span>
                      </Button>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerBookingHistory;
