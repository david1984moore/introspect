'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import type { QuestionOption } from '@/types/conversation'

interface OptionSelectorProps {
  options: QuestionOption[]
  onSelect: (value: string) => void
  selectedValue?: string // For showing current selection
  disabled?: boolean
  className?: string
}

export function OptionSelector({
  options,
  onSelect,
  selectedValue,
  disabled = false,
  className = ''
}: OptionSelectorProps) {
  const [textInput, setTextInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  
  // Handle option click
  const handleOptionClick = (option: QuestionOption) => {
    if (disabled) return
    
    if (option.allowText) {
      // "Something else" option - show text input
      setShowTextInput(true)
    } else {
      // Regular option - submit immediately
      onSelect(option.value)
    }
  }
  
  // Handle "Something else" text submission
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onSelect(textInput.trim())
      setTextInput('')
      setShowTextInput(false)
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
      {/* Radio-style options */}
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value
          const isHovered = hoveredOption === option.value
          const isSomethingElse = option.allowText
          
          return (
            <motion.button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={disabled}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isHovered && !isSelected ? 'shadow-sm' : ''}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              `}
              type="button"
              role="radio"
              aria-checked={isSelected}
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
                
                {/* Arrow indicator on hover for non-text options */}
                {!isSomethingElse && isHovered && !isSelected && (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
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
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

