# Phase 5: Option Selector & Question Display Components
**Days 14-16 | Introspect V3 Implementation**

## Overview

Build the core UI components that execute Phase 3's orchestration architecture: intelligent option display with contextual choices and "Something else" fallback.

**Duration:** 2-3 days  
**Prerequisites:** Phases 1-4 complete  
**Deliverables:**
- OptionSelector component with radio/card display
- QuestionDisplay component integrating context + options
- Type-aware option rendering
- "Something else" text input fallback
- Mobile-responsive design
- Complete integration with Phase 4's ContextSummary

---

## Why This Phase Matters

### From Phase 3's Architecture to Working UI

Phase 3 defines **WHAT** the orchestration system should do:
- Generate 3-6 contextual options for most questions
- Always include "Something else" as escape hatch
- Adapt options to website type and accumulated intelligence
- Present options in scannable, decision-friendly format

Phase 5 builds **HOW** this actually works in the browser.

### The UX Psychology

**Multiple choice options solve critical conversion problems:**

❌ **Without options (text input only):**
- Users face blank text box paralysis
- Unclear what level of detail to provide
- Higher cognitive load = higher abandonment
- No guidance toward better answers

✅ **With smart options:**
- Users see "acceptable answers" immediately
- Cognitive load reduced to recognition vs. recall
- Options guide toward complete, useful responses
- "Something else" preserves flexibility without overwhelming

---

## Core Component Architecture

### File Structure
```
components/
  conversation/
    OptionSelector.tsx          ← NEW: This phase
    QuestionDisplay.tsx         ← NEW: This phase
    ContextSummary.tsx          ← EXISTS: Phase 4
    FeatureChipGrid.tsx         ← FUTURE: Phase 6
    
types/
  conversation.ts               ← EXTENDED: New types for options
  
lib/
  utils/
    optionHelpers.ts            ← NEW: Option formatting utilities
```

---

## Part 1: Core Types

**File:** `types/conversation.ts` (additions)

```typescript
// Existing types from previous phases...

export interface Option {
  value: string
  label: string
  description?: string // Optional 1-line explanation
  allowText?: boolean  // If true, shows text input on selection (for "Something else")
  recommended?: boolean // Visual indicator for Claude's recommendation
}

export interface Question {
  id: string
  text: string
  inputType: 'radio' | 'text' | 'chips' // 'chips' comes in Phase 6
  options?: Option[] // Present for radio questions
  category: string // Maps to SCOPE.md sections
  placeholder?: string // For text input questions
  validation?: QuestionValidation
}

export interface QuestionValidation {
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: string // Regex pattern for validation
  errorMessage?: string
}

export interface QuestionAnswer {
  questionId: string
  value: string // Selected option value OR text input
  optionLabel?: string // For analytics: what did they actually see?
  timestamp: string
  questionNumber: number
}

// For tracking question flow state
export interface QuestionFlowState {
  currentQuestion: Question
  questionNumber: number
  totalEstimatedQuestions: number // Dynamic based on complexity
  answeredQuestions: QuestionAnswer[]
  currentCategory: string
}
```

---

## Part 2: OptionSelector Component

**File:** `components/conversation/OptionSelector.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import type { Option } from '@/types/conversation'

interface OptionSelectorProps {
  options: Option[]
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
  const handleOptionClick = (option: Option) => {
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
    }
  }
  
  // Keyboard handling for text input
  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textInput.trim()) {
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
                    hover:bg-primary-dark transition-colors
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
```

---

## Part 3: QuestionDisplay Component

