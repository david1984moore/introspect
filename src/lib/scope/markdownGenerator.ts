// Phase 9: Markdown Generator (Human-Readable SCOPE.md)
// Converts ScopeDocument to formatted markdown

import type { 
  ScopeDocument,
  ExecutiveSummary,
  ProjectClassification,
  ClientInformation,
  BusinessContext,
  BrandAssets,
  ContentStrategy,
  TechnicalSpecifications,
  MediaElements,
  DesignDirection,
  FeaturesBreakdown,
  SupportPlan,
  Timeline,
  InvestmentSummary,
  ValidationOutcomes
} from '@/types/scope'

export class MarkdownGenerator {
  /**
   * Generate complete SCOPE.md markdown document
   */
  generateMarkdown(scope: ScopeDocument): string {
    const sections = [
      this.generateHeader(scope),
      this.generateSection1(scope.section1_executiveSummary),
      this.generateSection2(scope.section2_projectClassification),
      this.generateSection3(scope.section3_clientInformation),
      this.generateSection4(scope.section4_businessContext),
      this.generateSection5(scope.section5_brandAssets),
      this.generateSection6(scope.section6_contentStrategy),
      this.generateSection7(scope.section7_technicalSpecifications),
      this.generateSection8(scope.section8_mediaElements),
      this.generateSection9(scope.section9_designDirection),
      this.generateSection10(scope.section10_featuresBreakdown),
      this.generateSection11(scope.section11_supportPlan),
      this.generateSection12(scope.section12_timeline),
      this.generateSection13(scope.section13_investmentSummary),
      this.generateSection14(scope.section14_validationOutcomes),
      this.generateFooter(scope)
    ]
    
    return sections.join('\n\n---\n\n')
  }
  
  private generateHeader(scope: ScopeDocument): string {
    return `# PROJECT SCOPE DOCUMENT

**Generated:** ${new Date(scope.generatedAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}  
**Version:** ${scope.version}  
**Conversation ID:** ${scope.conversationId}

---

> **FOR DEVELOPER USE**  
> This document contains complete technical specifications for building this project.  
> All requirements have been gathered and validated with the client.  
> No additional clarification should be needed to begin development.`
  }
  
  private generateSection1(section: ExecutiveSummary): string {
    return `## Section 1: Executive Summary

**Project Name:** ${section.projectName}  
**Website Type:** ${section.websiteType}  
**Primary Goal:** ${section.primaryGoal}  
**Target Audience:** ${section.targetAudience}

### Overview

${section.summaryText}

**Key Differentiator:** ${section.keyDifferentiator}`
  }
  
  private generateSection2(section: ProjectClassification): string {
    return `## Section 2: Project Classification

**Website Type:** ${section.websiteType}  
**Industry:** ${section.industry}  
${section.businessModel ? `**Business Model:** ${section.businessModel}` : ''}  
**Project Complexity:** ${section.projectComplexity.toUpperCase()}  
**Recommended Package:** ${section.recommendedPackage.toUpperCase()} ($${section.packagePrice.toLocaleString()})

### Complexity Rationale

${section.complexityRationale}`
  }
  
  private generateSection3(section: ClientInformation): string {
    return `## Section 3: Client Information

**Name:** ${section.fullName}  
**Email:** ${section.email}  
**Phone:** ${section.phone}  
**Company:** ${section.companyName}  
${section.decisionMakerRole ? `**Role:** ${section.decisionMakerRole}` : ''}
${section.preferredContactMethod ? `**Preferred Contact:** ${section.preferredContactMethod}` : ''}`
  }
  
  private generateSection4(section: BusinessContext): string {
    return `## Section 4: Business Context

### Company Overview

${section.companyOverview}

### Target Audience

**Description:** ${section.targetAudience.description}  
**Technical Level:** ${section.targetAudience.technicalLevel}  
**Primary Needs:**
${section.targetAudience.primaryNeeds.map((need: string) => `- ${need}`).join('\n') || '- To be determined'}

### Primary Goal

${section.primaryGoal}

### Success Metrics

${section.successMetrics.map((metric: any) => `
**${metric.metric}**  
${metric.target ? `Target: ${metric.target}  ` : ''}
Measurement: ${metric.measurement}
`).join('\n')}

### Value Proposition

${section.valueProposition}

### Pain Points

${section.painPoints.map((pain: string) => `- ${pain}`).join('\n') || '- To be identified during discovery'}`
  }
  
