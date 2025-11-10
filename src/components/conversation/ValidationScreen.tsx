'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Edit2, AlertCircle } from 'lucide-react'
import type { ValidationPrompt, ValidationResponse, ValidationDetail } from '@/types/validation'

interface ValidationScreenProps {
  validation: ValidationPrompt
  onConfirm: (response: ValidationResponse) => void
  isSubmitting?: boolean
}

export function ValidationScreen({
  validation,
  onConfirm,
  isSubmitting = false
}: ValidationScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [corrections, setCorrections] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  
  const handleCorrection = (label: string, value: string) => {
    setCorrections(prev => ({
      ...prev,
      [label]: value
    }))
  }
  
  const handleConfirm = () => {
    onConfirm({
      validationId: validation.id,
      confirmed: Object.keys(corrections).length === 0,
      corrections: Object.keys(corrections).length > 0 ? corrections : undefined,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString()
    })
  }
  
  const handleReject = () => {
    setIsEditing(true)
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary/5 border-b border-primary/10 p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Let me make sure I understand...
              </h2>
              <p className="text-sm text-gray-600">
                Please confirm the following details are correct, or let me know what needs to be changed.
              </p>
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {formatCategoryName(validation.category)}
            </h3>
            <p className="text-base text-gray-900 leading-relaxed">
              {validation.summary}
            </p>
          </div>
          
          {/* Detailed breakdown */}
          {validation.details && validation.details.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Key Details:
              </h4>
              
              {validation.details.map((detail, idx) => (
                <ValidationDetailItem
                  key={idx}
                  detail={detail}
                  isEditing={isEditing}
                  onCorrection={handleCorrection}
                  currentValue={corrections[detail.label] || detail.value}
                />
              ))}
            </div>
          )}
          
          {/* Optional notes */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <label htmlFor="validation-notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes or corrections:
              </label>
              <textarea
                id="validation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any other details I should know?"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>
          )}
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
          {!isEditing ? (
            <>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Something's not quite right
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Confirming...' : 'Yes, that\'s correct'}
              </button>
            </>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update and continue'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface ValidationDetailItemProps {
  detail: ValidationDetail
  isEditing: boolean
  onCorrection: (label: string, value: string) => void
  currentValue: string
}

function ValidationDetailItem({
  detail,
  isEditing,
  onCorrection,
  currentValue
}: ValidationDetailItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-3 h-3 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 mb-1">
          {detail.label}
        </p>
        
        {isEditing && detail.editable !== false ? (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onCorrection(detail.label, e.target.value)}
            className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        ) : (
          <p className="text-sm text-gray-900">
            {currentValue}
          </p>
        )}
      </div>
      
      {isEditing && detail.editable !== false && (
        <button
          onClick={() => {/* Could add edit individual field logic */}}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    business_context: 'Business Context',
    technical_specs: 'Technical Requirements',
    features: 'Features & Functionality',
    design: 'Design Direction',
    content: 'Content Strategy',
    timeline: 'Timeline & Budget'
  }
  return categoryMap[category] || category
}

