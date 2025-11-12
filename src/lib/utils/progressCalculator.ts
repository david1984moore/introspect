import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeProgress, SectionStatus } from '@/types/scopeProgress'
import { SCOPE_SECTION_METADATA } from '@/types/scopeProgress'
import type { SessionIntelligence } from '@/types'

/**
 * Convert store state (SessionIntelligence + foundation data) to ConversationIntelligence
 * for use with the progress calculator
 */
export function convertToConversationIntelligence(
  sessionIntelligence: SessionIntelligence,
  foundation: {
    userName: string
    userEmail: string
    userPhone: string
    websiteType: string
  },
  selectedFeatures?: string[]
): ConversationIntelligence {
  return {
    // Foundation
    userName: foundation.userName,
    userEmail: foundation.userEmail,
    userPhone: foundation.userPhone,
    companyName: sessionIntelligence.businessName,
    websiteType: foundation.websiteType,
    industry: sessionIntelligence.industry,
    
    // Business Context
    targetAudience: sessionIntelligence.targetAudience,
    primaryGoal: sessionIntelligence.primaryGoal,
    problemBeingSolved: sessionIntelligence.uniqueValue, // Map uniqueValue to problemBeingSolved
    successMetrics: sessionIntelligence.competitors ? ['Competitive analysis'] : undefined, // Placeholder
    valueProposition: sessionIntelligence.uniqueValue,
    
    // Technical Requirements
    needsUserAccounts: sessionIntelligence.hasMembers,
    authenticationMethod: sessionIntelligence.hasMembers ? 'email' : undefined,
    needsCMS: sessionIntelligence.publishesContent,
    cmsUpdateFrequency: sessionIntelligence.publishesContent ? 'weekly' : undefined,
    needsSearch: sessionIntelligence.publishesContent,
    
    // Features
    selectedFeatures: selectedFeatures,
    featurePricing: {}, // Will be populated from feature library
    
    // Design
    designStyle: sessionIntelligence.hasBrandColors ? 'Brand colors available' : undefined,
    existingBrandAssets: [
      sessionIntelligence.hasLogo && 'Logo',
      sessionIntelligence.hasBrandColors && 'Brand colors',
      sessionIntelligence.hasPhotography && 'Photography'
    ].filter(Boolean) as string[],
    
    // Timeline & Budget
    desiredTimeline: sessionIntelligence.launchTimeline,
    budgetRange: sessionIntelligence.budgetRange,
    priority: sessionIntelligence.launchTimeline === 'urgent' ? 'high' : undefined,
    
    // Content
    contentProvider: sessionIntelligence.contentReadiness === 'ready' ? 'Client' : 
                     sessionIntelligence.contentReadiness === 'need_help' ? 'Agency' : undefined,
    contentReadiness: sessionIntelligence.contentReadiness,
    
    // Additional context
    businessModel: sessionIntelligence.businessModel,
  }
}

export class ProgressCalculator {
  /**
   * Calculate current SCOPE.md progress based on gathered intelligence
   */
  calculateProgress(intelligence: ConversationIntelligence): ScopeProgress {
    const sections = this.evaluateSections(intelligence)
    
    const sectionsComplete = Object.values(sections).filter(
      status => status === 'complete'
    ).length
    
    const sectionsInProgress = Object.values(sections).filter(
      status => status === 'in_progress'
    ).length
    
    const sectionsRemaining = Object.values(sections).filter(
      status => status === 'not_started'
    ).length
    
    const overallCompleteness = Math.round((sectionsComplete / 14) * 100)
    
    const currentSection = this.getCurrentSection(sections)
    
    const estimatedQuestionsRemaining = this.estimateRemainingQuestions(
      sections,
      intelligence
    )
    
    return {
      sections,
      overallCompleteness,
      sectionsComplete,
      sectionsInProgress,
      sectionsRemaining,
      currentSection,
      estimatedQuestionsRemaining
    }
  }
  
