import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Step {
  number: number
  label: string
  icon: LucideIcon
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all
                ${currentStep > step.number
                  ? 'bg-secondary text-white'
                  : currentStep === step.number
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-outline'
                }
              `}
            >
              {currentStep > step.number ? (
                <Check size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium
                ${currentStep >= step.number ? 'text-primary' : 'text-outline'}
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`
                mx-2 h-0.5 w-16 sm:w-24
                ${currentStep > step.number ? 'bg-secondary' : 'bg-surface-container'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export { Stepper }
export type { StepperProps, Step }