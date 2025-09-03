import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { clearAuthData, makeAuthenticatedRequest } from '../../utils/auth';
import useCompanyDetails from '../../utils/useCompanyDetails';

const ServiceManagementScreen = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const { user, company, isLoading: isLoadingCompany, error: companyError, fetchCompanyDetails } = useCompanyDetails();

  // Duration options for the combobox
  const durationOptions = [
    { value: 30, label: '0:30' },
    { value: 60, label: '1:00' },
    { value: 90, label: '1:30' },
    { value: 120, label: '2:00' },
    { value: 150, label: '2:30' },
    { value: 180, label: '3:00' },
    { value: 210, label: '3:30' },
    { value: 240, label: '4:00' }
  ];

  // Helper function to convert minutes to hour:minute format
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 60,
    price: 0
  });

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || !isAuthenticated || isAuthenticated !== 'true') {
      navigate('/');
      return;
    }

    fetchCompanyDetails();
    fetchServices();
  }, [navigate, fetchCompanyDetails]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest('/api/work/all', {
        method: 'GET'
      });

      if (!response.ok) {
        if (response.status === 404) {
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError(error.message || 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = editingService ? '/api/work/update' : '/api/work/add';
      const payload = editingService
        ? { ...formData, id: editingService.id }
        : formData;

      const response = await makeAuthenticatedRequest(endpoint, {
        method: editingService ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0]
          : 'Failed to save service';
        throw new Error(errorMessage);
      }

      // Refresh services list
      await fetchServices();

      // Reset form
      setFormData({ name: '', description: '', durationMinutes: 60, price: 0 });
      setShowAddForm(false);
      setEditingService(null);
    } catch (error) {
      console.error('Failed to save service:', error);
      setError(error.message || 'Failed to save service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price
    });
    setEditingService(service);
    setShowAddForm(true);
  };

  const handleDeactivate = async (serviceId) => {
    try {
      setIsLoading(true);
      const response = await makeAuthenticatedRequest(`/api/work/inactivate/${serviceId}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate service');
      }

      await fetchServices();
    } catch (error) {
      console.error('Failed to deactivate service:', error);
      setError(error.message || 'Failed to deactivate service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', durationMinutes: 60, price: 0 });
    setShowAddForm(false);
    setEditingService(null);
    setError(null);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  const filteredServices = services.filter(service => {
    const matchesSearchTerm = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatusFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);

    return matchesSearchTerm && matchesStatusFilter;
  });

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (companyError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-error">Error loading data</h1>
          <p className="mt-2 text-base text-muted-foreground">
            {companyError || 'An unexpected error occurred. Please try again later.'}
          </p>
          <button
            onClick={fetchCompanyDetails}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
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

          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Services</h1>
                <p className="text-muted-foreground">Manage your business services</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                iconName="Plus"
                iconPosition="left"
                disabled={isLoading}
              >
                Add Service
              </Button>
            </div>
          </div>

          {/* Filter and Search Section */}
          <div className="mb-6 space-y-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterStatus('all')}
                className="text-xs px-2 py-1 h-7"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterStatus('active')}
                className="text-xs px-2 py-1 h-7"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterStatus('inactive')}
                className="text-xs px-2 py-1 h-7"
              >
                Inactive
              </Button>
            </div>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md w-full sm:w-auto"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Service Name"
                    type="text"
                    placeholder="Enter service name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Select
                    label="Duration"
                    options={durationOptions}
                    value={formData.durationMinutes}
                    onChange={(value) => setFormData({ ...formData, durationMinutes: parseInt(value) || 60 })}
                    placeholder="Select duration"
                    required
                  />
                </div>
                <Input
                  label="Price (cents)"
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
                <Input
                  label="Description"
                  type="text"
                  placeholder="Service description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Button
                    type="submit"
                    loading={isLoading}
                    size="xs"
                    className="text-xs px-2 py-1 h-7"
                  >
                    {editingService ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    size="xs"
                    className="text-xs px-2 py-1 h-7"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Services List */}
          <div className="space-y-4">
            {isLoading && services.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No services found matching your search.' : 'No services yet. Add your first service to get started.'}
                </p>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {service.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.isActive 
                            ? 'bg-success/10 text-success border border-success/20' 
                            : 'bg-error/10 text-error border border-error/20'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-muted-foreground mb-2 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={16} />
                          {formatDuration(service.durationMinutes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="DollarSign" size={16} />
                          {(service.price / 100).toFixed(2)}
                        </span>
                        {service.employees && service.employees.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Icon name="Users" size={16} />
                            {service.employees.length} employee{service.employees.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleEdit(service)}
                        disabled={isLoading}
                        className="text-xs px-2 py-1 h-7"
                      >
                        Edit
                      </Button>
                      {service.isActive && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleDeactivate(service.id)}
                          disabled={isLoading}
                          className="text-xs px-2 py-1 h-7"
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceManagementScreen;
