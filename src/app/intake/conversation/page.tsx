'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { useContextDisplay } from '@/hooks/useContextDisplay'
import type { QuestionOption, ConversationIntelligence } from '@/types/conversation'

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
    orchestrateNext,
    submitAnswer,
    submitFeatureSelection,
  } = useConversationStore()

  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [customText, setCustomText] = useState<string>('')
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showStartOverModal, setShowStartOverModal] = useState(false)

  // Get context display configuration
  const { showContext, compact } = useContextDisplay(questionCount)

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
    if (!hasInitialized && userName && userEmail && !currentQuestion) {
      setHasInitialized(true)
      orchestrateNext()
    }
  }, [hasInitialized, userName, userEmail, currentQuestion, orchestrateNext])

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
      
      // If "Something else" selected and custom text provided
      if (selectedOption === 'other' && customText.trim()) {
        answer = customText.trim()
      }
    }
    // Handle text/textarea questions
    else if (currentQuestion.inputType === 'text' || currentQuestion.inputType === 'textarea') {
      answer = customText.trim()
    }

    if (!answer || (typeof answer === 'string' && answer.length === 0)) return

    const answerString = typeof answer === 'string' ? answer : Array.isArray(answer) ? answer.join(', ') : ''
    if (!answerString) return

    await submitAnswer(answerString, currentQuestion.id)
    setSelectedOption('')
    setSelectedOptions([])
    setCustomText('')
  }

  const canSubmit = () => {
    if (!currentQuestion) return false

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
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
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {completionPercentage}% Complete
                </div>
              </div>
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

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 mb-8"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </motion.div>
        )}

        {/* Feature Selection Screen */}
        {showingFeatureSelection && featureRecommendations && packageRecommendation && (
          <FeatureSelectionScreen
            packageRecommendation={packageRecommendation}
            features={featureRecommendations}
            onContinue={submitFeatureSelection}
            isLoading={isTyping}
          />
        )}

        {/* Question Display - Use QuestionDisplay component for radio, text, and textarea */}
        {currentQuestion && 
         !isTyping && 
         !showingFeatureSelection && 
         (currentQuestion.inputType === 'radio' || 
          currentQuestion.inputType === 'text' || 
          currentQuestion.inputType === 'textarea') && (
          <QuestionDisplay
            question={currentQuestion}
            intelligence={conversationIntelligence}
            questionNumber={questionCount}
            onAnswer={async (value: string) => {
              await submitAnswer(value, currentQuestion.id)
              setSelectedOption('')
              setSelectedOptions([])
              setCustomText('')
            }}
            isSubmitting={isTyping}
            compact={compact}
          />
        )}

        {/* Checkbox Options (Multi-select) - Keep inline for now */}
        {currentQuestion && 
         !isTyping && 
         !showingFeatureSelection && 
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
            <p className="text-gray-600">
              We have all the information we need to create your project scope.
            </p>
          </motion.div>
        )}
      </div>

      {/* Start Over Modal */}
      <StartOverModal
        open={showStartOverModal}
        onOpenChange={setShowStartOverModal}
      />
    </div>
  )
}
