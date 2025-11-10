// Phase 9: Client Summary Generator (PDF-Friendly)
// Generates client-friendly summary from SCOPE.md

import type { ConversationIntelligence } from '@/types/conversation'
import type { ScopeDocument, ClientSummary } from '@/types/scope'

export class ClientSummaryGenerator {
  /**
   * Generate client-friendly summary from SCOPE.md
   */
  generateClientSummary(
    scope: ScopeDocument,
    intelligence: ConversationIntelligence
  ): ClientSummary {
    return {
      projectName: scope.section1_executiveSummary.projectName,
      clientName: scope.section3_clientInformation.fullName,
      summaryDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      
      overview: {
        websiteType: scope.section1_executiveSummary.websiteType,
        primaryGoal: scope.section1_executiveSummary.primaryGoal,
        targetAudience: scope.section1_executiveSummary.targetAudience
      },
      
      keyFeatures: this.extractKeyFeatures(scope),
      
      investmentSummary: {
        totalInvestment: scope.section13_investmentSummary.totalProjectInvestment,
        monthlyHosting: scope.section13_investmentSummary.hosting.monthlyPrice,
        estimatedTimeline: scope.section12_timeline.estimatedDuration
      },
      
      nextSteps: this.generateNextSteps(scope, intelligence)
    }
  }
  
  private extractKeyFeatures(scope: ScopeDocument): string[] {
    const features: string[] = []
    
    // Add base package features (top 3)
    features.push(...scope.section10_featuresBreakdown.basePackage.includedFeatures.slice(0, 3))
    
    // Add add-on features (top 3)
    const addOns = scope.section10_featuresBreakdown.addOnFeatures
      .slice(0, 3)
      .map(f => f.name)
    features.push(...addOns)
    
    return features
  }
  
  private generateNextSteps(scope: ScopeDocument, intelligence: ConversationIntelligence): string[] {
    return [
      'Review this summary and the detailed SCOPE document',
      'Sign the project contract',
      'Submit initial deposit (50%)',
      `Begin content preparation: ${scope.section6_contentStrategy.contentProvider === 'client' ? 'gather all content, images, and copy' : 'coordinate with Applicreations on content needs'}`,
      'Schedule kickoff meeting to finalize project timeline'
    ]
  }
  
  /**
   * Generate HTML for PDF conversion
   */
  generateHTML(summary: ClientSummary): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${summary.projectName} - Project Summary</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
      padding: 60px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      padding-bottom: 40px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 40px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 8px;
    }
    
    .tagline {
      font-size: 14px;
      color: #6b7280;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 40px 0 16px 0;
    }
    
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 40px;
    }
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 32px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .overview {
      background: #f9fafb;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    
    .overview-item {
      margin-bottom: 16px;
    }
    
    .overview-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .overview-value {
      font-size: 16px;
      color: #111827;
    }
    
    .features-list {
      list-style: none;
      padding-left: 0;
    }
    
    .features-list li {
      padding: 12px 0 12px 32px;
      position: relative;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
      font-size: 18px;
    }
    
    .investment-summary {
      background: #eff6ff;
      padding: 24px;
      border-radius: 8px;
      margin: 24px 0;
    }
    
    .investment-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #dbeafe;
    }
    
    .investment-row:last-child {
      border-bottom: none;
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px solid #2563eb;
    }
    
    .investment-label {
      font-size: 16px;
      color: #1f2937;
    }
    
    .investment-value {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .investment-row:last-child .investment-value {
      color: #2563eb;
      font-size: 24px;
    }
    
    .next-steps {
      counter-reset: step;
      list-style: none;
      padding-left: 0;
    }
    
    .next-steps li {
      counter-increment: step;
      padding: 16px 0 16px 48px;
      position: relative;
      border-left: 2px solid #e5e7eb;
      margin-left: 20px;
    }
    
    .next-steps li:before {
      content: counter(step);
      position: absolute;
      left: -22px;
      top: 16px;
      width: 40px;
      height: 40px;
      background: #2563eb;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    
    @media print {
      body {
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">APPLICREATIONS</div>
    <div class="tagline">Professional Web Development</div>
  </div>
  
  <h1>${summary.projectName}</h1>
  <div class="subtitle">Project Summary | ${summary.summaryDate}</div>
  
  <div class="overview">
    <div class="overview-item">
      <div class="overview-label">Project Type</div>
      <div class="overview-value">${summary.overview.websiteType}</div>
    </div>
    
    <div class="overview-item">
      <div class="overview-label">Primary Goal</div>
      <div class="overview-value">${summary.overview.primaryGoal}</div>
    </div>
    
    <div class="overview-item">
      <div class="overview-label">Target Audience</div>
      <div class="overview-value">${summary.overview.targetAudience}</div>
    </div>
  </div>
  
  <h2>Key Features</h2>
  <ul class="features-list">
    ${summary.keyFeatures.map(feature => `<li>${feature}</li>`).join('\n    ')}
  </ul>
  
  <h2>Investment Summary</h2>
  <div class="investment-summary">
    <div class="investment-row">
      <span class="investment-label">Project Development</span>
      <span class="investment-value">$${summary.investmentSummary.totalInvestment.toLocaleString()}</span>
    </div>
    
    <div class="investment-row">
      <span class="investment-label">Monthly Hosting</span>
      <span class="investment-value">$${summary.investmentSummary.monthlyHosting}/month</span>
    </div>
    
    <div class="investment-row">
      <span class="investment-label">Estimated Timeline</span>
      <span class="investment-value">${summary.investmentSummary.estimatedTimeline}</span>
    </div>
  </div>
  
  <h2>Next Steps</h2>
  <ol class="next-steps">
    ${summary.nextSteps.map(step => `<li>${step}</li>`).join('\n    ')}
  </ol>
  
  <div class="footer">
    <p>For questions or to proceed, contact David at Applicreations</p>
    <p>Email: david@applicreations.com | Phone: (555) 123-4567</p>
  </div>
</body>
</html>
    `.trim()
  }
}

export const clientSummaryGenerator = new ClientSummaryGenerator()

