# Phase 9: SCOPE.md Generation & Document Assembly
**Days 26-29 | Introspect V3 Implementation**

## Overview

Build the complete SCOPE.md generation system that transforms conversation intelligence into comprehensive technical specifications and client-friendly summaries - the culmination of Phases 1-8.

**Duration:** 3-4 days  
**Prerequisites:** Phases 1-8 complete  
**Deliverables:**
- Complete 14-section SCOPE.md generator
- Feature Library pricing integration
- Client-friendly PDF summary generator
- Document validation system
- ROI calculation engine
- Email delivery preparation
- Quality assurance checks

---

## Why This Phase Matters

### The Payoff: From Conversation to Complete Specification

Everything built in Phases 1-8 exists for THIS moment:
- Foundation questions → Contact information & classification
- Business context questions → Business understanding
- Feature selection → Complete feature manifest
- Technical questions → Implementation requirements
- Validation responses → Confirmed understanding

**SCOPE.md is the bridge between customer intent and Cursor AI implementation.**

### Design Principle: Developer-Ready Documentation

SCOPE.md must be so complete that:
- ✅ Cursor AI can build the entire project without clarification
- ✅ No ambiguity about requirements
- ✅ No missing technical specifications
- ✅ No placeholder text or "TBD" sections
- ✅ Clear implementation priorities
- ✅ Accurate pricing with no hidden assumptions

**The test:** Could you hand this to a developer who's never met the client and they could build exactly what's needed?

---

## Part 1: Core Types & Architecture

**File:** `types/scope.ts`

```typescript
// Complete SCOPE.md structure
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
```

---

## Part 2: SCOPE.md Generator Core Engine

**File:** `lib/scope/scopeGenerator.ts`

