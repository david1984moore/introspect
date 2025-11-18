'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { featureLibrary } from '@/lib/features/featureLibraryParser'
import type { WebsitePackage, HostingPackage } from './PackageSelectionScreen'

interface CompactPriceCalculatorProps {
  websitePackage: WebsitePackage | null
  hostingPackage: HostingPackage
  hostingDuration?: 3 | 6 | 12
  selectedFeatures?: string[]
  packageTierName?: string
  includedFeatures?: Array<{ id: string; name: string }>
  maxFeatureSelections?: number | null
  defaultExpanded?: boolean
}

// Duration discounts
const DURATION_DISCOUNTS = {
  3: 0,
  6: 0.05, // 5% discount
  12: 0.10 // 10% discount
}

export function CompactPriceCalculator({
  websitePackage,
  hostingPackage,
  hostingDuration = 3,
  selectedFeatures = [],
  packageTierName,
  includedFeatures = [],
  maxFeatureSelections = null,
  defaultExpanded = true
}: CompactPriceCalculatorProps) {
  const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(defaultExpanded)

  // Calculate pricing using the same logic as FeatureChipGrid
  const pricing = useMemo(() => {
    // Package base price
    const packageBasePrice = websitePackage === 'starter' ? 1900 :
                             websitePackage === 'professional' ? 3250 :
                             websitePackage === 'custom' ? 5250 : 0
    
    // Get package tier name for feature pricing
    const tierName = packageTierName || 
                     (websitePackage === 'starter' ? 'Starter' :
                      websitePackage === 'professional' ? 'Professional' :
                      websitePackage === 'custom' ? 'Custom' : 'Starter')
    
    // Calculate feature pricing if features are selected
    let featurePricing = { addonFeatures: [], addonTotal: 0 }
    if (selectedFeatures.length > 0 && tierName) {
      featurePricing = featureLibrary.calculatePricing(selectedFeatures, tierName)
      featurePricing.addonTotal = featurePricing.addonFeatures.reduce(
        (sum, f) => sum + (f.pricing.addonPrice || 0), 
        0
      )
    }
    
    // Calculate hosting annual cost with duration discounts
    const hostingPrices: Record<'basic' | 'pro' | 'premium', number> = {
      basic: 75,
      pro: 150,
      premium: 300
    }
    
    const discount = DURATION_DISCOUNTS[hostingDuration]
    const hostingMonthly = hostingPackage !== 'none' 
      ? Math.round(hostingPrices[hostingPackage] * (1 - discount))
      : 0
    const hostingAnnual = hostingMonthly * hostingDuration
    
    const total = packageBasePrice + featurePricing.addonTotal + hostingAnnual
    
    return {
      packageBasePrice,
      hostingMonthly,
      hostingAnnual,
      addonFeatures: featurePricing.addonFeatures,
      addonTotal: featurePricing.addonTotal,
      total
    }
  }, [websitePackage, hostingPackage, hostingDuration, selectedFeatures, packageTierName])

  // Get package name for display
  const packageName = websitePackage === 'starter' ? 'Starter Website' :
                      websitePackage === 'professional' ? 'Professional Website' :
                      websitePackage === 'custom' ? 'Custom Web App' : ''

  // Get hosting name for display
  const hostingName = hostingPackage === 'basic' ? 'Basic' :
                      hostingPackage === 'pro' ? 'Pro' :
                      hostingPackage === 'premium' ? 'Premium' : ''

  // Count addon features (exclude included features)
  const addonFeatureCount = useMemo(() => {
    if (!selectedFeatures.length) return 0
    const includedIds = includedFeatures.map(f => f.id)
    return selectedFeatures.filter(id => !includedIds.includes(id)).length
  }, [selectedFeatures, includedFeatures])

  // Don't show if no package selected and no features
  if (!websitePackage && selectedFeatures.length === 0) {
    return null
  }

  return (
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
                {packageName}
              </div>
            )}
            <div className="text-2xl font-bold text-gray-900">
              ${pricing.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {addonFeatureCount > 0 && (
                <>
                  {addonFeatureCount} add-on{addonFeatureCount !== 1 ? 's' : ''}
                  {maxFeatureSelections !== null && (
                    <span> / {maxFeatureSelections} max</span>
                  )}
                </>
              )}
              {addonFeatureCount === 0 && websitePackage && (
                <span>First Year</span>
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
                      <span>{packageName}:</span>
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
                      <span>Hosting ({hostingName}):</span>
                      <span>${pricing.hostingAnnual.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="flex justify-between text-gray-900 font-bold pt-1 border-t border-gray-200 mt-1">
                    <span>Total (First Year):</span>
                    <span>${pricing.total.toLocaleString()}</span>
                  </div>
                  
                  {pricing.hostingAnnual > 0 && (
                    <div className="text-[9px] text-gray-500 pt-0.5">
                      Then ${pricing.hostingMonthly.toLocaleString()}/month
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

