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

