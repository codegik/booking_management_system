import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';

const ServiceManagementScreen = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Mock user data
  const currentUser = {
    role: 'admin',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com'
  };

  // Mock company data
  const companyData = {
    name: 'Professional Services Co.',
    logo: null
  };

  // Mock services data
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Deep Cleaning Service',
      description: 'Comprehensive deep cleaning for homes and offices including all surfaces, appliances, and hard-to-reach areas.',
      duration: 180,
      price: 150.00,
      isActive: true,
      assignedEmployeeIds: [1, 2, 3],
      totalBookings: 45,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-08-20T14:30:00Z'
    },
    {
      id: 2,
      name: 'Regular House Cleaning',
      description: 'Standard cleaning service for regular maintenance of residential properties.',
      duration: 120,
      price: 80.00,
      isActive: true,
      assignedEmployeeIds: [1, 4, 5],
      totalBookings: 128,
      createdAt: '2025-02-01T09:00:00Z',
      updatedAt: '2025-08-25T11:15:00Z'
    },
    {
      id: 3,
      name: 'Office Cleaning',
      description: 'Professional office cleaning service for commercial spaces and business environments.',
      duration: 240,
      price: 200.00,
      isActive: true,
      assignedEmployeeIds: [2, 3, 6],
      totalBookings: 67,
      createdAt: '2025-03-10T08:30:00Z',
      updatedAt: '2025-08-28T16:45:00Z'
    },
    {
      id: 4,
      name: 'Carpet Cleaning',
      description: 'Specialized carpet and upholstery cleaning using professional equipment and eco-friendly solutions.',
      duration: 90,
      price: 120.00,
      isActive: false,
      assignedEmployeeIds: [7],
      totalBookings: 23,
      createdAt: '2025-04-05T12:00:00Z',
      updatedAt: '2025-07-15T10:20:00Z'
    },
    {
      id: 5,
      name: 'Window Cleaning',
      description: 'Interior and exterior window cleaning service for residential and commercial properties.',
      duration: 60,
      price: 60.00,
      isActive: true,
      assignedEmployeeIds: [8, 9],
      totalBookings: 89,
      createdAt: '2025-05-20T14:00:00Z',
      updatedAt: '2025-08-30T09:30:00Z'
    },
    {
      id: 6,
      name: 'Post-Construction Cleanup',
      description: 'Specialized cleaning service for newly constructed or renovated properties.',
      duration: 360,
      price: 350.00,
      isActive: true,
      assignedEmployeeIds: [2, 3, 10],
      totalBookings: 12,
      createdAt: '2025-06-12T11:30:00Z',
      updatedAt: '2025-08-22T13:45:00Z'
    }
  ]);

  // Mock employees data
  const employees = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@company.com',
      department: 'Residential Cleaning',
      currentWorkload: 75,
      isActive: true
    },
    {
      id: 2,
      name: 'Jennifer Chen',
      email: 'jennifer.chen@company.com',
      department: 'Commercial Cleaning',
      currentWorkload: 60,
      isActive: true
    },
    {
      id: 3,
      name: 'David Thompson',
      email: 'david.thompson@company.com',
      department: 'Commercial Cleaning',
      currentWorkload: 85,
      isActive: true
    },
    {
      id: 4,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      department: 'Residential Cleaning',
      currentWorkload: 45,
      isActive: true
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.wilson@company.com',
      department: 'Residential Cleaning',
      currentWorkload: 70,
      isActive: true
    },
    {
      id: 6,
      name: 'Amanda Davis',
      email: 'amanda.davis@company.com',
      department: 'Commercial Cleaning',
      currentWorkload: 55,
      isActive: true
    },
    {
      id: 7,
      name: 'James Miller',
      email: 'james.miller@company.com',
      department: 'Specialized Services',
      currentWorkload: 30,
      isActive: true
    },
    {
      id: 8,
      name: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      department: 'Window Services',
      currentWorkload: 65,
      isActive: true
    },
    {
      id: 9,
      name: 'Christopher Brown',
      email: 'christopher.brown@company.com',
      department: 'Window Services',
      currentWorkload: 50,
      isActive: true
    },
    {
      id: 10,
      name: 'Michelle Garcia',
      email: 'michelle.garcia@company.com',
      department: 'Specialized Services',
      currentWorkload: 40,
      isActive: true
    }
  ];

  useEffect(() => {
    // Auto-select first service on load
    if (services?.length > 0 && !selectedService) {
      setSelectedService(services?.[0]);
    }
  }, [services, selectedService]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    navigate('/company-registration-screen');
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleCreateNewService = () => {
    setSelectedService(null);
  };

  const handleServiceSave = async (serviceData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedService) {
        // Update existing service
        setServices(prev => prev?.map(service => 
          service?.id === selectedService?.id 
            ? { ...service, ...serviceData, updatedAt: new Date()?.toISOString() }
            : service
        ));
        setBookingStatus({
          type: 'success',
          message: 'Service updated successfully',
          details: `${serviceData?.name} has been updated`
        });
      } else {
        // Create new service
        const newService = {
          ...serviceData,
          id: Math.max(...services?.map(s => s?.id)) + 1,
          totalBookings: 0,
          createdAt: new Date()?.toISOString(),
          updatedAt: new Date()?.toISOString()
        };
        setServices(prev => [...prev, newService]);
        setSelectedService(newService);
        setBookingStatus({
          type: 'success',
          message: 'Service created successfully',
          details: `${serviceData?.name} is now available for booking`
        });
      }
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: 'Failed to save service',
        details: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceDuplicate = async (serviceData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newService = {
        ...serviceData,
        id: Math.max(...services?.map(s => s?.id)) + 1,
        totalBookings: 0,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      
      setServices(prev => [...prev, newService]);
      setSelectedService(newService);
      setBookingStatus({
        type: 'success',
        message: 'Service duplicated successfully',
        details: `${serviceData?.name} has been created as a copy`
      });
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: 'Failed to duplicate service',
        details: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleServiceStatus = async (serviceId) => {
    const service = services?.find(s => s?.id === serviceId);
    if (!service) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setServices(prev => prev?.map(s => 
        s?.id === serviceId 
          ? { ...s, isActive: !s?.isActive, updatedAt: new Date()?.toISOString() }
          : s
      ));
      
      setBookingStatus({
        type: 'success',
        message: `Service ${service?.isActive ? 'deactivated' : 'activated'}`,
        details: `${service?.name} is now ${service?.isActive ? 'unavailable' : 'available'} for booking`
      });
      
      // Update selected service if it's the one being toggled
      if (selectedService?.id === serviceId) {
        setSelectedService(prev => ({ ...prev, isActive: !prev?.isActive }));
      }
    } catch (error) {
      setBookingStatus({
        type: 'error',
        message: 'Failed to update service status',
        details: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (services?.length > 0) {
      setSelectedService(services?.[0]);
    }
  };

  const handleStatusClick = (status) => {
    // Handle status indicator clicks (e.g., navigate to booking details)
    console.log('Status clicked:', status);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={currentUser}
        company={companyData}
        notifications={{ count: 0 }}
        onLogout={handleLogout}
        onToggleSidebar={handleSidebarToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={currentUser}
      />

      {/* Main Content */}
      <main className={`
        pt-16 transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
      `}>
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Service List Panel */}
          <div className="w-full lg:w-1/3 xl:w-1/4 h-full">
            <ServiceList
              services={services}
              selectedService={selectedService}
              onServiceSelect={handleServiceSelect}
              onCreateNew={handleCreateNewService}
              onToggleStatus={handleToggleServiceStatus}
            />
          </div>

          {/* Service Details/Form Panel */}
          <div className="hidden lg:flex lg:w-2/3 xl:w-3/4 h-full border-l border-border">
            <ServiceForm
              service={selectedService}
              employees={employees}
              onSave={handleServiceSave}
              onCancel={handleCancel}
              onDuplicate={handleServiceDuplicate}
              isLoading={isLoading}
              className="w-full"
            />
          </div>
        </div>

        {/* Mobile Service Form Modal */}
        <div className="lg:hidden">
          {/* Mobile implementation would go here */}
        </div>
      </main>

      {/* Status Indicator */}
      <BookingStatusIndicator
        bookingStatus={bookingStatus}
        onStatusClick={handleStatusClick}
      />
    </div>
  );
};

export default ServiceManagementScreen;