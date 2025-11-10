// Phase 9: SCOPE.md Generator Core Engine
// Transforms conversation intelligence into complete SCOPE.md document

import type { ConversationIntelligence } from '@/types/conversation'
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
import { featureLibrary } from '@/lib/features/featureLibraryParser'

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
    const projectName = intelligence.companyName || intelligence.userName || 'Unnamed Project'
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
      businessModel: intelligence.businessModel as string | undefined,
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
      if (intelligence.budgetRange === 'under_3k' || intelligence.budgetRange === 'under_5000') return 'starter'
      if (intelligence.budgetRange === '3k_to_5k' || intelligence.budgetRange === '5000_to_10000') return 'professional'
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
      fullName: intelligence.userName || 'Name not provided',
      email: intelligence.userEmail || '',
      phone: intelligence.userPhone || '',
      companyName: intelligence.companyName || intelligence.userName || '',
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
      contentProvider: (intelligence.contentProvider as 'client' | 'applicreations' | 'mixed') || 'mixed',
      contentReadiness: (intelligence.contentReadiness as 'ready' | 'in_progress' | 'needs_creation') || 'needs_creation',
      updateFrequency: (intelligence.contentUpdateFrequency as 'daily' | 'weekly' | 'monthly' | 'rarely') || 'monthly',
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
        method: (intelligence.authenticationMethod as any) || 'email_password',
        providers: intelligence.authProviders,
        userRoles: intelligence.userRoles
      } : { required: false },
      
      contentManagement: {
        required: intelligence.needsCMS ?? false,
        type: intelligence.cmsType as any,
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
    const packageName = this.determinePackage(intelligence, this.determineComplexity(intelligence))
    const packagePrice = this.getPackagePrice(packageName)
    
    // Get base package features
    const baseFeatures = this.getBasePackageFeatures(packageName)
    
    // Get selected add-on features with pricing
    const selectedFeatures = intelligence.selectedFeatures || []
    const packageTier = packageName.charAt(0).toUpperCase() + packageName.slice(1)
    const pricingResult = featureLibrary.calculatePricing(selectedFeatures, packageTier)
    
    const addOnFeatures = pricingResult.addonFeatures.map(feature => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      category: feature.category,
      price: feature.pricing.addonPrice || 0,
      rationale: this.generateFeatureRationale(feature, intelligence)
    }))
    
    // Calculate bundles
    const featureBundles = pricingResult.appliedBundles.map(bundle => {
      const bundleFeatures = bundle.features.map(id => featureLibrary.getFeature(id)).filter(Boolean)
      const originalPrice = bundleFeatures.reduce((sum, f) => sum + (f?.pricing.addonPrice || 0), 0)
      const discountedPrice = Math.max(0, originalPrice - bundle.discount)
      
      return {
        name: bundle.name,
        features: bundleFeatures.map(f => f!.name),
        originalPrice,
        discountedPrice,
        savings: bundle.discount
      }
    })
    
    // Identify conflicts (from validation)
    const conflicts = featureLibrary.detectConflicts(selectedFeatures).map(conflict => ({
      featureA: conflict.featureA,
      featureB: conflict.featureB,
      resolution: conflict.resolution
    }))
    
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
    
    featureIds.forEach(featureId => {
      const feature = featureLibrary.getFeature(featureId)
      if (feature?.dependencies && feature.dependencies.length > 0) {
        const missingDeps = feature.dependencies.filter(depId => !featureIds.includes(depId))
        if (missingDeps.length > 0) {
          dependencies.push({
            feature: feature.name,
            requires: missingDeps.map(id => featureLibrary.getFeature(id)?.name || id).filter(Boolean),
            reason: 'Required dependency for this feature'
          })
        }
      }
    })
    
    return dependencies
  }
  
  /**
   * Section 11: Post-Launch Support Plan
   */
  private generateSupportPlan(intelligence: ConversationIntelligence): SupportPlan {
    const packageName = this.determinePackage(intelligence, this.determineComplexity(intelligence))
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
        provider: (intelligence.maintenanceProvider as any) || 'applicreations',
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
    const packageName = this.determinePackage(intelligence, this.determineComplexity(intelligence))
    const packagePrice = this.getPackagePrice(packageName)
    
    // Calculate add-on features
    const selectedFeatures = intelligence.selectedFeatures || []
    const packageTier = packageName.charAt(0).toUpperCase() + packageName.slice(1)
    const pricingResult = featureLibrary.calculatePricing(selectedFeatures, packageTier)
    
    const addOnFeatures = pricingResult.addonFeatures.map(feature => ({
      name: feature.name,
      price: feature.pricing.addonPrice || 0
    }))
    
    // Calculate bundles
    const bundleDiscounts = pricingResult.appliedBundles.map(bundle => ({
      name: bundle.name,
      discount: bundle.discount
    }))
    
    // Calculate totals
    const featuresSubtotal = pricingResult.subtotal
    const totalDiscounts = pricingResult.bundleDiscount
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
    const packageName = this.determinePackage(intelligence, this.determineComplexity(intelligence))
    if (packageName) {
      decisions.push({
        decision: `Selected ${packageName} package`,
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
      { field: 'userName', label: 'Full name' },
      { field: 'userEmail', label: 'Email' },
      { field: 'websiteType', label: 'Website type' }
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
      'marketplace': 'Marketplace',
      'business': 'Business',
      'personal': 'Personal',
      'project': 'Project',
      'nonprofit': 'Nonprofit'
    }
    return typeMap[type] || type
  }
}

export const scopeGenerator = new ScopeGenerator()

