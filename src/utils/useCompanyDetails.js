import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {clearAuthData, makeAuthenticatedRequest} from './auth';

const useCompanyDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest('/api/company/details', {
        method: 'GET'
      });

      if (!response.ok) {
        clearAuthData();
        navigate('/');
        return;
      }

      const companyData = await response.json();

      setUser({
        role: companyData.role,
        name: companyData.name,
        email: companyData.email
      });

      setCompany({
        name: companyData.name,
        logo: companyData.pictureUrl,
        address: companyData.address,
        phone: companyData.cellphone,
        email: companyData.email,
        description: companyData.description,
        role: companyData.role,
        workDays: companyData.workDays
      });
    } catch (error) {
        console.error('Failed to fetch company details:', error);
        setError('Failed to fetch company details. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }, [navigate]);

  const refreshCompanyDetails = useCallback(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  return {
    user,
    company,
    isLoading,
    error,
    fetchCompanyDetails,
    refreshCompanyDetails
  };
};

export default useCompanyDetails;
