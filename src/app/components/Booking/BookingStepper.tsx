'use client'

import { Calendar, User, CheckCircle } from 'lucide-react'

interface BookingStepperProps {
  currentStep: number
}

const STEPS = [
  { number: 1, label: 'Data e Hora', icon: Calendar },
  { number: 2, label: 'Dados Pessoais', icon: User },
  { number: 3, label: 'Confirmação', icon: CheckCircle },
]

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all
                ${
                  currentStep > step.number
                    ? 'bg-secondary text-white'
                    : currentStep === step.number
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-outline'
                }
              `}
            >
              {currentStep > step.number ? (
                <CheckCircle size={20} />
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
          {index < STEPS.length - 1 && (
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