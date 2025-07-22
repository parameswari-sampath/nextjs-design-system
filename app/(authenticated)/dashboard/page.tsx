"use client";

import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <Badge variant={user.role === 'TEACHER' ? 'info' : 'success'}>
          {user.role}
        </Badge>
      </div>

      <Alert variant="success">
        Welcome to your dashboard! You have successfully logged in.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Name:</span>
              <p className="text-[var(--foreground)]">{user.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Email:</span>
              <p className="text-[var(--foreground)]">{user.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Role:</span>
              <p className="text-[var(--foreground)]">{user.role}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">User ID:</span>
              <p className="text-xs text-[var(--color-muted-foreground)] font-mono">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {user.role === 'TEACHER' 
                ? 'Teacher dashboard features will be available here.'
                : 'Student dashboard features will be available here.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]">Account created</span>
                <span className="text-[var(--color-muted-foreground)]">Today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]">First login</span>
                <span className="text-[var(--color-muted-foreground)]">Now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
            <span className="text-sm text-[var(--foreground)]">
              You are successfully authenticated and can access protected routes.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}