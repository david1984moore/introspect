# Phase 6: Feature Chip Interface & Feature Library Integration
**Days 17-20 | Introspect V3 Implementation**

## Overview

Build the self-contained feature selection screen (Questions 10-12) that Phase 3 extensively defines: visual chip interface with comprehensive feature list, bundle pricing, conflict detection, and smart recommendations.

**Duration:** 3-4 days  
**Prerequisites:** Phases 1-5 complete  
**Deliverables:**
- FeatureChipGrid component with visual chip display
- Feature Library integration and parsing
- Bundle pricing calculator
- Conflict detection system
- Category-organized feature display
- Pre-selection of recommended features
- Integration with SCOPE.md Section 10

---

## Why This Phase Is Critical

### From Phase 3's Specification

Phase 3 is VERY explicit about feature selection:

> **CRITICAL: This is a SELF-CONTAINED FEATURE SELECTION SCREEN**
> **NOT a text question - this is a VISUAL CHIP INTERFACE**
> 
> - Features displayed as clickable chips with name, description, price
> - User can select multiple features by clicking chips
> - Features organized by category (Core, E-commerce, Marketing, etc.)
> - **NO text input on this screen - only chip selection**
> - **NO "Something else" option for features - comprehensive list provided**
> - **NO follow-up questions about features after selection**
> - Submit button becomes active after at least one selection
> - Once submitted, move to next topic - features are DONE

### The Psychology of Feature Selection

**Traditional feature selection problems:**
- ❌ Overwhelming text lists
- ❌ Unclear pricing (hidden costs)
- ❌ No guidance on what's needed vs. nice-to-have
- ❌ Follow-up questions create decision fatigue
- ❌ Users don't know what's possible

**Chip interface advantages:**
- ✅ Visual, scannable layout
- ✅ Transparent pricing (see cost immediately)
- ✅ Recommended features pre-selected
- ✅ Category organization aids understanding
- ✅ One-and-done (no follow-ups)
- ✅ Comprehensive options = no "other" needed

---

## Part 1: Feature Library Integration

### Understanding the Feature Library Structure

**Source:** `docs/APPLICREATIONS_FEATURE_LIBRARY_V1_1_COMPLETE.md`

The Feature Library contains:
- **200+ features** organized by category
- **Pricing for each feature** (included in tier vs. add-on cost)
- **Feature dependencies** (X requires Y)
- **Feature conflicts** (X incompatible with Y)
- **Bundle definitions** (select 3+ from category = discount)
- **Website-type filtering** (which features apply to which types)
- **Recommendation rules** (what to pre-select based on context)

### Feature Library Parser

**File:** `lib/features/featureLibraryParser.ts`

```typescript
import { readFileSync } from 'fs'
import { join } from 'path'

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

export class FeatureLibraryParser {
  private features: Map<string, Feature> = new Map()
  private bundles: FeatureBundle[] = []
  private conflicts: FeatureConflict[] = []
  
  constructor() {
    this.parseFeatureLibrary()
  }
  
  private parseFeatureLibrary() {
    // In production, this reads from the actual Feature Library markdown file
    // For now, implementing core parsing logic
    
    // Parse features section
    // Parse bundles section
    // Parse conflicts section
    
    // Example features (in production, parse from markdown)
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
      featureA: 'basic_contact_form',
      featureB: 'advanced_form_builder',
      reason: 'Cannot have both basic and advanced forms',
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
        recommended.push('gallery', 'contact_form', 'portfolio_showcase')
        break
        
      case 'blog':
        recommended.push('blog_system', 'comment_system', 'rss_feed')
        break
        
      case 'service':
        recommended.push('contact_form', 'service_pages')
        if (intelligence.needsBooking) {
          recommended.push('booking_system', 'calendar_integration')
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

// Singleton instance
export const featureLibrary = new FeatureLibraryParser()
```

---

## Part 2: Feature Chip Component

