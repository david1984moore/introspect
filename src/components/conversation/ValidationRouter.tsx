'use client'

import { ValidationScreen } from './ValidationScreen'
import { ConflictResolution } from './ConflictResolution'
import { AssumptionClarification } from './AssumptionClarification'
import type { ValidationPrompt, ValidationResponse } from '@/types/validation'

interface ValidationRouterProps {
  validation: ValidationPrompt
  onComplete: (response: ValidationResponse) => void
  isSubmitting?: boolean
}

export function ValidationRouter({
  validation,
  onComplete,
  isSubmitting = false
}: ValidationRouterProps) {
  // Route to appropriate validation component based on type
  switch (validation.type) {
    case 'understanding':
      return (
        <ValidationScreen
          validation={validation}
          onConfirm={onComplete}
          isSubmitting={isSubmitting}
        />
      )
      
    case 'conflict':
      return (
        <ConflictResolution
          validation={validation}
          onResolve={onComplete}
          isSubmitting={isSubmitting}
        />
      )
      
    case 'assumption':
      return (
        <AssumptionClarification
          validation={validation}
          onClarify={onComplete}
          isSubmitting={isSubmitting}
        />
      )
      
    case 'clarification':
      // Could have a separate component, or reuse ValidationScreen
      return (
        <ValidationScreen
          validation={validation}
          onConfirm={onComplete}
          isSubmitting={isSubmitting}
        />
      )
      
    default:
      return null
  }
}

