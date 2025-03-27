'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:1337/api/users/me?populate=*', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedJwt = localStorage.getItem('jwt');
      if (storedJwt) {
        try {
          const userData = await fetchUserData(storedJwt);
          setUser(userData);
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('jwt');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      localStorage.setItem('jwt', response.jwt);
      
      // Fetch complete user data with tasks
      const userData = await fetchUserData(response.jwt);
      setUser(userData);
      
      router.push('/tache');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      localStorage.setItem('jwt', response.jwt);
      
      // Fetch complete user data with tasks
      const completeUserData = await fetchUserData(response.jwt);
      setUser(completeUserData);
      
      router.push('/tache');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 