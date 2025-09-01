import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmployeeDetailModal = ({ 
  isOpen = false, 
  onClose = () => {},
  employee = null,
  onEdit = () => {},
  onServiceAssign = () => {},
  onStatusToggle = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'services', label: 'Services', icon: 'Settings' },
    { id: 'activity', label: 'Activity', icon: 'Clock' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card rounded-lg border border-border shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {employee?.pictureUrl ? (
                  <img
                    src={employee?.pictureUrl}
                    alt={employee?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-primary rounded-full flex items-center justify-center ${employee?.pictureUrl ? 'hidden' : ''}`}>
                  <span className="text-xl font-bold text-primary-foreground">
                    {employee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{employee?.name}</h2>
                <p className="text-sm text-muted-foreground">{employee?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === 'active' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                  }`}>
                    <Icon 
                      name={employee?.status === 'active' ? 'CheckCircle' : 'XCircle'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {employee?.status}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                    {employee?.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onEdit(employee)}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Icon name="Mail" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{employee?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Phone" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{employee?.phone}</span>
                      </div>
                      {employee?.pictureUrl && (
                        <div className="flex items-center space-x-3">
                          <Icon name="Image" size={16} className="text-muted-foreground" />
                          <a 
                            href={employee?.pictureUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate"
                          >
                            View Profile Picture
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Work Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <span className="text-sm font-medium text-foreground capitalize">{employee?.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStatusToggle(employee)}
                          className={employee?.status === 'active' ? 'text-success' : 'text-error'}
                        >
                          {employee?.status === 'active' ? 'Active' : 'Inactive'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Services:</span>
                        <span className="text-sm font-medium text-foreground">
                          {employee?.assignedServices?.length} assigned
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Login:</span>
                        <span className="text-sm font-medium text-foreground">
                          {new Date(employee.lastLogin)?.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {employee?.notes && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-foreground">Notes</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      {employee?.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground">Assigned Services</h3>
                  <Button
                    variant="outline"
                    onClick={() => onServiceAssign(employee)}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Manage Services
                  </Button>
                </div>

                {employee?.assignedServices?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employee?.assignedServices?.map((service) => (
                      <div key={service?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">{service?.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            service?.status === 'active' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                          }`}>
                            {service?.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service?.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{service?.duration} minutes</span>
                          <span>${service?.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No Services Assigned</h4>
                    <p className="text-muted-foreground mb-4">
                      This employee hasn't been assigned any services yet.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => onServiceAssign(employee)}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Assign Services
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
                
                <div className="space-y-4">
                  {employee?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity?.type === 'login' ? 'bg-success/20' :
                        activity?.type === 'booking'? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <Icon 
                          name={
                            activity?.type === 'login' ? 'LogIn' :
                            activity?.type === 'booking'? 'Calendar' : 'Clock'
                          } 
                          size={16} 
                          className={
                            activity?.type === 'login' ? 'text-success' :
                            activity?.type === 'booking'? 'text-primary' : 'text-muted-foreground'
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity?.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp)?.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-12">
                      <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">No Recent Activity</h4>
                      <p className="text-muted-foreground">
                        Activity will appear here once the employee starts using the system.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;