**File:** `components/conversation/FeatureChip.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import { Check, DollarSign, Info } from 'lucide-react'
import { useState } from 'react'
import type { Feature } from '@/lib/features/featureLibraryParser'

interface FeatureChipProps {
  feature: Feature
  isSelected: boolean
  isRecommended: boolean
  packageTier: string
  onToggle: (featureId: string) => void
  disabled?: boolean
}

export function FeatureChip({
  feature,
  isSelected,
  isRecommended,
  packageTier,
  onToggle,
  disabled = false
}: FeatureChipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Determine if feature is included in current package
  const isIncluded = 
    feature.pricing.type === 'included' &&
    feature.pricing.tiers?.includes(packageTier)
  
  const priceDisplay = isIncluded
    ? 'Included'
    : feature.pricing.addonPrice
    ? `+$${feature.pricing.addonPrice.toLocaleString()}`
    : 'Custom'
  
  return (
    <motion.button
      onClick={() => !disabled && onToggle(feature.id)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
      `}
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${feature.name}. ${feature.description}. ${priceDisplay}`}
    >
      {/* Recommended badge */}
      {isRecommended && !isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
          Recommended
        </div>
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
      
      <div className="flex flex-col gap-2">
        {/* Feature name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={`
            font-medium text-sm text-left
            ${isSelected ? 'text-gray-900' : 'text-gray-700'}
          `}>
            {feature.name}
          </h3>
          
          {/* Info icon for tooltip */}
          {feature.dependencies && feature.dependencies.length > 0 && (
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </div>
        
        {/* Feature description */}
        <p className="text-xs text-gray-600 text-left leading-relaxed">
          {feature.description}
        </p>
        
        {/* Price indicator */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className={`
            text-xs font-medium
            ${isIncluded ? 'text-green-600' : 'text-gray-900'}
          `}>
            {priceDisplay}
          </span>
          
          {feature.pricing.bundleEligible && (
            <span className="text-xs text-primary">
              Bundle eligible
            </span>
          )}
        </div>
      </div>
      
      {/* Tooltip for dependencies */}
      {showTooltip && feature.dependencies && feature.dependencies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10"
        >
          <p className="font-medium mb-1">Requires:</p>
          <ul className="list-disc list-inside">
            {feature.dependencies.map(depId => (
              <li key={depId}>{depId.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.button>
  )
}
```

---

## Part 3: Feature Chip Grid Component

**File:** `components/conversation/FeatureChipGrid.tsx`