**File:** `components/conversation/QuestionDisplay.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContextSummary } from './ContextSummary'
import { OptionSelector } from './OptionSelector'
import type { Question, ConversationIntelligence } from '@/types/conversation'

interface QuestionDisplayProps {
  question: Question
  intelligence: ConversationIntelligence
  questionNumber: number
  totalEstimatedQuestions?: number
  onAnswer: (value: string) => void
  isSubmitting?: boolean
  className?: string
}

export function QuestionDisplay({
  question,
  intelligence,
  questionNumber,
  totalEstimatedQuestions,
  onAnswer,
  isSubmitting = false,
  className = ''
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
      <ContextSummary 
        intelligence={intelligence}
        currentCategory={question.category}
        questionNumber={questionNumber}
      />
      
      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Question header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Question {questionNumber}
              {totalEstimatedQuestions && ` of ~${totalEstimatedQuestions}`}
            </span>
            
            {/* Progress indicator */}
            {totalEstimatedQuestions && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(questionNumber / totalEstimatedQuestions) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round((questionNumber / totalEstimatedQuestions) * 100)}%
                </span>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
            {question.text}
          </h2>
        </div>
        
        {/* Question body */}
        <div className="p-6">
          {question.inputType === 'radio' && question.options ? (
            // Multiple choice options
            <OptionSelector
              options={question.options}
              onSelect={onAnswer}
              disabled={isSubmitting}
            />
          ) : question.inputType === 'text' ? (
            // Text input (for truly unique data like names, emails)
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
                  rows={3}
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
              
              <button
                onClick={handleTextSubmit}
                disabled={isSubmitting || !textValue.trim()}
                className="
                  w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-medium
                  hover:bg-primary-dark transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                "
                type="button"
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
      
      {/* Optional help text or category indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Currently exploring: <span className="font-medium text-gray-700">
            {formatCategoryName(question.category)}
          </span>
        </p>
      </div>
    </div>
  )
}

// Helper function to format category names
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    foundation: 'Foundation',
    business_context: 'Business Context',
    features: 'Features & Functionality',
    technical_requirements: 'Technical Requirements',
    design: 'Design & Branding',
    timeline_budget: 'Timeline & Budget',
    content: 'Content Strategy',
    integrations: 'Integrations & Tools',
  }
  
  return categoryMap[category] || category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
```

---

## Part 4: Option Helper Utilities

**File:** `lib/utils/optionHelpers.ts`

```typescript
import type { Option } from '@/types/conversation'

/**
 * Ensures every option array has "Something else" as the last option
 * (except for specific cases like feature chips where it should be omitted)
 */
export function ensureSomethingElseOption(
  options: Option[],
  includeSomethingElse: boolean = true
): Option[] {
  if (!includeSomethingElse) {
    return options
  }
  
  // Check if "Something else" already exists
  const hasSomethingElse = options.some(opt => opt.allowText)
  
  if (!hasSomethingElse) {
    return [
      ...options,
      {
        value: 'other',
        label: 'Something else',
        allowText: true
      }
    ]
  }
  
  return options
}

/**
 * Format options for display based on website type and context
 */
export function formatOptionsForType(
  baseOptions: string[],
  websiteType: string,
  context?: string
): Option[] {
  return baseOptions.map(option => ({
    value: option.toLowerCase().replace(/\s+/g, '_'),
    label: option,
  }))
}

/**
 * Add descriptions to options based on context
 */
export function enrichOptionsWithDescriptions(
  options: Option[],
  descriptions: Record<string, string>
): Option[] {
  return options.map(option => ({
    ...option,
    description: descriptions[option.value] || option.description
  }))
}

/**
 * Mark recommended option (typically the first/most common choice)
 */
export function markRecommendedOption(
  options: Option[],
  recommendedValue: string
): Option[] {
  return options.map(option => ({
    ...option,
    recommended: option.value === recommendedValue
  }))
}

/**
 * Validate that options array meets Phase 3 requirements
 */
export function validateOptions(options: Option[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!options || options.length === 0) {
    errors.push('Options array cannot be empty')
  }
  
  if (options.length < 3 && !options.some(opt => opt.allowText)) {
    errors.push('Should have at least 3 options (including "Something else")')
  }
  
  if (options.length > 7) {
    errors.push('Should have at most 6 options plus "Something else" (7 total)')
  }
  
  // Check for "Something else" in non-feature questions
  const hasSomethingElse = options.some(opt => opt.allowText)
  if (!hasSomethingElse) {
    errors.push('Regular questions should include "Something else" option')
  }
  
  // Validate option structure
  options.forEach((opt, index) => {
    if (!opt.value) {
      errors.push(`Option ${index + 1} missing value`)
    }
    if (!opt.label) {
      errors.push(`Option ${index + 1} missing label`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## Part 5: Integration Example

**File:** `app/conversation/[id]/page.tsx` (example usage)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { QuestionDisplay } from '@/components/conversation/QuestionDisplay'
import { useConversationStore } from '@/lib/stores/conversationStore'
import type { Question } from '@/types/conversation'

export default function ConversationPage({ params }: { params: { id: string } }) {
  const { 
    intelligence, 
    currentQuestion, 
    questionNumber,
    submitAnswer 
  } = useConversationStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleAnswer = async (value: string) => {
    setIsSubmitting(true)
    
    try {
      await submitAnswer({
        questionId: currentQuestion.id,
        value,
        timestamp: new Date().toISOString(),
        questionNumber
      })
    } catch (error) {
      console.error('Failed to submit answer:', error)
      // Show error toast/notification
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!currentQuestion) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <QuestionDisplay
        question={currentQuestion}
        intelligence={intelligence}
        questionNumber={questionNumber}
        totalEstimatedQuestions={30} // Dynamic based on complexity
        onAnswer={handleAnswer}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
```

