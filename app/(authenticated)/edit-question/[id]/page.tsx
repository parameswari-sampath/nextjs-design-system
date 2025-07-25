"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Alert from '@/components/ui/alert';
import Skeleton from '@/components/ui/skeleton';
import Checkbox from '@/components/ui/checkbox';
import { authenticatedFetch } from '@/lib/auth';

interface FormData {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_question: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
  explanation_d: string;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD';
  subject: string;
  tags: string;
  is_active: boolean;
}

const initialFormData: FormData = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: '',
  explanation_question: '',
  explanation_a: '',
  explanation_b: '',
  explanation_c: '',
  explanation_d: '',
  difficulty_level: 'EASY',
  subject: '',
  tags: '',
  is_active: true
};

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    question: false,
    option_a: false,
    option_b: false,
    option_c: false,
    option_d: false,
    correct_option: false,
    explanation_question: false,
    explanation_a: false,
    explanation_b: false,
    explanation_c: false,
    explanation_d: false,
    difficulty_level: false,
    subject: false,
    tags: false
  });
  const [alerts, setAlerts] = useState<Array<{
    id: number, 
    variant: "info" | "success" | "warning" | "destructive", 
    message: string
  }>>([]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing/selecting
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      question: !formData.question.trim(),
      option_a: !formData.option_a.trim(),
      option_b: !formData.option_b.trim(),
      option_c: !formData.option_c.trim(),
      option_d: !formData.option_d.trim(),
      correct_option: !formData.correct_option,
      explanation_question: !formData.explanation_question.trim(),
      explanation_a: !formData.explanation_a.trim(),
      explanation_b: !formData.explanation_b.trim(),
      explanation_c: !formData.explanation_c.trim(),
      explanation_d: !formData.explanation_d.trim(),
      difficulty_level: !formData.difficulty_level,
      subject: !formData.subject.trim(),
      tags: !formData.tags.trim()
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const showToast = (variant: "info" | "success" | "warning" | "destructive", message: string) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, variant, message }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 3000);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Fetch question data
  const fetchQuestionData = async () => {
    try {
      setPageLoading(true);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${questionId}/`;
      const response = await authenticatedFetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setFormData({
          question: data.question,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          correct_option: data.correct_option,
          explanation_question: data.explanation_question,
          explanation_a: data.explanation_a,
          explanation_b: data.explanation_b,
          explanation_c: data.explanation_c,
          explanation_d: data.explanation_d,
          difficulty_level: data.difficulty_level,
          subject: data.subject,
          tags: data.tags,
          is_active: data.is_active
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch question:', errorData);
        showToast("destructive", "Failed to load question. Please try again.");
        router.push('/question-bank');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      showToast("destructive", "Failed to load question. Please check your connection.");
      router.push('/question-bank');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("destructive", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${questionId}/`;
      const response = await authenticatedFetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast("success", "Question updated successfully!");
        // Navigate back to question bank after success
        setTimeout(() => {
          router.push('/question-bank');
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Failed to update question:', errorData);
        showToast("destructive", "Failed to update question. Please try again.");
      }
    } catch (error) {
      console.error('Error updating question:', error);
      showToast("destructive", "Failed to update question. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'EASY', label: 'Easy' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HARD', label: 'Hard' }
  ];

  const correctOptionOptions = [
    { value: 'A', label: 'Option A' },
    { value: 'B', label: 'Option B' },
    { value: 'C', label: 'Option C' },
    { value: 'D', label: 'Option D' }
  ];

  useEffect(() => {
    if (questionId) {
      fetchQuestionData();
    }
  }, [questionId]);

  if (pageLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Question</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Update question details and options
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Section */}
        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Question <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Textarea
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="Enter your question here..."
                rows={4}
                error={errors.question}
                errorMessage="Question is required"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Question Explanation <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Textarea
                value={formData.explanation_question}
                onChange={(e) => handleInputChange('explanation_question', e.target.value)}
                placeholder="Provide context or explanation for the question..."
                rows={3}
                error={errors.explanation_question}
                errorMessage="Question explanation is required"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Subject <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="e.g., Mathematics, Science"
                  error={errors.subject}
                  errorMessage="Subject is required"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Difficulty <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Select
                  value={formData.difficulty_level}
                  onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                  error={errors.difficulty_level}
                  errorMessage="Please select difficulty level"
                >
                  <option value="">Select difficulty</option>
                  {difficultyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Correct Answer <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Select
                  value={formData.correct_option}
                  onChange={(e) => handleInputChange('correct_option', e.target.value)}
                  error={errors.correct_option}
                  errorMessage="Please select the correct answer"
                >
                  <option value="">Select correct option</option>
                  {correctOptionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Tags <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., algebra, equations, problem-solving (comma separated)"
                error={errors.tags}
                errorMessage="Tags are required"
              />
            </div>

            <div>
              <Checkbox
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                label="Active Question"
              />
            </div>
          </CardContent>
        </Card>

        {/* Options Section */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['A', 'B', 'C', 'D'].map((option) => (
              <div key={option} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Option {option} <span className="text-[var(--color-destructive)]">*</span>
                  </label>
                  {formData.correct_option === option && (
                    <Badge variant="success" className="text-xs">Correct Answer</Badge>
                  )}
                </div>
                <Textarea
                  value={String(formData[`option_${option.toLowerCase()}` as keyof FormData] || '')}
                  onChange={(e) => handleInputChange(`option_${option.toLowerCase()}` as keyof FormData, e.target.value)}
                  placeholder={`Enter option ${option}...`}
                  rows={2}
                  error={errors[`option_${option.toLowerCase()}` as keyof typeof errors]}
                  errorMessage={`Option ${option} is required`}
                />
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Explanation for Option {option} <span className="text-[var(--color-destructive)]">*</span>
                  </label>
                  <Textarea
                    value={String(formData[`explanation_${option.toLowerCase()}` as keyof FormData] || '')}
                    onChange={(e) => handleInputChange(`explanation_${option.toLowerCase()}` as keyof FormData, e.target.value)}
                    placeholder="Self Explanation"
                    rows={2}
                    error={errors[`explanation_${option.toLowerCase()}` as keyof typeof errors]}
                    errorMessage={`Explanation for option ${option} is required`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/question-bank')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Question'}
          </Button>
        </div>
      </form>

      {/* Toast Alerts - Bottom Right Stack */}
      {alerts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {alerts.map((alert, index) => (
            <Alert 
              key={alert.id}
              variant={alert.variant}
              className="min-w-[300px] max-w-[400px] shadow-lg animate-in slide-in-from-right-full duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{alert.message}</span>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="ml-2 text-current opacity-70 hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}