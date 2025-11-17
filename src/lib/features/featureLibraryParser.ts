// Feature Library Parser for Phase 6
// Parses and manages features from APPLICREATIONS_FEATURE_LIBRARY_V1_1_COMPLETE.md

export interface Feature {
  id: string
  name: string
  description: string
  category: FeatureCategory
  pricing: FeaturePricing
  websiteTypes: string[] // Which types this applies to
  dependencies?: string[] // Feature IDs that must be selected
  conflicts?: string[] // Feature IDs that can't be selected with this
  tags?: string[] // For filtering and search
  recommended?: boolean // Dynamically set based on context
}

export type FeatureCategory = 
  | 'core'
  | 'ecommerce'
  | 'marketing'
  | 'content'
  | 'integration'
  | 'media'
  | 'booking'
  | 'membership'
  | 'compliance'
  | 'performance'

export interface FeaturePricing {
  type: 'included' | 'addon'
  tiers?: string[] // Which package tiers include this (Starter, Professional, Custom)
  addonPrice?: number // Add-on cost if not included
}


export interface FeatureConflict {
  featureA: string
  featureB: string
  reason: string
  resolution: 'choose_one' | 'upgrade_required' | 'mutually_exclusive'
}

export interface FeaturePricingResult {
  subtotal: number
  total: number
  includedFeatures: Feature[]
  addonFeatures: Feature[]
}

export interface DependencyValidation {
  valid: boolean
  missingDependencies: Array<{
    feature: Feature
    missingDeps: Feature[]
  }>
}

export class FeatureLibraryParser {
  private features: Map<string, Feature> = new Map()
  private conflicts: FeatureConflict[] = []
  
  constructor() {
    this.parseFeatureLibrary()
  }
  
