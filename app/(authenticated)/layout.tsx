"use client";

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button';

// Utility function to clear authentication data
const logout = () => {
  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  
  // Clear cookies properly
  const clearCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
  };
  
  clearCookie('access_token');
  clearCookie('refresh_token');
  
  // Redirect to login
  window.location.href = '/login';
};

// Get user data from localStorage
const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data on client side
    const userData = getUserData();
    setUser(userData);
    setLoading(false);

    // If no user data, redirect to login
    if (!userData) {
      window.location.href = '/login';
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--foreground)]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation Header */}
      <nav className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Welcome, <span className="font-medium text-[var(--foreground)]">{user.name}</span>
            </span>
            <span className="text-xs bg-[var(--color-secondary)] px-2 py-1 rounded-[var(--radius)] text-[var(--color-secondary-foreground)]">
              {user.role}
            </span>
            <Button 
              variant="outline" 
              onClick={logout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}