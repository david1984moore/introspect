'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { WebsitePackage, HostingPackage, WebsitePackageOption, HostingPackageOption } from './PackageSelectionScreen'

interface PriceCalculatorProps {
  websitePackage: WebsitePackage | null
  hostingPackage: HostingPackage
  websitePackages: WebsitePackageOption[]
  hostingPackages: HostingPackageOption[]
  selectedFeatures?: string[]
  featurePricing?: number
}

export function PriceCalculator({
  websitePackage,
  hostingPackage,
  websitePackages,
  hostingPackages,
  selectedFeatures = [],
  featurePricing = 0
}: PriceCalculatorProps) {
  const pricing = useMemo(() => {
    const websitePrice = websitePackage
      ? websitePackages.find(p => p.id === websitePackage)?.basePrice || 0
      : 0
    
    const hostingMonthly = hostingPackage !== 'none'
      ? hostingPackages.find(p => p.id === hostingPackage)?.baseMonthlyPrice || 0
      : 0
    
    const hostingAnnual = hostingMonthly * 12
    
    const subtotal = websitePrice + featurePricing
    const total = subtotal + hostingAnnual
    
    return {
      website: websitePrice,
      features: featurePricing,
      hosting: {
        monthly: hostingMonthly,
        annual: hostingAnnual
      },
      subtotal,
      total
    }
  }, [websitePackage, hostingPackage, websitePackages, hostingPackages, featurePricing])

  if (!websitePackage && selectedFeatures.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 bg-white border-t-2 border-gray-200 shadow-lg rounded-t-lg p-6 z-30"
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Price Summary
        </h3>
        
        <div className="space-y-2 mb-4">
          {websitePackage && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Website Package ({websitePackages.find(p => p.id === websitePackage)?.name})</span>
              <span>${pricing.website.toLocaleString()}</span>
            </div>
          )}
          
          {selectedFeatures.length > 0 && featurePricing > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Additional Features ({selectedFeatures.length})</span>
              <span>${featurePricing.toLocaleString()}</span>
            </div>
          )}
          
          {hostingPackage !== 'none' && (
            <>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Hosting ({hostingPackages.find(p => p.id === hostingPackage)?.name})</span>
                <span>${pricing.hosting.monthly.toLocaleString()}/month</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Hosting (Annual)</span>
                <span>${pricing.hosting.annual.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold text-gray-900">Total (First Year)</span>
            <span className="text-3xl font-bold text-gray-900">
              ${pricing.total.toLocaleString()}
            </span>
          </div>
          {hostingPackage !== 'none' && (
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-sm text-gray-600">Then ${pricing.hosting.monthly.toLocaleString()}/month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