```typescript
import type { 
  ConversationIntelligence 
} from '@/types/conversation'
import type { 
  ScopeDocument,
  ExecutiveSummary,
  ProjectClassification,
  ClientInformation,
  BusinessContext,
  BrandAssets,
  ContentStrategy,
  TechnicalSpecifications,
  MediaElements,
  DesignDirection,
  FeaturesBreakdown,
  SupportPlan,
  Timeline,
  InvestmentSummary,
  ValidationOutcomes
} from '@/types/scope'
import { featureLibrary } from '@/lib/features/featureLibrary'
import { pricingCalculator } from '@/lib/pricing/pricingCalculator'

export class ScopeGenerator {
  /**
   * Generate complete SCOPE.md from conversation intelligence
   */
  async generateScope(
    intelligence: ConversationIntelligence,
    conversationId: string
  ): Promise<ScopeDocument> {
    
    // Validate completeness before generation
    this.validateIntelligenceCompleteness(intelligence)
    
    const scope: ScopeDocument = {
      generatedAt: new Date().toISOString(),
      conversationId,
      version: '1.0',
      
      section1_executiveSummary: this.generateExecutiveSummary(intelligence),
      section2_projectClassification: this.generateProjectClassification(intelligence),
      section3_clientInformation: this.generateClientInformation(intelligence),
      section4_businessContext: this.generateBusinessContext(intelligence),
      section5_brandAssets: this.generateBrandAssets(intelligence),
      section6_contentStrategy: this.generateContentStrategy(intelligence),
      section7_technicalSpecifications: this.generateTechnicalSpecifications(intelligence),
      section8_mediaElements: this.generateMediaElements(intelligence),
      section9_designDirection: this.generateDesignDirection(intelligence),
      section10_featuresBreakdown: this.generateFeaturesBreakdown(intelligence),
      section11_supportPlan: this.generateSupportPlan(intelligence),
      section12_timeline: this.generateTimeline(intelligence),
      section13_investmentSummary: this.generateInvestmentSummary(intelligence),
      section14_validationOutcomes: this.generateValidationOutcomes(intelligence)
    }
    
    return scope
  }
  
  /**
   * Section 1: Executive Summary
   */
  private generateExecutiveSummary(intelligence: ConversationIntelligence): ExecutiveSummary {
    const projectName = intelligence.companyName || intelligence.projectName || 'Unnamed Project'
    const websiteType = this.formatWebsiteType(intelligence.websiteType)
    const primaryGoal = intelligence.primaryGoal || 'establish online presence'
    const targetAudience = intelligence.targetAudience || 'general audience'
    
    // Determine key differentiator
    const keyDifferentiator = this.determineKeyDifferentiator(intelligence)
    
    // Generate 2-3 sentence summary
    const summaryText = this.craftExecutiveSummary(
      projectName,
      websiteType,
      primaryGoal,
      targetAudience,
      keyDifferentiator
    )
    
    return {
      projectName,
      websiteType,
      primaryGoal,
      targetAudience,
      keyDifferentiator,
      summaryText
    }
  }
  
  private craftExecutiveSummary(
    projectName: string,
    websiteType: string,
    primaryGoal: string,
    targetAudience: string,
    keyDifferentiator: string
  ): string {
    return `${projectName} is a ${websiteType} website designed to ${primaryGoal} for ${targetAudience}. ${keyDifferentiator}. The project emphasizes professional execution, conversion optimization, and seamless user experience.`
  }
  
  private determineKeyDifferentiator(intelligence: ConversationIntelligence): string {
    // Extract differentiator from intelligence
    if (intelligence.valueProposition) {
      return intelligence.valueProposition
    }
    
    // Generate based on selected features
    const uniqueFeatures = intelligence.selectedFeatures?.slice(0, 2) || []
    if (uniqueFeatures.length > 0) {
      const featureNames = uniqueFeatures
        .map(id => featureLibrary.getFeature(id)?.name)
        .filter(Boolean)
        .join(' and ')
      return `Key differentiators include ${featureNames}`
    }
    
    return 'The project focuses on delivering exceptional value through thoughtful design and implementation'
  }
  
  /**
   * Section 2: Project Classification
   */
  private generateProjectClassification(intelligence: ConversationIntelligence): ProjectClassification {
    const complexity = this.determineComplexity(intelligence)
    const recommendedPackage = this.determinePackage(intelligence, complexity)
    
    return {
      websiteType: intelligence.websiteType || 'general',
      industry: intelligence.industry || 'General',
      businessModel: intelligence.businessModel,
      projectComplexity: complexity,
      recommendedPackage,
      packagePrice: this.getPackagePrice(recommendedPackage),
      complexityRationale: this.getComplexityRationale(intelligence, complexity)
    }
  }
  
  private determineComplexity(intelligence: ConversationIntelligence): 'simple' | 'standard' | 'complex' {
    let complexityScore = 0
    
    // Base complexity by website type
    const typeComplexity: Record<string, number> = {
      'portfolio': 1,
      'blog': 1,
      'landing': 1,
      'service': 2,
      'corporate': 2,
      'ecommerce': 3,
      'marketplace': 3,
      'saas': 3
    }
    complexityScore += typeComplexity[intelligence.websiteType || 'service'] || 2
    
    // Feature count
    const featureCount = intelligence.selectedFeatures?.length || 0
    if (featureCount < 3) complexityScore += 0
    else if (featureCount < 6) complexityScore += 1
    else complexityScore += 2
    
    // Technical requirements
    if (intelligence.needsUserAccounts) complexityScore += 1
    if (intelligence.needsCMS) complexityScore += 1
    if (intelligence.needsPaymentProcessing) complexityScore += 1
    if (intelligence.integrations && intelligence.integrations.length > 2) complexityScore += 1
    
    // Compliance requirements
    if (intelligence.complianceRequirements && intelligence.complianceRequirements.length > 0) {
      complexityScore += 1
    }
    
    // Determine tier
    if (complexityScore <= 3) return 'simple'
    if (complexityScore <= 6) return 'standard'
    return 'complex'
  }
  
  private determinePackage(
    intelligence: ConversationIntelligence,
    complexity: string
  ): 'starter' | 'professional' | 'custom' {
    // Budget preference if stated
    if (intelligence.budgetRange) {
      if (intelligence.budgetRange === 'under_3k') return 'starter'
      if (intelligence.budgetRange === '3k_to_5k') return 'professional'
      return 'custom'
    }
    
    // Based on complexity
    if (complexity === 'simple') return 'starter'
    if (complexity === 'standard') return 'professional'
    return 'custom'
  }
  
  private getPackagePrice(packageType: string): number {
    const prices = {
      starter: 2500,
      professional: 4500,
      custom: 6000
    }
    return prices[packageType as keyof typeof prices] || 6000
  }
  
  private getComplexityRationale(
    intelligence: ConversationIntelligence,
    complexity: string
  ): string {
    const factors: string[] = []
    
    if (intelligence.websiteType === 'ecommerce' || intelligence.websiteType === 'marketplace') {
      factors.push('e-commerce functionality requires robust product management')
    }
    
    if (intelligence.needsUserAccounts) {
      factors.push('user authentication system needed')
    }
    
    if (intelligence.needsPaymentProcessing) {
      factors.push('payment processing integration required')
    }
    
    const featureCount = intelligence.selectedFeatures?.length || 0
    if (featureCount > 5) {
      factors.push(`extensive feature set (${featureCount} custom features)`)
    }
    
    if (intelligence.complianceRequirements && intelligence.complianceRequirements.length > 0) {
      factors.push(`compliance requirements (${intelligence.complianceRequirements.join(', ')})`)
    }
    
    return `Classified as ${complexity} based on: ${factors.join('; ')}.`
  }
  
  /**
   * Section 3: Client Information
   */
  private generateClientInformation(intelligence: ConversationIntelligence): ClientInformation {
    return {
      fullName: intelligence.fullName || 'Name not provided',
      email: intelligence.email || '',
      phone: intelligence.phone || '',
      companyName: intelligence.companyName || intelligence.projectName || '',
      decisionMakerRole: intelligence.decisionMakerRole,
      preferredContactMethod: intelligence.preferredContactMethod
    }
  }
  
  /**
   * Section 4: Business Context
   */
  private generateBusinessContext(intelligence: ConversationIntelligence): BusinessContext {
    return {
      companyOverview: this.generateCompanyOverview(intelligence),
      targetAudience: {
        description: intelligence.targetAudience || 'General audience',
        technicalLevel: intelligence.audienceTechnicalLevel || 'Mixed technical proficiency',
        primaryNeeds: intelligence.audiencePrimaryNeeds || []
      },
      primaryGoal: intelligence.primaryGoal || 'Establish online presence',
      successMetrics: this.formatSuccessMetrics(intelligence),
      valueProposition: intelligence.valueProposition || this.generateValueProposition(intelligence),
      painPoints: intelligence.painPoints || []
    }
  }
  
  private generateCompanyOverview(intelligence: ConversationIntelligence): string {
    const company = intelligence.companyName || 'The organization'
    const industry = intelligence.industry || 'their industry'
    const description = intelligence.companyDescription || 
      `operates in ${industry}, focusing on delivering value to their target market`
    
    return `${company} ${description}.`
  }
  
  private formatSuccessMetrics(intelligence: ConversationIntelligence): Array<{
    metric: string
    target?: string
    measurement: string
  }> {
    if (!intelligence.successMetrics || intelligence.successMetrics.length === 0) {
      return [
        {
          metric: 'User engagement',
          measurement: 'Time on site and pages per session'
        },
        {
          metric: 'Conversion rate',
          measurement: 'Goal completions and form submissions'
        }
      ]
    }
    
    return intelligence.successMetrics.map(metric => ({
      metric,
      target: intelligence.successMetricTargets?.[metric],
      measurement: this.getMetricMeasurement(metric)
    }))
  }
  
  private getMetricMeasurement(metric: string): string {
    const measurements: Record<string, string> = {
      'lead_generation': 'Contact form submissions and inquiry volume',
      'sales': 'Transaction volume and revenue',
      'engagement': 'Time on site, pages per session, return visits',
      'brand_awareness': 'Traffic volume, social shares, backlinks',
      'customer_satisfaction': 'NPS score, support tickets, reviews'
    }
    
    return measurements[metric.toLowerCase().replace(/\s+/g, '_')] || 
      'To be tracked via analytics platform'
  }
  
  private generateValueProposition(intelligence: ConversationIntelligence): string {
    // Generate based on website type and goals
    const type = intelligence.websiteType || 'website'
    const goal = intelligence.primaryGoal || 'serve customers'
    
    return `Professional ${type} designed to ${goal} with emphasis on user experience and conversion optimization.`
  }
  
  /**
   * Section 5: Brand Assets & Identity
   */
  private generateBrandAssets(intelligence: ConversationIntelligence): BrandAssets {
    return {
      existingAssets: {
        logo: intelligence.hasLogo ?? false,
        colorPalette: intelligence.hasColorPalette ?? false,
        fonts: intelligence.hasFonts ?? false,
        styleGuide: intelligence.hasStyleGuide ?? false,
        imagery: intelligence.hasImagery ?? false
      },
      brandStyle: intelligence.brandStyle || 'Modern and professional',
      whatNeedsCreation: this.determineAssetCreationNeeds(intelligence),
      inspirationReferences: intelligence.inspirationReferences || []
    }
  }
  
  private determineAssetCreationNeeds(intelligence: ConversationIntelligence): string[] {
    const needs: string[] = []
    
    if (!intelligence.hasLogo) needs.push('Logo design')
    if (!intelligence.hasColorPalette) needs.push('Color palette')
    if (!intelligence.hasFonts) needs.push('Typography system')
    if (!intelligence.hasStyleGuide) needs.push('Brand style guide')
    if (!intelligence.hasImagery) needs.push('Photography/imagery')
    
    return needs
  }
  
  /**
   * Section 6: Content Strategy
   */
  private generateContentStrategy(intelligence: ConversationIntelligence): ContentStrategy {
    return {
      contentProvider: intelligence.contentProvider || 'mixed',
      contentReadiness: intelligence.contentReadiness || 'needs_creation',
      updateFrequency: intelligence.contentUpdateFrequency || 'monthly',
      maintenancePlan: this.generateMaintenancePlan(intelligence),
      contentTypes: intelligence.contentTypes || ['text', 'images'],
      copywritingNeeded: intelligence.needsCopywriting ?? true,
      photographyNeeded: intelligence.needsPhotography ?? false
    }
  }
  
  private generateMaintenancePlan(intelligence: ConversationIntelligence): string {
    const provider = intelligence.contentProvider || 'mixed'
    const frequency = intelligence.contentUpdateFrequency || 'monthly'
    
    if (provider === 'client') {
      return `Client will maintain content with ${frequency} updates using provided CMS training.`
    } else if (provider === 'applicreations') {
      return `Applicreations will manage content updates on a ${frequency} basis as part of maintenance agreement.`
    } else {
      return `Mixed maintenance model: client manages routine updates ${frequency}, Applicreations handles technical changes.`
    }
  }
  
  /**
   * Section 7: Technical Specifications
   */
  private generateTechnicalSpecifications(intelligence: ConversationIntelligence): TechnicalSpecifications {
    return {
      authentication: intelligence.needsUserAccounts ? {
        required: true,
        method: intelligence.authenticationMethod || 'email_password',
        providers: intelligence.authProviders,
        userRoles: intelligence.userRoles
      } : { required: false },
      
      contentManagement: {
        required: intelligence.needsCMS ?? false,
        type: intelligence.cmsType,
        updateFrequency: intelligence.contentUpdateFrequency,
        editors: intelligence.numberOfEditors
      },
      
      search: {
        required: intelligence.needsSearch ?? false,
        scope: intelligence.searchScope,
        filters: intelligence.searchFilters
      },
      
      websiteTypeFeatures: this.generateTypeSpecificFeatures(intelligence),
      
      integrations: intelligence.integrations || [],
      
      compliance: {
        required: intelligence.complianceRequirements || [],
        level: intelligence.complianceLevel
      },
      
      security: {
        sslRequired: true,
        additionalRequirements: intelligence.securityRequirements || []
      },
      
      performance: {
        expectedTraffic: intelligence.expectedTraffic || 'Standard (< 10k visits/month)',
        criticalMetrics: intelligence.performanceMetrics || ['Load time < 2s', 'Mobile-responsive'],
        cachingStrategy: this.determineCachingStrategy(intelligence)
      }
    }
  }
  
  private generateTypeSpecificFeatures(intelligence: ConversationIntelligence): Record<string, any> {
    const type = intelligence.websiteType
    
    switch (type) {
      case 'ecommerce':
        return {
          productCatalog: {
            size: intelligence.productCount || 'To be determined',
            variants: intelligence.needsProductVariants ?? false,
            inventory: intelligence.needsInventoryManagement ?? false
          },
          checkout: {
            guestCheckout: intelligence.allowGuestCheckout ?? true,
            savedCarts: intelligence.needsSavedCarts ?? false
          },
          payments: {
            processor: intelligence.paymentProcessor || 'Stripe',
            methods: intelligence.paymentMethods || ['card', 'digital_wallet']
          }
        }
      
      case 'portfolio':
        return {
          projectOrganization: intelligence.portfolioOrganization || 'grid',
          caseStudyFormat: intelligence.caseStudyFormat || 'detailed',
          filtering: intelligence.needsPortfolioFiltering ?? true
        }
      
      case 'blog':
        return {
          categorySystem: intelligence.needsCategories ?? true,
          comments: intelligence.needsComments ?? false,
          subscriptions: intelligence.needsSubscriptions ?? false,
          rss: intelligence.needsRSS ?? true
        }
      
      case 'service':
        return {
          bookingSystem: intelligence.needsBooking ?? false,
          quoteRequests: intelligence.needsQuotes ?? true,
          serviceAreas: intelligence.serviceAreas || []
        }
      
      default:
        return {}
    }
  }
  
  private determineCachingStrategy(intelligence: ConversationIntelligence): string {
    const traffic = intelligence.expectedTraffic || 'standard'
    const needsCMS = intelligence.needsCMS ?? false
    
    if (traffic.includes('high') || traffic.includes('enterprise')) {
      return 'CDN + edge caching with invalidation strategy'
    } else if (needsCMS) {
      return 'Page-level caching with smart invalidation'
    } else {
      return 'Static generation with CDN delivery'
    }
  }
  
  /**
   * Section 8: Media & Interactive Elements
   */
  private generateMediaElements(intelligence: ConversationIntelligence): MediaElements {
    return {
      video: intelligence.needsVideo ? {
        required: true,
        hosting: intelligence.videoHosting || 'YouTube/Vimeo embed',
        autoplay: intelligence.videoAutoplay ?? false,
        backgroundVideo: intelligence.backgroundVideo ?? false
      } : { required: false },
      
      galleries: intelligence.needsGalleries ? {
        required: true,
        type: intelligence.galleryTypes || ['grid'],
        imageCount: intelligence.galleryImageCount
      } : { required: false },
      
      animations: intelligence.needsAnimations ? {
        required: true,
        type: intelligence.animationTypes || ['scroll', 'hover'],
        complexity: intelligence.animationComplexity || 'moderate'
      } : { required: false },
      
      interactiveElements: intelligence.interactiveElements || [],
      
      audio: intelligence.needsAudio ? {
        required: true,
        type: intelligence.audioType
      } : { required: false },
      
      maps: intelligence.needsMaps ? {
        required: true,
        provider: intelligence.mapProvider || 'Google Maps',
        features: intelligence.mapFeatures || ['location_pins']
      } : { required: false }
    }
  }
  
  /**
   * Section 9: Design Direction
   */
  private generateDesignDirection(intelligence: ConversationIntelligence): DesignDirection {
    return {
      overallStyle: intelligence.designStyle || 'Modern and clean',
      colorScheme: intelligence.colorScheme ? {
        primary: intelligence.colorScheme.primary,
        secondary: intelligence.colorScheme.secondary,
        direction: intelligence.colorScheme.direction
      } : { direction: 'To be determined with client' },
      typography: {
        style: intelligence.typographyStyle,
        readability: intelligence.typographyReadability || 'High priority'
      },
      layout: {
        preference: intelligence.layoutPreference,
        whitespace: intelligence.whitespacePreference || 'Generous (70%)',
        gridStyle: intelligence.gridStyle
      },
      references: intelligence.designReferences || [],
      designPriorities: intelligence.designPriorities || [
        'Visual hierarchy',
        'Conversion optimization',
        'Mobile-first design',
        'Accessibility'
      ]
    }
  }
  
  /**
   * Section 10: Features & Functionality Breakdown
   */
  private generateFeaturesBreakdown(intelligence: ConversationIntelligence): FeaturesBreakdown {
    const packageName = intelligence.recommendedPackage || 'professional'
    const packagePrice = this.getPackagePrice(packageName)
    
    // Get base package features
    const baseFeatures = this.getBasePackageFeatures(packageName)
    
    // Get selected add-on features with pricing
    const selectedFeatures = intelligence.selectedFeatures || []
    const addOnFeatures = selectedFeatures
      .map(featureId => {
        const feature = featureLibrary.getFeature(featureId)
        if (!feature) return null
        
        return {
          id: feature.id,
          name: feature.name,
          description: feature.description,
          category: feature.category,
          price: feature.pricing.basePrice,
          rationale: this.generateFeatureRationale(feature, intelligence)
        }
      })
      .filter(Boolean) as FeaturesBreakdown['addOnFeatures']
    
    // Calculate bundles
    const featureBundles = pricingCalculator.calculateBundles(selectedFeatures)
    
    // Identify conflicts (from validation)
    const conflicts = intelligence.featureConflicts || []
    
    // Identify dependencies
    const dependencies = this.identifyFeatureDependencies(selectedFeatures)
    
    return {
      basePackage: {
        name: packageName.charAt(0).toUpperCase() + packageName.slice(1),
        price: packagePrice,
        includedFeatures: baseFeatures
      },
      addOnFeatures,
      featureBundles,
      conflicts,
      dependencies
    }
  }
  
  private getBasePackageFeatures(packageName: string): string[] {
    const packages: Record<string, string[]> = {
      starter: [
        'Up to 5 pages',
        'Mobile-responsive design',
        'Basic SEO optimization',
        'Contact form',
        'Analytics setup',
        '30 days post-launch support'
      ],
      professional: [
        'Up to 10 pages',
        'Mobile-responsive design',
        'Advanced SEO optimization',
        'Custom forms',
        'Analytics & conversion tracking',
        'CMS integration',
        'Social media integration',
        '60 days post-launch support'
      ],
      custom: [
        'Unlimited pages',
        'Mobile-responsive design',
        'Enterprise SEO',
        'Custom functionality',
        'Advanced analytics',
        'Full CMS',
        'API integrations',
        '90 days post-launch support',
        'Priority support'
      ]
    }
    
    return packages[packageName] || packages.professional
  }
  
  private generateFeatureRationale(feature: any, intelligence: ConversationIntelligence): string {
    // Generate why this feature makes sense for this project
    if (feature.category === 'ecommerce' && intelligence.websiteType === 'ecommerce') {
      return `Essential for e-commerce functionality and customer experience`
    }
    
    if (feature.category === 'marketing' && intelligence.primaryGoal?.includes('lead')) {
      return `Supports lead generation goal through enhanced visitor engagement`
    }
    
    if (feature.category === 'performance' && intelligence.expectedTraffic?.includes('high')) {
      return `Critical for handling expected high traffic volumes`
    }
    
    return `Selected to meet project requirements and enhance user experience`
  }
  
  private identifyFeatureDependencies(featureIds: string[]): Array<{
    feature: string
    requires: string[]
    reason: string
  }> {
    const dependencies: Array<{
      feature: string
      requires: string[]
      reason: string
    }> = []
    
    // Example dependencies (would integrate with Feature Library)
    if (featureIds.includes('user_dashboard') && !featureIds.includes('user_accounts')) {
      dependencies.push({
        feature: 'User Dashboard',
        requires: ['User Accounts'],
        reason: 'Dashboard requires authentication system'
      })
    }
    
    if (featureIds.includes('shopping_cart') && !featureIds.includes('payment_processing')) {
      dependencies.push({
        feature: 'Shopping Cart',
        requires: ['Payment Processing'],
        reason: 'Cart requires checkout and payment functionality'
      })
    }
    
    return dependencies
  }
  
  /**
   * Section 11: Post-Launch Support Plan
   */
  private generateSupportPlan(intelligence: ConversationIntelligence): SupportPlan {
    const packageName = intelligence.recommendedPackage || 'professional'
    const supportDuration = this.getSupportDuration(packageName)
    
    return {
      supportDuration,
      training: {
        required: intelligence.needsTraining ?? intelligence.needsCMS ?? false,
        topics: intelligence.trainingTopics || ['Content management', 'Basic updates'],
        format: intelligence.trainingFormat || 'Video recordings + live session',
        duration: '2 hours'
      },
      maintenancePlan: {
        provider: intelligence.maintenanceProvider || 'applicreations',
        includes: [
          'Security updates',
          'Performance monitoring',
          'Backup management',
          'Technical support'
        ],
        frequency: 'Ongoing'
      },
      futurePhases: intelligence.futurePhases || [],
      hosting: {
        tier: this.determineHostingTier(intelligence),
        monthlyPrice: this.getHostingPrice(this.determineHostingTier(intelligence)),
        includes: this.getHostingIncludes(this.determineHostingTier(intelligence))
      }
    }
  }
  
  private getSupportDuration(packageName: string): string {
    const durations: Record<string, string> = {
      starter: '30 days post-launch',
      professional: '60 days post-launch',
      custom: '90 days post-launch'
    }
    return durations[packageName] || '60 days post-launch'
  }
  
  private determineHostingTier(intelligence: ConversationIntelligence): 'starter' | 'professional' | 'custom' {
    const traffic = intelligence.expectedTraffic || 'standard'
    const complexity = this.determineComplexity(intelligence)
    
    if (traffic.includes('high') || traffic.includes('enterprise') || complexity === 'complex') {
      return 'custom'
    } else if (complexity === 'standard' || intelligence.needsCMS) {
      return 'professional'
    }
    return 'starter'
  }
  
  private getHostingPrice(tier: string): number {
    const prices = {
      starter: 75,
      professional: 150,
      custom: 300
    }
    return prices[tier as keyof typeof prices] || 150
  }
  
  private getHostingIncludes(tier: string): string[] {
    const base = [
      'SSL certificate',
      'Daily backups',
      'Security monitoring',
      'Email support'
    ]
    
    if (tier === 'professional' || tier === 'custom') {
      base.push('CDN', 'Advanced caching', 'Priority support')
    }
    
    if (tier === 'custom') {
      base.push('Dedicated resources', 'SLA guarantee', '24/7 monitoring')
    }
    
    return base
  }
  
  /**
   * Section 12: Project Timeline
   */
  private generateTimeline(intelligence: ConversationIntelligence): Timeline {
    const complexity = this.determineComplexity(intelligence)
    const estimatedDuration = this.estimateDuration(complexity, intelligence)
    
    return {
      desiredLaunchDate: intelligence.desiredLaunchDate,
      estimatedDuration,
      milestones: this.generateMilestones(intelligence, complexity),
      criticalPath: this.identifyCriticalPath(intelligence),
      risks: this.identifyRisks(intelligence)
    }
  }
  
  private estimateDuration(complexity: string, intelligence: ConversationIntelligence): string {
    const baseDurations = {
      simple: 4,
      standard: 6,
      complex: 10
    }
    
    let weeks = baseDurations[complexity as keyof typeof baseDurations] || 6
    
    // Adjust for content readiness
    if (intelligence.contentReadiness === 'needs_creation') {
      weeks += 2
    }
    
    // Adjust for custom design needs
    if (!intelligence.hasLogo || !intelligence.hasColorPalette) {
      weeks += 1
    }
    
    return `${weeks}-${weeks + 2} weeks`
  }
  
  private generateMilestones(intelligence: ConversationIntelligence, complexity: string): Timeline['milestones'] {
    const milestones: Timeline['milestones'] = [
      {
        name: 'Project Kickoff',
        description: 'Contract signed, initial deposit received, project requirements finalized',
        duration: '1 week',
        clientResponsibility: 'Sign contract, provide deposit'
      },
      {
        name: 'Content Delivery',
        description: 'All content, images, and copy provided by client',
        duration: '1-2 weeks',
        dependencies: ['Project Kickoff'],
        clientResponsibility: 'Provide all content, images, and copy'
      },
      {
        name: 'Design Phase',
        description: 'Visual design mockups created and approved',
        duration: '2-3 weeks',
        dependencies: ['Content Delivery']
      },
      {
        name: 'Development Phase',
        description: 'Website built based on approved designs',
        duration: complexity === 'complex' ? '4-5 weeks' : '2-3 weeks',
        dependencies: ['Design Phase']
      },
      {
        name: 'Testing & QA',
        description: 'Comprehensive testing across devices and browsers',
        duration: '1 week',
        dependencies: ['Development Phase']
      },
      {
        name: 'Client Review',
        description: 'Client reviews and provides feedback',
        duration: '1 week',
        dependencies: ['Testing & QA'],
        clientResponsibility: 'Review site and provide consolidated feedback'
      },
      {
        name: 'Launch',
        description: 'Final deployment to production',
        duration: '1 week',
        dependencies: ['Client Review']
      }
    ]
    
    return milestones
  }
  
  private identifyCriticalPath(intelligence: ConversationIntelligence): string[] {
    return [
      'Content Delivery',
      'Design Approval',
      'Development Completion',
      'Client Final Review',
      'Launch'
    ]
  }
  
  private identifyRisks(intelligence: ConversationIntelligence): Array<{
    risk: string
    mitigation: string
  }> {
    const risks: Array<{ risk: string; mitigation: string }> = []
    
    if (intelligence.contentReadiness === 'needs_creation') {
      risks.push({
        risk: 'Content delays may extend timeline',
        mitigation: 'Early content submission deadline with progress check-ins'
      })
    }
    
    if (intelligence.integrations && intelligence.integrations.length > 0) {
      risks.push({
        risk: 'Third-party integration dependencies',
        mitigation: 'Early integration testing and fallback plans'
      })
    }
    
    if (!intelligence.desiredLaunchDate) {
      risks.push({
        risk: 'No fixed launch deadline',
        mitigation: 'Establish milestone dates to maintain momentum'
      })
    }
    
    return risks
  }
  
  /**
   * Section 13: Investment Summary
   */
  private generateInvestmentSummary(intelligence: ConversationIntelligence): InvestmentSummary {
    const packageName = intelligence.recommendedPackage || 'professional'
    const packagePrice = this.getPackagePrice(packageName)
    
    // Calculate add-on features
    const selectedFeatures = intelligence.selectedFeatures || []
    const addOnFeatures = selectedFeatures.map(featureId => {
      const feature = featureLibrary.getFeature(featureId)
      return {
        name: feature?.name || featureId,
        price: feature?.pricing.basePrice || 0
      }
    })
    
    // Calculate bundles
    const bundles = pricingCalculator.calculateBundles(selectedFeatures)
    const bundleDiscounts = bundles.map(bundle => ({
      name: bundle.name,
      discount: bundle.savings
    }))
    
    // Calculate totals
    const featuresSubtotal = addOnFeatures.reduce((sum, f) => sum + f.price, 0)
    const totalDiscounts = bundleDiscounts.reduce((sum, d) => sum + d.discount, 0)
    const subtotal = packagePrice + featuresSubtotal - totalDiscounts
    
    // Hosting
    const hostingTier = this.determineHostingTier(intelligence)
    const monthlyHosting = this.getHostingPrice(hostingTier)
    const annualHosting = monthlyHosting * 12
    
    // Total investments
    const totalProjectInvestment = subtotal
    const totalFirstYearInvestment = subtotal + annualHosting
    
    // ROI calculation
    const roi = this.calculateROI(intelligence, totalFirstYearInvestment)
    
    return {
      basePackage: {
        name: packageName.charAt(0).toUpperCase() + packageName.slice(1),
        price: packagePrice
      },
      addOnFeatures,
      bundleDiscounts,
      subtotal,
      hosting: {
        tier: hostingTier.charAt(0).toUpperCase() + hostingTier.slice(1),
        monthlyPrice: monthlyHosting,
        annualPrice: annualHosting
      },
      totalProjectInvestment,
      totalFirstYearInvestment,
      roi,
      paymentSchedule: this.generatePaymentSchedule(totalProjectInvestment)
    }
  }
  
  private calculateROI(
    intelligence: ConversationIntelligence,
    investment: number
  ): InvestmentSummary['roi'] {
    // Can only calculate ROI if we have metrics
    if (!intelligence.successMetrics || intelligence.successMetrics.length === 0) {
      return {
        calculable: false
      }
    }
    
    // Attempt to calculate based on goals
    const metrics: any = {}
    let totalValue = 0
    
    if (intelligence.primaryGoal?.includes('lead') || intelligence.primaryGoal?.includes('inquiry')) {
      // Lead generation ROI
      const leadsPerMonth = intelligence.expectedLeadsPerMonth || 20
      const avgLeadValue = intelligence.avgLeadValue || 500
      const conversionRate = intelligence.leadConversionRate || 0.2
      
      const monthlyValue = leadsPerMonth * avgLeadValue * conversionRate
      const annualValue = monthlyValue * 12
      
      metrics.revenueIncrease = annualValue
      totalValue = annualValue
    }
    
    if (intelligence.primaryGoal?.includes('sales') || intelligence.primaryGoal?.includes('revenue')) {
      // E-commerce ROI
      const monthlyRevenue = intelligence.expectedMonthlyRevenue || 10000
      const annualRevenue = monthlyRevenue * 12
      
      metrics.revenueIncrease = annualRevenue
      totalValue = annualRevenue
    }
    
    if (totalValue > 0) {
      const roi = ((totalValue - investment) / investment * 100).toFixed(0)
      const paybackMonths = Math.ceil(investment / (totalValue / 12))
      
      return {
        calculable: true,
        metrics,
        estimatedROI: `${roi}%`,
        paybackPeriod: `${paybackMonths} months`
      }
    }
    
    return {
      calculable: false
    }
  }
  
  private generatePaymentSchedule(totalInvestment: number): InvestmentSummary['paymentSchedule'] {
    return [
      {
        milestone: 'Contract Signing',
        percentage: 50,
        amount: totalInvestment * 0.5
      },
      {
        milestone: 'Design Approval',
        percentage: 25,
        amount: totalInvestment * 0.25
      },
      {
        milestone: 'Launch',
        percentage: 25,
        amount: totalInvestment * 0.25
      }
    ]
  }
  
  /**
   * Section 14: Validation Outcomes
   */
  private generateValidationOutcomes(intelligence: ConversationIntelligence): ValidationOutcomes {
    return {
      understandingValidations: intelligence.validationOutcomes?.understandingValidations || [],
      conflictsResolved: intelligence.validationOutcomes?.conflictsResolved || [],
      assumptionsClarified: intelligence.validationOutcomes?.assumptionsClarified || [],
      keyDecisions: this.extractKeyDecisions(intelligence)
    }
  }
  
  private extractKeyDecisions(intelligence: ConversationIntelligence): Array<{
    decision: string
    rationale: string
    timestamp: string
  }> {
    const decisions: Array<{ decision: string; rationale: string; timestamp: string }> = []
    
    // Extract major decisions from conversation
    if (intelligence.recommendedPackage) {
      decisions.push({
        decision: `Selected ${intelligence.recommendedPackage} package`,
        rationale: `Based on project complexity and feature requirements`,
        timestamp: new Date().toISOString()
      })
    }
    
    if (intelligence.selectedFeatures && intelligence.selectedFeatures.length > 0) {
      decisions.push({
        decision: `Selected ${intelligence.selectedFeatures.length} custom features`,
        rationale: `Features chosen to meet business goals and user needs`,
        timestamp: new Date().toISOString()
      })
    }
    
    return decisions
  }
  
  /**
   * Validation: Ensure intelligence is complete enough to generate SCOPE.md
   */
  private validateIntelligenceCompleteness(intelligence: ConversationIntelligence): void {
    const required = [
      { field: 'fullName', label: 'Full name' },
      { field: 'email', label: 'Email' },
      { field: 'websiteType', label: 'Website type' },
      { field: 'companyName', label: 'Company/project name' }
    ]
    
    const missing = required.filter(r => !intelligence[r.field as keyof ConversationIntelligence])
    
    if (missing.length > 0) {
      throw new Error(`Cannot generate SCOPE.md: Missing required fields: ${missing.map(m => m.label).join(', ')}`)
    }
  }
  
  /**
   * Utility: Format website type for display
   */
  private formatWebsiteType(type: string): string {
    const typeMap: Record<string, string> = {
      'ecommerce': 'E-commerce',
      'portfolio': 'Portfolio',
      'blog': 'Blog',
      'service': 'Service-based',
      'corporate': 'Corporate',
      'landing': 'Landing Page',
      'saas': 'SaaS Platform',
      'marketplace': 'Marketplace'
    }
    return typeMap[type] || type
  }
}

export const scopeGenerator = new ScopeGenerator()
```

