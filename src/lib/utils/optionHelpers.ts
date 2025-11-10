import type { QuestionOption } from '@/types/conversation'

/**
 * Ensures every option array has "Something else" as the last option
 * (except for specific cases like feature chips where it should be omitted)
 */
export function ensureSomethingElseOption(
  options: QuestionOption[],
  includeSomethingElse: boolean = true
): QuestionOption[] {
  if (!includeSomethingElse) {
    return options
  }
  
  // Check if "Something else" already exists
  const hasSomethingElse = options.some(opt => opt.allowText)
  
  if (!hasSomethingElse) {
    return [
      ...options,
      {
        value: 'other',
        label: 'Something else',
        allowText: true
      }
    ]
  }
  
  return options
}

/**
 * Format options for display based on website type and context
 */
export function formatOptionsForType(
  baseOptions: string[],
  websiteType: string,
  context?: string
): QuestionOption[] {
  return baseOptions.map(option => ({
    value: option.toLowerCase().replace(/\s+/g, '_'),
    label: option,
  }))
}

/**
 * Add descriptions to options based on context
 */
export function enrichOptionsWithDescriptions(
  options: QuestionOption[],
  descriptions: Record<string, string>
): QuestionOption[] {
  return options.map(option => ({
    ...option,
    description: descriptions[option.value] || option.description
  }))
}

/**
 * Mark recommended option (typically the first/most common choice)
 */
export function markRecommendedOption(
  options: QuestionOption[],
  recommendedValue: string
): QuestionOption[] {
  return options.map(option => ({
    ...option,
    recommended: option.value === recommendedValue
  }))
}

/**
 * Validate that options array meets Phase 3 requirements
 */
export function validateOptions(options: QuestionOption[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!options || options.length === 0) {
    errors.push('Options array cannot be empty')
  }
  
  if (options.length < 3 && !options.some(opt => opt.allowText)) {
    errors.push('Should have at least 3 options (including "Something else")')
  }
  
  if (options.length > 7) {
    errors.push('Should have at most 6 options plus "Something else" (7 total)')
  }
  
  // Check for "Something else" in non-feature questions
  const hasSomethingElse = options.some(opt => opt.allowText)
  if (!hasSomethingElse) {
    errors.push('Regular questions should include "Something else" option')
  }
  
  // Validate option structure
  options.forEach((opt, index) => {
    if (!opt.value) {
      errors.push(`Option ${index + 1} missing value`)
    }
    if (!opt.label) {
      errors.push(`Option ${index + 1} missing label`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

