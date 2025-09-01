import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color = 'primary',
  linkTo,
  description 
}) => {
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          border: 'border-success/20'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          border: 'border-warning/20'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          icon: 'text-error',
          border: 'border-error/20'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          icon: 'text-accent',
          border: 'border-accent/20'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          border: 'border-primary/20'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  const CardContent = () => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <Icon 
                name={changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={changeType === 'increase' ? 'text-success' : 'text-error'}
              />
              <span className={`text-sm ml-1 ${
                changeType === 'increase' ? 'text-success' : 'text-error'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses?.bg} ${colorClasses?.border} border flex items-center justify-center`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default MetricsCard;