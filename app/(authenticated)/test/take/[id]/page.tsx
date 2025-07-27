"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Progress from "@/components/ui/progress";
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

// Mock data for layout testing
const mockAssessment = {
  id: "test-id",
  title: "Mathematics Final Exam",
  description: "Comprehensive mathematics assessment covering algebra, geometry, and calculus",
  duration_minutes: 60,
  total_questions: 10,
  questions: [
    {
      id: "q1",
      question: "What is the derivative of x²?",
      options: { A: "2x", B: "x", C: "x²", D: "2x²" },
      order: 1,
      marks: 5,
    },
    {
      id: "q2", 
      question: "Solve for x: 2x + 5 = 13",
      options: { A: "3", B: "4", C: "5", D: "6" },
      order: 2,
      marks: 5,
    },
    {
      id: "q3",
      question: "What is the area of a circle with radius 5?",
      options: { A: "25π", B: "10π", C: "5π", D: "15π" },
      order: 3,
      marks: 5,
    },
    // Add more mock questions for testing
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `q${i + 4}`,
      question: `Sample question ${i + 4} for testing pagination and navigation?`,
      options: { 
        A: `Option A for question ${i + 4}`, 
        B: `Option B for question ${i + 4}`, 
        C: `Option C for question ${i + 4}`, 
        D: `Option D for question ${i + 4}` 
      },
      order: i + 4,
      marks: 5,
    }))
  ]
};

export default function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  // Test state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Prevent browser back button and navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your test progress will be lost and auto-submitted.";
      return e.returnValue;
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Push current state back to prevent navigation
      window.history.pushState(null, "", window.location.href);
      setShowSubmitModal(true); // Show submit confirmation instead
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Push initial state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / mockAssessment.total_questions) * 100;

  // Current question
  const currentQuestion = mockAssessment.questions[currentQuestionIndex];

  // Navigation handlers
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < mockAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Answer handling
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Flag question
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Submit handling
  const handleSubmit = (isAutoSubmit = false) => {
    // Remove navigation protection before submitting
    window.removeEventListener("beforeunload", () => {});
    
    // Mock submission - will add API call later
    console.log(isAutoSubmit ? "Auto-submitting answers:" : "Submitting answers:", answers);
    
    // In real implementation, make API call here
    // For now, simulate submission
    setTimeout(() => {
      // Replace current URL in history so user can't go back to test page
      router.replace("/test/results/mock-result-id");
    }, 1000);
  };

  const openSubmitModal = () => {
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
  };

  // Get question status for navigation
  const getQuestionStatus = (questionId: string, index: number) => {
    if (answers[questionId]) return "answered";
    if (flaggedQuestions.has(questionId)) return "flagged";
    if (index === currentQuestionIndex) return "current";
    return "unanswered";
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Header - Fixed */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Assessment Info */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                {mockAssessment.title}
              </h1>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Question {currentQuestionIndex + 1} of {mockAssessment.total_questions}
              </p>
            </div>
          </div>

          {/* Timer and Progress */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">Progress</div>
              <div className="flex items-center gap-2">
                <Progress value={progressPercentage} className="w-24" />
                <span className="text-sm font-medium">
                  {answeredCount}/{mockAssessment.total_questions}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-[var(--color-muted-foreground)]">Time Left</div>
              <div className={`flex items-center gap-2 text-lg font-mono font-bold ${
                timeLeft < 300 ? 'text-[var(--color-destructive)]' : 'text-[var(--foreground)]'
              }`}>
                <FaClock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 flex gap-6">
        {/* Question Panel */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <span>Question {currentQuestionIndex + 1}</span>
                <Badge variant="info">{currentQuestion.marks} marks</Badge>
              </CardTitle>
              <IconButton
                variant={flaggedQuestions.has(currentQuestion.id) ? "warning" : "ghost"}
                size="sm"
                onClick={() => toggleFlag(currentQuestion.id)}
                aria-label="Flag question"
              >
                <FaFlag />
              </IconButton>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="text-lg leading-relaxed text-[var(--foreground)]">
                {currentQuestion.question}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([letter, text]) => (
                  <button
                    key={letter}
                    onClick={() => handleAnswerSelect(currentQuestion.id, letter)}
                    className={`w-full p-4 text-left rounded-[var(--radius)] border-2 transition-all ${
                      answers[currentQuestion.id] === letter
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                        answers[currentQuestion.id] === letter
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                          : 'border-[var(--color-border)] text-[var(--color-muted-foreground)]'
                      }`}>
                        {letter}
                      </div>
                      <span className="text-[var(--foreground)]">{text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <FaChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleFlag(currentQuestion.id)}>
                    <FaFlag className="w-4 h-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'}
                  </Button>
                  
                  {currentQuestionIndex === mockAssessment.questions.length - 1 ? (
                    <Button variant="primary" onClick={openSubmitModal}>
                      Submit Test
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={goToNext}>
                      Next
                      <FaChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigation Panel */}
        <div className="w-80">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Question Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {mockAssessment.questions.map((question, index) => {
                  const status = getQuestionStatus(question.id, index);
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`w-10 h-10 rounded-[var(--radius)] border-2 text-sm font-medium transition-all ${
                        status === 'current'
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                          : status === 'answered'
                          ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]'
                          : status === 'flagged'
                          ? 'border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-[var(--color-success)] bg-[var(--color-success)]/10"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-[var(--color-warning)] bg-[var(--color-warning)]/10"></div>
                  <span>Flagged ({flaggedQuestions.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-[var(--color-border)]"></div>
                  <span>Not Visited ({mockAssessment.total_questions - answeredCount - flaggedQuestions.size})</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                variant="primary" 
                className="w-full mt-4"
                onClick={openSubmitModal}
              >
                Submit Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal isOpen={showSubmitModal} onClose={closeSubmitModal} size="md">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <FaExclamationTriangle className="text-[var(--color-warning)]" />
            Submit Test
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalDescription>
            Are you sure you want to submit your test? This action cannot be undone.
          </ModalDescription>
          
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-medium">{mockAssessment.total_questions}</span>
              </div>
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-medium text-[var(--color-success)]">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged:</span>
                <span className="font-medium text-[var(--color-warning)]">{flaggedQuestions.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-medium text-[var(--color-destructive)]">
                  {mockAssessment.total_questions - answeredCount}
                </span>
              </div>
            </div>
            
            {answeredCount < mockAssessment.total_questions && (
              <div className="p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-[var(--radius)]">
                <p className="text-sm text-[var(--color-warning)]">
                  You have {mockAssessment.total_questions - answeredCount} unanswered questions. 
                  Are you sure you want to submit?
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={closeSubmitModal}>
            Continue Testing
          </Button>
          <Button variant="primary" onClick={() => handleSubmit(false)}>
            <FaCheck className="w-4 h-4 mr-2" />
            Submit Test
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}