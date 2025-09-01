import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CustomerSelector = ({ 
  selectedCustomer, 
  onCustomerChange, 
  onAddNewCustomer,
  disabled = false,
  error = null 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock customer data
  const customers = [
    { value: '1', label: 'John Smith', description: 'john.smith@email.com • (555) 123-4567' },
    { value: '2', label: 'Sarah Johnson', description: 'sarah.j@email.com • (555) 234-5678' },
    { value: '3', label: 'Michael Brown', description: 'mike.brown@email.com • (555) 345-6789' },
    { value: '4', label: 'Emily Davis', description: 'emily.davis@email.com • (555) 456-7890' },
    { value: '5', label: 'David Wilson', description: 'david.w@email.com • (555) 567-8901' },
    { value: '6', label: 'Lisa Anderson', description: 'lisa.anderson@email.com • (555) 678-9012' },
    { value: '7', label: 'Robert Taylor', description: 'robert.t@email.com • (555) 789-0123' },
    { value: '8', label: 'Jennifer Martinez', description: 'jennifer.m@email.com • (555) 890-1234' }
  ];

  const handleAddCustomer = async () => {
    if (!newCustomer?.name || !newCustomer?.email || !newCustomer?.phone) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const customer = {
        value: Date.now()?.toString(),
        label: newCustomer?.name,
        description: `${newCustomer?.email} • ${newCustomer?.phone}`
      };
      
      onAddNewCustomer(customer);
      onCustomerChange(customer?.value);
      setNewCustomer({ name: '', email: '', phone: '' });
      setShowAddForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelAdd = () => {
    setNewCustomer({ name: '', email: '', phone: '' });
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Add New Customer</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelAdd}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter customer name"
            value={newCustomer?.name}
            onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e?.target?.value }))}
            required
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={newCustomer?.email}
            onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e?.target?.value }))}
            required
            disabled={isLoading}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            value={newCustomer?.phone}
            onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e?.target?.value }))}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex space-x-3">
          <Button
            variant="default"
            onClick={handleAddCustomer}
            loading={isLoading}
            disabled={!newCustomer?.name || !newCustomer?.email || !newCustomer?.phone}
            iconName="Plus"
            iconPosition="left"
          >
            Add Customer
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelAdd}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Select
        label="Select Customer"
        description="Choose an existing customer or add a new one"
        placeholder="Search customers..."
        options={customers}
        value={selectedCustomer}
        onChange={onCustomerChange}
        searchable
        clearable
        disabled={disabled}
        error={error}
        required
      />

      <Button
        variant="outline"
        onClick={() => setShowAddForm(true)}
        disabled={disabled}
        iconName="UserPlus"
        iconPosition="left"
        fullWidth
      >
        Add New Customer
      </Button>
    </div>
  );
};

export default CustomerSelector;