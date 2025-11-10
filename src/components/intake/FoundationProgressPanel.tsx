'use client'

import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'

interface FoundationProgressPanelProps {
  currentStep: number
  completedSteps: number[]
  className?: string
}

const foundationSteps = [
  { number: 1, label: 'Your Name', description: 'Basic introduction' },
  { number: 2, label: 'Email Address', description: 'Contact information' },
  { number: 3, label: 'Phone Number', description: 'Optional contact' },
  { number: 4, label: 'Website Type', description: 'Project classification' },
]

export function FoundationProgressPanel({
  currentStep,
  completedSteps,
  className = ''
}: FoundationProgressPanelProps) {
  const progressPercentage = (completedSteps.length / 4) * 100
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="space-y-2">
          {/* Visual progress bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-600 to-blue-700"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Foundation questions ${progressPercentage}% complete`}
              />
            </div>
            
            {/* Milestone markers */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {[0, 25, 50, 75, 100].map(milestone => {
                const isPassed = progressPercentage >= milestone
                return (
                  <div
                    key={milestone}
                    className={`w-3 h-3 rounded-full border-2 transition-colors ${
                      isPassed
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                )
              })}
            </div>
          </div>
          
          {/* Progress text */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {Math.round(progressPercentage)}% complete
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {completedSteps.length} of 4 questions
              </span>
            </div>
            
            {completedSteps.length < 4 && (
              <span className="text-xs text-gray-500">
                {4 - completedSteps.length} remaining
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Step List */}
      <div className="space-y-2">
        {foundationSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-blue-50' : 'bg-transparent'
              }`}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isCurrent ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  <Circle className={`w-3 h-3 ${
                    isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isCurrent ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {step.label}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

