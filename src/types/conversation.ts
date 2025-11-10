export type WebsiteType = 
  | 'business'
  | 'personal'
  | 'project'
  | 'nonprofit'
  | 'other'

export interface FoundationData {
  userName: string
  userEmail: string
  userPhone?: string
  websiteType: WebsiteType | string
  websiteTypeOther?: string
}

export interface Intelligence {
  [key: string]: string | number | boolean | string[] | undefined
}

export interface ConversationState {
  foundation: FoundationData
  intelligence: Intelligence
  questionCount: number
  confidence: number
  currentCategory?: string
  completedCategories: string[]
  featuresPresented: boolean
  isComplete: boolean
}

// SCOPE.md Section Progress Tracking (V3.2)
export type ScopeSectionStatus = 'not_started' | 'in_progress' | 'complete'

export interface ScopeProgress {
  sections: {
    section1_executive_summary: ScopeSectionStatus
    section2_project_classification: ScopeSectionStatus
    section3_client_information: ScopeSectionStatus
    section4_business_context: ScopeSectionStatus
    section5_brand_assets: ScopeSectionStatus
    section6_content_strategy: ScopeSectionStatus
    section7_technical_specs: ScopeSectionStatus
    section8_media_elements: ScopeSectionStatus
    section9_design_direction: ScopeSectionStatus
    section10_features_breakdown: ScopeSectionStatus
    section11_support_plan: ScopeSectionStatus
    section12_timeline: ScopeSectionStatus
    section13_investment_summary: ScopeSectionStatus
    section14_validation_outcomes: ScopeSectionStatus
  }
  overallCompleteness: number // 0-100%
  sectionsComplete: number
  sectionsInProgress: number
  sectionsNotStarted: number
}

// Sufficiency Evaluation (V3.2)
export interface SufficiencyEvaluation {
  scope_section: string // e.g., "Section 4: Business Context - Target Audience"
  section_requirements: Record<string, 'complete' | 'incomplete' | 'missing'>
  current_information: string
  required_for_scope: string
  is_sufficient: boolean
  reason: string
  implementation_impact?: string
  questions_in_section: number
  within_depth_limit: boolean
  decision: 'ask_question' | 'move_to_next_section' | 'validate_understanding'
  next_section?: string
}

// Question Option (V3.2)
export interface QuestionOption {
  value: string
  label: string
  allowText?: boolean // For "Something else" option
  description?: string // Optional 1-line explanation (Phase 5)
  recommended?: boolean // Visual indicator for Claude's recommendation (Phase 5)
}

// Alias for Phase 5 compatibility
export type Option = QuestionOption

// Question Validation (Phase 5)
export interface QuestionValidation {
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: string // Regex pattern for validation
  errorMessage?: string
}

// Question Structure (V3.2)
export interface Question {
  id: string
  text: string
  inputType: 'radio' | 'checkbox' | 'text' | 'textarea'
  options?: QuestionOption[]
  category: string
  scope_section?: string
  scope_requirement?: string
  placeholder?: string // For text input questions (Phase 5)
  validation?: QuestionValidation // Phase 5
}

// Claude Response (V3.2 - SCOPE.md-driven)
export interface ClaudeResponse {
  action: 'ask_question' | 'validate_understanding' | 'recommend_features' | 'complete'
  reasoning: string
  sufficiency_evaluation: SufficiencyEvaluation
  content: {
    question?: Question
    summary?: string // For validation
    features?: {
      package: string
      included: string[]
      recommended: Array<{
        id: string
        name: string
        description: string
        price: number
        reasoning: string
        priority: 'highly_recommended' | 'recommended' | 'optional'
        roi?: string
      }>
    }
    completion?: {
      readyForGeneration: boolean
      missingRequirements: string[]
      completenessCheck: Record<string, boolean>
      summary: string
      totalEstimate: number
      timeline: string
    }
  }
  intelligence?: Record<string, any> // Extracted data points
  progress: {
    percentage: number
    scope_sections_complete: string[]
    scope_sections_in_progress: string[]
    scope_sections_remaining: string[]
  }
}

export interface CategoryCompleteness {
  businessContext: number
  brandAssets: number
  contentReadiness: number
  technicalRequirements: number
  mediaRequirements: number
  designDirection: number
  postLaunchSupport: number
  projectParameters: number
}

// Phase 4: Context Summary Types
export interface ConversationIntelligence {
  // Foundation
  userName: string
  userEmail: string
  userPhone?: string
  companyName?: string
  websiteType: string
  industry?: string
  
  // Business Context
  targetAudience?: string
  primaryGoal?: string
  problemBeingSolved?: string
  successMetrics?: string[]
  valueProposition?: string
  
  // Technical Requirements
  needsUserAccounts?: boolean
  authenticationMethod?: string
  needsCMS?: boolean
  cmsUpdateFrequency?: string
  needsSearch?: boolean
  
  // Features
  selectedFeatures?: string[]
  featurePricing?: Record<string, number>
  
  // Design
  designStyle?: string
  existingBrandAssets?: string[]
  
  // Timeline & Budget
  desiredTimeline?: string
  budgetRange?: string
  priority?: string
  
  // Content
  contentProvider?: string
  contentReadiness?: string
  
  // Integrations
  emailService?: string
  analyticsProvider?: string
  paymentProcessor?: string
  
  // Additional context
  [key: string]: any
}

export interface ContextItem {
  label: string
  value: string
  category?: 'foundation' | 'business' | 'technical' | 'features' | 'design' | 'timeline'
}

