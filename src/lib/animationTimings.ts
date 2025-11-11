/**
 * Core timing constants for Introspect animations
 * All values in milliseconds
 * 
 * Design principle: Animations should overlap to create continuous motion
 * Never show a static screen during the 2-second processing window
 */

export const TIMINGS = {
  // User interaction feedback (instant)
  OPTION_PRESS: 100,           // Scale down on tap
  OPTION_RELEASE: 150,         // Scale back to normal
  
  // Question exit sequence
  OPTION_SELECT_HIGHLIGHT: 400, // Selected option color change (increased for visibility)
  QUESTION_FADE_START: 150,      // Delay before question starts fading (increased)
  QUESTION_FADE_DURATION: 500,  // Question opacity 1 → 0 (increased for smoother exit)
  OPTIONS_FADE_DURATION: 400,   // Options fade slightly faster for snappiness
  
  // Processing state
  PROCESSING_APPEAR_DELAY: 200, // Show processing indicator after exit begins
  PROCESSING_FADE_IN: 300,      // Processing indicator fade in (smoother)
  FACT_ITEM_STAGGER: 120,       // Delay between each fact appearing
  AMBIENT_CYCLE: 3000,          // Background gradient cycle (slow, subtle)
  
  // Question entrance sequence
  ENTRANCE_START_OFFSET: -100,  // Start entrance 100ms before processing ends (predictive)
  CONTAINER_FADE_IN: 600,       // Question container appears (increased for smoother entrance)
  QUESTION_TEXT_DELAY: 200,     // Delay before question text slides in (increased)
  QUESTION_TEXT_DURATION: 500,  // Question text slide + fade (increased)
  OPTION_STAGGER: 120,           // Delay between each option appearing (increased)
  OPTION_ENTRANCE_DURATION: 500, // Each option slide + fade duration (increased)
  
  // Interaction states
  HOVER_SCALE: 150,             // Button scale on hover
  HOVER_TRANSLATE: 100,         // Button slide on hover
} as const

export const EASINGS = {
  // Natural, physics-inspired easing
  OUT: [0.33, 1, 0.68, 1],      // Ease out cubic - most exits
  IN_OUT: [0.65, 0, 0.35, 1],   // Ease in-out cubic - entrances
  SPRING: [0.34, 1.56, 0.64, 1], // Slight overshoot - playful interactions
  LINEAR: [0, 0, 1, 1],         // Ambient backgrounds only
} as const

/**
 * Calculate total animation sequence duration
 * Used for predictive timing and state management
 */
export function getSequenceDuration(optionCount: number = 4): number {
  return (
    TIMINGS.QUESTION_FADE_START +
    TIMINGS.QUESTION_FADE_DURATION +
    TIMINGS.PROCESSING_FADE_IN +
    TIMINGS.CONTAINER_FADE_IN +
    TIMINGS.QUESTION_TEXT_DELAY +
    TIMINGS.QUESTION_TEXT_DURATION +
    (TIMINGS.OPTION_STAGGER * optionCount) +
    TIMINGS.OPTION_ENTRANCE_DURATION
  )
}

/**
 * Get adjusted timings based on user motion preferences
 */
export function getAdjustedTimings(prefersReducedMotion: boolean) {
  if (!prefersReducedMotion) {
    return TIMINGS
  }
  
  // Reduce animation durations for accessibility
  return {
    ...TIMINGS,
    QUESTION_FADE_DURATION: 100,
    OPTION_ENTRANCE_DURATION: 100,
    PROCESSING_FADE_IN: 100,
    CONTAINER_FADE_IN: 100,
    QUESTION_TEXT_DURATION: 150,
    AMBIENT_CYCLE: 0, // Disable ambient background
  }
}

