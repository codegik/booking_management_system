import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileSection = ({ user, onUpdateProfile, onUpdatePreferences }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    bookingReminders: user?.preferences?.bookingReminders ?? true,
    promotionalEmails: user?.preferences?.promotionalEmails ?? false,
    reminderTime: user?.preferences?.reminderTime || '24'
  });

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleSavePreferences = () => {
    onUpdatePreferences(preferences);
    setShowPreferences(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Icon name="Edit" size={16} className="mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveProfile}>
                <Icon name="Check" size={16} className="mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{user?.name}</h3>
            <p className="text-muted-foreground">Customer since {new Date(user?.joinDate || Date.now())?.getFullYear()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData?.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData?.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData?.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <Input
            label="Address"
            name="address"
            value={formData?.address}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <Icon name="Settings" size={16} className="mr-1" />
            {showPreferences ? 'Hide' : 'Manage'}
          </Button>
        </div>

        {!showPreferences ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Email Notifications</span>
              <span className={`text-sm font-medium ${preferences?.emailNotifications ? 'text-success' : 'text-muted-foreground'}`}>
                {preferences?.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">SMS Notifications</span>
              <span className={`text-sm font-medium ${preferences?.smsNotifications ? 'text-success' : 'text-muted-foreground'}`}>
                {preferences?.smsNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Booking Reminders</span>
              <span className={`text-sm font-medium ${preferences?.bookingReminders ? 'text-success' : 'text-muted-foreground'}`}>
                {preferences?.bookingReminders ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive booking confirmations and updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.smsNotifications}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Booking Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded before your appointments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.bookingReminders}
                    onChange={(e) => handlePreferenceChange('bookingReminders', e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Promotional Emails</p>
                  <p className="text-sm text-muted-foreground">Receive offers and promotional content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.promotionalEmails}
                    onChange={(e) => handlePreferenceChange('promotionalEmails', e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="block text-sm font-medium text-foreground mb-2">
                Reminder Time
              </label>
              <select
                value={preferences?.reminderTime}
                onChange={(e) => handlePreferenceChange('reminderTime', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
              >
                <option value="1">1 hour before</option>
                <option value="2">2 hours before</option>
                <option value="24">24 hours before</option>
                <option value="48">48 hours before</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSavePreferences}>
                <Icon name="Check" size={16} className="mr-1" />
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Account Statistics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Account Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{user?.stats?.totalBookings || 0}</div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{user?.stats?.completedBookings || 0}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{user?.stats?.cancelledBookings || 0}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">${user?.stats?.totalSpent || 0}</div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;