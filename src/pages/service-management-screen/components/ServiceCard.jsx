import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCard = ({ 
  service, 
  isSelected = false, 
  onClick = () => {},
  onToggleStatus = () => {},
  className = ''
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(price);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div 
      className={`
        p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-soft
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-soft' 
          : 'border-border bg-card hover:border-primary/50'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {/* Service Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {service?.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {service?.description}
          </p>
        </div>
        <div className={`
          ml-2 px-2 py-1 rounded-full text-xs font-medium
          ${service?.isActive 
            ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
          }
        `}>
          {service?.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
      {/* Service Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium text-foreground">
            {formatDuration(service?.duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-semibold text-primary">
            {formatPrice(service?.price)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Employees:</span>
          <span className="font-medium text-foreground">
            {service?.assignedEmployees?.length || 0}
          </span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-1">
          <Icon 
            name="Calendar" 
            size={14} 
            className="text-muted-foreground" 
          />
          <span className="text-xs text-muted-foreground">
            {service?.totalBookings || 0} bookings
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e?.stopPropagation();
            onToggleStatus(service?.id);
          }}
          className="text-xs"
        >
          {service?.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;