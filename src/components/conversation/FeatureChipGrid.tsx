'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, ChevronDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FeatureChip } from './FeatureChip'
import { ScopeProgressPanel } from './ScopeProgressPanel'
import { featureLibrary } from '@/lib/features/featureLibraryParser'
import { recommendationEngine } from '@/lib/features/recommendationEngine'
import { useConversationStore } from '@/stores/conversationStore'
import type { Feature, FeatureConflict } from '@/lib/features/featureLibraryParser'
import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeProgress } from '@/types/scopeProgress'
import type { ConversationFact } from '@/types/conversation'

// Feature selection limits per package
const PACKAGE_FEATURE_LIMITS: Record<'starter' | 'professional' | 'custom', number | null> = {
  starter: 3,
  professional: 5,
  custom: null, // Unlimited
}

interface FeatureChipGridProps {
  intelligence: ConversationIntelligence
  packageTier: string
  onSubmit: (selectedFeatureIds: string[]) => Promise<void>
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
  
  // Get package tier name in correct format
  const packageTierName = useMemo(() => {
    return selectedWebsitePackage === 'starter' ? 'Starter' :
           selectedWebsitePackage === 'professional' ? 'Professional' :
           selectedWebsitePackage === 'custom' ? 'Custom' : 
           packageTier.charAt(0).toUpperCase() + packageTier.slice(1).toLowerCase()
  }, [selectedWebsitePackage, packageTier])
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('')
  
  // State for custom feature input
  const [customFeatureDescription, setCustomFeatureDescription] = useState('')
  const [showCustomFeatureInput, setShowCustomFeatureInput] = useState(false)
  
  // Get features included in base package for current package tier
  const includedFeatureIds = useMemo(() => {
    const allFeatures = Object.values(featuresByCategory).flat()
    
    if (!packageTierName) return []
    
    return allFeatures
      .filter(feature => 
        feature.pricing.type === 'included' && 
        feature.pricing.tiers?.includes(packageTierName)
      )
      .map(feature => feature.id)
  }, [featuresByCategory, packageTierName])
  
  // Get included features for display in calculator
  const includedFeatures = useMemo(() => {
    const allFeatures = Object.values(featuresByCategory).flat()
    
    if (!packageTierName) return []
    
    return allFeatures.filter(feature => 
      feature.pricing.type === 'included' && 
      feature.pricing.tiers?.includes(packageTierName)
    )
  }, [featuresByCategory, packageTierName])
  
  // Search synonyms/aliases mapping for better search matching
  const searchSynonyms: Record<string, string[]> = {
    'user authentication': ['user authentication', 'authentication', 'login', 'user login', 'account', 'accounts', 'user account', 'user accounts'],
    'authentication': ['authentication', 'user authentication', 'login', 'user login', 'auth'],
    'login': ['login', 'user login', 'authentication', 'user authentication', 'sign in', 'signin'],
    'user login': ['user login', 'login', 'authentication', 'user authentication'],
    'account': ['account', 'accounts', 'user account', 'user accounts', 'user authentication'],
    'accounts': ['accounts', 'account', 'user account', 'user accounts', 'user authentication'],
  }
  
  // Normalize search query and expand with synonyms
  const normalizeSearchQuery = (query: string): string[] => {
    const normalized = query.toLowerCase().trim()
    const terms: string[] = [normalized]
    
    // Add synonyms if exact match found
    if (searchSynonyms[normalized]) {
      terms.push(...searchSynonyms[normalized])
    }
    
    // Also check if query contains any synonym keys (for partial matches)
    Object.entries(searchSynonyms).forEach(([key, synonyms]) => {
      // Check if query contains the key or any of its synonyms
      const queryWords = normalized.split(/\s+/)
      const keyWords = key.split(/\s+/)
      
      // If all words from key are in query, add synonyms
      if (keyWords.every(word => queryWords.some(qw => qw.includes(word) || word.includes(qw)))) {
        terms.push(...synonyms)
      }
      
      // Also check if any synonym is in the query
      if (synonyms.some(syn => {
        const synWords = syn.split(/\s+/)
        return synWords.every(word => queryWords.some(qw => qw.includes(word) || word.includes(qw)))
      })) {
        terms.push(...synonyms)
      }
    })
    
    // Add individual words from multi-word queries
    const words = normalized.split(/\s+/).filter(w => w.length > 2)
    terms.push(...words)
    
    return [...new Set(terms)] // Remove duplicates
  }
  