  private generateSection5(section: BrandAssets): string {
    return `## Section 5: Brand Assets & Identity

### Existing Assets

- **Logo:** ${section.existingAssets.logo ? 'Yes ✓' : 'No ✗'}
- **Color Palette:** ${section.existingAssets.colorPalette ? 'Yes ✓' : 'No ✗'}
- **Fonts:** ${section.existingAssets.fonts ? 'Yes ✓' : 'No ✗'}
- **Style Guide:** ${section.existingAssets.styleGuide ? 'Yes ✓' : 'No ✗'}
- **Imagery:** ${section.existingAssets.imagery ? 'Yes ✓' : 'No ✗'}

### Brand Style

${section.brandStyle}

### Assets Needing Creation

${section.whatNeedsCreation.map((item: string) => `- ${item}`).join('\n') || '- All assets provided'}

${section.inspirationReferences && section.inspirationReferences.length > 0 ? `
### Inspiration References

${section.inspirationReferences.map((ref: any) => `
**${ref.url}**  
${ref.notes}
`).join('\n')}
` : ''}`
  }
  
  private generateSection6(section: ContentStrategy): string {
    return `## Section 6: Content Strategy

**Content Provider:** ${section.contentProvider.toUpperCase()}  
**Content Readiness:** ${section.contentReadiness.toUpperCase()}  
**Update Frequency:** ${section.updateFrequency.toUpperCase()}

### Maintenance Plan

${section.maintenancePlan}

### Content Types

${section.contentTypes.map((type: string) => `- ${type}`).join('\n')}

### Additional Services

- **Copywriting Needed:** ${section.copywritingNeeded ? 'Yes' : 'No'}
- **Photography Needed:** ${section.photographyNeeded ? 'Yes' : 'No'}`
  }
  
  private generateSection7(section: TechnicalSpecifications): string {
    let content = `## Section 7: Technical Specifications

### Authentication

${section.authentication?.required ? `
**Required:** Yes  
**Method:** ${section.authentication.method?.replace(/_/g, ' ').toUpperCase()}  
${section.authentication.providers ? `**Providers:** ${section.authentication.providers.join(', ')}` : ''}
${section.authentication.userRoles ? `**User Roles:** ${section.authentication.userRoles.join(', ')}` : ''}
` : '**Required:** No'}

### Content Management

${section.contentManagement.required ? `
**Required:** Yes  
**Type:** ${section.contentManagement.type?.toUpperCase()}  
**Update Frequency:** ${section.contentManagement.updateFrequency}  
${section.contentManagement.editors ? `**Number of Editors:** ${section.contentManagement.editors}` : ''}
` : '**Required:** No'}

### Search Functionality

${section.search.required ? `
**Required:** Yes  
${section.search.scope ? `**Scope:** ${section.search.scope.join(', ')}` : ''}
${section.search.filters ? `**Filters:** ${section.search.filters.join(', ')}` : ''}
` : '**Required:** No'}`
    
    // Add website-type-specific features
    if (Object.keys(section.websiteTypeFeatures).length > 0) {
      content += `\n\n### Website-Type-Specific Features\n\n`
      content += JSON.stringify(section.websiteTypeFeatures, null, 2)
        .split('\n')
        .map(line => line.replace(/[{}"]/g, ''))
        .filter(line => line.trim())
        .join('\n')
    }
    
    // Add integrations
    if (section.integrations.length > 0) {
      content += `\n\n### Integrations\n\n`
      content += section.integrations.map((int: any) => `
**${int.service}**  
Purpose: ${int.purpose}  
${int.provider ? `Provider: ${int.provider}` : ''}
`).join('\n')
    }
    
    // Add compliance
    if (section.compliance.required.length > 0) {
      content += `\n\n### Compliance Requirements\n\n`
      content += section.compliance.required.map((req: string) => `- ${req}`).join('\n')
      if (section.compliance.level) {
        content += `\n**Level:** ${section.compliance.level}`
      }
    }
    
    // Add security
    content += `\n\n### Security\n\n`
    content += `- **SSL Required:** Yes (included)\n`
    if (section.security.additionalRequirements && section.security.additionalRequirements.length > 0) {
      content += section.security.additionalRequirements.map((req: string) => `- ${req}`).join('\n')
    }
    
    // Add performance
    content += `\n\n### Performance Requirements\n\n`
    content += `**Expected Traffic:** ${section.performance.expectedTraffic}\n\n`
    content += `**Critical Metrics:**\n`
    content += section.performance.criticalMetrics.map((metric: string) => `- ${metric}`).join('\n')
    if (section.performance.cachingStrategy) {
      content += `\n\n**Caching Strategy:** ${section.performance.cachingStrategy}`
    }
    
    return content
  }
  
  private generateSection8(section: MediaElements): string {
    let content = `## Section 8: Media & Interactive Elements\n\n`
    
    if (section.video?.required) {
      content += `### Video\n\n`
      content += `**Hosting:** ${section.video.hosting}\n`
      content += `**Autoplay:** ${section.video.autoplay ? 'Yes' : 'No'}\n`
      content += `**Background Video:** ${section.video.backgroundVideo ? 'Yes' : 'No'}\n\n`
    }
    
    if (section.galleries?.required) {
      content += `### Image Galleries\n\n`
      content += `**Types:** ${section.galleries.type?.join(', ')}\n`
      content += `**Estimated Images:** ${section.galleries.imageCount || 'TBD'}\n\n`
    }
    
    if (section.animations?.required) {
      content += `### Animations\n\n`
      content += `**Types:** ${section.animations.type?.join(', ')}\n`
      content += `**Complexity:** ${section.animations.complexity}\n\n`
    }
    
    if (section.interactiveElements && section.interactiveElements.length > 0) {
      content += `### Interactive Elements\n\n`
      content += section.interactiveElements.map((elem: any) => `
**${elem.type}**  
${elem.description}  
Complexity: ${elem.complexity}
`).join('\n')
    }
    
    if (section.audio?.required) {
      content += `\n### Audio\n\n`
      content += `**Type:** ${section.audio.type}\n`
    }
    
    if (section.maps?.required) {
      content += `\n### Maps\n\n`
      content += `**Provider:** ${section.maps.provider}\n`
      content += `**Features:** ${section.maps.features?.join(', ')}\n`
    }
    
    if (content === `## Section 8: Media & Interactive Elements\n\n`) {
      content += `No special media or interactive elements required.\n`
    }
    
    return content
  }
  
  private generateSection9(section: DesignDirection): string {
    return `## Section 9: Design Direction

### Overall Style

${section.overallStyle}

### Color Scheme

${section.colorScheme?.primary ? `**Primary:** ${section.colorScheme.primary}` : ''}
${section.colorScheme?.secondary ? `**Secondary:** ${section.colorScheme.secondary}` : ''}
**Direction:** ${section.colorScheme?.direction || 'To be determined'}

### Typography

${section.typography?.style ? `**Style:** ${section.typography.style}` : ''}
**Readability:** ${section.typography?.readability || 'High priority'}

### Layout

${section.layout.preference ? `**Preference:** ${section.layout.preference}` : ''}
**Whitespace:** ${section.layout.whitespace}
${section.layout.gridStyle ? `**Grid Style:** ${section.layout.gridStyle}` : ''}

${section.references && section.references.length > 0 ? `
### Design References

${section.references.map((ref: any) => `
**${ref.url}**  
Notable elements: ${ref.elements.join(', ')}
${ref.notes ? `Notes: ${ref.notes}` : ''}
`).join('\n')}
` : ''}

### Design Priorities

${section.designPriorities.map((priority: string) => `- ${priority}`).join('\n')}`
  }
  
  private generateSection10(section: FeaturesBreakdown): string {
    let content = `## Section 10: Features & Functionality Breakdown

### Base Package

**${section.basePackage.name} Package** - $${section.basePackage.price.toLocaleString()}

Included features:
${section.basePackage.includedFeatures.map((feature: string) => `- ${feature}`).join('\n')}

### Add-On Features

${section.addOnFeatures.length > 0 ? section.addOnFeatures.map((feature: any) => `
**${feature.name}** - $${feature.price.toLocaleString()}  
${feature.description}  
*Rationale:* ${feature.rationale}
`).join('\n') : 'No add-on features selected.'}

`
    
    if (section.featureBundles.length > 0) {
      content += `### Feature Bundles (Discounts Applied)\n\n`
      content += section.featureBundles.map((bundle: any) => `
**${bundle.name}**  
Features: ${bundle.features.join(', ')}  
Original: $${bundle.originalPrice.toLocaleString()}  
Discounted: $${bundle.discountedPrice.toLocaleString()}  
**Savings: $${bundle.savings.toLocaleString()}**
`).join('\n')
    }
    
    if (section.conflicts.length > 0) {
      content += `\n### Conflicts Resolved\n\n`
      content += section.conflicts.map((conflict: any) => `
- **${conflict.featureA}** vs **${conflict.featureB}**  
  Resolution: ${conflict.resolution}
`).join('\n')
    }
    
    if (section.dependencies.length > 0) {
      content += `\n### Feature Dependencies\n\n`
      content += section.dependencies.map((dep: any) => `
**${dep.feature}**  
Requires: ${dep.requires.join(', ')}  
Reason: ${dep.reason}
`).join('\n')
    }
    
    return content
  }
  
  private generateSection11(section: SupportPlan): string {
    return `## Section 11: Post-Launch Support Plan

**Support Duration:** ${section.supportDuration}

### Training

${section.training.required ? `
**Required:** Yes  
**Topics:** ${section.training.topics?.join(', ')}  
**Format:** ${section.training.format}  
**Duration:** ${section.training.duration}
` : '**Required:** No'}

### Maintenance Plan

**Provider:** ${section.maintenancePlan.provider.toUpperCase()}  
**Frequency:** ${section.maintenancePlan.frequency}

Includes:
${section.maintenancePlan.includes.map((item: string) => `- ${item}`).join('\n')}

${section.futurePhases && section.futurePhases.length > 0 ? `
### Future Enhancement Phases

${section.futurePhases.map((phase: any) => `
**${phase.name}**  
${phase.description}  
Estimated Timing: ${phase.estimatedTiming}
`).join('\n')}
` : ''}

### Hosting

**Tier:** ${section.hosting.tier}  
**Monthly Price:** $${section.hosting.monthlyPrice}/month

Includes:
${section.hosting.includes.map((item: string) => `- ${item}`).join('\n')}`
  }
  
  private generateSection12(section: Timeline): string {
    return `## Section 12: Project Timeline

${section.desiredLaunchDate ? `**Desired Launch Date:** ${section.desiredLaunchDate}` : ''}  
**Estimated Duration:** ${section.estimatedDuration}

### Milestones

${section.milestones.map((milestone: any) => `
**${milestone.name}** (${milestone.duration})  
${milestone.description}
${milestone.dependencies ? `Dependencies: ${milestone.dependencies.join(', ')}` : ''}
${milestone.clientResponsibility ? `*Client Responsibility:* ${milestone.clientResponsibility}` : ''}
`).join('\n')}

### Critical Path

${section.criticalPath.map((item: string) => `1. ${item}`).join('\n')}

${section.risks.length > 0 ? `
### Risks & Mitigation

${section.risks.map((risk: any) => `
**Risk:** ${risk.risk}  
**Mitigation:** ${risk.mitigation}
`).join('\n')}
` : ''}`
  }
  
  private generateSection13(section: InvestmentSummary): string {
    let content = `## Section 13: Investment Summary

### Project Investment

**Base Package:** ${section.basePackage.name} - $${section.basePackage.price.toLocaleString()}

${section.addOnFeatures.length > 0 ? `
**Add-On Features:**
${section.addOnFeatures.map((feature: any) => `- ${feature.name}: $${feature.price.toLocaleString()}`).join('\n')}
` : ''}

${section.bundleDiscounts.length > 0 ? `
**Bundle Discounts:**
${section.bundleDiscounts.map((discount: any) => `- ${discount.name}: -$${discount.discount.toLocaleString()}`).join('\n')}
` : ''}

**Subtotal:** $${section.subtotal.toLocaleString()}

### Hosting (Recurring)

**${section.hosting.tier} Hosting**  
- Monthly: $${section.hosting.monthlyPrice}/month
- Annual: $${section.hosting.annualPrice}/year

### Total Investment

**One-Time Project Cost:** $${section.totalProjectInvestment.toLocaleString()}  
**First Year Total (incl. hosting):** $${section.totalFirstYearInvestment.toLocaleString()}

`
    
    if (section.roi?.calculable) {
      content += `### Return on Investment\n\n`
      if (section.roi.metrics) {
        Object.entries(section.roi.metrics).forEach(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').trim()
          content += `**${label}:** $${(value as number).toLocaleString()}\n`
        })
      }
      content += `\n**Estimated ROI:** ${section.roi.estimatedROI}\n`
      content += `**Payback Period:** ${section.roi.paybackPeriod}\n\n`
    }
    
    content += `### Payment Schedule\n\n`
    content += section.paymentSchedule.map((payment: any) => `
**${payment.milestone}** (${payment.percentage}%)  
Amount: $${payment.amount.toLocaleString()}
`).join('\n')
    
    return content
  }
  
  private generateSection14(section: ValidationOutcomes): string {
    let content = `## Section 14: Validation Outcomes\n\n`
    
    if (section.understandingValidations.length > 0) {
      content += `### Understanding Validations\n\n`
      content += section.understandingValidations.map((val: any) => `
**${val.category}**  
${val.confirmed ? '✓ Confirmed' : '✗ Corrected'}  
${val.corrections ? `Corrections: ${JSON.stringify(val.corrections)}` : ''}
Final: ${val.finalSummary}
`).join('\n')
    }
    
    if (section.conflictsResolved.length > 0) {
      content += `\n### Conflicts Resolved\n\n`
      content += section.conflictsResolved.map((conflict: any) => `
**Conflict:** ${conflict.description}  
**Resolution:** ${conflict.resolution}  
*Resolved: ${new Date(conflict.timestamp).toLocaleDateString()}*
`).join('\n')
    }
    
    if (section.assumptionsClarified.length > 0) {
      content += `\n### Assumptions Clarified\n\n`
      content += section.assumptionsClarified.map((assumption: any) => `
**Assumption:** ${assumption.assumption}  
${assumption.confirmed ? '✓ Confirmed' : `✗ Clarified: ${assumption.clarification}`}
`).join('\n')
    }
    
    if (section.keyDecisions.length > 0) {
      content += `\n### Key Decisions\n\n`
      content += section.keyDecisions.map((decision: any) => `
**${decision.decision}**  
Rationale: ${decision.rationale}
`).join('\n')
    }
    
    if (content === `## Section 14: Validation Outcomes\n\n`) {
      content += `No validations or conflicts during conversation.\n`
    }
    
    return content
  }
  
  private generateFooter(scope: ScopeDocument): string {
    return `---

## Document Information

**Generated:** ${new Date(scope.generatedAt).toISOString()}  
**Version:** ${scope.version}  
**Conversation ID:** ${scope.conversationId}

---

*This document was automatically generated by Introspect V3, Applicreations' AI-powered client intake system. All information has been validated with the client through interactive conversation.*`
  }
}

export const markdownGenerator = new MarkdownGenerator()

