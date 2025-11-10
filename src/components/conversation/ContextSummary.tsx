'use client'

import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import type { ConversationIntelligence, ContextItem } from '@/types/conversation'

interface ContextSummaryProps {
  intelligence: ConversationIntelligence
  currentCategory: string
  questionNumber: number
  compact?: boolean // For mobile or minimal display
  className?: string
}

export const ContextSummary = memo(function ContextSummary({ 
  intelligence, 
  currentCategory,
  questionNumber,
  compact = false,
  className = ''
}: ContextSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)
  
  // Extract confirmed facts from intelligence
  const confirmedFacts = useMemo(
    () => extractConfirmedFacts(intelligence),
    [intelligence]
  )
  
  // Get relevant context based on current category
  const relevantContext = useMemo(
    () => getRelevantContext(
      confirmedFacts, 
      currentCategory,
      questionNumber
    ),
    [confirmedFacts, currentCategory, questionNumber]
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }
          }}
          aria-expanded={isExpanded}
          aria-controls="context-details"
          className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="font-medium">
            Your {intelligence.websiteType} project{intelligence.companyName ? ` for ${intelligence.companyName}` : ''}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="context-details"
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
      role="region"
      aria-label="Project context summary"
      aria-live="polite"
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
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.questionNumber === nextProps.questionNumber &&
    prevProps.currentCategory === nextProps.currentCategory &&
    JSON.stringify(prevProps.intelligence) === JSON.stringify(nextProps.intelligence) &&
    prevProps.compact === nextProps.compact
  )
})

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
    case 'section4_business_context':
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
    case 'section7_technical_specs':
    case 'section10_features_breakdown':
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
    case 'section9_design_direction':
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
    case 'section12_timeline':
    case 'section13_investment_summary':
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
    case 'section6_content_strategy':
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

