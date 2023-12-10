import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);

    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedIn) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsAuthenticated(false);
    setUser(null);

    try {
      await fetch('/api/user/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return <AuthContext.Provider value={{ isLoading, isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
