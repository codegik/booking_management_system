import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ServiceAssignmentModal = ({ 
  isOpen = false, 
  onClose = () => {},
  onSave = () => {},
  employee = null,
  availableServices = [],
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [draggedService, setDraggedService] = useState(null);

  useEffect(() => {
    if (employee && isOpen) {
      setSelectedServices(employee?.assignedServices?.map(service => service?.id));
    }
  }, [employee, isOpen]);

  const filteredServices = availableServices?.filter(service =>
    service?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    service?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleServiceToggle = (serviceId, checked) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev?.filter(id => id !== serviceId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedServices(filteredServices?.map(service => service?.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleDragStart = (e, service) => {
    setDraggedService(service);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetZone) => {
    e?.preventDefault();
    if (draggedService) {
      if (targetZone === 'assigned' && !selectedServices?.includes(draggedService?.id)) {
        setSelectedServices(prev => [...prev, draggedService?.id]);
      } else if (targetZone === 'available' && selectedServices?.includes(draggedService?.id)) {
        setSelectedServices(prev => prev?.filter(id => id !== draggedService?.id));
      }
    }
    setDraggedService(null);
  };

  const handleSave = () => {
    const assignedServices = availableServices?.filter(service => 
      selectedServices?.includes(service?.id)
    );
    onSave(employee?.id, assignedServices);
  };

  const assignedServices = availableServices?.filter(service => 
    selectedServices?.includes(service?.id)
  );

  const unassignedServices = filteredServices?.filter(service => 
    !selectedServices?.includes(service?.id)
  );

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card rounded-lg border border-border shadow-elevated w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Manage Service Assignments</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Assign services to {employee?.name}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Input
                type="search"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="max-w-md"
              />
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {selectedServices?.length} of {availableServices?.length} services assigned
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(selectedServices?.length !== filteredServices?.length)}
                >
                  {selectedServices?.length === filteredServices?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Available Services */}
              <div className="p-6 border-r border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Available Services</h3>
                  <span className="text-sm text-muted-foreground">
                    {unassignedServices?.length} services
                  </span>
                </div>
                
                <div 
                  className="space-y-3 max-h-96 overflow-y-auto"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'available')}
                >
                  {unassignedServices?.map((service) => (
                    <div
                      key={service?.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, service)}
                      className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 cursor-move transition-smooth"
                    >
                      <Checkbox
                        checked={selectedServices?.includes(service?.id)}
                        onChange={(e) => handleServiceToggle(service?.id, e?.target?.checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{service?.name}</h4>
                          <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{service?.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{service?.duration} minutes</span>
                          <span>${service?.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {unassignedServices?.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="CheckCircle" size={32} className="mx-auto text-success mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All services have been assigned
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Services */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Assigned Services</h3>
                  <span className="text-sm text-muted-foreground">
                    {assignedServices?.length} services
                  </span>
                </div>
                
                <div 
                  className="space-y-3 max-h-96 overflow-y-auto"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'assigned')}
                >
                  {assignedServices?.map((service) => (
                    <div
                      key={service?.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, service)}
                      className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 cursor-move transition-smooth"
                    >
                      <Checkbox
                        checked
                        onChange={(e) => handleServiceToggle(service?.id, e?.target?.checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{service?.name}</h4>
                          <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{service?.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{service?.duration} minutes</span>
                          <span>${service?.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {assignedServices?.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                      <Icon name="Settings" size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No services assigned yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag services here or use checkboxes to assign
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Changes will be saved immediately
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAssignmentModal;