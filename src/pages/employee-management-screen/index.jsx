import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useCompanyDetails from '../../utils/useCompanyDetails';
import Icon from '../../components/AppIcon';
import {clearAuthData, makeAuthenticatedRequest} from '../../utils/auth';
import {maskPhone, validatePhone} from '../../utils/phoneFormatter';

const EmployeeManagementScreen = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [availableWorks, setAvailableWorks] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);

  const { company, fetchCompanyDetails } = useCompanyDetails();

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
    email: '',
    phone: '',
    assignedWorks: [],
    profileImage: null,
    profileImagePreview: null
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest('/api/company/employees/work-assignments');

      if (response.ok) {
        const employees = await response.json();
        const transformedEmployees = employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phone: employee.cellphone,
          status: employee.isActive ? 'active' : 'inactive',
          assignedWorks: employee.assignedWorks?.map((work) => work.id) || [],
          pictureUrl: employee.pictureUrl
        }));
        setEmployees(transformedEmployees);
      } else if (response.status === 401) {
        clearAuthData();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
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
      const response = await makeAuthenticatedRequest('/api/work/all');

      if (response.ok) {
        const works = await response.json();
        const transformedWorks = works
          .map(work => ({
            id: work.id,
            name: work.name,
            price: work.price / 100,
            durationMinutes: work.durationMinutes,
            isActive: work.isActive
          }));
        setAvailableWorks(transformedWorks);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    fetchEmployees();
    fetchAvailableWorks();
  }, [fetchCompanyDetails]);

  useEffect(() => {
    if (company && !company.alias) {
      navigate('/company-registration');
    }
  }, [company, navigate]);

  // Email validation function
  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateEmployeeForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateEmployeeForm()) {
        setIsLoading(false);
        return;
      }

      // First, create/update the employee with basic data
      const employeeData = {
        name: formData.name,
        email: formData.email,
        cellphone: formData.phone,
        assignedWorks: formData.assignedWorks || []
      };

      let response;
      let employeeId;

      if (editingEmployee) {
        // Update existing employee
        response = await makeAuthenticatedRequest(`/api/employee/${editingEmployee.id}`, {
          method: 'PUT',
          body: JSON.stringify(employeeData)
        });
        employeeId = editingEmployee.id;
      } else {
        // Add new employee
        response = await makeAuthenticatedRequest('/api/employee/add', {
          method: 'POST',
          body: JSON.stringify(employeeData)
        });

        if (response.ok) {
          const newEmployee = await response.json();
          employeeId = newEmployee.id;
        }
      }

      if (!response.ok) {
        throw new Error(`Failed to ${editingEmployee ? 'update' : 'save'} employee`);
      }

      // If there's a profile image, upload it separately
      if (formData.profileImage && employeeId) {
        const imageFormData = new FormData();
        imageFormData.append('picture', formData.profileImage);
        imageFormData.append('employeeId', employeeId);

        const imageResponse = await makeAuthenticatedRequest(`/api/employee/picture/${employeeId}`, {
          method: 'PUT',
          body: imageFormData,
          // Don't set Content-Type header - let browser set it for FormData
          headers: {}
        });

        if (!imageResponse.ok) {
          console.warn('Failed to upload employee image, but employee was saved successfully');
          setError('Employee saved but image upload failed. You can try uploading the image again by editing the employee.');
        }
      }

      await fetchEmployees();
      handleCancelForm();
      if (!formData.profileImage || response.ok) {
        setError(null);
      }
    } catch (error) {
      console.error(`Error ${editingEmployee ? 'updating' : 'saving'} employee:`, error);
      setError(error.message || `Failed to ${editingEmployee ? 'update' : 'save'} employee`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      assignedWorks: employee.assignedWorks || [],
      profileImage: null,
      profileImagePreview: employee.pictureUrl || null
    });
    setFormErrors({});
    setShowAddForm(true);
  };

  const handleToggleStatus = async (employee) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = employee.status === 'active'
        ? `/api/company/employees/${employee.id}/inactivate`
        : `/api/company/employees/${employee.id}/activate`;

      const response = await makeAuthenticatedRequest(endpoint, {
        method: 'PUT'
      });

      if (response.ok) {
        // Refresh employees list to get updated data
        await fetchEmployees();
      } else {
        throw new Error(`Failed to ${employee.status === 'active' ? 'deactivate' : 'activate'} employee`);
      }
    } catch (error) {
      console.error('Error toggling employee status:', error);
      setError(error.message || `Failed to ${employee.status === 'active' ? 'deactivate' : 'activate'} employee`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    // Clean up preview URL if it exists and it's a blob URL (newly uploaded image)
    if (formData.profileImagePreview && formData.profileImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    setShowAddForm(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      assignedWorks: [],
      profileImage: null,
      profileImagePreview: null
    });
    setFormErrors({});
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: 'Please select a valid image file (JPEG, PNG)'
        }));
        return;
      }

      // Validate file size (max 3MB)
      const maxSize = 3 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: 'Image size must be less than 3MB'
        }));
        return;
      }

      // Clean up previous preview URL
      if (formData.profileImagePreview) {
        URL.revokeObjectURL(formData.profileImagePreview);
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImagePreview: previewUrl
      }));

      // Clear any previous errors
      if (formErrors.profileImage) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: undefined
        }));
      }
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    // Clean up the preview URL to prevent memory leaks
    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null
    }));
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (formData.profileImagePreview) {
        URL.revokeObjectURL(formData.profileImagePreview);
      }
    };
  }, [formData.profileImagePreview]);

  const handleServiceToggle = (serviceId) => {
    const currentServices = formData.assignedWorks || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    setFormData(prev => ({
      ...prev,
      assignedWorks: newServices
    }));
  };

  const handlePhoneChange = (value) => {
    const formattedPhone = maskPhone(value);
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));

    if (formErrors.phone) {
      setFormErrors(prev => ({
        ...prev,
        phone: undefined
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const getAssignedServiceNames = (serviceIds) => {
    return availableWorks
      .filter(work => serviceIds.includes(work.id))
      .map(work => ({
        id: work.id,
        name: work.name,
        isActive: work.isActive
      }))
      .sort((a, b) => {
        // Sort active services first, then inactive
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0; // Keep original order for services with same status
      });
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };


  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearchTerm = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatusFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && employee.status === 'active') ||
      (filterStatus === 'inactive' && employee.status === 'inactive');

    return matchesSearchTerm && matchesStatusFilter;
  });

  if (isLoading && employees.length === 0) {
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
        company={company}
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
                <h1 className="text-2xl font-bold text-foreground">Employees</h1>
                <p className="text-muted-foreground">Manage your team members and their services</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                iconName="UserPlus"
                iconPosition="left"
                disabled={isLoading}
              >
                Add Employee
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
                iconName="Users"
                iconPosition="left"
              >
                All ({employees.length})
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterStatus('active')}
                className="text-xs px-2 py-1 h-7"
                iconName="UserCheck"
                iconPosition="left"
              >
                Active ({employees.filter(e => e.status === 'active').length})
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterStatus('inactive')}
                className="text-xs px-2 py-1 h-7"
                iconName="UserX"
                iconPosition="left"
              >
                Inactive ({employees.filter(e => e.status === 'inactive').length})
              </Button>
            </div>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search employees..."
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
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Employee Name"
                    type="text"
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={formErrors.name}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="employee@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={formErrors.email}
                    required
                  />
                </div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+00 00 00000 0000"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  error={formErrors.phone}
                  required
                />

                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Image
                  </label>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {formData.profileImagePreview && (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={formData.profileImagePreview}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-border"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-medium">Image selected</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.profileImage?.name} ({Math.round(formData.profileImage?.size / 1024)}KB)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profileImage"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                      >
                        <Icon name="Upload" size={16} />
                        {formData.profileImage ? 'Change Image' : 'Upload Image'}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: JPEG, PNG, GIF. Max size: 5MB
                      </p>
                      {formErrors.profileImage && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.profileImage}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assigned Services
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {availableWorks
                      .sort((a, b) => {
                        // Sort active services first, then inactive
                        if (a.isActive && !b.isActive) return -1;
                        if (!a.isActive && b.isActive) return 1;
                        return 0; // Keep original order for services with same status
                      })
                      .map(service => (
                      <label key={service.id} className={`flex items-center gap-2 p-2 border rounded ${
                        !service.isActive ? 'bg-gray-50 border-gray-300' : ''
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.assignedWorks.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="rounded"
                          disabled={!service.isActive}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              service.isActive ? '' : 'text-gray-500 line-through'
                            }`}>
                              {service.name}
                            </span>
                            {!service.isActive && (
                              <Icon name="AlertTriangle" size={14} className="text-orange-500" />
                            )}
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            service.isActive ? 'text-muted-foreground' : 'text-gray-400'
                          }`}>
                            <span>${service.price}</span>
                            <span>•</span>
                            <span>{formatDuration(service.durationMinutes)}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Button
                    type="submit"
                    loading={isLoading}
                    size="xs"
                    className="text-xs px-2 py-1 h-7"
                  >
                    {editingEmployee ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelForm}
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

          {/* Employee List */}
          <div className="space-y-3">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first employee'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Button onClick={() => setShowAddForm(true)} iconName="UserPlus">
                    Add Employee
                  </Button>
                )}
              </div>
            ) : (
              filteredEmployees.map(employee => (
                <div key={employee.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        {employee.pictureUrl ? (
                          <img
                            src={employee.pictureUrl}
                            alt={`${employee.name}'s profile`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-border"
                            onError={(e) => {
                              // Fallback to default avatar if image fails to load
                              e.target.src = '/assets/images/no_image.png';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-border flex items-center justify-center">
                            <Icon name="User" size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{employee.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            employee.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {employee.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{employee.email}</p>
                          <p>{employee.phone}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getAssignedServiceNames(employee.assignedWorks).map(service => (
                              <span
                                key={service.id}
                                className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                                  service.isActive
                                    ? 'bg-gray-100 text-primary'
                                    : 'bg-gray-100 text-gray-500 line-through'
                                }`}
                                title={service.isActive ? 'Active service' : 'Inactive service'}
                              >
                                {!service.isActive && (
                                  <Icon name="AlertTriangle" size={12} className="text-orange-500" />
                                )}
                                {service.name}
                              </span>
                            ))}
                            {employee.assignedWorks.length === 0 && (
                              <span className="text-xs text-muted-foreground">No services assigned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleEdit(employee)}
                        iconName="Edit"
                        className="text-xs px-2 py-1 h-7"
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant={employee.status === 'active' ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(employee)}
                        iconName={employee.status === 'active' ? 'UserX' : 'UserCheck'}
                        className="text-xs px-2 py-1 h-7"
                      >
                        {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
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

export default EmployeeManagementScreen;