---

## Part 3: Markdown Generator (Human-Readable SCOPE.md)

**File:** `lib/scope/markdownGenerator.ts`

```typescript
import type { ScopeDocument } from '@/types/scope'

export class MarkdownGenerator {
  /**
   * Generate complete SCOPE.md markdown document
   */
  generateMarkdown(scope: ScopeDocument): string {
    const sections = [
      this.generateHeader(scope),
      this.generateSection1(scope.section1_executiveSummary),
      this.generateSection2(scope.section2_projectClassification),
      this.generateSection3(scope.section3_clientInformation),
      this.generateSection4(scope.section4_businessContext),
      this.generateSection5(scope.section5_brandAssets),
      this.generateSection6(scope.section6_contentStrategy),
      this.generateSection7(scope.section7_technicalSpecifications),
      this.generateSection8(scope.section8_mediaElements),
      this.generateSection9(scope.section9_designDirection),
      this.generateSection10(scope.section10_featuresBreakdown),
      this.generateSection11(scope.section11_supportPlan),
      this.generateSection12(scope.section12_timeline),
      this.generateSection13(scope.section13_investmentSummary),
      this.generateSection14(scope.section14_validationOutcomes),
      this.generateFooter(scope)
    ]
    
    return sections.join('\n\n---\n\n')
  }
  
  private generateHeader(scope: ScopeDocument): string {
    return `# PROJECT SCOPE DOCUMENT

