'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TIMINGS, EASINGS, getAdjustedTimings } from '@/lib/animationTimings'

/**
 * Subtle ambient background animation
 * Provides visual continuity during processing without demanding attention
 * 
 * Design principle: Should be barely noticeable but prevent "frozen screen" feeling
 */
export function AmbientBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    // Check user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null
  }
  
  const adjustedTimings = getAdjustedTimings(prefersReducedMotion)
  
  // If ambient cycle is disabled (0), don't render
  if (adjustedTimings.AMBIENT_CYCLE === 0) {
    return null
  }
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, oklch(0.85 0.05 240) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, oklch(0.85 0.05 260) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, oklch(0.85 0.05 250) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, oklch(0.85 0.05 240) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: adjustedTimings.AMBIENT_CYCLE / 1000,
          ease: EASINGS.LINEAR,
          repeat: Infinity,
        }}
      />
    </div>
  )
}