---

## Part 6: Type-Aware Option Examples

### Portfolio Website Example

```typescript
// Question: "How do you want to organize your work?"
const portfolioOrganizationOptions: Option[] = [
  {
    value: 'chronological',
    label: 'By date (newest first)',
    description: 'Show your most recent work prominently'
  },
  {
    value: 'categories',
    label: 'By project type',
    description: 'Organize into categories like branding, web, print'
  },
  {
    value: 'featured',
    label: 'Featured projects',
    description: 'Manually curate your best work'
  },
  {
    value: 'other',
    label: 'Something else',
    allowText: true
  }
]
```

### E-commerce Example

```typescript
// Question: "How will customers browse products?"
const productBrowsingOptions: Option[] = [
  {
    value: 'categories',
    label: 'Category-based browsing',
    description: 'Organize products into clear categories',
    recommended: true // Most common approach
  },
  {
    value: 'search',
    label: 'Search-first approach',
    description: 'Powerful search with filters'
  },
  {
    value: 'collections',
    label: 'Curated collections',
    description: 'Hand-picked product groupings'
  },
  {
    value: 'hybrid',
    label: 'Combined approach',
    description: 'Categories + search + collections'
  },
  {
    value: 'other',
    label: 'Something else',
    allowText: true
  }
]
```

### Service Business Example

```typescript
// Question: "How should clients book consultations?"
const bookingOptions: Option[] = [
  {
    value: 'calendar',
    label: 'Direct calendar booking',
    description: 'Automated scheduling with availability',
    recommended: true
  },
  {
    value: 'form',
    label: 'Request form',
    description: 'Submit request, you confirm timing'
  },
  {
    value: 'contact',
    label: 'Contact to schedule',
    description: 'Traditional email/phone scheduling'
  },
  {
    value: 'other',
    label: 'Something else',
    allowText: true
  }
]
```

---

## Part 7: Mobile Responsive Design

### Breakpoint Strategy

```typescript
// Tailwind responsive classes used in components

// Mobile (default)
- Full-width buttons
- Stacked layout
- Larger touch targets (min 44px)
- Reduced padding

// Tablet (768px+)
- Cards can be wider
- Side-by-side for some options
- More padding

// Desktop (1024px+)
- Max-width container (672px = 2xl)
- Optimal line length
- Enhanced hover states
```

### Touch Optimization

```typescript
// Minimum touch target size
const TOUCH_TARGET_MIN = 'min-h-[44px]' // 44px Apple HIG standard

// Option buttons
className="p-4" // 16px padding = 48px min height with text

// Adequate spacing between options
className="space-y-2" // 8px between touch targets
```

---

## Part 8: Accessibility Requirements

### ARIA Labels

```typescript
// Radio group semantics
<div role="radiogroup" aria-labelledby="question-heading">
  <button role="radio" aria-checked={isSelected}>
    {/* Option content */}
  </button>
</div>

// Text input accessibility
<label htmlFor="custom-input" className="...">
  Please specify:
</label>
<input
  id="custom-input"
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? 'input-error' : undefined}
/>
{error && <p id="input-error">{error}</p>}
```

### Keyboard Navigation

```typescript
// Full keyboard support in OptionSelector
- Tab: Navigate between options
- Space/Enter: Select option
- Arrow keys: Navigate radio group (optional enhancement)

// Text input keyboard support
- Enter: Submit (without Shift)
- Shift+Enter: New line in textarea
- Escape: Cancel custom input (return to options)
```

### Screen Reader Support

```typescript
// Announce changes to screen readers
<div aria-live="polite" className="sr-only">
  Question {questionNumber} of {totalEstimated}. {question.text}
</div>

// Status messages
<div role="status" aria-live="polite">
  {isSubmitting && 'Submitting your answer...'}
</div>
```

---

## Part 9: Testing Requirements

### Unit Tests

