// Phase 10: Email Service (Resend Integration)
import { Resend } from 'resend'
import type { 
  EmailDelivery, 
  EmailAttachment, 
  ScopeMdEmail, 
  ClientSummaryEmail,
  EmailTemplate 
} from '@/types/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailService {
  private readonly FROM_EMAIL = process.env.INTROSPECT_FROM_EMAIL || 'Introspect <introspect@applicreations.com>'
  private readonly DAVID_EMAIL = process.env.DAVID_EMAIL || 'david@applicreations.com'
  private readonly MAX_RETRIES = 3
  
  /**
   * Send SCOPE.md to David
   */
  async sendScopeMdToDavid(data: ScopeMdEmail): Promise<EmailDelivery> {
    const delivery: EmailDelivery = {
      id: `email_${Date.now()}_david`,
      conversationId: data.conversationId,
      recipientType: 'david',
      recipientEmail: data.to,
      recipientName: 'David',
      emailType: 'scope_md',
      status: 'pending',
      retryCount: 0
    }
    
    try {
      const template = this.generateScopeMdTemplate(data)
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: data.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: template.attachments?.map(att => ({
          filename: att.filename,
          content: typeof att.content === 'string' 
            ? Buffer.from(att.content, att.encoding === 'base64' ? 'base64' : 'utf-8')
            : att.content,
        })) || []
      })
      
      delivery.status = 'sent'
      delivery.sentAt = new Date().toISOString()
      
      // Resend provides message ID for tracking
      console.log('SCOPE.md sent to David:', result.data?.id)
      
      return delivery
      
    } catch (error) {
      console.error('Failed to send SCOPE.md to David:', error)
      
      delivery.status = 'failed'
      delivery.failureReason = error instanceof Error ? error.message : 'Unknown error'
      
      // Retry logic
      if (delivery.retryCount < this.MAX_RETRIES) {
        delivery.retryCount++
        delivery.lastRetryAt = new Date().toISOString()
        
        // Exponential backoff: 5s, 25s, 125s
        const delay = 5000 * Math.pow(5, delivery.retryCount - 1)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.sendScopeMdToDavid(data)
      }
      
      throw error
    }
  }
  
  /**
   * Send client summary PDF to user
   */
  async sendClientSummary(data: ClientSummaryEmail): Promise<EmailDelivery> {
    const delivery: EmailDelivery = {
      id: `email_${Date.now()}_client`,
      conversationId: data.to, // Use email as temp ID
      recipientType: 'client',
      recipientEmail: data.to,
      recipientName: data.clientName,
      emailType: 'client_summary',
      status: 'pending',
      retryCount: 0
    }
    
    try {
      const template = this.generateClientSummaryTemplate(data)
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: data.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: template.attachments?.map(att => ({
          filename: att.filename,
          content: typeof att.content === 'string' 
            ? Buffer.from(att.content, att.encoding === 'base64' ? 'base64' : 'utf-8')
            : att.content,
        })) || []
      })
      
      delivery.status = 'sent'
      delivery.sentAt = new Date().toISOString()
      
      console.log('Client summary sent:', result.data?.id)
      
      return delivery
      
    } catch (error) {
      console.error('Failed to send client summary:', error)
      
      delivery.status = 'failed'
      delivery.failureReason = error instanceof Error ? error.message : 'Unknown error'
      
      // Retry logic
      if (delivery.retryCount < this.MAX_RETRIES) {
        delivery.retryCount++
        delivery.lastRetryAt = new Date().toISOString()
        
        const delay = 5000 * Math.pow(5, delivery.retryCount - 1)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.sendClientSummary(data)
      }
      
      throw error
    }
  }
  
  /**
   * Generate SCOPE.md email template for David
   */
  private generateScopeMdTemplate(data: ScopeMdEmail): EmailTemplate {
    const subject = `New Lead: ${data.projectName} - ${data.packageTier} Package ($${data.totalInvestment.toLocaleString()})`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
    }
    .alert {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .alert strong {
      color: #92400e;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-card {
      background: #f9fafb;
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .info-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .highlight {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .cta {
      background: #2563eb;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      font-weight: 600;
      margin: 20px 0;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 18px;
      color: #111827;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 New Qualified Lead</h1>
    <p>Complete SCOPE.md attached and ready for review</p>
  </div>
  
  <div class="alert">
    <strong>⚡ Action Required:</strong> New project inquiry from ${data.clientName}. Full technical specifications in attached SCOPE.md.
  </div>
  
  <div class="info-grid">
    <div class="info-card">
      <div class="info-label">Project Name</div>
      <div class="info-value">${data.projectName}</div>
    </div>
    
    <div class="info-card">
      <div class="info-label">Client Name</div>
      <div class="info-value">${data.clientName}</div>
    </div>
    
    <div class="info-card">
      <div class="info-label">Website Type</div>
      <div class="info-value">${data.websiteType}</div>
    </div>
    
    <div class="info-card">
      <div class="info-label">Package Tier</div>
      <div class="info-value">${data.packageTier}</div>
    </div>
  </div>
  
  <div class="section">
    <h2>💰 Project Investment</h2>
    <p style="font-size: 32px; font-weight: 700; color: #2563eb; margin: 10px 0;">
      $${data.totalInvestment.toLocaleString()}
    </p>
    <p style="color: #6b7280; font-size: 14px;">
      Total project investment (see SCOPE.md Section 13 for breakdown)
    </p>
  </div>
  
  <div class="section">
    <h2>📧 Contact Information</h2>
    <p>
      <strong>Email:</strong> ${data.clientEmail}<br>
      <strong>Best time to contact:</strong> Next 24-48 hours (momentum is high)
    </p>
  </div>
  
  <div class="section">
    <h2>📄 What's Attached</h2>
    <p>
      <strong>SCOPE.md</strong> - Complete technical specification document with:<br>
      • All 14 sections populated from validated conversation<br>
      • Complete feature breakdown with pricing<br>
      • Technical requirements ready for Cursor AI<br>
      • Client validation outcomes documented<br>
      • Timeline and payment schedule
    </p>
    <p style="color: #6b7280; font-size: 14px; margin-top: 12px;">
      This SCOPE.md is ready to use directly with Cursor AI for project implementation.
    </p>
  </div>
  
  <div class="section">
    <h2>🎯 Recommended Next Steps</h2>
    <ol style="line-height: 2;">
      <li><strong>Review SCOPE.md</strong> (5-10 minutes)</li>
      <li><strong>Contact client within 24 hours</strong> while momentum is high</li>
      <li><strong>Schedule consultation call</strong> to discuss timeline and process</li>
      <li><strong>Send contract</strong> if alignment is good</li>
    </ol>
  </div>
  
  <div class="section">
    <h2>💡 Context</h2>
    <p>
      This lead completed Introspect V3's full intake conversation, providing comprehensive project requirements through an intelligent, AI-orchestrated process. All information has been validated with the client, and they've invested significant time in the conversation - indicating serious intent.
    </p>
  </div>
  
  <div class="footer">
    <p>Generated by Introspect V3 | Conversation ID: ${data.conversationId}</p>
    <p>This email was sent automatically upon conversation completion</p>
  </div>
</body>
</html>
    `.trim()
    
    const text = `
NEW QUALIFIED LEAD - ${data.projectName}

Client: ${data.clientName}
Email: ${data.clientEmail}
Website Type: ${data.websiteType}
Package: ${data.packageTier}
Investment: $${data.totalInvestment.toLocaleString()}

SCOPE.md document attached with complete technical specifications.

Recommended next steps:
1. Review SCOPE.md (5-10 minutes)
2. Contact client within 24 hours
3. Schedule consultation call
4. Send contract if aligned

---
Generated by Introspect V3
Conversation ID: ${data.conversationId}
    `.trim()
    
    return {
      subject,
      html,
      text,
      attachments: data.attachments
    }
  }
  
  /**
   * Generate client summary email template
   */
  private generateClientSummaryTemplate(data: ClientSummaryEmail): EmailTemplate {
    const subject = `Your ${data.projectName} Project Summary`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 18px;
      color: #111827;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .highlight-box {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .highlight-box strong {
      color: #1e40af;
    }
    .next-steps {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .next-steps ol {
      margin: 12px 0 0 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
    .cta {
      background: #2563eb;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .contact-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      margin-top: 20px;
    }
    .contact-card h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #111827;
    }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .contact-info p {
      margin: 0;
      color: #4b5563;
    }
    .footer {
      background: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Your Project Summary is Ready</h1>
      <p>Everything we discussed, documented and ready for review</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${data.clientName},
      </div>
      
      <p>
        Thank you for taking the time to share your vision for <strong>${data.projectName}</strong> with us. We've carefully documented everything from our conversation and created a comprehensive project summary for your review.
      </p>
      
      <div class="highlight-box">
        <strong>📎 Attached:</strong> Your personalized project summary PDF containing project overview, key features, investment breakdown, and recommended next steps.
      </div>
      
      <div class="section">
        <h2>🎯 What Happens Next</h2>
        <div class="next-steps">
          <ol>
            ${data.nextSteps.map(step => `<li>${step}</li>`).join('\n            ')}
          </ol>
        </div>
      </div>
      
      <div class="section">
        <h2>📅 Schedule Your Consultation</h2>
        <p>
          Ready to discuss your project in detail? David will personally review your requirements and can answer any questions you have about the process, timeline, or technical approach.
        </p>
        <a href="${data.davidContactInfo.calendlyUrl || 'https://calendly.com/applicreations'}" class="cta">
          Schedule a Call with David →
        </a>
      </div>
      
      <div class="contact-card">
        <h3>💬 Questions? We're Here to Help</h3>
        <div class="contact-info">
          <p><strong>David</strong> | Founder, Applicreations</p>
          <p>📧 <a href="mailto:${data.davidContactInfo.email}">${data.davidContactInfo.email}</a></p>
          <p>📞 ${data.davidContactInfo.phone}</p>
        </div>
      </div>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        We're excited about the possibility of working together on ${data.projectName}. The detailed summary attached will serve as the foundation for our work together should you decide to move forward.
      </p>
    </div>
    
    <div class="footer">
      <p>
        <strong>Applicreations</strong> | Professional Web Development<br>
        <a href="https://applicreations.com">applicreations.com</a>
      </p>
      <p style="margin-top: 12px; font-size: 11px;">
        This summary was generated by Introspect, our AI-powered client intake system
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()
    
    const text = `
Your ${data.projectName} Project Summary

Hi ${data.clientName},

Thank you for sharing your vision for ${data.projectName}. We've documented everything from our conversation and created a comprehensive project summary.

ATTACHED: Your personalized project summary PDF

WHAT HAPPENS NEXT:
${data.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

SCHEDULE YOUR CONSULTATION:
Ready to discuss your project? David will personally review your requirements.
Schedule a call: ${data.davidContactInfo.calendlyUrl || 'Contact us to schedule'}

QUESTIONS? WE'RE HERE TO HELP:
David | Founder, Applicreations
Email: ${data.davidContactInfo.email}
Phone: ${data.davidContactInfo.phone}

---
Applicreations | Professional Web Development
https://applicreations.com
    `.trim()
    
    return {
      subject,
      html,
      text,
      attachments: data.attachments
    }
  }
  
  /**
   * Verify email service is configured correctly
   */
  async verifyConfiguration(): Promise<boolean> {
    try {
      // Test that API key is valid by sending a test request
      // Resend doesn't have a dedicated verify endpoint, so we'll just check the key exists
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY not configured')
      }
      
      console.log('✓ Email service configured correctly')
      return true
      
    } catch (error) {
      console.error('✗ Email service configuration error:', error)
      return false
    }
  }
}

export const emailService = new EmailService()

