'use client'

import { useMediaQuery } from './useMediaQuery'

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

