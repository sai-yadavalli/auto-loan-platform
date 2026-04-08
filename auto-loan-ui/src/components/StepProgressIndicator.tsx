import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Loan Details', path: '/apply/step-1' },
  { label: 'Vehicle Info', path: '/apply/step-2' },
  { label: 'Personal Details', path: '/apply/step-3' },
  { label: 'Upload Docs', path: '/apply/step-4' },
  { label: 'Review & Submit', path: '/apply/step-5' },
];

interface StepProgressIndicatorProps {
  currentStep: number; // 1-indexed
  completedSteps: number[]; // steps the user has finished
}

export default function StepProgressIndicator({
  currentStep,
  completedSteps,
}: StepProgressIndicatorProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Application progress" className="w-full py-4 px-4 sm:px-8">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isClickable = isCompleted;

          return (
            <li key={step.path} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && navigate(step.path)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 w-full group',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                {/* Circle */}
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-200',
                    isCurrent &&
                      'border-blue-600 bg-blue-600 text-white',
                    isCompleted && !isCurrent &&
                      'border-blue-600 bg-blue-600 text-white',
                    !isCurrent && !isCompleted &&
                      'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    'hidden sm:block text-xs font-medium text-center leading-tight transition-colors duration-200',
                    isCurrent && 'text-blue-600',
                    isCompleted && !isCurrent && 'text-blue-600',
                    !isCurrent && !isCompleted && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'hidden sm:block h-0.5 w-full mx-2 transition-colors duration-200',
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