```typescript
// __tests__/OptionSelector.test.tsx
import { render, fireEvent } from '@testing-library/react'
import { OptionSelector } from '@/components/conversation/OptionSelector'

describe('OptionSelector', () => {
  const mockOptions: Option[] = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'other', label: 'Something else', allowText: true }
  ]
  
  test('renders all options', () => {
    const { getByText } = render(
      <OptionSelector options={mockOptions} onSelect={() => {}} />
    )
    expect(getByText('Option 1')).toBeInTheDocument()
    expect(getByText('Option 2')).toBeInTheDocument()
    expect(getByText('Something else')).toBeInTheDocument()
  })
  
  test('calls onSelect when option clicked', () => {
    const onSelect = jest.fn()
    const { getByText } = render(
      <OptionSelector options={mockOptions} onSelect={onSelect} />
    )
    
    fireEvent.click(getByText('Option 1'))
    expect(onSelect).toHaveBeenCalledWith('opt1')
  })
  
  test('shows text input when "Something else" clicked', () => {
    const { getByText, getByPlaceholderText } = render(
      <OptionSelector options={mockOptions} onSelect={() => {}} />
    )
    
    fireEvent.click(getByText('Something else'))
    expect(getByPlaceholderText('Enter your answer...')).toBeInTheDocument()
  })
  
  test('submits custom text on continue', () => {
    const onSelect = jest.fn()
    const { getByText, getByPlaceholderText } = render(
      <OptionSelector options={mockOptions} onSelect={onSelect} />
    )
    
    fireEvent.click(getByText('Something else'))
    
    const input = getByPlaceholderText('Enter your answer...')
    fireEvent.change(input, { target: { value: 'Custom answer' } })
    fireEvent.click(getByText('Continue'))
    
    expect(onSelect).toHaveBeenCalledWith('Custom answer')
  })
  
  test('displays recommended badge', () => {
    const optionsWithRecommended: Option[] = [
      { value: 'opt1', label: 'Option 1', recommended: true },
      { value: 'opt2', label: 'Option 2' }
    ]
    
    const { getByText } = render(
      <OptionSelector options={optionsWithRecommended} onSelect={() => {}} />
    )
    
    expect(getByText('Recommended')).toBeInTheDocument()
  })
})
```

### Integration Tests

```typescript
// __tests__/QuestionDisplay.integration.test.tsx
describe('QuestionDisplay Integration', () => {
  test('integrates with ContextSummary for question 10+', () => {
    const { getByText } = render(
      <QuestionDisplay
        question={mockQuestion}
        intelligence={mockIntelligence}
        questionNumber={12}
        onAnswer={() => {}}
      />
    )
    
    // Context summary should be visible
    expect(getByText('What we know about your project')).toBeInTheDocument()
  })
  
  test('hides context for questions 1-6', () => {
    const { queryByText } = render(
      <QuestionDisplay
        question={mockQuestion}
        intelligence={mockIntelligence}
        questionNumber={3}
        onAnswer={() => {}}
      />
    )
    
    // Context summary should NOT appear
    expect(queryByText('What we know about your project')).not.toBeInTheDocument()
  })
  
  test('handles answer submission flow', async () => {
    const onAnswer = jest.fn()
    const { getByText } = render(
      <QuestionDisplay
        question={mockRadioQuestion}
        intelligence={mockIntelligence}
        questionNumber={10}
        onAnswer={onAnswer}
      />
    )
    
    // Click an option
    fireEvent.click(getByText('Option 1'))
    
    // Should call onAnswer immediately (no submit button for radio)
    expect(onAnswer).toHaveBeenCalledWith('opt1')
  })
})
```

### Visual Regression Tests

```typescript
// __tests__/visual/OptionSelector.visual.test.tsx
describe('OptionSelector Visual States', () => {
  test('default state', () => {
    const { container } = render(
      <OptionSelector options={mockOptions} onSelect={() => {}} />
    )
    expect(container).toMatchSnapshot()
  })
  
  test('with selected option', () => {
    const { container } = render(
      <OptionSelector 
        options={mockOptions} 
        selectedValue="opt1"
        onSelect={() => {}} 
      />
    )
    expect(container).toMatchSnapshot()
  })
  
  test('with text input visible', () => {
    const { container, getByText } = render(
      <OptionSelector options={mockOptions} onSelect={() => {}} />
    )
    fireEvent.click(getByText('Something else'))
    expect(container).toMatchSnapshot()
  })
})
```

---

## Part 10: Performance Optimization

### Component Memoization

