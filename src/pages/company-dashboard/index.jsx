import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import MetricsCard from './components/MetricsCard';
import BookingCalendarWidget from './components/BookingCalendarWidget';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActionsPanel from './components/QuickActionsPanel';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Mock user data
  const user = {
    role: 'admin',
    name: 'John Smith',
    email: 'john.smith@company.com'
  };

  // Mock company data
  const company = {
    name: 'Elite Beauty Salon',
    logo: null
  };

  // Mock notifications
  const notifications = {
    count: 3
  };

  // Mock dashboard metrics
  const dashboardMetrics = [
    {
      title: "Today\'s Bookings",
      value: "24",
      change: "+12%",
      changeType: "increase",
      icon: "Calendar",
      color: "primary",
      linkTo: "/create-edit-booking-screen",
      description: "5 pending approval"
    },
    {
      title: "Active Employees",
      value: "12",
      change: "+2",
      changeType: "increase",
      icon: "Users",
      color: "success",
      linkTo: "/employee-management-screen",
      description: "All available today"
    },
    {
      title: "Total Customers",
      value: "156",
      change: "+8%",
      changeType: "increase",
      icon: "UserCheck",
      color: "accent",
      linkTo: "/customer-dashboard",
      description: "23 new this month"
    },
    {
      title: "Today\'s Revenue",
      value: "$2,340",
      change: "+15%",
      changeType: "increase",
      icon: "DollarSign",
      color: "warning",
      linkTo: "#",
      description: "18 completed bookings"
    }
  ];

  useEffect(() => {
    // Check authentication using the correct token key
    const token = localStorage.getItem('jwtToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || !isAuthenticated || isAuthenticated !== 'true') {
      navigate('/');
      return;
    }

    // Simulate loading dashboard data
    setBookingStatus({
      type: 'success',
      message: 'Dashboard loaded successfully',
      details: 'All systems operational'
    });

    // Clear status after 3 seconds
    const timer = setTimeout(() => {
      setBookingStatus(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/company-registration-screen');
  };

  const handleStatusClick = (status) => {
    console.log('Status clicked:', status);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={user}
        company={company}
        notifications={notifications}
        onLogout={handleLogout}
        onToggleSidebar={handleSidebarToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
                linkTo={metric?.linkTo}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Booking Calendar Widget */}
            <div className="lg:col-span-6">
              <BookingCalendarWidget />
            </div>

            {/* Recent Activity Feed */}
            <div className="lg:col-span-3">
              <RecentActivityFeed />
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-3">
              <QuickActionsPanel />
            </div>
          </div>

          {/* Additional Stats Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Weekly Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bookings</span>
                  <span className="text-sm font-medium text-foreground">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="text-sm font-medium text-foreground">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Customers</span>
                  <span className="text-sm font-medium text-foreground">18</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Popular Services</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hair Cut & Style</span>
                  <span className="text-sm font-medium text-foreground">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Color Treatment</span>
                  <span className="text-sm font-medium text-foreground">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Manicure</span>
                  <span className="text-sm font-medium text-foreground">18%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Employee Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emma Wilson</span>
                  <span className="text-sm font-medium text-foreground">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">James Smith</span>
                  <span className="text-sm font-medium text-foreground">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sophie Chen</span>
                  <span className="text-sm font-medium text-foreground">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Booking Status Indicator */}
      <BookingStatusIndicator
        bookingStatus={bookingStatus}
        onStatusClick={handleStatusClick}
      />
    </div>
  );
};

export default CompanyDashboard;