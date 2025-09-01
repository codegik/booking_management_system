import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const CustomerBottomTabs = ({ 
  user = { role: 'customer' },
  notifications = { bookings: 0 },
  className = ''
}) => {
  const location = useLocation();

  const tabItems = [
    { 
      label: 'Home', 
      path: '/customer-dashboard', 
      icon: 'Home',
      badge: null
    },
    { 
      label: 'Book', 
      path: '/create-edit-booking-screen', 
      icon: 'Plus',
      badge: null
    },
    { 
      label: 'Bookings', 
      path: '/customer-bookings', 
      icon: 'Calendar',
      badge: notifications?.bookings > 0 ? notifications?.bookings : null
    },
    { 
      label: 'Profile', 
      path: '/customer-profile', 
      icon: 'User',
      badge: null
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  // Only show for customer role and on mobile devices
  if (user?.role !== 'customer') {
    return null;
  }

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border ${className}`}>
      <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {tabItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            className={`relative flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-smooth ${
              isActiveRoute(item?.path)
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`transition-smooth ${
                  isActiveRoute(item?.path) ? 'scale-110' : ''
                }`}
              />
              {item?.badge && (
                <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item?.badge > 9 ? '9+' : item?.badge}
                </span>
              )}
            </div>
            <span className={`text-xs mt-1 truncate transition-smooth ${
              isActiveRoute(item?.path) ? 'font-medium' : 'font-normal'
            }`}>
              {item?.label}
            </span>
            {isActiveRoute(item?.path) && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CustomerBottomTabs;