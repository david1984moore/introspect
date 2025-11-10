'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FeatureChip } from '@/components/FeatureChip'
import type { FeatureRecommendation, PackageRecommendation } from '@/types'

interface FeatureSelectionScreenProps {
  packageRecommendation: PackageRecommendation
  features: FeatureRecommendation[]
  onContinue: (selectedFeatureIds: string[]) => void
  isLoading?: boolean
}

// Organize features by category
function organizeFeatures(features: FeatureRecommendation[]) {
  const categories: Record<string, FeatureRecommendation[]> = {
    Core: [],
    'E-commerce': [],
    Marketing: [],
    Integrations: [],
    'Advanced': [],
    Other: [],
  }

  features.forEach((feature) => {
    // Simple categorization based on feature ID patterns
    if (feature.id.includes('ecommerce') || feature.id.includes('cart') || feature.id.includes('payment')) {
      categories['E-commerce'].push(feature)
    } else if (feature.id.includes('email') || feature.id.includes('marketing') || feature.id.includes('newsletter')) {
      categories['Marketing'].push(feature)
    } else if (feature.id.includes('integration') || feature.id.includes('api') || feature.id.includes('crm')) {
      categories['Integrations'].push(feature)
    } else if (feature.id.includes('advanced') || feature.id.includes('custom') || feature.id.includes('enterprise')) {
      categories['Advanced'].push(feature)
    } else if (feature.id.includes('auth') || feature.id.includes('cms') || feature.id.includes('seo')) {
      categories['Core'].push(feature)
    } else {
      categories['Other'].push(feature)
    }
  })

  // Remove empty categories
  return Object.entries(categories).filter(([_, features]) => features.length > 0)
}

export function FeatureSelectionScreen({
  packageRecommendation,
  features,
  onContinue,
  isLoading = false,
}: FeatureSelectionScreenProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const organizedFeatures = useMemo(() => organizeFeatures(features), [features])

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(featureId)) {
        next.delete(featureId)
      } else {
        next.add(featureId)
      }
      return next
    })
  }

  const handleContinue = () => {
    if (selectedFeatures.size > 0) {
      onContinue(Array.from(selectedFeatures))
    }
  }

  // Calculate total price
  const basePrice = packageRecommendation.basePrice
  const selectedFeaturesPrice = Array.from(selectedFeatures).reduce((sum, id) => {
    const feature = features.find((f) => f.id === id)
    return sum + (feature?.price || 0)
  }, 0)
  const totalPrice = basePrice + selectedFeaturesPrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Select Your Features
        </h2>
        <p className="text-gray-600">
          Based on your needs, we've recommended these features. Select the ones that fit your project.
        </p>
      </div>

      {/* Package Info */}
      <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {packageRecommendation.package} Package
            </h3>
            <p className="text-sm text-gray-600">{packageRecommendation.rationale}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${basePrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Base price</div>
          </div>
        </div>
        
        {/* Included Features */}
        {packageRecommendation.included.length > 0 && (
          <div className="mt-4 pt-4 border-t border-primary/20">
            <p className="text-sm font-medium text-gray-700 mb-2">Included in package:</p>
            <div className="flex flex-wrap gap-2">
              {packageRecommendation.included.map((featureName) => (
                <span
                  key={featureName}
                  className="text-xs bg-white text-primary px-2 py-1 rounded border border-primary/30"
                >
                  {featureName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature Categories */}
      <div className="space-y-8 mb-8">
        <AnimatePresence>
          {organizedFeatures.map(([category, categoryFeatures], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
              <div className="grid gap-3">
                {categoryFeatures.map((feature) => {
                  const isIncluded = packageRecommendation.included.includes(feature.id)
                  return (
                    <FeatureChip
                      key={feature.id}
                      feature={feature}
                      selected={selectedFeatures.has(feature.id)}
                      onClick={() => toggleFeature(feature.id)}
                      included={isIncluded}
                    />
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary & Continue */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">
              {selectedFeatures.size} feature{selectedFeatures.size !== 1 ? 's' : ''} selected
            </p>
            {selectedFeaturesPrice > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                +${selectedFeaturesPrice.toLocaleString()} in add-ons
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total project cost</div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedFeatures.size === 0 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Processing...' : 'Continue with Selected Features'}
        </Button>
      </div>
    </motion.div>
  )
}

