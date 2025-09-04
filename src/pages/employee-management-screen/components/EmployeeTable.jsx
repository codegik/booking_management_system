import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const EmployeeTable = ({ 
  employees = [], 
  onEmployeeSelect = () => {},
  onBulkAction = () => {},
  onEmployeeEdit = () => {},
  onEmployeeView = () => {},
  onServiceAssign = () => {},
  searchTerm = '',
  statusFilter = 'all',
  serviceFilter = 'all',
  sortConfig = { key: null, direction: 'asc' }
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [sortBy, setSortBy] = useState(sortConfig);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees?.filter(employee => {
      const matchesSearch = employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           employee?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || employee?.status === statusFilter;
      const matchesService = serviceFilter === 'all' || 
                            employee?.assignedWorks?.some(service => service?.id === serviceFilter);
      
      return matchesSearch && matchesStatus && matchesService;
    });

    if (sortBy?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortBy?.key];
        let bValue = b?.[sortBy?.key];
        
        if (sortBy?.key === 'assignedWorks') {
          aValue = a?.assignedWorks?.length;
          bValue = b?.assignedWorks?.length;
        } else if (sortBy?.key === 'lastLogin') {
          aValue = new Date(a.lastLogin);
          bValue = new Date(b.lastLogin);
        }
        
        if (aValue < bValue) return sortBy?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortBy?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, statusFilter, serviceFilter, sortBy]);

  const handleSort = (key) => {
    setSortBy(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(filteredAndSortedEmployees?.map(emp => emp?.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev?.filter(id => id !== employeeId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortBy?.key !== columnKey) return 'ArrowUpDown';
    return sortBy?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedEmployees?.length > 0 && (
        <div className="px-6 py-4 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedEmployees?.length} employee{selectedEmployees?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('activate', selectedEmployees)}
              >
                <Icon name="UserCheck" size={16} className="mr-2" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('deactivate', selectedEmployees)}
              >
                <Icon name="UserX" size={16} className="mr-2" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export', selectedEmployees)}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={selectedEmployees?.length === filteredAndSortedEmployees?.length && filteredAndSortedEmployees?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Employee</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Role</span>
                  <Icon name={getSortIcon('role')} size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('assignedWorks')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Assigned Services</span>
                  <Icon name={getSortIcon('assignedWorks')} size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('lastLogin')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Last Login</span>
                  <Icon name={getSortIcon('lastLogin')} size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedEmployees?.map((employee) => (
              <tr key={employee?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{employee?.name}</p>
                      <p className="text-xs text-muted-foreground">{employee?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                    {employee?.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {employee?.assignedWorks?.slice(0, 2)?.map((service) => (
                      <span
                        key={service?.id}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent/20 text-accent"
                      >
                        {service?.name}
                      </span>
                    ))}
                    {employee?.assignedWorks?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                        +{employee?.assignedWorks?.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee?.status === 'active' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                  }`}>
                    <Icon 
                      name={employee?.status === 'active' ? 'CheckCircle' : 'XCircle'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {employee?.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(employee?.lastLogin)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEmployeeView(employee)}
                      className="w-8 h-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEmployeeEdit(employee)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onServiceAssign(employee)}
                      className="w-8 h-8"
                    >
                      <Icon name="Settings" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {filteredAndSortedEmployees?.map((employee) => (
          <div key={employee?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedEmployees?.includes(employee?.id)}
                  onChange={(e) => handleSelectEmployee(employee?.id, e?.target?.checked)}
                />
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{employee?.name}</p>
                  <p className="text-xs text-muted-foreground">{employee?.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee?.status === 'active' ?'bg-success/20 text-success' :'bg-error/20 text-error'
              }`}>
                {employee?.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Role:</span>
                <span className="text-xs font-medium">{employee?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Services:</span>
                <span className="text-xs font-medium">{employee?.assignedWorks?.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Last Login:</span>
                <span className="text-xs font-medium">{formatDate(employee?.lastLogin)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEmployeeView(employee)}
              >
                <Icon name="Eye" size={14} className="mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEmployeeEdit(employee)}
              >
                <Icon name="Edit" size={14} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onServiceAssign(employee)}
              >
                <Icon name="Settings" size={14} className="mr-1" />
                Assign
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredAndSortedEmployees?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' ?'Try adjusting your filters to see more results.' :'Get started by adding your first employee.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;