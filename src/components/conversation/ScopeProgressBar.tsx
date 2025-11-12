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
  const roundedProgress = Math.round(overallCompleteness)
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Visual progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${roundedProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-primary"
            role="progressbar"
            aria-valuenow={roundedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Project scope ${roundedProgress}% complete`}
          />
        </div>
      </div>
      
      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">
          {roundedProgress}%
        </span>
      </div>
    </div>
  )
}