```typescript
'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { FeatureChip } from './FeatureChip'
import { featureLibrary } from '@/lib/features/featureLibraryParser'
import type { Feature, FeatureConflict } from '@/lib/features/featureLibraryParser'
import type { ConversationIntelligence } from '@/types/conversation'

interface FeatureChipGridProps {
  intelligence: ConversationIntelligence
  packageTier: string
  onSubmit: (selectedFeatureIds: string[]) => void
  isSubmitting?: boolean
}

export function FeatureChipGrid({
  intelligence,
  packageTier,
  onSubmit,
  isSubmitting = false
}: FeatureChipGridProps) {
  // Get features filtered by website type
  const websiteType = intelligence.websiteType || 'website'
  const featuresByCategory = useMemo(
    () => featureLibrary.getFeaturesByCategory(websiteType),
    [websiteType]
  )
  
  // Get recommended features
  const recommendedFeatureIds = useMemo(
    () => featureLibrary.getRecommendedFeatures(websiteType, intelligence),
    [websiteType, intelligence]
  )
  
  // Selected features state (pre-select recommended)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(recommendedFeatureIds)
  )
  
  // Conflicts and dependencies
  const [conflicts, setConflicts] = useState<FeatureConflict[]>([])
  const [dependencyIssues, setDependencyIssues] = useState<string[]>([])
  
  // Calculate pricing
  const pricing = useMemo(() => {
    return featureLibrary.calculatePricing(
      Array.from(selectedFeatures),
      packageTier
    )
  }, [selectedFeatures, packageTier])
  
  // Validate selection whenever it changes
  useEffect(() => {
    const selectedArray = Array.from(selectedFeatures)
    
    // Check conflicts
    const detectedConflicts = featureLibrary.detectConflicts(selectedArray)
    setConflicts(detectedConflicts)
    
    // Check dependencies
    const validation = featureLibrary.validateDependencies(selectedArray)
    if (!validation.valid) {
      const issues = validation.missingDependencies.map(
        ({ feature, missingDeps }) =>
          `${feature.name} requires: ${missingDeps.map(d => d.name).join(', ')}`
      )
      setDependencyIssues(issues)
    } else {
      setDependencyIssues([])
    }
  }, [selectedFeatures])
  
  const handleToggle = (featureId: string) => {
    setSelectedFeatures(prev => {
      const next = new Set(prev)
      if (next.has(featureId)) {
        next.delete(featureId)
      } else {
        next.add(featureId)
      }
      return next
    })
  }
  
  const handleSubmit = () => {
    if (conflicts.length > 0 || dependencyIssues.length > 0) {
      // Show validation errors - don't allow submission
      return
    }
    
    if (selectedFeatures.size > 0) {
      onSubmit(Array.from(selectedFeatures))
    }
  }
  
  const canSubmit = 
    selectedFeatures.size > 0 &&
    conflicts.length === 0 &&
    dependencyIssues.length === 0 &&
    !isSubmitting
  
  // Category display order
  const categoryOrder: string[] = [
    'core',
    'ecommerce',
    'marketing',
    'content',
    'booking',
    'membership',
    'integration',
    'media',
    'compliance',
    'performance'
  ]
  
  const categoryLabels: Record<string, string> = {
    core: 'Core Features',
    ecommerce: 'E-commerce',
    marketing: 'Marketing & SEO',
    content: 'Content Management',
    booking: 'Booking & Scheduling',
    membership: 'Membership & Access',
    integration: 'Integrations',
    media: 'Media & Interactive',
    compliance: 'Security & Compliance',
    performance: 'Performance & Analytics'
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Select Your Features
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the features you need for your {websiteType} website. 
          We've pre-selected recommended features based on your requirements.
        </p>
      </div>
      
      {/* Pricing summary (sticky on scroll) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-20 mb-8 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">
              {selectedFeatures.size} {selectedFeatures.size === 1 ? 'feature' : 'features'} selected
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${pricing.total.toLocaleString()}
              </span>
              {pricing.bundleDiscount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  (${pricing.bundleDiscount} bundle savings!)
                </span>
              )}
            </div>
            {pricing.appliedBundles.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {pricing.appliedBundles.map(b => b.name).join(', ')}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all
              ${canSubmit
                ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </button>
        </div>
        
        {/* Breakdown */}
        {pricing.addonFeatures.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Add-ons subtotal:</span>
              <span>${pricing.subtotal.toLocaleString()}</span>
            </div>
            {pricing.bundleDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bundle discount:</span>
                <span>-${pricing.bundleDiscount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Validation alerts */}
      <AnimatePresence>
        {conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900 mb-2">Feature Conflicts Detected</h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {conflicts.map((conflict, idx) => (
                    <li key={idx}>
                      {featureLibrary.getFeature(conflict.featureA)?.name} and{' '}
                      {featureLibrary.getFeature(conflict.featureB)?.name}: {conflict.reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        
        {dependencyIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Missing Dependencies</h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {dependencyIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feature categories */}
      <div className="space-y-8">
        {categoryOrder.map(categoryKey => {
          const features = featuresByCategory[categoryKey as keyof typeof featuresByCategory]
          if (!features || features.length === 0) return null
          
          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {categoryLabels[categoryKey] || categoryKey}
                <span className="text-sm font-normal text-gray-500">
                  ({features.length})
                </span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <FeatureChip
                      feature={feature}
                      isSelected={selectedFeatures.has(feature.id)}
                      isRecommended={recommendedFeatureIds.includes(feature.id)}
                      packageTier={packageTier}
                      onToggle={handleToggle}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Bottom submit (for mobile scroll) */}
      <div className="mt-8 pb-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            w-full sm:w-auto px-12 py-4 rounded-lg font-medium text-lg transition-all
            ${canSubmit
              ? 'bg-primary text-white hover:bg-primary-dark shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          `}
        >
          {isSubmitting ? 'Submitting...' : `Continue with ${selectedFeatures.size} features`}
        </button>
      </div>
    </div>
  )
}
```

---

## Part 4: Integration with Conversation Flow

**File:** `app/conversation/[id]/page.tsx` (updated)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { QuestionDisplay } from '@/components/conversation/QuestionDisplay'
import { FeatureChipGrid } from '@/components/conversation/FeatureChipGrid'
import { useConversationStore } from '@/lib/stores/conversationStore'

export default function ConversationPage({ params }: { params: { id: string } }) {
  const { 
    intelligence, 
    currentQuestion, 
    questionNumber,
    packageTier, // Determined by Phase 3 orchestration
    submitAnswer,
    submitFeatureSelection 
  } = useConversationStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Determine if we're in feature selection mode (Questions 10-12)
  const isFeatureSelection = 
    questionNumber >= 10 && 
    questionNumber <= 12 &&
    currentQuestion?.inputType === 'chips'
  
  const handleAnswer = async (value: string) => {
    setIsSubmitting(true)
    try {
      await submitAnswer({
        questionId: currentQuestion.id,
        value,
        timestamp: new Date().toISOString(),
        questionNumber
      })
    } catch (error) {
      console.error('Failed to submit answer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleFeatureSelection = async (selectedFeatureIds: string[]) => {
    setIsSubmitting(true)
    try {
      // Submit feature selection as a special answer type
      await submitFeatureSelection({
        questionId: 'feature_selection',
        selectedFeatures: selectedFeatureIds,
        timestamp: new Date().toISOString(),
        questionNumber
      })
    } catch (error) {
      console.error('Failed to submit features:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!currentQuestion) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {isFeatureSelection ? (
        // Feature chip interface (Questions 10-12)
        <FeatureChipGrid
          intelligence={intelligence}
          packageTier={packageTier}
          onSubmit={handleFeatureSelection}
          isSubmitting={isSubmitting}
        />
      ) : (
        // Regular question display (all other questions)
        <QuestionDisplay
          question={currentQuestion}
          intelligence={intelligence}
          questionNumber={questionNumber}
          onAnswer={handleAnswer}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
```

