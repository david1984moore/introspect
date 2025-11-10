export type ValidationType = 
  | 'understanding' // Claude summarizes understanding, user confirms
  | 'conflict'      // Feature conflicts need resolution
  | 'assumption'    // Claude made assumptions, user corrects if needed
  | 'clarification' // Ambiguous answer needs clarification

export interface ValidationPrompt {
  id: string
  type: ValidationType
  category: string // Which SCOPE.md section
  summary: string  // Claude's understanding
  details?: ValidationDetail[]
  options?: ValidationOption[]
  allowEdit?: boolean // Can user edit the summary directly
}

export interface ValidationDetail {
  label: string
  value: string
  editable?: boolean
}

export interface ValidationOption {
  value: string
  label: string
  description?: string
}

export interface ValidationResponse {
  validationId: string
  confirmed: boolean
  corrections?: Record<string, string> // Field → corrected value
  selectedOption?: string // For conflict resolution
  notes?: string // Optional user notes
  timestamp: string
}

export interface ValidationOutcome {
  validationId: string
  type: ValidationType
  category: string
  originalSummary: string
  userResponse: ValidationResponse
  finalSummary: string // After corrections applied
}

// For SCOPE.md Section 14
export interface AllValidationOutcomes {
  understandingValidations: ValidationOutcome[]
  conflictsResolved: ValidationOutcome[]
  assumptionsClarified: ValidationOutcome[]
  clarificationsProvided: ValidationOutcome[]
}

