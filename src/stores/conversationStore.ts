// Enhanced Zustand store for Introspect V3
// Phase 2: State Management & Security

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { encryptSync, decryptSync } from '@/lib/security/encryption'
import DOMPurify from 'dompurify'
import type { 
  Message, 
  FoundationData, 
  SessionIntelligence,
  FeatureSelection,
  FeatureRecommendation,
  PackageRecommendation,
  ValidationLoop,
} from '@/types'
import type { BusinessModel } from '@/types/business-models'
import type { ScopeProgress, ClaudeResponse, Question } from '@/types/conversation'

interface ConversationState {
  // Session Management
  sessionId: string | null
  magicToken: string | null
  
  // Foundation (Q1-4)
  userName: string
  userEmail: string
  userPhone: string
  websiteType: string
  
  // Business Model Classification
  businessModel: BusinessModel | null
  businessModelConfidence: number
  classifiedAt: Date | null
  
  // Conversation
  messages: Message[]
  currentQuestionId: string | null
  questionCount: number
  isTyping: boolean
  
  // Intelligence Gathering
  intelligence: SessionIntelligence
  confidence: number
  gaps: string[]
  conflicts: string[]
  
  // Feature Recommendations
  featureSelection: FeatureSelection | null
  recommendedFeatures: FeatureRecommendation[]
  featureConflicts: string[]
  
  // Validation Loops
  validationLoops: ValidationLoop[]
  validationCount: number
  
  // Progress Tracking
  completionPercentage: number
  currentCategory: string
  categoryProgress: Record<string, number>
  estimatedTimeRemaining: number
  
  // SCOPE.md Progress Tracking (V3.2)
  scopeProgress: ScopeProgress
  currentQuestion: Question | null
  
  // Feature Recommendations (V3.2)
  featureRecommendations: FeatureRecommendation[] | null
  packageRecommendation: PackageRecommendation | null
  showingFeatureSelection: boolean
  
  // Security & Monitoring
  lastActivity: Date
  ipAddress: string | null
  suspiciousActivityCount: number
  
  // Actions - Foundation
  setFoundation: (data: FoundationData) => void
  
  // Actions - Business Model
  classifyBusinessModel: (model: BusinessModel, confidence: number, indicators: string[]) => void
  
  // Actions - Messages
  addMessage: (message: Omit<Message, 'id' | 'validated'>) => Message
  
  // Actions - Intelligence
  updateIntelligence: (data: Partial<SessionIntelligence>) => void
  detectConflicts: () => string[]
  
  // Actions - Features
  presentFeatures: (recommendations: FeatureRecommendation[], packageRec: PackageRecommendation) => void
  selectFeatures: (features: string[]) => void
  validateFeatureSelection: () => boolean
  
  // Actions - Validation
  addValidationLoop: (loop: Omit<ValidationLoop, 'id' | 'timestamp'>) => void
  updateValidationResponse: (loopId: string, response: 'correct' | 'clarify', clarification?: string) => void
  
  // Actions - Session
  syncToCloud: () => Promise<void>
  detectAbandonmentRisk: () => boolean
  validateAndSanitize: (input: string) => string
  calculateCompleteness: () => number
  calculateCompletionFromSections: () => number
  reset: () => void
  
  // Actions - Claude Orchestration (V3.2)
  orchestrateNext: () => Promise<ClaudeResponse | null>
  submitAnswer: (answer: string, questionId: string) => Promise<void>
  updateScopeProgress: (progress: Partial<ScopeProgress>) => void
  submitFeatureSelection: (selectedFeatureIds: string[]) => Promise<void>
}