---

## Part 5: Store Integration

**File:** `lib/stores/conversationStore.ts` (additions)

```typescript
interface ConversationStore {
  // ... existing state
  packageTier: 'Starter' | 'Professional' | 'Custom'
  selectedFeatures: string[]
  featurePricing: FeaturePricingResult | null
  
  // ... existing actions
  submitFeatureSelection: (selection: FeatureSelection) => Promise<void>
  calculatePackageTier: () => void
}

interface FeatureSelection {
  questionId: string
  selectedFeatures: string[]
  timestamp: string
  questionNumber: number
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // ... existing state
  packageTier: 'Professional', // Default, calculated dynamically
  selectedFeatures: [],
  featurePricing: null,
  
  // Calculate package tier based on intelligence
  calculatePackageTier: () => {
    const intelligence = get().intelligence
    
    // Simple logic (in production, this would be more sophisticated)
    if (intelligence.budgetRange === 'under_5k') {
      set({ packageTier: 'Starter' })
    } else if (intelligence.budgetRange === '5k_to_10k') {
      set({ packageTier: 'Professional' })
    } else {
      set({ packageTier: 'Custom' })
    }
  },
  
  // Submit feature selection
  submitFeatureSelection: async (selection: FeatureSelection) => {
    const { selectedFeatures } = selection
    const packageTier = get().packageTier
    
    // Calculate pricing
    const pricing = featureLibrary.calculatePricing(selectedFeatures, packageTier)
    
    // Update state
    set({
      selectedFeatures,
      featurePricing: pricing,
      intelligence: {
        ...get().intelligence,
        selectedFeatures,
        estimatedCost: pricing.total
      }
    })
    
    // Record answer
    set({
      answeredQuestions: [
        ...get().answeredQuestions,
        {
          questionId: selection.questionId,
          value: selectedFeatures.join(','),
          optionLabel: `${selectedFeatures.length} features selected`,
          timestamp: selection.timestamp,
          questionNumber: selection.questionNumber
        }
      ]
    })
    
    // Continue orchestration (feature selection completes Section 10)
    await get().continueOrchestration({
      action: 'feature_selection_complete',
      selectedFeatures,
      pricing
    })
  },
  
  // ... rest of store
}))
```

---