```typescript
import { memo } from 'react'

// Memoize OptionSelector to prevent unnecessary re-renders
export const OptionSelector = memo(
  function OptionSelector(props: OptionSelectorProps) {
    // Component implementation
  },
  // Custom comparison
  (prevProps, nextProps) => {
    return (
      prevProps.selectedValue === nextProps.selectedValue &&
      prevProps.disabled === nextProps.disabled &&
      JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
    )
  }
)
```

### Animation Performance

```typescript
// Use Framer Motion's layout animations efficiently
// Avoid animating expensive properties (use transforms)

// Good: Transform-based animations
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
/>

// Avoid: Layout-triggering animations
// Don't animate width, height, padding in rapid succession
```

### Option Rendering Optimization

```typescript
// For long option lists (rare but possible), use virtual scrolling
// For typical 3-6 options, standard rendering is fine

// Lazy load descriptions only when hovered (if descriptions are heavy)
const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set())
```

---

## Part 11: Design System Compliance

### Typography Scale (Perfect Fourth: 1.333)

```typescript
// Text sizes used in components
const typography = {
  questionNumber: 'text-xs',      // 12px
  questionText: 'text-2xl',       // 24px (1.333^2 * 14px base)
  optionLabel: 'text-base',       // 16px
  optionDescription: 'text-sm',   // 14px
  helpText: 'text-xs',            // 12px
}
```

### Spacing (8-point grid)

```typescript
const spacing = {
  optionGap: 'space-y-2',         // 8px between options
  optionPadding: 'p-4',           // 16px internal padding
  sectionGap: 'space-y-6',        // 24px between major sections
  cardPadding: 'p-6',             // 24px card padding
}
```

### Colors (OKLCH via Applicreations system)

```typescript
// Using CSS variables from design system
const colors = {
  primary: 'bg-primary text-white',
  primaryHover: 'hover:bg-primary-dark',
  border: 'border-gray-200',
  borderHover: 'hover:border-gray-300',
  borderSelected: 'border-primary',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textTertiary: 'text-gray-500',
  backgroundCard: 'bg-white',
  backgroundSubtle: 'bg-gray-50',
}
```

---

## Part 12: Error Handling

### Input Validation Errors

```typescript
// Show inline errors without blocking flow
<motion.p
  initial={{ opacity: 0, y: -5 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-sm text-red-600 mt-2"
>
  {error}
</motion.p>
```

### Network Errors

```typescript
// Handle submission failures gracefully
try {
  await submitAnswer(value)
} catch (error) {
  // Show error toast
  toast.error('Failed to submit answer. Please try again.')
  // Keep user's input so they don't lose it
  // Allow retry
}
```

### Loading States

```typescript
// Show clear loading state during submission
{isSubmitting && (
  <div className="flex items-center gap-2 text-gray-600">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Submitting...</span>
  </div>
)}
```

---

## Part 13: Success Criteria

### Functional Requirements
- ✅ Options render as radio-style selections
- ✅ 3-6 options + "Something else" for regular questions
- ✅ "Something else" triggers text input fallback
- ✅ Text input questions work for unique data (names, emails)
- ✅ Validation errors display inline
- ✅ Radio selection submits immediately (no extra button)
- ✅ Text input requires explicit submit action
- ✅ Integration with ContextSummary (Phase 4)

