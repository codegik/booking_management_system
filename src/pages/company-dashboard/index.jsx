import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Icon from '../../components/AppIcon';
import CompanyHeader from '../../components/ui/CompanyHeader';
import MetricsCard from './components/MetricsCard';
import BookingCalendarWidget from './components/BookingCalendarWidget';
import { makeAuthenticatedRequest, handleLogout } from '../../utils/auth';
import useCompanyDetails from '../../utils/useCompanyDetails';
import Button from "../../components/ui/Button";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);
  const { company, isLoading, error, fetchCompanyDetails } = useCompanyDetails();

  // Fetch dashboard metrics from API
  const fetchDashboardMetrics = async () => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);

      const response = await makeAuthenticatedRequest('/api/company/dashboard', {
        method: 'GET'
      });

      if (!response.ok) {
        if (response.status === 404) {
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch dashboard metrics');
      }

      const data = await response.json();
      setDashboardMetrics(data);
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      setMetricsError(error.message || 'Failed to load dashboard metrics');
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication using the correct token key
    const token = localStorage.getItem('jwtToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || !isAuthenticated || isAuthenticated !== 'true') {
        handleLogout(navigate);
        return;
    }

    // Fetch company details from API
    fetchCompanyDetails();

    // Fetch dashboard metrics
    fetchDashboardMetrics();
  }, [navigate, fetchCompanyDetails]);

  useEffect(() => {
    // Fetch dashboard metrics when company details are successfully fetched
    if (!isLoading && company) {
      fetchDashboardMetrics();
    }
  }, [isLoading, company]);

  useEffect(() => {
    if (!isLoading && company && !company.alias) {
      navigate('/company-registration');
    }
  }, [isLoading, company, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/company-dashboard')}
            className="p-2"
        >
            ←
        </Button>
      <CompanyHeader
        company={company}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading company details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <div>
                  <h3 className="text-lg font-semibold text-error">Failed to load company details</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  <button
                    onClick={fetchCompanyDetails}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Loading State */}
          {metricsLoading && (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard metrics...</p>
              </div>
            </div>
          )}

          {/* Metrics Error State */}
          {metricsError && !metricsLoading && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <div>
                  <h3 className="text-lg font-semibold text-error">Failed to load dashboard metrics</h3>
                  <p className="text-sm text-muted-foreground mt-1">{metricsError}</p>
                  <button
                    onClick={fetchDashboardMetrics}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content - Only show when not loading */}
          {!isLoading && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Here's what's happening with your business today.
                </h1>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {dashboardMetrics?.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    title={metric?.title}
                    value={metric?.value}
                    change={metric?.change}
                    changeType={metric?.changeType}
                    icon={metric?.icon}
                    color={metric?.color}
                    linkTo={metric?.linkTo}
                    description={metric?.description}
                  />
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Booking Calendar Widget */}
                <div className="lg:col-span-6">
                  <BookingCalendarWidget />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
