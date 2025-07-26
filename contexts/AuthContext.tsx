"use client";

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';
import { authenticatedFetch } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'TEACHER' | 'STUDENT';
  created_at: string;
  updated_at: string;
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize with loading state to match server-side rendering
  const [state, setState] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: true });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load user data immediately on client-side to minimize flicker
  // Using useLayoutEffect for synchronous execution before DOM updates
  useLayoutEffect(() => {
    // Set hydrated flag immediately to prevent multiple useEffect runs
    setIsHydrated(true);
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setState({ user: parsedUser, loading: false });
      } catch (error) {
        console.error('🔐 [AUTH CONTEXT] Error parsing user data:', error);
        setState({ user: null, loading: false });
      }
    } else {
      setState({ user: null, loading: false });
    }
  }, []);

  // Fetch fresh user data from API
  const refreshUser = async () => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`
      );

      if (response.ok) {
        const userData = await response.json();
        setState(prev => ({ user: userData, loading: prev.loading }));
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  // Update user data (for optimistic updates)
  const updateUser = (userData: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      
      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return { user: updatedUser, loading: prev.loading };
    });
  };

  // Logout function
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (accessToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({})
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all data
      setState({ user: null, loading: false });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      
      // Clear cookies
      const clearCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
      };
      
      clearCookie('access_token');
      clearCookie('refresh_token');
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    updateUser,
    refreshUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};