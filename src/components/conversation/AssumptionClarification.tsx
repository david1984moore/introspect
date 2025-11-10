'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, Check, X } from 'lucide-react'
import type { ValidationPrompt, ValidationResponse } from '@/types/validation'

interface AssumptionClarificationProps {
  validation: ValidationPrompt
  onClarify: (response: ValidationResponse) => void
  isSubmitting?: boolean
}

export function AssumptionClarification({
  validation,
  onClarify,
  isSubmitting = false
}: AssumptionClarificationProps) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correction, setCorrection] = useState('')
  
  const handleConfirm = (correct: boolean) => {
    setIsCorrect(correct)
    if (correct) {
      // If assumption is correct, submit immediately
      onClarify({
        validationId: validation.id,
        confirmed: true,
        timestamp: new Date().toISOString()
      })
    }
  }
  
  const handleSubmitCorrection = () => {
    if (!correction.trim()) return
    
    onClarify({
      validationId: validation.id,
      confirmed: false,
      corrections: { assumption: correction.trim() },
      timestamp: new Date().toISOString()
    })
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-50 border-b border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Quick assumption check
              </h2>
              <p className="text-sm text-gray-700">
                I made an assumption based on your answers. Is this correct?
              </p>
            </div>
          </div>
        </div>
        
        {/* Assumption */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-base text-gray-900 leading-relaxed">
              {validation.summary}
            </p>
          </div>
          
          {isCorrect === null && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleConfirm(true)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Yes, that's correct
              </button>
              <button
                onClick={() => handleConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                No, let me clarify
              </button>
            </div>
          )}
          
          {isCorrect === false && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="correction" className="block text-sm font-medium text-gray-700 mb-2">
                  What should it be instead?
                </label>
                <textarea
                  id="correction"
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                  placeholder="Please provide the correct information..."
                  rows={3}
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleSubmitCorrection}
                disabled={!correction.trim() || isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update and continue'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

