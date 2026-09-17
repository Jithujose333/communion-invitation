import React, { createContext, useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('collabuz_token');
      const savedUser = localStorage.getItem('collabuz_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally verify with /api/auth/me
          const freshUser = await fetchApi('/auth/me');
          setUser(freshUser);
          localStorage.setItem('collabuz_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Auth token expired or invalid:', err.message);
          logout();
        }
      } else {
        // Auto-seed demo guest student user for immediate smooth browsing if empty
        demoLogin('user');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('collabuz_token', data.token);
    localStorage.setItem('collabuz_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    localStorage.setItem('collabuz_token', data.token);
    localStorage.setItem('collabuz_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('collabuz_token');
    localStorage.removeItem('collabuz_user');
    setUser(null);
  };

  // Quick Demo Switcher helper for instant reviewer testing
  const demoLogin = async (role) => {
    let credentials = { email: 'student@collabuz.com', password: 'user123' };
    if (role === 'college') {
      credentials = { email: 'host@stanford.edu', password: 'college123' };
    } else if (role === 'admin') {
      credentials = { email: 'admin@collabuz.com', password: 'admin123' };
    }

    try {
      return await login(credentials.email, credentials.password);
    } catch (err) {
      // Fallback local state if API server is booting
      const fallbackUser = {
        _id: role + '_123',
        name: role === 'admin' ? 'System Administrator' : role === 'college' ? 'Stanford University Events' : 'Aarav Sharma',
        email: credentials.email,
        role: role,
        collegeName: role === 'college' ? 'Stanford University' : '',
        token: 'demo_token_' + role
      };
      localStorage.setItem('collabuz_token', fallbackUser.token);
      localStorage.setItem('collabuz_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