### User Experience
- ✅ Options feel scannable and decision-friendly
- ✅ Hover states provide clear affordance
- ✅ Selected state is visually obvious
- ✅ "Recommended" badge guides choices subtly
- ✅ Smooth animations enhance (don't distract)
- ✅ Text input feels natural, not punishing
- ✅ Error messages are helpful, not shaming

### Performance
- ✅ Initial render < 100ms
- ✅ Option selection response immediate (< 16ms)
- ✅ Animations run at 60fps
- ✅ No layout shifts during interactions
- ✅ Text input debounced if triggering validation

### Design System
- ✅ 8-point spacing grid
- ✅ Perfect Fourth typography scale
- ✅ OKLCH color system
- ✅ Framer Motion animations
- ✅ Radix UI accessibility patterns
- ✅ Mobile-first responsive design

### Accessibility
- ✅ WCAG 2.1 Level AA compliant
- ✅ Full keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels and roles
- ✅ Touch target sizes (44px minimum)
- ✅ Color contrast ratios (4.5:1 text, 3:1 interactive)

---

## Part 14: Common Pitfalls to Avoid

### ❌ Anti-Pattern 1: Not Including "Something Else"
```typescript
// WRONG - No escape hatch for users
const options: Option[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
]

// CORRECT - Always include fallback (except features)
const options: Option[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'other', label: 'Something else', allowText: true }
]
```

### ❌ Anti-Pattern 2: Too Many Options
```typescript
// WRONG - Overwhelming choice paralysis
const options = [
  'Option 1', 'Option 2', 'Option 3', 'Option 4',
  'Option 5', 'Option 6', 'Option 7', 'Option 8',
  'Option 9', 'Option 10'
]

// CORRECT - 3-6 core options + "Something else"
const options = [
  'Most Common', 'Second Most Common', 'Third Option',
  'Something else'
]
```

### ❌ Anti-Pattern 3: Unclear Option Labels
```typescript
// WRONG - Vague, unhelpful
{ value: 'opt1', label: 'Option 1' }

// CORRECT - Specific, clear
{ 
  value: 'calendar',
  label: 'Direct calendar booking',
  description: 'Automated scheduling with availability'
}
```

### ❌ Anti-Pattern 4: Blocking Text Input
```typescript
// WRONG - Extra button for radio selection
<button onClick={() => onSelect(value)}>
  {/* Option content */}
</button>
<button>Submit</button> // ← Unnecessary friction

// CORRECT - Immediate submission on selection
<button onClick={() => onSelect(value)}>
  {/* Option content */}
  {/* Clicking selects AND submits */}
</button>
```

---

## Part 15: Integration Checklist

Before moving to Phase 6, verify:

### Component Integration
- [ ] OptionSelector renders correctly in isolation
- [ ] QuestionDisplay integrates ContextSummary properly
- [ ] Foundation questions (1-6) use text input appropriately
- [ ] Orchestrated questions (7+) use options
- [ ] Context summary appears/hides at correct thresholds

### State Management
- [ ] Answers store correctly in conversation state
- [ ] Intelligence updates after each answer
- [ ] Question number increments properly
- [ ] Progress percentage calculates accurately
- [ ] Category tracking works

### API Integration
- [ ] Submitting answers calls Claude orchestration
- [ ] Claude responses parse correctly
- [ ] Generated options display properly
- [ ] "Something else" text submits to Claude
- [ ] Error handling works for failed submissions

### Visual Polish
- [ ] Animations feel smooth and purposeful
- [ ] Hover states work on all interactive elements
- [ ] Focus states visible for keyboard navigation
- [ ] Loading states display during submission
- [ ] Error states communicate clearly

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Firefox
- [ ] Edge
- [ ] Android Chrome

### Accessibility Audit
- [ ] Screen reader announces questions correctly
- [ ] Keyboard navigation works completely
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets meet 44px minimum
- [ ] Focus indicators clearly visible

---

## Next Steps

After Phase 5 completion:

1. **Phase 6**: Feature Chip Interface (Questions 10-12)
   - Build visual chip selection component
   - Integrate Feature Library
   - Implement bundle pricing
   - Add conflict detection

2. **Phase 7**: SCOPE.md Progress Tracking UI
   - Show 14-section progress
   - Visual completion indicator
   - Section-by-section breakdown

3. **Phase 8**: Validation & Confirmation Screens
   - Display Claude's understanding validation
   - Feature conflict resolution UI
   - Assumption clarification

4. **Phase 9**: Complete SCOPE.md Generation
   - Implement all 14 sections
   - Feature Library pricing integration
   - Document validation

---

## Files to Create

When implementing this phase, create these files:

```
src/
├── components/
│   └── conversation/
│       ├── OptionSelector.tsx          ← NEW
│       ├── QuestionDisplay.tsx         ← NEW
│       └── ContextSummary.tsx          ← EXISTS (Phase 4)
│
├── lib/
│   └── utils/
│       └── optionHelpers.ts            ← NEW
│
├── types/
│   └── conversation.ts                 ← EXTEND
│
└── __tests__/
    ├── OptionSelector.test.tsx         ← NEW
    ├── QuestionDisplay.test.tsx        ← NEW
    ├── optionHelpers.test.ts           ← NEW
    └── integration/
        └── QuestionFlow.test.tsx       ← NEW
```

---

**Phase 5 builds the UI that executes Phase 3's intelligent orchestration. Once complete, users will experience the smooth, option-guided conversation flow that makes Introspect V3 convert.**

Ready to implement? Start with OptionSelector.tsx, then QuestionDisplay.tsx, then integration testing. Each component is self-contained and can be built and tested independently before integration.
