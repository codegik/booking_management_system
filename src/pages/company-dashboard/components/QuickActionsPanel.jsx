import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Add Employee',
      description: 'Register new team member',
      icon: 'UserPlus',
      color: 'primary',
      linkTo: '/employee-management-screen',
      stats: '12 active'
    },
    {
      id: 2,
      title: 'Create Service',
      description: 'Add new service offering',
      icon: 'Plus',
      color: 'success',
      linkTo: '/service-management-screen',
      stats: '8 services'
    },
    {
      id: 3,
      title: 'New Booking',
      description: 'Schedule appointment',
      icon: 'Calendar',
      color: 'accent',
      linkTo: '/create-edit-booking-screen',
      stats: '24 today'
    },
    {
      id: 4,
      title: 'Customer Management',
      description: 'Manage customer accounts',
      icon: 'Users',
      color: 'warning',
      linkTo: '/customer-dashboard',
      stats: '156 customers'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10 hover:bg-success/20',
          icon: 'text-success',
          border: 'border-success/20 hover:border-success/30'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10 hover:bg-warning/20',
          icon: 'text-warning',
          border: 'border-warning/20 hover:border-warning/30'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10 hover:bg-accent/20',
          icon: 'text-accent',
          border: 'border-accent/20 hover:border-accent/30'
        };
      default:
        return {
          bg: 'bg-primary/10 hover:bg-primary/20',
          icon: 'text-primary',
          border: 'border-primary/20 hover:border-primary/30'
        };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Frequently used management tasks</p>
      </div>
      {/* Actions Grid */}
      <div className="space-y-4">
        {quickActions?.map((action) => {
          const colorClasses = getColorClasses(action?.color);
          
          return (
            <Link
              key={action?.id}
              to={action?.linkTo}
              className={`block p-4 rounded-lg border transition-smooth ${colorClasses?.bg} ${colorClasses?.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-card border ${colorClasses?.border} flex items-center justify-center`}>
                    <Icon name={action?.icon} size={20} className={colorClasses?.icon} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action?.title}</p>
                    <p className="text-xs text-muted-foreground">{action?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{action?.stats}</p>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground mt-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Additional Quick Tools */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">Quick Tools</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="Download" size={14} className="mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="Settings" size={14} className="mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="BarChart3" size={14} className="mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Icon name="HelpCircle" size={14} className="mr-2" />
            Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;