**Generated:** ${new Date(scope.generatedAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}  
**Version:** ${scope.version}  
**Conversation ID:** ${scope.conversationId}

---

> **FOR DEVELOPER USE**  
> This document contains complete technical specifications for building this project.  
> All requirements have been gathered and validated with the client.  
> No additional clarification should be needed to begin development.`
  }
  
  private generateSection1(section: any): string {
    return `## Section 1: Executive Summary

**Project Name:** ${section.projectName}  
**Website Type:** ${section.websiteType}  
**Primary Goal:** ${section.primaryGoal}  
**Target Audience:** ${section.targetAudience}

### Overview

${section.summaryText}

**Key Differentiator:** ${section.keyDifferentiator}`
  }
  
  private generateSection2(section: any): string {
    return `## Section 2: Project Classification

**Website Type:** ${section.websiteType}  
**Industry:** ${section.industry}  
${section.businessModel ? `**Business Model:** ${section.businessModel}` : ''}  
**Project Complexity:** ${section.projectComplexity.toUpperCase()}  
**Recommended Package:** ${section.recommendedPackage.toUpperCase()} ($${section.packagePrice.toLocaleString()})

### Complexity Rationale

${section.complexityRationale}`
  }
  
  private generateSection3(section: any): string {
    return `## Section 3: Client Information

**Name:** ${section.fullName}  
**Email:** ${section.email}  
**Phone:** ${section.phone}  
**Company:** ${section.companyName}  
${section.decisionMakerRole ? `**Role:** ${section.decisionMakerRole}` : ''}
${section.preferredContactMethod ? `**Preferred Contact:** ${section.preferredContactMethod}` : ''}`
  }
  
  private generateSection4(section: any): string {
    return `## Section 4: Business Context

### Company Overview

${section.companyOverview}

### Target Audience

**Description:** ${section.targetAudience.description}  
**Technical Level:** ${section.targetAudience.technicalLevel}  
**Primary Needs:**
${section.targetAudience.primaryNeeds.map((need: string) => `- ${need}`).join('\n') || '- To be determined'}

### Primary Goal

${section.primaryGoal}

### Success Metrics

${section.successMetrics.map((metric: any) => `
**${metric.metric}**  
${metric.target ? `Target: ${metric.target}  ` : ''}
Measurement: ${metric.measurement}
`).join('\n')}

### Value Proposition

${section.valueProposition}

### Pain Points

${section.painPoints.map((pain: string) => `- ${pain}`).join('\n') || '- To be identified during discovery'}`
  }
  
  private generateSection5(section: any): string {
    return `## Section 5: Brand Assets & Identity

### Existing Assets

- **Logo:** ${section.existingAssets.logo ? 'Yes ✓' : 'No ✗'}
- **Color Palette:** ${section.existingAssets.colorPalette ? 'Yes ✓' : 'No ✗'}
- **Fonts:** ${section.existingAssets.fonts ? 'Yes ✓' : 'No ✗'}
- **Style Guide:** ${section.existingAssets.styleGuide ? 'Yes ✓' : 'No ✗'}
- **Imagery:** ${section.existingAssets.imagery ? 'Yes ✓' : 'No ✗'}

### Brand Style

${section.brandStyle}

### Assets Needing Creation

${section.whatNeedsCreation.map((item: string) => `- ${item}`).join('\n') || '- All assets provided'}

${section.inspirationReferences && section.inspirationReferences.length > 0 ? `
### Inspiration References

${section.inspirationReferences.map((ref: any) => `
**${ref.url}**  
${ref.notes}
`).join('\n')}
` : ''}`
  }
  
  private generateSection6(section: any): string {
    return `## Section 6: Content Strategy

**Content Provider:** ${section.contentProvider.toUpperCase()}  
**Content Readiness:** ${section.contentReadiness.toUpperCase()}  
**Update Frequency:** ${section.updateFrequency.toUpperCase()}

### Maintenance Plan

${section.maintenancePlan}

### Content Types

${section.contentTypes.map((type: string) => `- ${type}`).join('\n')}

### Additional Services

- **Copywriting Needed:** ${section.copywritingNeeded ? 'Yes' : 'No'}
- **Photography Needed:** ${section.photographyNeeded ? 'Yes' : 'No'}`
  }
  
  private generateSection7(section: any): string {
    let content = `## Section 7: Technical Specifications

### Authentication

${section.authentication.required ? `
**Required:** Yes  
**Method:** ${section.authentication.method?.replace('_', ' ').toUpperCase()}  
${section.authentication.providers ? `**Providers:** ${section.authentication.providers.join(', ')}` : ''}
${section.authentication.userRoles ? `**User Roles:** ${section.authentication.userRoles.join(', ')}` : ''}
` : '**Required:** No'}

### Content Management

${section.contentManagement.required ? `
**Required:** Yes  
**Type:** ${section.contentManagement.type?.toUpperCase()}  
**Update Frequency:** ${section.contentManagement.updateFrequency}  
${section.contentManagement.editors ? `**Number of Editors:** ${section.contentManagement.editors}` : ''}
` : '**Required:** No'}

### Search Functionality

${section.search.required ? `
**Required:** Yes  
${section.search.scope ? `**Scope:** ${section.search.scope.join(', ')}` : ''}
${section.search.filters ? `**Filters:** ${section.search.filters.join(', ')}` : ''}
` : '**Required:** No'}`
    
    // Add website-type-specific features
    if (Object.keys(section.websiteTypeFeatures).length > 0) {
      content += `\n\n### Website-Type-Specific Features\n\n`
      content += JSON.stringify(section.websiteTypeFeatures, null, 2)
        .split('\n')
        .map(line => line.replace(/[{}"]/g, ''))
        .filter(line => line.trim())
        .join('\n')
    }
    
    // Add integrations
    if (section.integrations.length > 0) {
      content += `\n\n### Integrations\n\n`
      content += section.integrations.map((int: any) => `
**${int.service}**  
Purpose: ${int.purpose}  
${int.provider ? `Provider: ${int.provider}` : ''}
`).join('\n')
    }
    
    // Add compliance
    if (section.compliance.required.length > 0) {
      content += `\n\n### Compliance Requirements\n\n`
      content += section.compliance.required.map((req: string) => `- ${req}`).join('\n')
      if (section.compliance.level) {
        content += `\n**Level:** ${section.compliance.level}`
      }
    }
    
    // Add security
    content += `\n\n### Security\n\n`
    content += `- **SSL Required:** Yes (included)\n`
    if (section.security.additionalRequirements && section.security.additionalRequirements.length > 0) {
      content += section.security.additionalRequirements.map((req: string) => `- ${req}`).join('\n')
    }
    
    // Add performance
    content += `\n\n### Performance Requirements\n\n`
    content += `**Expected Traffic:** ${section.performance.expectedTraffic}\n\n`
    content += `**Critical Metrics:**\n`
    content += section.performance.criticalMetrics.map((metric: string) => `- ${metric}`).join('\n')
    if (section.performance.cachingStrategy) {
      content += `\n\n**Caching Strategy:** ${section.performance.cachingStrategy}`
    }
    
    return content
  }
  
  private generateSection8(section: any): string {
    let content = `## Section 8: Media & Interactive Elements\n\n`
    
    if (section.video?.required) {
      content += `### Video\n\n`
      content += `**Hosting:** ${section.video.hosting}\n`
      content += `**Autoplay:** ${section.video.autoplay ? 'Yes' : 'No'}\n`
      content += `**Background Video:** ${section.video.backgroundVideo ? 'Yes' : 'No'}\n\n`
    }
    
    if (section.galleries?.required) {
      content += `### Image Galleries\n\n`
      content += `**Types:** ${section.galleries.type?.join(', ')}\n`
      content += `**Estimated Images:** ${section.galleries.imageCount || 'TBD'}\n\n`
    }
    
    if (section.animations?.required) {
      content += `### Animations\n\n`
      content += `**Types:** ${section.animations.type?.join(', ')}\n`
      content += `**Complexity:** ${section.animations.complexity}\n\n`
    }
    
    if (section.interactiveElements && section.interactiveElements.length > 0) {
      content += `### Interactive Elements\n\n`
      content += section.interactiveElements.map((elem: any) => `
**${elem.type}**  
${elem.description}  
Complexity: ${elem.complexity}
`).join('\n')
    }
    
    if (section.audio?.required) {
      content += `\n### Audio\n\n`
      content += `**Type:** ${section.audio.type}\n`
    }
    
    if (section.maps?.required) {
      content += `\n### Maps\n\n`
      content += `**Provider:** ${section.maps.provider}\n`
      content += `**Features:** ${section.maps.features?.join(', ')}\n`
    }
    
    if (content === `## Section 8: Media & Interactive Elements\n\n`) {
      content += `No special media or interactive elements required.\n`
    }
    
    return content
  }
  
  private generateSection9(section: any): string {
    return `## Section 9: Design Direction

### Overall Style

${section.overallStyle}

### Color Scheme

${section.colorScheme.primary ? `**Primary:** ${section.colorScheme.primary}` : ''}
${section.colorScheme.secondary ? `**Secondary:** ${section.colorScheme.secondary}` : ''}
**Direction:** ${section.colorScheme.direction}

### Typography

${section.typography.style ? `**Style:** ${section.typography.style}` : ''}
**Readability:** ${section.typography.readability}

### Layout

${section.layout.preference ? `**Preference:** ${section.layout.preference}` : ''}
**Whitespace:** ${section.layout.whitespace}
${section.layout.gridStyle ? `**Grid Style:** ${section.layout.gridStyle}` : ''}

${section.references && section.references.length > 0 ? `
### Design References

${section.references.map((ref: any) => `
**${ref.url}**  
Notable elements: ${ref.elements.join(', ')}
${ref.notes ? `Notes: ${ref.notes}` : ''}
`).join('\n')}
` : ''}

### Design Priorities

${section.designPriorities.map((priority: string) => `- ${priority}`).join('\n')}`
  }
  
  private generateSection10(section: any): string {
    let content = `## Section 10: Features & Functionality Breakdown

### Base Package

**${section.basePackage.name} Package** - $${section.basePackage.price.toLocaleString()}

Included features:
${section.basePackage.includedFeatures.map((feature: string) => `- ${feature}`).join('\n')}

### Add-On Features

${section.addOnFeatures.map((feature: any) => `
**${feature.name}** - $${feature.price.toLocaleString()}  
${feature.description}  
*Rationale:* ${feature.rationale}
`).join('\n')}

`
    
    if (section.featureBundles.length > 0) {
      content += `### Feature Bundles (Discounts Applied)\n\n`
      content += section.featureBundles.map((bundle: any) => `
**${bundle.name}**  
Features: ${bundle.features.join(', ')}  
Original: $${bundle.originalPrice.toLocaleString()}  
Discounted: $${bundle.discountedPrice.toLocaleString()}  
**Savings: $${bundle.savings.toLocaleString()}**
`).join('\n')
    }
    
    if (section.conflicts.length > 0) {
      content += `\n### Conflicts Resolved\n\n`
      content += section.conflicts.map((conflict: any) => `
- **${conflict.featureA}** vs **${conflict.featureB}**  
  Resolution: ${conflict.resolution}
`).join('\n')
    }
    
    if (section.dependencies.length > 0) {
      content += `\n### Feature Dependencies\n\n`
      content += section.dependencies.map((dep: any) => `
**${dep.feature}**  
Requires: ${dep.requires.join(', ')}  
Reason: ${dep.reason}
`).join('\n')
    }
    
    return content
  }
  
  private generateSection11(section: any): string {
    return `## Section 11: Post-Launch Support Plan

**Support Duration:** ${section.supportDuration}

### Training

${section.training.required ? `
**Required:** Yes  
**Topics:** ${section.training.topics?.join(', ')}  
**Format:** ${section.training.format}  
**Duration:** ${section.training.duration}
` : '**Required:** No'}

### Maintenance Plan

**Provider:** ${section.maintenancePlan.provider.toUpperCase()}  
**Frequency:** ${section.maintenancePlan.frequency}

Includes:
${section.maintenancePlan.includes.map((item: string) => `- ${item}`).join('\n')}

${section.futurePhases && section.futurePhases.length > 0 ? `
### Future Enhancement Phases

${section.futurePhases.map((phase: any) => `
**${phase.name}**  
${phase.description}  
Estimated Timing: ${phase.estimatedTiming}
`).join('\n')}
` : ''}

### Hosting

**Tier:** ${section.hosting.tier}  
**Monthly Price:** $${section.hosting.monthlyPrice}/month

Includes:
${section.hosting.includes.map((item: string) => `- ${item}`).join('\n')}`
  }
  
  private generateSection12(section: any): string {
    return `## Section 12: Project Timeline

${section.desiredLaunchDate ? `**Desired Launch Date:** ${section.desiredLaunchDate}` : ''}  
**Estimated Duration:** ${section.estimatedDuration}

### Milestones

${section.milestones.map((milestone: any) => `
**${milestone.name}** (${milestone.duration})  
${milestone.description}
${milestone.dependencies ? `Dependencies: ${milestone.dependencies.join(', ')}` : ''}
${milestone.clientResponsibility ? `*Client Responsibility:* ${milestone.clientResponsibility}` : ''}
`).join('\n')}

### Critical Path

${section.criticalPath.map((item: string) => `1. ${item}`).join('\n')}

${section.risks.length > 0 ? `
### Risks & Mitigation

${section.risks.map((risk: any) => `
**Risk:** ${risk.risk}  
**Mitigation:** ${risk.mitigation}
`).join('\n')}
` : ''}`
  }
  
  private generateSection13(section: any): string {
    let content = `## Section 13: Investment Summary

### Project Investment

**Base Package:** ${section.basePackage.name} - $${section.basePackage.price.toLocaleString()}

${section.addOnFeatures.length > 0 ? `
**Add-On Features:**
${section.addOnFeatures.map((feature: any) => `- ${feature.name}: $${feature.price.toLocaleString()}`).join('\n')}
` : ''}

${section.bundleDiscounts.length > 0 ? `
**Bundle Discounts:**
${section.bundleDiscounts.map((discount: any) => `- ${discount.name}: -$${discount.discount.toLocaleString()}`).join('\n')}
` : ''}

**Subtotal:** $${section.subtotal.toLocaleString()}

### Hosting (Recurring)

**${section.hosting.tier} Hosting**  
- Monthly: $${section.hosting.monthlyPrice}/month
- Annual: $${section.hosting.annualPrice}/year

### Total Investment

**One-Time Project Cost:** $${section.totalProjectInvestment.toLocaleString()}  
**First Year Total (incl. hosting):** $${section.totalFirstYearInvestment.toLocaleString()}

`
    
    if (section.roi?.calculable) {
      content += `### Return on Investment\n\n`
      if (section.roi.metrics) {
        Object.entries(section.roi.metrics).forEach(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').trim()
          content += `**${label}:** $${(value as number).toLocaleString()}\n`
        })
      }
      content += `\n**Estimated ROI:** ${section.roi.estimatedROI}\n`
      content += `**Payback Period:** ${section.roi.paybackPeriod}\n\n`
    }
    
    content += `### Payment Schedule\n\n`
    content += section.paymentSchedule.map((payment: any) => `
**${payment.milestone}** (${payment.percentage}%)  
Amount: $${payment.amount.toLocaleString()}
`).join('\n')
    
    return content
  }
  
  private generateSection14(section: any): string {
    let content = `## Section 14: Validation Outcomes\n\n`
    
    if (section.understandingValidations.length > 0) {
      content += `### Understanding Validations\n\n`
      content += section.understandingValidations.map((val: any) => `
**${val.category}**  
${val.confirmed ? '✓ Confirmed' : '✗ Corrected'}  
${val.corrections ? `Corrections: ${JSON.stringify(val.corrections)}` : ''}
Final: ${val.finalSummary}
`).join('\n')
    }
    
    if (section.conflictsResolved.length > 0) {
      content += `\n### Conflicts Resolved\n\n`
      content += section.conflictsResolved.map((conflict: any) => `
**Conflict:** ${conflict.description}  
**Resolution:** ${conflict.resolution}  
*Resolved: ${new Date(conflict.timestamp).toLocaleDateString()}*
`).join('\n')
    }
    
    if (section.assumptionsClarified.length > 0) {
      content += `\n### Assumptions Clarified\n\n`
      content += section.assumptionsClarified.map((assumption: any) => `
**Assumption:** ${assumption.assumption}  
${assumption.confirmed ? '✓ Confirmed' : `✗ Clarified: ${assumption.clarification}`}
`).join('\n')
    }
    
    if (section.keyDecisions.length > 0) {
      content += `\n### Key Decisions\n\n`
      content += section.keyDecisions.map((decision: any) => `
**${decision.decision}**  
Rationale: ${decision.rationale}
`).join('\n')
    }
    
    if (content === `## Section 14: Validation Outcomes\n\n`) {
      content += `No validations or conflicts during conversation.\n`
    }
    
    return content
  }
  
  private generateFooter(scope: ScopeDocument): string {
    return `---

## Document Information

**Generated:** ${new Date(scope.generatedAt).toISOString()}  
**Version:** ${scope.version}  
**Conversation ID:** ${scope.conversationId}

---

*This document was automatically generated by Introspect V3, Applicreations' AI-powered client intake system. All information has been validated with the client through interactive conversation.*`
  }
}