  // Filter features based on search query with improved matching
  const filteredFeaturesByCategory = useMemo(() => {
    if (!searchQuery.trim()) {
      return featuresByCategory
    }
    
    const searchTerms = normalizeSearchQuery(searchQuery)
    const filtered: Record<string, Feature[]> = {}
    
    Object.entries(featuresByCategory).forEach(([category, features]) => {
      const matchingFeatures = features.filter(feature => {
        const featureName = feature.name.toLowerCase()
        const featureDesc = feature.description.toLowerCase()
        const featureTags = feature.tags?.map(tag => tag.toLowerCase()) || []
        
        // Check if any search term matches
        return searchTerms.some(term => {
          // Match in name (word boundary aware)
          if (featureName.includes(term) || 
              featureName.split(/\s+/).some(word => word.startsWith(term)) ||
              term.split(/\s+/).every(word => featureName.includes(word))) {
            return true
          }
          
          // Match in description
          if (featureDesc.includes(term) ||
              term.split(/\s+/).every(word => featureDesc.includes(word))) {
            return true
          }
          
          // Match in tags
          if (featureTags.some(tag => tag.includes(term) || term.includes(tag))) {
            return true
          }
          
          // Match feature ID (for cases like "user_authentication")
          const featureId = feature.id.toLowerCase().replace(/_/g, ' ')
          if (featureId.includes(term) || term.split(/\s+/).every(word => featureId.includes(word))) {
            return true
          }
          
          return false
        })
      })
      
      if (matchingFeatures.length > 0) {
        filtered[category] = matchingFeatures
      }
    })
    
    return filtered
  }, [featuresByCategory, searchQuery])
  
