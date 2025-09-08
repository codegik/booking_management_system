import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load jwtToken from localStorage
  const jwtToken = localStorage.getItem('jwtToken');

  // Load customer name from localStorage
  useEffect(() => {
    const storedCustomerName = localStorage.getItem('customerName');
    if (storedCustomerName) {
      setCustomerName(storedCustomerName);
    }
  }, []);

  // Helper for fetch with auth
  const fetchWithAuth = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  // Fetch company info from localStorage (set during registration)
  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) return;
    setLoading(true);
    fetchWithAuth(`/api/company/id/${companyId}`)
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(() => setError('Failed to load company info'))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-3">
              {company?.pictureUrl && (
                <img src={company.pictureUrl} alt="Company" className="w-8 h-8 rounded-full object-cover" />
              )}
              <h1 className="text-xl font-semibold text-foreground">
                {company?.name || 'Booking System'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome, {customerName}!
              </h2>
            </div>

            {/* Menu Options */}
            <div className="space-y-4">
              {/* Book New Appointment */}
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">Book New Appointment</h3>
                    <p className="text-sm text-muted-foreground">
                      Schedule a new appointment with our professionals
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/customer-booking')}
                  className="w-full"
                >
                  Start Booking
                </Button>
              </div>

              {/* View Booking History */}
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">Booking History</h3>
                    <p className="text-sm text-muted-foreground">
                      View and manage your past and upcoming appointments
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/customer-booking-history')}
                  variant="outline"
                  className="w-full"
                >
                  View History
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
