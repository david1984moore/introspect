// Phase 9: SCOPE.md Generation Types
// Complete SCOPE.md structure with all 14 sections

export interface ScopeDocument {
  // Metadata
  generatedAt: string
  conversationId: string
  version: string // e.g., "1.0"
  
  // All 14 sections
  section1_executiveSummary: ExecutiveSummary
  section2_projectClassification: ProjectClassification
  section3_clientInformation: ClientInformation
  section4_businessContext: BusinessContext
  section5_brandAssets: BrandAssets
  section6_contentStrategy: ContentStrategy
  section7_technicalSpecifications: TechnicalSpecifications
  section8_mediaElements: MediaElements
  section9_designDirection: DesignDirection
  section10_featuresBreakdown: FeaturesBreakdown
  section11_supportPlan: SupportPlan
  section12_timeline: Timeline
  section13_investmentSummary: InvestmentSummary
  section14_validationOutcomes: ValidationOutcomes
}

// Section 1: Executive Summary
export interface ExecutiveSummary {
  projectName: string
  websiteType: string
  primaryGoal: string
  targetAudience: string
  keyDifferentiator: string
  summaryText: string // 2-3 sentences
}

// Section 2: Project Classification
export interface ProjectClassification {
  websiteType: string
  industry: string
  businessModel?: string
  projectComplexity: 'simple' | 'standard' | 'complex'
  recommendedPackage: 'starter' | 'professional' | 'custom'
  packagePrice: number
  complexityRationale: string
}

// Section 3: Client Information
export interface ClientInformation {
  fullName: string
  email: string
  phone: string
  companyName: string
  decisionMakerRole?: string
  preferredContactMethod?: string
}

// Section 4: Business Context
export interface BusinessContext {
  companyOverview: string // 2-3 sentences
  targetAudience: {
    description: string
    technicalLevel: string
    primaryNeeds: string[]
  }
  primaryGoal: string
  successMetrics: Array<{
    metric: string
    target?: string
    measurement: string
  }>
  valueProposition: string
  painPoints: string[]
}

// Section 5: Brand Assets & Identity
export interface BrandAssets {
  existingAssets: {
    logo: boolean
    colorPalette: boolean
    fonts: boolean
    styleGuide: boolean
    imagery: boolean
  }
  brandStyle: string
  whatNeedsCreation: string[]
  inspirationReferences?: Array<{
    url: string
    notes: string
  }>
}

// Section 6: Content Strategy
export interface ContentStrategy {
  contentProvider: 'client' | 'applicreations' | 'mixed'
  contentReadiness: 'ready' | 'in_progress' | 'needs_creation'
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely'
  maintenancePlan: string
  contentTypes: string[]
  copywritingNeeded: boolean
  photographyNeeded: boolean
}

// Section 7: Technical Specifications
export interface TechnicalSpecifications {
  authentication?: {
    required: boolean
    method?: 'email_password' | 'social' | 'magic_link' | 'multi_factor'
    providers?: string[]
    userRoles?: string[]
  }
  contentManagement: {
    required: boolean
    type?: 'headless_cms' | 'wordpress' | 'custom'
    updateFrequency?: string
    editors?: number
  }
  search: {
    required: boolean
    scope?: string[]
    filters?: string[]
  }
  websiteTypeFeatures: Record<string, any> // Varies by type
  integrations: Array<{
    service: string
    purpose: string
    provider?: string
  }>
  compliance: {
    required: string[] // HIPAA, GDPR, PCI-DSS, WCAG, etc.
    level?: string
  }
  security: {
    sslRequired: boolean
    additionalRequirements?: string[]
  }
  performance: {
    expectedTraffic: string
    criticalMetrics: string[]
    cachingStrategy?: string
  }
}

