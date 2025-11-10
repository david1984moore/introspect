# Phase 2: State Management & Security
**Days 4-6 | Introspect V3 Implementation**

## Overview

This phase implements comprehensive state management with Zustand, including business model classification and feature selection state, plus multi-layered security protections aligned with the V3 architecture.

**Duration:** 3 days  
**Prerequisites:** Phase 1 complete  
**Deliverables:**
- Zustand store with persistence
- Business model classification state
- Feature selection management
- Security utilities (encryption, rate limiting)
- Input sanitization with prompt injection defense
- Session management with recovery
- Cloud sync foundation

---

## Day 4: Enhanced Zustand Store

### 4.1 Comprehensive Type Definitions

**File:** `src/types/index.ts`

```typescript
import { BusinessModel } from './business-models'

export interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
  validated: boolean
  metadata?: {
    questionId?: string
    category?: string
    validationLoop?: boolean
  }
}

export interface FoundationData {
  userName: string
  userEmail: string
  userPhone: string
  websiteType: string
}

// Feature Recommendation Types (aligned with v3.2)
export interface FeatureRecommendation {
  id: string
  name: string
  description: string
  price: number
  reasoning: string
  priority: 'essential' | 'highly_recommended' | 'nice_to_have'
  roi?: string
  conflictsWith?: string[]
  requires?: string[]
}

export interface PackageRecommendation {
  package: 'starter' | 'professional' | 'custom'
  rationale: string
  basePrice: number
  included: string[]
}

export interface FeatureSelection {
  package: 'starter' | 'professional' | 'custom'
  selectedFeatures: string[]
  totalPrice: number
  monthlyHosting: number
  featuresPresented: boolean
  presentedAt: Date | null
}

// Intelligence Gathering Types
export interface SessionIntelligence {
  // Business Model Classification
  businessModel: BusinessModel | null
  businessModelConfidence: number
  businessModelIndicators: string[]
  
  // Business Context
  businessName?: string
  businessType?: string
  industry?: string
  primaryGoal?: string
  targetAudience?: string
  uniqueValue?: string
  competitors?: string[]
  
  // Operational Indicators
  requiresScheduling?: boolean
  hasInventory?: boolean
  acceptsPayments?: boolean
  hasMembers?: boolean
  publishesContent?: boolean
  
  // Volume & Scale
  appointmentsPerWeek?: number
  productsToSell?: number
  memberCount?: number
  estimatedTraffic?: 'low' | 'medium' | 'high'
  
  // Pain Points
  manualProcesses?: string[]
  currentNoShowRate?: number
  timeSpentOnTask?: Record<string, number>
  
  // Compliance & Security
  complianceRequirements?: ('HIPAA' | 'PCI-DSS' | 'GDPR' | 'ADA')[]
  securityNeeds?: string[]
  
  // Goals & Constraints
  budgetRange?: string
  launchTimeline?: string
  decisionMakers?: string[]
  
  // Content & Assets
  contentReadiness?: 'ready' | 'in_progress' | 'need_help'
  hasLogo?: boolean
  hasBrandColors?: boolean
  hasPhotography?: boolean
}

// Validation Loop Types
export interface ValidationLoop {
  id: string
  category: string
  summary: string
  points: string[]
  implications: string[]
  response?: 'correct' | 'clarify'
  clarification?: string
  timestamp: Date
}

export interface SessionContext {
  // Foundation
  userName: string
  userEmail: string
  userPhone: string
  websiteType: string
  
  // Conversation
  messages: Message[]
  
  // Intelligence
  intelligence: SessionIntelligence
  
  // Business Model
  businessModel: BusinessModel | null
  
  // Feature Selection
  featureSelection: FeatureSelection | null
  
  // Validation
  validationLoops: ValidationLoop[]
}
```

### 4.2 Conversation Store with Feature Management

**File:** `src/stores/conversationStore.ts`

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { encrypt, decrypt } from '@/lib/security/encryption'
import DOMPurify from 'dompurify'
import type { 
  Message, 
  FoundationData, 
  SessionIntelligence,
  FeatureSelection,
  ValidationLoop,
  BusinessModel
} from '@/types'

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
  presentFeatures: (recommendations: FeatureRecommendation[], package: PackageRecommendation) => void
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
      
      // Business Model Classification (NEW)
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
      
      // Conflict Detection (aligned with v3.2)
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
      
      // Feature Recommendation Management (NEW)
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
      
      // Feature Conflict Validation (aligned with v3.2)
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
      
      // Validation Loops (NEW)
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
          return decrypt(str)
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encrypt(value))
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
```

---

## Day 5: Security Implementation

[Same security implementation as before, but with enhanced prompt injection detection]

---

## Day 6: API Routes & Cloud Sync

### 6.1 Enhanced Session Sync API

**File:** `src/app/api/sessions/sync/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { sessionId, data } = await request.json()
    
    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') ||
               'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Prepare enhanced session data
    const sessionData = {
      user_name: data.userName,
      user_email: data.userEmail,
      user_phone: data.userPhone,
      website_type: data.websiteType,
      business_model: data.businessModel,
      messages: data.messages || [],
      intelligence: data.intelligence || {},
      feature_selection: data.featureSelection || null,
      validation_loops: data.validationLoops || [],
      completion_percentage: data.completionPercentage || 0,
      category_progress: data.categoryProgress || {},
      ip_address: ip,
      user_agent: userAgent,
      updated_at: new Date().toISOString(),
    }
    
    if (sessionId) {
      // Update existing session
      const { error } = await supabase
        .from('sessions')
        .update(sessionData)
        .eq('id', sessionId)
      
      if (error) throw error
      
      return NextResponse.json({ sessionId })
    } else {
      // Create new session
      const { data: newSession, error } = await supabase
        .from('sessions')
        .insert({
          ...sessionData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Generate magic token for recovery
      const magicToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48)
      
      await supabase
        .from('sessions')
        .update({
          magic_token: magicToken,
          magic_token_expires_at: expiresAt.toISOString(),
        })
        .eq('id', newSession.id)
      
      return NextResponse.json({ 
        sessionId: newSession.id,
        magicToken 
      })
    }
  } catch (error) {
    console.error('Session sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync session' },
      { status: 500 }
    )
  }
}
```

---

## Testing Checklist

### State Management
- [ ] Store persists to localStorage
- [ ] Data encrypts/decrypts correctly
- [ ] Business model classification stores properly
- [ ] Feature selection state updates correctly
- [ ] Validation loops tracked accurately
- [ ] Category progress calculates correctly

### Security
- [ ] Input sanitization blocks XSS
- [ ] Enhanced prompt injection detection works
- [ ] Rate limiter blocks excessive requests
- [ ] Session tokens rotate on suspicious activity

### Cloud Sync
- [ ] Sessions create successfully
- [ ] Updates sync properly
- [ ] Magic tokens generate correctly
- [ ] Recovery mechanism works

### Feature Management
- [ ] Feature recommendations stored
- [ ] Selection updates pricing correctly
- [ ] Conflicts detected properly
- [ ] Dependencies handled automatically

---

## Success Criteria

✅ All user input sanitized with enhanced detection  
✅ Business model classification state managed  
✅ Feature selection with conflict detection  
✅ Validation loops tracked and stored  
✅ Category progress accurately calculated  
✅ Data encrypted in localStorage  
✅ Rate limiting active (20 req/min)  
✅ Session syncs to cloud with full state  
✅ Magic links generate for recovery  
✅ Abandonment detection includes features

---

## Next Phase

Phase 3 will integrate Claude API with the complete orchestration engine, including business model classification logic and feature recommendation presentation.
