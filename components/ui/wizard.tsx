import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Button from "./button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import Progress from "./progress";
import { FaCheck, FaArrowRight, FaArrowLeft } from "react-icons/fa6";

export interface WizardSubStep {
  id: string;
  title: string;
  content: React.ReactNode;
  isValid?: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  subSteps?: WizardSubStep[];
  isValid?: boolean;
  isOptional?: boolean;
  questionsPerPage?: number; // For pagination within step
}

interface WizardProps {
  steps: WizardStep[];
  onComplete?: (data: any) => void;
  onStepChange?: (currentStep: number, direction: 'next' | 'previous') => void;
  className?: string;
  showProgressBar?: boolean;
  showStepNumbers?: boolean;
  allowSkipOptional?: boolean;
}

const Wizard: React.FC<WizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  className,
  showProgressBar = true,
  showStepNumbers = true,
  allowSkipOptional = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [completedSubSteps, setCompletedSubSteps] = useState<{[stepId: number]: Set<number>}>({});
  const [wizardData, setWizardData] = useState<any>({});

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const hasSubSteps = currentStepData?.subSteps && currentStepData.subSteps.length > 0;
  const currentSubStepData = hasSubSteps ? currentStepData.subSteps![currentSubStep] : null;
  const totalSubSteps = hasSubSteps ? currentStepData.subSteps!.length : 0;
  
  // Calculate progress including sub-steps
  let totalProgress = 0;
  let completedProgress = 0;
  
  steps.forEach((step, stepIndex) => {
    if (step.subSteps && step.subSteps.length > 0) {
      totalProgress += step.subSteps.length;
      const completedSubStepsForStep = completedSubSteps[stepIndex]?.size || 0;
      completedProgress += completedSubStepsForStep;
      if (stepIndex === currentStep) {
        completedProgress += currentSubStep;
      }
    } else {
      totalProgress += 1;
      if (completedSteps.has(stepIndex)) {
        completedProgress += 1;
      }
    }
  });
  
  const progress = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;
  
  const isFirstStep = currentStep === 0 && (!hasSubSteps || currentSubStep === 0);
  const isLastStep = currentStep === totalSteps - 1 && (!hasSubSteps || currentSubStep === totalSubSteps - 1);
  const isLastSubStep = hasSubSteps && currentSubStep === totalSubSteps - 1;

  const canProceed = hasSubSteps 
    ? (currentSubStepData?.isValid !== false)
    : (currentStepData?.isValid !== false || (allowSkipOptional && currentStepData?.isOptional));

  const handleNext = () => {
    if (!canProceed) return;

    if (hasSubSteps) {
      // Mark current sub-step as completed
      const newCompletedSubSteps = { ...completedSubSteps };
      if (!newCompletedSubSteps[currentStep]) {
        newCompletedSubSteps[currentStep] = new Set();
      }
      newCompletedSubSteps[currentStep].add(currentSubStep);
      setCompletedSubSteps(newCompletedSubSteps);

      if (isLastSubStep) {
        // Move to next main step
        const newCompletedSteps = new Set(completedSteps);
        newCompletedSteps.add(currentStep);
        setCompletedSteps(newCompletedSteps);
        
        if (currentStep === totalSteps - 1) {
          onComplete?.(wizardData);
        } else {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          setCurrentSubStep(0);
          onStepChange?.(nextStep, 'next');
        }
      } else {
        // Move to next sub-step
        setCurrentSubStep(currentSubStep + 1);
      }
    } else {
      // Regular step handling
      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.add(currentStep);
      setCompletedSteps(newCompletedSteps);

      if (isLastStep) {
        onComplete?.(wizardData);
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setCurrentSubStep(0);
        onStepChange?.(nextStep, 'next');
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      if (hasSubSteps && currentSubStep > 0) {
        // Go to previous sub-step
        setCurrentSubStep(currentSubStep - 1);
      } else {
        // Go to previous main step
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        
        // Set to last sub-step if previous step has sub-steps
        const prevStepData = steps[prevStep];
        if (prevStepData?.subSteps && prevStepData.subSteps.length > 0) {
          setCurrentSubStep(prevStepData.subSteps.length - 1);
        } else {
          setCurrentSubStep(0);
        }
        
        onStepChange?.(prevStep, 'previous');
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow clicking on completed steps or current step
    if (completedSteps.has(stepIndex) || stepIndex === currentStep || stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex, stepIndex > currentStep ? 'next' : 'previous');
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'accessible';
    return 'upcoming';
  };

  return (
    <div className={clsx("w-full max-w-4xl mx-auto", className)}>
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {hasSubSteps 
                ? `Step ${currentStep + 1}.${currentSubStep + 1} of ${totalSteps} (${currentSubStep + 1}/${totalSubSteps})`
                : `Step ${currentStep + 1} of ${totalSteps}`
              }
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Sub-step progress for current step */}
          {hasSubSteps && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--color-muted-foreground)]">
                  Current section progress
                </span>
                <span className="text-xs text-[var(--color-muted-foreground)]">
                  {currentSubStep + 1} of {totalSubSteps}
                </span>
              </div>
              <Progress value={((currentSubStep + 1) / totalSubSteps) * 100} className="h-1" />
            </div>
          )}
        </div>
      )}

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = status === 'completed' || status === 'current' || status === 'accessible';
            
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={clsx(
                    "relative flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
                    "w-10 h-10 min-w-[2.5rem] flex-shrink-0", // Fixed width and height
                    {
                      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] cursor-pointer hover:bg-[var(--color-primary-hover)]": status === 'completed',
                      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] ring-2 ring-[var(--color-primary)] ring-offset-2": status === 'current',
                      "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border-2 border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-secondary-hover)]": status === 'accessible',
                      "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] border-2 border-[var(--color-border)] cursor-not-allowed": status === 'upcoming',
                    }
                  )}
                >
                  {status === 'completed' ? (
                    <FaCheck className="w-4 h-4" />
                  ) : showStepNumbers ? (
                    index + 1
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={clsx(
                    "h-0.5 transition-colors duration-200 mx-2 sm:mx-4",
                    "w-12 sm:w-16 lg:w-24", // Responsive connector width
                    {
                      "bg-[var(--color-primary)]": index < currentStep || completedSteps.has(index),
                      "bg-[var(--color-border)]": index >= currentStep && !completedSteps.has(index),
                    }
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)] flex items-center justify-center gap-2">
          {hasSubSteps ? currentSubStepData?.title : currentStepData.title}
          {currentStepData.isOptional && (
            <span className="text-sm font-normal text-[var(--color-muted-foreground)]">(Optional)</span>
          )}
        </h3>
        {hasSubSteps ? (
          <div className="mt-2">
            <p className="text-sm text-[var(--color-primary)] font-medium">{currentStepData.title}</p>
            {currentStepData.description && (
              <p className="text-[var(--color-muted-foreground)] text-sm mt-1">{currentStepData.description}</p>
            )}
          </div>
        ) : (
          currentStepData.description && (
            <p className="text-[var(--color-muted-foreground)] mt-2">{currentStepData.description}</p>
          )
        )}
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
        </CardHeader>
        <CardContent>
          {hasSubSteps ? currentSubStepData?.content : currentStepData.content}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {allowSkipOptional && currentStepData.isOptional && currentStepData.isValid === false && (
              <Button
                variant="ghost"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Skip
                <FaArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              {isLastStep ? 'Complete' : 'Next'}
              {!isLastStep && <FaArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Wizard Summary */}
      <Card className="bg-[var(--color-secondary)] border-[var(--color-border)]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">
              Progress: {completedSteps.size} of {totalSteps} steps completed
            </span>
            <span className="text-[var(--color-muted-foreground)]">
              {totalSteps - completedSteps.size} remaining
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wizard;