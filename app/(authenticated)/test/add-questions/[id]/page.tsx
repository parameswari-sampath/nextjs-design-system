"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import Badge from '@/components/ui/badge';
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import Pagination, {
  PaginationInfo,
} from '@/components/ui/pagination';
import Skeleton from '@/components/ui/skeleton';
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import Spinner from '@/components/ui/spinner';
import Alert from '@/components/ui/alert';
import { authenticatedFetch } from '@/lib/auth';
import {
  FaPlus,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD';
  subject: string;
  tags: string;
  is_active: boolean;
  created_by: string;
}

interface AssessmentQuestion {
  id: string;
  question_id: string;
  question?: Question;
  order: number;
  marks: number;
  is_required: boolean;
}

interface QuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

interface RemainingQuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
  assessment_info: {
    id: string;
    title: string;
    total_questions_in_assessment: number;
  };
}

export default function AddQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;

  // Pagination state (API has fixed page size of 10)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed by API

  // Data state
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assessmentLoading, setAssessmentLoading] = useState(true);
  const [addingQuestionId, setAddingQuestionId] = useState<string | null>(null);
  const [removingQuestionId, setRemovingQuestionId] = useState<string | null>(null);

  // Toast notifications state
  const [alerts, setAlerts] = useState<
    Array<{
      id: number;
      variant: "info" | "success" | "warning" | "destructive";
      message: string;
    }>
  >([]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Toast functions
  const showToast = (
    variant: "info" | "success" | "warning" | "destructive",
    message: string
  ) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, variant, message }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Fetch available questions from API (only remaining questions for this assessment)
  const fetchAvailableQuestions = async () => {
    try {
      setLoading(true);

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentId}/remaining-questions/?page=${currentPage}`;
      const response = await authenticatedFetch(url);

      if (response.ok) {
        const data: RemainingQuestionsResponse = await response.json();
        setAvailableQuestions(data.results);
        setTotalItems(data.count);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch remaining questions:", errorData);
        showToast(
          "destructive",
          "Failed to fetch available questions. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching remaining questions:", error);
      showToast(
        "destructive",
        "Failed to fetch available questions. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch assessment questions
  const fetchAssessmentQuestions = async () => {
    try {
      setAssessmentLoading(true);

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentId}/`;
      const response = await authenticatedFetch(url);

      if (response.ok) {
        const data = await response.json();
        // Get assessment questions from the full assessment details
        if (data.assessment_questions && Array.isArray(data.assessment_questions)) {
          setAssessmentQuestions(data.assessment_questions);
        } else {
          setAssessmentQuestions([]);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch assessment questions:", errorData);
        setAssessmentQuestions([]);
        showToast(
          "destructive",
          "Failed to fetch assessment questions. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching assessment questions:", error);
      setAssessmentQuestions([]);
      showToast(
        "destructive",
        "Failed to fetch assessment questions. Please check your connection."
      );
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Add question to assessment
  const addQuestionToAssessment = async (questionId: string) => {
    try {
      setAddingQuestionId(questionId);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentId}/questions/`;
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: questionId,
          order: assessmentQuestions.length + 1,
          marks: 5,
          is_required: true
        })
      });

      if (response.ok) {
        showToast("success", "Question added to assessment successfully!");
        fetchAssessmentQuestions(); // Refresh assessment questions
        fetchAvailableQuestions(); // Refresh available questions to remove the added one
      } else {
        const errorData = await response.json();
        console.error("Failed to add question:", errorData);
        showToast("destructive", "Failed to add question. Please try again.");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      showToast("destructive", "Failed to add question. Please check your connection.");
    } finally {
      setAddingQuestionId(null);
    }
  };

  // Remove question from assessment
  const removeQuestionFromAssessment = async (assessmentQuestionId: string) => {
    try {
      setRemovingQuestionId(assessmentQuestionId);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentId}/questions/${assessmentQuestionId}/`;
      const response = await authenticatedFetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast("success", "Question removed from assessment successfully!");
        fetchAssessmentQuestions(); // Refresh assessment questions
        fetchAvailableQuestions(); // Refresh available questions to show the removed one
      } else {
        const errorData = await response.json();
        console.error("Failed to remove question:", errorData);
        showToast("destructive", "Failed to remove question. Please try again.");
      }
    } catch (error) {
      console.error("Error removing question:", error);
      showToast("destructive", "Failed to remove question. Please check your connection.");
    } finally {
      setRemovingQuestionId(null);
    }
  };

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Load questions when component mounts or pagination changes
  useEffect(() => {
    fetchAvailableQuestions();
  }, [currentPage, assessmentId]);

  useEffect(() => {
    fetchAssessmentQuestions();
  }, [assessmentId]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return <Badge variant="success">Easy</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      case 'HARD':
        return <Badge variant="destructive">Hard</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const isQuestionAdded = (questionId: string) => {
    return assessmentQuestions.some(aq => aq.question_id === questionId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add Questions to Assessment
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Select questions to add to your assessment
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/test/all-tests')}
          >
            Skip & Finish
          </Button>
          <Button 
            variant="primary" 
            onClick={() => router.push('/test/all-tests')}
            disabled={assessmentQuestions.length === 0}
          >
            Finish Assessment
          </Button>
        </div>
      </div>

      {/* Assessment Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Selected Questions ({assessmentQuestions.length})
          </h2>
        </div>

        {assessmentLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : assessmentQuestions.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-muted-foreground)] border border-dashed border-[var(--color-border)] rounded-[var(--radius)]">
            No questions selected yet. Add questions from the list below.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead className="max-w-0 w-full">Question</TableHead>
                <TableHead className="w-[100px]">Difficulty</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessmentQuestions.map((aq) => (
                <TableRow key={aq.id}>
                  <TableCell className="w-[50px]">
                    {aq.order}
                  </TableCell>
                  <TableCell className="font-medium max-w-0 w-full truncate" title={aq.question?.question || 'Question text not available'}>
                    {aq.question?.question || 'Question text not available'}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {aq.question ? getDifficultyBadge(aq.question.difficulty_level) : <span className="text-sm text-[var(--color-muted-foreground)]">-</span>}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        variant="destructive"
                        size="sm"
                        aria-label="Remove question"
                        onClick={() => removeQuestionFromAssessment(aq.id)}
                        disabled={removingQuestionId === aq.id}
                      >
                        {removingQuestionId === aq.id ? (
                          <Spinner size="xs" color="destructive" />
                        ) : (
                          <FaTrash />
                        )}
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Available Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Available Questions
          </h2>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
          <div className="text-sm text-[var(--color-muted-foreground)]">
            10 questions per page
          </div>
        </div>

        {/* Questions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-0 w-full">Question</TableHead>
              <TableHead className="w-[100px]">Difficulty</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-0 w-full">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : availableQuestions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-[var(--color-muted-foreground)]"
                >
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              availableQuestions.map((question: Question) => (
                <TableRow key={question.id}>
                  <TableCell
                    className="font-medium max-w-0 w-full truncate"
                    title={question.question}
                  >
                    {question.question}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {getDifficultyBadge(question.difficulty_level)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {isQuestionAdded(question.id) ? (
                      <Badge variant="success">Added</Badge>
                    ) : (
                      <Badge variant="secondary">Available</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        variant={isQuestionAdded(question.id) ? "secondary" : "accent"}
                        size="sm"
                        aria-label={isQuestionAdded(question.id) ? "Question already added" : "Add question"}
                        onClick={() => addQuestionToAssessment(question.id)}
                        disabled={isQuestionAdded(question.id) || addingQuestionId === question.id}
                      >
                        {addingQuestionId === question.id ? (
                          <Spinner size="xs" color="primary" />
                        ) : (
                          <FaPlus />
                        )}
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption>
            Showing {availableQuestions.length} of {totalItems} questions
          </TableCaption>
        </Table>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div className="text-sm text-[var(--color-muted-foreground)]">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxVisiblePages={5}
              size="md"
            />
          </div>
        )}
      </div>

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