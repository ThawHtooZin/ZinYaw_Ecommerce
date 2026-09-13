// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// 1. Create the Context object
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading = true prevents ProtectedRoute from redirecting before the token check finishes
  const [loading, setLoading] = useState(true);

  // 2. Hydrate session on initial app load
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('zinyaw_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch current user details from GET /profile/me
        const res = await authService.getProfile();
        if (res?.data) {
          setUser(res.data);
        } else {
          // Token is corrupted or expired
          localStorage.removeItem('zinyaw_token');
          setUser(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err.message);
        localStorage.removeItem('zinyaw_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // 3. Login action: saves token and sets user
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    // data.user comes from Laravel POST /auth/login response
    setUser(data.user);
    return data;
  };

  // 4. Logout action: clears local token and resets state
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Backend logout failed or offline:', err.message);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook for clean imports in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};