## Part 6: Feature Recommendation Rules

**File:** `lib/features/recommendationEngine.ts`

```typescript
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
      recommendations.push('user_authentication', 'user_profiles')
    }
    
    if (intelligence.needsCMS) {
      recommendations.push('content_management', 'wysiwyg_editor')
    }
    
    if (intelligence.needsSearch) {
      recommendations.push('site_search', 'advanced_filters')
    }
    
    if (intelligence.primaryGoal === 'lead_generation') {
      recommendations.push('contact_form', 'lead_capture', 'email_integration')
    }
    
    if (intelligence.primaryGoal === 'ecommerce') {
      recommendations.push('shopping_cart', 'payment_processing', 'product_catalog')
    }
    
    if (intelligence.targetAudience?.includes('mobile')) {
      recommendations.push('pwa_support', 'mobile_optimization')
    }
    
    if (intelligence.industry === 'healthcare') {
      recommendations.push('hipaa_compliance', 'secure_forms')
    }
    
    if (intelligence.industry === 'ecommerce') {
      recommendations.push('ssl_certificate', 'pci_compliance')
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
        'inventory_management',
        'order_management'
      ],
      portfolio: [
        'gallery',
        'portfolio_showcase',
        'contact_form',
        'project_filtering'
      ],
      blog: [
        'blog_system',
        'comment_system',
        'social_sharing',
        'rss_feed',
        'author_profiles'
      ],
      service: [
        'contact_form',
        'service_pages',
        'testimonials',
        'quote_requests'
      ],
      corporate: [
        'about_pages',
        'team_directory',
        'news_blog',
        'careers_portal',
        'investor_relations'
      ],
      membership: [
        'user_authentication',
        'membership_tiers',
        'content_restriction',
        'subscription_management'
      ],
      booking: [
        'booking_system',
        'calendar_integration',
        'payment_processing',
        'automated_confirmations'
      ]
    }
    
    return baseRecommendations[websiteType] || ['contact_form', 'analytics']
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
      lead_generation: ['contact_form', 'lead_capture', 'email_integration'],
      ecommerce: ['shopping_cart', 'payment_processing', 'product_catalog'],
      brand_awareness: ['social_sharing', 'seo_optimization', 'blog_system'],
      customer_service: ['live_chat', 'help_center', 'faq_system']
    }
    
    return goalFeatureMap[goal]?.includes(feature.id) || false
  }
}

export const recommendationEngine = new FeatureRecommendationEngine()
```

---

## Part 7: Testing Requirements

### Unit Tests

```typescript
// __tests__/FeatureChip.test.tsx
describe('FeatureChip', () => {
  test('renders feature details correctly', () => {
    const mockFeature: Feature = {
      id: 'test_feature',
      name: 'Test Feature',
      description: 'A test feature description',
      category: 'core',
      pricing: { type: 'addon', addonPrice: 500 },
      websiteTypes: ['all']
    }
    
    const { getByText } = render(
      <FeatureChip
        feature={mockFeature}
        isSelected={false}
        isRecommended={false}
        packageTier="Professional"
        onToggle={() => {}}
      />
    )
    
    expect(getByText('Test Feature')).toBeInTheDocument()
    expect(getByText('A test feature description')).toBeInTheDocument()
    expect(getByText('+$500')).toBeInTheDocument()
  })
  
  test('shows "Included" for included features', () => {
    const mockFeature: Feature = {
      id: 'included_feature',
      name: 'Included Feature',
      description: 'Feature included in package',
      category: 'core',
      pricing: { 
        type: 'included', 
        tiers: ['Starter', 'Professional', 'Custom'] 
      },
      websiteTypes: ['all']
    }
    
    const { getByText } = render(
      <FeatureChip
        feature={mockFeature}
        isSelected={false}
        isRecommended={false}
        packageTier="Professional"
        onToggle={() => {}}
      />
    )
    
    expect(getByText('Included')).toBeInTheDocument()
  })
  
  test('displays recommended badge', () => {
    const { getByText } = render(
      <FeatureChip
        feature={mockFeature}
        isSelected={false}
        isRecommended={true}
        packageTier="Professional"
        onToggle={() => {}}
      />
    )
    
    expect(getByText('Recommended')).toBeInTheDocument()
  })
  
  test('shows check mark when selected', () => {
    const { container } = render(
      <FeatureChip
        feature={mockFeature}
        isSelected={true}
        isRecommended={false}
        packageTier="Professional"
        onToggle={() => {}}
      />
    )
    
    // Check icon should be present
    const checkIcon = container.querySelector('svg')
    expect(checkIcon).toBeInTheDocument()
  })
})
```

