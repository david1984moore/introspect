# Phase 7: SCOPE.md Progress Tracking UI
**Days 21-22 | Introspect V3 Implementation**

## Overview

Build the visual progress tracking system that shows users their journey through the 14 SCOPE.md sections, creating transparency and momentum through the orchestration flow.

**Duration:** 2 days  
**Prerequisites:** Phases 1-6 complete  
**Deliverables:**
- ScopeProgress component with visual progress bar
- Section-by-section status display
- Real-time updates as intelligence is gathered
- Adaptive completion percentage
- Integration with Phase 3's sufficiency evaluation
- Mobile-responsive design

---

## Why This Phase Matters

### The Psychology of Progress

Phase 3 defines 14 SCOPE.md sections that must be completed. Without visible progress:
- ❌ Users feel lost ("How much longer?")
- ❌ No sense of momentum
- ❌ Unknown time investment
- ❌ Higher abandonment

With section-based progress:
- ✅ Clear sense of achievement
- ✅ Visible momentum builds commitment
- ✅ Transparency creates trust
- ✅ Users see value accumulating
- ✅ "Almost done" feeling reduces abandonment

### Design Principle: Progress as Motivation

Progress bars work when they:
1. **Show meaningful milestones** (sections, not arbitrary percentages)
2. **Update in real-time** (users see immediate results)
3. **Adapt to complexity** (simple projects = faster progress)
4. **Celebrate completion** (visual feedback for each section)

---

## Part 1: Core Types

**File:** `types/scopeProgress.ts`

```typescript
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
```

---

## Part 2: Progress Calculator

**File:** `lib/utils/progressCalculator.ts`

