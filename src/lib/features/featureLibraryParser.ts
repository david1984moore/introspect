// Feature Library Parser for Phase 6
// Parses and manages features from APPLICREATIONS_FEATURE_LIBRARY_V1_1_COMPLETE.md

export interface Feature {
  id: string
  name: string
  description: string
  category: FeatureCategory
  pricing: FeaturePricing
  websiteTypes: string[] // Which types this applies to
  dependencies?: string[] // Feature IDs that must be selected
  conflicts?: string[] // Feature IDs that can't be selected with this
  tags?: string[] // For filtering and search
  recommended?: boolean // Dynamically set based on context
}

export type FeatureCategory = 
  | 'core'
  | 'ecommerce'
  | 'marketing'
  | 'content'
  | 'integration'
  | 'media'
  | 'booking'
  | 'membership'
  | 'compliance'
  | 'performance'

export interface FeaturePricing {
  type: 'included' | 'addon'
  tiers?: string[] // Which package tiers include this (Starter, Professional, Custom)
  addonPrice?: number // Add-on cost if not included
  bundleEligible?: boolean // Can be part of bundle discount
}

export interface FeatureBundle {
  id: string
  name: string
  category: FeatureCategory
  features: string[] // Feature IDs in this bundle
  discount: number // Dollar amount or percentage
  minSelection: number // Minimum features to qualify for bundle
}

export interface FeatureConflict {
  featureA: string
  featureB: string
  reason: string
  resolution: 'choose_one' | 'upgrade_required' | 'mutually_exclusive'
}

export interface FeaturePricingResult {
  subtotal: number
  bundleDiscount: number
  total: number
  includedFeatures: Feature[]
  addonFeatures: Feature[]
  appliedBundles: FeatureBundle[]
}

export interface DependencyValidation {
  valid: boolean
  missingDependencies: Array<{
    feature: Feature
    missingDeps: Feature[]
  }>
}

export class FeatureLibraryParser {
  private features: Map<string, Feature> = new Map()
  private bundles: FeatureBundle[] = []
  private conflicts: FeatureConflict[] = []
  
  constructor() {
    this.parseFeatureLibrary()
  }
  
  private parseFeatureLibrary() {
    // Initialize with core features from the Feature Library
    // In production, this would parse from the markdown file
    
    // Core Features
    this.addFeature({
      id: 'contact_form',
      name: 'Contact Form',
      description: 'Customizable contact form with spam protection',
      category: 'core',
      pricing: {
        type: 'included',
        tiers: ['Starter', 'Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['forms', 'contact']
    })
    
    this.addFeature({
      id: 'user_authentication',
      name: 'User Authentication',
      description: 'Secure user login and account management',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 800,
        bundleEligible: false
      },
      websiteTypes: ['ecommerce', 'membership', 'service'],
      tags: ['security', 'accounts', 'login']
    })
    
    // E-commerce Features
    this.addFeature({
      id: 'shopping_cart',
      name: 'Shopping Cart',
      description: 'Full shopping cart with checkout flow',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
        bundleEligible: true
      },
      websiteTypes: ['ecommerce'],
      tags: ['cart', 'checkout', 'ecommerce']
    })
    
    this.addFeature({
      id: 'payment_processing',
      name: 'Payment Processing',
      description: 'Integrated payment gateway (Stripe/PayPal)',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 600,
        bundleEligible: true
      },
      websiteTypes: ['ecommerce', 'booking', 'membership'],
      dependencies: ['shopping_cart'],
      tags: ['payments', 'stripe', 'paypal']
    })
    
    this.addFeature({
      id: 'product_catalog',
      name: 'Product Catalog',
      description: 'Comprehensive product display with variants and inventory',
      category: 'ecommerce',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['products', 'catalog', 'ecommerce']
    })
    
