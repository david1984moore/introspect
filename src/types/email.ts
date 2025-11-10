// Email delivery types for Phase 10
export interface EmailDelivery {
  id: string
  conversationId: string
  recipientType: 'client' | 'david'
  recipientEmail: string
  recipientName: string
  emailType: 'scope_md' | 'client_summary'
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sentAt?: string
  deliveredAt?: string
  failureReason?: string
  retryCount: number
  lastRetryAt?: string
}

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType: string
  encoding?: 'base64' | 'utf-8'
}

export interface ScopeMdEmail {
  to: string // david@applicreations.com
  from: string // Introspect <introspect@applicreations.com>
  subject: string
  projectName: string
  clientName: string
  clientEmail: string
  websiteType: string
  packageTier: string
  totalInvestment: number
  conversationId: string
  attachments: EmailAttachment[] // SCOPE.md
}

export interface ClientSummaryEmail {
  to: string // User's email
  from: string // Introspect <introspect@applicreations.com>
  subject: string
  clientName: string
  projectName: string
  nextSteps: string[]
  davidEmail: string
  davidPhone: string
  davidContactInfo: {
    email: string
    phone: string
    calendlyUrl: string
  }
  attachments: EmailAttachment[] // Client summary PDF
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
  attachments?: EmailAttachment[]
}

export interface CompletionData {
  conversationId: string
  projectName: string
  clientName: string
  clientEmail: string
  totalInvestment: number
  estimatedTimeline: string
  keyFeatures: string[]
  nextSteps: string[]
  davidContactInfo: {
    email: string
    phone: string
    calendlyUrl: string
  }
}

