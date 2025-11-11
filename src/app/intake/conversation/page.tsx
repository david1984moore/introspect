'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversationStore } from '@/stores/conversationStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2, RotateCcw } from 'lucide-react'
import { FeatureSelectionScreen } from '@/components/FeatureSelectionScreen'
import { StartOverModal } from '@/components/StartOverModal'
import { ContextSummary } from '@/components/conversation/ContextSummary'
import { QuestionDisplay } from '@/components/conversation/QuestionDisplay'
import { FeatureChipGrid } from '@/components/conversation/FeatureChipGrid'
import { ValidationRouter } from '@/components/conversation/ValidationRouter'
import { ScopeProgressPanel } from '@/components/conversation/ScopeProgressPanel'
import { MobileProgressHeader } from '@/components/conversation/MobileProgressHeader'
import { ProcessingIndicator } from '@/components/conversation/ProcessingIndicator'
import { AmbientBackground } from '@/components/conversation/AmbientBackground'
import { ConversationAnimationController } from '@/lib/conversationAnimationState'
import { useContextDisplay } from '@/hooks/useContextDisplay'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { QuestionOption, ConversationIntelligence } from '@/types/conversation'
import { FileUpload, type UploadedFile } from '@/components/conversation/FileUpload'

export default function ConversationPage() {
  const router = useRouter()
  const {
    userName,
    userEmail,
    userPhone,
    websiteType,
    currentQuestion,
    isTyping,
    completionPercentage,
    scopeProgress,
    featureRecommendations,
    packageRecommendation,
    showingFeatureSelection,
    questionCount,
    currentCategory,
    intelligence,
    featureSelection,
    packageTier,
    currentValidation, // Phase 8: Current validation prompt
    orchestrationError, // Error state from store
    orchestrateNext,
    submitAnswer,
    submitFeatureSelection,
    submitValidation, // Phase 8: Submit validation response
    calculatePackageTier,
    updateProgress,
    sessionId, // Phase 10: Session ID for completion page
    generateScopeDocument, // Phase 10: Generate SCOPE.md
    completeConversation, // Phase 10: Complete conversation and send emails
    isGeneratingScope, // Phase 10: Loading state
    isCompletingConversation, // Phase 10: Completion loading state
    getAllFacts, // Phase 3: Get conversation facts for processing indicator
    getRecentFacts, // Phase 3: Get recent facts (optimized for ProcessingIndicator)
    getCompressionMetrics, // Phase 3: Get compression metrics for monitoring
  } = useConversationStore()

  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [customText, setCustomText] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showStartOverModal, setShowStartOverModal] = useState(false)
  
  // Phase 3: Animation controller
  const animationController = useRef(new ConversationAnimationController())
  const [animationState, setAnimationState] = useState(animationController.current.getState())
  
  // Reset animation controller on mount to ensure clean state
  useEffect(() => {
    console.log('[ConversationPage] Initializing animation controller. Initial phase:', animationController.current.getState().phase)
    animationController.current.reset()
    setAnimationState(animationController.current.getState())
  }, [])
  
  // Phase 3: Store pending answer for delayed submission after animation
  const pendingAnswerRef = useRef<{ value: string; questionId: string } | null>(null)
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  
  // Get context display settings
  const { showContext, compact } = useContextDisplay(questionCount)

  // Determine if we're in feature selection mode (Questions 10-12 or when showingFeatureSelection is true)
  const isFeatureSelectionMode = showingFeatureSelection
  
  // Phase 8: Determine if we're in validation mode
  const isValidationMode = currentValidation !== null
  
  // Get package tier for feature pricing
  const currentPackageTier = packageTier || calculatePackageTier()

  // Check if current question is a file upload question (brand materials)
  const isFileUploadQuestion = currentQuestion && currentQuestion.inputType === 'file_upload'

  // Map store data to ConversationIntelligence format
  const conversationIntelligence: ConversationIntelligence = useMemo(() => {
    return {
      userName: userName || '',
      userEmail: userEmail || '',
      userPhone: userPhone || '',
      companyName: intelligence?.businessName,
      websiteType: websiteType || '',
      industry: intelligence?.industry,
      targetAudience: intelligence?.targetAudience,
      primaryGoal: intelligence?.primaryGoal,
      problemBeingSolved: intelligence?.uniqueValue,
      selectedFeatures: featureSelection?.selectedFeatures || [],
      designStyle: intelligence?.hasBrandColors ? 'Brand colors available' : undefined,
      desiredTimeline: intelligence?.launchTimeline,
      budgetRange: intelligence?.budgetRange,
      contentReadiness: intelligence?.contentReadiness,
      needsUserAccounts: intelligence?.hasMembers,
      needsCMS: intelligence?.publishesContent,
    }
  }, [
    userName,
    userEmail,
    userPhone,
    websiteType,
    intelligence,
    featureSelection,
  ])

  // Redirect if no foundation data
  useEffect(() => {
    if (!userName || !userEmail) {
      router.push('/intake')
    }
  }, [userName, userEmail, router])

  // Initialize conversation on mount
  useEffect(() => {
    if (!hasInitialized && userName && userEmail && !currentQuestion && !isTyping) {
      setHasInitialized(true)
      // Set animation phase to processing immediately to show ProcessingIndicator instead of old typing indicator
      animationController.current.setPhase('processing')
      orchestrateNext()
        .catch((error) => {
          console.error('Failed to initialize conversation:', error)
          // Reset animation phase on error
          animationController.current.setPhase('idle')
        })
    }
  }, [hasInitialized, userName, userEmail, currentQuestion, isTyping, orchestrateNext])
  
  // When isTyping becomes true and we don't have a question yet, ensure we're in processing phase
  useEffect(() => {
    if (isTyping && !currentQuestion && animationState.phase !== 'processing') {
      console.log('[ConversationPage] Setting animation phase to processing while waiting for first question')
      animationController.current.setPhase('processing')
    }
  }, [isTyping, currentQuestion, animationState.phase])
  
  // Ensure processing phase is set when transitioning from foundational form
  // This prevents the empty state from showing briefly
  useEffect(() => {
    if (userName && userEmail && !currentQuestion && !isTyping && animationState.phase !== 'processing' && !hasInitialized) {
      console.log('[ConversationPage] Setting animation phase to processing for foundational transition')
      animationController.current.setPhase('processing')
    }
  }, [userName, userEmail, currentQuestion, isTyping, animationState.phase, hasInitialized])
  
  // Phase 7: Update progress when intelligence changes
  useEffect(() => {
    if (userName && userEmail) {
      updateProgress()
    }
  }, [intelligence, featureSelection, userName, userEmail, updateProgress])

  // Phase 3: Subscribe to animation state changes
  useEffect(() => {
    const unsubscribe = animationController.current.subscribe((newState) => {
      console.log('[ConversationPage] Animation state changed:', newState.phase, 'selectedOption:', newState.selectedOptionId)
      setAnimationState(newState)
    })
    return unsubscribe
  }, [])
  
  // Phase 3: Track last question ID to prevent re-triggering animations
  // Keep track of the PREVIOUS question ID, not reset to null
  const lastQuestionIdRef = useRef<string | null>(null)
  // Track if we've already processed this question ID to handle race conditions
  const processedQuestionIdsRef = useRef<Set<string>>(new Set())
  
  // Reset animation tracking when transitioning from foundational questions
  // This ensures the first conversation question always animates
  const hasResetForFirstQuestionRef = useRef(false)
  useEffect(() => {
    // Reset when we have foundation data but no current question (transitioning from foundational)
    // Only reset once per mount to avoid interfering with normal question flow
    // Don't reset if we're already in processing phase (initialization has started)
    if (!hasResetForFirstQuestionRef.current && 
        userName && 
        userEmail && 
        !currentQuestion && 
        animationState.phase !== 'processing') {
      console.log('[ConversationPage] 🔄 Resetting animation tracking for first conversation question')
      lastQuestionIdRef.current = null
      processedQuestionIdsRef.current.clear()
      animationController.current.reset()
      hasResetForFirstQuestionRef.current = true
    }
  }, [userName, userEmail, currentQuestion, animationState.phase])
  
  // Phase 3: When new question arrives, trigger entrance animation
  useEffect(() => {
    if (currentQuestion) {
      const questionId = currentQuestion.id
      const previousQuestionId = lastQuestionIdRef.current
      const hasProcessedThisId = processedQuestionIdsRef.current.has(questionId)
      const isFirstQuestion = previousQuestionId === null
      
      // Only trigger animation if this is a NEW question (different ID) AND we haven't processed it yet
      if (questionId !== previousQuestionId && !hasProcessedThisId) {
        // For first question, ALWAYS trigger animation regardless of isTyping or phase
        // This ensures smooth transition from foundational questions
        if (isFirstQuestion) {
          console.log('[ConversationPage] 🎯 First question detected, triggering animation immediately. Question ID:', questionId, 'isTyping:', isTyping)
          // Mark as processed BEFORE triggering to prevent re-triggering
          processedQuestionIdsRef.current.add(questionId)
          // Update the ref BEFORE triggering to prevent re-triggering
          lastQuestionIdRef.current = questionId
          animationController.current.setNewQuestion(currentQuestion)
          return
        }
        
        // For subsequent questions, wait for typing to complete if it's active
        if (isTyping) {
          console.log('[ConversationPage] ⏳ Question arrived while typing, will trigger animation when typing completes. Question ID:', questionId)
          // Don't mark as processed yet - allow retry when isTyping becomes false
          return
        }
        
        console.log('[ConversationPage] 🔍 Question ID changed:', previousQuestionId, '→', questionId, 'Phase:', animationState.phase, 'isTyping:', isTyping)
        
        // Determine if we should trigger animation
        // Blocking phases: questionExit, optionSelected (don't interrupt these)
        const isBlockingPhase = animationState.phase === 'questionExit' || animationState.phase === 'optionSelected'
        
        // Trigger animation in these cases:
        // 1. Processing phase (normal flow after exit) - MOST COMMON
        // 2. Idle/ready/questionEnter phases with previous question (normal transitions)
        // 3. FALLBACK: Any non-blocking phase if we have a previous question (safety net)
        const shouldTrigger = 
          animationState.phase === 'processing' ||
          (['idle', 'ready', 'questionEnter'].includes(animationState.phase) && previousQuestionId !== null) ||
          (!isBlockingPhase && previousQuestionId !== null) // Fallback safety net
        
        console.log('[ConversationPage] 📊 Animation trigger check:', {
          shouldTrigger,
          isFirstQuestion,
          isBlockingPhase,
          phase: animationState.phase,
          previousId: previousQuestionId,
          currentId: questionId,
          hasProcessedThisId
        })
        
        if (shouldTrigger) {
          console.log('[ConversationPage] ✅ TRIGGERING entrance animation! Phase:', animationState.phase, 'Question ID:', questionId)
          // Mark as processed BEFORE triggering to prevent re-triggering
          processedQuestionIdsRef.current.add(questionId)
          // Update the ref BEFORE triggering to prevent re-triggering
          lastQuestionIdRef.current = questionId
          animationController.current.setNewQuestion(currentQuestion)
        } else {
          console.warn('[ConversationPage] ⚠️ SKIPPING animation trigger:', {
            phase: animationState.phase,
            previousId: previousQuestionId,
            currentId: questionId,
            isBlocking: isBlockingPhase,
            reason: 'Conditions not met - will retry when phase changes'
          })
          // Don't update the ref - allow retry when phase changes
        }
      } else if (questionId === previousQuestionId) {
        console.log('[ConversationPage] ℹ️ Same question ID, skipping animation:', questionId)
      } else if (hasProcessedThisId) {
        console.log('[ConversationPage] ℹ️ Question ID already processed, skipping animation:', questionId)
      }
    }
  }, [currentQuestion?.id, animationState.phase, isTyping, currentQuestion]) // Include currentQuestion to catch all changes
  
  // Phase 3: Submit pending answer when processing phase starts (after exit animation)
  useEffect(() => {
    if (animationState.phase === 'processing' && pendingAnswerRef.current) {
      const { value, questionId } = pendingAnswerRef.current
      pendingAnswerRef.current = null // Clear pending answer
      
      // DON'T reset lastQuestionIdRef here - it breaks the animation trigger logic
      // The ref tracks the PREVIOUS question, and will be updated when new question arrives
      
      console.log('[ConversationPage] Submitting answer in processing phase. Question ID:', questionId, 'Last question ID ref:', lastQuestionIdRef.current)
      
      // Submit answer now (question is already hidden by exit animation)
      submitAnswer(value, questionId)
        .then(() => {
          setSelectedOption('')
          setSelectedOptions([])
          setCustomText('')
        })
        .catch((error) => {
          console.error('Failed to submit answer:', error)
        })
    }
  }, [animationState.phase, submitAnswer])

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
    if (value !== 'other') {
      setCustomText('')
    }
  }

  const handleCheckboxToggle = (value: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      } else {
        return [...prev, value]
      }
    })
    // Clear custom text if "other" is unchecked
    if (value === 'other' && selectedOptions.includes('other')) {
      setCustomText('')
    }
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return

    let answer: string | string[] = ''

    // Handle checkbox (multi-select) questions
    if (currentQuestion.inputType === 'checkbox') {
      if (selectedOptions.length === 0) return
      
      // If "other" is selected and has custom text, include it
      const options = selectedOptions.filter((opt) => opt !== 'other')
      if (selectedOptions.includes('other') && customText.trim()) {
        options.push(customText.trim())
      }
      
      answer = options.length > 0 ? options.join(', ') : ''
    }
    // Handle radio (single-select) questions
    else if (currentQuestion.inputType === 'radio') {
      answer = selectedOption
      
      // Phase 3: Trigger animation sequence for option selection
      if (selectedOption) {
        animationController.current.selectOption(selectedOption)
      }
      
      // If "Something else" selected and custom text provided
      if (selectedOption === 'other' && customText.trim()) {
        answer = customText.trim()
      }
    }
    // Handle text/textarea questions
    else if (currentQuestion.inputType === 'text' || currentQuestion.inputType === 'textarea') {
      answer = customText.trim()
    }
    // Handle file upload questions
    else if (currentQuestion.inputType === 'file_upload') {
      // For file upload questions, answer can be empty (user can skip)
      answer = uploadedFiles.length > 0 
        ? `Uploaded files: ${uploadedFiles.map((f) => `${f.file.name} (${(f.file.size / 1024).toFixed(1)}KB)`).join(', ')}`
        : 'No files uploaded'
    }

    // For file upload questions, allow empty answer (skip)
    if (currentQuestion.inputType !== 'file_upload') {
      if (!answer || (typeof answer === 'string' && answer.length === 0)) return
    }

    // answer is always a string at this point (checkbox uses join, radio/text/textarea are strings)
    const answerString: string = typeof answer === 'string' ? answer : ''
    
    // For file upload, allow empty string (skip)
    if (currentQuestion.inputType !== 'file_upload' && !answerString) return

    await submitAnswer(answerString || 'No files uploaded', currentQuestion.id)
    setSelectedOption('')
    setSelectedOptions([])
    setCustomText('')
    setUploadedFiles([])
  }

  const canSubmit = () => {
    if (!currentQuestion) return false

    // File upload questions - always enabled (can skip)
    if (currentQuestion.inputType === 'file_upload') {
      return true
    }

    // Checkbox question (multi-select)
    if (currentQuestion.inputType === 'checkbox') {
      if (selectedOptions.length === 0) return false
      if (selectedOptions.includes('other')) {
        return customText.trim().length > 0
      }
      return selectedOptions.length > 0
    }

    // Radio button question (single-select)
    if (currentQuestion.inputType === 'radio') {
      if (selectedOption === 'other') {
        return customText.trim().length > 0
      }
      return selectedOption.length > 0
    }

    // Text/textarea question
    return customText.trim().length > 0
  }

  const handleSkip = async () => {
    if (!currentQuestion) return
    await submitAnswer('No files uploaded', currentQuestion.id)
    setUploadedFiles([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phase 3: Ambient Background */}
      <AmbientBackground />
      
      {/* Mobile Progress Header */}
      {isMobile && scopeProgress && (
        <MobileProgressHeader
          progress={scopeProgress}
          questionNumber={questionCount}
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-gray-600">
                  Let's build your {websiteType} website
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStartOverModal(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`max-w-7xl mx-auto px-6 py-8 ${isDesktop ? 'grid grid-cols-12 gap-8' : ''}`}>
        {/* Desktop Sidebar with Progress */}
        {isDesktop && scopeProgress && (
          <aside className="col-span-4">
            <div className="sticky top-8 space-y-6">
              <ScopeProgressPanel
                progress={scopeProgress}
                variant="compact"
                collapsible
                defaultExpanded={false}
                answeredQuestions={getAllFacts()}
              />
            </div>
          </aside>
        )}

        {/* Conversation Area */}
        <div className={isDesktop ? 'col-span-8' : 'max-w-3xl mx-auto'}>
        {/* Phase 3: Processing Indicator */}
        {animationState.phase === 'processing' && (
          <ProcessingIndicator
            compressedFacts={getAllFacts()}
            visible={true}
          />
        )}

        {/* REMOVED: Old typing indicator - replaced by ProcessingIndicator */}
        {/* The ProcessingIndicator handles all loading states now */}

        {/* Phase 8: Validation Screen */}
        {isValidationMode && currentValidation && (
          <ValidationRouter
            validation={currentValidation}
            onComplete={async (response) => {
              await submitValidation(response)
            }}
            isSubmitting={isTyping}
          />
        )}

        {/* Feature Selection Screen - Phase 6 FeatureChipGrid */}
        {!isValidationMode && isFeatureSelectionMode && (
          <FeatureChipGrid
            intelligence={conversationIntelligence}
            packageTier={currentPackageTier}
            onSubmit={submitFeatureSelection}
            isSubmitting={isTyping}
          />
        )}

        {/* Legacy Feature Selection Screen (for backward compatibility) */}
        {showingFeatureSelection && featureRecommendations && packageRecommendation && !isFeatureSelectionMode && (
          <FeatureSelectionScreen
            packageRecommendation={packageRecommendation}
            features={featureRecommendations}
            onContinue={submitFeatureSelection}
            isLoading={isTyping}
          />
        )}

        {/* Question Display - Use QuestionDisplay component for radio, text, and textarea */}
        {/* Show during idle, optionSelected, questionExit, questionEnter, and ready phases */}
        {/* Hide during processing phase (showing ProcessingIndicator instead) */}
        {/* Use AnimatePresence to handle exit animations properly - component stays mounted during questionExit */}
        {!isValidationMode && !isFeatureSelectionMode && 
         (currentQuestion?.inputType === 'radio' || 
          currentQuestion?.inputType === 'text' || 
          currentQuestion?.inputType === 'textarea') && (
          <AnimatePresence mode="wait">
            {currentQuestion && 
             (animationState.phase !== 'processing') && (
              <QuestionDisplay
                key={currentQuestion.id}
                question={currentQuestion}
                intelligence={conversationIntelligence}
                questionNumber={questionCount}
                onAnswer={async (value: string) => {
                  console.log('[ConversationPage] onAnswer called:', value, 'question type:', currentQuestion?.inputType)
                  
                  // For ALL question types, trigger animation sequence before submitting
                  if (currentQuestion?.inputType === 'radio' && value) {
                    const option = currentQuestion.options?.find(o => o.value === value || o.label === value)
                    console.log('[ConversationPage] Found option:', option?.value, 'for value:', value)
                    if (option) {
                      // Store answer for delayed submission
                      pendingAnswerRef.current = {
                        value: value,
                        questionId: currentQuestion.id
                      }
                      
                      console.log('[ConversationPage] Calling selectOption with:', option.value)
                      // Trigger animation sequence (will transition to processing phase)
                      animationController.current.selectOption(option.value)
                      
                      // Don't submit immediately - wait for processing phase
                      return
                    } else {
                      console.warn('[ConversationPage] Option not found for value:', value, 'available options:', currentQuestion.options?.map(o => o.value))
                    }
                  }
                  
                  // For text/textarea questions, also trigger animation sequence
                  if (currentQuestion?.inputType === 'text' || currentQuestion?.inputType === 'textarea') {
                    // Allow empty value for skip
                    const answerValue = value || '' // Empty string is valid for skip
                    
                    // Store answer for delayed submission
                    pendingAnswerRef.current = {
                      value: answerValue,
                      questionId: currentQuestion.id
                    }
                    
                    console.log('[ConversationPage] Triggering exit animation for text/textarea question', value ? '(with answer)' : '(skipped)')
                    // Trigger exit animation sequence (similar to radio, but without option selection)
                    // Use a dummy option ID to trigger the animation sequence
                    animationController.current.selectOption('text_answer')
                    
                    // Don't submit immediately - wait for processing phase
                    return
                  }
                  
                  // Fallback: For other question types, submit immediately
                  console.log('[ConversationPage] Submitting answer immediately (fallback)')
                  await submitAnswer(value, currentQuestion.id)
                  setSelectedOption('')
                  setSelectedOptions([])
                  setCustomText('')
                }}
                isSubmitting={isTyping}
                compact={compact}
                animationPhase={animationState.phase}
                selectedOptionId={animationState.selectedOptionId}
              />
            )}
          </AnimatePresence>
        )}

        {/* File Upload Question (Brand Materials) */}
        {!isValidationMode && currentQuestion && 
         !isTyping && 
         !isFeatureSelectionMode && 
         isFileUploadQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            {/* Context Summary */}
            {showContext && (
              <div className="mb-6">
                <ContextSummary
                  intelligence={conversationIntelligence}
                  currentCategory={currentCategory || currentQuestion.category || ''}
                  questionNumber={questionCount}
                  compact={compact}
                />
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>

            {currentQuestion.helperText && (
              <p className="text-sm text-gray-600 mb-6">
                {currentQuestion.helperText}
              </p>
            )}

            {/* File Upload */}
            <div className="mb-6">
              <FileUpload
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxSize={50}
                maxFiles={10}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isTyping}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
              <Button
                onClick={handleSkip}
                disabled={isTyping}
                variant="ghost"
                className="w-full"
              >
                Skip
              </Button>
            </div>
          </motion.div>
        )}

        {/* Checkbox Options (Multi-select) - Keep inline for now */}
        {!isValidationMode && currentQuestion && 
         !isTyping && 
         !isFeatureSelectionMode && 
         currentQuestion.inputType === 'checkbox' && 
         currentQuestion.options && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            {/* Context Summary for checkbox questions */}
            {showContext && (
              <div className="mb-6">
                <ContextSummary
                  intelligence={conversationIntelligence}
                  currentCategory={currentCategory || currentQuestion.category || ''}
                  questionNumber={questionCount}
                  compact={compact}
                />
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-500 mb-4">Choose all that apply</p>
              {currentQuestion.options.map((option: QuestionOption) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.value}
                    checked={selectedOptions.includes(option.value)}
                    onCheckedChange={() => handleCheckboxToggle(option.value)}
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer text-base font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}

              {/* Custom Text Input for "Something else" */}
              {selectedOptions.includes('other') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <Input
                    placeholder="Please describe..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canSubmit()) {
                        handleSubmit()
                      }
                    }}
                    autoFocus
                  />
                </motion.div>
              )}

            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="w-full"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Completion State */}
        {completionPercentage === 100 && !currentQuestion && !isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
          >
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              All Done!
            </h2>
            <p className="text-gray-600 mb-6">
              We have all the information we need to create your project scope.
            </p>
            <Button
              onClick={async () => {
                try {
                  // Generate SCOPE.md if not already generated
                  if (!useConversationStore.getState().generatedScope) {
                    await generateScopeDocument()
                  }
                  
                  // Complete conversation and send emails
                  await completeConversation()
                  
                  // Navigate to completion page
                  const conversationId = sessionId || `conv_${Date.now()}`
                  router.push(`/conversation/${conversationId}/complete`)
                } catch (error) {
                  console.error('Failed to complete conversation:', error)
                  alert('Failed to generate documents. Please try again.')
                }
              }}
              disabled={isGeneratingScope || isCompletingConversation}
              className="w-full md:w-auto"
            >
              {isGeneratingScope || isCompletingConversation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isGeneratingScope ? 'Generating documents...' : 'Sending emails...'}
                </>
              ) : (
                'View Your Project Summary'
              )}
            </Button>
          </motion.div>
        )}

        {/* Error State */}
        {orchestrationError && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Unable to load question
            </h3>
            <p className="text-red-700 mb-4">{orchestrationError}</p>
            <Button
              onClick={async () => {
                setHasInitialized(false)
                await orchestrateNext()
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Empty State - No question, no validation, no feature selection, not complete */}
        {/* Only show if NOT in processing phase (ProcessingIndicator handles that) */}
        {!isValidationMode && 
         !isFeatureSelectionMode && 
         !currentQuestion && 
         !isTyping && 
         animationState.phase !== 'processing' &&
         !orchestrationError &&
         completionPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
          >
            <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Preparing your next question...
            </h3>
            <p className="text-gray-600 mb-4">
              This may take a moment.
            </p>
            <Button
              onClick={async () => {
                setHasInitialized(false)
                await orchestrateNext()
              }}
              variant="outline"
            >
              Refresh
            </Button>
          </motion.div>
        )}
      </div>

      {/* Start Over Modal */}
      <StartOverModal
        open={showStartOverModal}
        onOpenChange={setShowStartOverModal}
      />
    </div>
    </div>
  )
}
