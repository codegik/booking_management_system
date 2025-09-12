import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RoleBasedHeader from "../../components/ui/RoleBasedHeader";
import {handleLogout} from "../../utils/auth";

const BookingManagementScreen = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Fetch bookings for selected date
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        // Use correct endpoint with startDate and endDate as the same day
        const response = await fetchWithAuth(`/api/company/bookings?startDate=${dateString}&endDate=${dateString}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        // The response is an array of objects, each with a date and bookings array
        // Find the entry for the selected date
        const entry = data.find(d => d.date === dateString);
        setBookings(entry?.bookings || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [selectedDate, jwtToken]);

  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };
  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleCancelBooking = async (bookingId, customerId) => {
    setCancellingBookingId(bookingId);
    setCancelError(null);
    try {
      const response = await fetchWithAuth(`/api/customer/${customerId}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      // Refresh bookings after cancellation
      const dateString = selectedDate.toISOString().split('T')[0];
      const bookingsRes = await fetchWithAuth(`/api/company/bookings?startDate=${dateString}&endDate=${dateString}`);
      const bookingsData = await bookingsRes.json();
      const entry = bookingsData.find(d => d.date === dateString);
      setBookings(entry?.bookings || []);
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingBookingId(null);
    }
  };

  // Booking counters for filters
  const allCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const inactiveCount = bookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <RoleBasedHeader
            company={company}
            onLogout={() => handleLogout(navigate)}
        />
      {/* Main Content */}
      <main className="pt-20 max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                      <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
                      <p className="text-muted-foreground">Manage your customer's bookings</p>
                  </div>
              </div>
          </div>
        {/* Filter Buttons */}
        <div className="mb-4 flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1 h-8 px-2 text-xs"
            onClick={() => setFilterStatus('all')}
          >
            <Icon name="List" size={14} />
            <span>All</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">{allCount}</span>
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1 h-8 px-2 text-xs"
            onClick={() => setFilterStatus('active')}
          >
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span>Active</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-success/10 text-success font-bold text-xs">{activeCount}</span>
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1 h-8 px-2 text-xs"
            onClick={() => setFilterStatus('inactive')}
          >
            <Icon name="XCircle" size={14} className="text-error" />
            <span>Inactive</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error font-bold text-xs">{inactiveCount}</span>
          </Button>
        </div>
        {/* Filtered Bookings List */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No bookings for this day.</div>
        ) : (
          <div className="space-y-4">
            {bookings
              .filter(booking => {
                if (filterStatus === 'all') return true;
                if (filterStatus === 'active') return booking.status === 'CONFIRMED';
                if (filterStatus === 'inactive') return booking.status === 'CANCELLED';
                return true;
              })
              .map(booking => (
                <div key={booking.id} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    {/* Work picture */}
                    {booking.workPictureUrl ? (
                      <img
                        src={booking.workPictureUrl}
                        alt={booking.workName}
                        className="w-12 h-12 rounded object-cover border border-border"
                        onError={e => { e.target.onerror = null; e.target.src = '/assets/images/no_image.png'; }}
                      />
                    ) : (
                      <img
                        src="/assets/images/no_image.png"
                        alt="No work picture"
                        className="w-12 h-12 rounded object-cover border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-foreground">{booking.workName}</div>
                      <div className="text-sm text-muted-foreground">Customer: {booking.customerName}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {/* Employee picture */}
                        {booking.employeePictureUrl ? (
                          <img
                            src={booking.employeePictureUrl}
                            alt={booking.employeeName}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                            onError={e => { e.target.onerror = null; e.target.src = '/assets/images/no_image.png'; }}
                          />
                        ) : (
                          <img
                            src="/assets/images/no_image.png"
                            alt="No employee picture"
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                        )}
                        <span>{booking.employeeName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Time: {formatTime(booking.startDateTime)} - {formatTime(booking.stopDateTime)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-200' : booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{booking.status}</span>
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => handleCancelBooking(booking.id, booking.customerId)}
                        disabled={cancellingBookingId === booking.id}
                      >
                        <Icon name="X" size={14} />
                        <span>{cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            {cancelError && <div className="text-error text-center mt-2">{cancelError}</div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingManagementScreen;
