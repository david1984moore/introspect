import { TIMINGS } from './animationTimings'

export type AnimationPhase = 
  | 'idle'           // User reading question
  | 'optionSelected' // User clicked, option highlighted
  | 'questionExit'   // Current question fading out
  | 'processing'     // Showing processing indicator
  | 'questionEnter'  // Next question appearing
  | 'ready'          // Entrance complete, ready for interaction

export interface AnimationState {
  phase: AnimationPhase
  selectedOptionId: string | null
  processingStartTime: number | null
  newQuestionData: any | null
}

export class ConversationAnimationController {
  private listeners: Set<(state: AnimationState) => void> = new Set()
  private state: AnimationState = {
    phase: 'idle',
    selectedOptionId: null,
    processingStartTime: null,
    newQuestionData: null,
  }
  
  subscribe(listener: (state: AnimationState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  
  private notify() {
    this.listeners.forEach(listener => listener(this.state))
  }
  
  /**
   * User selected an option - start the animation sequence
   */
  selectOption(optionId: string) {
    console.log('[AnimationController] selectOption called:', optionId)
    this.state = {
      ...this.state,
      phase: 'optionSelected',
      selectedOptionId: optionId,
    }
    this.notify()
    console.log('[AnimationController] Phase: optionSelected')
    
    // After highlight, begin exit
    setTimeout(() => {
      this.state = { ...this.state, phase: 'questionExit' }
      this.notify()
      console.log('[AnimationController] Phase: questionExit')
    }, TIMINGS.OPTION_SELECT_HIGHLIGHT)
    
    // Show processing indicator after exit animation completes
    // Exit duration = QUESTION_FADE_START + QUESTION_FADE_DURATION
    // Add extra buffer to ensure exit animation completes before hiding component
    const exitDuration = TIMINGS.QUESTION_FADE_START + TIMINGS.QUESTION_FADE_DURATION
    const processingDelay = TIMINGS.OPTION_SELECT_HIGHLIGHT + exitDuration + 50 // 50ms buffer
    setTimeout(() => {
      this.state = {
        ...this.state,
        phase: 'processing',
        processingStartTime: Date.now(),
      }
      this.notify()
      console.log('[AnimationController] Phase: processing')
    }, processingDelay)
  }
  
  /**
   * New question data received from API - prepare entrance
   */
  setNewQuestion(questionData: any) {
    console.log('[AnimationController] setNewQuestion called:', questionData?.id || questionData?.text?.substring(0, 50))
    this.state = {
      ...this.state,
      newQuestionData: questionData,
      phase: 'questionEnter',
    }
    this.notify()
    console.log('[AnimationController] Phase: questionEnter')
    
    // Calculate entrance duration based on option count
    const optionCount = questionData.options?.length || 4
    const entranceDuration = 
      TIMINGS.CONTAINER_FADE_IN +
      TIMINGS.QUESTION_TEXT_DELAY +
      TIMINGS.QUESTION_TEXT_DURATION +
      (TIMINGS.OPTION_STAGGER * optionCount) +
      TIMINGS.OPTION_ENTRANCE_DURATION
    
    // Mark ready after entrance completes
    setTimeout(() => {
      this.state = {
        phase: 'ready',
        selectedOptionId: null,
        processingStartTime: null,
        newQuestionData: null,
      }
      this.notify()
      console.log('[AnimationController] Phase: ready')
      
      // Reset to idle after brief ready state
      setTimeout(() => {
        this.state = { ...this.state, phase: 'idle' }
        this.notify()
        console.log('[AnimationController] Phase: idle')
      }, 100)
    }, entranceDuration)
  }
  
  /**
   * Get current animation state
   */
  getState(): AnimationState {
    return { ...this.state }
  }
  
  /**
   * Reset animation state (for new conversation or error recovery)
   */
  reset() {
    this.state = {
      phase: 'idle',
      selectedOptionId: null,
      processingStartTime: null,
      newQuestionData: null,
    }
    this.notify()
  }
  
  /**
   * Force transition to a specific phase (for error recovery or testing)
   */
  setPhase(phase: AnimationPhase) {
    this.state = { ...this.state, phase }
    this.notify()
  }
}

