'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeatureChip } from './FeatureChip'
import { featureLibrary } from '@/lib/features/featureLibraryParser'
import { recommendationEngine } from '@/lib/features/recommendationEngine'
import type { Feature, FeatureConflict } from '@/lib/features/featureLibraryParser'
import type { ConversationIntelligence } from '@/types/conversation'

interface FeatureChipGridProps {
  intelligence: ConversationIntelligence
  packageTier: string
  onSubmit: (selectedFeatureIds: string[]) => void
  isSubmitting?: boolean
  selectedWebsitePackage?: 'starter' | 'professional' | 'custom' | null
  selectedHostingPackage?: 'basic' | 'standard' | 'premium' | 'none'
}

export function FeatureChipGrid({
  intelligence,
  packageTier,
  onSubmit,
  isSubmitting = false,
  selectedWebsitePackage = null,
  selectedHostingPackage = 'none'
}: FeatureChipGridProps) {
  // Get features filtered by website type
  const websiteType = intelligence.websiteType || 'website'
  const featuresByCategory = useMemo(
    () => featureLibrary.getFeaturesByCategory(websiteType),
    [websiteType]
  )
  
  // Get recommended features
  const recommendedFeatureIds = useMemo(
    () => recommendationEngine.getRecommendations(intelligence),
    [intelligence]
  )
  
  // Selected features state (pre-select recommended)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(recommendedFeatureIds)
  )
  
  // Conflicts and dependencies
  const [conflicts, setConflicts] = useState<FeatureConflict[]>([])
  const [dependencyIssues, setDependencyIssues] = useState<string[]>([])
  
  // Calculate pricing including package base price
  const pricing = useMemo(() => {
    const featurePricing = featureLibrary.calculatePricing(
      Array.from(selectedFeatures),
      packageTier
    )
    
    // Add package base price
    const packageBasePrice = selectedWebsitePackage === 'starter' ? 2500 :
                             selectedWebsitePackage === 'professional' ? 4500 :
                             selectedWebsitePackage === 'custom' ? 6000 : 0
    
    // Add hosting annual cost
    const hostingPrices: Record<'basic' | 'standard' | 'premium', number> = {
      basic: 25,
      standard: 50,
      premium: 100
    }
    const hostingMonthly = selectedHostingPackage !== 'none' ? hostingPrices[selectedHostingPackage] : 0
    const hostingAnnual = hostingMonthly * 12
    
    return {
      ...featurePricing,
      packageBasePrice,
      hostingMonthly,
      hostingAnnual,
      total: packageBasePrice + featurePricing.total + hostingAnnual
    }
  }, [selectedFeatures, packageTier, selectedWebsitePackage, selectedHostingPackage])
  
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
          All available features are shown below. Recommended features are pre-selected.
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
          
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </Button>
        </div>
        
        {/* Breakdown */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm space-y-1">
          {pricing.packageBasePrice > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Website Package:</span>
              <span>${pricing.packageBasePrice.toLocaleString()}</span>
            </div>
          )}
          {pricing.addonFeatures.length > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Add-ons subtotal:</span>
              <span>${pricing.subtotal.toLocaleString()}</span>
            </div>
          )}
          {pricing.bundleDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Bundle discount:</span>
              <span>-${pricing.bundleDiscount.toLocaleString()}</span>
            </div>
          )}
          {pricing.hostingAnnual > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Hosting (Annual):</span>
              <span>${pricing.hostingAnnual.toLocaleString()}</span>
            </div>
          )}
        </div>
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
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : `Continue with ${selectedFeatures.size} features`}
        </Button>
      </div>
    </div>
  )
}

