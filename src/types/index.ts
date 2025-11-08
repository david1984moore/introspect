// Comprehensive type definitions for Introspect V3
// Phase 2: State Management & Security

import type { BusinessModel } from './business-models'

// Re-export existing types
export type { BusinessModel } from './business-models'
export type { FoundationData } from './conversation'
export type { WebsiteType } from './conversation'

// Message Types
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

