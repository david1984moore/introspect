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
  reset: () => void
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
      lastActivity: new Date(),
      ipAddress: null,
      suspiciousActivityCount: 0,
      
      // Actions
      setFoundation: (data) => {
        const sanitized = {
          userName: validateInput(data.userName),
          userEmail: validateInput(data.userEmail),
          userPhone: validateInput(data.userPhone || ''),
          websiteType: validateInput(data.websiteType),
        }
        
        set({
          ...sanitized,
          currentCategory: 'business_context',
          completionPercentage: 15,
          lastActivity: new Date(),
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
        set((state) => ({
          intelligence: { ...state.intelligence, ...data },
          lastActivity: new Date(),
        }))
        
        // Recalculate completeness
        const completeness = get().calculateCompleteness()
        set({ completionPercentage: completeness })
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
          lastActivity: new Date(),
          ipAddress: null,
          suspiciousActivityCount: 0,
        })
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
