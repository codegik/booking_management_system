import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeFilters = ({
  searchTerm = '',
  onSearchChange = () => {},
  statusFilter = 'all',
  onStatusFilterChange = () => {},
  serviceFilter = 'all',
  onServiceFilterChange = () => {},
  dateRange = { start: '', end: '' },
  onDateRangeChange = () => {},
  onClearFilters = () => {},
  availableServices = [],
  resultCount = 0,
  totalCount = 0
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    ...availableServices?.map(service => ({
      value: service?.id,
      label: service?.name
    }))
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' || dateRange?.start || dateRange?.end;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft mb-6">
      {/* Search and Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="Filter by status"
        />

        {/* Service Filter */}
        <Select
          options={serviceOptions}
          value={serviceFilter}
          onChange={onServiceFilterChange}
          placeholder="Filter by service"
          searchable={availableServices?.length > 5}
        />
      </div>
      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="date"
          label="Last Login From"
          value={dateRange?.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e?.target?.value })}
        />
        <Input
          type="date"
          label="Last Login To"
          value={dateRange?.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e?.target?.value })}
        />
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            <Icon name="X" size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {resultCount?.toLocaleString()} of {totalCount?.toLocaleString()} employees
          </span>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-accent" />
              <span className="text-sm text-accent font-medium">Filters applied</span>
            </div>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="hidden lg:flex items-center space-x-2">
          {searchTerm && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <Icon name="Search" size={12} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-primary/20 rounded"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {statusFilter !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs">
              <Icon name="CheckCircle" size={12} />
              <span>{statusOptions?.find(opt => opt?.value === statusFilter)?.label}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="ml-1 hover:bg-success/20 rounded"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {serviceFilter !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
              <Icon name="Settings" size={12} />
              <span>{serviceOptions?.find(opt => opt?.value === serviceFilter)?.label}</span>
              <button
                onClick={() => onServiceFilterChange('all')}
                className="ml-1 hover:bg-accent/20 rounded"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;