```typescript
import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeProgress, SectionStatus } from '@/types/scopeProgress'
import { SCOPE_SECTION_METADATA } from '@/types/scopeProgress'

export class ProgressCalculator {
  /**
   * Calculate current SCOPE.md progress based on gathered intelligence
   */
  calculateProgress(intelligence: ConversationIntelligence): ScopeProgress {
    const sections = this.evaluateSections(intelligence)
    
    const sectionsComplete = Object.values(sections).filter(
      status => status === 'complete'
    ).length
    
    const sectionsInProgress = Object.values(sections).filter(
      status => status === 'in_progress'
    ).length
    
    const sectionsRemaining = Object.values(sections).filter(
      status => status === 'not_started'
    ).length
    
    const overallCompleteness = Math.round((sectionsComplete / 14) * 100)
    
    const currentSection = this.getCurrentSection(sections)
    
    const estimatedQuestionsRemaining = this.estimateRemainingQuestions(
      sections,
      intelligence
    )
    
    return {
      sections,
      overallCompleteness,
      sectionsComplete,
      sectionsInProgress,
      sectionsRemaining,
      currentSection,
      estimatedQuestionsRemaining
    }
  }
  
  /**
   * Evaluate status of each SCOPE.md section
   */
  private evaluateSections(
    intelligence: ConversationIntelligence
  ): ScopeProgress['sections'] {
    return {
      section1_executive_summary: this.evaluateSection1(intelligence),
      section2_project_classification: this.evaluateSection2(intelligence),
      section3_client_information: this.evaluateSection3(intelligence),
      section4_business_context: this.evaluateSection4(intelligence),
      section5_brand_assets: this.evaluateSection5(intelligence),
      section6_content_strategy: this.evaluateSection6(intelligence),
      section7_technical_specs: this.evaluateSection7(intelligence),
      section8_media_elements: this.evaluateSection8(intelligence),
      section9_design_direction: this.evaluateSection9(intelligence),
      section10_features_breakdown: this.evaluateSection10(intelligence),
      section11_support_plan: this.evaluateSection11(intelligence),
      section12_timeline: this.evaluateSection12(intelligence),
      section13_investment_summary: this.evaluateSection13(intelligence),
      section14_validation_outcomes: this.evaluateSection14(intelligence)
    }
  }
  
  // Section evaluation methods (from Phase 3's sufficiency criteria)
  
  private evaluateSection1(intelligence: ConversationIntelligence): SectionStatus {
    // Section 1: Executive Summary (derived from other sections)
    // Complete when Sections 2, 4, and 10 are complete
    const hasBasics = intelligence.userName && intelligence.websiteType
    const hasGoal = intelligence.primaryGoal
    const hasAudience = intelligence.targetAudience
    
    if (hasBasics && hasGoal && hasAudience) return 'complete'
    if (hasBasics) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection2(intelligence: ConversationIntelligence): SectionStatus {
    // Section 2: Project Classification
    // Complete when: websiteType, industry, business model, complexity, package
    const hasType = intelligence.websiteType
    const hasIndustry = intelligence.industry
    
    if (hasType && hasIndustry) return 'complete'
    if (hasType || hasIndustry) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection3(intelligence: ConversationIntelligence): SectionStatus {
    // Section 3: Client Information
    // Complete when: name, email, phone, company
    const hasName = intelligence.userName
    const hasEmail = intelligence.userEmail
    const hasPhone = intelligence.userPhone
    const hasCompany = intelligence.companyName
    
    if (hasName && hasEmail && hasPhone && hasCompany) return 'complete'
    if (hasName || hasEmail) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection4(intelligence: ConversationIntelligence): SectionStatus {
    // Section 4: Business Context
    // Complete when: overview, audience, goal, metrics, value prop, pain points
    const hasAudience = intelligence.targetAudience
    const hasGoal = intelligence.primaryGoal
    const hasMetrics = intelligence.successMetrics && intelligence.successMetrics.length > 0
    const hasProblem = intelligence.problemBeingSolved
    const hasValue = intelligence.valueProposition
    
    const completedItems = [hasAudience, hasGoal, hasMetrics, hasProblem, hasValue]
      .filter(Boolean).length
    
    if (completedItems >= 4) return 'complete'
    if (completedItems >= 2) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection5(intelligence: ConversationIntelligence): SectionStatus {
    // Section 5: Brand Assets & Identity
    // Complete when: existing assets known, style direction set
    const hasDesignStyle = intelligence.designStyle
    const hasAssets = intelligence.existingBrandAssets
    
    if (hasDesignStyle && hasAssets !== undefined) return 'complete'
    if (hasDesignStyle || hasAssets !== undefined) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection6(intelligence: ConversationIntelligence): SectionStatus {
    // Section 6: Content Strategy
    // Complete when: provider, readiness, frequency, maintenance
    const hasProvider = intelligence.contentProvider
    const hasReadiness = intelligence.contentReadiness
    const hasFrequency = intelligence.updateFrequency
    
    if (hasProvider && hasReadiness && hasFrequency) return 'complete'
    if (hasProvider || hasReadiness) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection7(intelligence: ConversationIntelligence): SectionStatus {
    // Section 7: Technical Specifications
    // Complete when: auth, CMS, search, type-specific features, integrations
    const hasAuthDecision = intelligence.needsUserAccounts !== undefined
    const hasCMSDecision = intelligence.needsCMS !== undefined
    const hasTypeSpecific = this.hasTypeSpecificRequirements(intelligence)
    
    const completedItems = [hasAuthDecision, hasCMSDecision, hasTypeSpecific]
      .filter(Boolean).length
    
    if (completedItems >= 3) return 'complete'
    if (completedItems >= 1) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection8(intelligence: ConversationIntelligence): SectionStatus {
    // Section 8: Media & Interactive Elements
    // Complete when: media requirements captured
    const hasMediaRequirements = intelligence.mediaRequirements
    
    if (hasMediaRequirements !== undefined) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection9(intelligence: ConversationIntelligence): SectionStatus {
    // Section 9: Design Direction
    // Complete when: style, references documented
    const hasDesignStyle = intelligence.designStyle
    const hasReferences = intelligence.designReferences
    
    if (hasDesignStyle) return 'complete'
    if (hasReferences) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection10(intelligence: ConversationIntelligence): SectionStatus {
    // Section 10: Features & Functionality Breakdown
    // Complete when: features selected (Phase 6)
    const hasFeatures = intelligence.selectedFeatures && 
                        intelligence.selectedFeatures.length > 0
    
    if (hasFeatures) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection11(intelligence: ConversationIntelligence): SectionStatus {
    // Section 11: Post-Launch Support Plan
    // Complete when: training, maintenance, hosting determined
    const hasTraining = intelligence.trainingNeeds !== undefined
    const hasMaintenance = intelligence.maintenancePlan !== undefined
    
    if (hasTraining && hasMaintenance) return 'complete'
    if (hasTraining || hasMaintenance) return 'in_progress'
    return 'not_started'
  }
  
  private evaluateSection12(intelligence: ConversationIntelligence): SectionStatus {
    // Section 12: Project Timeline
    // Complete when: timeline set
    const hasTimeline = intelligence.desiredTimeline
    
    if (hasTimeline) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection13(intelligence: ConversationIntelligence): SectionStatus {
    // Section 13: Investment Summary
    // Complete when: features selected (pricing calculated from Section 10)
    const hasPricing = intelligence.selectedFeatures && 
                      intelligence.selectedFeatures.length > 0
    
    if (hasPricing) return 'complete'
    return 'not_started'
  }
  
  private evaluateSection14(intelligence: ConversationIntelligence): SectionStatus {
    // Section 14: Validation Outcomes
    // Complete when: validation loops done (end of conversation)
    const hasValidations = intelligence.validationOutcomes
    
    if (hasValidations) return 'complete'
    return 'not_started'
  }
  
  private hasTypeSpecificRequirements(intelligence: ConversationIntelligence): boolean {
    const websiteType = intelligence.websiteType?.toLowerCase()
    
    switch (websiteType) {
      case 'ecommerce':
        return intelligence.productCatalogSize !== undefined
      case 'portfolio':
        return intelligence.portfolioOrganization !== undefined
      case 'blog':
        return intelligence.blogCategories !== undefined
      case 'service':
        return intelligence.serviceAreas !== undefined
      default:
        return true // Other types may not have specific requirements
    }
  }
  
  private getCurrentSection(sections: ScopeProgress['sections']): string | null {
    // Find first in-progress section
    const inProgressSection = Object.entries(sections).find(
      ([_, status]) => status === 'in_progress'
    )
    
    if (inProgressSection) {
      return inProgressSection[0]
    }
    
    // If no in-progress, find first not-started
    const notStartedSection = Object.entries(sections).find(
      ([_, status]) => status === 'not_started'
    )
    
    return notStartedSection ? notStartedSection[0] : null
  }
  
  private estimateRemainingQuestions(
    sections: ScopeProgress['sections'],
    intelligence: ConversationIntelligence
  ): number {
    let estimate = 0
    
    Object.entries(sections).forEach(([sectionKey, status]) => {
      if (status === 'complete') return
      
      const metadata = SCOPE_SECTION_METADATA[sectionKey]
      if (!metadata) return
      
      // Use complexity to determine if min or max questions needed
      const complexity = this.determineComplexity(intelligence)
      const questionCount = complexity === 'simple' 
        ? metadata.estimatedQuestions.min
        : complexity === 'complex'
        ? metadata.estimatedQuestions.max
        : Math.round(
            (metadata.estimatedQuestions.min + metadata.estimatedQuestions.max) / 2
          )
      
      if (status === 'in_progress') {
        // Assume halfway through in-progress sections
        estimate += Math.ceil(questionCount / 2)
      } else {
        estimate += questionCount
      }
    })
    
    return estimate
  }
  
  private determineComplexity(
    intelligence: ConversationIntelligence
  ): 'simple' | 'standard' | 'complex' {
    const websiteType = intelligence.websiteType?.toLowerCase()
    
    // E-commerce and membership sites are typically complex
    if (websiteType === 'ecommerce' || websiteType === 'membership') {
      return 'complex'
    }
    
    // Portfolio and blogs are typically simple
    if (websiteType === 'portfolio' || websiteType === 'blog') {
      return 'simple'
    }
    
    // Check feature count if available
    if (intelligence.selectedFeatures && intelligence.selectedFeatures.length > 10) {
      return 'complex'
    }
    
    return 'standard'
  }
}

export const progressCalculator = new ProgressCalculator()
```

