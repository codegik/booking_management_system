import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import {handleLogout} from '../../utils/auth';

const EmployeeHeader = ({
    employee: employee = null,
    company: company = null
}) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Back to Dashboard Button */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                  onClick={() => navigate('/employee-dashboard')}
              >
                  <Icon name="Home" size={16} className="mr-1" />
              </Button>
          </div>
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
                    {company?.pictureUrl && (
                        <img src={company.pictureUrl} className="w-8 h-8 rounded-full object-cover" />
                    )}
                </div>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  {employee?.pictureUrl && (
                      <img src={employee.pictureUrl} className="w-8 h-8 rounded-full object-cover" />
                  )}
              </div>
                <p className="text-sm font-medium text-foreground">{employee?.name}</p>
              <Icon name="ChevronDown" size={16} />
            </Button>
            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      // navigate('/company-registration-screen');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    Profile
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={() => handleLogout(navigate, '/' + company.alias)}
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
    </header>
  );
};

export default EmployeeHeader;