  private parseFeatureLibrary() {
    // Initialize with core features from the Feature Library
    // In production, this would parse from the markdown file
    
    // Core Features
    this.addFeature({
      id: 'contact_form',
      name: 'Contact Form',
      description: 'Customizable contact form with spam protection',
      category: 'core',
      pricing: {
        type: 'included',
        tiers: ['Starter', 'Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['forms', 'contact']
    })
    
    this.addFeature({
      id: 'user_authentication',
      name: 'User Authentication',
      description: 'Secure user login and account management',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['ecommerce', 'membership', 'service'],
      tags: ['security', 'accounts', 'login']
    })
    
    // E-commerce Features
    this.addFeature({
      id: 'shopping_cart',
      name: 'Shopping Cart',
      description: 'Full shopping cart with checkout flow',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
      },
      websiteTypes: ['ecommerce'],
      tags: ['cart', 'checkout', 'ecommerce']
    })
    
    this.addFeature({
      id: 'payment_processing',
      name: 'Payment Processing',
      description: 'Integrated payment gateway (Stripe/PayPal)',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['ecommerce', 'booking', 'membership'],
      dependencies: ['shopping_cart'],
      tags: ['payments', 'stripe', 'paypal']
    })
    
    this.addFeature({
      id: 'product_catalog',
      name: 'Product Catalog',
      description: 'Comprehensive product display with variants and inventory',
      category: 'ecommerce',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['products', 'catalog', 'ecommerce']
    })
    
    // Booking Features
    this.addFeature({
      id: 'booking_system',
      name: 'Booking System',
      description: 'Comprehensive online booking system for reservations, appointments, or rentals',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['booking', 'service'],
      tags: ['booking', 'reservations', 'appointments']
    })
    
    this.addFeature({
      id: 'appointment_scheduling',
      name: 'Appointment Scheduling',
      description: 'Allow customers to book appointments online with calendar integration',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['service', 'booking'],
      conflicts: ['booking_system'],
      tags: ['scheduling', 'calendar']
    })
    
    // Content Features
    this.addFeature({
      id: 'blog_system',
      name: 'Blog System',
      description: 'Fully-featured blog with categories, tags, comments, and RSS feed',
      category: 'content',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['blog', 'business', 'portfolio'],
      tags: ['blog', 'content', 'cms']
    })
    
    this.addFeature({
      id: 'cms',
      name: 'Content Management System',
      description: 'Easy-to-use CMS for updating content without technical knowledge',
      category: 'content',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['cms', 'content', 'editing']
    })
    
    // Marketing Features
    this.addFeature({
      id: 'email_marketing',
      name: 'Email Marketing Integration',
      description: 'Connect with Mailchimp, Constant Contact, or other email platforms',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['email', 'marketing', 'newsletter']
    })
    
    this.addFeature({
      id: 'basic_seo_optimization',
      name: 'Basic SEO Optimization',
      description: 'Essential SEO including meta tags, sitemap, and basic technical SEO',
      category: 'marketing',
      pricing: {
        type: 'included',
        tiers: ['Starter', 'Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['seo', 'search', 'optimization']
    })
    
    this.addFeature({
      id: 'advanced_seo_optimization',
      name: 'Advanced SEO Optimization',
      description: 'Comprehensive SEO including keyword research, schema markup, and technical SEO audit',
      category: 'marketing',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['seo', 'search', 'optimization', 'advanced']
    })
    
    this.addFeature({
      id: 'seo_optimization',
      name: 'SEO Optimization (Add-on)',
      description: 'Additional SEO optimization beyond base package',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      tags: ['seo', 'search', 'optimization']
    })
    
    // Integration Features
    this.addFeature({
      id: 'api_integration',
      name: 'API Integration',
      description: 'Connect your website to third-party services via API (CRM, payment processors, etc.)',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['all'],
      tags: ['api', 'integration', 'third-party']
    })
    
    // Media Features
    this.addFeature({
      id: 'gallery',
      name: 'Photo Gallery',
      description: 'Beautiful image galleries with lightbox and filtering',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['portfolio', 'business'],
      tags: ['gallery', 'images', 'photos']
    })
    
    // Membership Features
    this.addFeature({
      id: 'membership_portal',
      name: 'Membership Portal',
      description: 'Secure area for members with content restriction and account management',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
      },
      websiteTypes: ['membership'],
      dependencies: ['user_authentication'],
      tags: ['membership', 'portal', 'access']
    })
    
    // Compliance Features
    this.addFeature({
      id: 'hipaa_compliance',
      name: 'HIPAA Compliance',
      description: 'HIPAA-compliant forms and data handling for healthcare',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 1000,
      },
      websiteTypes: ['healthcare', 'service'],
      tags: ['hipaa', 'compliance', 'healthcare']
    })
    
    // Performance Features
    this.addFeature({
      id: 'analytics_dashboard',
      name: 'Advanced Analytics Dashboard',
      description: 'Custom analytics dashboard showing key business metrics in real-time',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['all'],
      tags: ['analytics', 'dashboard', 'metrics']
    })
    
    this.addFeature({
      id: 'google_analytics',
      name: 'Google Analytics Integration',
      description: 'Google Analytics integration for tracking website performance',
      category: 'performance',
      pricing: {
        type: 'included',
        tiers: ['Starter', 'Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['analytics', 'google', 'tracking']
    })
    
    this.addFeature({
      id: 'performance_optimization',
      name: 'Performance Optimization',
      description: 'Website speed and performance optimization',
      category: 'performance',
      pricing: {
        type: 'included',
        tiers: ['Starter', 'Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['performance', 'speed', 'optimization']
    })
    
    // Additional Marketing Features
    this.addFeature({
      id: 'social_media_integration',
      name: 'Social Media Integration',
      description: 'Social media feed integration and sharing buttons',
      category: 'marketing',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['social', 'media', 'integration']
    })
    
    this.addFeature({
      id: 'lead_capture_forms',
      name: 'Lead Capture Forms',
      description: 'Advanced lead capture forms with conditional logic',
      category: 'marketing',
      pricing: {
        type: 'included',
        tiers: ['Professional', 'Custom']
      },
      websiteTypes: ['all'],
      tags: ['forms', 'leads', 'capture']
    })
    
    // Additional E-commerce Features
    this.addFeature({
      id: 'ecommerce_basic',
      name: 'E-commerce (Basic)',
      description: 'Sell up to 50 products with shopping cart, checkout, and payment processing',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
      },
      websiteTypes: ['ecommerce'],
      tags: ['ecommerce', 'shop', 'products']
    })
    
    this.addFeature({
      id: 'ecommerce_advanced',
      name: 'E-commerce (Advanced)',
      description: 'Full-featured online store with unlimited products, advanced inventory, shipping integration',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 2500,
      },
      websiteTypes: ['ecommerce'],
      tags: ['ecommerce', 'shop', 'products', 'advanced']
    })
    
    // Additional Features
    this.addFeature({
      id: 'live_chat',
      name: 'Live Chat Integration',
      description: 'Real-time customer support chat widget',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['chat', 'support', 'customer-service']
    })
    
    this.addFeature({
      id: 'event_calendar',
      name: 'Event Calendar',
      description: 'Display and manage events with RSVP functionality',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['calendar', 'events', 'rsvp']
    })
    
    this.addFeature({
      id: 'custom_forms',
      name: 'Custom Forms',
      description: 'Advanced forms beyond basic contact (applications, surveys, assessments)',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 200,
      },
      websiteTypes: ['all'],
      tags: ['forms', 'custom', 'applications']
    })
    
    this.addFeature({
      id: 'multilingual',
      name: 'Multilingual Support',
      description: 'Support multiple languages with automatic or manual translation',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['all'],
      tags: ['multilingual', 'translation', 'i18n']
    })
    
    this.addFeature({
      id: 'newsletter_system',
      name: 'Newsletter System',
      description: 'Built-in newsletter management with templates and subscriber management',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['all'],
      tags: ['newsletter', 'email', 'subscribers']
    })
    
    this.addFeature({
      id: 'sms_notifications',
      name: 'SMS Notifications',
      description: 'Automated SMS alerts for bookings, orders, or important updates',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['sms', 'notifications', 'alerts']
    })
    
    this.addFeature({
      id: 'inventory_management',
      name: 'Inventory Management System',
      description: 'Track product inventory, stock levels, and receive low-stock alerts',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 900,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['inventory', 'stock', 'management']
    })
    
    this.addFeature({
      id: 'customer_portal',
      name: 'Customer Portal',
      description: 'Secure area where customers can log in to view orders, invoices, documents, and account information',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
      },
      websiteTypes: ['ecommerce', 'service'],
      dependencies: ['user_authentication'],
      tags: ['portal', 'customer', 'account']
    })
    
    // ========== EXPANDED FEATURE LIBRARY ==========
    
    // Core Features - Expanded
    this.addFeature({
      id: 'multi_step_forms',
      name: 'Multi-Step Forms',
      description: 'Complex forms broken into steps for better user experience and higher conversion rates',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 450,
      },
      websiteTypes: ['all'],
      tags: ['forms', 'conversion', 'ux']
    })
    
    this.addFeature({
      id: 'file_upload_forms',
      name: 'File Upload Forms',
      description: 'Allow users to upload documents, images, or files through forms with size and type validation',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['all'],
      tags: ['forms', 'upload', 'files']
    })
    
    this.addFeature({
      id: 'conditional_form_logic',
      name: 'Conditional Form Logic',
      description: 'Forms that show/hide fields based on user responses for personalized data collection',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['forms', 'logic', 'conditional']
    })
    
    this.addFeature({
      id: 'form_analytics',
      name: 'Form Analytics & Tracking',
      description: 'Track form abandonment, completion rates, and field-level analytics',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 250,
      },
      websiteTypes: ['all'],
      tags: ['forms', 'analytics', 'tracking']
    })
    
