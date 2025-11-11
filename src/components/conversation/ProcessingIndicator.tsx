'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { TIMINGS } from '@/lib/animationTimings'
import type { ConversationFact } from '@/types/conversation'

interface ProcessingIndicatorProps {
  compressedFacts: ConversationFact[]
  visible: boolean
  className?: string
}

export function ProcessingIndicator({ 
  compressedFacts, 
  visible,
  className = '' 
}: ProcessingIndicatorProps) {
  if (!visible) return null
  
  // Show ALL facts being "processed" (all answered questions)
  const allFacts = compressedFacts
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: TIMINGS.PROCESSING_FADE_IN / 1000 }}
      className={`py-12 space-y-6 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Processing your response"
    >
      {/* Context-aware processing message */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-neutral-500 text-center font-light"
      >
        {getProcessingMessage(allFacts)}
      </motion.div>
    </motion.div>
  )
}

/**
 * Generate context-aware processing message based on fact types
 */
function getProcessingMessage(facts: ConversationFact[]): string {
  if (facts.length === 0) return 'Preparing your questions...'
  
  // Context-aware messages based on fact types
  const hasTimeline = facts.some(f => f.key.includes('timeline'))
  const hasBudget = facts.some(f => f.key.includes('budget'))
  const hasFeatures = facts.some(f => f.category === 'feature')
  const hasBusiness = facts.some(f => f.category === 'business')
  const hasTechnical = facts.some(f => f.category === 'technical')
  
  if (hasFeatures) return 'Analyzing selected features...'
  if (hasTimeline && hasBudget) return 'Calculating project scope...'
  if (hasTimeline) return 'Understanding your timeline...'
  if (hasBudget) return 'Tailoring recommendations...'
  if (hasTechnical) return 'Processing technical requirements...'
  if (hasBusiness) return 'Analyzing business context...'
  
  return 'Processing your requirements...'
}