---

## Part 3: Progress Bar Component

**File:** `components/conversation/ScopeProgressBar.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ScopeProgress } from '@/types/scopeProgress'

interface ScopeProgressBarProps {
  progress: ScopeProgress
  showDetails?: boolean
  className?: string
}

export function ScopeProgressBar({
  progress,
  showDetails = false,
  className = ''
}: ScopeProgressBarProps) {
  const { overallCompleteness, sectionsComplete, sectionsRemaining } = progress
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Visual progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallCompleteness}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-primary-dark"
          />
        </div>
        
        {/* Milestone markers (every 25%) */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {[0, 25, 50, 75, 100].map(milestone => {
            const isPassed = overallCompleteness >= milestone
            return (
              <div
                key={milestone}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  isPassed
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-300'
                }`}
              />
            )
          })}
        </div>
      </div>
      
      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {overallCompleteness}% complete
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">
            {sectionsComplete} of 14 sections
          </span>
        </div>
        
        {sectionsRemaining > 0 && (
          <span className="text-xs text-gray-500">
            {sectionsRemaining} remaining
          </span>
        )}
      </div>
      
      {/* Optional estimated time */}
      {progress.estimatedQuestionsRemaining > 0 && showDetails && (
        <div className="text-xs text-gray-500">
          Approximately {progress.estimatedQuestionsRemaining} questions remaining
        </div>
      )}
    </div>
  )
}
```

---

## Part 4: Section Status List Component

**File:** `components/conversation/ScopeSectionList.tsx`

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Circle, Loader2 } from 'lucide-react'
import { SCOPE_SECTION_METADATA } from '@/types/scopeProgress'
import type { ScopeProgress, SectionStatus } from '@/types/scopeProgress'

interface ScopeSectionListProps {
  progress: ScopeProgress
  compact?: boolean
  className?: string
}

export function ScopeSectionList({
  progress,
  compact = false,
  className = ''
}: ScopeSectionListProps) {
  const sections = Object.entries(progress.sections).map(([key, status]) => ({
    key,
    status,
    metadata: SCOPE_SECTION_METADATA[key]
  }))
  
  // Sort by section number
  sections.sort((a, b) => a.metadata.number - b.metadata.number)
  
  if (compact) {
    // Compact view: only show current and next sections
    const currentIndex = sections.findIndex(s => s.status === 'in_progress')
    const visibleSections = currentIndex >= 0
      ? sections.slice(Math.max(0, currentIndex - 1), currentIndex + 3)
      : sections.slice(0, 3)
    
    return (
      <div className={`space-y-2 ${className}`}>
        {visibleSections.map((section, idx) => (
          <CompactSectionItem
            key={section.key}
            section={section}
            isActive={section.key === progress.currentSection}
          />
        ))}
      </div>
    )
  }
  
  // Full view: show all sections organized by category
  const categories = groupByCategory(sections)
  
  return (
    <div className={`space-y-6 ${className}`}>
      {Object.entries(categories).map(([category, categorySections]) => (
        <div key={category}>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            {formatCategoryName(category)}
          </h3>
          <div className="space-y-2">
            {categorySections.map(section => (
              <FullSectionItem
                key={section.key}
                section={section}
                isActive={section.key === progress.currentSection}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SectionItemProps {
  section: {
    key: string
    status: SectionStatus
    metadata: typeof SCOPE_SECTION_METADATA[string]
  }
  isActive: boolean
}

function CompactSectionItem({ section, isActive }: SectionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
        isActive ? 'bg-primary/5' : 'bg-transparent'
      }`}
    >
      <StatusIcon status={section.status} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          isActive ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {section.metadata.name}
        </p>
      </div>
    </motion.div>
  )
}