export const markdownGenerator = new MarkdownGenerator()
```

---

## Part 4: Client Summary Generator (PDF-Friendly)

**File:** `lib/scope/clientSummaryGenerator.ts`

```typescript
import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeDocument, ClientSummary } from '@/types/scope'

export class ClientSummaryGenerator {
  /**
   * Generate client-friendly summary from SCOPE.md
   */
  generateClientSummary(
    scope: ScopeDocument,
    intelligence: ConversationIntelligence
  ): ClientSummary {
    return {
      projectName: scope.section1_executiveSummary.projectName,
      clientName: scope.section3_clientInformation.fullName,
      summaryDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      
      overview: {
        websiteType: scope.section1_executiveSummary.websiteType,
        primaryGoal: scope.section1_executiveSummary.primaryGoal,
        targetAudience: scope.section1_executiveSummary.targetAudience
      },
      
      keyFeatures: this.extractKeyFeatures(scope),
      
      investmentSummary: {
        totalInvestment: scope.section13_investmentSummary.totalProjectInvestment,
        monthlyHosting: scope.section13_investmentSummary.hosting.monthlyPrice,
        estimatedTimeline: scope.section12_timeline.estimatedDuration
      },
      
      nextSteps: this.generateNextSteps(scope, intelligence)
    }
  }
  