  /**
   * Evaluate status of each SCOPE.md section
   */
  private evaluateSections(
    intelligence: ConversationIntelligence
  ): ScopeProgress['sections'] {
    return {
      section1_executive_summary: this.evaluateSection1(intelligence),
      section2_project_classification: this.evaluateSection2(intelligence),
      section3_client_information: this.evaluateSection3(intelligence),
      section4_business_context: this.evaluateSection4(intelligence),
      section5_brand_assets: this.evaluateSection5(intelligence),
      section6_content_strategy: this.evaluateSection6(intelligence),
      section7_technical_specs: this.evaluateSection7(intelligence),
      section8_media_elements: this.evaluateSection8(intelligence),
      section9_design_direction: this.evaluateSection9(intelligence),
      section10_features_breakdown: this.evaluateSection10(intelligence),
      section11_support_plan: this.evaluateSection11(intelligence),
      section12_timeline: this.evaluateSection12(intelligence),
      section13_investment_summary: this.evaluateSection13(intelligence),
      section14_validation_outcomes: this.evaluateSection14(intelligence)
    }
  }
  
  // Section evaluation methods (from Phase 3's sufficiency criteria)
  
  private evaluateSection1(intelligence: ConversationIntelligence): SectionStatus {
    // Section 1: Executive Summary (derived from other sections)
    // Complete when Sections 2, 4, and 10 are complete
    const hasBasics = intelligence.userName && intelligence.websiteType
    const hasGoal = intelligence.primaryGoal
    const hasAudience = intelligence.targetAudience
    
    if (hasBasics && hasGoal && hasAudience) return 'complete'
    if (hasBasics) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection2(intelligence: ConversationIntelligence): SectionStatus {
    // Section 2: Project Classification
    // Complete when: websiteType, industry, business model, complexity, package
    const hasType = intelligence.websiteType
    const hasIndustry = intelligence.industry
    
    if (hasType && hasIndustry) return 'complete'
    if (hasType || hasIndustry) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection3(intelligence: ConversationIntelligence): SectionStatus {
    // Section 3: Client Information
    // Complete when: name, email, phone, company
    const hasName = intelligence.userName
    const hasEmail = intelligence.userEmail
    const hasPhone = intelligence.userPhone
    const hasCompany = intelligence.companyName
    
    if (hasName && hasEmail && hasPhone && hasCompany) return 'complete'
    if (hasName || hasEmail) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection4(intelligence: ConversationIntelligence): SectionStatus {
    // Section 4: Business Context
    // Complete when: overview, audience, goal, metrics, value prop, pain points
    const hasAudience = intelligence.targetAudience
    const hasGoal = intelligence.primaryGoal
    const hasMetrics = intelligence.successMetrics && intelligence.successMetrics.length > 0
    const hasProblem = intelligence.problemBeingSolved
    const hasValue = intelligence.valueProposition
    
    // Note: problemBeingSolved and valueProposition both map to uniqueValue,
    // so they're effectively the same field. We need to account for this.
    const hasUniqueValue = hasProblem || hasValue
    
    const completedItems = [hasAudience, hasGoal, hasMetrics, hasUniqueValue]
      .filter(Boolean).length
    
    // More lenient: if we have 3 out of 4 distinct items (audience, goal, uniqueValue, metrics),
    // consider it complete. This prevents sections from staying stuck in 'in_progress'
    // Most businesses will have audience, goal, and uniqueValue, which is sufficient
    if (completedItems >= 3) return 'complete'
    if (completedItems >= 2) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection5(intelligence: ConversationIntelligence): SectionStatus {
    // Section 5: Brand Assets & Identity
    // Complete when: existing assets known, style direction set
    const hasDesignStyle = intelligence.designStyle
    const hasAssets = intelligence.existingBrandAssets && intelligence.existingBrandAssets.length > 0
    
    if (hasDesignStyle && hasAssets) return 'complete'
    if (hasDesignStyle || hasAssets) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection6(intelligence: ConversationIntelligence): SectionStatus {
    // Section 6: Content Strategy
    // Complete when: provider, readiness, frequency, maintenance
    const hasProvider = intelligence.contentProvider
    const hasReadiness = intelligence.contentReadiness
    const hasFrequency = intelligence.cmsUpdateFrequency
    
    if (hasProvider && hasReadiness && hasFrequency) return 'complete'
    if (hasProvider || hasReadiness) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection7(intelligence: ConversationIntelligence): SectionStatus {
    // Section 7: Technical Specifications
    // Complete when: auth, CMS, search, type-specific features, integrations
    const hasAuthDecision = intelligence.needsUserAccounts !== undefined
    const hasCMSDecision = intelligence.needsCMS !== undefined
    const hasTypeSpecific = this.hasTypeSpecificRequirements(intelligence)
    
    const completedItems = [hasAuthDecision, hasCMSDecision, hasTypeSpecific]
      .filter(Boolean).length
    
    // More lenient: if we have 2 out of 3, consider it complete
    // This prevents sections from staying stuck in 'in_progress'
    if (completedItems >= 2) return 'complete'
    if (completedItems >= 1) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection8(intelligence: ConversationIntelligence): SectionStatus {
    // Section 8: Media & Interactive Elements
    // Complete when: media requirements captured
    const hasMediaRequirements = intelligence.existingBrandAssets && 
                                 intelligence.existingBrandAssets.some(asset => 
                                   asset.toLowerCase().includes('photo') || 
                                   asset.toLowerCase().includes('video')
                                 )
    
    if (hasMediaRequirements) return 'complete'
    // Check if we have any indication of media needs
    if (intelligence.websiteType?.toLowerCase().includes('portfolio') || 
        intelligence.websiteType?.toLowerCase().includes('blog')) {
      return 'in_progress'
    }
    return 'not_started'
  }
  
  private evaluateSection9(intelligence: ConversationIntelligence): SectionStatus {
    // Section 9: Design Direction
    // Complete when: style, references documented
    const hasDesignStyle = intelligence.designStyle
    
    if (hasDesignStyle) return 'complete'
    if (intelligence.existingBrandAssets && intelligence.existingBrandAssets.length > 0) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection10(intelligence: ConversationIntelligence): SectionStatus {
    // Section 10: Features & Functionality Breakdown
    // Complete when: features selected (Phase 6)
    const hasFeatures = intelligence.selectedFeatures && 
                        intelligence.selectedFeatures.length > 0
    
    if (hasFeatures) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection11(intelligence: ConversationIntelligence): SectionStatus {
    // Section 11: Post-Launch Support Plan
    // Complete when: training, maintenance, hosting determined
    const hasTraining = intelligence.contentReadiness === 'need_help' // Indicates training needed
    const hasMaintenance = intelligence.cmsUpdateFrequency !== undefined
    
    if (hasTraining && hasMaintenance) return 'complete'
    if (hasTraining || hasMaintenance) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection12(intelligence: ConversationIntelligence): SectionStatus {
    // Section 12: Project Timeline
    // Complete when: timeline set
    const hasTimeline = intelligence.desiredTimeline
    
    if (hasTimeline) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection13(intelligence: ConversationIntelligence): SectionStatus {
    // Section 13: Investment Summary
    // Complete when: features selected (pricing calculated from Section 10)
    const hasPricing = intelligence.selectedFeatures && 
                      intelligence.selectedFeatures.length > 0
    
    if (hasPricing) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection14(intelligence: ConversationIntelligence): SectionStatus {
    // Section 14: Validation Outcomes
    // Complete when: validation loops done (end of conversation)
    // This is typically set externally when conversation completes
    return 'not_started'
  }
  
  private hasTypeSpecificRequirements(intelligence: ConversationIntelligence): boolean {
    const websiteType = intelligence.websiteType?.toLowerCase()
    
    switch (websiteType) {
      case 'ecommerce':
        return intelligence.selectedFeatures?.some(f => 
          f.toLowerCase().includes('ecommerce') || 
          f.toLowerCase().includes('product')
        ) || false
      case 'portfolio':
        return intelligence.selectedFeatures?.some(f => 
          f.toLowerCase().includes('portfolio') || 
          f.toLowerCase().includes('gallery')
        ) || false
      case 'blog':
        return intelligence.selectedFeatures?.some(f => 
          f.toLowerCase().includes('blog') || 
          f.toLowerCase().includes('cms')
        ) || false
      case 'service':
        return intelligence.selectedFeatures?.some(f => 
          f.toLowerCase().includes('booking') || 
          f.toLowerCase().includes('appointment')
        ) || false
      default:
        return true // Other types may not have specific requirements
    }
  }
  
  private getCurrentSection(sections: ScopeProgress['sections']): string | null {
    // Find first in-progress section
    const inProgressSection = Object.entries(sections).find(
      ([_, status]) => status === 'in_progress'
    )
    
    if (inProgressSection) {
      return inProgressSection[0]
    }
    
    // If no in-progress, find first not-started
    const notStartedSection = Object.entries(sections).find(
      ([_, status]) => status === 'not_started'
    )
    
    return notStartedSection ? notStartedSection[0] : null
  }
  
  private estimateRemainingQuestions(
    sections: ScopeProgress['sections'],
    intelligence: ConversationIntelligence
  ): number {
    let estimate = 0
    
    Object.entries(sections).forEach(([sectionKey, status]) => {
      if (status === 'complete') return
      
      const metadata = SCOPE_SECTION_METADATA[sectionKey]
      if (!metadata) return
      
      // Use complexity to determine if min or max questions needed
      const complexity = this.determineComplexity(intelligence)
      const questionCount = complexity === 'simple' 
        ? metadata.estimatedQuestions.min
        : complexity === 'complex'
        ? metadata.estimatedQuestions.max
        : Math.round(
            (metadata.estimatedQuestions.min + metadata.estimatedQuestions.max) / 2
          )
      
      if (status === 'in_progress') {
        // Assume halfway through in-progress sections
        estimate += Math.ceil(questionCount / 2)
      } else {
        estimate += questionCount
      }
    })
    
    return estimate
  }
  
  private determineComplexity(
    intelligence: ConversationIntelligence
  ): 'simple' | 'standard' | 'complex' {
    const websiteType = intelligence.websiteType?.toLowerCase()
    
    // E-commerce and membership sites are typically complex
    if (websiteType === 'ecommerce' || websiteType === 'membership') {
      return 'complex'
    }
    
    // Portfolio and blogs are typically simple
    if (websiteType === 'portfolio' || websiteType === 'blog') {
      return 'simple'
    }
    
    // Check feature count if available
    if (intelligence.selectedFeatures && intelligence.selectedFeatures.length > 10) {
      return 'complex'
    }
    
    return 'standard'
  }
}

export const progressCalculator = new ProgressCalculator()

/**
 * Calculate progress based on question count using the new algorithm:
 * - First 10 questions: each fills 1/14 (≈7.14%) of progress
 * - After 10 questions: each fills 6% of remaining progress
 * - If only 1 more 6% increment can fit, stop showing progress until final question fills to 100%
 * 
 * @param questionCount - The number of questions answered so far
 * @param isComplete - Whether the conversation is complete (final question answered)
 * @returns Progress percentage (0-100)
 */
export function calculateProgressByQuestionCount(
  questionCount: number,
  isComplete: boolean = false
): number {
  // If conversation is complete, always return 100%
  if (isComplete) {
    return 100
  }
  
  // First 10 questions: each fills 1/14 of progress (≈7.142857%)
  const progressPerQuestionFirst10 = 100 / 14 // ≈7.142857%
  
  if (questionCount <= 10) {
    return Math.min(100, questionCount * progressPerQuestionFirst10)
  }
  
  // After 10 questions: calculate remaining progress and fill 6% of remaining each time
  // After 10 questions, we've filled: 10 * (100/14) = 500/14 ≈ 71.428571%
  const progressAfter10Questions = 10 * progressPerQuestionFirst10 // ≈71.428571%
  const remainingProgress = 100 - progressAfter10Questions // ≈28.571429%
  
  // Calculate how many 6% increments can fit in the remaining progress
  const questionsAfter10 = questionCount - 10
  const incrementPercent = 6 // 6% of remaining progress
  
  // Calculate progress: start from progressAfter10Questions, then add increments
  // Each increment fills 6% of the remaining progress
  let currentProgress = progressAfter10Questions
  
  for (let i = 1; i <= questionsAfter10; i++) {
    const remaining = 100 - currentProgress
    
    // If only 1 more 6% increment can fit before reaching 100%, stop showing progress
    // Calculate what the next increment would be: 6% of remaining
    const nextIncrement = remaining * (incrementPercent / 100)
    const progressAfterNext = currentProgress + nextIncrement
    
    // If the next increment would bring us to 99% or more, stop here
    // This ensures we leave room for the final question to fill to 100%
    if (progressAfterNext >= 99 || remaining <= 6) {
      // Don't add more progress - wait for final question
      break
    }
    
    // Add 6% of remaining progress
    const increment = remaining * (incrementPercent / 100)
    currentProgress += increment
  }
  
  return Math.min(100, Math.round(currentProgress * 100) / 100)
}