  // Selected features state (pre-select recommended AND included features)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set([...recommendedFeatureIds, ...includedFeatureIds])
  )
  
  // Ensure included features are always selected
  useEffect(() => {
    setSelectedFeatures(prev => {
      const next = new Set(prev)
      // Add all included features
      includedFeatureIds.forEach(id => next.add(id))
      return next
    })
  }, [includedFeatureIds])
  
  // Conflicts and dependencies
  const [conflicts, setConflicts] = useState<FeatureConflict[]>([])
  const [dependencyIssues, setDependencyIssues] = useState<Array<{
    feature: Feature
    missingDeps: Feature[]
  }>>([])
  
  // Error state for submission errors
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  
  // Get orchestrationError from store
  const orchestrationError = useConversationStore((state) => state.orchestrationError)
  
  // Sync orchestrationError with local error state
  useEffect(() => {
    if (orchestrationError) {
      setSubmissionError(orchestrationError)
    }
  }, [orchestrationError])
  
  // Get feature selection limit for current package (moved before useEffect that uses it)
  const maxFeatureSelections = useMemo(() => {
    return selectedWebsitePackage ? PACKAGE_FEATURE_LIMITS[selectedWebsitePackage] : null
  }, [selectedWebsitePackage])
  
  // Clear error when selection changes (user is fixing the issue)
  useEffect(() => {
    if (submissionError) {
      // Clear error when user modifies selection
      const addonCount = Array.from(selectedFeatures).filter(id => !includedFeatureIds.includes(id)).length
      if (maxFeatureSelections === null || addonCount <= (maxFeatureSelections || 0)) {
        setSubmissionError(null)
        // Also clear orchestrationError in store
        useConversationStore.setState({ orchestrationError: null })
      }
    }
  }, [selectedFeatures, submissionError, maxFeatureSelections, includedFeatureIds])
  
  // Calculate pricing including package base price
  const pricing = useMemo(() => {
    const featurePricing = featureLibrary.calculatePricing(
      Array.from(selectedFeatures),
      packageTierName
    )
    
    // Add package base price (always show, even if 0)
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
    
    // Calculate addon features total (excluding included features)
    const addonFeaturesTotal = featurePricing.addonFeatures.reduce((sum, f) => sum + (f.pricing.addonPrice || 0), 0)
    const addonTotal = addonFeaturesTotal
    
    return {
      ...featurePricing,
      packageBasePrice,
      hostingMonthly,
      hostingAnnual,
      addonTotal,
      total: packageBasePrice + addonTotal + hostingAnnual
    }
  }, [selectedFeatures, packageTierName, selectedWebsitePackage, selectedHostingPackage])
  
  // Count only addon features (exclude included features from count)
  const addonFeatureCount = useMemo(() => {
    return Array.from(selectedFeatures).filter(id => !includedFeatureIds.includes(id)).length
  }, [selectedFeatures, includedFeatureIds])
  
  // Check if limit is reached (only count addon features)
  const isLimitReached = useMemo(() => {
    if (maxFeatureSelections === null) return false // Unlimited
    return addonFeatureCount >= maxFeatureSelections
  }, [addonFeatureCount, maxFeatureSelections])
  
  // Validate selection whenever it changes
  useEffect(() => {
    const selectedArray = Array.from(selectedFeatures)
    
    // Check conflicts
    const detectedConflicts = featureLibrary.detectConflicts(selectedArray)
    setConflicts(detectedConflicts)
    
    // Check dependencies - store full feature objects for display
    const validation = featureLibrary.validateDependencies(selectedArray)
    if (!validation.valid) {
      setDependencyIssues(validation.missingDependencies)
    } else {
      setDependencyIssues([])
    }
  }, [selectedFeatures])
  
  const handleToggle = (featureId: string) => {
    // Don't allow toggling included features
    if (includedFeatureIds.includes(featureId)) {
      return
    }
    
    setSelectedFeatures(prev => {
      const next = new Set(prev)
      if (next.has(featureId)) {
        // Removing a feature - always allowed
        next.delete(featureId)
      } else {
        // Adding a feature - check limit (only count addon features)
        const currentAddonCount = Array.from(next).filter(id => !includedFeatureIds.includes(id)).length
        if (maxFeatureSelections !== null && currentAddonCount >= maxFeatureSelections) {
          // Limit reached - don't add
          return prev
        }
        next.add(featureId)
      }
      return next
    })
  }
  
  const handleSubmit = async () => {
    // Clear any previous errors
    setSubmissionError(null)
    useConversationStore.setState({ orchestrationError: null })
    
    if (conflicts.length > 0 || dependencyIssues.length > 0) {
      // Show validation errors - don't allow submission
      return
    }
    
    // Validate feature limit (only count addon features)
    const addonCount = Array.from(selectedFeatures).filter(id => !includedFeatureIds.includes(id)).length
    if (maxFeatureSelections !== null && addonCount > maxFeatureSelections) {
      // This shouldn't happen due to UI enforcement, but check anyway
      return
    }
    
    // Submit all selected features (including included ones)
    if (selectedFeatures.size > 0) {
      try {
        await onSubmit(Array.from(selectedFeatures))
        // Clear error on successful submission
        setSubmissionError(null)
      } catch (error) {
        // Handle error from onSubmit
        const errorMessage = error instanceof Error ? error.message : 'Failed to submit feature selection. Please try again.'
        setSubmissionError(errorMessage)
        console.error('Feature selection submission error:', error)
      }
    }
  }
  
  // Handle adding required dependency features
  const handleAddDependency = (featureId: string) => {
    // Check if we can add it (not at limit)
    const currentAddonCount = Array.from(selectedFeatures).filter(id => !includedFeatureIds.includes(id)).length
    if (maxFeatureSelections !== null && currentAddonCount >= maxFeatureSelections) {
      // Can't add - at limit
      return
    }
    
    // Add the dependency feature
    setSelectedFeatures(prev => {
      const next = new Set(prev)
      next.add(featureId)
      return next
    })
  }
  
  const canSubmit = 
    selectedFeatures.size > 0 &&
    conflicts.length === 0 &&
    dependencyIssues.length === 0 &&
    (maxFeatureSelections === null || addonFeatureCount <= maxFeatureSelections) &&
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
    <div className="w-full max-w-7xl mx-auto px-3 py-2 overflow-visible">
      {/* 2-column layout: Calculator/Progress on LEFT, Features on RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start overflow-visible">
        {/* Left Column - Pricing Calculator & Progress Panel (positioned FIRST/LEFT) */}
        <div className="lg:col-span-4 order-1 overflow-visible">
          <div className="lg:sticky lg:z-30 space-y-2" style={{ 
            position: 'sticky',
            top: '5rem',
            alignSelf: 'flex-start',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 5rem)'
          }}>
          {/* Pricing Calculator - Compact */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-20"
          >
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Compact header */}
              <button
                onClick={() => setIsCalculatorExpanded(!isCalculatorExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1 min-w-0">
                  {pricing.packageBasePrice > 0 && (
                    <div className="text-sm text-gray-600 mb-1 truncate">
                      Starter Website
                    </div>
                  )}
                  <div className="text-2xl font-bold text-gray-900">
                    ${pricing.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {addonFeatureCount} add-on{addonFeatureCount !== 1 ? 's' : ''}
                    {maxFeatureSelections !== null && (
                      <span> / {maxFeatureSelections} max</span>
                    )}
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
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
                    <div className="px-1.5 pb-1.5 space-y-1 border-t border-gray-200">
                      {/* Compact Breakdown */}
                      <div className="space-y-1 text-[10px]">
                        {pricing.packageBasePrice > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Starter Website:</span>
                            <span className="font-semibold">${pricing.packageBasePrice.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {/* Included Features */}
                        {includedFeatures.length > 0 && (
                          <div className="pt-1 border-t border-gray-100">
                            <div className="text-[9px] text-gray-500 font-medium mb-0.5">Included Features:</div>
                            {includedFeatures.map((feature) => (
                              <div key={feature.id} className="flex justify-between items-center group">
                                <span className="text-gray-600 flex-1 min-w-0 break-words">{feature.name}</span>
                                <span className="text-green-600 font-medium ml-2 flex-shrink-0 text-[9px]">
                                  Included
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {pricing.addonFeatures.length > 0 && (
                          <>
                            <div className="pt-1 border-t border-gray-100">
                              <div className="text-[9px] text-gray-500 font-medium mb-0.5">Add-on Features:</div>
                              {pricing.addonFeatures.map((feature) => (
                                <div key={feature.id} className="flex justify-between items-center group">
                                  <span className="text-gray-600 flex-1 min-w-0 break-words">{feature.name}</span>
                                  <span className="text-gray-600 font-medium ml-2 flex-shrink-0">
                                    ${(feature.pricing.addonPrice || 0).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-between text-gray-700 font-medium pt-0.5 border-t border-gray-100 mt-0.5">
                                <span>Add-ons Total:</span>
                                <span>${pricing.addonTotal.toLocaleString()}</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {pricing.hostingAnnual > 0 && (
                          <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100">
                            <span>Hosting:</span>
                            <span>${pricing.hostingAnnual.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Right Column - Features (positioned SECOND/RIGHT) */}
        <div className="lg:col-span-8 space-y-2 order-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!pl-9 pr-4 py-2 text-sm"
            />
          </div>
          
          {/* Custom Feature Input */}
          {!showCustomFeatureInput ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-2">
                Can't find what you're looking for?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomFeatureInput(true)}
                className="w-full"
              >
                Describe what you want and we'll create a custom feature just for you
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Create your own feature
              </label>
              <Input
                type="text"
                placeholder="Describe the feature you need..."
                value={customFeatureDescription}
                onChange={(e) => setCustomFeatureDescription(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomFeatureInput(false)
                    setCustomFeatureDescription('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // TODO: Handle custom feature submission
                    console.log('Custom feature:', customFeatureDescription)
                    setShowCustomFeatureInput(false)
                    setCustomFeatureDescription('')
                  }}
                  disabled={!customFeatureDescription.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
          
          {/* Compact Validation alerts */}
          <AnimatePresence>
            {isLimitReached && maxFeatureSelections !== null && (
              <motion.div
                key="limit-reached"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-1.5 bg-blue-50 border border-blue-200 rounded text-[10px]"
              >
                <div className="flex items-start gap-1.5">
                  <Info className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700">
                    Limit reached: {maxFeatureSelections} add-on{maxFeatureSelections !== 1 ? 's' : ''} max for {selectedWebsitePackage === 'starter' ? 'Starter' : selectedWebsitePackage === 'professional' ? 'Professional' : 'Custom'} package.
                  </p>
                </div>
              </motion.div>
            )}
            
            {conflicts.length > 0 && (
              <motion.div
                key="conflicts"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-1.5 bg-red-50 border border-red-200 rounded text-[10px]"
              >
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                  <ul className="space-y-0.5 text-red-700">
                    {conflicts.map((conflict, idx) => (
                      <li key={idx}>
                        {featureLibrary.getFeature(conflict.featureA)?.name} & {featureLibrary.getFeature(conflict.featureB)?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
            
            {dependencyIssues.length > 0 && (
              <motion.div
                key="dependency-issues"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-1.5 bg-yellow-50 border border-yellow-200 rounded text-[10px]"
              >
                <div className="space-y-1.5">
                  {dependencyIssues.map(({ feature, missingDeps }, idx) => (
                    <div key={`${feature.id}-${idx}`} className="space-y-1">
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-yellow-700 font-medium">
                            {feature.name} requires:
                          </p>
                        </div>
                      </div>
                      {/* Required features as clickable chips */}
                      <div className="ml-4 flex flex-wrap gap-1">
                        {missingDeps.map(depFeature => {
                          const isAlreadySelected = selectedFeatures.has(depFeature.id)
                          const isIncluded = includedFeatureIds.includes(depFeature.id)
                          const canAdd = !isAlreadySelected && 
                                        (maxFeatureSelections === null || 
                                         addonFeatureCount < maxFeatureSelections)
                          
                          return (
                            <button
                              key={depFeature.id}
                              onClick={() => canAdd && handleAddDependency(depFeature.id)}
                              disabled={!canAdd || isAlreadySelected}
                              className={`
                                inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium
                                transition-all
                                ${isAlreadySelected || isIncluded
                                  ? 'bg-green-100 text-green-700 cursor-default'
                                  : canAdd
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer border border-yellow-300'
                                  : 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50'
                                }
                              `}
                              title={isAlreadySelected || isIncluded 
                                ? 'Already selected' 
                                : canAdd 
                                ? `Click to add ${depFeature.name}` 
                                : 'Limit reached'}
                            >
                              {isAlreadySelected || isIncluded ? (
                                <>
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  {depFeature.name}
                                </>
                              ) : (
                                <>
                                  <span className="text-yellow-600">+</span>
                                  {depFeature.name}
                                </>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Submission Error Display */}
            {submissionError && (
              <motion.div
                key="submission-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 border-2 border-red-300 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-red-900 mb-1">
                      Feature Selection Error
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                      {submissionError}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubmissionError(null)
                        useConversationStore.setState({ orchestrationError: null })
                      }}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Feature categories - Show filtered features */}
          <div className="space-y-1.5 pb-8">
            {categoryOrder.map(categoryKey => {
              const features = filteredFeaturesByCategory[categoryKey as keyof typeof filteredFeaturesByCategory]
              if (!features || features.length === 0) return null
              
              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    {categoryLabels[categoryKey] || categoryKey}
                    <span className="text-[10px] font-normal text-gray-500">
                      ({features.length})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                    {features.map((feature, idx) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.01 }}
                      >
                        <FeatureChip
                          feature={feature}
                          isSelected={selectedFeatures.has(feature.id)}
                          isRecommended={recommendedFeatureIds.includes(feature.id)}
                          packageTier={packageTierName}
                          onToggle={handleToggle}
                          disabled={isSubmitting || includedFeatureIds.includes(feature.id) || (isLimitReached && !selectedFeatures.has(feature.id))}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Continue Button - Bottom of Features Section */}
          <div className="pb-4">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