  private extractKeyFeatures(scope: ScopeDocument): string[] {
    const features: string[] = []
    
    // Add base package features (top 3)
    features.push(...scope.section10_featuresBreakdown.basePackage.includedFeatures.slice(0, 3))
    
    // Add add-on features (top 3)
    const addOns = scope.section10_featuresBreakdown.addOnFeatures
      .slice(0, 3)
      .map(f => f.name)
    features.push(...addOns)
    
    return features
  }
  
  private generateNextSteps(scope: ScopeDocument, intelligence: ConversationIntelligence): string[] {
    return [
      'Review this summary and the detailed SCOPE document',
      'Sign the project contract',
      'Submit initial deposit (50%)',
      `Begin content preparation: ${scope.section6_contentStrategy.contentProvider === 'client' ? 'gather all content, images, and copy' : 'coordinate with Applicreations on content needs'}`,
      'Schedule kickoff meeting to finalize project timeline'
    ]
  }
  
  /**
   * Generate HTML for PDF conversion
   */
  generateHTML(summary: ClientSummary): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${summary.projectName} - Project Summary</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
      padding: 60px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      padding-bottom: 40px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 40px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 8px;
    }
    
    .tagline {
      font-size: 14px;
      color: #6b7280;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 40px 0 16px 0;
    }
    
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 40px;
    }
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 32px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .overview {
      background: #f9fafb;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    
    .overview-item {
      margin-bottom: 16px;
    }
    
    .overview-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .overview-value {
      font-size: 16px;
      color: #111827;
    }
    
    .features-list {
      list-style: none;
      padding-left: 0;
    }
    
    .features-list li {
      padding: 12px 0 12px 32px;
      position: relative;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
      font-size: 18px;
    }
    
    .investment-summary {
      background: #eff6ff;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    
    .investment-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #dbeafe;
    }
    
    .investment-row:last-child {
      border-bottom: none;
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px solid #2563eb;
    }
    
    .investment-label {
      font-size: 16px;
      color: #1f2937;
    }
    
    .investment-value {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .investment-row:last-child .investment-value {
      color: #2563eb;
      font-size: 24px;
    }
    
    .next-steps {
      counter-reset: step;
      list-style: none;
      padding-left: 0;
    }
    
    .next-steps li {
      counter-increment: step;
      padding: 16px 0 16px 48px;
      position: relative;
      border-left: 2px solid #e5e7eb;
      margin-left: 20px;
    }
    
    .next-steps li:before {
      content: counter(step);
      position: absolute;
      left: -22px;
      top: 16px;
      width: 40px;
      height: 40px;
      background: #2563eb;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    
    @media print {
      body {
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">APPLICREATIONS</div>
    <div class="tagline">Professional Web Development</div>
  </div>
  
  <h1>${summary.projectName}</h1>
  <div class="subtitle">Project Summary | ${summary.summaryDate}</div>
  
  <div class="overview">
    <div class="overview-item">
      <div class="overview-label">Project Type</div>
      <div class="overview-value">${summary.overview.websiteType}</div>
    </div>
    
    <div class="overview-item">
      <div class="overview-label">Primary Goal</div>
      <div class="overview-value">${summary.overview.primaryGoal}</div>
    </div>
    
    <div class="overview-item">
      <div class="overview-label">Target Audience</div>
      <div class="overview-value">${summary.overview.targetAudience}</div>
    </div>
  </div>
  
  <h2>Key Features</h2>
  <ul class="features-list">
    ${summary.keyFeatures.map(feature => `<li>${feature}</li>`).join('\n    ')}
  </ul>
  
  <h2>Investment Summary</h2>
  <div class="investment-summary">
    <div class="investment-row">
      <span class="investment-label">Project Development</span>
      <span class="investment-value">$${summary.investmentSummary.totalInvestment.toLocaleString()}</span>
    </div>
    
    <div class="investment-row">
      <span class="investment-label">Monthly Hosting</span>
      <span class="investment-value">$${summary.investmentSummary.monthlyHosting}/month</span>
    </div>
    
    <div class="investment-row">
      <span class="investment-label">Estimated Timeline</span>
      <span class="investment-value">${summary.investmentSummary.estimatedTimeline}</span>
    </div>
  </div>
  
  <h2>Next Steps</h2>
  <ol class="next-steps">
    ${summary.nextSteps.map(step => `<li>${step}</li>`).join('\n    ')}
  </ol>
  
  <div class="footer">
    <p>For questions or to proceed, contact David at Applicreations</p>
    <p>Email: david@applicreations.com | Phone: (555) 123-4567</p>
  </div>
</body>
</html>
    `.trim()
  }
}

export const clientSummaryGenerator = new ClientSummaryGenerator()
```

---

## Part 5: Document Validation System

**File:** `lib/scope/documentValidator.ts`

```typescript
import type { ScopeDocument } from '@/types/scope'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  completeness: number // 0-100%
}

export interface ValidationError {
  section: string
  field: string
  message: string
  severity: 'error' | 'critical'
}

export interface ValidationWarning {
  section: string
  field: string
  message: string
  recommendation?: string
}

export class DocumentValidator {
  /**
   * Validate complete SCOPE.md document
   */
  validate(scope: ScopeDocument): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    // Validate all 14 sections
    this.validateSection1(scope.section1_executiveSummary, errors, warnings)
    this.validateSection2(scope.section2_projectClassification, errors, warnings)
    this.validateSection3(scope.section3_clientInformation, errors, warnings)
    this.validateSection4(scope.section4_businessContext, errors, warnings)
    this.validateSection5(scope.section5_brandAssets, errors, warnings)
    this.validateSection6(scope.section6_contentStrategy, errors, warnings)
    this.validateSection7(scope.section7_technicalSpecifications, errors, warnings)
    this.validateSection8(scope.section8_mediaElements, errors, warnings)
    this.validateSection9(scope.section9_designDirection, errors, warnings)
    this.validateSection10(scope.section10_featuresBreakdown, errors, warnings)
    this.validateSection11(scope.section11_supportPlan, errors, warnings)
    this.validateSection12(scope.section12_timeline, errors, warnings)
    this.validateSection13(scope.section13_investmentSummary, errors, warnings)
    this.validateSection14(scope.section14_validationOutcomes, errors, warnings)
    
    // Calculate completeness
    const totalFields = this.countRequiredFields()
    const completedFields = totalFields - errors.filter(e => e.severity === 'critical').length
    const completeness = Math.round((completedFields / totalFields) * 100)
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness
    }
  }
  
  private validateSection1(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.projectName || section.projectName.length < 2) {
      errors.push({
        section: 'Section 1',
        field: 'projectName',
        message: 'Project name is required',
        severity: 'critical'
      })
    }
    
    if (!section.summaryText || section.summaryText.length < 50) {
      errors.push({
        section: 'Section 1',
        field: 'summaryText',
        message: 'Executive summary must be at least 2-3 sentences',
        severity: 'error'
      })
    }
    
    if (section.summaryText && section.summaryText.length > 500) {
      warnings.push({
        section: 'Section 1',
        field: 'summaryText',
        message: 'Executive summary is quite long',
        recommendation: 'Consider condensing to 2-3 concise sentences'
      })
    }
  }
  
  private validateSection2(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.websiteType) {
      errors.push({
        section: 'Section 2',
        field: 'websiteType',
        message: 'Website type is required',
        severity: 'critical'
      })
    }
    
    if (!section.recommendedPackage) {
      errors.push({
        section: 'Section 2',
        field: 'recommendedPackage',
        message: 'Package recommendation is required',
        severity: 'critical'
      })
    }
    
    if (!section.complexityRationale) {
      warnings.push({
        section: 'Section 2',
        field: 'complexityRationale',
        message: 'No complexity rationale provided',
        recommendation: 'Add explanation for complexity classification'
      })
    }
  }
  
  private validateSection3(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.fullName) {
      errors.push({
        section: 'Section 3',
        field: 'fullName',
        message: 'Client name is required',
        severity: 'critical'
      })
    }
    
    if (!section.email || !this.isValidEmail(section.email)) {
      errors.push({
        section: 'Section 3',
        field: 'email',
        message: 'Valid email address is required',
        severity: 'critical'
      })
    }
    
    if (!section.phone) {
      warnings.push({
        section: 'Section 3',
        field: 'phone',
        message: 'No phone number provided',
        recommendation: 'Phone contact recommended for urgent communication'
      })
    }
  }
  
  private validateSection4(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.companyOverview || section.companyOverview.length < 20) {
      errors.push({
        section: 'Section 4',
        field: 'companyOverview',
        message: 'Company overview is too brief',
        severity: 'error'
      })
    }
    
    if (!section.primaryGoal) {
      errors.push({
        section: 'Section 4',
        field: 'primaryGoal',
        message: 'Primary goal is required',
        severity: 'error'
      })
    }
    
    if (!section.successMetrics || section.successMetrics.length === 0) {
      warnings.push({
        section: 'Section 4',
        field: 'successMetrics',
        message: 'No success metrics defined',
        recommendation: 'Define measurable success criteria'
      })
    }
  }
  
  private validateSection7(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Validate authentication consistency
    if (section.authentication?.required && !section.authentication.method) {
      errors.push({
        section: 'Section 7',
        field: 'authentication.method',
        message: 'Authentication method required when auth is needed',
        severity: 'error'
      })
    }
    
    // Validate CMS consistency
    if (section.contentManagement?.required && !section.contentManagement.type) {
      errors.push({
        section: 'Section 7',
        field: 'contentManagement.type',
        message: 'CMS type required when CMS is needed',
        severity: 'error'
      })
    }
  }
  
  private validateSection10(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.basePackage || !section.basePackage.price) {
      errors.push({
        section: 'Section 10',
        field: 'basePackage',
        message: 'Base package and price required',
        severity: 'critical'
      })
    }
    
    // Validate pricing consistency
    const calculatedSubtotal = section.basePackage.price + 
      section.addOnFeatures.reduce((sum: number, f: any) => sum + f.price, 0) -
      section.bundleDiscounts.reduce((sum: number, d: any) => sum + d.discount, 0)
    
    if (Math.abs(calculatedSubtotal - section.subtotal) > 1) {
      errors.push({
        section: 'Section 10',
        field: 'subtotal',
        message: 'Pricing calculation mismatch',
        severity: 'error'
      })
    }
  }
  
  private validateSection13(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.totalProjectInvestment || section.totalProjectInvestment === 0) {
      errors.push({
        section: 'Section 13',
        field: 'totalProjectInvestment',
        message: 'Total investment required',
        severity: 'critical'
      })
    }
    
    if (!section.paymentSchedule || section.paymentSchedule.length === 0) {
      errors.push({
        section: 'Section 13',
        field: 'paymentSchedule',
        message: 'Payment schedule required',
        severity: 'error'
      })
    }
    
    // Validate payment schedule adds to 100%
    const totalPercentage = section.paymentSchedule.reduce(
      (sum: number, payment: any) => sum + payment.percentage, 
      0
    )
    
    if (Math.abs(totalPercentage - 100) > 0.1) {
      errors.push({
        section: 'Section 13',
        field: 'paymentSchedule',
        message: `Payment schedule must total 100% (currently ${totalPercentage}%)`,
        severity: 'error'
      })
    }
  }
  
  private countRequiredFields(): number {
    // Count all critical fields across all sections
    return 45 // Approximate count of critical fields
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

export const documentValidator = new DocumentValidator()
```

---

## Part 6: Store Integration

**File:** `lib/stores/conversationStore.ts` (additions for Phase 9)

```typescript
import { scopeGenerator } from '@/lib/scope/scopeGenerator'
import { markdownGenerator } from '@/lib/scope/markdownGenerator'
import { clientSummaryGenerator } from '@/lib/scope/clientSummaryGenerator'
import { documentValidator } from '@/lib/scope/documentValidator'
import type { ScopeDocument, ClientSummary } from '@/types/scope'

interface ConversationStore {
  // ... existing state
  
  // SCOPE.md state
  generatedScope: ScopeDocument | null
  clientSummary: ClientSummary | null
  scopeValidation: ValidationResult | null
  isGeneratingScope: boolean
  scopeGenerationError: string | null
  
  // ... existing actions
  
  // SCOPE.md generation actions
  generateScopeDocument: () => Promise<void>
  downloadScopeMarkdown: () => void
  downloadClientPDF: () => Promise<void>
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // ... existing state
  
  generatedScope: null,
  clientSummary: null,
  scopeValidation: null,
  isGeneratingScope: false,
  scopeGenerationError: null,
  
  // ... existing actions
  
  /**
   * Generate complete SCOPE.md document
   */
  generateScopeDocument: async () => {
    set({ 
      isGeneratingScope: true, 
      scopeGenerationError: null 
    })
    
    try {
      const intelligence = get().intelligence
      const conversationId = get().conversationId
      
      // Generate SCOPE.md
      const scope = await scopeGenerator.generateScope(
        intelligence,
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
        intelligence
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
  
  /**
   * Download SCOPE.md as markdown file
   */
  downloadScopeMarkdown: () => {
    const scope = get().generatedScope
    if (!scope) {
      throw new Error('No SCOPE.md document generated')
    }
    
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
  },
  
  /**
   * Download client summary as PDF
   */
  downloadClientPDF: async () => {
    const clientSummary = get().clientSummary
    if (!clientSummary) {
      throw new Error('No client summary generated')
    }
    
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
  }
}))
```

---

## Part 7: API Endpoints

**File:** `app/api/scope/save/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import type { ScopeDocument, ClientSummary } from '@/types/scope'
import type { ValidationResult } from '@/lib/scope/documentValidator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, scope, clientSummary, validation } = body as {
      conversationId: string
      scope: ScopeDocument
      clientSummary: ClientSummary
      validation: ValidationResult
    }
    
    // Save to database
    // This would integrate with your database system
    // For now, placeholder implementation
    
    // TODO: Save to Supabase or your database
    // await supabase.from('scope_documents').insert({
    //   conversation_id: conversationId,
    //   scope_data: scope,
    //   client_summary: clientSummary,
    //   validation_result: validation,
    //   created_at: new Date().toISOString()
    // })
    
    return NextResponse.json({
      success: true,
      message: 'SCOPE.md saved successfully'
    })
    
  } catch (error) {
    console.error('Error saving SCOPE.md:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
```

**File:** `app/api/scope/generate-pdf/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json()
    
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Set HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    })
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })
    
    await browser.close()
    
    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="project_summary.pdf"'
      }
    })
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}
```

---

## Part 8: Testing Requirements

### Unit Tests

```typescript
// __tests__/scopeGenerator.test.ts
describe('ScopeGenerator', () => {
  test('generates complete SCOPE.md from intelligence', async () => {
    const mockIntelligence: ConversationIntelligence = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      websiteType: 'ecommerce',
      companyName: 'Test Store',
      industry: 'Retail',
      // ... complete intelligence object
    }
    
    const scope = await scopeGenerator.generateScope(
      mockIntelligence,
      'test-conversation-id'
    )
    
    expect(scope).toBeDefined()
    expect(scope.section1_executiveSummary.projectName).toBe('Test Store')
    expect(scope.section3_clientInformation.email).toBe('john@example.com')
  })
  
  test('calculates complexity correctly', () => {
    const simpleIntelligence = {
      websiteType: 'portfolio',
      selectedFeatures: ['contact_form']
    }
    
    const complexity = scopeGenerator['determineComplexity'](simpleIntelligence)
    expect(complexity).toBe('simple')
    
    const complexIntelligence = {
      websiteType: 'ecommerce',
      selectedFeatures: ['shopping_cart', 'inventory', 'payment', 'user_accounts'],
      needsUserAccounts: true,
      needsPaymentProcessing: true
    }
    
    const complexComplexity = scopeGenerator['determineComplexity'](complexIntelligence)
    expect(complexComplexity).toBe('complex')
  })
})

// __tests__/markdownGenerator.test.ts
describe('MarkdownGenerator', () => {
  test('generates valid markdown', () => {
    const mockScope: ScopeDocument = {
      // ... complete scope object
    }
    
    const markdown = markdownGenerator.generateMarkdown(mockScope)
    
    expect(markdown).toContain('# PROJECT SCOPE DOCUMENT')
    expect(markdown).toContain('## Section 1: Executive Summary')
    expect(markdown).toContain('## Section 13: Investment Summary')
  })
  
  test('includes all 14 sections', () => {
    const markdown = markdownGenerator.generateMarkdown(mockScope)
    
    for (let i = 1; i <= 14; i++) {
      expect(markdown).toContain(`## Section ${i}:`)
    }
  })
})

