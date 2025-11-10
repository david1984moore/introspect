export type SectionStatus = 'not_started' | 'in_progress' | 'complete'

export interface ScopeSection {
  id: string
  number: number
  name: string
  description: string
  status: SectionStatus
  requiredQuestions: number // Estimated questions for this section
  answeredQuestions: number // Actual questions answered
  subsections?: string[] // Optional subsection tracking
}

export interface ScopeProgress {
  sections: {
    section1_executive_summary: SectionStatus
    section2_project_classification: SectionStatus
    section3_client_information: SectionStatus
    section4_business_context: SectionStatus
    section5_brand_assets: SectionStatus
    section6_content_strategy: SectionStatus
    section7_technical_specs: SectionStatus
    section8_media_elements: SectionStatus
    section9_design_direction: SectionStatus
    section10_features_breakdown: SectionStatus
    section11_support_plan: SectionStatus
    section12_timeline: SectionStatus
    section13_investment_summary: SectionStatus
    section14_validation_outcomes: SectionStatus
  }
  overallCompleteness: number // 0-100%
  sectionsComplete: number // Count of complete sections
  sectionsInProgress: number // Count of in-progress sections
  sectionsRemaining: number // Count of not-started sections
  currentSection: string | null // Which section is currently being worked on
  estimatedQuestionsRemaining: number // Dynamic based on complexity
}

export const SCOPE_SECTION_METADATA: Record<string, {
  number: number
  name: string
  description: string
  category: string
  estimatedQuestions: { min: number; max: number }
}> = {
  section1_executive_summary: {
    number: 1,
    name: 'Executive Summary',
    description: 'High-level project overview',
    category: 'overview',
    estimatedQuestions: { min: 0, max: 1 } // Derived from other sections
  },
  section2_project_classification: {
    number: 2,
    name: 'Project Classification',
    description: 'Website type and package determination',
    category: 'foundation',
    estimatedQuestions: { min: 6, max: 6 } // Foundation questions
  },
  section3_client_information: {
    number: 3,
    name: 'Client Information',
    description: 'Contact details and decision-makers',
    category: 'foundation',
    estimatedQuestions: { min: 6, max: 6 } // Foundation questions
  },
  section4_business_context: {
    number: 4,
    name: 'Business Context',
    description: 'Audience, goals, and value proposition',
    category: 'business',
    estimatedQuestions: { min: 3, max: 6 }
  },
  section5_brand_assets: {
    number: 5,
    name: 'Brand Assets & Identity',
    description: 'Existing assets and design requirements',
    category: 'design',
    estimatedQuestions: { min: 2, max: 4 }
  },
  section6_content_strategy: {
    number: 6,
    name: 'Content Strategy',
    description: 'Content provision and maintenance',
    category: 'content',
    estimatedQuestions: { min: 3, max: 5 }
  },
  section7_technical_specs: {
    number: 7,
    name: 'Technical Specifications',
    description: 'Features, integrations, and requirements',
    category: 'technical',
    estimatedQuestions: { min: 5, max: 15 } // Varies by complexity
  },
  section8_media_elements: {
    number: 8,
    name: 'Media & Interactive',
    description: 'Video, galleries, and interactive components',
    category: 'media',
    estimatedQuestions: { min: 1, max: 3 }
  },
  section9_design_direction: {
    number: 9,
    name: 'Design Direction',
    description: 'Visual style and preferences',
    category: 'design',
    estimatedQuestions: { min: 2, max: 4 }
  },
  section10_features_breakdown: {
    number: 10,
    name: 'Features & Functionality',
    description: 'Feature selection and pricing',
    category: 'features',
    estimatedQuestions: { min: 1, max: 1 } // Feature chip screen
  },
  section11_support_plan: {
    number: 11,
    name: 'Post-Launch Support',
    description: 'Training, maintenance, and hosting',
    category: 'support',
    estimatedQuestions: { min: 2, max: 3 }
  },
  section12_timeline: {
    number: 12,
    name: 'Project Timeline',
    description: 'Milestones and launch date',
    category: 'timeline',
    estimatedQuestions: { min: 2, max: 3 }
  },
  section13_investment_summary: {
    number: 13,
    name: 'Investment Summary',
    description: 'Pricing breakdown and ROI',
    category: 'pricing',
    estimatedQuestions: { min: 0, max: 2 } // Mostly calculated
  },
  section14_validation_outcomes: {
    number: 14,
    name: 'Validation & Confirmation',
    description: 'Understanding confirmations',
    category: 'validation',
    estimatedQuestions: { min: 0, max: 3 } // Validation loops
  }
}

