import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api';

const AdminAuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      if (token) {
        await adminApi.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin');
      setToken(null);
      setAdmin(null);
      delete adminApi.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      if (token) {
        try {
          adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await adminApi.get('/user');
          setAdmin(response.data);
        } catch (error) {
          console.error('Failed to fetch admin', error);
          // Clear invalid token
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin');
          setToken(null);
          setAdmin(null);
          delete adminApi.defaults.headers.common['Authorization'];
        }
      } else {
        delete adminApi.defaults.headers.common['Authorization'];
        setAdmin(null);
      }
      setLoading(false);
    };

    fetchAdmin();
  }, [token]);

  const login = (newToken, adminData) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const isAuthenticated = !!admin && !!token;

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