function FullSectionItem({ section, isActive }: SectionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        isActive
          ? 'bg-primary/5 border border-primary/20'
          : 'bg-white border border-gray-200'
      }`}
    >
      <StatusIcon status={section.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500">
            Section {section.metadata.number}
          </span>
          {isActive && (
            <span className="text-xs font-medium text-primary">
              In Progress
            </span>
          )}
        </div>
        <p className={`text-sm font-medium mb-1 ${
          isActive ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {section.metadata.name}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {section.metadata.description}
        </p>
      </div>
    </motion.div>
  )
}

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'complete':
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )
    case 'in_progress':
      return (
        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
        </div>
      )
    case 'not_started':
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
          <Circle className="w-3 h-3 text-gray-400" />
        </div>
      )
  }
}

function groupByCategory(
  sections: Array<{
    key: string
    status: SectionStatus
    metadata: typeof SCOPE_SECTION_METADATA[string]
  }>
): Record<string, typeof sections> {
  return sections.reduce((acc, section) => {
    const category = section.metadata.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(section)
    return acc
  }, {} as Record<string, typeof sections>)
}

function formatCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    overview: 'Overview',
    foundation: 'Foundation',
    business: 'Business Context',
    design: 'Design & Branding',
    content: 'Content Strategy',
    technical: 'Technical Requirements',
    media: 'Media & Interactive',
    features: 'Features & Functionality',
    support: 'Support & Maintenance',
    timeline: 'Timeline & Budget',
    pricing: 'Investment',
    validation: 'Validation'
  }
  return categoryNames[category] || category
}
```

---

## Part 5: Combined Progress Component

**File:** `components/conversation/ScopeProgressPanel.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Info } from 'lucide-react'
import { ScopeProgressBar } from './ScopeProgressBar'
import { ScopeSectionList } from './ScopeSectionList'
import type { ScopeProgress } from '@/types/scopeProgress'

