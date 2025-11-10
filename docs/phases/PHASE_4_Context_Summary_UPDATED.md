# Phase 4: Context Summary & Intelligence Display
**Days 11-13 | Introspect V3 Implementation**

## Overview

Build the context summary component that displays accumulated intelligence to users, creating trust and showing progress through the orchestration flow.

**Duration:** 3 days  
**Prerequisites:** Phases 1-3 complete  
**Deliverables:**
- Context Summary component with adaptive display
- Intelligence extraction utilities
- Category-aware context selection
- Mobile-responsive design
- Integration with question flow

---

## Why Context Summary Matters

### The Conversion Psychology Problem

Without visible accumulation of understanding, users experience:
- ❌ Repetitive question fatigue ("Why are you asking me this?")
- ❌ Loss of trust ("Is this system even remembering what I said?")
- ❌ Abandonment ("I already told you this")

With visible context, users experience:
- ✅ Confidence ("They're really understanding my project")
- ✅ Progress ("Look how much we've covered")
- ✅ Investment ("I've shared so much, I should finish")

### Design Principle

**Progressive Summarization** that shows:
1. What's been established (certainty)
2. What you're currently exploring (direction)
3. Why this question matters (relevance)

The balance: **Too much context = cognitive overload | Too little = feels mechanical**

---

## Core Component

**File:** `components/conversation/ContextSummary.tsx`

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { useState } from 'react'
import type { ConversationIntelligence } from '@/types/conversation'

interface ContextItem {
  label: string
  value: string
  category?: string
}

interface ContextSummaryProps {
  intelligence: ConversationIntelligence
  currentCategory: string
  questionNumber: number
  compact?: boolean // For mobile or minimal display
  className?: string
}

