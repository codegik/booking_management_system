import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useCompanyDetails from '../../utils/useCompanyDetails';
import Icon from '../../components/AppIcon';
import { makeAuthenticatedRequest, clearAuthData } from '../../utils/auth';
import { maskPhone, validatePhone } from '../../utils/phoneFormatter';

const EmployeeManagementScreen = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [availableWorks, setAvailableWorks] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const { user, company, fetchCompanyDetails } = useCompanyDetails();
  const notifications = { count: 0 };

  // Helper function to convert minutes to hour:minute format (same as service-management-screen)
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
    }
  };

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);

      // Use the authenticated request utility
      const response = await makeAuthenticatedRequest('/api/company/employees/work-assignments');

      if (response.ok) {
        const employeeAssignments = await response.json();

        // Transform the data to match our component structure
        const transformedEmployees = employeeAssignments.map(assignment => ({
          id: assignment.employee.id,
          name: assignment.employee.name || 'Unknown',
          email: assignment.employee.email || '',
          cellphone: assignment.employee.cellphone || '',
          status: assignment.employee.isActive ? 'active' : 'inactive',
          assignedServices: assignment.assignedWorks?.map(work => work.id) || []
        }));

        setEmployees(transformedEmployees);
      } else if (response.status === 401) {
        // Clear auth data and redirect to login
        clearAuthData();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // If it's an authentication error, redirect to login
      if (error.message?.includes('Authentication expired')) {
        navigate('/', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available works/services from API
  const fetchAvailableWorks = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/work/all?inactive=false');

      if (response.ok) {
        const works = await response.json();
        const transformedWorks = works.map(work => ({
          id: work.id,
          name: work.name,
          price: work.price / 100, // Convert from cents to dollars
          durationMinutes: work.durationMinutes
        }));
        setAvailableWorks(transformedWorks);
      } else if (response.status === 401) {
        // Clear auth data and redirect to login
        clearAuthData();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching works:', error);
      // If it's an authentication error, redirect to login
      if (error.message?.includes('Authentication expired')) {
        navigate('/', { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    fetchEmployees();
    fetchAvailableWorks();
  }, [fetchCompanyDetails]);

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAddEmployee = () => {
    setIsAddingEmployee(true);
    setEditingEmployee({
      id: null,
      name: '',
      email: '',
      phone: '',
      assignedServices: []
    });
  };

  const handleEditEmployee = (employee) => {
    setIsAddingEmployee(false);
    setEditingEmployee({ ...employee });
  };

  // Email validation function
  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateEmployeeForm = () => {
    const errors = {};

    // Name validation
    if (!editingEmployee.name?.trim()) {
      errors.name = 'Name is required';
    }

    // Email validation
    if (!editingEmployee.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(editingEmployee.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!editingEmployee.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(editingEmployee.phone)) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle phone input with formatting
  const handlePhoneChange = (value) => {
    const formattedPhone = maskPhone(value);
    setEditingEmployee(prev => ({
      ...prev,
      phone: formattedPhone
    }));

    // Clear phone error when user starts typing
    if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: undefined
      }));
    }
  };

  // Handle input changes with error clearing
  const handleInputChange = (field, value) => {
    setEditingEmployee(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSaveEmployee = async () => {
    setIsLoading(true);
    try {
      // Validate form before saving
      if (!validateEmployeeForm()) {
        setIsLoading(false);
        return;
      }

      if (isAddingEmployee) {
        // Add new employee
        const employeeData = {
          name: editingEmployee.name,
          email: editingEmployee.email,
          cellphone: editingEmployee.phone,
          role: editingEmployee.role
        };

        const response = await makeAuthenticatedRequest('/api/employee/add', {
          method: 'POST',
          body: JSON.stringify(employeeData)
        });

        if (response.ok) {
          const result = await response.json();

          // If we have assigned services, assign them to the employee
          if (editingEmployee.assignedServices.length > 0) {
            await makeAuthenticatedRequest('/api/company/employees/assign-work', {
              method: 'POST',
              body: JSON.stringify({
                employeeId: result.id || result.employeeId,
                workIds: editingEmployee.assignedServices
              })
            });
          }

          // Refresh employee list
          await fetchEmployees();
        } else if (response.status === 401) {
          clearAuthData();
          navigate('/', { replace: true });
        }
      } else {
        // Update existing employee - we'll need to handle work assignments
        if (editingEmployee.assignedServices.length > 0) {
          const response = await makeAuthenticatedRequest('/api/company/employees/assign-work', {
            method: 'POST',
            body: JSON.stringify({
              employeeId: editingEmployee.id,
              workIds: editingEmployee.assignedServices
            })
          });

          if (response.status === 401) {
            clearAuthData();
            navigate('/', { replace: true });
            return;
          }

          // Refresh employee list
          await fetchEmployees();
        }
      }

      setEditingEmployee(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      // If it's an authentication error, redirect to login
      if (error.message?.includes('Authentication expired')) {
        navigate('/', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleToggleStatus = async (employee) => {
    try {
      setIsLoading(true);
      // Note: The API doesn't seem to have an endpoint to toggle employee status
      // We would need to implement this on the backend
      console.log('Toggle status for employee:', employee.id);

      // For now, just update locally
      setEmployees(prev => prev.map(emp =>
        emp.id === employee.id
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
          : emp
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    const currentServices = editingEmployee.assignedServices || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    setEditingEmployee(prev => ({
      ...prev,
      assignedServices: newServices
    }));
  };

  const getAssignedServiceNames = (serviceIds) => {
    return availableWorks
      .filter(work => serviceIds.includes(work.id))
      .map(work => work.name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        user={user}
        company={company}
        notifications={notifications}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
        user={user}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Employees</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage employees and their services
              </p>
            </div>
            <Button
              onClick={handleAddEmployee}
              iconName="UserPlus"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Add Employee
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconName="Search"
                iconPosition="left"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2">
                <Icon name="Users" className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold mt-1">{employees.length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2">
                <Icon name="UserCheck" className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {employees.filter(e => e.status === 'active').length}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2">
                <Icon name="UserX" className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-muted-foreground">Inactive</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-orange-600">
                {employees.filter(e => e.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2">
                <Icon name="Wrench" className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">Services</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-blue-600">{availableWorks.length}</p>
            </div>
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map(employee => (
              <div key={employee.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={employee.pictureUrl}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground truncate">
                        {employee.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {employee.role}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {employee.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.phone}
                    </p>

                    {/* Assigned Services */}
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {getAssignedServiceNames(employee.assignedServices).map(serviceName => (
                          <span
                            key={serviceName}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                          >
                            {serviceName}
                          </span>
                        ))}
                        {employee.assignedServices.length === 0 && (
                          <span className="text-xs text-muted-foreground">No services assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEmployee(employee)}
                        iconName="Edit"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={employee.status === 'active' ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(employee)}
                        iconName={employee.status === 'active' ? 'UserX' : 'UserCheck'}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Users" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first employee'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleAddEmployee} iconName="UserPlus">
                  Add Employee
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Employee Form Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isAddingEmployee ? 'Add Employee' : 'Edit Employee'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editingEmployee.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter name"
                  error={formErrors.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email"
                  error={formErrors.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  value={editingEmployee.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter phone"
                  error={formErrors.phone}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assigned Services</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableWorks.map(service => (
                    <label key={service.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingEmployee.assignedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{service.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>${service.price}</span>
                          <span>•</span>
                          <span>{formatDuration(service.durationMinutes)}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEmployee}
                className="flex-1"
                disabled={isLoading || !editingEmployee.name || !editingEmployee.email}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementScreen;

