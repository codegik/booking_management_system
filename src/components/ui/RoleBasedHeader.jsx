import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedHeader = ({ 
  user = { role: 'admin', name: 'John Doe' }, 
  company = { name: 'Booking Management System', logo: null },
  notifications = { count: 0 },
  onLogout = () => {},
  onToggleSidebar = () => {},
  isSidebarCollapsed = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/company-dashboard', icon: 'LayoutDashboard' },
          { label: 'Employees', path: '/employee-management-screen', icon: 'Users' },
          { label: 'Services', path: '/service-management-screen', icon: 'Settings' },
          { label: 'Bookings', path: '/create-edit-booking-screen', icon: 'Calendar' }
        ];
      case 'customer':
        return [
          { label: 'Dashboard', path: '/customer-dashboard', icon: 'Home' },
          { label: 'Book Service', path: '/create-edit-booking-screen', icon: 'Plus' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/company-registration-screen');
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center space-x-3">
          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleProfileMenuToggle}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      // Handle profile navigation
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      // Handle settings navigation
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
      {/* Overlay for mobile menus */}
      {(isProfileMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default RoleBasedHeader;