// __tests__/documentValidator.test.ts
describe('DocumentValidator', () => {
  test('validates complete document', () => {
    const validScope: ScopeDocument = {
      // ... complete valid scope
    }
    
    const result = documentValidator.validate(validScope)
    
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.completeness).toBe(100)
  })
  
  test('identifies missing required fields', () => {
    const invalidScope: ScopeDocument = {
      // ... scope with missing required fields
      section3_clientInformation: {
        fullName: '',
        email: 'invalid-email',
        // ... missing fields
      }
    }
    
    const result = documentValidator.validate(invalidScope)
    
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors.some(e => e.field === 'fullName')).toBe(true)
    expect(result.errors.some(e => e.field === 'email')).toBe(true)
  })
  
  test('calculates pricing correctly', () => {
    const scope = {
      section10_featuresBreakdown: {
        basePackage: { price: 4500 },
        addOnFeatures: [
          { price: 500 },
          { price: 750 }
        ],
        bundleDiscounts: [
          { discount: 200 }
        ],
        subtotal: 5550
      }
    }
    
    const result = documentValidator.validate(scope)
    
    const pricingError = result.errors.find(e => 
      e.section === 'Section 10' && e.field === 'subtotal'
    )
    
    expect(pricingError).toBeUndefined() // Should be valid
  })
})
```

### Integration Tests

```typescript
// __tests__/integration/scopeGeneration.test.ts
describe('SCOPE.md Generation Flow', () => {
  test('generates SCOPE.md after conversation completion', async () => {
    // Simulate complete conversation
    const store = useConversationStore.getState()
    
    // ... complete conversation simulation
    
    // Generate SCOPE.md
    await store.generateScopeDocument()
    
    const scope = store.generatedScope
    expect(scope).toBeDefined()
    expect(scope?.section1_executiveSummary).toBeDefined()
    expect(scope?.section13_investmentSummary.totalProjectInvestment).toBeGreaterThan(0)
  })
  
  test('validates document before finalizing', async () => {
    const store = useConversationStore.getState()
    
    await store.generateScopeDocument()
    
    const validation = store.scopeValidation
    expect(validation).toBeDefined()
    expect(validation?.completeness).toBeGreaterThanOrEqual(90)
  })
  
  test('generates client summary alongside SCOPE.md', async () => {
    const store = useConversationStore.getState()
    
    await store.generateScopeDocument()
    
    const clientSummary = store.clientSummary
    expect(clientSummary).toBeDefined()
    expect(clientSummary?.keyFeatures.length).toBeGreaterThan(0)
    expect(clientSummary?.investmentSummary.totalInvestment).toBeGreaterThan(0)
  })
})
```

---

## Part 9: Success Criteria

### Functional Requirements
- ✅ All 14 SCOPE.md sections generate correctly
- ✅ Pricing calculations accurate (base + add-ons - discounts)
- ✅ ROI calculation when metrics available
- ✅ Feature dependencies identified
- ✅ Timeline generated based on complexity
- ✅ Client summary contains key information
- ✅ Document validation catches errors
- ✅ Markdown generation produces valid format
- ✅ PDF generation creates professional document

### Data Quality
- ✅ No placeholder text or "TBD" in required fields
- ✅ All contact information complete
- ✅ Technical specifications actionable
- ✅ Feature descriptions clear and specific
- ✅ Timeline milestones realistic
- ✅ Investment summary transparent

### Integration
- ✅ Uses intelligence from Phases 1-8
- ✅ Incorporates validation outcomes from Phase 8
- ✅ Integrates Feature Library pricing from Phase 6
- ✅ Respects design system from Phase 1
- ✅ Connects to email delivery (Phase 10)

### Developer Experience
- ✅ SCOPE.md sufficient for Cursor AI to build project
- ✅ No ambiguous requirements
- ✅ Clear implementation priorities
- ✅ All technical decisions documented
- ✅ Dependencies explicitly stated

### Performance
- ✅ SCOPE.md generation < 2 seconds
- ✅ PDF generation < 5 seconds
- ✅ Document validation < 500ms
- ✅ No UI blocking during generation

---

## Part 10: Files to Create

```
src/
├── types/
│   └── scope.ts                              ← NEW
│
├── lib/
│   ├── scope/
│   │   ├── scopeGenerator.ts                 ← NEW
│   │   ├── markdownGenerator.ts              ← NEW
│   │   ├── clientSummaryGenerator.ts         ← NEW
│   │   └── documentValidator.ts              ← NEW
│   │
│   └── stores/
│       └── conversationStore.ts              ← EXTEND
│
├── app/
│   └── api/
│       └── scope/
│           ├── save/
│           │   └── route.ts                  ← NEW
│           └── generate-pdf/
│               └── route.ts                  ← NEW
│
└── __tests__/
    ├── scopeGenerator.test.ts                ← NEW
    ├── markdownGenerator.test.ts             ← NEW
    ├── clientSummaryGenerator.test.ts        ← NEW
    ├── documentValidator.test.ts             ← NEW
    └── integration/
        └── scopeGeneration.test.ts           ← NEW