    this.addFeature({
      id: 'two_factor_auth',
      name: 'Two-Factor Authentication',
      description: 'Enhanced security with SMS or email verification codes for user logins',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      dependencies: ['user_authentication'],
      tags: ['security', '2fa', 'authentication']
    })
    
    this.addFeature({
      id: 'social_login',
      name: 'Social Media Login',
      description: 'Allow users to sign in with Google, Facebook, Apple, or other social accounts',
      category: 'core',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      dependencies: ['user_authentication'],
      tags: ['login', 'social', 'oauth']
    })
    
    // E-commerce Features - Expanded
    this.addFeature({
      id: 'product_reviews',
      name: 'Product Reviews & Ratings',
      description: 'Customer review system with ratings, photos, and verified purchase badges',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['reviews', 'ratings', 'social-proof']
    })
    
    this.addFeature({
      id: 'wishlist_favorites',
      name: 'Wishlist & Favorites',
      description: 'Let customers save products to wishlists for later purchase',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['wishlist', 'favorites', 'save']
    })
    
    this.addFeature({
      id: 'product_comparison',
      name: 'Product Comparison Tool',
      description: 'Side-by-side product comparison feature for customers',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['comparison', 'products', 'tools']
    })
    
    this.addFeature({
      id: 'abandoned_cart_recovery',
      name: 'Abandoned Cart Recovery',
      description: 'Automated emails to recover abandoned shopping carts and increase conversions',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['cart', 'recovery', 'email']
    })
    
    this.addFeature({
      id: 'gift_cards',
      name: 'Gift Cards & Store Credit',
      description: 'Sell and redeem digital gift cards with balance tracking',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['gift-cards', 'store-credit', 'vouchers']
    })
    
    this.addFeature({
      id: 'subscription_products',
      name: 'Subscription Products',
      description: 'Sell recurring subscription products with automatic billing and renewal',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 1000,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart', 'payment_processing'],
      tags: ['subscriptions', 'recurring', 'billing']
    })
    
    this.addFeature({
      id: 'product_bundles',
      name: 'Product Bundles & Kits',
      description: 'Create product bundles with special pricing and automatic discount application',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 450,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['bundles', 'kits', 'discounts']
    })
    
    this.addFeature({
      id: 'affiliate_program',
      name: 'Affiliate Program',
      description: 'Manage affiliate referrals with tracking, commissions, and payouts',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 1200,
      },
      websiteTypes: ['ecommerce'],
      tags: ['affiliate', 'referrals', 'commissions']
    })
    
    this.addFeature({
      id: 'loyalty_points',
      name: 'Loyalty Points & Rewards',
      description: 'Reward customers with points for purchases that can be redeemed for discounts',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart', 'user_authentication'],
      tags: ['loyalty', 'points', 'rewards']
    })
    
    this.addFeature({
      id: 'shipping_calculator',
      name: 'Real-Time Shipping Calculator',
      description: 'Calculate shipping costs in real-time from carriers like UPS, FedEx, USPS',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 550,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['shipping', 'calculator', 'carriers']
    })
    
    this.addFeature({
      id: 'multi_currency',
      name: 'Multi-Currency Support',
      description: 'Display prices and accept payments in multiple currencies with automatic conversion',
      category: 'ecommerce',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['currency', 'international', 'conversion']
    })
    
    // Marketing Features - Expanded
    this.addFeature({
      id: 'popup_builder',
      name: 'Popup & Modal Builder',
      description: 'Create custom popups for email capture, promotions, announcements with exit-intent detection',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['popups', 'modals', 'conversion']
    })
    
    this.addFeature({
      id: 'exit_intent_popup',
      name: 'Exit-Intent Popup',
      description: 'Trigger popups when users are about to leave to capture leads or offer discounts',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['popups', 'exit-intent', 'conversion']
    })
    
    this.addFeature({
      id: 'ab_testing',
      name: 'A/B Testing Tools',
      description: 'Test different versions of pages, headlines, and CTAs to optimize conversions',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['all'],
      tags: ['ab-testing', 'optimization', 'conversion']
    })
    
    this.addFeature({
      id: 'heatmap_analytics',
      name: 'Heatmap & User Session Recording',
      description: 'Visual heatmaps and session recordings to understand user behavior',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      tags: ['heatmaps', 'analytics', 'user-behavior']
    })
    
    this.addFeature({
      id: 'conversion_funnels',
      name: 'Conversion Funnel Tracking',
      description: 'Track users through conversion funnels to identify drop-off points',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['funnels', 'tracking', 'conversion']
    })
    
    this.addFeature({
      id: 'retargeting_pixels',
      name: 'Retargeting Pixel Integration',
      description: 'Install Facebook, Google, and other retargeting pixels for ad campaigns',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 200,
      },
      websiteTypes: ['all'],
      tags: ['retargeting', 'pixels', 'ads']
    })
    
    this.addFeature({
      id: 'landing_page_builder',
      name: 'Landing Page Builder',
      description: 'Create high-converting landing pages with drag-and-drop builder',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 900,
      },
      websiteTypes: ['all'],
      tags: ['landing-pages', 'builder', 'conversion']
    })
    
    this.addFeature({
      id: 'countdown_timers',
      name: 'Countdown Timers & Urgency',
      description: 'Add countdown timers to create urgency and boost conversions',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 250,
      },
      websiteTypes: ['all'],
      tags: ['countdown', 'urgency', 'conversion']
    })
    
    this.addFeature({
      id: 'social_proof_notifications',
      name: 'Social Proof Notifications',
      description: 'Show real-time notifications of recent purchases or signups to build trust',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['social-proof', 'notifications', 'trust']
    })
    
    this.addFeature({
      id: 'referral_program',
      name: 'Referral Program',
      description: 'Encourage customers to refer friends with rewards and tracking',
      category: 'marketing',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['all'],
      tags: ['referrals', 'program', 'rewards']
    })
    
    // Content Features - Expanded
    this.addFeature({
      id: 'video_gallery',
      name: 'Video Gallery & Player',
      description: 'Embed and display videos with custom player, playlists, and video analytics',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['video', 'gallery', 'player']
    })
    
    this.addFeature({
      id: 'podcast_player',
      name: 'Podcast Player & RSS',
      description: 'Dedicated podcast player with RSS feed for iTunes and Spotify submission',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      tags: ['podcast', 'audio', 'rss']
    })
    
    this.addFeature({
      id: 'testimonials_slider',
      name: 'Testimonials & Reviews Slider',
      description: 'Display customer testimonials with photos, ratings, and rotating carousel',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['testimonials', 'reviews', 'slider']
    })
    
    this.addFeature({
      id: 'faq_system',
      name: 'FAQ Accordion System',
      description: 'Organized FAQ section with expandable accordions and search functionality',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 250,
      },
      websiteTypes: ['all'],
      tags: ['faq', 'accordion', 'help']
    })
    
    this.addFeature({
      id: 'document_library',
      name: 'Document Library & Downloads',
      description: 'Organized document library with categories, search, and download tracking',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['documents', 'library', 'downloads']
    })
    
    this.addFeature({
      id: 'knowledge_base',
      name: 'Knowledge Base & Help Center',
      description: 'Comprehensive help center with articles, categories, and search',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['all'],
      tags: ['knowledge-base', 'help', 'articles']
    })
    
    this.addFeature({
      id: 'content_scheduling',
      name: 'Content Scheduling & Publishing',
      description: 'Schedule blog posts and content to publish automatically at specific times',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['all'],
      dependencies: ['blog_system'],
      tags: ['scheduling', 'publishing', 'automation']
    })
    
    this.addFeature({
      id: 'content_versioning',
      name: 'Content Versioning & Revisions',
      description: 'Track content changes with version history and rollback capabilities',
      category: 'content',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      dependencies: ['cms'],
      tags: ['versioning', 'revisions', 'history']
    })
    
    // Integration Features - Expanded
    this.addFeature({
      id: 'crm_integration',
      name: 'CRM Integration (Salesforce, HubSpot)',
      description: 'Sync leads, contacts, and data with popular CRM platforms',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 900,
      },
      websiteTypes: ['all'],
      tags: ['crm', 'salesforce', 'hubspot']
    })
    
    this.addFeature({
      id: 'zapier_integration',
      name: 'Zapier Integration',
      description: 'Connect to 5000+ apps via Zapier for automated workflows',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['zapier', 'automation', 'workflows']
    })
    
    this.addFeature({
      id: 'quickbooks_integration',
      name: 'QuickBooks Integration',
      description: 'Sync invoices, payments, and customer data with QuickBooks accounting',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['ecommerce', 'service'],
      tags: ['quickbooks', 'accounting', 'invoices']
    })
    
    this.addFeature({
      id: 'mailchimp_integration',
      name: 'Mailchimp Integration',
      description: 'Deep integration with Mailchimp for email marketing automation',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['mailchimp', 'email', 'marketing']
    })
    
    this.addFeature({
      id: 'calendly_integration',
      name: 'Calendly Integration',
      description: 'Embed Calendly scheduling directly into your site with custom styling',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['service', 'booking'],
      tags: ['calendly', 'scheduling', 'appointments']
    })
    
    this.addFeature({
      id: 'slack_integration',
      name: 'Slack Notifications',
      description: 'Send form submissions, orders, and alerts directly to Slack channels',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['all'],
      tags: ['slack', 'notifications', 'alerts']
    })
    
    this.addFeature({
      id: 'webhook_support',
      name: 'Webhook Support',
      description: 'Send data to external systems via custom webhooks for any event',
      category: 'integration',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['webhooks', 'api', 'automation']
    })
    
    // Media Features - Expanded
    this.addFeature({
      id: 'image_optimization',
      name: 'Automatic Image Optimization',
      description: 'Automatically compress and optimize images for faster loading without quality loss',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['images', 'optimization', 'performance']
    })
    
    this.addFeature({
      id: 'lazy_loading',
      name: 'Lazy Loading Images',
      description: 'Load images only when needed to improve page speed and reduce bandwidth',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 200,
      },
      websiteTypes: ['all'],
      tags: ['lazy-loading', 'performance', 'images']
    })
    
    this.addFeature({
      id: '360_product_viewer',
      name: '360° Product Viewer',
      description: 'Interactive 360-degree product viewer for e-commerce products',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['ecommerce'],
      dependencies: ['shopping_cart'],
      tags: ['360', 'product', 'viewer']
    })
    
    this.addFeature({
      id: 'image_zoom',
      name: 'Advanced Image Zoom & Lightbox',
      description: 'High-quality image zoom and lightbox gallery with touch gestures',
      category: 'media',
      pricing: {
        type: 'addon',
        addonPrice: 250,
      },
      websiteTypes: ['all'],
      tags: ['zoom', 'lightbox', 'images']
    })
    
    // Booking Features - Expanded
    this.addFeature({
      id: 'recurring_appointments',
      name: 'Recurring Appointments',
      description: 'Allow customers to book recurring appointments automatically',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['booking', 'service'],
      dependencies: ['booking_system'],
      tags: ['recurring', 'appointments', 'automation']
    })
    
    this.addFeature({
      id: 'waitlist_management',
      name: 'Waitlist Management',
      description: 'Manage waitlists for fully booked time slots with automatic notifications',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 350,
      },
      websiteTypes: ['booking', 'service'],
      dependencies: ['booking_system'],
      tags: ['waitlist', 'management', 'notifications']
    })
    
    this.addFeature({
      id: 'resource_booking',
      name: 'Resource & Room Booking',
      description: 'Book physical resources like rooms, equipment, or vehicles with availability tracking',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['booking', 'service'],
      dependencies: ['booking_system'],
      tags: ['resources', 'rooms', 'equipment']
    })
    
    this.addFeature({
      id: 'group_booking',
      name: 'Group Booking & Classes',
      description: 'Allow multiple people to book group sessions, classes, or events together',
      category: 'booking',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['booking', 'service'],
      dependencies: ['booking_system'],
      tags: ['group', 'classes', 'events']
    })
    
    // Membership Features - Expanded
    this.addFeature({
      id: 'subscription_tiers',
      name: 'Subscription Tiers & Plans',
      description: 'Create multiple membership tiers with different access levels and pricing',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 1000,
      },
      websiteTypes: ['membership'],
      dependencies: ['membership_portal', 'user_authentication'],
      tags: ['subscriptions', 'tiers', 'plans']
    })
    
    this.addFeature({
      id: 'content_drip',
      name: 'Content Drip & Release Schedule',
      description: 'Release content to members on a schedule or based on membership duration',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['membership'],
      dependencies: ['membership_portal'],
      tags: ['content', 'drip', 'schedule']
    })
    
    this.addFeature({
      id: 'member_directory',
      name: 'Member Directory & Profiles',
      description: 'Searchable directory of members with profiles and networking features',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['membership'],
      dependencies: ['membership_portal'],
      tags: ['directory', 'profiles', 'networking']
    })
    
    this.addFeature({
      id: 'member_forums',
      name: 'Member Forums & Discussions',
      description: 'Private forums for members to discuss topics and share knowledge',
      category: 'membership',
      pricing: {
        type: 'addon',
        addonPrice: 900,
      },
      websiteTypes: ['membership'],
      dependencies: ['membership_portal'],
      tags: ['forums', 'discussions', 'community']
    })
    
    // Compliance Features - Expanded
    this.addFeature({
      id: 'gdpr_compliance',
      name: 'GDPR Compliance Tools',
      description: 'Cookie consent, privacy policy generator, and data export/deletion tools',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      tags: ['gdpr', 'privacy', 'compliance']
    })
    
    this.addFeature({
      id: 'ccpa_compliance',
      name: 'CCPA Compliance Tools',
      description: 'California Consumer Privacy Act compliance with data request handling',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['ccpa', 'privacy', 'compliance']
    })
    
    this.addFeature({
      id: 'cookie_consent',
      name: 'Cookie Consent Banner',
      description: 'Customizable cookie consent banner with granular control options',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['cookies', 'consent', 'privacy']
    })
    
    this.addFeature({
      id: 'accessibility_tools',
      name: 'Accessibility Tools (WCAG 2.1)',
      description: 'Screen reader support, keyboard navigation, and WCAG 2.1 AA compliance',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 800,
      },
      websiteTypes: ['all'],
      tags: ['accessibility', 'wcag', 'a11y']
    })
    
    this.addFeature({
      id: 'terms_generator',
      name: 'Terms & Privacy Policy Generator',
      description: 'Generate legal terms of service and privacy policy templates',
      category: 'compliance',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['terms', 'privacy', 'legal']
    })
    
    // Performance Features - Expanded
    this.addFeature({
      id: 'cdn_integration',
      name: 'CDN Integration',
      description: 'Content Delivery Network integration for global fast loading',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 500,
      },
      websiteTypes: ['all'],
      tags: ['cdn', 'performance', 'speed']
    })
    
    this.addFeature({
      id: 'caching_system',
      name: 'Advanced Caching System',
      description: 'Intelligent caching for pages, database queries, and API calls',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['caching', 'performance', 'speed']
    })
    
    this.addFeature({
      id: 'database_optimization',
      name: 'Database Optimization',
      description: 'Optimize database queries and structure for faster performance',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 600,
      },
      websiteTypes: ['all'],
      tags: ['database', 'optimization', 'performance']
    })
    
    this.addFeature({
      id: 'real_time_analytics',
      name: 'Real-Time Analytics Dashboard',
      description: 'Live analytics dashboard showing visitors, conversions, and key metrics',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 700,
      },
      websiteTypes: ['all'],
      tags: ['analytics', 'dashboard', 'real-time']
    })
    
    this.addFeature({
      id: 'error_tracking',
      name: 'Error Tracking & Monitoring',
      description: 'Track JavaScript errors and performance issues with detailed reporting',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 400,
      },
      websiteTypes: ['all'],
      tags: ['errors', 'monitoring', 'tracking']
    })
    
    this.addFeature({
      id: 'uptime_monitoring',
      name: 'Uptime Monitoring & Alerts',
      description: 'Monitor website uptime and receive alerts when site goes down',
      category: 'performance',
      pricing: {
        type: 'addon',
        addonPrice: 300,
      },
      websiteTypes: ['all'],
      tags: ['uptime', 'monitoring', 'alerts']
    })
    
    // Add conflicts
    this.conflicts.push({
      featureA: 'booking_system',
      featureB: 'appointment_scheduling',
      reason: 'Cannot have both booking system and appointment scheduling - they serve the same purpose',
      resolution: 'choose_one'
    })
  }
  
  private addFeature(feature: Feature) {
    this.features.set(feature.id, feature)
  }
  
  /**
   * Get features filtered by website type
   */
  getFeaturesByType(websiteType: string): Feature[] {
    return Array.from(this.features.values()).filter(feature =>
      feature.websiteTypes.includes('all') ||
      feature.websiteTypes.includes(websiteType.toLowerCase())
    )
  }
  
  /**
   * Get features organized by category
   */
  getFeaturesByCategory(
    websiteType: string
  ): Record<FeatureCategory, Feature[]> {
    const features = this.getFeaturesByType(websiteType)
    
    return features.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    }, {} as Record<FeatureCategory, Feature[]>)
  }
  
  /**
   * Get recommended features based on intelligence
   */
  getRecommendedFeatures(
    websiteType: string,
    intelligence: any
  ): string[] {
    const recommended: string[] = []
    
    // Apply recommendation rules based on website type and intelligence
    switch (websiteType.toLowerCase()) {
      case 'ecommerce':
        recommended.push('shopping_cart', 'payment_processing', 'product_catalog')
        if (intelligence.needsUserAccounts) {
          recommended.push('user_authentication')
        }
        break
        
      case 'portfolio':
        recommended.push('gallery', 'contact_form')
        break
        
      case 'blog':
        recommended.push('blog_system', 'cms')
        break
        
      case 'service':
        recommended.push('contact_form')
        if (intelligence.needsBooking) {
          recommended.push('booking_system')
        }
        break
    }
    
    return recommended
  }
  
  /**
   * Calculate pricing for selected features
   */
  calculatePricing(
    selectedFeatureIds: string[],
    packageTier: string
  ): FeaturePricingResult {
    const selectedFeatures = selectedFeatureIds
      .map(id => this.features.get(id))
      .filter(Boolean) as Feature[]
    
    let subtotal = 0
    const includedFeatures: Feature[] = []
    const addonFeatures: Feature[] = []
    
    // Categorize features
    selectedFeatures.forEach(feature => {
      if (feature.pricing.type === 'included' && 
          feature.pricing.tiers?.includes(packageTier)) {
        includedFeatures.push(feature)
      } else if (feature.pricing.type === 'addon') {
        addonFeatures.push(feature)
        subtotal += feature.pricing.addonPrice || 0
      }
    })
    
    return {
      subtotal,
      total: subtotal,
      includedFeatures,
      addonFeatures
    }
  }
  
  /**
   * Detect conflicts in selected features
   */
  detectConflicts(selectedFeatureIds: string[]): FeatureConflict[] {
    const selectedSet = new Set(selectedFeatureIds)
    
    return this.conflicts.filter(conflict =>
      selectedSet.has(conflict.featureA) && selectedSet.has(conflict.featureB)
    )
  }
  
  /**
   * Validate dependencies are met
   */
  validateDependencies(selectedFeatureIds: string[]): DependencyValidation {
    const selectedSet = new Set(selectedFeatureIds)
    const missingDependencies: Array<{
      feature: Feature
      missingDeps: Feature[]
    }> = []
    
    selectedFeatureIds.forEach(id => {
      const feature = this.features.get(id)
      if (feature?.dependencies) {
        const missing = feature.dependencies.filter(depId => !selectedSet.has(depId))
        if (missing.length > 0) {
          missingDependencies.push({
            feature,
            missingDeps: missing.map(id => this.features.get(id)!).filter(Boolean)
          })
        }
      }
    })
    
    return {
      valid: missingDependencies.length === 0,
      missingDependencies
    }
  }
  
  getFeature(id: string): Feature | undefined {
    return this.features.get(id)
  }
}

// Singleton instance
export const featureLibrary = new FeatureLibraryParser()

