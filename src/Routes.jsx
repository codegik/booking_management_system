import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import CompanyDashboard from './pages/company-dashboard';
import CompanyRegistrationScreen from './pages/company-registration-screen';
import CustomerRegistrationScreen from './pages/customer-registration-screen';
import ServiceManagementScreen from './pages/service-management-screen';
import EmployeeManagementScreen from './pages/employee-management-screen';
import CreateEditBookingScreen from './pages/create-edit-booking-screen';
import CustomerDashboard from './pages/customer-dashboard';
import CustomerBooking from './pages/customer-booking';
import CustomerBookingHistory from './pages/customer-booking-history';
import SocialLoginScreen from './pages/social-login-screen';
import EmployeeDashboard from './pages/employee-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<SocialLoginScreen />} />
        <Route path="/login" element={<SocialLoginScreen />} />
        <Route
          path="/company-registration-screen"
          element={
            <ProtectedRoute>
              <CompanyRegistrationScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-management-screen"
          element={
            <ProtectedRoute>
              <ServiceManagementScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-management-screen"
          element={
            <ProtectedRoute>
              <EmployeeManagementScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-edit-booking-screen"
          element={
            <ProtectedRoute>
              <CreateEditBookingScreen />
            </ProtectedRoute>
          }
        />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-booking" element={<CustomerBooking />} />
        <Route path="/customer-booking-history" element={<CustomerBookingHistory />} />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer registration route - must be before the catch-all route */}
        <Route path="/:companyAlias" element={<CustomerRegistrationScreen />} />

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
