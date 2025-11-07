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

export interface ClaudeResponse {
  action: 'question' | 'validate' | 'recommend_features' | 'complete'
  content: {
    question?: string
    validation?: {
      category: string
      summary: string
      confirmed: boolean
    }
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

