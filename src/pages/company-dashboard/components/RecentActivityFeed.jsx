import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityFeed = () => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      type: 'booking_created',
      title: 'New booking created',
      description: 'Sarah Johnson booked Hair Cut & Style',
      details: 'Service: Hair Cut & Style\nEmployee: Emma Wilson\nDate: Sep 2, 2025 at 9:00 AM\nPrice: $85',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'Calendar',
      color: 'success'
    },
    {
      id: 2,
      type: 'booking_completed',
      title: 'Booking completed',
      description: 'Robert Taylor\'s appointment finished',
      details: 'Service: Full Service\nEmployee: James Smith\nDuration: 90 minutes\nPayment: $120 (Paid)',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      icon: 'CheckCircle',
      color: 'accent'
    },
    {
      id: 3,
      type: 'employee_added',
      title: 'New employee added',
      description: 'Sophie Chen joined the team',
      details: 'Role: Nail Technician\nServices: Manicure, Pedicure, Nail Art\nStart Date: Sep 1, 2025\nContact: sophie.chen@email.com',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'UserPlus',
      color: 'primary'
    },
    {
      id: 4,
      type: 'service_updated',
      title: 'Service updated',
      description: 'Color Treatment price changed',
      details: 'Previous Price: $140\nNew Price: $150\nReason: Material cost increase\nEffective: Immediately',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'Edit',
      color: 'warning'
    },
    {
      id: 5,
      type: 'booking_cancelled',
      title: 'Booking cancelled',
      description: 'Mark Wilson cancelled his appointment',
      details: 'Service: Beard Trim\nOriginal Date: Sep 2, 2025 at 2:00 PM\nReason: Schedule conflict\nRefund: $35 (Processed)',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      icon: 'XCircle',
      color: 'error'
    },
    {
      id: 6,
      type: 'customer_registered',
      title: 'New customer registered',
      description: 'Amanda White created an account',
      details: 'Email: amanda.white@email.com\nPhone: (555) 123-4567\nPreferred Services: Manicure, Pedicure\nReferral: Google Search',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      icon: 'User',
      color: 'primary'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      case 'accent':
        return 'text-accent bg-accent/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentActivities?.map((activity) => (
          <div key={activity?.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColorClasses(activity?.color)}`}>
                <Icon name={activity?.icon} size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>

                {/* Expandable Details */}
                {expandedItems?.has(activity?.id) && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-md">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                      {activity?.details}
                    </pre>
                  </div>
                )}

                {/* Expand Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(activity?.id)}
                  className="mt-2 h-6 px-2 text-xs"
                >
                  <Icon 
                    name={expandedItems?.has(activity?.id) ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                    className="mr-1" 
                  />
                  {expandedItems?.has(activity?.id) ? 'Less' : 'More'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <Button variant="outline" size="sm">
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;