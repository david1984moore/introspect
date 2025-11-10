'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContextSummary } from './ContextSummary'
import { OptionSelector } from './OptionSelector'
import { Button } from '@/components/ui/button'
import type { Question, ConversationIntelligence } from '@/types/conversation'

interface QuestionDisplayProps {
  question: Question
  intelligence: ConversationIntelligence
  questionNumber: number
  totalEstimatedQuestions?: number
  onAnswer: (value: string) => void
  isSubmitting?: boolean
  className?: string
  compact?: boolean // For context summary display
}

export function QuestionDisplay({
  question,
  intelligence,
  questionNumber,
  totalEstimatedQuestions,
  onAnswer,
  isSubmitting = false,
  className = '',
  compact = false
}: QuestionDisplayProps) {
  const [textValue, setTextValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Handle text input validation and submission
  const handleTextSubmit = () => {
    if (!textValue.trim()) {
      setError('Please enter a response')
      return
    }
    
    // Validate against question rules if present
    if (question.validation) {
      const { minLength, maxLength, pattern } = question.validation
      
      if (minLength && textValue.length < minLength) {
        setError(`Please enter at least ${minLength} characters`)
        return
      }
      
      if (maxLength && textValue.length > maxLength) {
        setError(`Please enter no more than ${maxLength} characters`)
        return
      }
      
      if (pattern) {
        const regex = new RegExp(pattern)
        if (!regex.test(textValue)) {
          setError(question.validation.errorMessage || 'Invalid format')
          return
        }
      }
    }
    
    setError(null)
    onAnswer(textValue.trim())
    setTextValue('') // Clear after submission
  }
  
  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }
  
  return (
    <div className={`max-w-2xl mx-auto px-4 ${className}`}>
      {/* Context Summary appears ABOVE question (Phase 4 integration) */}
      {questionNumber > 6 && (
        <ContextSummary 
          intelligence={intelligence}
          currentCategory={question.category}
          questionNumber={questionNumber}
          compact={compact}
        />
      )}
      
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Question header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
            {question.text}
          </h2>
          {/* Helper text */}
          {question.helperText && (
            <p className="text-sm text-gray-600 mt-3">
              {question.helperText}
            </p>
          )}
        </div>
        
        {/* Question body */}
        <div className="p-6">
          {question.inputType === 'radio' && question.options ? (
            // Multiple choice options - OptionSelector handles submission immediately
            <OptionSelector
              options={question.options}
              onSelect={onAnswer}
              disabled={isSubmitting}
            />
          ) : question.inputType === 'text' ? (
            // Text input (for truly unique data like names, emails)
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value)
                    setError(null) // Clear error on change
                  }}
                  onKeyDown={handleTextKeyDown}
                  placeholder={question.placeholder || 'Enter your answer...'}
                  disabled={isSubmitting}
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-white'
                    }
                  `}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'input-error' : undefined}
                  autoFocus
                />
                
                {/* Validation error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="input-error"
                    className="text-sm text-red-600 mt-2"
                  >
                    {error}
                  </motion.p>
                )}
                
                {/* Character count if maxLength specified */}
                {question.validation?.maxLength && (
                  <p className="text-xs text-gray-500 mt-2">
                    {textValue.length} / {question.validation.maxLength} characters
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleTextSubmit}
                disabled={isSubmitting || !textValue.trim()}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </Button>
            </div>
          ) : question.inputType === 'textarea' ? (
            // Textarea input (for multiple URLs or longer text)
            <div className="space-y-4">
              <div>
                <textarea
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value)
                    setError(null) // Clear error on change
                  }}
                  onKeyDown={handleTextKeyDown}
                  placeholder={question.placeholder || 'Enter your answer...'}
                  disabled={isSubmitting}
                  rows={question.helperText?.toLowerCase().includes('url') || question.helperText?.toLowerCase().includes('link') ? 6 : 3}
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-colors resize-none
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-white'
                    }
                  `}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'input-error' : undefined}
                  autoFocus
                />
                
                {/* Validation error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="input-error"
                    className="text-sm text-red-600 mt-2"
                  >
                    {error}
                  </motion.p>
                )}
                
                {/* Character count if maxLength specified */}
                {question.validation?.maxLength && (
                  <p className="text-xs text-gray-500 mt-2">
                    {textValue.length} / {question.validation.maxLength} characters
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleTextSubmit}
                disabled={isSubmitting || !textValue.trim()}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </Button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

// Helper function to format category names
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    foundation: 'Foundation',
    business_context: 'Business Context',
    section4_business_context: 'Business Context',
    features: 'Features & Functionality',
    technical_requirements: 'Technical Requirements',
    section7_technical_specs: 'Technical Requirements',
    design: 'Design & Branding',
    section9_design_direction: 'Design & Branding',
    timeline_budget: 'Timeline & Budget',
    section12_timeline: 'Timeline & Budget',
    section13_investment_summary: 'Investment Summary',
    content: 'Content Strategy',
    section6_content_strategy: 'Content Strategy',
    integrations: 'Integrations & Tools',
    section10_features_breakdown: 'Features & Functionality',
  }
  
  return categoryMap[category] || category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

