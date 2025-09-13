import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import EmployeeHeader from "../../components/ui/EmployeeHeader";
import {makeAuthenticatedRequest} from "../../utils/auth";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [company, setCompany] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    // Fetch company info from localStorage (set during registration)
    useEffect(() => {
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!companyId) return;
        setLoading(true);
        makeAuthenticatedRequest(`/api/company/id/${companyId}`)
            .then(res => res.json())
            .then(data => setCompany(data))
            .catch(() => setError('Failed to load company info'))
            .finally(() => setLoading(false));
    }, []);

  useEffect(() => {
    const employeeId = localStorage.getItem('userId');
    if (!employeeId) {
      setError('Employee not found. Please login again.');
      return;
    }
    setLoading(true);
    setError(null);
    // Fetch profile
    makeAuthenticatedRequest(`/api/employee/details`)
      .then(res => res.json())
      .then(data => setEmployee(data))
      .catch(() => setError('Failed to load profile'));
  }, [selectedDate]);

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

  const handleCancelBooking = async (bookingId) => {
    const employeeId = localStorage.getItem('employeeId');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/employee/${employeeId}/bookings/${bookingId}/cancel`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to cancel booking');
      // Refresh bookings
      const dateString = selectedDate.toISOString().split('T')[0];
      const bookingsRes = await fetch(`/api/employee/${employeeId}/bookings?startDate=${dateString}&endDate=${dateString}`);
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    const employeeId = localStorage.getItem('employeeId');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/employee/${employeeId}/bookings/${bookingId}/complete`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to mark booking as completed');
      // Refresh bookings
      const dateString = selectedDate.toISOString().split('T')[0];
      const bookingsRes = await fetch(`/api/employee/${employeeId}/bookings?startDate=${dateString}&endDate=${dateString}`);
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to mark booking as completed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EmployeeHeader employee={employee} company={company} />
      <main className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        {/* Calendar View of Bookings */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Bookings Calendar</h2>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handlePrevDay}><Icon name="ChevronLeft" size={16} /> Prev</Button>
            <span className="font-semibold text-lg">{selectedDate.toLocaleDateString()}</span>
            <Button variant="outline" size="sm" onClick={handleNextDay}>Next <Icon name="ChevronRight" size={16} /></Button>
          </div>
          {loading ? (
            <div>Loading bookings...</div>
          ) : error ? (
            <div className="text-error">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-muted-foreground">No bookings for this day.</div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-foreground">{booking.workName}</div>
                    <div className="text-sm text-muted-foreground">Customer: {booking.customerName}</div>
                    <div className="text-sm text-muted-foreground">Time: {new Date(booking.startDateTime).toLocaleTimeString()} - {new Date(booking.stopDateTime).toLocaleTimeString()}</div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-200' : booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{booking.status}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {booking.status === 'CONFIRMED' && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}><Icon name="X" size={14} /> Cancel</Button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button variant="default" size="sm" onClick={() => handleCompleteBooking(booking.id)}><Icon name="Check" size={14} /> Mark as Done</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Services Provided */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Services You Provide</h2>
          {services.length === 0 ? (
            <div className="text-muted-foreground">No services assigned.</div>
          ) : (
            <div className="space-y-2">
              {services.map(service => (
                <div key={service.id} className="bg-card border border-border rounded-lg p-3">
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-muted-foreground">{service.description}</div>
                  {/* Customers who booked this service today */}
                  <div className="mt-2">
                    <span className="font-semibold text-xs">Today's Customers:</span>
                    <ul className="list-disc ml-4">
                      {bookings.filter(b => b.workId === service.id).map(b => (
                        <li key={b.id} className="text-xs">{b.customerName}</li>
                      ))}
                      {bookings.filter(b => b.workId === service.id).length === 0 && (
                        <li className="text-xs text-muted-foreground">None</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Profile Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
          {employee ? (
            <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              {employee.pictureUrl ? (
                <img src={employee.pictureUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <Icon name="User" size={32} />
              )}
              <div>
                <div className="font-semibold text-lg">{employee.name}</div>
                <div className="text-sm text-muted-foreground">{employee.email}</div>
                <div className="text-sm text-muted-foreground">{employee.cellphone}</div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Loading profile...</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