    // Booking Features
    this.addFeature({
      id: 'booking_system',
      name: 'Booking System',
      description: 'Comprehensive online booking system for reservations, appointments, or rentals',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 800,
        bundleEligible: true
      },
      websiteTypes: ['booking', 'service'],
      tags: ['booking', 'reservations', 'appointments']
    })
    
    this.addFeature({
      id: 'appointment_scheduling',
      name: 'Appointment Scheduling',
      description: 'Allow customers to book appointments online with calendar integration',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 800,
        bundleEligible: false
      },
      websiteTypes: ['service', 'booking'],
      conflicts: ['booking_system'],
      tags: ['scheduling', 'calendar']
    })
    
    // Content Features
    this.addFeature({
      id: 'blog_system',
      name: 'Blog System',
      description: 'Fully-featured blog with categories, tags, comments, and RSS feed',
      category: 'content',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['blog', 'business', 'portfolio'],
      tags: ['blog', 'content', 'cms']
    })
    
    this.addFeature({
      id: 'cms',
      name: 'Content Management System',
      description: 'Easy-to-use CMS for updating content without technical knowledge',
      category: 'content',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['cms', 'content', 'editing']
    })
    
    // Marketing Features
    this.addFeature({
      id: 'email_marketing',
      name: 'Email Marketing Integration',
      description: 'Connect with Mailchimp, Constant Contact, or other email platforms',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 400,
        bundleEligible: true
      },
      websiteTypes: ['all'],
      tags: ['email', 'marketing', 'newsletter']
    })
    
    this.addFeature({
      id: 'seo_optimization',
      name: 'Advanced SEO Optimization',
      description: 'Comprehensive SEO including keyword research, schema markup, and technical SEO',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 600,
        bundleEligible: false
      },
      websiteTypes: ['all'],
      tags: ['seo', 'search', 'optimization']
    })
    
    // Integration Features
    this.addFeature({
      id: 'api_integration',
      name: 'API Integration',
      description: 'Connect your website to third-party services via API (CRM, payment processors, etc.)',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 800,
        bundleEligible: false
      },
      websiteTypes: ['all'],
      tags: ['api', 'integration', 'third-party']
    })
    
    // Media Features
    this.addFeature({
      id: 'gallery',
      name: 'Photo Gallery',
      description: 'Beautiful image galleries with lightbox and filtering',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 300,
        bundleEligible: true
      },
      websiteTypes: ['portfolio', 'business'],
      tags: ['gallery', 'images', 'photos']
    })
    
    // Membership Features
    this.addFeature({
      id: 'membership_portal',
      name: 'Membership Portal',
      description: 'Secure area for members with content restriction and account management',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
        bundleEligible: false
      },
      websiteTypes: ['membership'],
      dependencies: ['user_authentication'],
      tags: ['membership', 'portal', 'access']
    })
    
    // Compliance Features
    this.addFeature({
      id: 'hipaa_compliance',
      name: 'HIPAA Compliance',
      description: 'HIPAA-compliant forms and data handling for healthcare',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 1000,
        bundleEligible: false
      },
      websiteTypes: ['healthcare', 'service'],
      tags: ['hipaa', 'compliance', 'healthcare']
    })
    
    // Performance Features
    this.addFeature({
      id: 'analytics_dashboard',
      name: 'Advanced Analytics Dashboard',
      description: 'Custom analytics dashboard showing key business metrics in real-time',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 700,
        bundleEligible: false
      },
      websiteTypes: ['all'],
      tags: ['analytics', 'dashboard', 'metrics']
    })
    
    // Add bundles
    this.bundles.push({
      id: 'ecommerce_essentials',
      name: 'E-commerce Essentials Bundle',
      category: 'ecommerce',
      features: ['shopping_cart', 'payment_processing', 'product_catalog'],
      discount: 300, // $300 off when all selected
      minSelection: 3
    })
    
    // Add conflicts
    this.conflicts.push({
      featureA: 'booking_system',
      featureB: 'appointment_scheduling',
      reason: 'Cannot have both booking system and appointment scheduling - they serve the same purpose',
      resolution: 'choose_one'
    })
  }
  
  private addFeature(feature: Feature) {
    this.features.set(feature.id, feature)
  }
  
  /**
   * Get features filtered by website type
   */
  getFeaturesByType(websiteType: string): Feature[] {
    return Array.from(this.features.values()).filter(feature =>
      feature.websiteTypes.includes('all') ||
      feature.websiteTypes.includes(websiteType.toLowerCase())
    )
  }
  
  /**
   * Get features organized by category
   */
  getFeaturesByCategory(
    websiteType: string
  ): Record<FeatureCategory, Feature[]> {
    const features = this.getFeaturesByType(websiteType)
    
    return features.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    }, {} as Record<FeatureCategory, Feature[]>)
  }
  
  /**
   * Get recommended features based on intelligence
   */
  getRecommendedFeatures(
    websiteType: string,
    intelligence: any
  ): string[] {
    const recommended: string[] = []
    
    // Apply recommendation rules based on website type and intelligence
    switch (websiteType.toLowerCase()) {
      case 'ecommerce':
        recommended.push('shopping_cart', 'payment_processing', 'product_catalog')
        if (intelligence.needsUserAccounts) {
          recommended.push('user_authentication')
        }
        break
        
      case 'portfolio':
        recommended.push('gallery', 'contact_form')
        break
        
      case 'blog':
        recommended.push('blog_system', 'cms')
        break
        
      case 'service':
        recommended.push('contact_form')
        if (intelligence.needsBooking) {
          recommended.push('booking_system')
        }
        break
    }
    
    return recommended
  }
  
  /**
   * Calculate pricing for selected features
   */
  calculatePricing(
    selectedFeatureIds: string[],
    packageTier: string
  ): FeaturePricingResult {
    const selectedFeatures = selectedFeatureIds
      .map(id => this.features.get(id))
      .filter(Boolean) as Feature[]
    
    let subtotal = 0
    const includedFeatures: Feature[] = []
    const addonFeatures: Feature[] = []
    const appliedBundles: FeatureBundle[] = []
    let bundleDiscount = 0
    
    // Categorize features
    selectedFeatures.forEach(feature => {
      if (feature.pricing.type === 'included' && 
          feature.pricing.tiers?.includes(packageTier)) {
        includedFeatures.push(feature)
      } else if (feature.pricing.type === 'addon') {
        addonFeatures.push(feature)
        subtotal += feature.pricing.addonPrice || 0
      }
    })
    
    // Check for bundle eligibility
    this.bundles.forEach(bundle => {
      const bundleFeatureIds = new Set(bundle.features)
      const selectedFromBundle = selectedFeatureIds.filter(id =>
        bundleFeatureIds.has(id)
      )
      
      if (selectedFromBundle.length >= bundle.minSelection) {
        appliedBundles.push(bundle)
        bundleDiscount += bundle.discount
      }
    })
    
    const total = Math.max(0, subtotal - bundleDiscount)
    
    return {
      subtotal,
      bundleDiscount,
      total,
      includedFeatures,
      addonFeatures,
      appliedBundles
    }
  }
  
  /**
   * Detect conflicts in selected features
   */
  detectConflicts(selectedFeatureIds: string[]): FeatureConflict[] {
    const selectedSet = new Set(selectedFeatureIds)
    
    return this.conflicts.filter(conflict =>
      selectedSet.has(conflict.featureA) && selectedSet.has(conflict.featureB)
    )
  }
  
  /**
   * Validate dependencies are met
   */
  validateDependencies(selectedFeatureIds: string[]): DependencyValidation {
    const selectedSet = new Set(selectedFeatureIds)
    const missingDependencies: Array<{
      feature: Feature
      missingDeps: Feature[]
    }> = []
    
    selectedFeatureIds.forEach(id => {
      const feature = this.features.get(id)
      if (feature?.dependencies) {
        const missing = feature.dependencies.filter(depId => !selectedSet.has(depId))
        if (missing.length > 0) {
          missingDependencies.push({
            feature,
            missingDeps: missing.map(id => this.features.get(id)!).filter(Boolean)
          })
        }
      }
    })
    
    return {
      valid: missingDependencies.length === 0,
      missingDependencies
    }
  }
  
  getFeature(id: string): Feature | undefined {
    return this.features.get(id)
  }
}

// Singleton instance
export const featureLibrary = new FeatureLibraryParser()

