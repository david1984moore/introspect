'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Info, Check } from 'lucide-react'
import { ScopeProgressBar } from './ScopeProgressBar'
import type { ScopeProgress } from '@/types/scopeProgress'
import type { ConversationFact } from '@/types/conversation'

interface ScopeProgressPanelProps {
  progress: ScopeProgress
  variant?: 'full' | 'compact' | 'minimal' | 'answers-only'
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
  answeredQuestions?: ConversationFact[] // New prop for answered questions
}

export function ScopeProgressPanel({
  progress,
  variant = 'compact',
  collapsible = false,
  defaultExpanded = false,
  className = '',
  answeredQuestions = []
}: ScopeProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  if (variant === 'minimal') {
    // Just the progress bar
    return (
      <div className={className}>
        <ScopeProgressBar progress={progress} />
      </div>
    )
  }
  
  if (variant === 'answers-only') {
    // Just the answered questions list, no progress bar
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        {collapsible ? (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <span className="font-medium">Section Progress</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200">
                    {answeredQuestions.length > 0 ? (
                      <AnsweredQuestionsList facts={answeredQuestions} />
                    ) : (
                      <div className="text-xs text-gray-400 text-center py-4">
                        No questions answered yet
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div>
            {answeredQuestions.length > 0 ? (
              <AnsweredQuestionsList facts={answeredQuestions} />
            ) : (
              <div className="text-xs text-gray-400 text-center py-4">
                No questions answered yet
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  
  if (variant === 'compact') {
    // Progress bar + collapsible answered questions list
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="mb-4">
          <ScopeProgressBar progress={progress} showDetails />
        </div>
        
        {collapsible ? (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="font-medium">Section Progress</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {answeredQuestions.length > 0 ? (
                      <AnsweredQuestionsList facts={answeredQuestions} />
                    ) : (
                      <div className="text-xs text-gray-400 text-center py-4">
                        No questions answered yet
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {answeredQuestions.length > 0 ? (
              <AnsweredQuestionsList facts={answeredQuestions} />
            ) : (
              <div className="text-xs text-gray-400 text-center py-4">
                No questions answered yet
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  
  // Full view with all sections
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Scope Progress
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
        <ScopeProgressBar progress={progress} showDetails />
      </div>
      
      {answeredQuestions.length > 0 ? (
        <AnsweredQuestionsList facts={answeredQuestions} />
      ) : (
        <div className="text-xs text-gray-400 text-center py-4">
          No questions answered yet
        </div>
      )}
    </div>
  )
}

/**
 * Component to display answered questions with checkmarks
 */
function AnsweredQuestionsList({ facts }: { facts: ConversationFact[] }) {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {facts.map((fact) => (
        <div
          key={fact.id}
          className="flex items-start gap-2 text-xs text-gray-600"
        >
          <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{formatFactForDisplay(fact)}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Format fact for display in plain English
 */
function formatFactForDisplay(fact: ConversationFact): string {
  // Convert fact keys to human-readable format
  const keyLabels: Record<string, string> = {
    'contact_name': 'Contact',
    'contact_email': 'Email',
    'contact_phone': 'Phone',
    'business_name': 'Business Name',
    'business_description': 'Business Description',
    'target_audience': 'Target Audience',
    'services_offered': 'Services',
    'project_purpose': 'Purpose',
    'project_timeline': 'Timeline',
    'budget_indication': 'Budget',
    'auth_method': 'Authentication',
    'cms_type': 'CMS',
    'payment_provider': 'Payment',
    'existing_branding': 'Branding',
    'design_style': 'Design Style',
    'website_type': 'Website Type',
  }
  
  let label: string
  
  // Handle answer_ prefixed keys (from fallback fact extraction)
  if (fact.key.startsWith('answer_')) {
    // Extract the question text from the key (everything after "answer_")
    const questionKey = fact.key.replace(/^answer_/, '')
    
    // Map common question patterns to clean labels
    const questionPatterns: Record<string, string> = {
      'what_s_the_name_of_your_business': 'Business Name',
      'what_s_your_business_name': 'Business Name',
      'what_is_your_business_name': 'Business Name',
      'name_of_your_business': 'Business Name',
      'business_name': 'Business Name',
      'what_do_you_do': 'What You Do',
      'what_does_your_business_do': 'What You Do',
      'what_services_do_you_offer': 'Services',
      'what_services': 'Services',
      'who_is_your_target_audience': 'Target Audience',
      'who_are_your_customers': 'Target Audience',
      'target_audience': 'Target Audience',
      'what_are_your_goals': 'Goals',
      'what_is_your_goal': 'Goals',
      'primary_goal': 'Primary Goal',
      'what_is_your_budget': 'Budget',
      'budget': 'Budget',
      'when_do_you_need_this': 'Timeline',
      'timeline': 'Timeline',
      'what_tools_do_you_use': 'Current Tools',
      'tools': 'Current Tools',
      'what_systems_do_you_need': 'Systems Needed',
      'systems': 'Systems Needed',
      'do_you_have_brand_materials': 'Brand Materials',
      'brand_materials': 'Brand Materials',
      'will_people_need_to_log_in': 'User Accounts',
      'user_accounts': 'User Accounts',
      'how_complex_are_your_systems': 'System Complexity',
      'complexity': 'System Complexity',
      'what_s_most_important': 'Most Important',
      'most_important': 'Most Important',
    }
    
    // Check if we have a pattern match
    const matchedPattern = Object.keys(questionPatterns).find(pattern => 
      questionKey.includes(pattern) || pattern.includes(questionKey)
    )
    
    if (matchedPattern) {
      label = questionPatterns[matchedPattern]
    } else {
      // Extract meaningful words from the question key
      // Remove common question words and extract the main topic
      const cleaned = questionKey
        .replace(/^(what|who|when|where|why|how|do|does|is|are|will|can)_/i, '')
        .replace(/_/g, ' ')
        .split(' ')
        .filter(word => word.length > 2) // Remove short words
        .slice(0, 3) // Take first 3 meaningful words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      label = cleaned || questionKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  } else {
    // Use predefined labels or format the key
    label = keyLabels[fact.key] || fact.key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // Convert value to plain English (replace underscores with spaces, use title case)
  let value = fact.value
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  // Truncate long values for readability
  value = value.length > 40 
    ? value.substring(0, 37) + '...' 
    : value
  
  return `${label}: ${value}`
}

