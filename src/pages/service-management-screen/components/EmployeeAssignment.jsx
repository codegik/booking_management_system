import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const EmployeeAssignment = ({ 
  employees = [], 
  assignedEmployeeIds = [],
  onAssignmentChange = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees?.filter(employee =>
    employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    employee?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    employee?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleEmployeeToggle = (employeeId) => {
    const isCurrentlyAssigned = assignedEmployeeIds?.includes(employeeId);
    let newAssignedIds;
    
    if (isCurrentlyAssigned) {
      newAssignedIds = assignedEmployeeIds?.filter(id => id !== employeeId);
    } else {
      newAssignedIds = [...assignedEmployeeIds, employeeId];
    }
    
    onAssignmentChange(newAssignedIds);
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredEmployees?.map(emp => emp?.id);
    const allSelected = allFilteredIds?.every(id => assignedEmployeeIds?.includes(id));
    
    if (allSelected) {
      // Deselect all filtered employees
      let newAssignedIds = assignedEmployeeIds?.filter(id => !allFilteredIds?.includes(id));
      onAssignmentChange(newAssignedIds);
    } else {
      // Select all filtered employees
      let newAssignedIds = [...new Set([...assignedEmployeeIds, ...allFilteredIds])];
      onAssignmentChange(newAssignedIds);
    }
  };

  const getWorkloadIndicator = (workload) => {
    if (workload >= 80) return { color: 'text-error', bg: 'bg-error/10', label: 'High' };
    if (workload >= 60) return { color: 'text-warning', bg: 'bg-warning/10', label: 'Medium' };
    return { color: 'text-success', bg: 'bg-success/10', label: 'Low' };
  };

  const allFilteredSelected = filteredEmployees?.length > 0 && 
    filteredEmployees?.every(emp => assignedEmployeeIds?.includes(emp?.id));
  const someFilteredSelected = filteredEmployees?.some(emp => assignedEmployeeIds?.includes(emp?.id));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Employee Assignment</h3>
        <div className="text-sm text-muted-foreground">
          {assignedEmployeeIds?.length} of {employees?.length} assigned
        </div>
      </div>
      {/* Search and Select All */}
      <div className="space-y-3">
        <Input
          type="search"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />
        
        {filteredEmployees?.length > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <Checkbox
              label={`Select all (${filteredEmployees?.length})`}
              checked={allFilteredSelected}
              indeterminate={someFilteredSelected && !allFilteredSelected}
              onChange={handleSelectAll}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAssignmentChange([])}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
      {/* Employee List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredEmployees?.length > 0 ? (
          filteredEmployees?.map((employee) => {
            const isAssigned = assignedEmployeeIds?.includes(employee?.id);
            const workloadInfo = getWorkloadIndicator(employee?.currentWorkload || 0);
            
            return (
              <div
                key={employee?.id}
                className={`
                  p-3 rounded-lg border transition-smooth hover:shadow-soft
                  ${isAssigned 
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/30'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isAssigned}
                    onChange={() => handleEmployeeToggle(employee?.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {employee?.name}
                      </h4>
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${workloadInfo?.color} ${workloadInfo?.bg}
                      `}>
                        {workloadInfo?.label}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {employee?.email}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {employee?.department || 'No Department'}
                      </span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-muted-foreground">Workload:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                employee?.currentWorkload >= 80 ? 'bg-error' :
                                employee?.currentWorkload >= 60 ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ width: `${Math.min(employee?.currentWorkload || 0, 100)}%` }}
                            />
                          </div>
                          <span className="font-medium">
                            {employee?.currentWorkload || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-muted-foreground mb-4 mx-auto" />
            <h4 className="text-sm font-medium text-foreground mb-2">
              {searchTerm ? 'No employees found' : 'No employees available'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search criteria' :'Add employees to assign them to services'
              }
            </p>
          </div>
        )}
      </div>
      {/* Assignment Summary */}
      {assignedEmployeeIds?.length > 0 && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {assignedEmployeeIds?.length} employee{assignedEmployeeIds?.length !== 1 ? 's' : ''} assigned
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Show assigned employees details
                console.log('Show assignment details');
              }}
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAssignment;