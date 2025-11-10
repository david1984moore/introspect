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
  ValidationPrompt,
  ValidationResponse,
  ValidationOutcome,
} from '@/types'
import type { BusinessModel } from '@/types/business-models'
import type { ScopeProgress, ClaudeResponse, Question } from '@/types/conversation'
import { progressCalculator, convertToConversationIntelligence } from '@/lib/utils/progressCalculator'
import type { ScopeDocument, ClientSummary } from '@/types/scope'
import type { ValidationResult } from '@/lib/scope/documentValidator'
import type { EmailDelivery } from '@/types/email'

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
  packageTier: 'Starter' | 'Professional' | 'Custom' // Phase 6: Package tier for feature pricing
  
  // Phase 8: Validation & Confirmation
  currentValidation: ValidationPrompt | null
  validationHistory: ValidationOutcome[]
  
  // Error Handling
  orchestrationError: string | null
  
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
  calculatePackageTier: () => 'Starter' | 'Professional' | 'Custom' // Phase 6: Calculate package tier
  
  // Phase 8: Validation Actions
  submitValidation: (response: ValidationResponse) => Promise<void>
  addValidationOutcome: (outcome: ValidationOutcome) => void
  continueOrchestration: (data: { action: string; [key: string]: any }) => Promise<void>
  
  // Phase 7: Progress Tracking
  updateProgress: () => void
  
  // Phase 9: SCOPE.md Generation
  generatedScope: ScopeDocument | null
  clientSummary: ClientSummary | null
  scopeValidation: ValidationResult | null
  isGeneratingScope: boolean
  scopeGenerationError: string | null
  
  generateScopeDocument: () => Promise<void>
  downloadScopeMarkdown: () => void
  downloadClientPDF: () => Promise<void>
  
  // Phase 10: Email Delivery & Completion
  emailDeliveryStatus: {
    client: 'pending' | 'sent' | 'failed'
    david: 'pending' | 'sent' | 'failed'
  }
  emailDeliveries: EmailDelivery[]
  isCompletingConversation: boolean
  completionError: string | null
  isComplete: boolean
  
  completeConversation: () => Promise<void>
  retryEmailDelivery: (recipientType: 'client' | 'david') => Promise<void>
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
      orchestrationError: null,
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
        sectionsRemaining: 14,
        currentSection: null,
        estimatedQuestionsRemaining: 0,
      },
      currentQuestion: null,
      featureRecommendations: null,
      packageRecommendation: null,
      showingFeatureSelection: false,
      packageTier: 'Professional', // Default, calculated dynamically
      currentValidation: null, // Phase 8: Current validation prompt
      validationHistory: [], // Phase 8: Validation outcomes history
      lastActivity: new Date(),
      ipAddress: null,
      suspiciousActivityCount: 0,
      
      // Phase 9: SCOPE.md Generation state
      generatedScope: null,
      clientSummary: null,
      scopeValidation: null,
      isGeneratingScope: false,
      scopeGenerationError: null,
      
      // Phase 10: Email Delivery & Completion state
      emailDeliveryStatus: {
        client: 'pending',
        david: 'pending'
      },
      emailDeliveries: [],
      isCompletingConversation: false,
      completionError: null,
      isComplete: false,
      
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
        
        // Only mark sections 2 and 3 as complete when ALL foundation data is present
        // This ensures we don't mark sections complete prematurely during the multi-step form
        const hasAllFoundationData = sanitized.userName && 
                                     sanitized.userEmail && 
                                     sanitized.websiteType
        
        const state = get()
        let updatedProgress = state.scopeProgress
        
        if (hasAllFoundationData) {
          // Initialize SCOPE.md sections 2 and 3 as complete (foundation data)
          updatedProgress = {
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
              sectionsRemaining: 14 - completedSections,
              overallCompleteness: Math.round((completedSections / 14) * 100),
            },
            completionPercentage: Math.round((completedSections / 14) * 100),
          })
        } else {
          // Partial data - don't mark sections complete yet
          set({
            ...sanitized,
            lastActivity: new Date(),
          })
        }
        
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
            sectionsRemaining: 14,
          },
          currentQuestion: null,
          featureRecommendations: null,
          packageRecommendation: null,
          showingFeatureSelection: false,
          packageTier: 'Professional',
          currentValidation: null, // Phase 8: Reset validation
          validationHistory: [], // Phase 8: Reset validation history
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
        
        set({ isTyping: true, orchestrationError: null })
        
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
                sectionsRemaining: notStartedSections,
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
              packageTier: pkg === 'starter' ? 'Starter' : pkg === 'professional' ? 'Professional' : 'Custom',
              currentQuestion: null,
              isTyping: false,
              orchestrationError: null, // Clear any errors
            })
            
            // Present features in store
            get().presentFeatures(featureRecs, packageRec)
          }
          
          // Phase 8: Handle validation action
          else if (claudeResponse.action === 'validate_understanding' && claudeResponse.content.summary) {
            // Create validation prompt from Claude's response
            // Note: In production, Claude would return a structured ValidationPrompt
            // For now, we'll create a basic one from the summary
            const validationPrompt: ValidationPrompt = {
              id: `validation_${Date.now()}`,
              type: 'understanding',
              category: claudeResponse.sufficiency_evaluation?.scope_section || 'general',
              summary: claudeResponse.content.summary,
              allowEdit: true
            }
            
            set({
              currentValidation: validationPrompt,
              currentQuestion: null,
              showingFeatureSelection: false,
              isTyping: false,
              orchestrationError: null, // Clear any errors
            })
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
              currentValidation: null, // Clear any validation when showing question
              isTyping: false,
              orchestrationError: null, // Clear any errors
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
              orchestrationError: null, // Clear any errors
            })
            
            // Phase 10: Generate SCOPE.md and send emails
            // This will be triggered by the UI when navigating to completion page
            // to avoid blocking the response
          }
          
          // Handle unexpected action types
          else {
            console.error('Unexpected action from Claude:', claudeResponse.action)
            const errorMessage = `Unexpected response type: ${claudeResponse.action}. Please try refreshing.`
            set({
              isTyping: false,
              orchestrationError: errorMessage,
              currentQuestion: null,
            })
            return null
          }
          
          // Phase 7: After orchestration completes, re-evaluate progress to ensure
          // sections can be promoted from 'in_progress' to 'complete' if calculator says so
          // This ensures that even if Claude marks a section as 'in_progress', 
          // the calculator can promote it to 'complete' if enough data has been gathered
          get().updateProgress()
          
          // Clear any previous errors on success
          set({ orchestrationError: null })
          
          return claudeResponse
        } catch (error) {
          console.error('Orchestration error:', error)
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to load next question. Please try again.'
          set({ 
            isTyping: false,
            orchestrationError: errorMessage,
            currentQuestion: null,
          })
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
        
        // Note: updateProgress() is now called at the end of orchestrateNext()
        // to ensure sections are re-evaluated after Claude's response
      },
      
      updateScopeProgress: (progress) => {
        set((state) => ({
          scopeProgress: {
            ...state.scopeProgress,
            ...progress,
          },
        }))
      },
      
      // Phase 6: Calculate package tier based on intelligence
      calculatePackageTier: () => {
        const state = get()
        const intelligence = state.intelligence
        
        // Simple logic (in production, this would be more sophisticated)
        if (intelligence.budgetRange === 'under_5k' || intelligence.budgetRange === 'under_5000') {
          return 'Starter'
        } else if (intelligence.budgetRange === '5k_to_10k' || intelligence.budgetRange === '5000_to_10000') {
          return 'Professional'
        } else {
          return 'Custom'
        }
      },
      
      submitFeatureSelection: async (selectedFeatureIds) => {
        const state = get()
        
        // Phase 6: Use new feature library system
        // Calculate package tier if not already set
        const packageTier = state.packageTier || get().calculatePackageTier()
        
        // Import feature library for pricing calculation
        const { featureLibrary } = await import('@/lib/features/featureLibraryParser')
        const pricing = featureLibrary.calculatePricing(selectedFeatureIds, packageTier)
        
        // Update feature selection with new pricing
        const basePrice = packageTier === 'Starter' ? 2500 : 
                         packageTier === 'Professional' ? 4500 : 6000
        
        get().selectFeatures(selectedFeatureIds)
        
        // Update feature selection with pricing
        set({
          featureSelection: {
            package: packageTier.toLowerCase() as 'starter' | 'professional' | 'custom',
            selectedFeatures: selectedFeatureIds,
            totalPrice: basePrice + pricing.total,
            monthlyHosting: packageTier === 'Starter' ? 75 : 
                          packageTier === 'Professional' ? 150 : 300,
            featuresPresented: true,
            presentedAt: new Date(),
          },
          packageTier,
        })
        
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
        
        // Phase 7: Update progress after feature selection
        get().updateProgress()
      },
      
      // Phase 8: Submit validation response
      submitValidation: async (response: ValidationResponse) => {
        const state = get()
        const currentValidation = state.currentValidation
        if (!currentValidation) return
        
        // Helper function to apply corrections to summary
        const applyCorrections = (
          summary: string,
          corrections: Record<string, string>
        ): string => {
          let correctedSummary = summary
          
          Object.entries(corrections).forEach(([field, value]) => {
            // Simple replacement logic - in production, this would be more sophisticated
            correctedSummary = correctedSummary.replace(
              new RegExp(field, 'gi'),
              value
            )
          })
          
          return correctedSummary
        }
        
        // Create outcome record
        const outcome: ValidationOutcome = {
          validationId: response.validationId,
          type: currentValidation.type,
          category: currentValidation.category,
          originalSummary: currentValidation.summary,
          userResponse: response,
          finalSummary: response.confirmed 
            ? currentValidation.summary 
            : applyCorrections(currentValidation.summary, response.corrections || {})
        }
        
        // Store outcome
        get().addValidationOutcome(outcome)
        
        // If corrections were made, update intelligence
        if (response.corrections) {
          set({
            intelligence: {
              ...state.intelligence,
              ...response.corrections
            }
          })
        }
        
        // Continue orchestration
        await get().continueOrchestration({
          action: 'validation_complete',
          validationId: response.validationId,
          confirmed: response.confirmed,
          corrections: response.corrections
        })
        
        // Clear current validation
        set({ currentValidation: null })
      },
      
      // Phase 8: Add validation outcome to history
      addValidationOutcome: (outcome: ValidationOutcome) => {
        set({
          validationHistory: [...get().validationHistory, outcome]
        })
      },
      
      // Phase 8: Continue orchestration after validation
      continueOrchestration: async (data: { action: string; [key: string]: any }) => {
        const state = get()
        
        // Add user message about validation
        get().addMessage({
          role: 'user',
          content: data.confirmed 
            ? 'Validation confirmed' 
            : 'Validation corrections provided',
          metadata: {
            validationId: data.validationId
          }
        })
        
        // Continue with next orchestration
        await get().orchestrateNext()
      },
      
      // Phase 7: Update progress based on current intelligence
      updateProgress: () => {
        const state = get()
        
        // Convert store state to ConversationIntelligence format
        const conversationIntelligence = convertToConversationIntelligence(
          state.intelligence,
          {
            userName: state.userName,
            userEmail: state.userEmail,
            userPhone: state.userPhone,
            websiteType: state.websiteType,
          },
          state.featureSelection?.selectedFeatures
        )
        
        // Calculate progress using the calculator
        const calculatedProgress = progressCalculator.calculateProgress(conversationIntelligence)
        
        // Update scopeProgress, preserving any sections already marked complete
        // (to avoid downgrading sections that Claude marked as complete)
        const updatedSections = { ...state.scopeProgress.sections }
        
        // Only update sections if the new status is more complete than current
        Object.entries(calculatedProgress.sections).forEach(([key, newStatus]) => {
          const currentStatus = updatedSections[key as keyof typeof updatedSections]
          
          // Status hierarchy: not_started < in_progress < complete
          if (currentStatus === 'not_started' && (newStatus === 'in_progress' || newStatus === 'complete')) {
            updatedSections[key as keyof typeof updatedSections] = newStatus
          } else if (currentStatus === 'in_progress' && newStatus === 'complete') {
            updatedSections[key as keyof typeof updatedSections] = newStatus
          }
          // If currentStatus is already 'complete', keep it (don't downgrade)
        })
        
        // Recalculate counts based on updated sections
        const sectionsComplete = Object.values(updatedSections).filter(
          status => status === 'complete'
        ).length
        const sectionsInProgress = Object.values(updatedSections).filter(
          status => status === 'in_progress'
        ).length
        const sectionsRemaining = Object.values(updatedSections).filter(
          status => status === 'not_started'
        ).length
        
        const overallCompleteness = Math.round((sectionsComplete / 14) * 100)
        
        // CRITICAL: Progress should NEVER decrease
        const finalCompletionPercentage = Math.max(state.completionPercentage, overallCompleteness)
        
        set({
          scopeProgress: {
            sections: updatedSections,
            overallCompleteness: finalCompletionPercentage,
            sectionsComplete,
            sectionsInProgress,
            sectionsRemaining,
            currentSection: calculatedProgress.currentSection,
            estimatedQuestionsRemaining: calculatedProgress.estimatedQuestionsRemaining,
          },
          completionPercentage: finalCompletionPercentage,
        })
      },
      
      // Phase 9: SCOPE.md Generation Actions
      generateScopeDocument: async () => {
        set({ 
          isGeneratingScope: true, 
          scopeGenerationError: null 
        })
        
        try {
          const state = get()
          
          // Convert store state to ConversationIntelligence
          const conversationIntelligence = convertToConversationIntelligence(
            state.intelligence,
            {
              userName: state.userName,
              userEmail: state.userEmail,
              userPhone: state.userPhone,
              websiteType: state.websiteType,
            },
            state.featureSelection?.selectedFeatures
          )
          
          // Import scope generator dynamically
          const { scopeGenerator } = await import('@/lib/scope/scopeGenerator')
          const { clientSummaryGenerator } = await import('@/lib/scope/clientSummaryGenerator')
          const { documentValidator } = await import('@/lib/scope/documentValidator')
          
          const conversationId = state.sessionId || `conv_${Date.now()}`
          
          // Generate SCOPE.md
          const scope = await scopeGenerator.generateScope(
            conversationIntelligence,
            conversationId
          )
          
          // Validate document
          const validation = documentValidator.validate(scope)
          
          if (!validation.isValid) {
            const criticalErrors = validation.errors.filter(e => e.severity === 'critical')
            if (criticalErrors.length > 0) {
              throw new Error(
                `Cannot generate SCOPE.md with critical errors: ${
                  criticalErrors.map(e => e.message).join(', ')
                }`
              )
            }
          }
          
          // Generate client summary
          const clientSummary = clientSummaryGenerator.generateClientSummary(
            scope,
            conversationIntelligence
          )
          
          set({
            generatedScope: scope,
            clientSummary,
            scopeValidation: validation,
            isGeneratingScope: false
          })
          
          // Save to backend
          await fetch('/api/scope/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              scope,
              clientSummary,
              validation
            })
          })
          
        } catch (error) {
          console.error('SCOPE.md generation failed:', error)
          set({
            scopeGenerationError: error instanceof Error ? error.message : 'Unknown error',
            isGeneratingScope: false
          })
          throw error
        }
      },
      
      downloadScopeMarkdown: () => {
        const scope = get().generatedScope
        if (!scope) {
          throw new Error('No SCOPE.md document generated')
        }
        
        // Import markdown generator dynamically
        import('@/lib/scope/markdownGenerator').then(({ markdownGenerator }) => {
          const markdown = markdownGenerator.generateMarkdown(scope)
          const blob = new Blob([markdown], { type: 'text/markdown' })
          const url = URL.createObjectURL(blob)
          
          const a = document.createElement('a')
          a.href = url
          a.download = `SCOPE_${scope.section1_executiveSummary.projectName.replace(/\s+/g, '_')}.md`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
      },
      
      downloadClientPDF: async () => {
        const clientSummary = get().clientSummary
        if (!clientSummary) {
          throw new Error('No client summary generated')
        }
        
        // Import client summary generator dynamically
        const { clientSummaryGenerator } = await import('@/lib/scope/clientSummaryGenerator')
        
        // Generate HTML
        const html = clientSummaryGenerator.generateHTML(clientSummary)
        
        // Call PDF generation API
        const response = await fetch('/api/scope/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html })
        })
        
        if (!response.ok) {
          throw new Error('PDF generation failed')
        }
        
        // Download PDF
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `${clientSummary.projectName.replace(/\s+/g, '_')}_Summary.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      
      // Phase 10: Complete conversation and send emails
      completeConversation: async () => {
        set({ 
          isCompletingConversation: true,
          completionError: null
        })
        
        try {
          const state = get()
          
          // Ensure SCOPE.md is generated
          if (!state.generatedScope || !state.clientSummary) {
            await state.generateScopeDocument()
          }
          
          const scope = get().generatedScope
          const clientSummary = get().clientSummary
          const conversationId = get().sessionId || `conv_${Date.now()}`
          
          if (!scope || !clientSummary) {
            throw new Error('Failed to generate documents')
          }
          
          // Send emails via API endpoint
          const response = await fetch('/api/conversations/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              scope,
              clientSummary
            })
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(errorData.error || 'Failed to complete conversation')
          }
          
          const { emailDeliveries } = await response.json()
          
          // Update delivery status
          set({
            emailDeliveries: emailDeliveries || [],
            emailDeliveryStatus: {
              client: emailDeliveries?.find((e: EmailDelivery) => e.recipientType === 'client')?.status === 'sent' ? 'sent' : 'failed',
              david: emailDeliveries?.find((e: EmailDelivery) => e.recipientType === 'david')?.status === 'sent' ? 'sent' : 'failed'
            },
            isCompletingConversation: false,
            isComplete: true
          })
          
        } catch (error) {
          console.error('Conversation completion failed:', error)
          set({
            completionError: error instanceof Error ? error.message : 'Unknown error',
            isCompletingConversation: false
          })
          throw error
        }
      },
      
      // Phase 10: Retry failed email delivery
      retryEmailDelivery: async (recipientType: 'client' | 'david') => {
        try {
          const state = get()
          const scope = state.generatedScope
          const clientSummary = state.clientSummary
          
          if (!scope || !clientSummary) {
            throw new Error('Documents not available for retry')
          }
          
          const conversationId = state.sessionId || `conv_${Date.now()}`
          
          // Retry via API endpoint
          const response = await fetch('/api/conversations/retry-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId,
              recipientType,
              scope,
              clientSummary
            })
          })
          
          if (!response.ok) {
            throw new Error('Email retry failed')
          }
          
          const { delivery } = await response.json()
          
          set(state => ({
            emailDeliveryStatus: {
              ...state.emailDeliveryStatus,
              [recipientType]: delivery.status === 'sent' ? 'sent' : 'failed'
            },
            emailDeliveries: [
              ...state.emailDeliveries.filter(e => e.recipientType !== recipientType),
              delivery
            ]
          }))
          
        } catch (error) {
          console.error('Email retry failed:', error)
          throw error
        }
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
