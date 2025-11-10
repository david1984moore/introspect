'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Info } from 'lucide-react'
import { ScopeProgressBar } from './ScopeProgressBar'
import { ScopeSectionList } from './ScopeSectionList'
import type { ScopeProgress } from '@/types/scopeProgress'

interface ScopeProgressPanelProps {
  progress: ScopeProgress
  variant?: 'full' | 'compact' | 'minimal'
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function ScopeProgressPanel({
  progress,
  variant = 'compact',
  collapsible = false,
  defaultExpanded = false,
  className = ''
}: ScopeProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  if (variant === 'minimal') {
    // Just the progress bar
    return (
      <div className={className}>
        <ScopeProgressBar progress={progress} />
      </div>
    )
  }
  
  if (variant === 'compact') {
    // Progress bar + collapsible section list
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="mb-4">
          <ScopeProgressBar progress={progress} showDetails />
        </div>
        
        {collapsible ? (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="font-medium">Section Progress</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ScopeSectionList progress={progress} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ScopeSectionList progress={progress} compact />
          </div>
        )}
      </div>
    )
  }
  
  // Full view with all sections
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Scope Progress
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
        <ScopeProgressBar progress={progress} showDetails />
      </div>
      
      <ScopeSectionList progress={progress} />
    </div>
  )
}

