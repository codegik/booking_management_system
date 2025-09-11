import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AdminSidebar from '../../components/ui/AdminSidebar';

const BookingManagementScreen = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={company}
      />
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/company-dashboard')}
                className="p-2"
              >
                ←
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
      <main className={`max-w-7xl mx-auto px-4 py-8 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>← Previous</Button>
          <h1 className="text-2xl font-bold text-foreground">{formatDate(selectedDate)}</h1>
          <Button variant="outline" size="sm" onClick={handleNextDay}>Next →</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No bookings for this day.</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
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
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-200' : booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingManagementScreen;
