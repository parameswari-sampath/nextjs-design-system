"use client";

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-primary)]">142</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tests Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">28</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-warning)]">78%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">+5% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-purple-500)]">92%</div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Very good</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mathematics Quiz 1</span>
                <span className="text-sm font-medium">85% avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Physics Mid-term</span>
                <span className="text-sm font-medium">78% avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chemistry Lab Test</span>
                <span className="text-sm font-medium">92% avg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mathematics</span>
                <span className="text-sm font-medium">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Physics</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chemistry</span>
                <span className="text-sm font-medium">40%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}