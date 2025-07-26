import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface NavigationRules {
  canSkipSteps?: boolean;
  canGoBackward?: boolean;
  canClickPreviousSteps?: boolean;
  requireSequentialCompletion?: boolean;
  allowIncompleteNavigation?: boolean;
}

export interface WizardContextValue {
  // Current state
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  validSteps: Set<number>;
  
  // Step validation
  validationMessage?: string;
  
  // Navigation methods
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  
  // Validation methods
  setStepValid: (step: number, isValid: boolean) => void;
  setValidationMessage: (message?: string) => void;
  isStepValid: (step: number) => boolean;
  
  // Step completion
  markStepComplete: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  
  // Navigation rules
  navigationRules: NavigationRules;
  setNavigationRules: (rules: NavigationRules) => void;
  
  // Navigation state
  canProceed: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  
  // Reset wizard
  reset: () => void;
  
  // Events
  onComplete?: () => void;
  onStepChange?: (step: number, direction: 'next' | 'previous' | 'skip' | 'jump') => void;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export interface WizardProviderProps {
  children: ReactNode;
  totalSteps: number;
  initialStep?: number;
  navigationRules?: NavigationRules;
  onComplete?: () => void;
  onStepChange?: (step: number, direction: 'next' | 'previous' | 'skip' | 'jump') => void;
}

const defaultNavigationRules: NavigationRules = {
  canSkipSteps: false,
  canGoBackward: true,
  canClickPreviousSteps: true,
  requireSequentialCompletion: true,
  allowIncompleteNavigation: false,
};

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  totalSteps,
  initialStep = 0,
  navigationRules = defaultNavigationRules,
  onComplete,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validSteps, setValidSteps] = useState<Set<number>>(new Set());
  const [validationMessage, setValidationMessage] = useState<string | undefined>();
  const [rules, setRules] = useState<NavigationRules>({ ...defaultNavigationRules, ...navigationRules });

  // Check if current step is valid
  const isCurrentStepValid = validSteps.has(currentStep);
  
  // Navigation state calculations
  const canProceed = isCurrentStepValid || (rules.allowIncompleteNavigation ?? false);
  const canGoBack = (rules.canGoBackward ?? true) && currentStep > 0;
  const canSkip = (rules.canSkipSteps ?? false) && !isCurrentStepValid;

  const isStepValid = useCallback((step: number): boolean => {
    return validSteps.has(step);
  }, [validSteps]);

  const isStepComplete = useCallback((step: number): boolean => {
    return completedSteps.has(step);
  }, [completedSteps]);

  const setStepValid = useCallback((step: number, isValid: boolean) => {
    setValidSteps(prev => {
      const newSet = new Set(prev);
      if (isValid) {
        newSet.add(step);
      } else {
        newSet.delete(step);
      }
      return newSet;
    });
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step));
  }, []);

  const canNavigateToStep = useCallback((targetStep: number): boolean => {
    // Can't navigate to invalid step
    if (targetStep < 0 || targetStep >= totalSteps) return false;
    
    // Current step is always accessible
    if (targetStep === currentStep) return true;
    
    // Going backward
    if (targetStep < currentStep) {
      return rules.canClickPreviousSteps ?? true;
    }
    
    // Going forward
    if (rules.requireSequentialCompletion) {
      // Must complete all steps in sequence
      for (let i = currentStep; i < targetStep; i++) {
        if (!completedSteps.has(i) && !validSteps.has(i)) {
          return false;
        }
      }
    }
    
    return true;
  }, [currentStep, totalSteps, rules, completedSteps, validSteps]);

  const goToStep = useCallback((step: number) => {
    if (!canNavigateToStep(step)) return;
    
    const direction = step > currentStep ? 'next' : step < currentStep ? 'previous' : 'jump';
    setCurrentStep(step);
    onStepChange?.(step, direction);
  }, [canNavigateToStep, currentStep, onStepChange]);

  const nextStep = useCallback(() => {
    if (!canProceed) return;
    
    // Mark current step as completed if valid
    if (isCurrentStepValid) {
      markStepComplete(currentStep);
    }
    
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex >= totalSteps) {
      // Wizard complete
      onComplete?.();
      return;
    }
    
    setCurrentStep(nextStepIndex);
    setValidationMessage(undefined); // Clear validation message
    onStepChange?.(nextStepIndex, 'next');
  }, [canProceed, isCurrentStepValid, currentStep, totalSteps, markStepComplete, onComplete, onStepChange]);

  const previousStep = useCallback(() => {
    if (!canGoBack) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    setValidationMessage(undefined); // Clear validation message
    onStepChange?.(prevStepIndex, 'previous');
  }, [canGoBack, currentStep, onStepChange]);

  const skipStep = useCallback(() => {
    if (!canSkip) return;
    
    // Mark step as completed even though not valid (skipped)
    markStepComplete(currentStep);
    
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex >= totalSteps) {
      onComplete?.();
      return;
    }
    
    setCurrentStep(nextStepIndex);
    setValidationMessage(undefined);
    onStepChange?.(nextStepIndex, 'skip');
  }, [canSkip, currentStep, totalSteps, markStepComplete, onComplete, onStepChange]);

  const setNavigationRules = useCallback((newRules: NavigationRules) => {
    setRules(prev => ({ ...prev, ...newRules }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
    setValidSteps(new Set());
    setValidationMessage(undefined);
    setRules({ ...defaultNavigationRules, ...navigationRules });
  }, [initialStep, navigationRules]);

  const contextValue: WizardContextValue = {
    // Current state
    currentStep,
    totalSteps,
    completedSteps,
    validSteps,
    validationMessage,
    
    // Navigation methods
    goToStep,
    nextStep,
    previousStep,
    skipStep,
    
    // Validation methods
    setStepValid,
    setValidationMessage,
    isStepValid,
    
    // Step completion
    markStepComplete,
    isStepComplete,
    
    // Navigation rules
    navigationRules: rules,
    setNavigationRules,
    
    // Navigation state
    canProceed,
    canGoBack,
    canSkip,
    
    // Reset
    reset,
    
    // Events
    onComplete,
    onStepChange,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextValue => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

export default WizardContext;