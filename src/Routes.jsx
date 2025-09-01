import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CompanyDashboard from './pages/company-dashboard';
import CompanyRegistrationScreen from './pages/company-registration-screen';
import ServiceManagementScreen from './pages/service-management-screen';
import EmployeeManagementScreen from './pages/employee-management-screen';
import CreateEditBookingScreen from './pages/create-edit-booking-screen';
import CustomerDashboard from './pages/customer-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CompanyDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company-registration-screen" element={<CompanyRegistrationScreen />} />
        <Route path="/service-management-screen" element={<ServiceManagementScreen />} />
        <Route path="/employee-management-screen" element={<EmployeeManagementScreen />} />
        <Route path="/create-edit-booking-screen" element={<CreateEditBookingScreen />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