interface ScopeProgressPanelProps {
  progress: ScopeProgress
  variant?: 'full' | 'compact' | 'minimal'
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function ScopeProgressPanel({
  progress,
  variant = 'compact',
  collapsible = false,
  defaultExpanded = false,
  className = ''
}: ScopeProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  if (variant === 'minimal') {
    // Just the progress bar
    return (
      <div className={className}>
        <ScopeProgressBar progress={progress} />
      </div>
    )
  }
  
  if (variant === 'compact') {
    // Progress bar + collapsible section list
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="mb-4">
          <ScopeProgressBar progress={progress} showDetails />
        </div>
        
        {collapsible ? (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="font-medium">Section Progress</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ScopeSectionList progress={progress} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ScopeSectionList progress={progress} compact />
          </div>
        )}
      </div>
    )
  }
  
  // Full view with all sections
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Scope Progress
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
        <ScopeProgressBar progress={progress} showDetails />
      </div>
      
      <ScopeSectionList progress={progress} />
    </div>
  )
}
```

---

## Part 6: Integration with Conversation Flow

**File:** `app/conversation/[id]/layout.tsx` (sidebar with progress)

```typescript
'use client'

import { useConversationStore } from '@/lib/stores/conversationStore'
import { ScopeProgressPanel } from '@/components/conversation/ScopeProgressPanel'
import { progressCalculator } from '@/lib/utils/progressCalculator'
import { useMemo } from 'react'

