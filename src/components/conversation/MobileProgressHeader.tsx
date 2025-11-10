'use client'

import { ScopeProgressBar } from './ScopeProgressBar'
import type { ScopeProgress } from '@/types/scopeProgress'

interface MobileProgressHeaderProps {
  progress: ScopeProgress
  questionNumber: number
  className?: string
}

export function MobileProgressHeader({
  progress,
  questionNumber,
  className = ''
}: MobileProgressHeaderProps) {
  return (
    <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          Question {questionNumber}
        </span>
        <span className="text-xs text-gray-600">
          {progress.sectionsComplete} of 14 sections
        </span>
      </div>
      <ScopeProgressBar progress={progress} />
    </div>
  )
}