```

---

## Part 11: Implementation Checklist

### Day 1: Core Generation System
- [ ] Create `types/scope.ts` with all 14 section types
- [ ] Implement `scopeGenerator.ts` core engine
- [ ] Implement all 14 section generators
- [ ] Test section generation individually
- [ ] Verify intelligence-to-SCOPE mapping

### Day 2: Document Output Systems
- [ ] Implement `markdownGenerator.ts`
- [ ] Implement `clientSummaryGenerator.ts`
- [ ] Create PDF generation API endpoint
- [ ] Test markdown output quality
- [ ] Test PDF generation and styling
- [ ] Verify client summary readability

### Day 3: Validation & Integration
- [ ] Implement `documentValidator.ts`
- [ ] Add validation rules for all sections
- [ ] Integrate with conversation store
- [ ] Create save API endpoint
- [ ] Test complete generation flow
- [ ] Verify validation catches errors

### Day 4: Testing & Refinement
- [ ] Write comprehensive unit tests
- [ ] Write integration tests
- [ ] Test with various project types
- [ ] Test edge cases and errors
- [ ] Verify SCOPE.md is Cursor-ready
- [ ] Final quality assurance

---

## Next Steps

After Phase 9 completion:

1. **Phase 10**: Email Delivery & Completion
   - Send SCOPE.md to David (david@applicreations.com)
   - Send client summary PDF to user
   - Completion screen with next steps
   - Integration with email service

2. **Production Readiness**
   - Performance optimization
   - Error handling
   - Monitoring and analytics
   - Final testing
   - Launch preparation

---

## Critical Success Factors

### 1. Developer-Ready SCOPE.md
The SCOPE.md must be so complete that:
- Cursor AI can build the entire project without clarification
- No technical ambiguity exists
- All features clearly specified
- Dependencies explicitly documented
- Implementation priorities clear

**Test:** Hand SCOPE.md to developer unfamiliar with project. Can they build it?

### 2. Accurate Pricing
- Base package + add-ons - discounts = correct total
- Payment schedule totals 100%
- Hosting costs clearly separated
- ROI calculated when possible
- No hidden costs or assumptions

**Test:** Client should never be surprised by pricing

### 3. Professional Client Summary
- Clean, scannable PDF design
- Key information highlighted
- Clear next steps
- Professional presentation
- No technical jargon

**Test:** Client's boss should understand project instantly

### 4. Complete Validation
- Catch all critical errors before generation
- Warn about potential issues
- Verify pricing calculations
- Check data completeness
- Ensure consistency across sections

**Test:** No SCOPE.md with critical errors should be generated

---

**Phase 9 transforms conversation intelligence into complete, professional technical documentation that bridges the gap between customer intent and developer implementation. This is the payoff for all previous phases.**

Ready to implement? Start with `types/scope.ts` to establish the complete data structure, then build `scopeGenerator.ts` section by section, testing each as you go.