export default function ConversationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { intelligence } = useConversationStore()
  
  // Calculate progress based on current intelligence
  const progress = useMemo(
    () => progressCalculator.calculateProgress(intelligence),
    [intelligence]
  )
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {children}
          </div>
          
          {/* Sidebar with progress */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Progress panel */}
              <ScopeProgressPanel
                progress={progress}
                variant="compact"
                collapsible
                defaultExpanded={false}
              />
              
              {/* Optional help/support card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Our team is here to assist you with any questions.
                </p>
                <button className="text-xs font-medium text-primary hover:text-primary-dark">
                  Contact Support
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
```

---

## Part 7: Mobile-Responsive Header Progress

**File:** `components/conversation/MobileProgressHeader.tsx`

```typescript
'use client'

import { ScopeProgressBar } from './ScopeProgressBar'
import type { ScopeProgress } from '@/types/scopeProgress'

interface MobileProgressHeaderProps {
  progress: ScopeProgress
  questionNumber: number
  className?: string
}

export function MobileProgressHeader({
  progress,
  questionNumber,
  className = ''
}: MobileProgressHeaderProps) {
  return (
    <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          Question {questionNumber}
        </span>
        <span className="text-xs text-gray-600">
          {progress.sectionsComplete} of 14 sections
        </span>
      </div>
      <ScopeProgressBar progress={progress} />
    </div>
  )
}
```

---

## Part 8: Store Integration

**File:** `lib/stores/conversationStore.ts` (additions)

```typescript
import { progressCalculator } from '@/lib/utils/progressCalculator'
import type { ScopeProgress } from '@/types/scopeProgress'

interface ConversationStore {
  // ... existing state
  scopeProgress: ScopeProgress | null
  
  // ... existing actions
  updateProgress: () => void
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // ... existing state
  scopeProgress: null,
  
  // ... existing actions
  
  // Update progress based on current intelligence
  updateProgress: () => {
    const intelligence = get().intelligence
    const progress = progressCalculator.calculateProgress(intelligence)
    set({ scopeProgress: progress })
  },
  
  // Hook into submitAnswer to update progress
  submitAnswer: async (answer: QuestionAnswer) => {
    // ... existing answer submission logic
    
    // Update progress after answer submitted
    get().updateProgress()
  },
  
  // Hook into submitFeatureSelection to update progress
  submitFeatureSelection: async (selection: FeatureSelection) => {
    // ... existing feature selection logic
    
    // Update progress after features selected
    get().updateProgress()
  }
}))
```

---

## Part 9: Testing Requirements

### Unit Tests

```typescript
// __tests__/progressCalculator.test.ts
describe('ProgressCalculator', () => {
  test('calculates foundation sections as complete with basic info', () => {
    const intelligence: ConversationIntelligence = {
      userName: 'John Doe',
      userEmail: 'john@example.com',
      userPhone: '555-0100',
      companyName: 'Acme Corp',
      websiteType: 'E-commerce',
      industry: 'Retail'
    }
    
    const progress = progressCalculator.calculateProgress(intelligence)
    
    expect(progress.sections.section2_project_classification).toBe('complete')
    expect(progress.sections.section3_client_information).toBe('complete')
  })
  
  test('marks section as in_progress when partially complete', () => {
    const intelligence: ConversationIntelligence = {
      userName: 'John Doe',
      userEmail: 'john@example.com',
      websiteType: 'Portfolio',
      industry: 'Design',
      targetAudience: 'Potential clients',
      // Missing primaryGoal, metrics, etc.
    }
    
    const progress = progressCalculator.calculateProgress(intelligence)
    
    expect(progress.sections.section4_business_context).toBe('in_progress')
  })
  
  test('calculates overall completeness percentage correctly', () => {
    const intelligence: ConversationIntelligence = {
      // Complete first 7 sections (50%)
      userName: 'John',
      userEmail: 'john@example.com',
      userPhone: '555-0100',
      companyName: 'Test Co',
      websiteType: 'Blog',
      industry: 'Tech',
      targetAudience: 'Developers',
      primaryGoal: 'Thought leadership',
      successMetrics: ['Page views', 'Subscribers'],
      problemBeingSolved: 'Share knowledge',
      designStyle: 'Modern',
      existingBrandAssets: ['Logo'],
      contentProvider: 'Client',
      contentReadiness: 'Ready'
    }
    
    const progress = progressCalculator.calculateProgress(intelligence)
    
    expect(progress.overallCompleteness).toBeGreaterThan(40)
    expect(progress.sectionsComplete).toBeGreaterThan(5)
  })
  
  test('estimates remaining questions based on complexity', () => {
    const simpleIntelligence: ConversationIntelligence = {
      websiteType: 'Portfolio',
      // ... minimal data
    }
    
    const complexIntelligence: ConversationIntelligence = {
      websiteType: 'E-commerce',
      selectedFeatures: Array(15).fill('feature')
      // ... more data
    }
    
    const simpleProgress = progressCalculator.calculateProgress(simpleIntelligence)
    const complexProgress = progressCalculator.calculateProgress(complexIntelligence)
    
    expect(simpleProgress.estimatedQuestionsRemaining)
      .toBeLessThan(complexProgress.estimatedQuestionsRemaining)
  })
})
```

### Component Tests

```typescript
// __tests__/ScopeProgressBar.test.tsx
describe('ScopeProgressBar', () => {
  test('renders progress percentage correctly', () => {
    const mockProgress: ScopeProgress = {
      sections: { /* ... */ },
      overallCompleteness: 50,
      sectionsComplete: 7,
      sectionsInProgress: 2,
      sectionsRemaining: 5,
      currentSection: 'section8_media_elements',
      estimatedQuestionsRemaining: 15
    }
    
    const { getByText } = render(
      <ScopeProgressBar progress={mockProgress} />
    )
    
    expect(getByText('50% complete')).toBeInTheDocument()
    expect(getByText('7 of 14 sections')).toBeInTheDocument()
  })
  
  test('animates progress bar width', () => {
    const { container, rerender } = render(
      <ScopeProgressBar progress={{ ...mockProgress, overallCompleteness: 25 }} />
    )
    
    const progressBar = container.querySelector('[class*="bg-gradient"]')
    expect(progressBar).toHaveStyle({ width: '25%' })
    
    rerender(
      <ScopeProgressBar progress={{ ...mockProgress, overallCompleteness: 75 }} />
    )
    
    // Animation should update width
    expect(progressBar).toHaveStyle({ width: '75%' })
  })
})
```

### Integration Tests

```typescript
// __tests__/integration/progressTracking.test.tsx
describe('Progress Tracking Integration', () => {
  test('updates progress in real-time as answers submitted', async () => {
    const { getByText, getByRole } = render(<ConversationPage />)
    
    // Initial state - foundation questions
    expect(getByText(/0% complete/i)).toBeInTheDocument()
    
    // Answer foundation questions
    fireEvent.click(getByText('E-commerce'))
    await waitFor(() => {
      expect(getByText(/14% complete/i)).toBeInTheDocument() // 2/14 sections
    })
    
    // Continue answering
    // ... more interactions
    
    // Check progress increases
    await waitFor(() => {
      expect(getByText(/\d+% complete/i)).toBeInTheDocument()
    })
  })
  
  test('shows current section as in_progress', async () => {
    const { getByText } = render(<ConversationPage />)
    
    // Navigate to business context questions
    // ... answer foundation questions
    
    await waitFor(() => {
      expect(getByText('Business Context')).toBeInTheDocument()
      expect(getByText('In Progress')).toBeInTheDocument()
    })
  })
})
```

---

## Part 10: Performance Optimization

### Memoization

```typescript
// Memoize expensive progress calculations
const progress = useMemo(
  () => progressCalculator.calculateProgress(intelligence),
  [intelligence]
)

