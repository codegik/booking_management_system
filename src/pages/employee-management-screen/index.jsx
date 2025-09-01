import React, { useState, useEffect } from 'react';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';

import EmployeeTable from './components/EmployeeTable';
import EmployeeSummaryCards from './components/EmployeeSummaryCards';
import EmployeeFilters from './components/EmployeeFilters';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import ServiceAssignmentModal from './components/ServiceAssignmentModal';

const EmployeeManagementScreen = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      role: "technician",
      status: "active",
      pictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      lastLogin: "2025-08-30T14:30:00Z",
      notes: "Experienced technician with excellent customer service skills",
      assignedServices: [
        { id: 1, name: "AC Repair", description: "Air conditioning repair and maintenance", duration: 120, price: 150, status: "active" },
        { id: 2, name: "Heating Service", description: "Heating system installation and repair", duration: 90, price: 120, status: "active" }
      ],
      recentActivity: [
        { type: "login", description: "Logged into the system", timestamp: "2025-08-30T14:30:00Z" },
        { type: "booking", description: "Completed AC repair booking #1234", timestamp: "2025-08-30T10:15:00Z" }
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@company.com",
      phone: "+1 (555) 234-5678",
      role: "supervisor",
      status: "active",
      pictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      lastLogin: "2025-08-29T16:45:00Z",
      notes: "Team supervisor with 5+ years experience",
      assignedServices: [
        { id: 1, name: "AC Repair", description: "Air conditioning repair and maintenance", duration: 120, price: 150, status: "active" },
        { id: 3, name: "Plumbing Service", description: "Plumbing installation and repair", duration: 60, price: 80, status: "active" },
        { id: 4, name: "Electrical Work", description: "Electrical installation and troubleshooting", duration: 90, price: 100, status: "active" }
      ],
      recentActivity: [
        { type: "login", description: "Logged into the system", timestamp: "2025-08-29T16:45:00Z" },
        { type: "booking", description: "Supervised plumbing service #1235", timestamp: "2025-08-29T13:20:00Z" }
      ]
    },
    {
      id: 3,
      name: "Emily Chen",
      email: "emily.chen@company.com",
      phone: "+1 (555) 345-6789",
      role: "specialist",
      status: "active",
      pictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      lastLogin: "2025-08-28T09:20:00Z",
      notes: "Specialist in electrical systems and smart home installations",
      assignedServices: [
        { id: 4, name: "Electrical Work", description: "Electrical installation and troubleshooting", duration: 90, price: 100, status: "active" },
        { id: 5, name: "Smart Home Setup", description: "Smart home device installation and configuration", duration: 180, price: 200, status: "active" }
      ],
      recentActivity: [
        { type: "login", description: "Logged into the system", timestamp: "2025-08-28T09:20:00Z" }
      ]
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@company.com",
      phone: "+1 (555) 456-7890",
      role: "technician",
      status: "inactive",
      pictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      lastLogin: "2025-08-25T11:30:00Z",
      notes: "Currently on leave",
      assignedServices: [
        { id: 2, name: "Heating Service", description: "Heating system installation and repair", duration: 90, price: 120, status: "inactive" }
      ],
      recentActivity: []
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      phone: "+1 (555) 567-8901",
      role: "manager",
      status: "active",
      pictureUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      lastLogin: "2025-08-31T08:15:00Z",
      notes: "Operations manager overseeing daily activities",
      assignedServices: [
        { id: 1, name: "AC Repair", description: "Air conditioning repair and maintenance", duration: 120, price: 150, status: "active" },
        { id: 2, name: "Heating Service", description: "Heating system installation and repair", duration: 90, price: 120, status: "active" },
        { id: 3, name: "Plumbing Service", description: "Plumbing installation and repair", duration: 60, price: 80, status: "active" },
        { id: 4, name: "Electrical Work", description: "Electrical installation and troubleshooting", duration: 90, price: 100, status: "active" }
      ],
      recentActivity: [
        { type: "login", description: "Logged into the system", timestamp: "2025-08-31T08:15:00Z" },
        { type: "booking", description: "Reviewed booking reports", timestamp: "2025-08-31T08:30:00Z" }
      ]
    }
  ]);

  const availableServices = [
    { id: 1, name: "AC Repair", description: "Air conditioning repair and maintenance", duration: 120, price: 150, status: "active" },
    { id: 2, name: "Heating Service", description: "Heating system installation and repair", duration: 90, price: 120, status: "active" },
    { id: 3, name: "Plumbing Service", description: "Plumbing installation and repair", duration: 60, price: 80, status: "active" },
    { id: 4, name: "Electrical Work", description: "Electrical installation and troubleshooting", duration: 90, price: 100, status: "active" },
    { id: 5, name: "Smart Home Setup", description: "Smart home device installation and configuration", duration: 180, price: 200, status: "active" },
    { id: 6, name: "Appliance Repair", description: "Home appliance repair and maintenance", duration: 75, price: 90, status: "active" }
  ];

  const currentUser = {
    role: 'admin',
    name: 'John Doe'
  };

  const company = {
    name: 'ServicePro Management',
    logo: null
  };

  // Filter employees based on current filters
  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         employee?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee?.status === statusFilter;
    const matchesService = serviceFilter === 'all' || 
                          employee?.assignedServices?.some(service => service?.id?.toString() === serviceFilter);
    
    let matchesDateRange = true;
    if (dateRange?.start || dateRange?.end) {
      const loginDate = new Date(employee.lastLogin);
      if (dateRange?.start) {
        matchesDateRange = matchesDateRange && loginDate >= new Date(dateRange.start);
      }
      if (dateRange?.end) {
        matchesDateRange = matchesDateRange && loginDate <= new Date(dateRange.end);
      }
    }
    
    return matchesSearch && matchesStatus && matchesService && matchesDateRange;
  });

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setServiceFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const handleAddEmployee = async (employeeData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newEmployee = {
        ...employeeData,
        id: employees?.length + 1,
        lastLogin: new Date()?.toISOString(),
        assignedServices: availableServices?.filter(service => 
          employeeData?.assignedServices?.includes(service?.id)
        ),
        recentActivity: [
          { type: "login", description: "Account created", timestamp: new Date()?.toISOString() }
        ]
      };
      
      setEmployees(prev => [...prev, newEmployee]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeView = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleEmployeeEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(false);
    // In a real app, this would open an edit modal
    console.log('Edit employee:', employee);
  };

  const handleServiceAssign = (employee) => {
    setSelectedEmployee(employee);
    setIsServiceModalOpen(true);
  };

  const handleServiceAssignmentSave = async (employeeId, assignedServices) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployees(prev => prev?.map(emp => 
        emp?.id === employeeId 
          ? { ...emp, assignedServices }
          : emp
      ));
      
      setIsServiceModalOpen(false);
    } catch (error) {
      console.error('Error updating service assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action, employeeIds) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'activate' || action === 'deactivate') {
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        setEmployees(prev => prev?.map(emp => 
          employeeIds?.includes(emp?.id) 
            ? { ...emp, status: newStatus }
            : emp
        ));
      } else if (action === 'export') {
        console.log('Exporting employees:', employeeIds);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (employee) => {
    const newStatus = employee?.status === 'active' ? 'inactive' : 'active';
    setEmployees(prev => prev?.map(emp => 
      emp?.id === employee?.id 
        ? { ...emp, status: newStatus }
        : emp
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={currentUser}
        company={company}
        notifications={{ count: 0 }}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
        user={currentUser}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your workforce, assign services, and track employee performance
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              iconName="UserPlus"
              iconPosition="left"
              className="shadow-soft"
            >
              Add Employee
            </Button>
          </div>

          {/* Filters */}
          <EmployeeFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            serviceFilter={serviceFilter}
            onServiceFilterChange={setServiceFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClearFilters={handleClearFilters}
            availableServices={availableServices}
            resultCount={filteredEmployees?.length}
            totalCount={employees?.length}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Employee Table */}
            <div className="xl:col-span-8">
              <EmployeeTable
                employees={filteredEmployees}
                onEmployeeView={handleEmployeeView}
                onEmployeeEdit={handleEmployeeEdit}
                onServiceAssign={handleServiceAssign}
                onBulkAction={handleBulkAction}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                serviceFilter={serviceFilter}
                sortConfig={sortConfig}
              />
            </div>

            {/* Summary Cards */}
            <div className="xl:col-span-4">
              <EmployeeSummaryCards employees={employees} />
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEmployee}
        availableServices={availableServices}
        isLoading={isLoading}
      />
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleEmployeeEdit}
        onServiceAssign={handleServiceAssign}
        onStatusToggle={handleStatusToggle}
      />
      <ServiceAssignmentModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleServiceAssignmentSave}
        employee={selectedEmployee}
        availableServices={availableServices}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeManagementScreen;