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
    <div className={`space-y-6 ${className}`} role="region" aria-label="SCOPE.md section progress">
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

