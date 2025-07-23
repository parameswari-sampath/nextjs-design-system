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
import { FaEye, FaEdit, FaTrash, FaClone, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Alert from '@/components/ui/alert';

interface Assessment {
  id: string;
  title: string;
  access_type: 'PRIVATE' | 'PUBLIC';
  is_published: boolean;
  is_active: boolean;
  total_questions: number;
}

interface AssessmentDetails {
  id: string;
  title: string;
  description: string;
  assessment_type: 'TEST' | 'QUIZ' | 'EXAM';
  access_type: 'PRIVATE' | 'PUBLIC';
  access_code: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results_immediately: boolean;
  allow_retake: boolean;
  max_attempts: number;
  is_published: boolean;
  is_active: boolean;
  created_by: string;
  total_questions: number;
  total_marks: number;
  created_at: string;
  updated_at: string;
}

interface AssessmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
}

export default function AllTestsPage() {
  const router = useRouter();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Data state
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingAssessmentId, setDeletingAssessmentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState<AssessmentDetails | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  
  // Toast notifications state
  const [alerts, setAlerts] = useState<Array<{
    id: number, 
    variant: "info" | "success" | "warning" | "destructive", 
    message: string
  }>>([]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Toast functions
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

  // Fetch assessments from API
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/?page=${currentPage}&page_size=${itemsPerPage}`;
      const response = await authenticatedFetch(url);
      
      if (response.ok) {
        const data: AssessmentsResponse = await response.json();
        setAssessments(data.results);
        setTotalItems(data.count);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch assessments:', errorData);
        showToast('destructive', 'Failed to fetch assessments. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      showToast('destructive', 'Failed to fetch assessments. Please check your connection.');
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
  const openDeleteModal = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAssessmentToDelete(null);
  };

  // Fetch assessment details
  const fetchAssessmentDetails = async (assessmentId: string) => {
    try {
      setLoadingDetailsId(assessmentId);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentId}/`;
      const response = await authenticatedFetch(url);
      
      if (response.ok) {
        const data: AssessmentDetails = await response.json();
        setAssessmentDetails(data);
        setShowViewModal(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch assessment details:', errorData);
        showToast('destructive', 'Failed to fetch assessment details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      showToast('destructive', 'Failed to fetch assessment details. Please check your connection.');
    } finally {
      setLoadingDetailsId(null);
    }
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setAssessmentDetails(null);
  };

  // Delete assessment function
  const deleteAssessment = async () => {
    if (!assessmentToDelete) return;

    try {
      setDeletingAssessmentId(assessmentToDelete.id);
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessmentToDelete.id}/`;
      const response = await authenticatedFetch(url, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Close modal first
        closeDeleteModal();
        
        // Show success toast
        showToast('success', 'Assessment deleted successfully');
        
        // Check if current page will become empty after deletion
        const remainingAssessmentsOnPage = assessments.length - 1;
        
        if (remainingAssessmentsOnPage === 0 && currentPage > 1) {
          // If current page becomes empty and it's not the first page, go to previous page
          setCurrentPage(prev => prev - 1);
          // The useEffect will trigger fetchAssessments when currentPage changes
        } else {
          // For all other cases, just refetch to get fresh data
          fetchAssessments();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete assessment:', errorData);
        showToast('destructive', 'Failed to delete assessment. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      showToast('destructive', 'Failed to delete assessment. Please check your connection.');
    } finally {
      setDeletingAssessmentId(null);
    }
  };

  // Toggle publish status
  const togglePublishStatus = async (assessment: Assessment) => {
    try {
      setPublishingId(assessment.id);
      
      const action = assessment.is_published ? 'unpublish' : 'publish';
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assessments/${assessment.id}/${action}/`;
      const response = await authenticatedFetch(url, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the assessment in the local state
        setAssessments(prev => 
          prev.map(a => 
            a.id === assessment.id 
              ? { ...a, is_published: !a.is_published }
              : a
          )
        );
        
        // Show success toast
        showToast('success', data.message || `Assessment ${action}ed successfully`);
      } else {
        const errorData = await response.json();
        
        // Extract error message from response and show error toast
        const errorMsg = errorData.error || `Failed to ${action} assessment. Please try again.`;
        showToast('destructive', errorMsg);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      showToast('destructive', 'Failed to update assessment status. Please check your connection.');
    } finally {
      setPublishingId(null);
    }
  };

  // Load assessments when component mounts or pagination changes
  useEffect(() => {
    console.log("📝 All Tests page mounted/updated", { currentPage, itemsPerPage });
    fetchAssessments();
  }, [currentPage, itemsPerPage]);

  // Debug: Log when page component mounts
  useEffect(() => {
    console.log("📝 All Tests page component mounted");
  }, []);

  const getAccessTypeBadge = (accessType: string) => {
    return accessType === 'PUBLIC' ? 
      <Badge variant="success">Public</Badge> : 
      <Badge variant="secondary">Private</Badge>;
  };

  const getPublishStatusBadge = (isPublished: boolean) => {
    return isPublished ? 
      <Badge variant="success">Published</Badge> : 
      <Badge variant="warning">Draft</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="success">Active</Badge> : 
      <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">All Tests</h1>
        <Button 
          variant="primary"
          onClick={() => router.push('/test/create')}
        >
          Create Test
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

        {/* Assessments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-0 w-full">Title</TableHead>
              <TableHead className="w-[100px]">Access</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Questions</TableHead>
              <TableHead className="text-right w-[180px]">Actions</TableHead>
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
                  <TableCell className="w-[100px]">
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell className="text-right w-[180px]">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[var(--color-muted-foreground)]">
                  No assessments found.
                </TableCell>
              </TableRow>
            ) : (
              assessments.map((assessment: Assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium max-w-0 w-full truncate" title={assessment.title}>
                    {assessment.title}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {getAccessTypeBadge(assessment.access_type)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {getPublishStatusBadge(assessment.is_published)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      {assessment.total_questions}
                    </span>
                  </TableCell>
                  <TableCell className="text-right w-[180px]">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        variant="accent"
                        size="sm"
                        aria-label="View assessment"
                        onClick={() => fetchAssessmentDetails(assessment.id)}
                        disabled={loadingDetailsId === assessment.id}
                      >
                        {loadingDetailsId === assessment.id ? (
                          <Spinner size="xs" color="primary" />
                        ) : (
                          <FaEye />
                        )}
                      </IconButton>
                      <IconButton
                        variant="warning"
                        size="sm"
                        aria-label="Edit assessment"
                        onClick={() => router.push(`/test/edit/${assessment.id}`)}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        variant={assessment.is_published ? "secondary" : "success"}
                        size="sm"
                        aria-label={assessment.is_published ? "Unpublish assessment" : "Publish assessment"}
                        onClick={() => togglePublishStatus(assessment)}
                        disabled={publishingId === assessment.id}
                      >
                        {publishingId === assessment.id ? (
                          <Spinner size="xs" color="primary" />
                        ) : assessment.is_published ? (
                          <FaToggleOff />
                        ) : (
                          <FaToggleOn />
                        )}
                      </IconButton>
                      <IconButton
                        variant="info"
                        size="sm"
                        aria-label="Clone assessment"
                        onClick={() => console.log('Clone assessment:', assessment.id)}
                      >
                        <FaClone />
                      </IconButton>
                      <IconButton
                        variant="destructive"
                        size="sm"
                        aria-label="Delete assessment"
                        onClick={() => openDeleteModal(assessment)}
                        disabled={deletingAssessmentId === assessment.id}
                      >
                        {deletingAssessmentId === assessment.id ? (
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
            Showing {assessments.length} of {totalItems} assessments
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
          <ModalTitle>Delete Assessment</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalDescription>
            Are you sure you want to delete this assessment? This action cannot be undone.
          </ModalDescription>
          {assessmentToDelete && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <p className="text-sm text-[var(--foreground)] line-clamp-5 leading-relaxed">
                  {assessmentToDelete.title}
                </p>
                {assessmentToDelete.title.length > 100 ? (
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
            disabled={deletingAssessmentId !== null}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={deleteAssessment}
            disabled={deletingAssessmentId !== null}
          >
            {deletingAssessmentId !== null && (
              <Spinner size="xs" color="white" className="mr-2" />
            )}
            Delete Assessment
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Assessment Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={closeViewModal}
        size="xl"
      >
        <ModalHeader>
          <ModalTitle>Assessment Details</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {assessmentDetails && (
            <div className="space-y-6">
              {/* Assessment Info Section */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Assessment Information</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {getAccessTypeBadge(assessmentDetails.access_type)}
                    {getPublishStatusBadge(assessmentDetails.is_published)}
                    {getStatusBadge(assessmentDetails.is_active)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">{assessmentDetails.title}</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{assessmentDetails.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Type:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.assessment_type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Duration:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.duration_minutes} minutes</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Questions:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.total_questions}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Total Marks:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.total_marks}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Max Attempts:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.max_attempts}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--foreground)]">Access Code:</span>
                      <p className="text-[var(--color-muted-foreground)]">{assessmentDetails.access_code || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                    <span className="text-sm text-[var(--foreground)]">Shuffle Questions</span>
                    <Badge variant={assessmentDetails.shuffle_questions ? "success" : "secondary"}>
                      {assessmentDetails.shuffle_questions ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                    <span className="text-sm text-[var(--foreground)]">Shuffle Options</span>
                    <Badge variant={assessmentDetails.shuffle_options ? "success" : "secondary"}>
                      {assessmentDetails.shuffle_options ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                    <span className="text-sm text-[var(--foreground)]">Show Results Immediately</span>
                    <Badge variant={assessmentDetails.show_results_immediately ? "success" : "secondary"}>
                      {assessmentDetails.show_results_immediately ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                    <span className="text-sm text-[var(--foreground)]">Allow Retake</span>
                    <Badge variant={assessmentDetails.allow_retake ? "success" : "secondary"}>
                      {assessmentDetails.allow_retake ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div>
                <h4 className="text-md font-medium text-[var(--foreground)] mb-2">Created Information</h4>
                <div className="text-sm text-[var(--color-muted-foreground)] space-y-1">
                  <p><strong>Created by:</strong> {assessmentDetails.created_by}</p>
                  <p><strong>Created at:</strong> {new Date(assessmentDetails.created_at).toLocaleString()}</p>
                  <p><strong>Last updated:</strong> {new Date(assessmentDetails.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeViewModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

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