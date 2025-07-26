import React from 'react';
import WizardLayout, { WizardLayoutStep } from './wizard-layout';
import { useWizard } from './wizard-context';

export interface WizardConnectedProps {
  steps: WizardLayoutStep[];
  children: React.ReactNode;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  className?: string;
}

/**
 * Connected Wizard component that integrates WizardLayout with WizardContext
 * This component bridges the pure UI layout with the context-managed state
 */
const WizardConnected: React.FC<WizardConnectedProps> = ({
  steps,
  children,
  showProgress = true,
  showStepNumbers = true,
  className,
}) => {
  const wizard = useWizard();

  return (
    <WizardLayout
      steps={steps}
      currentStep={wizard.currentStep}
      canProceed={wizard.canProceed}
      canGoBack={wizard.canGoBack}
      canSkip={wizard.canSkip}
      validationMessage={wizard.validationMessage}
      completedSteps={wizard.completedSteps}
      onNext={wizard.nextStep}
      onPrevious={wizard.previousStep}
      onSkip={wizard.skipStep}
      onStepClick={wizard.navigationRules.canClickPreviousSteps ? wizard.goToStep : undefined}
      showProgress={showProgress}
      showStepNumbers={showStepNumbers}
      className={className}
    >
      {children}
    </WizardLayout>
  );
};

export default WizardConnected;