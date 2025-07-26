"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import Badge from '@/components/ui/badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import Pagination, { PaginationInfo, ItemsPerPage } from '@/components/ui/pagination';
import Skeleton from '@/components/ui/skeleton';
import Modal, { ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';
import Spinner from '@/components/ui/spinner';
import { authenticatedFetch } from '@/lib/auth';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Question {
  id: string;
  question: string;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD';
  is_active: boolean;
}

interface QuestionDetails {
  id: string;
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
  tags_list: string[];
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanations: {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
  };
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface QuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

export default function QuestionBankPage() {
  console.log("🗂️ [QUESTION BANK] Component mounting/rendering");
  const router = useRouter();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Data state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [questionDetails, setQuestionDetails] = useState<QuestionDetails | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/?page=${currentPage}&page_size=${itemsPerPage}`;
      const response = await authenticatedFetch(url);
      
      if (response.ok) {
        const data: QuestionsResponse = await response.json();
        setQuestions(data.results);
        setTotalItems(data.count);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch questions:', errorData);
        setError('Failed to fetch questions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Open delete confirmation modal
  const openDeleteModal = (question: Question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  // Fetch question details
  const fetchQuestionDetails = async (questionId: string) => {
    try {
      setLoadingDetailsId(questionId);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${questionId}/`;
      const response = await authenticatedFetch(url);
      
      if (response.ok) {
        const data: QuestionDetails = await response.json();
        setQuestionDetails(data);
        setShowViewModal(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch question details:', errorData);
        setError('Failed to fetch question details. Please try again.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
      setError('Failed to fetch question details. Please check your connection.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoadingDetailsId(null);
    }
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setQuestionDetails(null);
  };

  // Delete question function
  const deleteQuestion = async () => {
    if (!questionToDelete) return;

    try {
      setDeletingQuestionId(questionToDelete.id);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${questionToDelete.id}/`;
      const response = await authenticatedFetch(url, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Close modal first
        closeDeleteModal();
        
        // Check if current page will become empty after deletion
        const remainingQuestionsOnPage = questions.length - 1;
        
        if (remainingQuestionsOnPage === 0 && currentPage > 1) {
          // If current page becomes empty and it's not the first page, go to previous page
          setCurrentPage(prev => prev - 1);
          // The useEffect will trigger fetchQuestions when currentPage changes
        } else {
          // For all other cases, just refetch to get fresh data
          fetchQuestions();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete question:', errorData);
        setError('Failed to delete question. Please try again.');
        
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete question. Please check your connection.');
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeletingQuestionId(null);
    }
  };

  // Load questions when component mounts or pagination changes
  useEffect(() => {
    console.log("🗂️ Question Bank page mounted/updated", { currentPage, itemsPerPage });
    fetchQuestions();
  }, [currentPage, itemsPerPage]);

  // Debug: Log when page component mounts
  useEffect(() => {
    console.log("🗂️ Question Bank page component mounted");
  }, []);

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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="success">Active</Badge> : 
      <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Question Bank</h1>
        <Button 
          variant="primary"
          onClick={() => router.push('/create-question')}
        >
          Create Question
        </Button>
      </div>

      <div className="space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PaginationInfo 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-muted-foreground)]">Items per page:</span>
            <ItemsPerPage
              value={itemsPerPage}
              options={[5, 10, 20, 50]}
              onValueChange={handleItemsPerPageChange}
            />
          </div>
        </div>

        {/* Questions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-0 w-full">Question</TableHead>
              <TableHead className="w-[120px]">Difficulty</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[140px]">Actions</TableHead>
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
                  <TableCell className="w-[120px]">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="text-right w-[140px]">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[var(--color-destructive)]">
                  {error}
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[var(--color-muted-foreground)]">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question: Question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-0 w-full truncate" title={question.question}>
                    {question.question}
                  </TableCell>
                  <TableCell className="w-[120px]">
                    {getDifficultyBadge(question.difficulty_level)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {getStatusBadge(question.is_active)}
                  </TableCell>
                  <TableCell className="text-right w-[140px]">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        variant="accent"
                        size="sm"
                        aria-label="View question"
                        onClick={() => fetchQuestionDetails(question.id)}
                        disabled={loadingDetailsId === question.id}
                      >
                        {loadingDetailsId === question.id ? (
                          <Spinner size="xs" color="primary" />
                        ) : (
                          <FaEye />
                        )}
                      </IconButton>
                      <IconButton
                        variant="warning"
                        size="sm"
                        aria-label="Edit question"
                        onClick={() => router.push(`/edit-question/${question.id}`)}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        variant="destructive"
                        size="sm"
                        aria-label="Delete question"
                        onClick={() => openDeleteModal(question)}
                        disabled={deletingQuestionId === question.id}
                      >
                        {deletingQuestionId === question.id ? (
                          <Spinner size="xs" color="destructive" />
                        ) : (
                          <FaTrash />
                        )}
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption>
            Showing {questions.length} of {totalItems} questions
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        size="sm"
      >
        <ModalHeader>
          <ModalTitle>Delete Question</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalDescription>
            Are you sure you want to delete this question? This action cannot be undone.
          </ModalDescription>
          {questionToDelete && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <p className="text-sm text-[var(--foreground)] line-clamp-5 leading-relaxed">
                  {questionToDelete.question}
                </p>
                {questionToDelete.question.split('\n').length > 5 || questionToDelete.question.length > 200 ? (
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--color-card)] to-transparent pointer-events-none"></div>
                ) : null}
              </div>
              <div className="p-3 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-[var(--radius)]">
                <p className="text-sm text-[var(--color-destructive)]">
                  This action is permanent and cannot be reversed.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={closeDeleteModal}
            disabled={deletingQuestionId !== null}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={deleteQuestion}
            disabled={deletingQuestionId !== null}
          >
            {deletingQuestionId !== null && (
              <Spinner size="xs" color="white" className="mr-2" />
            )}
            Delete Question
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Question Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={closeViewModal}
        size="xl"
      >
        <ModalHeader>
          <ModalTitle>Question Details</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {questionDetails && (
            <div className="space-y-6">
              {/* Question Section */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Question</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--foreground)] font-medium underline">{questionDetails.subject}</span>
                    {getDifficultyBadge(questionDetails.difficulty_level)}
                    {getStatusBadge(questionDetails.is_active)}
                  </div>
                </div>
                <p className="text-[var(--foreground)] leading-relaxed mb-2">{questionDetails.question}</p>
                {questionDetails.explanation_question && (
                  <p className="text-sm text-[var(--color-muted-foreground)]">{questionDetails.explanation_question}</p>
                )}
              </div>

              {/* Options Section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(questionDetails.options).map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-[var(--radius)] border border-[var(--color-gray-200)] ${
                      questionDetails.correct_option === key 
                        ? 'bg-[var(--color-green-50)] border-[var(--color-green-200)]' 
                        : 'bg-[var(--color-secondary)]'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                          questionDetails.correct_option === key
                            ? 'bg-[var(--color-green-500)] text-white'
                            : 'bg-[var(--color-gray-500)] text-white'
                        }`}>
                          {key}
                        </span>
                        <div className="flex-1">
                          <p className="text-[var(--foreground)]">{value}</p>
                          {questionDetails.explanations[key as keyof typeof questionDetails.explanations] && (
                            <p className="mt-2 text-sm text-[var(--color-muted-foreground)] italic">
                              {questionDetails.explanations[key as keyof typeof questionDetails.explanations]}
                            </p>
                          )}
                        </div>
                        {questionDetails.correct_option === key && (
                          <Badge variant="success" className="ml-2">Correct</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>



              {/* Tags Section */}
              {questionDetails.tags_list && questionDetails.tags_list.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-[var(--foreground)] mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {questionDetails.tags_list.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}