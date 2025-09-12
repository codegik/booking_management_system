import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {clearAuthData, makeAuthenticatedRequest} from './auth';

const useCompanyDetails = () => {
  const navigate = useNavigate();
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

      setCompany(companyData);
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
    company,
    isLoading,
    error,
    fetchCompanyDetails,
    refreshCompanyDetails
  };
};

export default useCompanyDetails;
