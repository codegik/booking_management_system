import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import CustomerBottomTabs from '../../components/ui/CustomerBottomTabs';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import CustomerSelector from './components/CustomerSelector';
import ServiceSelector from './components/ServiceSelector';
import EmployeeSelector from './components/EmployeeSelector';
import DateTimePicker from './components/DateTimePicker';
import AvailabilityPreview from './components/AvailabilityPreview';
import BookingForm from './components/BookingForm';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CreateEditBookingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // User and app state
  const [currentUser] = useState({
    role: 'admin',
    name: 'John Doe',
    id: '1'
  });
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  
  // Form state
  const [bookingData, setBookingData] = useState({
    id: null,
    customer: '',
    service: '',
    employee: '',
    date: '',
    time: '',
    notes: '',
    status: 'pending',
    priority: 'normal'
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  
  // Check if editing existing booking
  const isEditing = location?.state?.bookingId || false;
  const editingBookingId = location?.state?.bookingId;

  useEffect(() => {
    // Load existing booking data if editing
    if (isEditing && editingBookingId) {
      loadBookingData(editingBookingId);
    }
  }, [isEditing, editingBookingId]);

  useEffect(() => {
    // Track unsaved changes
    const hasChanges = Object.values(bookingData)?.some(value => value !== '');
    setHasUnsavedChanges(hasChanges);
  }, [bookingData]);

  const loadBookingData = async (bookingId) => {
    setIsLoading(true);
    
    // Mock existing booking data
    const mockBooking = {
      id: bookingId,
      customer: '1',
      service: '1',
      employee: '1',
      date: '2025-01-15',
      time: '10:00',
      notes: 'Customer prefers morning appointments',
      status: 'confirmed',
      priority: 'normal'
    };
    
    setTimeout(() => {
      setBookingData(mockBooking);
      setIsLoading(false);
    }, 1000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData?.customer) {
      newErrors.customer = 'Please select a customer';
    }
    
    if (!bookingData?.service) {
      newErrors.service = 'Please select a service';
    }
    
    if (!bookingData?.employee) {
      newErrors.employee = 'Please assign an employee';
    }
    
    if (!bookingData?.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!bookingData?.time) {
      newErrors.time = 'Please select a time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleBookingDataChange = (newData) => {
    setBookingData(newData);
    // Clear related errors when data changes
    const newErrors = { ...errors };
    Object.keys(newData)?.forEach(key => {
      if (newData?.[key] && newErrors?.[key]) {
        delete newErrors?.[key];
      }
    });
    setErrors(newErrors);
  };

  const handleCustomerChange = (customerId) => {
    handleBookingDataChange({ ...bookingData, customer: customerId });
  };

  const handleAddNewCustomer = (customer) => {
    // In real app, this would add to customer list
    console.log('New customer added:', customer);
  };

  const handleServiceChange = (serviceId) => {
    handleBookingDataChange({ ...bookingData, service: serviceId });
  };

  const handleEmployeeChange = (employeeId) => {
    handleBookingDataChange({ ...bookingData, employee: employeeId });
  };

  const handleDateChange = (date) => {
    handleBookingDataChange({ ...bookingData, date, time: '' }); // Reset time when date changes
  };

  const handleTimeChange = (time) => {
    handleBookingDataChange({ ...bookingData, time });
  };

  const getServiceDuration = () => {
    const serviceDurations = {
      '1': 45,
      '2': 120,
      '3': 60,
      '4': 90,
      '5': 75,
      '6': 60,
      '7': 90,
      '8': 60
    };
    return serviceDurations?.[bookingData?.service] || 60;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setBookingStatus({
        type: 'error',
        message: 'Please fill in all required fields',
        details: 'Check the form for missing information'
      });
      return;
    }

    setIsLoading(true);
    setBookingStatus({
      type: isEditing ? 'updating' : 'creating',
      message: isEditing ? 'Updating booking...' : 'Creating booking...',
      progress: 0
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setBookingStatus(prev => ({
        ...prev,
        progress: Math.min((prev?.progress || 0) + 20, 90)
      }));
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      
      setBookingStatus({
        type: 'success',
        message: isEditing ? 'Booking updated successfully!' : 'Booking created successfully!',
        details: `Booking scheduled for ${bookingData?.date} at ${bookingData?.time}`,
        actionable: true
      });
      
      setHasUnsavedChanges(false);
      
      // Navigate after success
      setTimeout(() => {
        if (currentUser?.role === 'admin') {
          navigate('/company-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      }, 2000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setBookingStatus({
        type: 'error',
        message: 'Failed to save booking',
        details: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndCreateAnother = async () => {
    await handleSave();
    
    if (!errors || Object.keys(errors)?.length === 0) {
      // Reset form for new booking
      setTimeout(() => {
        setBookingData({
          id: null,
          customer: '',
          service: '',
          employee: '',
          date: '',
          time: '',
          notes: '',
          status: 'pending',
          priority: 'normal'
        });
        setBookingStatus(null);
      }, 2000);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    
    if (currentUser?.role === 'admin') {
      navigate('/company-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  const handleLogout = () => {
    navigate('/company-registration-screen');
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleStatusClick = (status) => {
    if (status?.actionable) {
      // Handle status click action
      console.log('Status clicked:', status);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={currentUser}
        company={{ name: 'Booking Management System' }}
        notifications={{ count: 0 }}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Admin Sidebar */}
      {currentUser?.role === 'admin' && (
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
          user={currentUser}
        />
      )}
      {/* Main Content */}
      <main className={`pt-16 ${
        currentUser?.role === 'admin' 
          ? `lg:pl-${isSidebarCollapsed ? '16' : '64'}` 
          : 'pb-16 lg:pb-0'
      } transition-all duration-300`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(currentUser?.role === 'admin' ? '/company-dashboard' : '/customer-dashboard')}
              iconName="Home"
              iconPosition="left"
            >
              Dashboard
            </Button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">
              {isEditing ? 'Edit Booking' : 'Create Booking'}
            </span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? 'Edit Booking' : 'Create New Booking'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isEditing 
                  ? 'Update booking details and manage appointment information'
                  : 'Schedule a new appointment with real-time availability checking'
                }
              </p>
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full">
                <Icon name="Edit" size={16} />
                <span className="text-sm font-medium">Editing Mode</span>
              </div>
            )}
          </div>

          {/* Main Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-8 space-y-8">
              {/* Customer Selection */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="User" size={20} className="mr-2" />
                  Customer Information
                </h2>
                <CustomerSelector
                  selectedCustomer={bookingData?.customer}
                  onCustomerChange={handleCustomerChange}
                  onAddNewCustomer={handleAddNewCustomer}
                  disabled={isLoading}
                  error={errors?.customer}
                />
              </div>

              {/* Service Selection */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Scissors" size={20} className="mr-2" />
                  Service Details
                </h2>
                <ServiceSelector
                  selectedService={bookingData?.service}
                  onServiceChange={handleServiceChange}
                  disabled={isLoading}
                  error={errors?.service}
                />
              </div>

              {/* Employee Assignment */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Users" size={20} className="mr-2" />
                  Employee Assignment
                </h2>
                <EmployeeSelector
                  selectedEmployee={bookingData?.employee}
                  onEmployeeChange={handleEmployeeChange}
                  selectedDate={bookingData?.date}
                  disabled={isLoading}
                  error={errors?.employee}
                />
              </div>

              {/* Date & Time Selection */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Schedule Appointment
                </h2>
                <DateTimePicker
                  selectedDate={bookingData?.date}
                  selectedTime={bookingData?.time}
                  onDateChange={handleDateChange}
                  onTimeChange={handleTimeChange}
                  serviceDuration={getServiceDuration()}
                  employeeId={bookingData?.employee}
                  disabled={isLoading}
                  dateError={errors?.date}
                  timeError={errors?.time}
                />
              </div>

              {/* Booking Form */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="FileText" size={20} className="mr-2" />
                  Booking Details
                </h2>
                <BookingForm
                  bookingData={bookingData}
                  onBookingDataChange={handleBookingDataChange}
                  onSave={handleSave}
                  onSaveAndCreateAnother={handleSaveAndCreateAnother}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  hasUnsavedChanges={hasUnsavedChanges}
                  userRole={currentUser?.role}
                />
              </div>
            </div>

            {/* Right Column - Availability Preview */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <AvailabilityPreview
                  selectedDate={bookingData?.date}
                  selectedEmployee={bookingData?.employee}
                  selectedTime={bookingData?.time}
                  serviceDuration={getServiceDuration()}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Customer Bottom Navigation */}
      {currentUser?.role === 'customer' && (
        <CustomerBottomTabs
          user={currentUser}
          notifications={{ bookings: 0 }}
        />
      )}
      {/* Booking Status Indicator */}
      <BookingStatusIndicator
        bookingStatus={bookingStatus}
        onStatusClick={handleStatusClick}
      />
    </div>
  );
};

export default CreateEditBookingScreen;