### Integration Tests

```typescript
// __tests__/FeatureChipGrid.integration.test.tsx
describe('FeatureChipGrid Integration', () => {
  test('pre-selects recommended features', () => {
    const mockIntelligence: ConversationIntelligence = {
      websiteType: 'ecommerce',
      // ... other intelligence
    }
    
    const { container } = render(
      <FeatureChipGrid
        intelligence={mockIntelligence}
        packageTier="Professional"
        onSubmit={() => {}}
      />
    )
    
    // Should have pre-selected e-commerce essentials
    const selectedChips = container.querySelectorAll('[aria-checked="true"]')
    expect(selectedChips.length).toBeGreaterThan(0)
  })
  
  test('detects feature conflicts', async () => {
    const { getByText, getByRole } = render(
      <FeatureChipGrid
        intelligence={mockIntelligence}
        packageTier="Professional"
        onSubmit={() => {}}
      />
    )
    
    // Select conflicting features
    fireEvent.click(getByText('Basic Contact Form'))
    fireEvent.click(getByText('Advanced Form Builder'))
    
    // Should show conflict warning
    await waitFor(() => {
      expect(getByText(/Feature Conflicts Detected/i)).toBeInTheDocument()
    })
    
    // Submit button should be disabled
    const submitButton = getByRole('button', { name: /Continue/i })
    expect(submitButton).toBeDisabled()
  })
  
  test('calculates bundle pricing correctly', () => {
    const { getByText } = render(
      <FeatureChipGrid
        intelligence={mockIntelligence}
        packageTier="Professional"
        onSubmit={() => {}}
      />
    )
    
    // Select all features in a bundle
    fireEvent.click(getByText('Shopping Cart'))
    fireEvent.click(getByText('Payment Processing'))
    fireEvent.click(getByText('Product Catalog'))
    
    // Should show bundle discount
    expect(getByText(/bundle savings/i)).toBeInTheDocument()
  })
})
```

### E2E Tests

```typescript
// e2e/feature-selection.spec.ts
describe('Feature Selection Flow', () => {
  test('completes full feature selection', async () => {
    await page.goto('/conversation/test-session-id')
    
    // Navigate to feature selection (question 10)
    // ... answer previous questions
    
    // Should see feature chip grid
    await expect(page.locator('h2', { hasText: 'Select Your Features' })).toBeVisible()
    
    // Should have recommended features pre-selected
    const selectedCount = await page.locator('[aria-checked="true"]').count()
    expect(selectedCount).toBeGreaterThan(0)
    
    // Select additional feature
    await page.click('text=Email Integration')
    
    // Should update pricing
    const pricingSection = page.locator('text=/\\$[0-9,]+/')
    await expect(pricingSection).toBeVisible()
    
    // Submit selection
    await page.click('button:has-text("Continue")')
    
    // Should advance to next question
    await expect(page.locator('text=/Question 13/i')).toBeVisible()
  })
})
```

---

## Part 8: Accessibility

### ARIA Labels

```typescript
// Feature chip
<button
  role="checkbox"
  aria-checked={isSelected}
  aria-label={`${feature.name}. ${feature.description}. ${priceDisplay}`}
  aria-describedby={feature.dependencies ? 'feature-dependencies' : undefined}
>
  {/* Content */}
</button>

// Grid container
<div role="region" aria-label="Feature selection">
  {/* Categories and chips */}
</div>
```

### Keyboard Navigation

```typescript
// Full keyboard support
- Tab: Navigate between chips
- Space/Enter: Toggle selection
- Arrow keys: Navigate within category (optional enhancement)
- Escape: Clear current category (optional)

// Focus management
useEffect(() => {
  // When conflicts appear, focus the alert
  if (conflicts.length > 0 && alertRef.current) {
    alertRef.current.focus()
  }
}, [conflicts])
```

