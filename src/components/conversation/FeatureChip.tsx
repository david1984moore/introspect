'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Info } from 'lucide-react'
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
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Determine if feature is included in current package
  const isIncluded = 
    feature.pricing.type === 'included' &&
    feature.pricing.tiers?.includes(packageTier)
  
  const priceDisplay = isIncluded
    ? 'Included'
    : feature.pricing.addonPrice
    ? `+$${feature.pricing.addonPrice.toLocaleString()}`
    : 'Custom'
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onToggle(feature.id)
    }
  }
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }
  
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative rounded-lg border transition-all duration-150
          ${isSelected
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-gray-200 bg-white hover:border-gray-300'
          }
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        {/* Compact chip view */}
        <div className="flex items-center gap-1.5 px-2 py-1">
          {/* Selection checkbox */}
          <button
            onClick={handleClick}
            disabled={disabled}
            className={`
              flex-shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all
              ${isSelected
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            type="button"
            aria-checked={isSelected}
          >
            {isSelected && (
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            )}
          </button>
          
          {/* Feature name */}
          <button
            onClick={handleExpandClick}
            className={`
              flex-1 text-left text-[11px] font-medium leading-tight break-words
              ${isSelected ? 'text-gray-900' : 'text-gray-700'}
              ${disabled ? 'cursor-default' : 'cursor-pointer hover:text-gray-900'}
            `}
            type="button"
          >
            {feature.name}
          </button>
          
          {/* Price badge */}
          <span className={`
            text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0
            ${isIncluded 
              ? 'bg-green-100 text-green-700' 
              : isSelected
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
            }
          `}>
            {priceDisplay}
          </span>
          
          {/* Recommended badge */}
          {isRecommended && !isSelected && (
            <span className="bg-primary/10 text-primary text-[9px] font-medium px-1 py-0.5 rounded flex-shrink-0">
              Rec
            </span>
          )}
          
          {/* Expand button */}
          <button
            onClick={handleExpandClick}
            className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded transition-colors"
            type="button"
          >
            <ChevronDown 
              className={`w-3 h-3 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
        
        {/* Expanded detail view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-200"
            >
              <div className="px-2 py-1.5 space-y-1.5 text-[10px]">
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Dependencies */}
                {feature.dependencies && feature.dependencies.length > 0 && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-gray-500 font-medium mb-0.5">Requires:</p>
                    <ul className="text-gray-600 space-y-0.5">
                      {feature.dependencies.map(depId => (
                        <li key={depId} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          {depId.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Conflicts */}
                {feature.conflicts && feature.conflicts.length > 0 && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-orange-600 font-medium mb-0.5">Conflicts with:</p>
                    <ul className="text-gray-600 space-y-0.5">
                      {feature.conflicts.map(conflictId => (
                        <li key={conflictId} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                          {conflictId.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

