import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading & !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated]);

  return isAuthenticated ? children : null;
};

export default RequireAuth;