### Screen Reader Announcements

```typescript
// Live region for selection count
<div aria-live="polite" className="sr-only">
  {selectedFeatures.size} features selected
</div>

// Live region for pricing updates
<div aria-live="polite" className="sr-only">
  Total cost: ${pricing.total}
</div>

// Conflict announcements
<div role="alert" aria-live="assertive">
  {conflicts.length > 0 && `${conflicts.length} conflicts detected`}
</div>
```

---

## Part 9: Performance Optimization

### Virtualization for Large Feature Lists

```typescript
// If feature library grows to 100+ features per category
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedFeatureList({ features }: { features: Feature[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: features.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Approximate chip height
  })
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <FeatureChip feature={features[virtualItem.index]} {...props} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Memoization

```typescript
// Memoize expensive calculations
const featuresByCategory = useMemo(
  () => featureLibrary.getFeaturesByCategory(websiteType),
  [websiteType]
)

const pricing = useMemo(() => {
  return featureLibrary.calculatePricing(
    Array.from(selectedFeatures),
    packageTier
  )
}, [selectedFeatures, packageTier])

// Memoize components
export const FeatureChip = memo(FeatureChip, (prev, next) => {
  return (
    prev.isSelected === next.isSelected &&
    prev.isRecommended === next.isRecommended &&
    prev.feature.id === next.feature.id
  )
})
```

---

## Part 10: Success Criteria

### Functional Requirements
- ✅ Feature chips display with name, description, price
- ✅ Chips organized by category
- ✅ Multi-select works smoothly
- ✅ Recommended features pre-selected
- ✅ NO "Something else" option (comprehensive list)
- ✅ Pricing calculates accurately with bundle discounts
- ✅ Conflict detection prevents invalid selections
- ✅ Dependency validation ensures complete selections
- ✅ Submit button only active when valid selection
- ✅ Marks SCOPE.md Section 10 complete atomically

### User Experience
- ✅ Visual layout is scannable and organized
- ✅ Categories make sense for website type
- ✅ Pricing is transparent (no hidden costs)
- ✅ Recommended badges guide decisions subtly
- ✅ Conflicts explained clearly with resolution path
- ✅ Bundle savings celebrated visually
- ✅ Sticky pricing summary shows progress
- ✅ Mobile-responsive grid layout

### Integration
- ✅ Integrates with Phase 3's orchestration
- ✅ Feature Library parses correctly
- ✅ Recommendation engine uses intelligence
- ✅ Selected features store in conversation state
- ✅ Pricing syncs with SCOPE.md Section 13
- ✅ No follow-up questions after submission
- ✅ Moves to next SCOPE.md section smoothly

### Performance
- ✅ Initial render < 200ms (50+ features)
- ✅ Selection response immediate (< 16ms)
- ✅ Pricing calculation < 50ms
- ✅ Conflict detection < 100ms
- ✅ Smooth 60fps animations
- ✅ No layout shifts during interaction

### Design System Compliance
- ✅ 8-point spacing grid
- ✅ Perfect Fourth typography scale
- ✅ OKLCH color system
- ✅ Framer Motion animations
- ✅ Consistent with Phases 4-5 UI

### Accessibility
- ✅ WCAG 2.1 Level AA compliant
- ✅ Full keyboard navigation
- ✅ Screen reader support with live regions
- ✅ ARIA roles and labels
- ✅ Touch targets 44px minimum
- ✅ Color contrast ratios met

---

## Part 11: Common Pitfalls to Avoid

### ❌ Anti-Pattern 1: Including "Something Else"
```typescript
// WRONG - Phase 3 explicitly forbids this
const options = [
  ...features,
  { id: 'other', name: 'Something else', allowText: true }
]

// CORRECT - Comprehensive list only
const options = features // No "other" option
```

### ❌ Anti-Pattern 2: Follow-Up Questions
```typescript
// WRONG - Asking about features after selection
// User selects "User Authentication"
// Next question: "What type of authentication?"