// Only recalculate when intelligence changes
// Avoid recalculating on every render
```

### Throttled Updates

```typescript
import { throttle } from 'lodash'

// Throttle progress updates to avoid excessive recalculation
const throttledUpdateProgress = throttle(
  () => store.updateProgress(),
  1000, // Maximum once per second
  { leading: true, trailing: true }
)
```

---

## Part 11: Accessibility

### ARIA Labels

```typescript
// Progress bar
<div
  role="progressbar"
  aria-valuenow={progress.overallCompleteness}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Project scope ${progress.overallCompleteness}% complete`}
>
  {/* Progress bar visual */}
</div>

// Section list
<div
  role="region"
  aria-label="SCOPE.md section progress"
>
  {/* Section list */}
</div>
```

### Live Regions

```typescript
// Announce progress updates to screen readers
<div aria-live="polite" className="sr-only">
  Section {currentSectionNumber} complete. 
  {progress.overallCompleteness}% of project scope gathered.
</div>
```

---

## Part 12: Success Criteria

### Functional Requirements
- ✅ Shows progress through all 14 SCOPE.md sections
- ✅ Updates in real-time as intelligence gathered
- ✅ Calculates percentage based on section completion
- ✅ Identifies current section being worked on
- ✅ Estimates remaining questions dynamically
- ✅ Adapts to project complexity
- ✅ Works on mobile and desktop

