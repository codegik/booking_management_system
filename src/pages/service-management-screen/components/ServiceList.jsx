import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ServiceCard from './ServiceCard';

const ServiceList = ({ 
  services = [], 
  selectedService = null,
  onServiceSelect = () => {},
  onCreateNew = () => {},
  onToggleStatus = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: '0-30', label: '0-30 minutes' },
    { value: '30-60', label: '30-60 minutes' },
    { value: '60-120', label: '1-2 hours' },
    { value: '120+', label: '2+ hours' }
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const filteredServices = useMemo(() => {
    return services?.filter(service => {
      // Search filter
      const matchesSearch = service?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           service?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && service?.isActive) ||
                           (statusFilter === 'inactive' && !service?.isActive);

      // Duration filter
      let matchesDuration = true;
      if (durationFilter !== 'all') {
        const duration = service?.duration;
        switch (durationFilter) {
          case '0-30':
            matchesDuration = duration <= 30;
            break;
          case '30-60':
            matchesDuration = duration > 30 && duration <= 60;
            break;
          case '60-120':
            matchesDuration = duration > 60 && duration <= 120;
            break;
          case '120+':
            matchesDuration = duration > 120;
            break;
        }
      }

      // Price filter
      let matchesPrice = true;
      if (priceFilter !== 'all') {
        const price = service?.price;
        switch (priceFilter) {
          case '0-50':
            matchesPrice = price <= 50;
            break;
          case '50-100':
            matchesPrice = price > 50 && price <= 100;
            break;
          case '100-200':
            matchesPrice = price > 100 && price <= 200;
            break;
          case '200+':
            matchesPrice = price > 200;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDuration && matchesPrice;
    });
  }, [services, searchTerm, statusFilter, durationFilter, priceFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDurationFilter('all');
    setPriceFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || 
                          durationFilter !== 'all' || priceFilter !== 'all';

  return (
    <div className={`h-full flex flex-col bg-card border-r border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Services</h2>
          <Button
            variant="default"
            size="sm"
            onClick={onCreateNew}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            New Service
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Select
              options={durationOptions}
              value={durationFilter}
              onChange={setDurationFilter}
              placeholder="Duration"
            />
            
            <Select
              options={priceOptions}
              value={priceFilter}
              onChange={setPriceFilter}
              placeholder="Price"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full mt-2"
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear Filters
          </Button>
        )}
      </div>
      {/* Results Summary */}
      <div className="px-4 py-2 bg-muted/50 border-b border-border">
        <p className="text-xs text-muted-foreground">
          {filteredServices?.length} of {services?.length} services
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>
      {/* Service List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredServices?.length > 0 ? (
          <div className="space-y-3">
            {filteredServices?.map((service) => (
              <ServiceCard
                key={service?.id}
                service={service}
                isSelected={selectedService?.id === service?.id}
                onClick={() => onServiceSelect(service)}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {hasActiveFilters ? 'No services match your filters' : 'No services found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or filters' :'Create your first service to get started'
              }
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button variant="default" onClick={onCreateNew}>
                Create New Service
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;