import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import StepProgressIndicator from '@/components/StepProgressIndicator';
import { useFormPersist } from '@/hooks/useFormPersist';

const STEP_PATHS = [
  '/apply/step-1',
  '/apply/step-2',
  '/apply/step-3',
  '/apply/step-4',
  '/apply/step-5',
];

function useCurrentStep(): number {
  const { pathname } = useLocation();
  const index = STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  return index === -1 ? 1 : index + 1;
}

export default function ApplyPage() {
  useFormPersist();
  const currentStep = useCurrentStep();

  // Steps prior to the current one are considered completed for back-navigation
  const completedSteps = STEP_PATHS.slice(0, currentStep - 1).map((_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto mt-6 px-4">
        <StepProgressIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
