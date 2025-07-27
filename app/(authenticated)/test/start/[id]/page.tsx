"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Checkbox from "@/components/ui/checkbox";
import Alert from "@/components/ui/alert";
import Spinner from "@/components/ui/spinner";
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaEye,
  FaUsers,
  FaArrowLeft,
  FaPlay,
} from "react-icons/fa";

// Mock assessment data - will be replaced with API call
const mockAssessment = {
  id: "test-id",
  title: "Mathematics Final Exam",
  description: "Comprehensive mathematics assessment covering algebra, geometry, and calculus",
  assessment_type: "TEST",
  access_type: "PUBLIC",
  duration_minutes: 60,
  total_questions: 10,
  total_marks: 50,
  max_attempts: 1,
  allow_retake: false,
  shuffle_questions: true,
  shuffle_options: true,
  show_results_immediately: false,
  is_published: true,
  is_active: true,
};

const testRules = [
  {
    icon: FaClock,
    title: "Time Limit",
    description: `You have ${mockAssessment.duration_minutes} minutes to complete this test. The timer will start as soon as you begin.`,
    type: "warning" as const,
  },
  {
    icon: FaTimesCircle,
    title: "No Going Back",
    description: "Once you start the test, you cannot pause or restart it. Make sure you have a stable internet connection.",
    type: "error" as const,
  },
  {
    icon: FaLock,
    title: "Single Attempt",
    description: `You only have ${mockAssessment.max_attempts} attempt${mockAssessment.max_attempts > 1 ? 's' : ''} for this test. Use it wisely.`,
    type: "warning" as const,
  },
  {
    icon: FaEye,
    title: "Monitor Your Progress",
    description: "Keep track of answered questions using the navigation panel. Unanswered questions will be marked as incorrect.",
    type: "info" as const,
  },
  {
    icon: FaUsers,
    title: "Academic Integrity",
    description: "This is an individual assessment. Any form of cheating or collaboration is strictly prohibited.",
    type: "error" as const,
  },
  {
    icon: FaCheckCircle,
    title: "Submit Before Time Runs Out",
    description: "Make sure to submit your answers before the timer expires. The test will auto-submit when time is up.",
    type: "warning" as const,
  },
];

const warnings = [
  "Ensure you have a stable internet connection throughout the test.",
  "Do not refresh the browser page during the test as it may cause data loss.",
  "Keep your device charged or connected to power to avoid interruptions.",
  "Close all unnecessary applications and browser tabs to focus on the test.",
  "Read each question carefully before selecting your answer.",
];

