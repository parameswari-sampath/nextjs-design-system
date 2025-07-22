"use client";

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function QuestionBankPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Question Bank</h1>
        <Button variant="primary">Create Question</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mathematics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              125 questions available
            </p>
            <Button variant="outline" className="w-full">
              View Questions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              98 questions available
            </p>
            <Button variant="outline" className="w-full">
              View Questions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chemistry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              87 questions available
            </p>
            <Button variant="outline" className="w-full">
              View Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}