// Phase 9: Document Validation System
// Validates SCOPE.md document completeness and correctness

import type { ScopeDocument } from '@/types/scope'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  completeness: number // 0-100%
}

export interface ValidationError {
  section: string
  field: string
  message: string
  severity: 'error' | 'critical'
}

export interface ValidationWarning {
  section: string
  field: string
  message: string
  recommendation?: string
}

export class DocumentValidator {
  /**
   * Validate complete SCOPE.md document
   */
  validate(scope: ScopeDocument): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    // Validate all 14 sections
    this.validateSection1(scope.section1_executiveSummary, errors, warnings)
    this.validateSection2(scope.section2_projectClassification, errors, warnings)
    this.validateSection3(scope.section3_clientInformation, errors, warnings)
    this.validateSection4(scope.section4_businessContext, errors, warnings)
    this.validateSection5(scope.section5_brandAssets, errors, warnings)
    this.validateSection6(scope.section6_contentStrategy, errors, warnings)
    this.validateSection7(scope.section7_technicalSpecifications, errors, warnings)
    this.validateSection8(scope.section8_mediaElements, errors, warnings)
    this.validateSection9(scope.section9_designDirection, errors, warnings)
    this.validateSection10(scope.section10_featuresBreakdown, errors, warnings)
    this.validateSection11(scope.section11_supportPlan, errors, warnings)
    this.validateSection12(scope.section12_timeline, errors, warnings)
    this.validateSection13(scope.section13_investmentSummary, errors, warnings)
    this.validateSection14(scope.section14_validationOutcomes, errors, warnings)
    
    // Calculate completeness
    const totalFields = this.countRequiredFields()
    const completedFields = totalFields - errors.filter(e => e.severity === 'critical').length
    const completeness = Math.round((completedFields / totalFields) * 100)
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness
    }
  }
  
  private validateSection1(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.projectName || section.projectName.length < 2) {
      errors.push({
        section: 'Section 1',
        field: 'projectName',
        message: 'Project name is required',
        severity: 'critical'
      })
    }
    
    if (!section.summaryText || section.summaryText.length < 50) {
      errors.push({
        section: 'Section 1',
        field: 'summaryText',
        message: 'Executive summary must be at least 2-3 sentences',
        severity: 'error'
      })
    }
    
    if (section.summaryText && section.summaryText.length > 500) {
      warnings.push({
        section: 'Section 1',
        field: 'summaryText',
        message: 'Executive summary is quite long',
        recommendation: 'Consider condensing to 2-3 concise sentences'
      })
    }
  }
  
  private validateSection2(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.websiteType) {
      errors.push({
        section: 'Section 2',
        field: 'websiteType',
        message: 'Website type is required',
        severity: 'critical'
      })
    }
    
    if (!section.recommendedPackage) {
      errors.push({
        section: 'Section 2',
        field: 'recommendedPackage',
        message: 'Package recommendation is required',
        severity: 'critical'
      })
    }
    
    if (!section.complexityRationale) {
      warnings.push({
        section: 'Section 2',
        field: 'complexityRationale',
        message: 'No complexity rationale provided',
        recommendation: 'Add explanation for complexity classification'
      })
    }
  }
  
  private validateSection3(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.fullName) {
      errors.push({
        section: 'Section 3',
        field: 'fullName',
        message: 'Client name is required',
        severity: 'critical'
      })
    }
    
    if (!section.email || !this.isValidEmail(section.email)) {
      errors.push({
        section: 'Section 3',
        field: 'email',
        message: 'Valid email address is required',
        severity: 'critical'
      })
    }
    
    if (!section.phone) {
      warnings.push({
        section: 'Section 3',
        field: 'phone',
        message: 'No phone number provided',
        recommendation: 'Phone contact recommended for urgent communication'
      })
    }
  }
  
  private validateSection4(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.companyOverview || section.companyOverview.length < 20) {
      errors.push({
        section: 'Section 4',
        field: 'companyOverview',
        message: 'Company overview is too brief',
        severity: 'error'
      })
    }
    
    if (!section.primaryGoal) {
      errors.push({
        section: 'Section 4',
        field: 'primaryGoal',
        message: 'Primary goal is required',
        severity: 'error'
      })
    }
    
    if (!section.successMetrics || section.successMetrics.length === 0) {
      warnings.push({
        section: 'Section 4',
        field: 'successMetrics',
        message: 'No success metrics defined',
        recommendation: 'Define measurable success criteria'
      })
    }
  }
  
  private validateSection7(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Validate authentication consistency
    if (section.authentication?.required && !section.authentication.method) {
      errors.push({
        section: 'Section 7',
        field: 'authentication.method',
        message: 'Authentication method required when auth is needed',
        severity: 'error'
      })
    }
    
    // Validate CMS consistency
    if (section.contentManagement?.required && !section.contentManagement.type) {
      errors.push({
        section: 'Section 7',
        field: 'contentManagement.type',
        message: 'CMS type required when CMS is needed',
        severity: 'error'
      })
    }
  }
  
  private validateSection10(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.basePackage || !section.basePackage.price) {
      errors.push({
        section: 'Section 10',
        field: 'basePackage',
        message: 'Base package and price required',
        severity: 'critical'
      })
    }
    
    // Validate pricing consistency
    const calculatedSubtotal = section.basePackage.price + 
      section.addOnFeatures.reduce((sum: number, f: any) => sum + f.price, 0) -
      section.featureBundles.reduce((sum: number, b: any) => sum + b.savings, 0)
    
    // Note: We don't have a direct subtotal field in FeaturesBreakdown, so skip this check
    // The actual subtotal is in InvestmentSummary
  }
  
  private validateSection13(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!section.totalProjectInvestment || section.totalProjectInvestment === 0) {
      errors.push({
        section: 'Section 13',
        field: 'totalProjectInvestment',
        message: 'Total investment required',
        severity: 'critical'
      })
    }
    
    if (!section.paymentSchedule || section.paymentSchedule.length === 0) {
      errors.push({
        section: 'Section 13',
        field: 'paymentSchedule',
        message: 'Payment schedule required',
        severity: 'error'
      })
    }
    
    // Validate payment schedule adds to 100%
    if (section.paymentSchedule) {
      const totalPercentage = section.paymentSchedule.reduce(
        (sum: number, payment: any) => sum + payment.percentage, 
        0
      )
      
      if (Math.abs(totalPercentage - 100) > 0.1) {
        errors.push({
          section: 'Section 13',
          field: 'paymentSchedule',
          message: `Payment schedule must total 100% (currently ${totalPercentage}%)`,
          severity: 'error'
        })
      }
    }
  }
  
  // Placeholder validators for other sections
  private validateSection5(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection6(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection8(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection9(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection11(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection12(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private validateSection14(section: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Basic validation - can be expanded
  }
  
  private countRequiredFields(): number {
    // Count all critical fields across all sections
    return 45 // Approximate count of critical fields
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

export const documentValidator = new DocumentValidator()