export default function TestStartPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [warningsAccepted, setWarningsAccepted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canStartTest = rulesAccepted && warningsAccepted;

  const handleStartTest = async () => {
    // Always show validation errors when button is clicked
    setShowValidationErrors(true);
    
    if (!canStartTest) {
      return;
    }

    setIsStarting(true);
    
    // Here we would typically make an API call to start the assessment attempt
    // For now, we'll simulate a brief loading state
    setTimeout(() => {
      router.push(`/test/take/${assessmentId}`);
    }, 1000);
  };

  const handleGoBack = () => {
    setShowBackWarning(true);
  };

  const handleConfirmBack = async () => {
    setIsSubmitting(true);
    
    // Simulate auto-submit test (in real implementation, this would call the API)
    console.log("Auto-submitting test due to navigation away...");
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowBackWarning(false);
      router.push("/test/all-tests");
    }, 2000);
  };

  const handleCancelBack = () => {
    setShowBackWarning(false);
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case "error": return "text-[var(--color-destructive)]";
      case "warning": return "text-[var(--color-warning)]";
      case "info": return "text-[var(--color-primary)]";
      default: return "text-[var(--color-muted-foreground)]";
    }
  };

  const getRuleBorder = (type: string) => {
    switch (type) {
      case "error": return "border-[var(--color-destructive)]/20 bg-[var(--color-destructive)]/5";
      case "warning": return "border-[var(--color-warning)]/20 bg-[var(--color-warning)]/5";
      case "info": return "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5";
      default: return "border-[var(--color-border)] bg-[var(--color-card)]";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Test Instructions
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Please read carefully before starting the test
          </p>
        </div>

        {/* Assessment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{mockAssessment.title}</span>
              <div className="flex gap-2">
                <Badge variant="info">{mockAssessment.assessment_type}</Badge>
                <Badge variant={mockAssessment.access_type === "PUBLIC" ? "success" : "secondary"}>
                  {mockAssessment.access_type}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-muted-foreground)] mb-4">
              {mockAssessment.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                <div className="font-medium text-[var(--foreground)]">{mockAssessment.total_questions}</div>
                <div className="text-[var(--color-muted-foreground)]">Questions</div>
              </div>
              <div className="text-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                <div className="font-medium text-[var(--foreground)]">{mockAssessment.duration_minutes} min</div>
                <div className="text-[var(--color-muted-foreground)]">Duration</div>
              </div>
              <div className="text-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                <div className="font-medium text-[var(--foreground)]">{mockAssessment.total_marks}</div>
                <div className="text-[var(--color-muted-foreground)]">Total Marks</div>
              </div>
              <div className="text-center p-3 bg-[var(--color-secondary)] rounded-[var(--radius)]">
                <div className="font-medium text-[var(--foreground)]">{mockAssessment.max_attempts}</div>
                <div className="text-[var(--color-muted-foreground)]">Attempts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-[var(--color-warning)]" />
              Test Rules & Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testRules.map((rule, index) => (
              <div
                key={index}
                className={`p-4 border rounded-[var(--radius)] ${getRuleBorder(rule.type)}`}
              >
                <div className="flex items-center gap-4">
                  <rule.icon className={`w-6 h-6 flex-shrink-0 ${getRuleIcon(rule.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--foreground)] mb-1">
                      {rule.title}
                    </h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-[var(--color-border)]">
              <Checkbox
                id="rules-accepted"
                checked={rulesAccepted}
                onChange={(e) => {
                  setRulesAccepted(e.target.checked);
                  if (e.target.checked && warningsAccepted) {
                    setShowValidationErrors(false);
                  }
                }}
                label="I have read and understood all the test rules and guidelines"
                error={showValidationErrors && !rulesAccepted}
                errorMessage="You must accept the test rules to continue"
              />
            </div>
          </CardContent>
        </Card>

        {/* Important Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-[var(--color-destructive)]" />
              Important Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="warning" className="flex items-center gap-4">
              <FaExclamationTriangle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium">Before You Start</h4>
                <p className="text-sm mt-1">
                  Please ensure you meet all the requirements below to avoid any issues during the test.
                </p>
              </div>
            </Alert>

            <ul className="space-y-3">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--color-destructive)] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    {warning}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <Checkbox
                id="warnings-accepted"
                checked={warningsAccepted}
                onChange={(e) => {
                  setWarningsAccepted(e.target.checked);
                  if (e.target.checked && rulesAccepted) {
                    setShowValidationErrors(false);
                  }
                }}
                label="I acknowledge all warnings and confirm I am ready to take the test"
                error={showValidationErrors && !warningsAccepted}
                errorMessage="You must acknowledge the warnings to continue"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleGoBack}>
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            variant="primary"
            onClick={handleStartTest}
            disabled={isStarting}
            className="min-w-[200px]"
          >
            {isStarting ? (
              <>
                <Spinner size="sm" color="white" className="mr-2" />
                Starting Test...
              </>
            ) : (
              <>
                <FaPlay className="w-4 h-4 mr-2" />
                Start Test Now
              </>
            )}
          </Button>
        </div>

        {/* Back Navigation Warning Modal */}
        <Modal isOpen={showBackWarning} onClose={handleCancelBack} size="md">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <FaExclamationTriangle className="text-[var(--color-destructive)]" />
              Leave Test Instructions?
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalDescription>
              Are you sure you want to go back? This action will have the following consequences:
            </ModalDescription>
            
            <div className="mt-4 space-y-3">
              <Alert variant="warning" className="flex items-center gap-4">
                <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium">Security Measure</h4>
                  <p className="text-sm mt-1">
                    If you leave now, any ongoing test attempt will be automatically submitted to prevent cheating.
                  </p>
                </div>
              </Alert>

              <div className="p-4 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-[var(--radius)]">
                <h4 className="font-medium text-[var(--color-destructive)] mb-2">What happens if you continue:</h4>
                <ul className="space-y-1 text-sm text-[var(--color-destructive)]">
                  <li>• Current test progress will be lost</li>
                  <li>• Any active test attempt will be auto-submitted</li>
                  <li>• You will need to restart the entire process</li>
                  <li>• This may count towards your attempt limit</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelBack}
              disabled={isSubmitting}
            >
              Stay on Page
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmBack}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="white" className="mr-2" />
                  Submitting Test...
                </>
              ) : (
                "Yes, Go Back"
              )}
            </Button>
          </ModalFooter>
        </Modal>

      </div>
    </div>
  );
}