// Section 8: Media & Interactive Elements
export interface MediaElements {
  video?: {
    required: boolean
    hosting?: string
    autoplay?: boolean
    backgroundVideo?: boolean
  }
  galleries?: {
    required: boolean
    type?: string[]
    imageCount?: string
  }
  animations?: {
    required: boolean
    type?: string[]
    complexity?: string
  }
  interactiveElements?: Array<{
    type: string
    description: string
    complexity: string
  }>
  audio?: {
    required: boolean
    type?: string
  }
  maps?: {
    required: boolean
    provider?: string
    features?: string[]
  }
}

// Section 9: Design Direction
export interface DesignDirection {
  overallStyle: string
  colorScheme?: {
    primary?: string
    secondary?: string
    direction?: string
  }
  typography?: {
    style?: string
    readability?: string
  }
  layout: {
    preference?: string
    whitespace?: string
    gridStyle?: string
  }
  references: Array<{
    url: string
    elements: string[]
    notes?: string
  }>
  designPriorities: string[]
}

// Section 10: Features & Functionality Breakdown
export interface FeaturesBreakdown {
  basePackage: {
    name: string
    price: number
    includedFeatures: string[]
  }
  addOnFeatures: Array<{
    id: string
    name: string
    description: string
    category: string
    price: number
    rationale: string
  }>
  featureBundles: Array<{
    name: string
    features: string[]
    originalPrice: number
    discountedPrice: number
    savings: number
  }>
  conflicts: Array<{
    featureA: string
    featureB: string
    resolution: string
  }>
  dependencies: Array<{
    feature: string
    requires: string[]
    reason: string
  }>
}

// Section 11: Post-Launch Support Plan
export interface SupportPlan {
  supportDuration: string
  training: {
    required: boolean
    topics?: string[]
    format?: string
    duration?: string
  }
  maintenancePlan: {
    provider: 'applicreations' | 'client' | 'third_party'
    includes: string[]
    frequency: string
  }
  futurePhases?: Array<{
    name: string
    description: string
    estimatedTiming: string
  }>
  hosting: {
    tier: 'starter' | 'professional' | 'custom'
    monthlyPrice: number
    includes: string[]
  }
}

// Section 12: Project Timeline
export interface Timeline {
  desiredLaunchDate?: string
  estimatedDuration: string
  milestones: Array<{
    name: string
    description: string
    duration: string
    dependencies?: string[]
    clientResponsibility?: string
  }>
  criticalPath: string[]
  risks: Array<{
    risk: string
    mitigation: string
  }>
}

// Section 13: Investment Summary
export interface InvestmentSummary {
  basePackage: {
    name: string
    price: number
  }
  addOnFeatures: Array<{
    name: string
    price: number
  }>
  bundleDiscounts: Array<{
    name: string
    discount: number
  }>
  subtotal: number
  hosting: {
    tier: string
    monthlyPrice: number
    annualPrice: number
  }
  totalProjectInvestment: number
  totalFirstYearInvestment: number
  roi?: {
    calculable: boolean
    metrics?: {
      revenueIncrease?: number
      costReduction?: number
      conversionImprovement?: number
    }
    estimatedROI?: string
    paybackPeriod?: string
  }
  paymentSchedule: Array<{
    milestone: string
    percentage: number
    amount: number
  }>
}

// Section 14: Validation Outcomes
export interface ValidationOutcomes {
  understandingValidations: Array<{
    category: string
    originalSummary: string
    confirmed: boolean
    corrections?: Record<string, string>
    finalSummary: string
    timestamp: string
  }>
  conflictsResolved: Array<{
    description: string
    resolution: string
    timestamp: string
  }>
  assumptionsClarified: Array<{
    assumption: string
    confirmed: boolean
    clarification?: string
    timestamp: string
  }>
  keyDecisions: Array<{
    decision: string
    rationale: string
    timestamp: string
  }>
}

// Client-friendly summary (for PDF)
export interface ClientSummary {
  projectName: string
  clientName: string
  summaryDate: string
  
  overview: {
    websiteType: string
    primaryGoal: string
    targetAudience: string
  }
  
  keyFeatures: string[]
  
  investmentSummary: {
    totalInvestment: number
    monthlyHosting: number
    estimatedTimeline: string
  }
  
  nextSteps: string[]
}

