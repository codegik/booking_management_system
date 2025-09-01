import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminSidebar = ({ 
  isCollapsed = false, 
  onToggle = () => {},
  user = { role: 'admin', name: 'John Doe' },
  className = ''
}) => {
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/company-dashboard', 
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    { 
      label: 'Employees', 
      path: '/employee-management-screen', 
      icon: 'Users',
      description: 'Manage team members'
    },
    { 
      label: 'Services', 
      path: '/service-management-screen', 
      icon: 'Settings',
      description: 'Configure offerings'
    },
    { 
      label: 'Bookings', 
      path: '/create-edit-booking-screen', 
      icon: 'Calendar',
      description: 'Appointment management'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      } bg-card border-r border-border transition-all duration-300 ease-in-out ${className}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-smooth ${
                isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item?.label}</div>
                  <div className="text-xs opacity-75 truncate">{item?.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 ${!isCollapsed ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onToggle}
        />
        
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col transform transition-transform">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={onToggle}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-smooth ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} className="mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item?.label}</div>
                  <div className="text-xs opacity-75 truncate">{item?.description}</div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile Footer */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;