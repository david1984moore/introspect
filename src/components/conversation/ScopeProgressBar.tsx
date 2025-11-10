'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ScopeProgress } from '@/types/scopeProgress'

interface ScopeProgressBarProps {
  progress: ScopeProgress
  showDetails?: boolean
  className?: string
}

export function ScopeProgressBar({
  progress,
  showDetails = false,
  className = ''
}: ScopeProgressBarProps) {
  const { overallCompleteness, sectionsComplete, sectionsRemaining } = progress
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Visual progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallCompleteness}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-primary-dark"
            role="progressbar"
            aria-valuenow={overallCompleteness}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Project scope ${overallCompleteness}% complete`}
          />
        </div>
        
        {/* Milestone markers (every 25%) */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {[0, 25, 50, 75, 100].map(milestone => {
            const isPassed = overallCompleteness >= milestone
            return (
              <div
                key={milestone}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  isPassed
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-300'
                }`}
              />
            )
          })}
        </div>
      </div>
      
      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">
          {overallCompleteness}% complete
        </span>
      </div>
    </div>
  )
}

