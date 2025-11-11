'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ContextSummary } from './ContextSummary'
import { OptionSelector } from './OptionSelector'
import { Button } from '@/components/ui/button'
import { TIMINGS, EASINGS, getAdjustedTimings } from '@/lib/animationTimings'
import type { Question, ConversationIntelligence, AnimationPhase } from '@/types/conversation'

interface QuestionDisplayProps {
  question: Question
  intelligence: ConversationIntelligence
  questionNumber: number
  totalEstimatedQuestions?: number
  onAnswer: (value: string) => void
  isSubmitting?: boolean
  className?: string
  compact?: boolean // For context summary display
  animationPhase?: AnimationPhase // Phase 3: Animation state
  selectedOptionId?: string | null // Phase 3: Selected option for highlight
}

export function QuestionDisplay({
  question,
  intelligence,
  questionNumber,
  totalEstimatedQuestions,
  onAnswer,
  isSubmitting = false,
  className = '',
  compact = false,
  animationPhase = 'idle',
  selectedOptionId = null
}: QuestionDisplayProps) {
  const [textValue, setTextValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const questionContainerRef = useRef<HTMLDivElement>(null)
  const firstOptionRef = useRef<HTMLButtonElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previousQuestionIdRef = useRef<string | null>(null)
  
  // Phase 6: Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  // Phase 6: Focus management - move focus to first interactive element when question appears
  useEffect(() => {
    if (animationPhase === 'ready' || (animationPhase === 'idle' && question)) {
      // Small delay to ensure DOM is ready
      const focusTimer = setTimeout(() => {
        // For radio questions, focus first option
        if (question.inputType === 'radio' && firstOptionRef.current) {
          firstOptionRef.current.focus()
        }
        // For text questions, focus input
        else if (question.inputType === 'text' && textInputRef.current) {
          textInputRef.current.focus()
        }
        // For textarea questions, focus textarea
        else if (question.inputType === 'textarea' && textareaRef.current) {
          textareaRef.current.focus()
        }
        // For other types, focus container for screen reader
        else if (questionContainerRef.current) {
          questionContainerRef.current.focus()
        }
      }, 100)
      
      return () => clearTimeout(focusTimer)
    }
  }, [animationPhase, question])
  
  // Phase 6: Screen reader announcement for question changes
  useEffect(() => {
    if (question && (animationPhase === 'ready' || animationPhase === 'idle')) {
      // Announce question change to screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = `Question ${questionNumber}${totalEstimatedQuestions ? ` of ${totalEstimatedQuestions}` : ''}: ${question.text}`
      
      document.body.appendChild(announcement)
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }, [question?.id, animationPhase, questionNumber, totalEstimatedQuestions])
  
  // Track question changes to force entrance animations
  // Use a state to track if this is a new question to ensure it persists across renders
  // Initialize based on whether this question ID is different from the previous one
  const [isNewQuestion, setIsNewQuestion] = useState(() => {
    const isNew = previousQuestionIdRef.current !== question.id
    if (isNew) {
      // Update ref immediately in initializer to prevent race conditions
      previousQuestionIdRef.current = question.id
    }
    return isNew
  })
  
  useEffect(() => {
    // Double-check if this is still a new question (in case ref was reset externally)
    const isActuallyNew = previousQuestionIdRef.current !== question.id
    if (isActuallyNew) {
      setIsNewQuestion(true)
      previousQuestionIdRef.current = question.id
    }
    // Don't reset isNewQuestion - let it persist until the question ID changes
    // This ensures animations work correctly even if the component re-renders
  }, [question.id])
  
  // Determine animation state based on phase
  const isExiting = animationPhase === 'questionExit'
  // Force entrance animation for new questions OR when explicitly in questionEnter/ready phase
  // For new questions, always animate in unless we're explicitly exiting
  const isEntering = animationPhase === 'questionEnter' || 
                     animationPhase === 'ready' || 
                     (isNewQuestion && animationPhase !== 'questionExit' && animationPhase !== 'processing')
  const isIdle = animationPhase === 'idle' || animationPhase === 'optionSelected'
  // Show during all phases except processing (including questionExit so exit animation can complete)
  const shouldShow = animationPhase !== 'processing'
  
  // Animation variants for different phases
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exiting: { opacity: 0, y: -10 }
  }
  
  const getAnimationState = () => {
    if (isExiting) return 'exiting'
    if (isEntering || isIdle) return 'visible'
    return 'hidden'
  }
  
  // Debug: Log animation phase changes
  useEffect(() => {
    const values = getAnimationValues()
    console.log('[QuestionDisplay] Animation phase:', animationPhase, 
      'Values:', values, 
      'isExiting:', isExiting, 
      'isEntering:', isEntering, 
      'shouldShow:', shouldShow,
      'Question ID:', question.id)
  }, [animationPhase, isExiting, isEntering, shouldShow, question.id])
  
  // Get adjusted timings for accessibility
  const adjustedTimings = getAdjustedTimings(prefersReducedMotion)
  
  // Calculate animation values based on phase
  const getAnimationValues = () => {
    if (isExiting) {
      return { opacity: 0, y: -40, scale: 0.96 } // Smooth exit animation
    }
    if (isEntering) {
      return { opacity: 1, y: 0, scale: 1 }
    }
    // For idle and optionSelected, keep visible
    return { opacity: 1, y: 0, scale: 1 }
  }
  
  // Memoize animation values to ensure they trigger re-renders
  const animationValues = getAnimationValues()
  // Use longer durations for more noticeable, polished animations
  const transitionDuration = isExiting 
    ? Math.max(adjustedTimings.QUESTION_FADE_DURATION / 1000, 0.5)
    : isEntering
    ? Math.max(adjustedTimings.CONTAINER_FADE_IN / 1000, 0.6)
    : 0.2
  
  // Exit animation duration (used by AnimatePresence)
  const exitDuration = Math.max(adjustedTimings.QUESTION_FADE_DURATION / 1000, 0.5)
  
  // Force re-render when animation phase changes to ensure animations trigger
  useEffect(() => {
    console.log('[QuestionDisplay] Phase changed, forcing update. Phase:', animationPhase, 'isExiting:', isExiting, 'isEntering:', isEntering, 'animationValues:', animationValues)
  }, [animationPhase, isExiting, isEntering, animationValues])
  
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
      
      {/* Question card with enhanced animations */}
      {/* AnimatePresence handles visibility, so we always render when shouldShow is true */}
      {shouldShow && (
        <motion.div
          key={`question-${question.id}`}
          ref={questionContainerRef}
          initial={isEntering ? { opacity: 0, y: 40, scale: 0.96 } : undefined}
          animate={isExiting ? { opacity: 0, y: -40, scale: 0.96 } : animationValues}
          exit={{ opacity: 0, y: -40, scale: 0.96 }}
          transition={{
            duration: isExiting ? exitDuration : transitionDuration,
            ease: isExiting ? EASINGS.OUT : EASINGS.IN_OUT,
          }}
          style={{
            pointerEvents: isExiting ? 'none' : undefined,
          }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          role="region"
          aria-labelledby={`question-${question.id}`}
          tabIndex={-1}
          onAnimationStart={() => {
            console.log('[QuestionDisplay] Animation started:', animationPhase, 'animate:', isExiting ? 'EXITING' : JSON.stringify(animationValues), 'isExiting:', isExiting, 'isEntering:', isEntering, 'initial:', isEntering ? '{ opacity: 0, y: 30, scale: 0.95 }' : 'undefined')
          }}
          onAnimationComplete={() => {
            console.log('[QuestionDisplay] Animation completed:', animationPhase, 'isExiting:', isExiting)
          }}
        >
            {/* Question header */}
            <div className="p-6 border-b border-gray-100">
              <motion.h2 
                id={`question-${question.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={isEntering ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={isEntering ? {
                  delay: adjustedTimings.QUESTION_TEXT_DELAY / 1000,
                  duration: adjustedTimings.QUESTION_TEXT_DURATION / 1000,
                  ease: EASINGS.IN_OUT,
                } : { duration: 0 }}
                className="text-2xl font-semibold text-gray-900 leading-tight"
              >
                {question.text}
              </motion.h2>
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
                  selectedValue={selectedOptionId || undefined}
                  animationPhase={animationPhase}
                  firstOptionRef={firstOptionRef}
                />
              ) : question.inputType === 'text' ? (
                // Text input (for truly unique data like names, emails)
                <div className="space-y-4">
                  <div>
                    <input
                      ref={textInputRef}
                      type="text"
                      value={textValue}
                      onChange={(e) => {
                        setTextValue(e.target.value)
                        setError(null) // Clear error on change
                      }}
                      onKeyDown={handleTextKeyDown}
                      placeholder={question.placeholder || 'Enter your answer...'}
                      disabled={isSubmitting}
                      aria-label={question.text}
                      aria-describedby={error ? `input-error-${question.id}` : undefined}
                      aria-invalid={error ? 'true' : 'false'}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    />
                
                {/* Validation error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`input-error-${question.id}`}
                    className="text-sm text-red-600 mt-2"
                    role="alert"
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
              
              {/* Skip button for optional text questions */}
              <Button
                onClick={() => {
                  // Submit empty answer to skip
                  onAnswer('')
                }}
                disabled={isSubmitting}
                variant="ghost"
                className="w-full"
              >
                Skip
              </Button>
            </div>
              ) : question.inputType === 'textarea' ? (
                // Textarea input (for multiple URLs or longer text)
                <div className="space-y-4">
                  <div>
                    <textarea
                      ref={textareaRef}
                      value={textValue}
                      onChange={(e) => {
                        setTextValue(e.target.value)
                        setError(null) // Clear error on change
                      }}
                      onKeyDown={handleTextKeyDown}
                      placeholder={question.placeholder || 'Enter your answer...'}
                      disabled={isSubmitting}
                      rows={question.helperText?.toLowerCase().includes('url') || question.helperText?.toLowerCase().includes('link') ? 6 : 3}
                      aria-label={question.text}
                      aria-describedby={error ? `textarea-error-${question.id}` : undefined}
                      aria-invalid={error ? 'true' : 'false'}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors resize-none
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    />
                
                {/* Validation error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`textarea-error-${question.id}`}
                    className="text-sm text-red-600 mt-2"
                    role="alert"
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
              
              {/* Skip button for optional textarea questions */}
              <Button
                onClick={() => {
                  // Submit empty answer to skip
                  onAnswer('')
                }}
                disabled={isSubmitting}
                variant="ghost"
                className="w-full"
              >
                Skip
              </Button>
            </div>
              ) : null}
            </div>
          </motion.div>
        )}
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