export function ContextSummary({ 
  intelligence, 
  currentCategory,
  questionNumber,
  compact = false,
  className = ''
}: ContextSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)
  
  // Extract confirmed facts from intelligence
  const confirmedFacts = extractConfirmedFacts(intelligence)
  
  // Get relevant context based on current category
  const relevantContext = getRelevantContext(
    confirmedFacts, 
    currentCategory,
    questionNumber
  )
  
  // Don't show context summary for first 6 foundation questions
  if (questionNumber <= 6) {
    return null
  }
  
  // Compact mobile view
  if (compact) {
    return (
      <div className={`mb-6 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="font-medium">
            Your {intelligence.websiteType} project for {intelligence.companyName}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {relevantContext.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium text-gray-900">{item.label}:</span>{' '}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
  
  // Full desktop view
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          What we know about your project
        </h3>
        <span className="text-xs text-gray-500">
          {relevantContext.length} {relevantContext.length === 1 ? 'detail' : 'details'}
        </span>
      </div>
      
      <div className="space-y-3">
        {relevantContext.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium text-gray-900">{item.label}:</span>{' '}
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
      
      {currentCategory && (
        <div className="mt-5 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            Currently exploring:{' '}
            <span className="font-medium text-gray-700">
              {formatCategoryName(currentCategory)}
            </span>
          </p>
        </div>
      )}
    </motion.div>
  )
}

// Extract confirmed facts from intelligence store
function extractConfirmedFacts(
  intelligence: ConversationIntelligence
): Record<string, string | undefined> {
  return {
    // Foundation data
    userName: intelligence.userName,
    userEmail: intelligence.userEmail,
    companyName: intelligence.companyName,
    websiteType: intelligence.websiteType,
    industry: intelligence.industry,
    
    // Business context
    targetAudience: intelligence.targetAudience,
    primaryGoal: intelligence.primaryGoal,
    problemBeingSolved: intelligence.problemBeingSolved,
    successMetrics: intelligence.successMetrics?.join(', '),
    
    // Technical requirements
    needsUserAccounts: intelligence.needsUserAccounts ? 'Yes' : undefined,
    needsCMS: intelligence.needsCMS ? 'Yes' : undefined,
    
    // Features (count if selected)
    selectedFeatures: intelligence.selectedFeatures?.length 
      ? `${intelligence.selectedFeatures.length} features selected`
      : undefined,
    
    // Design
    designStyle: intelligence.designStyle,
    
    // Timeline & Budget
    desiredTimeline: intelligence.desiredTimeline,
    budgetRange: intelligence.budgetRange,
  }
}

// Smart context selection based on current category and question number
function getRelevantContext(
  facts: Record<string, string | undefined>,
  category: string,
  questionNumber: number
): ContextItem[] {
  const context: ContextItem[] = []
  
  // Always show project basics (if available)
  if (facts.companyName) {
    context.push({ 
      label: 'Project', 
      value: facts.companyName,
      category: 'foundation'
    })
  }
  
  if (facts.websiteType) {
    context.push({ 
      label: 'Type', 
      value: facts.websiteType,
      category: 'foundation'
    })
  }
  
  if (facts.industry) {
    context.push({ 
      label: 'Industry', 
      value: facts.industry,
      category: 'foundation'
    })
  }
  
  // Add category-relevant context based on current question focus
  switch (category) {
    case 'business_context':
      if (facts.targetAudience) {
        context.push({ 
          label: 'Target audience', 
          value: facts.targetAudience,
          category: 'business'
        })
      }
      if (facts.problemBeingSolved) {
        context.push({ 
          label: 'Solving', 
          value: facts.problemBeingSolved,
          category: 'business'
        })
      }
      break
      
    case 'features':
    case 'technical_requirements':
      if (facts.primaryGoal) {
        context.push({ 
          label: 'Primary goal', 
          value: facts.primaryGoal,
          category: 'business'
        })
      }
      if (facts.targetAudience) {
        context.push({ 
          label: 'Target audience', 
          value: facts.targetAudience,
          category: 'business'
        })
      }
      if (facts.needsUserAccounts) {
        context.push({ 
          label: 'User accounts', 
          value: facts.needsUserAccounts,
          category: 'technical'
        })
      }
      if (facts.selectedFeatures) {
        context.push({ 
          label: 'Features', 
          value: facts.selectedFeatures,
          category: 'features'
        })
      }
      break
      
    case 'design':
      if (facts.targetAudience) {
        context.push({ 
          label: 'Designing for', 
          value: facts.targetAudience,
          category: 'business'
        })
      }
      if (facts.designStyle) {
        context.push({ 
          label: 'Style preference', 
          value: facts.designStyle,
          category: 'design'
        })
      }
      break
      
    case 'timeline_budget':
      if (facts.primaryGoal) {
        context.push({ 
          label: 'Primary goal', 
          value: facts.primaryGoal,
          category: 'business'
        })
      }
      if (facts.selectedFeatures) {
        context.push({ 
          label: 'Features', 
          value: facts.selectedFeatures,
          category: 'features'
        })
      }
      if (facts.desiredTimeline) {
        context.push({ 
          label: 'Timeline', 
          value: facts.desiredTimeline,
          category: 'timeline'
        })
      }
      break
      
    case 'content':
      if (facts.needsCMS) {
        context.push({ 
          label: 'Content management', 
          value: facts.needsCMS,
          category: 'technical'
        })
      }
      break
      
    default:
      // Show general business context for unknown categories
      if (facts.primaryGoal) {
        context.push({ 
          label: 'Primary goal', 
          value: facts.primaryGoal,
          category: 'business'
        })
      }
      if (facts.targetAudience) {
        context.push({ 
          label: 'Target audience', 
          value: facts.targetAudience,
          category: 'business'
        })
      }
  }
  
  // Limit to 5 most relevant items to avoid overwhelming
  return context.slice(0, 5)
}

// Format category names for display
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
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

## Adaptive Display Strategy

### Questions 1-6 (Foundation)
```typescript
// NO context summary shown
// Clean, minimal interface
// Users are just starting, nothing to show yet
if (questionNumber <= 6) {
  return null
}
```

### Questions 7-9 (Early Orchestration)
```typescript
// Compact context (1-3 key facts)
// Shows project name + type + industry
<ContextSummary 
  intelligence={intelligence}
  currentCategory={currentCategory}
  questionNumber={questionNumber}
  compact={true} // Mobile-style even on desktop for minimalism
/>
```

### Questions 10+ (Full Orchestration)
```typescript
// Full context panel
// 3-5 relevant facts based on current category
// Shows progression and builds confidence
<ContextSummary 
  intelligence={intelligence}
  currentCategory={currentCategory}
  questionNumber={questionNumber}
  compact={isMobile} // Full on desktop, collapsible on mobile
/>
```

---

## Integration with Question Flow

**File:** `components/conversation/QuestionDisplay.tsx`

```typescript
'use client'

import { ContextSummary } from './ContextSummary'
import { OptionSelector } from './OptionSelector'
import type { Question, ConversationIntelligence } from '@/types/conversation'

interface QuestionDisplayProps {
  question: Question
  intelligence: ConversationIntelligence
  questionNumber: number
  onAnswer: (answer: string) => void
}

export function QuestionDisplay({
  question,
  intelligence,
  questionNumber,
  onAnswer
}: QuestionDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Context appears ABOVE the current question */}
      <ContextSummary 
        intelligence={intelligence}
        currentCategory={question.category}
        questionNumber={questionNumber}
        compact={false} // Adjust based on viewport
      />
      
      {/* Question card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Question {questionNumber}
          </span>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">
            {question.text}
          </h2>
        </div>
        
        <OptionSelector
          options={question.options}
          onSelect={onAnswer}
        />
      </div>
    </div>
  )
}
```

---

## Mobile Responsive Behavior

### Breakpoint Strategy

```typescript
// hooks/useContextDisplay.ts
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function useContextDisplay(questionNumber: number) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  
  // Questions 1-6: Never show context
  if (questionNumber <= 6) {
    return { showContext: false, compact: false }
  }
  
  // Questions 7-9: Always compact
  if (questionNumber <= 9) {
    return { showContext: true, compact: true }
  }
  
  // Questions 10+: Responsive
  if (isMobile) {
    return { showContext: true, compact: true } // Collapsible on mobile
  }
  
  if (isTablet) {
    return { showContext: true, compact: false } // Full but condensed
  }
  
  return { showContext: true, compact: false } // Full display
}
```

### Usage

```typescript
export function ConversationPage() {
  const { showContext, compact } = useContextDisplay(questionNumber)
  
  return (
    <QuestionDisplay
      question={currentQuestion}
      intelligence={intelligence}
      questionNumber={questionNumber}
      contextConfig={{ show: showContext, compact }}
      onAnswer={handleAnswer}
    />
  )
}
```

---

## Styling & Design System Integration

### Tailwind Classes

```typescript
// Token-based spacing (8-point grid)
const spacing = {
  contextGap: 'mb-8',        // 32px between context and question
  itemGap: 'space-y-3',      // 12px between context items
  compactGap: 'mb-6',        // 24px for compact mode
}

// Typography (Perfect Fourth scale 1.333)
const typography = {
  contextTitle: 'text-sm font-semibold',   // 14px, 600 weight
  contextLabel: 'text-sm font-medium',     // 14px, 500 weight
  contextValue: 'text-sm',                 // 14px, 400 weight
  categoryLabel: 'text-xs',                // 12px
}

// Colors (OKLCH via Applicreations design system)
const colors = {
  border: 'border-gray-200',
  background: 'bg-gray-50',
  accent: 'bg-primary',         // Brand color
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textTertiary: 'text-gray-500',
}
```

### Animation Guidelines

```typescript
// Framer Motion variants
const contextVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: i * 0.05,  // Stagger items by 50ms
      duration: 0.2 
    }
  })
}
```

---

## Type Definitions

**File:** `types/conversation.ts`

```typescript
export interface ConversationIntelligence {
  // Foundation
  userName: string
  userEmail: string
  userPhone: string
  companyName: string
  websiteType: string
  industry: string
  
  // Business Context
  targetAudience?: string
  primaryGoal?: string
  problemBeingSolved?: string
  successMetrics?: string[]
  valueProposition?: string
  
  // Technical Requirements
  needsUserAccounts?: boolean
  authenticationMethod?: string
  needsCMS?: boolean
  cmsUpdateFrequency?: string
  needsSearch?: boolean
  
  // Features
  selectedFeatures?: string[]
  featurePricing?: Record<string, number>
  
  // Design
  designStyle?: string
  existingBrandAssets?: string[]
  
  // Timeline & Budget
  desiredTimeline?: string
  budgetRange?: string
  priority?: string
  
  // Content
  contentProvider?: string
  contentReadiness?: string
  
  // Integrations
  emailService?: string
  analyticsProvider?: string
  paymentProcessor?: string
  
  // Additional context
  [key: string]: any
}

export interface ContextItem {
  label: string
  value: string
  category?: 'foundation' | 'business' | 'technical' | 'features' | 'design' | 'timeline'
}
```

---

## Testing Requirements

### Visual Regression Tests

```typescript
// __tests__/ContextSummary.visual.test.tsx
import { render } from '@testing-library/react'
import { ContextSummary } from '@/components/conversation/ContextSummary'

describe('ContextSummary Visual States', () => {
  test('renders nothing for questions 1-6', () => {
    const { container } = render(
      <ContextSummary 
        intelligence={mockIntelligence}
        currentCategory="foundation"
        questionNumber={3}
      />
    )
    expect(container.firstChild).toBeNull()
  })
  
  test('renders compact for questions 7-9', () => {
    const { getByText } = render(
      <ContextSummary 
        intelligence={mockIntelligence}
        currentCategory="business_context"
        questionNumber={8}
        compact={true}
      />
    )
    expect(getByText(/Your.*project for/i)).toBeInTheDocument()
  })
  
  test('renders full panel for questions 10+', () => {
    const { getByText } = render(
      <ContextSummary 
        intelligence={mockIntelligence}
        currentCategory="features"
        questionNumber={12}
      />
    )
    expect(getByText('What we know about your project')).toBeInTheDocument()
  })
})
```

### Context Selection Logic Tests

```typescript
// __tests__/contextSelection.test.ts
import { getRelevantContext, extractConfirmedFacts } from './ContextSummary'

describe('Context Selection Logic', () => {
  test('selects business context for business_context category', () => {
    const facts = {
      companyName: 'Acme Corp',
      websiteType: 'E-commerce',
      targetAudience: 'Young professionals',
      primaryGoal: 'Increase sales'
    }
    
    const context = getRelevantContext(facts, 'business_context', 10)
    
    expect(context).toContainEqual(
      expect.objectContaining({ label: 'Target audience' })
    )
  })
  
  test('limits to 5 items maximum', () => {
    const facts = {
      companyName: 'Test',
      websiteType: 'Portfolio',
      industry: 'Design',
      targetAudience: 'Clients',
      primaryGoal: 'Get leads',
      designStyle: 'Modern',
      desiredTimeline: 'ASAP'
    }
    
    const context = getRelevantContext(facts, 'design', 15)
    
    expect(context.length).toBeLessThanOrEqual(5)
  })
})
```

### Integration Tests

```typescript
// __tests__/integration.test.tsx
describe('Context Summary Integration', () => {
  test('updates when intelligence changes', async () => {
    const { rerender, getByText } = render(
      <ContextSummary 
        intelligence={{ companyName: 'Test Co' }}
        currentCategory="business_context"
        questionNumber={10}
      />
    )
    
    expect(getByText('Test Co')).toBeInTheDocument()
    
    rerender(
      <ContextSummary 
        intelligence={{ 
          companyName: 'Test Co',
          targetAudience: 'Developers' 
        }}
        currentCategory="business_context"
        questionNumber={11}
      />
    )
    
    expect(getByText(/Developers/i)).toBeInTheDocument()
  })
})
```

---

## Performance Optimization

### Memoization Strategy

```typescript
import { useMemo } from 'react'

export function ContextSummary(props: ContextSummaryProps) {
  // Memoize expensive context extraction
  const confirmedFacts = useMemo(
    () => extractConfirmedFacts(props.intelligence),
    [props.intelligence]
  )
  
  // Memoize context selection
  const relevantContext = useMemo(
    () => getRelevantContext(
      confirmedFacts, 
      props.currentCategory,
      props.questionNumber
    ),
    [confirmedFacts, props.currentCategory, props.questionNumber]
  )
  
  // ... render logic
}
```

### Avoid Unnecessary Re-renders

```typescript
import { memo } from 'react'

export const ContextSummary = memo(
  function ContextSummary(props: ContextSummaryProps) {
    // Component implementation
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.questionNumber === nextProps.questionNumber &&
      prevProps.currentCategory === nextProps.currentCategory &&
      JSON.stringify(prevProps.intelligence) === JSON.stringify(nextProps.intelligence)
    )
  }
)
```

---

## Accessibility

### ARIA Labels

```typescript
<div 
  role="region"
  aria-label="Project context summary"
  aria-live="polite"
  className="..."
>
  {/* Context content */}
</div>
```

### Keyboard Navigation

```typescript
<button
  onClick={() => setIsExpanded(!isExpanded)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }}
  aria-expanded={isExpanded}
  aria-controls="context-details"
>
  {/* Button content */}
</button>
```

### Screen Reader Optimization

```typescript
// Announce changes to screen readers
<div aria-live="polite" className="sr-only">
  {relevantContext.length} project details confirmed
</div>
```

---

## Success Criteria

### Functional Requirements
- ✅ No context shown for questions 1-6
- ✅ Compact display for questions 7-9
- ✅ Full display for questions 10+
- ✅ Category-aware context selection
- ✅ Maximum 5 context items displayed
- ✅ Smooth animations between states
- ✅ Mobile-responsive collapse behavior

### User Experience
- ✅ Users feel the system is "listening"
- ✅ Progress is visually apparent
- ✅ Context never feels overwhelming
- ✅ Relevant information shown for current question
- ✅ No repetitive or redundant data

### Performance
- ✅ Context extraction < 5ms
- ✅ Re-render only when intelligence changes
- ✅ Smooth animations (60fps)
- ✅ No layout shifts

### Design System Compliance
- ✅ 8-point spacing grid
- ✅ Perfect Fourth typography scale
- ✅ OKLCH color system
- ✅ Framer Motion animations
- ✅ Mobile-first responsive design

---

## Next Steps

After Phase 4 completion:

1. **Phase 5**: Option Selector component (radio/card selections)
2. **Phase 6**: Feature Chip interface for feature selection
3. **Phase 7**: SCOPE.md section progress indicator
4. **Phase 8**: Validation screen for Claude confirmations

Each phase builds on the Context Summary foundation to create the complete orchestration UI.
