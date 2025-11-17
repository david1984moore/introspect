'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeatureChip } from './FeatureChip'
import { ScopeProgressPanel } from './ScopeProgressPanel'
import { featureLibrary } from '@/lib/features/featureLibraryParser'
import { recommendationEngine } from '@/lib/features/recommendationEngine'
import type { Feature, FeatureConflict } from '@/lib/features/featureLibraryParser'
import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeProgress } from '@/types/scopeProgress'
import type { ConversationFact } from '@/types/conversation'

// Feature selection limits per package
const PACKAGE_FEATURE_LIMITS: Record<'starter' | 'professional' | 'custom' | null, number | null> = {
  starter: 3,
  professional: 5,
  custom: null, // Unlimited
  null: null
}

interface FeatureChipGridProps {
  intelligence: ConversationIntelligence
  packageTier: string
  onSubmit: (selectedFeatureIds: string[]) => void
  isSubmitting?: boolean
  selectedWebsitePackage?: 'starter' | 'professional' | 'custom' | null
  selectedHostingPackage?: 'basic' | 'standard' | 'premium' | 'none'
  scopeProgress?: ScopeProgress
  answeredQuestions?: ConversationFact[]
}

export function FeatureChipGrid({
  intelligence,
  packageTier,
  onSubmit,
  isSubmitting = false,
  selectedWebsitePackage = null,
  selectedHostingPackage = 'none',
  scopeProgress,
  answeredQuestions = []
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
    const packageBasePrice = selectedWebsitePackage === 'starter' ? 1900 :
                             selectedWebsitePackage === 'professional' ? 3250 :
                             selectedWebsitePackage === 'custom' ? 5250 : 0
    
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
  
  // Get feature selection limit for current package
  const maxFeatureSelections = useMemo(() => {
    return selectedWebsitePackage ? PACKAGE_FEATURE_LIMITS[selectedWebsitePackage] : null
  }, [selectedWebsitePackage])
  
  // Check if limit is reached
  const isLimitReached = useMemo(() => {
    if (maxFeatureSelections === null) return false // Unlimited
    return selectedFeatures.size >= maxFeatureSelections
  }, [selectedFeatures.size, maxFeatureSelections])
  
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
        // Removing a feature - always allowed
        next.delete(featureId)
      } else {
        // Adding a feature - check limit
        if (maxFeatureSelections !== null && next.size >= maxFeatureSelections) {
          // Limit reached - don't add
          return prev
        }
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
    
    // Validate feature limit
    if (maxFeatureSelections !== null && selectedFeatures.size > maxFeatureSelections) {
      // This shouldn't happen due to UI enforcement, but check anyway
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
    (maxFeatureSelections === null || selectedFeatures.size <= maxFeatureSelections) &&
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
  
  // State for calculator expansion
  const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(true)

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column - Progress Panel (1/3) */}
        <div className="lg:col-span-4">
          {scopeProgress && (
            <div className="sticky top-4">
              <ScopeProgressPanel
                progress={scopeProgress}
                variant="compact"
                collapsible
                defaultExpanded={false}
                answeredQuestions={answeredQuestions}
              />
            </div>
          )}
        </div>

        {/* Middle Column - Features (1/3) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Validation alerts */}
          <AnimatePresence>
            {isLimitReached && maxFeatureSelections !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-1">Feature Selection Limit Reached</h3>
                    <p className="text-xs text-blue-700">
                      You've reached the maximum of {maxFeatureSelections} feature selection{maxFeatureSelections !== 1 ? 's' : ''} for the {selectedWebsitePackage === 'starter' ? 'Starter' : 'Professional'} package.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {conflicts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-900 mb-1">Feature Conflicts Detected</h3>
                    <ul className="space-y-1 text-xs text-red-700">
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
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-900 mb-1">Missing Dependencies</h3>
                    <ul className="space-y-1 text-xs text-yellow-700">
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
          <div className="space-y-4">
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
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {categoryLabels[categoryKey] || categoryKey}
                    <span className="text-xs font-normal text-gray-500">
                      ({features.length})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {features.map((feature, idx) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <FeatureChip
                          feature={feature}
                          isSelected={selectedFeatures.has(feature.id)}
                          isRecommended={recommendedFeatureIds.includes(feature.id)}
                          packageTier={packageTier}
                          onToggle={handleToggle}
                          disabled={isSubmitting || (isLimitReached && !selectedFeatures.has(feature.id))}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Column - Calculator (1/3) */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-4 z-20"
          >
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Collapsible header */}
              <button
                onClick={() => setIsCalculatorExpanded(!isCalculatorExpanded)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-600 mb-0.5">
                    {selectedFeatures.size} {selectedFeatures.size === 1 ? 'feature' : 'features'} selected
                    {maxFeatureSelections !== null && (
                      <span className="text-gray-500"> / {maxFeatureSelections} max</span>
                    )}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ${pricing.total.toLocaleString()}
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isCalculatorExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {/* Expandable content */}
              <AnimatePresence>
                {isCalculatorExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-3 border-t border-gray-200">
                      {pricing.bundleDiscount > 0 && (
                        <div className="pt-3">
                          <div className="text-xs text-green-600 font-medium mb-1">
                            ${pricing.bundleDiscount.toLocaleString()} bundle savings!
                          </div>
                          {pricing.appliedBundles.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {pricing.appliedBundles.map(b => b.name).join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Breakdown */}
                      <div className="space-y-1.5 text-xs">
                        {pricing.packageBasePrice > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Website Package:</span>
                            <span>${pricing.packageBasePrice.toLocaleString()}</span>
                          </div>
                        )}
                        {pricing.addonFeatures.length > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Add-ons:</span>
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
                      
                      {/* Continue button */}
                      <div className="pt-2">
                        <Button
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                          className="w-full"
                          size="sm"
                        >
                          {isSubmitting ? 'Submitting...' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

