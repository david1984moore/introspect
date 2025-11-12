'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMINGS } from '@/lib/animationTimings'
import type { ConversationFact } from '@/types/conversation'

interface ProcessingIndicatorProps {
  compressedFacts: ConversationFact[]
  visible: boolean
  className?: string
}

// Collection of engaging processing phrases
const PROCESSING_PHRASES = [
  'Analyzing business context...',
  'Check out your answers on the left',
  'Adjusting your scope',
  'Working on your website',
  'Calculating...',
  'Planning your blueprint',
  'Reviewing your responses',
  'Crafting your next question',
  'Processing your requirements...',
  'Understanding your needs',
  'Building your project plan',
  'Analyzing patterns',
  'Connecting the dots',
  'Preparing insights',
  'Optimizing recommendations',
]

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function ProcessingIndicator({ 
  compressedFacts, 
  visible,
  className = '' 
}: ProcessingIndicatorProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [shuffledPhrases, setShuffledPhrases] = useState<string[]>([])
  const wasVisibleRef = useRef(false)
  const initializedRef = useRef(false)
  
  // Generate a random order of phrases when processing starts (visible becomes true)
  // CRITICAL FIX: Only initialize once per mount to prevent infinite loops
  useEffect(() => {
    // When visible becomes true for the first time, initialize phrases
    if (visible && !initializedRef.current) {
      setShuffledPhrases(shuffleArray(PROCESSING_PHRASES))
      setCurrentPhraseIndex(0)
      initializedRef.current = true
    }
    
    // Reset initialization when visible becomes false
    if (!visible && initializedRef.current) {
      initializedRef.current = false
    }
    
    wasVisibleRef.current = visible
  }, [visible])
  
  // Cycle through phrases with fade transitions
  useEffect(() => {
    if (!visible || shuffledPhrases.length === 0) return
    
    // Cycle through phrases every 4 seconds (slower transition for better readability)
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % shuffledPhrases.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [visible, shuffledPhrases.length])
  
  if (!visible) return null
  
  const currentPhrase = shuffledPhrases[currentPhraseIndex] || PROCESSING_PHRASES[0]
  
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
      {/* Rotating processing message with fade transitions */}
      <div className="text-lg text-neutral-500 text-center font-light min-h-[2rem] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1], // Smooth ease-in-out
            }}
            className="whitespace-nowrap"
          >
            {currentPhrase}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

