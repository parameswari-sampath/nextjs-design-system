import React from "react";
import clsx from "clsx";
import Button from "./button";
import Card, { CardContent, CardFooter } from "./card";
import Progress from "./progress";
import Alert from "./alert";
import { FaCheck, FaArrowRight, FaArrowLeft, FaTriangleExclamation } from "react-icons/fa6";

export interface WizardLayoutStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface WizardLayoutProps {
  steps: WizardLayoutStep[];
  currentStep: number;
  canProceed: boolean;
  canGoBack: boolean;
  canSkip?: boolean;
  validationMessage?: string;
  completedSteps?: Set<number>;
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  onStepClick?: (stepIndex: number) => void;
  children: React.ReactNode;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  className?: string;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  steps,
  currentStep,
  canProceed,
  canGoBack,
  canSkip = false,
  validationMessage,
  completedSteps = new Set(),
  onNext,
  onPrevious,
  onSkip,
  onStepClick,
  children,
  showProgress = true,
  showStepNumbers = true,
  className,
}) => {
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((completedSteps.size + (canProceed ? 1 : 0)) / totalSteps) * 100;

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'accessible';
    return 'upcoming';
  };

  const isStepClickable = (stepIndex: number) => {
    if (!onStepClick) return false;
    const status = getStepStatus(stepIndex);
    return status === 'completed' || status === 'current' || status === 'accessible';
  };

  return (
    <div className={clsx("w-full max-w-4xl mx-auto", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = isStepClickable(index);
            
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick!(index)}
                  disabled={!isClickable}
                  className={clsx(
                    "relative flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
                    "w-10 h-10 min-w-[2.5rem] flex-shrink-0",
                    {
                      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] cursor-pointer hover:bg-[var(--color-primary-hover)]": status === 'completed',
                      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] ring-2 ring-[var(--color-primary)] ring-offset-2": status === 'current',
                      "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border-2 border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-secondary-hover)]": status === 'accessible' && isClickable,
                      "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] border-2 border-[var(--color-border)] cursor-not-allowed": status === 'upcoming' || !isClickable,
                    }
                  )}
                  title={step.title}
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
                    "w-12 sm:w-16 lg:w-24",
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
          {currentStepData.title}
          {currentStepData.isOptional && (
            <span className="text-sm font-normal text-[var(--color-muted-foreground)]">(Optional)</span>
          )}
        </h3>
        {currentStepData.description && (
          <p className="text-[var(--color-muted-foreground)] mt-2">{currentStepData.description}</p>
        )}
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div className="mb-6">
          <Alert variant="destructive" className="flex items-center gap-2">
            <FaTriangleExclamation className="w-4 h-4" />
            {validationMessage}
          </Alert>
        </div>
      )}

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          {children}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoBack || isFirstStep}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Skip Button */}
            {canSkip && currentStepData.isOptional && onSkip && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="flex items-center gap-2"
              >
                Skip
                <FaArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            {/* Next/Complete Button */}
            <Button
              variant="primary"
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              {isLastStep ? 'Complete' : 'Next'}
              {!isLastStep && <FaArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Progress Summary */}
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

export default WizardLayout;