### User Experience
- ✅ Progress bar animates smoothly
- ✅ Sections clearly marked (complete/in-progress/not-started)
- ✅ Milestone markers provide visual reference
- ✅ Current section highlighted
- ✅ Collapsible on mobile to save space
- ✅ Estimated time remaining helpful, not overwhelming

### Integration
- ✅ Integrates with Phase 3's sufficiency evaluation
- ✅ Updates after each answer submission
- ✅ Reflects feature selection completion
- ✅ Syncs with conversation store
- ✅ Works with all phases

### Performance
- ✅ Progress calculation < 10ms
- ✅ Re-renders only when intelligence changes
- ✅ Smooth 60fps animations
- ✅ No layout shifts

### Design System
- ✅ 8-point spacing grid
- ✅ Perfect Fourth typography
- ✅ OKLCH colors
- ✅ Framer Motion animations
- ✅ Consistent with existing UI

---

## Part 13: Mobile Responsive Strategy

### Breakpoints

```typescript
// Desktop (1024px+): Full sidebar with progress
<ScopeProgressPanel variant="compact" collapsible />

// Tablet (768px - 1023px): Sticky header with minimal progress
<MobileProgressHeader progress={progress} questionNumber={questionNumber} />

// Mobile (< 768px): Sticky minimal progress bar only
<ScopeProgressBar progress={progress} className="sticky top-0" />
```

---

## Part 14: Files to Create

```
src/
├── types/
│   └── scopeProgress.ts                    ← NEW
│
├── lib/
│   └── utils/
│       └── progressCalculator.ts           ← NEW
│
├── components/
│   └── conversation/
│       ├── ScopeProgressBar.tsx            ← NEW
│       ├── ScopeSectionList.tsx            ← NEW
│       ├── ScopeProgressPanel.tsx          ← NEW
│       └── MobileProgressHeader.tsx        ← NEW
│
├── lib/
│   └── stores/
│       └── conversationStore.ts            ← EXTEND
│
└── __tests__/
    ├── progressCalculator.test.ts          ← NEW
    ├── ScopeProgressBar.test.tsx           ← NEW
    ├── ScopeSectionList.test.tsx           ← NEW
    └── integration/
        └── progressTracking.test.tsx       ← NEW
```

---

## Next Steps

After Phase 7 completion:

1. **Phase 8**: Validation & Confirmation Screens
   - Display Claude's understanding validation
   - Feature conflict resolution UI
   - Assumption clarification screens
   - Populate Section 14 (Validation Outcomes)

2. **Phase 9**: Complete SCOPE.md Generation
   - Implement all 14 sections
   - Feature Library pricing integration
   - Document validation
   - PDF generation

3. **Phase 10**: Email Delivery & Completion
   - Send documents to David and client
   - Completion screen
   - Next steps communication

---

**Phase 7 provides transparent progress tracking through the 14 SCOPE.md sections, building user confidence and reducing abandonment through visible momentum. Once complete, users will see exactly where they are in the journey and how much value they've already provided.**

Ready to implement? Start with progressCalculator.ts to establish the logic, then ScopeProgressBar.tsx for the visual component, then integration with the conversation flow.
