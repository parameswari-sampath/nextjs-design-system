"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Alert from '@/components/ui/alert';
import { authenticatedFetch } from '@/lib/auth';
import { TOAST_DURATION, ANIMATION_DELAY, UI_SIZES } from '@/lib/constants';

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
}

const initialFormData: FormData = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: '',
  explanation_question: '',
  explanation_a: 'Self Explanation',
  explanation_b: 'Self Explanation',
  explanation_c: 'Self Explanation',
  explanation_d: 'Self Explanation',
  difficulty_level: 'EASY',
  subject: '',
  tags: ''
};

export default function CreateQuestionPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (field: keyof FormData, value: string) => {
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
    
    // Auto remove after configured duration
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, TOAST_DURATION);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
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
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/`;
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast("success", "Question created successfully!");
        setFormData(initialFormData);
        // Clear any existing errors
        setErrors({
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
      } else {
        const errorData = await response.json();
        console.error('Failed to create question:', errorData);
        showToast("destructive", "Failed to create question. Please try again.");
      }
    } catch (error) {
      console.error('Error creating question:', error);
      showToast("destructive", "Failed to create question. Please check your connection.");
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Create New Question</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Add a new question to your question bank
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
                  value={formData[`option_${option.toLowerCase()}` as keyof FormData]}
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
                    value={formData[`explanation_${option.toLowerCase()}` as keyof FormData]}
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
            onClick={() => setFormData(initialFormData)}
            disabled={loading}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Question'}
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
              className={`min-w-[${UI_SIZES.TOAST_MIN_WIDTH}px] max-w-[${UI_SIZES.TOAST_MAX_WIDTH}px] shadow-lg animate-in slide-in-from-right-full duration-300`}
              style={{ animationDelay: `${index * ANIMATION_DELAY.ITEM}ms` }}
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