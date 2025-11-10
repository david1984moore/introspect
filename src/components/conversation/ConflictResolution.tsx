'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Check } from 'lucide-react'
import type { ValidationPrompt, ValidationResponse, ValidationOption } from '@/types/validation'

interface ConflictResolutionProps {
  validation: ValidationPrompt
  onResolve: (response: ValidationResponse) => void
  isSubmitting?: boolean
}

export function ConflictResolution({
  validation,
  onResolve,
  isSubmitting = false
}: ConflictResolutionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  
  const handleResolve = () => {
    if (!selectedOption) return
    
    onResolve({
      validationId: validation.id,
      confirmed: true,
      selectedOption,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString()
    })
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border-2 border-yellow-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                We found a conflict
              </h2>
              <p className="text-sm text-gray-700">
                {validation.summary}
              </p>
            </div>
          </div>
        </div>
        
        {/* Resolution options */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            How would you like to resolve this?
          </h3>
          
          <div className="space-y-3">
            {validation.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedOption(option.value)}
                disabled={isSubmitting}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${selectedOption === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${selectedOption === option.value
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                      }
                    `}
                  >
                    {selectedOption === option.value && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Optional notes */}
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <label htmlFor="conflict-notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional context (optional):
              </label>
              <textarea
                id="conflict-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details?"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>
          )}
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={handleResolve}
            disabled={!selectedOption || isSubmitting}
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resolving...' : 'Continue with this choice'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

