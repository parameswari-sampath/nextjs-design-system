"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import Badge from '@/components/ui/badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import Pagination, { PaginationInfo, ItemsPerPage } from '@/components/ui/pagination';
import Skeleton from '@/components/ui/skeleton';
import { authenticatedFetch } from '@/lib/auth';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Question {
  id: string;
  question: string;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD';
  is_active: boolean;
}

interface QuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

export default function QuestionBankPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Data state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load questions when component mounts or pagination changes
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, itemsPerPage]);


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
        <Button variant="primary">Create Question</Button>
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
                      >
                        <FaEye />
                      </IconButton>
                      <IconButton
                        variant="warning"
                        size="sm"
                        aria-label="Edit question"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        variant="destructive"
                        size="sm"
                        aria-label="Delete question"
                      >
                        <FaTrash />
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
    </div>
  );
}