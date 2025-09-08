import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';


const CustomerDashboard = () => {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState(null);
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    setLoading(true);
    fetchWithAuth(`/api/company/id/${companyId}`)
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(() => setError('Failed to load company info'))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  // Step 1: Fetch available works/services
  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    fetchWithAuth(`/api/work/all`)
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(() => setError('Failed to load works'))
      .finally(() => setLoading(false));
  }, [company, jwtToken]);

  // Step 2: Use employees from selected work (no separate API call needed)
  useEffect(() => {
    if (!selectedWork) {
      setEmployees([]);
      return;
    }

    setEmployees(selectedWork.employees || []);
  }, [selectedWork]);

  // Step 3: Fetch availability for selected employee, work, and date
  useEffect(() => {
    if (!selectedEmployee || !selectedWork || !selectedDate) return;
    setLoading(true);

    // Format date as yyyy-MM-dd
    const dateString = selectedDate.toISOString().split('T')[0];

    fetchWithAuth(`/api/customer/available-slots?employeeId=${selectedEmployee.id}&workId=${selectedWork.id}&date=${dateString}`)
      .then(res => res.json())
      .then(data => setAvailability(data))
      .catch(() => setError('Failed to load availability'))
      .finally(() => setLoading(false));
  }, [selectedEmployee, selectedWork, selectedDate, jwtToken]);

  // Format time for display
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle slot selection (show confirmation)
  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      setLoading(true);
      setError(null);
      setShowConfirmation(false);

      // Calculate the start slot number (1-48) based on start time
      // Each slot is 30 minutes, starting from 00:00
      const startTime = new Date(selectedSlot.startDateTime);
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();
      const startOnSlot = (hours * 2) + (minutes === 30 ? 1 : 0) + 1; // Convert to 1-based slot number

      // Prepare booking request payload
      const bookingRequest = {
        employeeId: selectedEmployee.id,
        workId: selectedWork.id,
        bookingDate: selectedDate.toISOString().split('T')[0], // yyyy-MM-dd format
        startOnSlot: startOnSlot,
        notes: "" // Optional notes field
      };

      console.log('Booking request:', bookingRequest);

      const response = await fetchWithAuth('/api/customer/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : 'Booking failed';
        throw new Error(errorMessage);
      }

      const bookingResult = await response.json();
      console.log('Booking successful:', bookingResult);

      // Show success message
      alert(`Booking confirmed! ${availability.workName} with ${availability.employeeName} at ${formatTime(selectedSlot.startDateTime)} on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`);

      // Reset selection and refresh availability
      setSelectedSlot(null);
      const dateString = selectedDate.toISOString().split('T')[0];
      const availabilityResponse = await fetchWithAuth(`/api/customer/available-slots?employeeId=${selectedEmployee.id}&workId=${selectedWork.id}&date=${dateString}`);
      if (availabilityResponse.ok) {
        const updatedAvailability = await availabilityResponse.json();
        setAvailability(updatedAvailability);
      }

    } catch (error) {
      console.error('Booking failed:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = () => {
    setSelectedSlot(null);
    setShowConfirmation(false);
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  // Check if a date is a company work day
  const isCompanyWorkDay = (date) => {
    if (!company?.workDays) return false;

    // JavaScript day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Company workDay: 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
    const jsDay = date.getDay();
    const companyDay = jsDay === 0 ? 7 : jsDay; // Convert Sunday from 0 to 7

    return company.workDays.some(workDay => workDay.workDay === companyDay);
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    days.push(
      <div key="headers" className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
    );

    // Add empty cells for days before the first day of the month
    const calendar = [];
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const isSelected = isSameDay(date, selectedDate);
      const isCurrentDay = isToday(date);
      const isPast = isPastDate(date);
      const isWorkDay = isCompanyWorkDay(date);
      const isDisabled = isPast || !isWorkDay;

      // Determine styling based on day status
      let buttonClasses = "p-2 text-sm rounded-lg transition-colors border ";
      let titleText = "";

      if (isSelected) {
        // Selected date - primary color
        buttonClasses += "bg-primary text-primary-foreground font-semibold border-primary";
      } else if (isPast) {
        // Past dates - very muted
        buttonClasses += "text-muted-foreground/30 cursor-not-allowed bg-muted/10 border-transparent";
        titleText = "Past date";
      } else if (!isWorkDay) {
        // Company closed days - distinct red/orange tint
        buttonClasses += "text-red-400 bg-red-50 border-red-200 cursor-not-allowed";
        titleText = "Company is closed on this day";
      } else {
        // Available work days - normal interactive
        buttonClasses += "hover:bg-accent hover:border-accent text-foreground border-border";
      }

      // Add today indicator ring if not selected
      if (isCurrentDay && !isSelected && !isDisabled) {
        buttonClasses += " ring-2 ring-primary ring-offset-1";
      }

      calendar.push(
        <button
          key={day}
          onClick={() => !isDisabled && setSelectedDate(date)}
          disabled={isDisabled}
          className={buttonClasses}
          title={titleText}
        >
          {day}
        </button>
      );
    }

    days.push(
      <div key="calendar" className="grid grid-cols-7 gap-1">
        {calendar}
      </div>
    );

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Wizard step rendering
  const renderStep = () => {
    if (step === 1) {
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4">Select a Service</h2>
          <div className="grid gap-3">
            {works.map(work => (
              <Button
                key={work.id}
                onClick={() => { setSelectedWork(work); setStep(2); }}
                className="text-left p-4 h-auto"
                variant="outline"
              >
                <div>
                  <div className="font-medium">{work.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {work.durationMinutes} minutes • ${(work.price / 100).toFixed(2)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      );
    }
    if (step === 2 || step === 3) {
      return (
        <div className="space-y-6">
          {/* Professional Selection - Always Visible */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Professional</h2>
            <div className="grid gap-3">
              {employees.map(emp => (
                <Button
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp); setStep(3); }}
                  className={`text-left p-4 h-auto ${selectedEmployee?.id === emp.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                  variant="outline"
                >
                  <div className="flex items-center space-x-3">
                    {/* Professional Photo */}
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {emp.pictureUrl ? (
                        <img
                          src={emp.pictureUrl}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <span className="text-primary font-semibold text-lg">
                            {emp.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Professional Name */}
                    <div className="flex-1">
                      <div className="font-medium">{emp.name}</div>
                      {selectedEmployee?.id === emp.id && (
                        <div className="text-sm text-primary">Selected</div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setStep(1)}>Back to Services</Button>
          </div>

          {/* Calendar and Time Slots Section - Only show when professional is selected */}
          {step === 3 && selectedEmployee && (
            <div className="space-y-6">
              {/* Calendar Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Select Date</h2>
                <div className="bg-card border border-border rounded-lg p-4">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth(-1)}
                      className="p-2"
                    >
                      ←
                    </Button>
                    <h3 className="font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth(1)}
                      className="p-2"
                    >
                      →
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  {generateCalendar()}
                </div>
              </div>

              {/* Time Slots Section */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Available Times</h2>
                  {availability && (
                    <div className="bg-accent/10 rounded-lg p-3 mb-4">
                      <div className="text-sm">
                        <div className="font-medium">{availability.workName} with {availability.employeeName}</div>
                        <div className="text-muted-foreground">Duration: {availability.durationMinutes} minutes</div>
                        <div className="text-muted-foreground">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availability?.availableSlots?.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No available slots for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
                    </p>
                  )}
                  {availability?.availableSlots?.map((slot, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSlotSelection(slot)}
                      className="w-full text-left p-4 h-auto justify-between"
                      variant="outline"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">
                            {formatTime(slot.startDateTime)} - {formatTime(slot.stopDateTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {availability.durationMinutes} minutes
                          </div>
                        </div>
                        <div className="text-primary font-medium">
                          Book
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      {/* Top: Company name and picture only */}
      <div className="flex flex-col items-center mb-8">
        {company?.pictureUrl && (
          <img src={company.pictureUrl} alt="Company" className="w-20 h-20 rounded-full object-cover mb-2" />
        )}
        <h1 className="text-2xl font-bold text-foreground">{company?.name || 'Company'}</h1>
      </div>
      <div className="w-full max-w-md bg-card rounded-lg shadow-soft border border-border p-6">
        {error && <div className="text-error mb-4">{error}</div>}
        {loading ? <div className="text-muted-foreground">Loading...</div> : renderStep()}
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
            <div className="text-sm text-muted-foreground mb-4">
              <p>Service: <span className="font-medium">{availability.workName}</span></p>
              <p>Professional: <span className="font-medium">{availability.employeeName}</span></p>
              <p>Date: <span className="font-medium">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
              <p>Time: <span className="font-medium">{formatTime(selectedSlot.startDateTime)} - {formatTime(selectedSlot.stopDateTime)}</span></p>
              <p>Duration: <span className="font-medium">{availability.durationMinutes} minutes</span></p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelBooking} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
