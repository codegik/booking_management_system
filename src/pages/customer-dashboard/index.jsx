import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import CustomerBottomTabs from '../../components/ui/CustomerBottomTabs';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import UpcomingBookings from './components/UpcomingBookings';
import QuickBookingSection from './components/QuickBookingSection';
import BookingHistory from './components/BookingHistory';
import ProfileSection from './components/ProfileSection';
import CalendarWidget from './components/CalendarWidget';
import Icon from '../../components/AppIcon';


const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Mock user data
  const [user] = useState({
    id: 'cust_001',
    role: 'customer',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    joinDate: '2023-01-15',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      bookingReminders: true,
      promotionalEmails: false,
      reminderTime: '24'
    },
    stats: {
      totalBookings: 24,
      completedBookings: 20,
      cancelledBookings: 2,
      totalSpent: 1250
    }
  });

  // Mock upcoming bookings
  const [upcomingBookings] = useState([
    {
      id: 'book_001',
      serviceName: 'Deep Cleaning Service',
      serviceId: 'serv_001',
      date: '2025-01-03',
      startTime: '10:00',
      endTime: '12:00',
      employeeName: 'Mike Wilson',
      employeeRole: 'Senior Cleaner',
      price: 120,
      duration: 120,
      status: 'confirmed',
      notes: 'Please focus on kitchen and bathrooms'
    },
    {
      id: 'book_002',
      serviceName: 'Plumbing Repair',
      serviceId: 'serv_002',
      date: '2025-01-05',
      startTime: '14:00',
      endTime: '15:30',
      employeeName: 'John Davis',
      employeeRole: 'Licensed Plumber',
      price: 85,
      duration: 90,
      status: 'pending',
      notes: 'Kitchen sink leak repair'
    }
  ]);

  // Mock available services
  const [availableServices] = useState([
    {
      id: 'serv_001',
      name: 'Deep Cleaning Service',
      description: 'Comprehensive cleaning service for your entire home including kitchen, bathrooms, bedrooms, and living areas.',
      price: 120,
      duration: 120,
      isActive: true,
      requirements: [
        'Access to all areas to be cleaned',
        'Clear pathways for equipment',
        'Secure valuable items'
      ]
    },
    {
      id: 'serv_002',
      name: 'Plumbing Repair',
      description: 'Professional plumbing services including leak repairs, pipe installation, and fixture maintenance.',
      price: 85,
      duration: 90,
      isActive: true,
      requirements: [
        'Access to plumbing areas',
        'Clear workspace around fixtures',
        'Turn off water if emergency'
      ]
    },
    {
      id: 'serv_003',
      name: 'Electrical Installation',
      description: 'Licensed electrical work including outlet installation, lighting setup, and electrical repairs.',
      price: 150,
      duration: 180,
      isActive: true,
      requirements: [
        'Access to electrical panels',
        'Clear work area',
        'Remove furniture if needed'
      ]
    },
    {
      id: 'serv_004',
      name: 'Garden Maintenance',
      description: 'Complete garden care including lawn mowing, pruning, weeding, and seasonal maintenance.',
      price: 75,
      duration: 120,
      isActive: false,
      requirements: [
        'Access to garden areas',
        'Water source available',
        'Clear pathways'
      ]
    }
  ]);

  // Mock booking history
  const [bookingHistory] = useState([
    {
      id: 'book_h001',
      serviceName: 'Deep Cleaning Service',
      serviceId: 'serv_001',
      date: '2024-12-15',
      startTime: '09:00',
      endTime: '11:00',
      employeeName: 'Mike Wilson',
      price: 120,
      duration: 120,
      status: 'completed',
      notes: 'Excellent service, very thorough cleaning',
      rating: 5
    },
    {
      id: 'book_h002',
      serviceName: 'Plumbing Repair',
      serviceId: 'serv_002',
      date: '2024-11-28',
      startTime: '13:00',
      endTime: '14:30',
      employeeName: 'John Davis',
      price: 85,
      duration: 90,
      status: 'completed',
      notes: 'Fixed the leak quickly and professionally',
      rating: 4
    },
    {
      id: 'book_h003',
      serviceName: 'Electrical Installation',
      serviceId: 'serv_003',
      date: '2024-11-10',
      startTime: '10:00',
      endTime: '13:00',
      employeeName: 'Alex Thompson',
      price: 150,
      duration: 180,
      status: 'cancelled',
      notes: 'Cancelled due to scheduling conflict'
    }
  ]);

  // All bookings for calendar
  const allBookings = [...upcomingBookings, ...bookingHistory];

  const handleLogout = () => {
    navigate('/company-registration-screen');
  };

  const handleReschedule = (bookingId) => {
    setBookingStatus({
      type: 'updating',
      message: 'Redirecting to reschedule...',
      details: `Booking #${bookingId}`,
      progress: 75
    });
    
    setTimeout(() => {
      navigate('/create-edit-booking-screen', {
        state: { bookingId, mode: 'reschedule' }
      });
    }, 1500);
  };

  const handleCancelBooking = (bookingId) => {
    setBookingStatus({
      type: 'updating',
      message: 'Cancelling booking...',
      details: `Booking #${bookingId}`,
      progress: 50
    });

    setTimeout(() => {
      setBookingStatus({
        type: 'success',
        message: 'Booking cancelled successfully',
        details: 'Refund will be processed within 3-5 business days'
      });
      
      setTimeout(() => {
        setBookingStatus(null);
      }, 3000);
    }, 2000);
  };

  const handleAddToCalendar = (booking) => {
    // Mock calendar integration
    const calendarData = {
      title: booking?.serviceName,
      start: `${booking?.date}T${booking?.startTime}`,
      end: `${booking?.date}T${booking?.endTime}`,
      description: `Service with ${booking?.employeeName}\nPrice: $${booking?.price}`
    };
    
    console.log('Adding to calendar:', calendarData);
    setBookingStatus({
      type: 'success',
      message: 'Calendar event created',
      details: 'Event added to your default calendar'
    });
    
    setTimeout(() => {
      setBookingStatus(null);
    }, 3000);
  };

  const handleUpdateProfile = (profileData) => {
    setBookingStatus({
      type: 'updating',
      message: 'Updating profile...',
      progress: 60
    });

    setTimeout(() => {
      setBookingStatus({
        type: 'success',
        message: 'Profile updated successfully'
      });
      
      setTimeout(() => {
        setBookingStatus(null);
      }, 2000);
    }, 1500);
  };

  const handleUpdatePreferences = (preferences) => {
    setBookingStatus({
      type: 'updating',
      message: 'Saving preferences...',
      progress: 80
    });

    setTimeout(() => {
      setBookingStatus({
        type: 'success',
        message: 'Preferences saved successfully'
      });
      
      setTimeout(() => {
        setBookingStatus(null);
      }, 2000);
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="opacity-90">Manage your bookings and discover new services.</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} />
                  <span className="text-sm">{upcomingBookings?.length} upcoming</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm">{user?.stats?.completedBookings} completed</span>
                </div>
              </div>
            </div>
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <UpcomingBookings
                  bookings={upcomingBookings}
                  onReschedule={handleReschedule}
                  onCancel={handleCancelBooking}
                  onAddToCalendar={handleAddToCalendar}
                />
                <QuickBookingSection services={availableServices} />
              </div>
              <div className="space-y-6">
                <CalendarWidget
                  bookings={allBookings}
                  onDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
                
                {/* Quick Stats */}
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium text-foreground">3 bookings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                      <span className="font-medium text-foreground">${user?.stats?.totalSpent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Favorite Service</span>
                      <span className="font-medium text-foreground">Deep Cleaning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'history':
        return (
          <BookingHistory
            bookings={bookingHistory}
            onRebook={(booking) => navigate('/create-edit-booking-screen', {
              state: { selectedService: booking, mode: 'create', isRebooking: true }
            })}
          />
        );
      
      case 'profile':
        return (
          <ProfileSection
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={user}
        company={{ name: 'ServiceHub', logo: null }}
        notifications={{ count: 2 }}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Tab Navigation */}
          <div className="hidden lg:flex items-center space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === 'dashboard' ?'bg-card text-foreground shadow-soft' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Home" size={16} className="mr-2 inline" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === 'history' ?'bg-card text-foreground shadow-soft' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="History" size={16} className="mr-2 inline" />
              History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === 'profile' ?'bg-card text-foreground shadow-soft' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="User" size={16} className="mr-2 inline" />
              Profile
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      {/* Mobile Bottom Navigation */}
      <CustomerBottomTabs
        user={user}
        notifications={{ bookings: upcomingBookings?.length }}
      />
      {/* Booking Status Indicator */}
      <BookingStatusIndicator
        bookingStatus={bookingStatus}
        onStatusClick={(status) => {
          if (status?.actionable) {
            console.log('Status clicked:', status);
          }
        }}
      />
    </div>
  );
};

export default CustomerDashboard;