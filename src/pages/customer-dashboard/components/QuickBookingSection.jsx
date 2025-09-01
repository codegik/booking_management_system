import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickBookingSection = ({ services = [] }) => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getNextAvailableSlot = (service) => {
    // Mock next available slot calculation
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return tomorrow?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBookNow = (service) => {
    navigate('/create-edit-booking-screen', { 
      state: { 
        selectedService: service,
        mode: 'create'
      }
    });
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Book New Service</h2>
        <Button variant="ghost" size="sm">
          <Icon name="Filter" size={16} className="mr-1" />
          Filter
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services?.map((service) => (
          <div key={service?.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{service?.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{service?.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                service?.isActive 
                  ? 'bg-success/10 text-success border border-success/20' :'bg-muted/10 text-muted-foreground border border-muted/20'
              }`}>
                {service?.isActive ? 'Available' : 'Unavailable'}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">{formatDuration(service?.duration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-semibold text-foreground">${service?.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next available:</span>
                <span className="text-accent font-medium">{getNextAvailableSlot(service)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleBookNow(service)}
                disabled={!service?.isActive}
                className="flex-1"
              >
                <Icon name="Calendar" size={14} className="mr-1" />
                Book Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(service)}
              >
                <Icon name="Info" size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {services?.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Services Available</h3>
          <p className="text-muted-foreground">There are currently no services available for booking.</p>
        </div>
      )}
      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{selectedService?.name}</h3>
              <Button variant="ghost" size="icon" onClick={closeServiceDetails}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Duration</h4>
                  <p className="text-sm text-muted-foreground">{formatDuration(selectedService?.duration)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Price</h4>
                  <p className="text-sm font-semibold text-foreground">${selectedService?.price}</p>
                </div>
              </div>

              {selectedService?.requirements && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedService?.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <Icon name="Check" size={14} className="mr-2 mt-0.5 text-success flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <Button
                  variant="default"
                  onClick={() => {
                    closeServiceDetails();
                    handleBookNow(selectedService);
                  }}
                  disabled={!selectedService?.isActive}
                  className="w-full"
                >
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Book This Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickBookingSection;