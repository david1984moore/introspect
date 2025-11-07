export type BusinessModel = 
  | 'service' 
  | 'product' 
  | 'content' 
  | 'membership' 
  | 'hybrid'

export interface BusinessModelClassification {
  model: BusinessModel
  confidence: number
  indicators: string[]
  primaryRevenue: string
  secondaryModels?: BusinessModel[]
}

export const businessModelIndicators = {
  service: {
    keywords: ['appointment', 'booking', 'consultation', 'session', 'schedule'],
    painPoints: ['no-shows', 'double-booking', 'availability management'],
    revenuePattern: 'time-based',
  },
  product: {
    keywords: ['inventory', 'catalog', 'shipping', 'SKU', 'product'],
    painPoints: ['inventory tracking', 'order fulfillment', 'stock management'],
    revenuePattern: 'transaction-based',
  },
  content: {
    keywords: ['blog', 'article', 'subscriber', 'audience', 'publish'],
    painPoints: ['content organization', 'engagement', 'distribution'],
    revenuePattern: 'advertising/sponsorship',
  },
  membership: {
    keywords: ['member', 'subscription', 'tier', 'exclusive', 'community'],
    painPoints: ['member management', 'content gating', 'retention'],
    revenuePattern: 'subscription-based',
  },
} as const