// CORRECT - All authentication types are SEPARATE features
// User can select:
// - Email/Password Authentication
// - Social Login Authentication  
// - Magic Link Authentication
// Feature selection is ATOMIC - once submitted, DONE
```

### ❌ Anti-Pattern 3: Hidden Pricing
```typescript
// WRONG - Price not visible until selection
<FeatureChip name="Shopping Cart" />
// Price shown only after clicking

// CORRECT - Transparent pricing upfront
<FeatureChip 
  name="Shopping Cart"
  price="+$1,200"
  visible={true}
/>
```

### ❌ Anti-Pattern 4: Allowing Invalid Selections
```typescript
// WRONG - Let users submit conflicting features
if (selectedFeatures.size > 0) {
  onSubmit(selectedFeatures) // No validation!
}

// CORRECT - Validate before allowing submission
const conflicts = detectConflicts(selectedFeatures)
const dependencies = validateDependencies(selectedFeatures)

if (selectedFeatures.size > 0 && 
    conflicts.length === 0 && 
    dependencies.valid) {
  onSubmit(selectedFeatures)
}
```

---

## Part 12: Integration Checklist

Before moving to Phase 7, verify:

### Feature Library
- [ ] Feature Library markdown parsed correctly
- [ ] All features loaded with complete data
- [ ] Pricing information accurate
- [ ] Bundle definitions working
- [ ] Conflict rules enforced
- [ ] Dependency validation functional

### UI Components
- [ ] FeatureChip renders all states correctly
- [ ] FeatureChipGrid organizes by category
- [ ] Pre-selection of recommended features works
- [ ] Pricing summary updates in real-time
- [ ] Conflict alerts display correctly
- [ ] Dependency warnings show properly

### State Management
- [ ] Selected features store in conversation state
- [ ] Pricing calculations sync to store
- [ ] Feature selection completes Section 10
- [ ] No follow-up questions after submission
- [ ] Intelligence updates with feature data

### Integration
- [ ] Replaces regular question at Questions 10-12
- [ ] Integrates with conversation flow
- [ ] Submits to Claude orchestration
- [ ] Advances to next SCOPE.md section
- [ ] Works with all website types

### Testing
- [ ] Unit tests pass for all components
- [ ] Integration tests pass for feature selection flow
- [ ] E2E tests pass for complete journey
- [ ] Visual regression tests pass
- [ ] Accessibility audit passes

---

## Next Steps

After Phase 6 completion:

1. **Phase 7**: SCOPE.md Progress Tracking UI
   - Visual progress through 14 sections
   - Section-by-section breakdown
   - Adaptive completion percentage

2. **Phase 8**: Validation & Confirmation Screens
   - Claude's understanding validation
   - Feature conflict resolution UI
   - Assumption clarification

3. **Phase 9**: Complete SCOPE.md Generation
   - Implement all 14 sections
   - Feature Library pricing integration
   - Document validation

---

## Files to Create

```
src/
├── lib/
│   └── features/
│       ├── featureLibraryParser.ts        ← NEW
│       └── recommendationEngine.ts        ← NEW
│
├── components/
│   └── conversation/
│       ├── FeatureChip.tsx                ← NEW
│       ├── FeatureChipGrid.tsx            ← NEW
│       ├── OptionSelector.tsx             ← EXISTS (Phase 5)
│       └── QuestionDisplay.tsx            ← EXISTS (Phase 5)
│
├── lib/
│   └── stores/
│       └── conversationStore.ts           ← EXTEND
│
└── __tests__/
    ├── FeatureChip.test.tsx               ← NEW
    ├── FeatureChipGrid.test.tsx           ← NEW
    ├── featureLibraryParser.test.ts       ← NEW
    ├── recommendationEngine.test.ts       ← NEW
    └── e2e/
        └── feature-selection.spec.ts      ← NEW
```

---

**Phase 6 implements the self-contained feature selection screen that Phase 3 extensively describes. This is where users see comprehensive options, transparent pricing, and bundle savings - completing SCOPE.md Section 10 in a single atomic interaction.**

Ready to build? Start with featureLibraryParser.ts to understand the data structure, then FeatureChip.tsx, then FeatureChipGrid.tsx, and finally integration with the conversation flow.
