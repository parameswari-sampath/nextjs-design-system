"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Toggle from '@/components/ui/toggle';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Alert from '@/components/ui/alert';
import { authenticatedFetch } from '@/lib/auth';

interface FormData {
  title: string;
  description: string;
  assessment_type: 'TEST' | 'QUIZ' | 'EXAM';
  access_type: 'PRIVATE' | 'PUBLIC';
  duration_minutes: number;
  start_time: string;
  end_time: string;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  allow_retake: boolean;
  max_attempts: number;
  is_active: boolean;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  assessment_type: 'TEST',
  access_type: 'PRIVATE',
  duration_minutes: 60,
  start_time: '',
  end_time: '',
  shuffle_questions: false,
  shuffle_options: false,
  show_results_immediately: false,
  allow_retake: false,
  max_attempts: 1,
  is_active: true
};

export default function CreateTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    assessment_type: false,
    access_type: false,
    duration_minutes: false,
    start_time: false,
    end_time: false,
    max_attempts: false
  });
  const [alerts, setAlerts] = useState<Array<{
    id: number, 
    variant: "info" | "success" | "warning" | "destructive", 
    message: string
  }>>([]);

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
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
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      assessment_type: !formData.assessment_type,
      access_type: !formData.access_type,
      duration_minutes: formData.duration_minutes <= 0,
      start_time: !formData.start_time,
      end_time: !formData.end_time,
      max_attempts: formData.max_attempts <= 0
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("destructive", "Please fill in all required fields.");
      return;
    }

    // Validate that end time is after start time
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      showToast("destructive", "End time must be after start time.");
      return;
    }

    try {
      setLoading(true);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/`;
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        const accessCodeMsg = data.access_code ? ` Access code: ${data.access_code}` : '';
        showToast("success", `Assessment created successfully!${accessCodeMsg}`);
        
        // Navigate to the assessments list after a short delay
        setTimeout(() => {
          router.push('/test/all-tests');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Failed to create assessment:', errorData);
        showToast("destructive", "Failed to create assessment. Please try again.");
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      showToast("destructive", "Failed to create assessment. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const assessmentTypeOptions = [
    { value: 'TEST', label: 'Test' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'EXAM', label: 'Exam' }
  ];

  const accessTypeOptions = [
    { value: 'PRIVATE', label: 'Private (Auto-generated Access Code)' },
    { value: 'PUBLIC', label: 'Public (No Access Code)' }
  ];

  // Get current date in YYYY-MM-DDTHH:MM format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Create New Assessment</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Create a new assessment for your students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Assessment Title <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Mathematics Final Exam"
                error={errors.title}
                errorMessage="Title is required"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Description <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of the assessment..."
                rows={4}
                error={errors.description}
                errorMessage="Description is required"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Assessment Type <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Select
                  value={formData.assessment_type}
                  onChange={(e) => handleInputChange('assessment_type', e.target.value)}
                  error={errors.assessment_type}
                  errorMessage="Please select assessment type"
                >
                  {assessmentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Duration (minutes) <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                  placeholder="60"
                  min="1"
                  error={errors.duration_minutes}
                  errorMessage="Duration must be greater than 0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Access Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Access Type <span className="text-[var(--color-destructive)]">*</span>
              </label>
              <Select
                value={formData.access_type}
                onChange={(e) => handleInputChange('access_type', e.target.value)}
                error={errors.access_type}
                errorMessage="Please select access type"
              >
                {accessTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {formData.access_type === 'PRIVATE' && (
              <div className="p-3 bg-[var(--color-secondary)] rounded-[var(--radius)] border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  <strong>Note:</strong> A unique 8-character access code will be automatically generated for this private assessment.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Start Time <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  min={getCurrentDateTime()}
                  error={errors.start_time}
                  errorMessage="Start time is required"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  End Time <span className="text-[var(--color-destructive)]">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  min={formData.start_time || getCurrentDateTime()}
                  error={errors.end_time}
                  errorMessage="End time is required"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Behavior Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Toggle
                  label="Shuffle Questions"
                  checked={formData.shuffle_questions}
                  onChange={(checked) => handleInputChange('shuffle_questions', checked)}
                />

                <Toggle
                  label="Shuffle Options"
                  checked={formData.shuffle_options}
                  onChange={(checked) => handleInputChange('shuffle_options', checked)}
                />

                <Toggle
                  label="Show Results Immediately"
                  checked={formData.show_results_immediately}
                  onChange={(checked) => handleInputChange('show_results_immediately', checked)}
                />
              </div>

              <div className="space-y-4">
                <Toggle
                  label="Allow Retake"
                  checked={formData.allow_retake}
                  onChange={(checked) => handleInputChange('allow_retake', checked)}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Maximum Attempts <span className="text-[var(--color-destructive)]">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.max_attempts}
                    onChange={(e) => handleInputChange('max_attempts', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                    max="10"
                    error={errors.max_attempts}
                    errorMessage="Max attempts must be at least 1"
                  />
                </div>

                <Toggle
                  label="Active"
                  checked={formData.is_active}
                  onChange={(checked) => handleInputChange('is_active', checked)}
                />
              </div>
            </div>
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
            {loading ? 'Creating...' : 'Create Assessment'}
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