// Enhanced input validation with prompt injection detection
const validateInput = (input: string): string => {
  // XSS Protection
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
  
  // Length validation
  if (sanitized.length > 5000) {
    throw new Error('Input exceeds maximum length')
  }
  
  // Enhanced prompt injection detection (aligned with v3.2)
  const injectionPatterns = [
    /ignore previous instructions/i,
    /forget everything/i,
    /system prompt/i,
    /act as/i,
    /new instructions/i,
    /you are now/i,
    /disregard all/i,
    /override/i,
    /forget your role/i,
  ]
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('Potential prompt injection detected:', pattern)
      // Log for monitoring
      return sanitized.replace(pattern, '')
    }
  }
  
  return sanitized
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      magicToken: null,
      userName: '',
      userEmail: '',
      userPhone: '',
      websiteType: '',
      businessModel: null,
      businessModelConfidence: 0,
      classifiedAt: null,
      messages: [],
      currentQuestionId: null,
      questionCount: 0,
      isTyping: false,
      intelligence: {
        businessModel: null,
        businessModelConfidence: 0,
        businessModelIndicators: [],
      },
      confidence: 0,
      gaps: [],
      conflicts: [],
      featureSelection: null,
      recommendedFeatures: [],
      featureConflicts: [],
      validationLoops: [],
      validationCount: 0,
      completionPercentage: 0,
      currentCategory: 'foundation',
      categoryProgress: {
        foundation: 100, // Completed in static form
        businessContext: 0,
        brandAssets: 0,
        contentReadiness: 0,
        technicalRequirements: 0,
        mediaRequirements: 0,
        designDirection: 0,
        postLaunchSupport: 0,
        projectParameters: 0,
      },
      estimatedTimeRemaining: 20,
      scopeProgress: {
        sections: {
          section1_executive_summary: 'not_started',
          section2_project_classification: 'not_started',
          section3_client_information: 'not_started',
          section4_business_context: 'not_started',
          section5_brand_assets: 'not_started',
          section6_content_strategy: 'not_started',
          section7_technical_specs: 'not_started',
          section8_media_elements: 'not_started',
          section9_design_direction: 'not_started',
          section10_features_breakdown: 'not_started',
          section11_support_plan: 'not_started',
          section12_timeline: 'not_started',
          section13_investment_summary: 'not_started',
          section14_validation_outcomes: 'not_started',
        },
        overallCompleteness: 0,
        sectionsComplete: 0,
        sectionsInProgress: 0,
        sectionsNotStarted: 14,
      },
      currentQuestion: null,
      featureRecommendations: null,
      packageRecommendation: null,
      showingFeatureSelection: false,
      lastActivity: new Date(),
      ipAddress: null,
      suspiciousActivityCount: 0,
      
      // Helper function to calculate completion percentage based on completed sections
      calculateCompletionFromSections: () => {
        const state = get()
        const totalSections = 14
        const completedSections = Object.values(state.scopeProgress.sections).filter(
          (status) => status === 'complete'
        ).length
        return Math.round((completedSections / totalSections) * 100)
      },
      
      // Actions
      setFoundation: (data) => {
        const sanitized = {
          userName: validateInput(data.userName),
          userEmail: validateInput(data.userEmail),
          userPhone: validateInput(data.userPhone || ''),
          websiteType: validateInput(data.websiteType),
        }
        
        // Initialize SCOPE.md sections 2 and 3 as complete (foundation data)
        const state = get()
        const updatedProgress = {
          ...state.scopeProgress,
          sections: {
            ...state.scopeProgress.sections,
            section2_project_classification: 'complete',
            section3_client_information: 'complete',
          },
        }
        
        // Calculate completed sections
        const completedSections = Object.values(updatedProgress.sections).filter(
          (status) => status === 'complete'
        ).length
        
        set({
          ...sanitized,
          currentCategory: 'business_context',
          lastActivity: new Date(),
          scopeProgress: {
            ...updatedProgress,
            sectionsComplete: completedSections,
            sectionsNotStarted: 14 - completedSections,
            overallCompleteness: Math.round((completedSections / 14) * 100),
          },
          completionPercentage: Math.round((completedSections / 14) * 100),
        })
        
        // Trigger cloud sync
        get().syncToCloud()
      },
      
      // Business Model Classification
      classifyBusinessModel: (model, confidence, indicators) => {
        set({
          businessModel: model,
          businessModelConfidence: confidence,
          classifiedAt: new Date(),
          intelligence: {
            ...get().intelligence,
            businessModel: model,
            businessModelConfidence: confidence,
            businessModelIndicators: indicators,
          },
          lastActivity: new Date(),
        })
        
        console.log(`Business model classified: ${model} (${confidence}% confidence)`)
      },
      
      addMessage: (message) => {
        const sanitizedContent = validateInput(message.content)
        const newMessage: Message = {
          id: crypto.randomUUID(),
          ...message,
          content: sanitizedContent,
          validated: true,
          timestamp: message.timestamp || new Date(),
        }
        
        set((state) => ({
          messages: [...state.messages, newMessage],
          questionCount: message.role === 'assistant' && !message.metadata?.validationLoop
            ? state.questionCount + 1 
            : state.questionCount,
          lastActivity: new Date(),
        }))
        
        // Auto-sync every 5 messages
        if (get().messages.length % 5 === 0) {
          get().syncToCloud()
        }
        
        return newMessage
      },
      
      updateIntelligence: (data) => {
        set((state) => {
          const updatedIntelligence = { ...state.intelligence, ...data }
          
          // Calculate completion based on completed sections, not old category system
          const completedSections = Object.values(state.scopeProgress.sections).filter(
            (status) => status === 'complete'
          ).length
          const newCompletionPercentage = Math.round((completedSections / 14) * 100)
          
          // CRITICAL: Progress should NEVER decrease
          const finalCompletionPercentage = Math.max(state.completionPercentage, newCompletionPercentage)
          
          return {
            intelligence: updatedIntelligence,
            lastActivity: new Date(),
            completionPercentage: finalCompletionPercentage,
          }
        })
      },
      
      // Conflict Detection
      detectConflicts: () => {
        const state = get()
        const conflicts: string[] = []
        
        // Budget vs Features conflict
        if (state.featureSelection) {
          const budget = parseInt(state.intelligence.budgetRange?.replace(/\D/g, '') || '0')
          if (budget > 0 && state.featureSelection.totalPrice > budget * 1.2) {
            conflicts.push('budget_vs_features')
          }
        }
        
        // Timeline vs Scope conflict
        if (state.intelligence.launchTimeline === 'urgent' && 
            state.featureSelection?.package === 'custom') {
          conflicts.push('timeline_vs_scope')
        }
        
        // Content vs Launch conflict
        if (state.intelligence.contentReadiness === 'need_help' &&
            state.intelligence.launchTimeline === 'urgent') {
          conflicts.push('content_vs_launch')
        }
        
        set({ conflicts })
        return conflicts
      },
      
      // Feature Recommendation Management
      presentFeatures: (recommendations, packageRec) => {
        set({
          recommendedFeatures: recommendations,
          featureSelection: {
            package: packageRec.package,
            selectedFeatures: [],
            totalPrice: packageRec.basePrice,
            monthlyHosting: packageRec.package === 'starter' ? 75 : 
                           packageRec.package === 'professional' ? 150 : 300,
            featuresPresented: true,
            presentedAt: new Date(),
          },
          lastActivity: new Date(),
        })
      },
      
      selectFeatures: (features) => {
        const state = get()
        const recommendations = state.recommendedFeatures
        
        // Calculate total price
        const featurePrice = features.reduce((sum, featureId) => {
          const feature = recommendations.find(f => f.id === featureId)
          return sum + (feature?.price || 0)
        }, 0)
        
        const basePrice = state.featureSelection?.package === 'starter' ? 2500 :
                         state.featureSelection?.package === 'professional' ? 4500 : 6000
        
        set((state) => ({
          featureSelection: state.featureSelection ? {
            ...state.featureSelection,
            selectedFeatures: features,
            totalPrice: basePrice + featurePrice,
          } : null,
          lastActivity: new Date(),
        }))
      },
      
      // Feature Conflict Validation
      validateFeatureSelection: () => {
        const state = get()
        const selected = state.featureSelection?.selectedFeatures || []
        const conflicts: string[] = []
        
        // Check for conflicting features
        const conflictPairs = [
          ['booking_system', 'appointment_scheduling'],
          ['ecommerce_basic', 'ecommerce_advanced'],
          ['customer_portal', 'membership_portal'],
        ]
        
        for (const [f1, f2] of conflictPairs) {
          if (selected.includes(f1) && selected.includes(f2)) {
            conflicts.push(`${f1} conflicts with ${f2}`)
          }
        }
        
        if (conflicts.length > 0) {
          set({ featureConflicts: conflicts })
          return false
        }
        
        return true
      },
      
      // Validation Loops
      addValidationLoop: (loop) => {
        const newLoop: ValidationLoop = {
          id: crypto.randomUUID(),
          ...loop,
          timestamp: new Date(),
        }
        
        set((state) => ({
          validationLoops: [...state.validationLoops, newLoop],
          validationCount: state.validationCount + 1,
          lastActivity: new Date(),
        }))
      },
      
      updateValidationResponse: (loopId, response, clarification) => {
        set((state) => ({
          validationLoops: state.validationLoops.map(loop =>
            loop.id === loopId
              ? { ...loop, response, clarification }
              : loop
          ),
          lastActivity: new Date(),
        }))
      },
      
      // Enhanced completeness calculation
      calculateCompleteness: () => {
        const state = get()
        const categoryWeights = {
          foundation: 0.1,
          businessContext: 0.2,
          brandAssets: 0.1,
          contentReadiness: 0.1,
          technicalRequirements: 0.15,
          mediaRequirements: 0.05,
          designDirection: 0.1,
          postLaunchSupport: 0.05,
          projectParameters: 0.15,
        }
        
        let totalCompletion = 0
        
        // Calculate weighted completion
        for (const [category, weight] of Object.entries(categoryWeights)) {
          const progress = state.categoryProgress[category] || 0
          totalCompletion += progress * weight
        }
        
        return Math.round(totalCompletion)
      },
      
      syncToCloud: async () => {
        const state = get()
        
        try {
          const response = await fetch('/api/sessions/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: state.sessionId,
              data: {
                userName: state.userName,
                userEmail: state.userEmail,
                userPhone: state.userPhone,
                websiteType: state.websiteType,
                businessModel: state.businessModel,
                messages: state.messages,
                intelligence: state.intelligence,
                featureSelection: state.featureSelection,
                validationLoops: state.validationLoops,
                completionPercentage: state.completionPercentage,
                categoryProgress: state.categoryProgress,
              },
            }),
          })
          
          if (!response.ok) throw new Error('Sync failed')
          
          const { sessionId, magicToken } = await response.json()
          
          set({ 
            sessionId, 
            magicToken,
            lastActivity: new Date(),
          })
        } catch (error) {
          console.error('Cloud sync failed:', error)
          // Continue with local storage
        }
      },
      
      detectAbandonmentRisk: () => {
        const state = get()
        const inactiveMinutes = 
          (Date.now() - state.lastActivity.getTime()) / 1000 / 60
        
        // Higher risk if features were presented but not selected
        const featureAbandonmentRisk = 
          state.featureSelection?.featuresPresented && 
          state.featureSelection.selectedFeatures.length === 0
        
        return (inactiveMinutes > 5 && state.completionPercentage < 100) ||
               featureAbandonmentRisk || false
      },
      
      validateAndSanitize: validateInput,
      
      reset: () => {
        set({
          sessionId: null,
          magicToken: null,
          userName: '',
          userEmail: '',
          userPhone: '',
          websiteType: '',
          businessModel: null,
          businessModelConfidence: 0,
          classifiedAt: null,
          messages: [],
          currentQuestionId: null,
          questionCount: 0,
          isTyping: false,
          intelligence: {
            businessModel: null,
            businessModelConfidence: 0,
            businessModelIndicators: [],
          },
          confidence: 0,
          gaps: [],
          conflicts: [],
          featureSelection: null,
          recommendedFeatures: [],
          featureConflicts: [],
          validationLoops: [],
          validationCount: 0,
          completionPercentage: 0,
          currentCategory: 'foundation',
          categoryProgress: {
            foundation: 100,
            businessContext: 0,
            brandAssets: 0,
            contentReadiness: 0,
            technicalRequirements: 0,
            mediaRequirements: 0,
            designDirection: 0,
            postLaunchSupport: 0,
            projectParameters: 0,
          },
          estimatedTimeRemaining: 20,
          scopeProgress: {
            sections: {
              section1_executive_summary: 'not_started',
              section2_project_classification: 'not_started',
              section3_client_information: 'not_started',
              section4_business_context: 'not_started',
              section5_brand_assets: 'not_started',
              section6_content_strategy: 'not_started',
              section7_technical_specs: 'not_started',
              section8_media_elements: 'not_started',
              section9_design_direction: 'not_started',
              section10_features_breakdown: 'not_started',
              section11_support_plan: 'not_started',
              section12_timeline: 'not_started',
              section13_investment_summary: 'not_started',
              section14_validation_outcomes: 'not_started',
            },
            overallCompleteness: 0,
            sectionsComplete: 0,
            sectionsInProgress: 0,
            sectionsNotStarted: 14,
          },
          currentQuestion: null,
          featureRecommendations: null,
          packageRecommendation: null,
          showingFeatureSelection: false,
          lastActivity: new Date(),
          ipAddress: null,
          suspiciousActivityCount: 0,
        })
      },
      
      // Claude Orchestration (V3.2)
      orchestrateNext: async () => {
        const state = get()
        
        if (!state.websiteType || !state.userEmail) {
          console.error('Cannot orchestrate without foundation data')
          return null
        }
        
        set({ isTyping: true })
        
        try {
          const response = await fetch('/api/claude/orchestrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation: state.messages,
              intelligence: state.intelligence,
              websiteType: state.websiteType,
              questionCount: state.questionCount,
              foundation: {
                userName: state.userName,
                userEmail: state.userEmail,
                userPhone: state.userPhone,
                websiteType: state.websiteType,
              },
              currentQuestion: state.currentQuestion ? {
                id: state.currentQuestion.id,
                text: state.currentQuestion.text,
              } : null,
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error', details: 'Failed to parse error response' }))
            console.error('Orchestration API error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
            })
            throw new Error(errorData.details || errorData.error || `Orchestration failed: ${response.status} ${response.statusText}`)
          }
          
          const claudeResponse: ClaudeResponse = await response.json()
          
          // Update SCOPE.md progress based on actual section status
          if (claudeResponse.progress) {
            // CRITICAL: Start with existing sections to preserve already-completed sections
            // This ensures sections 2 & 3 (from foundation) are never lost
            const updatedSections = { ...state.scopeProgress.sections }
            
            // Helper function to map Claude's section names to our section keys
            const mapSectionName = (sectionName: string): string | null => {
              const normalized = sectionName.toLowerCase().trim()
              // Handle various formats: "Section 1", "section1", "Section 1: Executive Summary", etc.
              const sectionMatch = normalized.match(/section\s*(\d+)/)
              if (sectionMatch) {
                const num = sectionMatch[1]
                const sectionMap: Record<string, string> = {
                  '1': 'section1_executive_summary',
                  '2': 'section2_project_classification',
                  '3': 'section3_client_information',
                  '4': 'section4_business_context',
                  '5': 'section5_brand_assets',
                  '6': 'section6_content_strategy',
                  '7': 'section7_technical_specs',
                  '8': 'section8_media_elements',
                  '9': 'section9_design_direction',
                  '10': 'section10_features_breakdown',
                  '11': 'section11_support_plan',
                  '12': 'section12_timeline',
                  '13': 'section13_investment_summary',
                  '14': 'section14_validation_outcomes',
                }
                return sectionMap[num] || null
              }
              return null
            }
            
            // Mark sections as complete if Claude says they're complete
            // Only update if not already complete (preserve existing completed sections)
            claudeResponse.progress.scope_sections_complete.forEach((sectionName: string) => {
              const sectionKey = mapSectionName(sectionName)
              if (sectionKey && sectionKey in updatedSections) {
                // Only mark as complete if not already complete (preserve state)
                if (updatedSections[sectionKey as keyof typeof updatedSections] !== 'complete') {
                  updatedSections[sectionKey as keyof typeof updatedSections] = 'complete'
                }
              }
            })
            
            // Mark sections as in progress (only if not already complete or in progress)
            claudeResponse.progress.scope_sections_in_progress.forEach((sectionName: string) => {
              const sectionKey = mapSectionName(sectionName)
              if (sectionKey && sectionKey in updatedSections) {
                const currentStatus = updatedSections[sectionKey as keyof typeof updatedSections]
                // Only mark as in_progress if currently not_started (don't downgrade from complete)
                if (currentStatus === 'not_started') {
                  updatedSections[sectionKey as keyof typeof updatedSections] = 'in_progress'
                }
              }
            })
            
            // Calculate actual completed sections from updated state
            const completedSections = Object.values(updatedSections).filter(
              (status) => status === 'complete'
            ).length
            const inProgressSections = Object.values(updatedSections).filter(
              (status) => status === 'in_progress'
            ).length
            const notStartedSections = Object.values(updatedSections).filter(
              (status) => status === 'not_started'
            ).length
            
            // Calculate completion percentage based on completed sections only
            const newCompletionPercentage = Math.round((completedSections / 14) * 100)
            
            // CRITICAL: Progress should NEVER decrease - use Math.max to ensure it only increases
            // This is a safety net in case section counting is wrong
            const currentCompletion = state.completionPercentage
            const finalCompletionPercentage = Math.max(currentCompletion, newCompletionPercentage)
            
            set({
              scopeProgress: {
                sections: updatedSections,
                overallCompleteness: finalCompletionPercentage,
                sectionsComplete: completedSections,
                sectionsInProgress: inProgressSections,
                sectionsNotStarted: notStartedSections,
              },
              completionPercentage: finalCompletionPercentage,
            })
          }
          
          // Handle feature recommendations
          if (claudeResponse.action === 'recommend_features' && claudeResponse.content.features) {
            const featuresData = claudeResponse.content.features
            const pkg = featuresData.package
            
            // Convert to FeatureRecommendation format
            const featureRecs: FeatureRecommendation[] = (featuresData.recommended || []).map((f: any) => ({
              id: f.id,
              name: f.name,
              description: f.description,
              price: f.price,
              reasoning: f.reasoning,
              priority: f.priority === 'highly_recommended' ? 'highly_recommended' : 
                       f.priority === 'recommended' ? 'highly_recommended' : 'nice_to_have',
              roi: f.roi,
            }))
            
            const packageRec: PackageRecommendation = {
              package: pkg as 'starter' | 'professional' | 'custom',
              rationale: `Based on your needs, we recommend the ${pkg} package.`,
              basePrice: pkg === 'starter' ? 2500 : pkg === 'professional' ? 4500 : 6000,
              included: featuresData.included || [],
            }
            
            // Add assistant message about features
            get().addMessage({
              role: 'assistant',
              content: `Based on your needs, I've prepared a selection of features for your ${state.websiteType} website. Please select the ones that fit your project.`,
            })
            
            set({
              featureRecommendations: featureRecs,
              packageRecommendation: packageRec,
              showingFeatureSelection: true,
              currentQuestion: null,
              isTyping: false,
            })
            
            // Present features in store
            get().presentFeatures(featureRecs, packageRec)
          }
          
          // Handle question action
          else if (claudeResponse.action === 'ask_question' && claudeResponse.content.question) {
            const question = claudeResponse.content.question
            
            // DO NOT add question text as a message - questions are displayed in currentQuestion box only
            // Messages array is for conversation history, not for displaying questions
            
            // Update intelligence if provided
            if (claudeResponse.intelligence) {
              get().updateIntelligence(claudeResponse.intelligence)
            }
            
            set({
              currentQuestion: question,
              currentQuestionId: question.id,
              showingFeatureSelection: false,
              isTyping: false,
            })
          }
          
          // Handle completion
          else if (claudeResponse.action === 'complete') {
            // Mark all sections as complete
            const allSectionsComplete: Record<string, 'complete'> = {}
            Object.keys(state.scopeProgress.sections).forEach((key) => {
              allSectionsComplete[key] = 'complete'
            })
            
            set({
              isTyping: false,
              scopeProgress: {
                sections: allSectionsComplete as any,
                overallCompleteness: 100,
                sectionsComplete: 14,
                sectionsInProgress: 0,
                sectionsNotStarted: 0,
              },
              completionPercentage: 100,
              showingFeatureSelection: false,
            })
          }
          
          return claudeResponse
        } catch (error) {
          console.error('Orchestration error:', error)
          set({ isTyping: false })
          return null
        }
      },
      
      submitAnswer: async (answer, questionId) => {
        const state = get()
        const sanitized = validateInput(answer)
        
        // Get the question that was answered before clearing it
        const answeredQuestion = state.currentQuestion
        
        // Add user message with question context so Claude knows what was answered
        get().addMessage({
          role: 'user',
          content: sanitized,
          metadata: {
            questionId,
            questionText: answeredQuestion?.text, // Include question text for context
            questionCategory: answeredQuestion?.category,
          },
        })
        
        // Update intelligence based on answer
        // This will be enhanced as we gather more context
        
        // Clear current question
        set({ currentQuestion: null, currentQuestionId: null })
        
        // Trigger next orchestration
        await get().orchestrateNext()
      },
      
      updateScopeProgress: (progress) => {
        set((state) => ({
          scopeProgress: {
            ...state.scopeProgress,
            ...progress,
          },
        }))
      },
      
      submitFeatureSelection: async (selectedFeatureIds) => {
        const state = get()
        
        if (!state.featureRecommendations || !state.packageRecommendation) {
          console.error('No feature recommendations available')
          return
        }
        
        // Update feature selection
        get().selectFeatures(selectedFeatureIds)
        
        // Add user message
        get().addMessage({
          role: 'user',
          content: `Selected ${selectedFeatureIds.length} feature${selectedFeatureIds.length !== 1 ? 's' : ''}`,
        })
        
        // Clear feature selection UI
        set({
          showingFeatureSelection: false,
          featureRecommendations: null,
          packageRecommendation: null,
        })
        
        // Update SCOPE.md section 10 as complete
        set((state) => {
          const updatedSections = {
            ...state.scopeProgress.sections,
            section10_features_breakdown: 'complete',
          }
          
          // Calculate actual completed sections
          const completedSections = Object.values(updatedSections).filter(
            (status) => status === 'complete'
          ).length
          const inProgressSections = Object.values(updatedSections).filter(
            (status) => status === 'in_progress'
          ).length
          const notStartedSections = Object.values(updatedSections).filter(
            (status) => status === 'not_started'
          ).length
          
          const newCompletionPercentage = Math.round((completedSections / 14) * 100)
          
          // CRITICAL: Progress should NEVER decrease
          const finalCompletionPercentage = Math.max(state.completionPercentage, newCompletionPercentage)
          
          return {
            scopeProgress: {
              sections: updatedSections,
              overallCompleteness: finalCompletionPercentage,
              sectionsComplete: completedSections,
              sectionsInProgress: inProgressSections,
              sectionsNotStarted: notStartedSections,
            },
            completionPercentage: finalCompletionPercentage,
          }
        })
        
        // Continue orchestration
        await get().orchestrateNext()
      },
    }),
    {
      name: 'introspect-v3-conversation',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          try {
            return JSON.parse(decryptSync(str))
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encryptSync(JSON.stringify(value)))
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        sessionId: state.sessionId,
        userName: state.userName,
        userEmail: state.userEmail,
        userPhone: state.userPhone,
        websiteType: state.websiteType,
        businessModel: state.businessModel,
        messages: state.messages,
        intelligence: state.intelligence,
        featureSelection: state.featureSelection,
        validationLoops: state.validationLoops,
        completionPercentage: state.completionPercentage,
        categoryProgress: state.categoryProgress,
      }),
    }
  )
)
