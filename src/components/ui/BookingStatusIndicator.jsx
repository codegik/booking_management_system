import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const BookingStatusIndicator = ({ 
  bookingStatus = null,
  onStatusClick = () => {},
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (bookingStatus) {
      setIsVisible(true);
      setAnimationClass('animate-slide-in-from-top');
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [bookingStatus]);

  const getStatusConfig = (status) => {
    switch (status?.type) {
      case 'creating':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          message: 'Creating booking...',
          showProgress: true
        };
      case 'updating':
        return {
          icon: 'RefreshCw',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          message: 'Updating booking...',
          showProgress: true
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          message: status?.message || 'Booking confirmed!',
          showProgress: false
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          message: status?.message || 'Booking failed',
          showProgress: false
        };
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          message: 'Booking pending approval',
          showProgress: false
        };
      default:
        return null;
    }
  };

  if (!isVisible || !bookingStatus) {
    return null;
  }

  const config = getStatusConfig(bookingStatus);
  if (!config) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 ${animationClass} ${className}`}>
      <div className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-elevated
        ${config?.bgColor} ${config?.borderColor} backdrop-blur-sm
        max-w-sm transition-smooth hover:shadow-hover
      `}>
        {/* Status Icon */}
        <div className={`flex-shrink-0 ${config?.showProgress ? 'animate-spin' : ''}`}>
          <Icon 
            name={config?.icon} 
            size={20} 
            className={config?.color}
          />
        </div>

        {/* Status Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {config?.message}
          </p>
          {bookingStatus?.details && (
            <p className="text-xs text-muted-foreground truncate">
              {bookingStatus?.details}
            </p>
          )}
        </div>

        {/* Action Button */}
        {bookingStatus?.actionable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStatusClick(bookingStatus)}
            className="flex-shrink-0"
          >
            <Icon name="ExternalLink" size={14} />
          </Button>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 w-6 h-6"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>
      {/* Progress Bar (for loading states) */}
      {config?.showProgress && bookingStatus?.progress && (
        <div className="mt-2 w-full bg-muted rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              bookingStatus?.type === 'creating' ? 'bg-warning' : 'bg-accent'
            }`}
            style={{ width: `${bookingStatus?.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default BookingStatusIndicator;