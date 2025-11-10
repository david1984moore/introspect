// Feature Recommendation Engine for Phase 6
// Provides intelligent feature recommendations based on conversation intelligence

import type { ConversationIntelligence } from '@/types/conversation'
import type { Feature } from './featureLibraryParser'
import { featureLibrary } from './featureLibraryParser'

export class FeatureRecommendationEngine {
  /**
   * Get recommended features based on gathered intelligence
   */
  getRecommendations(intelligence: ConversationIntelligence): string[] {
    const recommendations: string[] = []
    const websiteType = intelligence.websiteType?.toLowerCase() || 'website'
    
    // Base recommendations by type
    const baseRecs = this.getBaseRecommendationsByType(websiteType)
    recommendations.push(...baseRecs)
    
    // Intelligence-driven recommendations
    if (intelligence.needsUserAccounts) {
      recommendations.push('user_authentication')
    }
    
    if (intelligence.needsCMS) {
      recommendations.push('cms')
    }
    
    if (intelligence.needsSearch) {
      recommendations.push('seo_optimization')
    }
    
    if (intelligence.primaryGoal === 'lead_generation') {
      recommendations.push('contact_form', 'email_marketing')
    }
    
    if (intelligence.primaryGoal === 'ecommerce') {
      recommendations.push('shopping_cart', 'payment_processing', 'product_catalog')
    }
    
    if (intelligence.targetAudience?.includes('mobile')) {
      // Mobile optimization is typically included in base packages
      recommendations.push('contact_form')
    }
    
    if (intelligence.industry === 'healthcare') {
      recommendations.push('hipaa_compliance')
    }
    
    // Prioritize by confidence scores
    return this.prioritizeRecommendations(recommendations, intelligence)
  }
  
  private getBaseRecommendationsByType(websiteType: string): string[] {
    const baseRecommendations: Record<string, string[]> = {
      ecommerce: [
        'shopping_cart',
        'payment_processing',
        'product_catalog',
      ],
      portfolio: [
        'gallery',
        'contact_form',
      ],
      blog: [
        'blog_system',
        'cms',
      ],
      service: [
        'contact_form',
      ],
      corporate: [
        'contact_form',
        'cms',
      ],
      membership: [
        'user_authentication',
        'membership_portal',
      ],
      booking: [
        'booking_system',
        'payment_processing',
      ]
    }
    
    return baseRecommendations[websiteType] || ['contact_form']
  }
  
  private prioritizeRecommendations(
    recommendations: string[],
    intelligence: ConversationIntelligence
  ): string[] {
    // Remove duplicates
    const unique = Array.from(new Set(recommendations))
    
    // Score each recommendation
    const scored = unique.map(featureId => {
      const feature = featureLibrary.getFeature(featureId)
      if (!feature) return { featureId, score: 0 }
      
      let score = 1
      
      // Higher score for included features
      if (feature.pricing.type === 'included') {
        score += 2
      }
      
      // Higher score for bundle-eligible features
      if (feature.pricing.bundleEligible) {
        score += 1
      }
      
      // Higher score for features matching primary goal
      if (this.matchesGoal(feature, intelligence.primaryGoal)) {
        score += 3
      }
      
      return { featureId, score }
    })
    
    // Sort by score descending
    scored.sort((a, b) => b.score - a.score)
    
    // Return top recommendations (limit to avoid overwhelming)
    return scored.slice(0, 15).map(s => s.featureId)
  }
  
  private matchesGoal(feature: Feature, goal?: string): boolean {
    if (!goal) return false
    
    const goalFeatureMap: Record<string, string[]> = {
      lead_generation: ['contact_form', 'email_marketing'],
      ecommerce: ['shopping_cart', 'payment_processing', 'product_catalog'],
      brand_awareness: ['seo_optimization', 'blog_system'],
      customer_service: ['contact_form']
    }
    
    return goalFeatureMap[goal]?.includes(feature.id) || false
  }
}

export const recommendationEngine = new FeatureRecommendationEngine()

