import type { ConversationIntelligence } from '@/types/conversation'
import type { ValidationPrompt } from '@/types/validation'

export class ValidationTriggers {
  /**
   * Determine if validation should be triggered based on intelligence state
   */
  shouldTriggerValidation(
    intelligence: ConversationIntelligence,
    lastAnsweredCategory: string
  ): ValidationPrompt | null {
    // Check for section completion that needs validation
    if (this.shouldValidateBusinessContext(intelligence, lastAnsweredCategory)) {
      return this.createBusinessContextValidation(intelligence)
    }
    
    if (this.shouldValidateTechnicalSpecs(intelligence, lastAnsweredCategory)) {
      return this.createTechnicalSpecsValidation(intelligence)
    }
    
    if (this.shouldValidateFeatureConflicts(intelligence)) {
      return this.createFeatureConflictValidation(intelligence)
    }
    
    // Check for assumptions that need clarification
    const assumption = this.detectAssumptions(intelligence)
    if (assumption) {
      return assumption
    }
    
    return null
  }
  
  private shouldValidateBusinessContext(
    intelligence: ConversationIntelligence,
    lastCategory: string
  ): boolean {
    // Validate when Business Context section is complete
    return (
      lastCategory === 'business_context' &&
      intelligence.targetAudience !== undefined &&
      intelligence.primaryGoal !== undefined &&
      intelligence.successMetrics !== undefined &&
      intelligence.successMetrics.length > 0
    )
  }
  
  private createBusinessContextValidation(
    intelligence: ConversationIntelligence
  ): ValidationPrompt {
    return {
      id: `validation_${Date.now()}`,
      type: 'understanding',
      category: 'business_context',
      summary: `You're building a ${intelligence.websiteType} website for ${intelligence.targetAudience} with the primary goal of ${intelligence.primaryGoal}. Success will be measured by ${intelligence.successMetrics?.join(', ')}.`,
      details: [
        {
          label: 'Target Audience',
          value: intelligence.targetAudience || '',
          editable: true
        },
        {
          label: 'Primary Goal',
          value: intelligence.primaryGoal || '',
          editable: true
        },
        {
          label: 'Success Metrics',
          value: intelligence.successMetrics?.join(', ') || '',
          editable: true
        }
      ],
      allowEdit: true
    }
  }
  
  private shouldValidateTechnicalSpecs(
    intelligence: ConversationIntelligence,
    lastCategory: string
  ): boolean {
    // Validate when Technical Specs section is complete
    return (
      lastCategory === 'technical_requirements' &&
      intelligence.needsUserAccounts !== undefined &&
      intelligence.needsCMS !== undefined
    )
  }
  
  private createTechnicalSpecsValidation(
    intelligence: ConversationIntelligence
  ): ValidationPrompt {
    const authText = intelligence.needsUserAccounts
      ? `with user authentication (${intelligence.authenticationMethod || 'standard'})`
      : 'without user accounts'
    
    const cmsText = intelligence.needsCMS
      ? `and a content management system for ${intelligence.cmsUpdateFrequency || 'regular'} updates`
      : 'and no CMS (static content)'
    
    return {
      id: `validation_${Date.now()}`,
      type: 'understanding',
      category: 'technical_specs',
      summary: `Your website will be built ${authText} ${cmsText}.`,
      details: [
        {
          label: 'User Accounts',
          value: intelligence.needsUserAccounts ? 'Yes' : 'No',
          editable: false
        },
        ...(intelligence.needsUserAccounts ? [{
          label: 'Authentication Method',
          value: intelligence.authenticationMethod || 'Standard',
          editable: true
        }] : []),
        {
          label: 'Content Management',
          value: intelligence.needsCMS ? 'Yes' : 'No',
          editable: false
        }
      ],
      allowEdit: true
    }
  }
  
  private shouldValidateFeatureConflicts(
    intelligence: ConversationIntelligence
  ): boolean {
    // Check for feature conflicts (from Phase 6)
    return (
      intelligence.selectedFeatures !== undefined &&
      intelligence.selectedFeatures.length > 0 &&
      this.detectFeatureConflicts(intelligence.selectedFeatures).length > 0
    )
  }
  
  private createFeatureConflictValidation(
    intelligence: ConversationIntelligence
  ): ValidationPrompt {
    const conflicts = this.detectFeatureConflicts(intelligence.selectedFeatures || [])
    const conflict = conflicts[0] // Handle first conflict
    
    return {
      id: `validation_${Date.now()}`,
      type: 'conflict',
      category: 'features',
      summary: `You've selected both "${conflict.featureA}" and "${conflict.featureB}", but these features conflict: ${conflict.reason}`,
      options: [
        {
          value: conflict.featureA,
          label: `Keep ${conflict.featureA}`,
          description: `Remove ${conflict.featureB}`
        },
        {
          value: conflict.featureB,
          label: `Keep ${conflict.featureB}`,
          description: `Remove ${conflict.featureA}`
        }
      ]
    }
  }
  
  private detectAssumptions(
    intelligence: ConversationIntelligence
  ): ValidationPrompt | null {
    // Example: If user wants e-commerce but hasn't mentioned inventory
    if (
      intelligence.websiteType === 'ecommerce' &&
      intelligence.selectedFeatures?.includes('shopping_cart') &&
      !intelligence.inventoryManagement
    ) {
      return {
        id: `validation_${Date.now()}`,
        type: 'assumption',
        category: 'technical_specs',
        summary: 'Since you\'re building an e-commerce site, I\'m assuming you\'ll need inventory management to track stock levels.',
        allowEdit: false
      }
    }
    
    return null
  }
  
  private detectFeatureConflicts(features: string[]): Array<{
    featureA: string
    featureB: string
    reason: string
  }> {
    // This would integrate with Feature Library conflict detection from Phase 6
    // Placeholder for example
    const conflicts: Array<{
      featureA: string
      featureB: string
      reason: string
    }> = []
    
    if (features.includes('basic_contact_form') && features.includes('advanced_form_builder')) {
      conflicts.push({
        featureA: 'basic_contact_form',
        featureB: 'advanced_form_builder',
        reason: 'You only need one form solution'
      })
    }
    
    return conflicts
  }
}

export const validationTriggers = new ValidationTriggers()

