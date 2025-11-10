'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FeatureRecommendation } from '@/types'

interface FeatureChipProps {
  feature: FeatureRecommendation
  selected: boolean
  onClick: () => void
  included?: boolean // If feature is included in base package
}

export function FeatureChip({ feature, selected, onClick, included }: FeatureChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative w-full text-left p-4 rounded-lg border-2 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{feature.name}</h3>
            {included && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                Included
              </span>
            )}
            {!included && feature.price > 0 && (
              <span className="text-sm font-medium text-gray-600">
                ${feature.price.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
          {feature.roi && (
            <p className="text-xs text-gray-500 mt-2 italic">{feature.roi}</p>
          )}
        </div>
        
        {/* Selection Indicator */}
        <div
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            selected
              ? 'border-primary bg-primary'
              : 'border-gray-300 bg-white'
          )}
        >
          {selected && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>
      
      {/* Priority Badge */}
      {feature.priority === 'highly_recommended' && (
        <div className="absolute top-2 right-2">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
            Recommended
          </span>
        </div>
      )}
    </motion.button>
  )
}

