'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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
  const [selectedRadioValue, setSelectedRadioValue] = useState<string | null>(null)
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
  
  // Reset selectedRadioValue when question changes
  useEffect(() => {
    if (previousQuestionIdRef.current !== question.id) {
      setSelectedRadioValue(null)
    }
  }, [question.id])
  
  // Sync selectedRadioValue with selectedOptionId if selectedOptionId is set but selectedRadioValue is not
  useEffect(() => {
    if (selectedOptionId && !selectedRadioValue && question.inputType === 'radio' && question.options.length > 2) {
      setSelectedRadioValue(selectedOptionId)
    }
  }, [selectedOptionId, selectedRadioValue, question])
  
  // Track question changes to force entrance animations
  // CRITICAL FIX: Always detect new questions by comparing question IDs
  // This ensures entrance animations trigger correctly with AnimatePresence
  const [isNewQuestion, setIsNewQuestion] = useState(() => {
    const isNew = previousQuestionIdRef.current !== question.id
    if (isNew) {
      // Update ref immediately in initializer to prevent race conditions
      previousQuestionIdRef.current = question.id
    }
    return isNew
  })
  
  // Track the previous question ID to detect changes
  const prevQuestionIdRef = useRef<string | null>(null)
  
  useEffect(() => {
    // Detect question ID changes - this is the source of truth for new questions
    const isActuallyNew = prevQuestionIdRef.current !== question.id
    if (isActuallyNew) {
      console.log('[QuestionDisplay] New question detected:', question.id, 'Previous:', prevQuestionIdRef.current)
      setIsNewQuestion(true)
      prevQuestionIdRef.current = question.id
      previousQuestionIdRef.current = question.id
    }
    // Reset isNewQuestion flag after entrance animation completes
    // This ensures we don't re-trigger entrance if component re-renders with same question
    if (isActuallyNew && (animationPhase === 'ready' || animationPhase === 'idle')) {
      // Keep isNewQuestion true during entrance, reset after ready/idle
      // Small delay to ensure animation completes
      const timer = setTimeout(() => {
        setIsNewQuestion(false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [question.id, animationPhase])
  
  // Determine animation state based on phase
  const isExiting = animationPhase === 'questionExit'
  // Force entrance animation for new questions OR when explicitly in questionEnter/ready phase
  // For new questions, always animate in unless we're explicitly exiting
  const isEntering = animationPhase === 'questionEnter' || 
                     animationPhase === 'ready' || 
                     (isNewQuestion && animationPhase !== 'questionExit' && animationPhase !== 'processing')
  const isIdle = animationPhase === 'idle' || animationPhase === 'optionSelected'
  // CRITICAL FIX: Show during all phases except processing
  // Must show during questionExit so AnimatePresence can complete exit animation
  // Must show during questionEnter/ready so entrance animation can play
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
  
  // CRITICAL FIX: Consistent animation durations
  // Exit: Use QUESTION_FADE_DURATION (500ms) for smooth exit
  // Entrance: Use CONTAINER_FADE_IN (600ms) for smooth entrance
  // Ensure minimum durations for visibility
  const exitDuration = Math.max(adjustedTimings.QUESTION_FADE_DURATION / 1000, 0.5)
  const entranceDuration = Math.max(adjustedTimings.CONTAINER_FADE_IN / 1000, 0.6)
  
  const transitionDuration = isExiting 
    ? exitDuration
    : isEntering
    ? entranceDuration
    : 0.2
  
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
    
    // Validate against question rules if present (only for text/textarea types)
    if ((question.inputType === 'text' || question.inputType === 'textarea') && question.validation) {
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
    <div className={className}>
      {/* Context Summary removed - no longer displayed */}
      
      {/* Question card with enhanced animations */}
      {/* CRITICAL FIX: AnimatePresence needs component mounted during questionExit to complete exit animation */}
      {/* Only hide during processing phase - show during all other phases including questionExit */}
      {shouldShow && (
        <motion.div
          key={`question-${question.id}`}
          ref={questionContainerRef}
          // CRITICAL FIX: Always set initial for new questions (detected by isNewQuestion or isEntering)
          // With AnimatePresence mode="wait", new components always mount fresh, so isNewQuestion should be true
          // But we also check isEntering as a fallback for cases where animation phase is set explicitly
          // Use false instead of undefined to prevent initial animation if component re-renders with same question
          initial={isEntering || isNewQuestion ? { opacity: 0, y: 40, scale: 0.96 } : false}
          animate={isExiting ? { opacity: 0, y: -40, scale: 0.96 } : animationValues}
          exit={{ opacity: 0, y: -40, scale: 0.96 }}
          transition={{
            duration: isExiting ? exitDuration : transitionDuration,
            ease: isExiting ? EASINGS.OUT : EASINGS.IN_OUT,
          }}
          style={{
            pointerEvents: isExiting ? 'none' : undefined,
          }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col w-full max-w-4xl mx-auto"
          role="region"
          aria-labelledby={`question-${question.id}`}
          tabIndex={-1}
          onAnimationStart={() => {
            console.log('[QuestionDisplay] Animation started:', animationPhase, 'animate:', isExiting ? 'EXITING' : JSON.stringify(animationValues), 'isExiting:', isExiting, 'isEntering:', isEntering, 'isNewQuestion:', isNewQuestion, 'initial:', isEntering || isNewQuestion ? '{ opacity: 0, y: 40, scale: 0.96 }' : 'false')
          }}
          onAnimationComplete={() => {
            console.log('[QuestionDisplay] Animation completed:', animationPhase, 'isExiting:', isExiting, 'isEntering:', isEntering)
          }}
        >
            {/* Question header */}
            <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
              <motion.h2 
                id={`question-${question.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={isEntering ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={isEntering ? {
                  delay: adjustedTimings.QUESTION_TEXT_DELAY / 1000,
                  duration: adjustedTimings.QUESTION_TEXT_DURATION / 1000,
                  ease: EASINGS.IN_OUT,
                } : { duration: 0 }}
                className="text-xl font-semibold text-gray-900 leading-tight"
              >
                {question.text}
              </motion.h2>
          {/* Helper text */}
          {question.helperText && (
            <p className="text-sm text-gray-600 mt-2 mb-1">
              {question.helperText}
            </p>
          )}
          {/* Dynamic helper text for radio questions */}
          {question.inputType === 'radio' && (
            <p className="text-sm text-gray-500 mt-2 mb-1">
              {question.options.length === 2 
                ? 'Choose only 1'
                : question.options.length > 2
                ? 'Choose the 1 best answer'
                : ''}
            </p>
          )}
        </div>
        
            {/* Question body */}
            <div className={`px-6 py-4 ${question.inputType === 'radio' ? 'flex-shrink-0' : 'flex-1 min-h-0'}`}>
              {question.inputType === 'radio' ? (
                // Multiple choice options
                <OptionSelector
                  options={question.options}
                  onSelect={question.options.length === 2 
                    ? onAnswer // Immediate submission for 2 options
                    : (value) => setSelectedRadioValue(value) // Delayed submission for >2 options
                  }
                  disabled={isSubmitting}
                  selectedValue={selectedRadioValue || selectedOptionId || undefined}
                  animationPhase={animationPhase}
                  firstOptionRef={firstOptionRef}
                  immediateSubmit={question.options.length === 2}
                />
              ) : question.inputType === 'text' ? (
                // Text input (for truly unique data like names, emails)
                <div className="space-y-3">
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
                        flex h-10 w-full rounded-lg border transition-colors text-sm
                        px-4 text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        placeholder:text-gray-400
                        ${error 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    />
                  </div>
                  
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
                  {question.inputType === 'text' && question.validation?.maxLength && (
                    <p className="text-xs text-gray-500 mt-2">
                      {textValue.length} / {question.validation.maxLength} characters
                    </p>
                  )}
                </div>
              ) : question.inputType === 'textarea' ? (
                // Textarea input (for multiple URLs or longer text)
                <div className="space-y-3">
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
                      rows={question.helperText?.toLowerCase().includes('url') || question.helperText?.toLowerCase().includes('link') ? 4 : 3}
                      aria-label={question.text}
                      aria-describedby={error ? `textarea-error-${question.id}` : undefined}
                      aria-invalid={error ? 'true' : 'false'}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-colors resize-none text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    />
                  </div>
                  
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
                  {question.inputType === 'textarea' && question.validation?.maxLength && (
                    <p className="text-xs text-gray-500 mt-2">
                      {textValue.length} / {question.validation.maxLength} characters
                    </p>
                  )}
                </div>
              ) : null}
            </div>
            
            {/* Buttons Footer */}
            {(question.inputType === 'radio' && question.options.length > 2) ||
             question.inputType === 'text' ||
             question.inputType === 'textarea' ? (
              <div className="px-6 pt-4 pb-5 border-t border-gray-100 space-y-2.5 flex-shrink-0">
                {/* Continue button for radio questions with more than 2 options */}
                {question.inputType === 'radio' && question.options.length > 2 && (
                  <Button
                    onClick={() => {
                      const valueToSubmit = selectedRadioValue || selectedOptionId || ''
                      if (valueToSubmit) {
                        onAnswer(valueToSubmit)
                      }
                    }}
                    disabled={isSubmitting || !(selectedRadioValue || selectedOptionId)}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                  </Button>
                )}
                
                {/* Continue button for text questions */}
                {question.inputType === 'text' && (
                  <>
                    <Button
                      onClick={handleTextSubmit}
                      disabled={isSubmitting || !textValue.trim()}
                      className="w-full h-12 text-base font-semibold"
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
                      className="w-full h-9 text-sm"
                    >
                      Skip
                    </Button>
                  </>
                )}
                
                {/* Continue button for textarea questions */}
                {question.inputType === 'textarea' && (
                  <>
                    <Button
                      onClick={handleTextSubmit}
                      disabled={isSubmitting || !textValue.trim()}
                      className="w-full h-12 text-base font-semibold"
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
                      className="w-full h-9 text-sm"
                    >
                      Skip
                    </Button>
                  </>
                )}
              </div>
            ) : null}
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

