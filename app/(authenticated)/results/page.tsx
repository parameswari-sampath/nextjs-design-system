"use client";

import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function ResultsPage() {
  console.log("📊 [RESULTS] Component mounting/rendering");
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
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Class Results Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">82%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Class average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primary)]">95%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Students completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-warning)]">98%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Highest score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Failed Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-destructive)]">3</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { test: 'Mathematics Quiz 1', avg: 85, students: 28 },
                { test: 'Physics Mid-term', avg: 78, students: 25 },
                { test: 'Chemistry Lab Test', avg: 92, students: 30 }
              ].map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                  <div>
                    <div className="text-sm font-medium">{result.test}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">{result.students} students</div>
                  </div>
                  <Badge variant={result.avg >= 80 ? 'success' : 'warning'}>
                    {result.avg}% avg
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { grade: 'A (90-100%)', count: 12, percentage: 35 },
                { grade: 'B (80-89%)', count: 15, percentage: 44 },
                { grade: 'C (70-79%)', count: 5, percentage: 15 },
                { grade: 'D (60-69%)', count: 2, percentage: 6 }
              ].map((dist, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{dist.grade}</span>
                    <span>{dist.count} students</span>
                  </div>
                  <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                    <div 
                      className="bg-[var(--color-primary)] h-2 rounded-full" 
                      style={{ width: `${dist.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentView = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">My Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">85%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Above class average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tests Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primary)]">12</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-warning)]">98%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Chemistry Lab</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-purple-500)]">+12%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { test: 'Mathematics Quiz 1', score: 88, date: '2 days ago', status: 'Excellent' },
                { test: 'Physics Mid-term', score: 82, date: '1 week ago', status: 'Good' },
                { test: 'Chemistry Lab Test', score: 98, date: '2 weeks ago', status: 'Outstanding' },
                { test: 'History Essay', score: 75, date: '3 weeks ago', status: 'Satisfactory' }
              ].map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                  <div>
                    <div className="text-sm font-medium">{result.test}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">{result.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{result.score}%</div>
                    <Badge variant={result.score >= 90 ? 'success' : result.score >= 80 ? 'info' : 'warning'} className="text-xs">
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', score: 88, trend: '+5%' },
                { subject: 'Physics', score: 82, trend: '+2%' },
                { subject: 'Chemistry', score: 92, trend: '+8%' },
                { subject: 'History', score: 78, trend: '-3%' }
              ].map((perf, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="text-sm">{perf.subject}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{perf.score}%</span>
                    <span className={`text-xs ${perf.trend.startsWith('+') ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]'}`}>
                      {perf.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-[var(--color-muted-foreground)] mb-4">
            Your progress over the last 6 tests
          </div>
          <div className="flex items-end space-x-4 h-32">
            {[75, 82, 78, 85, 90, 88].map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[var(--color-primary)] rounded-t-sm"
                  style={{ height: `${(score / 100) * 100}%` }}
                ></div>
                <div className="text-xs mt-2">{score}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return user.role === 'TEACHER' ? renderTeacherView() : renderStudentView();
}