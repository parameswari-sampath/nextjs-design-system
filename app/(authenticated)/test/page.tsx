"use client";

import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function TestPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
    return <div className="p-6">Loading...</div>;
  }

  const renderTeacherView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tests</h1>
        <Button variant="primary">Create New Test</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Mathematics Quiz 1
              <Badge variant="success">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              25 questions • 45 minutes
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                View Test
              </Button>
              <Button variant="secondary" className="w-full">
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Physics Mid-term
              <Badge variant="warning">Draft</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              40 questions • 60 minutes
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Edit Test
              </Button>
              <Button variant="secondary" className="w-full">
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentView = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Available Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Mathematics Quiz 1
              <Badge variant="info">Available</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              25 questions • 45 minutes • Due: Tomorrow
            </p>
            <Button variant="primary" className="w-full">
              Start Test
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              History Essay Test
              <Badge variant="success">Completed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              Score: 85/100 • Submitted 2 days ago
            </p>
            <Button variant="outline" className="w-full">
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return user.role === 'TEACHER' ? renderTeacherView() : renderStudentView();
}