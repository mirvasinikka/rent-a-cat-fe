import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = !!localStorage.getItem('user');
    setIsAuthenticated(loggedIn);

    if (loggedIn) {
      setUser(JSON.parse(localStorage.getItem('user')));
      setIsLoading(false);
    }
  }, []);

  const login = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <AuthContext.Provider value={{ isLoading, isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
