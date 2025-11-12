'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { TIMINGS, EASINGS, getAdjustedTimings } from '@/lib/animationTimings'
import type { QuestionOption, AnimationPhase } from '@/types/conversation'

interface OptionSelectorProps {
  options: QuestionOption[]
  onSelect: (value: string) => void
  selectedValue?: string // For showing current selection
  disabled?: boolean
  className?: string
  animationPhase?: AnimationPhase // Phase 3: Animation state
  firstOptionRef?: React.RefObject<HTMLButtonElement> // Phase 6: Ref for focus management
  immediateSubmit?: boolean // If false, don't submit immediately (for continue button flow)
}

export function OptionSelector({
  options,
  onSelect,
  selectedValue,
  disabled = false,
  className = '',
  animationPhase = 'idle',
  firstOptionRef,
  immediateSubmit = true
}: OptionSelectorProps) {
  const [textInput, setTextInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
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
  
  // Get adjusted timings for accessibility
  const adjustedTimings = getAdjustedTimings(prefersReducedMotion)
  
  // Determine animation state based on phase
  const isEntering = animationPhase === 'questionEnter' || animationPhase === 'ready'
  
  // Phase 6: Keyboard navigation for radio options
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return
    
    // Arrow key navigation - move focus and select
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const nextIndex = e.key === 'ArrowDown' 
        ? (currentIndex + 1) % options.length
        : (currentIndex - 1 + options.length) % options.length
      
      const nextOption = options[nextIndex]
      if (nextOption) {
        // Focus the next option button
        const nextButton = document.querySelector(`[data-option-index="${nextIndex}"]`) as HTMLButtonElement
        if (nextButton) {
          nextButton.focus()
        }
        
        // Auto-select if not "Something else" option
        if (!nextOption.allowText) {
          onSelect(nextOption.value)
        }
      }
    }
    // Space or Enter to select current option
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      const option = options[currentIndex]
      if (option) {
        handleOptionClick(option)
      }
    }
  }
  
  // Handle option click
  const handleOptionClick = (option: QuestionOption) => {
    if (disabled) return
    
    if (option.allowText) {
      // "Something else" option - show text input
      setShowTextInput(true)
    } else {
      // Regular option - submit immediately if immediateSubmit is true, otherwise just select
      if (immediateSubmit) {
        onSelect(option.value)
      } else {
        // For delayed submission, just call onSelect to update selection state
        // The parent component will handle showing the continue button
        onSelect(option.value)
      }
    }
  }
  
  // Handle "Something else" text submission
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      if (immediateSubmit) {
        // For immediate submission (2-option questions), submit and hide input
        onSelect(textInput.trim())
        setTextInput('')
        setShowTextInput(false)
      } else {
        // For delayed submission (>2-option questions), update selection but keep input visible
        // The parent component will handle showing the continue button
        onSelect(textInput.trim())
        // Keep textInput and showTextInput as-is so user can see what they entered
      }
    }
  }
  
  // Keyboard handling for text input
  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textInput.trim()) {
      e.preventDefault()
      handleTextSubmit()
    }
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Phase 6: Radio-style options with proper ARIA grouping */}
      <div className="space-y-2" role="radiogroup" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value
          const isSomethingElse = option.allowText
          
          // Calculate stagger delay for entrance animation
          const entranceDelay = isEntering 
            ? (adjustedTimings.QUESTION_TEXT_DELAY + adjustedTimings.QUESTION_TEXT_DURATION + (index * adjustedTimings.OPTION_STAGGER)) / 1000
            : index * 0.05
          
          return (
            <motion.button
              key={option.value}
              ref={index === 0 ? firstOptionRef : undefined}
              data-option-index={index}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ 
                delay: entranceDelay,
                duration: adjustedTimings.OPTION_ENTRANCE_DURATION / 1000,
                ease: EASINGS.IN_OUT
              }}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              `}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={disabled ? -1 : index === 0 || isSelected ? 0 : -1}
            >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <div 
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    transition-colors duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                
                {/* Option content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`
                      font-medium text-base
                      ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                    
                    {/* Recommended badge */}
                    {option.recommended && !isSelected && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  {/* Optional description */}
                  {option.description && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  )}
                </div>
                
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {/* "Something else" text input (appears when that option is clicked) */}
      <AnimatePresence>
        {showTextInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label htmlFor="custom-input" className="block text-sm font-medium text-gray-700 mb-2">
                Please specify:
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-input"
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                  placeholder="Enter your answer..."
                  disabled={disabled}
                  autoFocus
                  className="
                    flex-1 px-4 py-2 rounded-lg border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={disabled || !textInput.trim()}
                  className="
                    px-6 py-2 bg-primary text-white rounded-lg font-medium
                    hover:opacity-90 transition-opacity
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  "
                  type="button"
                >
                  {immediateSubmit ? 'Continue' : 'Done'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

