"use client";

import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';

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
      <div className="p-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  const renderTeacherDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Teacher Dashboard</h1>
        <Badge variant="info">TEACHER</Badge>
      </div>

      <Alert variant="success">
        Welcome back, {user.name}! Ready to inspire and educate today?
      </Alert>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primary)]">5</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Currently teaching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">142</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-warning)]">23</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Assignments to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-purple-500)]">12</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Classes scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="primary" className="w-full">
              Create New Assignment
            </Button>
            <Button variant="outline" className="w-full">
              Grade Submissions
            </Button>
            <Button variant="secondary" className="w-full">
              Schedule Class
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">Math 101 - Assignment graded</span>
              <span className="text-[var(--color-muted-foreground)]">2h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">New student enrolled in Physics</span>
              <span className="text-[var(--color-muted-foreground)]">4h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">Chemistry lab scheduled</span>
              <span className="text-[var(--color-muted-foreground)]">1d ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Mathematics 101', 'Physics Advanced', 'Chemistry Basics', 'Algebra II', 'Calculus I'].map((course, index) => (
              <div key={index} className="p-3 bg-[var(--color-secondary)] rounded-[var(--radius)] border">
                <h4 className="font-medium text-sm">{course}</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {Math.floor(Math.random() * 30) + 15} students
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Student Dashboard</h1>
        <Badge variant="success">STUDENT</Badge>
      </div>

      <Alert variant="success">
        Welcome back, {user.name}! Keep up the great work with your studies!
      </Alert>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primary)]">6</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overall GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">3.8</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-warning)]">4</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Assignments due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-purple-500)]">45</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Out of 120 required</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="primary" className="w-full">
              View Assignments
            </Button>
            <Button variant="outline" className="w-full">
              Check Grades
            </Button>
            <Button variant="secondary" className="w-full">
              Access Course Materials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">Math Assignment #3</span>
              <span className="text-[var(--color-destructive)]">Tomorrow</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">History Essay</span>
              <span className="text-[var(--color-warning)]">3 days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]">Chemistry Lab Report</span>
              <span className="text-[var(--color-muted-foreground)]">1 week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Mathematics 101', grade: 'A-', progress: 85 },
              { name: 'English Literature', grade: 'B+', progress: 75 },
              { name: 'World History', grade: 'A', progress: 92 },
              { name: 'Biology', grade: 'B', progress: 68 },
              { name: 'Art Fundamentals', grade: 'A-', progress: 88 },
              { name: 'Physical Education', grade: 'A+', progress: 95 }
            ].map((course, index) => (
              <div key={index} className="p-3 bg-[var(--color-secondary)] rounded-[var(--radius)] border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{course.name}</h4>
                  <Badge variant={course.grade.startsWith('A') ? 'success' : course.grade.startsWith('B') ? 'info' : 'warning'} className="text-xs">
                    {course.grade}
                  </Badge>
                </div>
                <div className="w-full bg-[var(--color-border)] rounded-full h-1.5">
                  <div 
                    className="bg-[var(--color-primary)] h-1.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {course.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return user.role === 'TEACHER' ? renderTeacherDashboard() : renderStudentDashboard();
}