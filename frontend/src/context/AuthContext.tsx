import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';

export interface PrivacySettings {
  hidePortfolioValue: boolean;
  hideWalletBalance: boolean;
  hideEmail: boolean;
  hidePhoneNumber: boolean;
  hideTotalProfit: boolean;
}

export interface User {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  privacy?: PrivacySettings;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchApi('/api/users/me');
          
          let privacySettings = undefined;
          try {
            const settingsData = await fetchApi('/api/settings');
            privacySettings = settingsData.privacy;
          } catch (e) { console.error("Failed to fetch privacy settings", e); }

          setUser({ ...userData, privacy: privacySettings });
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    localStorage.setItem('token', token);
    
    let privacySettings = undefined;
    try {
      const settingsData = await fetchApi('/api/settings');
      privacySettings = settingsData.privacy;
    } catch (e) { console.error("Failed to fetch privacy settings", e); }
    
    setUser({ ...userData, privacy: privacySettings });
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
