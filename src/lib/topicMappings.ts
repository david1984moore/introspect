/**
 * Topic Mappings for Enhanced Conversation State Manager v2
 * 
 * Defines how facts map to conceptual topics for duplicate prevention.
 * These topics represent "chapters" in the conversation that should only be visited once.
 */

import type { TopicMapping } from '@/types/conversation'

/**
 * Defines how facts map to conceptual topics
 * These topics represent "chapters" in the conversation that should only be visited once
 */
export const TOPIC_MAPPINGS: TopicMapping[] = [
  // Foundation Topics
  {
    topic: 'business_fundamentals',
    displayName: 'Business basics (name, email, description)',
    requiredFacts: ['contact_name', 'contact_email', 'business_description', 'business_type'],
    keywords: ['business', 'company', 'contact', 'name', 'email'],
    minFactsForClosure: 3, // Need at least 3 of 4 facts
  },
  {
    topic: 'project_goals',
    displayName: 'Project goals and objectives',
    requiredFacts: ['project_purpose', 'target_audience', 'success_metrics'],
    keywords: ['goal', 'purpose', 'objective', 'why', 'audience', 'users'],
    minFactsForClosure: 2,
  },
  
  // Technical Topics
  {
    topic: 'platform_delivery',
    displayName: 'Platform and delivery (web, mobile, desktop)',
    requiredFacts: ['platform', 'device_support', 'browser_requirements'],
    keywords: ['platform', 'mobile', 'web', 'desktop', 'ios', 'android', 'browser'],
    minFactsForClosure: 1,
  },
  {
    topic: 'hosting_infrastructure',
    displayName: 'Hosting and infrastructure',
    requiredFacts: ['hosting_preference', 'deployment_method', 'scaling_requirements'],
    keywords: ['hosting', 'server', 'deploy', 'cloud', 'infrastructure', 'aws', 'vercel'],
    minFactsForClosure: 1,
  },
  {
    topic: 'authentication',
    displayName: 'User authentication and login',
    requiredFacts: ['auth_method', 'user_roles', 'permission_model'],
    keywords: ['login', 'sign in', 'authentication', 'auth', 'user account', 'password', 'sso'],
    minFactsForClosure: 1,
  },
  {
    topic: 'database_storage',
    displayName: 'Database and data storage',
    requiredFacts: ['database_type', 'data_structure', 'storage_requirements'],
    keywords: ['database', 'data', 'storage', 'sql', 'nosql', 'postgres', 'mongo'],
    minFactsForClosure: 1,
  },
  
  // Feature Topics
  {
    topic: 'payment_processing',
    displayName: 'Payment processing and billing',
    requiredFacts: ['payment_provider', 'payment_features', 'subscription_model', 'billing_frequency'],
    keywords: ['payment', 'pay', 'billing', 'subscription', 'stripe', 'paypal', 'checkout'],
    minFactsForClosure: 1,
  },
  {
    topic: 'content_management',
    displayName: 'Content management and editing',
    requiredFacts: ['cms_type', 'content_editing', 'media_management'],
    keywords: ['content', 'cms', 'editing', 'blog', 'posts', 'articles', 'media', 'images'],
    minFactsForClosure: 1,
  },
  {
    topic: 'user_features',
    displayName: 'Core user-facing features',
    requiredFacts: ['primary_features', 'user_interactions', 'social_features'],
    keywords: ['feature', 'functionality', 'user', 'profile', 'social', 'sharing', 'comments'],
    minFactsForClosure: 2,
  },
  {
    topic: 'admin_features',
    displayName: 'Admin dashboard and controls',
    requiredFacts: ['admin_panel', 'analytics_reporting', 'moderation_tools'],
    keywords: ['admin', 'dashboard', 'analytics', 'reports', 'management', 'moderation'],
    minFactsForClosure: 1,
  },
  {
    topic: 'search_discovery',
    displayName: 'Search and content discovery',
    requiredFacts: ['search_functionality', 'filtering_options', 'recommendation_engine'],
    keywords: ['search', 'find', 'filter', 'discover', 'browse', 'recommendations'],
    minFactsForClosure: 1,
  },
  {
    topic: 'notifications',
    displayName: 'Notifications and alerts',
    requiredFacts: ['notification_types', 'notification_channels', 'notification_preferences'],
    keywords: ['notification', 'alert', 'email', 'push', 'sms', 'updates'],
    minFactsForClosure: 1,
  },
  {
    topic: 'integrations',
    displayName: 'Third-party integrations',
    requiredFacts: ['integration_list', 'api_requirements', 'webhook_needs'],
    keywords: ['integration', 'api', 'third-party', 'connect', 'sync', 'import', 'export'],
    minFactsForClosure: 1,
  },
  
  // Business Context Topics
  {
    topic: 'timeline_budget',
    displayName: 'Timeline and budget',
    requiredFacts: ['project_timeline', 'budget_indication', 'launch_date', 'budget_flexibility'],
    keywords: ['timeline', 'deadline', 'launch', 'budget', 'cost', 'price', 'when', 'how much'],
    minFactsForClosure: 2,
  },
  {
    topic: 'design_branding',
    displayName: 'Design and branding preferences',
    requiredFacts: ['design_style', 'brand_guidelines', 'color_preferences', 'existing_branding'],
    keywords: ['design', 'brand', 'style', 'look', 'feel', 'colors', 'logo', 'aesthetic'],
    minFactsForClosure: 1,
  },
  {
    topic: 'competitors_references',
    displayName: 'Competitors and reference sites',
    requiredFacts: ['competitor_examples', 'reference_sites', 'inspiration_sources'],
    keywords: ['competitor', 'example', 'reference', 'similar', 'like', 'inspired by'],
    minFactsForClosure: 1,
  },
  {
    topic: 'existing_systems',
    displayName: 'Existing systems and migration',
    requiredFacts: ['current_system', 'migration_needs', 'data_transfer'],
    keywords: ['existing', 'current', 'migrate', 'transfer', 'replace', 'old system'],
    minFactsForClosure: 1,
  },
  {
    topic: 'team_resources',
    displayName: 'Team and resources',
    requiredFacts: ['team_size', 'technical_expertise', 'ongoing_maintenance'],
    keywords: ['team', 'developer', 'designer', 'maintain', 'support', 'internal'],
    minFactsForClosure: 1,
  },
  {
    topic: 'compliance_legal',
    displayName: 'Compliance and legal requirements',
    requiredFacts: ['compliance_requirements', 'legal_constraints', 'privacy_needs'],
    keywords: ['compliance', 'legal', 'gdpr', 'privacy', 'terms', 'regulations', 'hipaa'],
    minFactsForClosure: 1,
  },
  {
    topic: 'performance_scale',
    displayName: 'Performance and scale expectations',
    requiredFacts: ['expected_users', 'performance_requirements', 'scaling_timeline'],
    keywords: ['performance', 'speed', 'scale', 'users', 'traffic', 'load', 'concurrent'],
    minFactsForClosure: 1,
  },
]

/**
 * Get topic by key for lookups
 */
export function getTopicMapping(topic: string): TopicMapping | undefined {
  return TOPIC_MAPPINGS.find(t => t.topic === topic)
}

/**
 * Get all topic keys
 */
export function getAllTopicKeys(): string[] {
  return TOPIC_MAPPINGS.map(t => t.topic)
}

