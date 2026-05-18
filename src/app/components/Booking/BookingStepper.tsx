/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Calendar, User, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="flex items-center justify-center">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number
        const isUpcoming = currentStep < step.number

        return (
          <div key={step.number} className="flex items-center">
            {/* Step Circle + Label */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`
                  relative flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold
                  transition-colors duration-300
                  ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : isCurrent
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-surface-tertiary text-text-tertiary'
                  }
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle size={20} />
                  </motion.div>
                ) : (
                  <step.icon size={20} />
                )}

                {/* Current step pulse ring */}
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.4 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-2xl ring-2 ring-primary/30"
                  />
                )}
              </motion.div>

              <span
                className={`
                  mt-2.5 text-xs font-semibold transition-colors duration-300
                  ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-primary' : 'text-text-tertiary'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div className="relative mx-3 h-0.5 w-14 overflow-hidden rounded-full bg-surface-tertiary sm:w-20">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}