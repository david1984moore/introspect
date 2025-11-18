'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CompactPriceCalculator } from './CompactPriceCalculator'

export type WebsitePackage = 'starter' | 'professional' | 'custom'
export type HostingPackage = 'basic' | 'pro' | 'premium' | 'none'
export type HostingDuration = 3 | 6 | 12

export interface WebsitePackageOption {
  id: WebsitePackage
  name: string
  subtitle: string
  description: string
  basePrice: number | null // null for Custom
  features: string[]
  popular?: boolean
  maxFeatureSelections: number | null // null means unlimited (for Custom)
}

export interface HostingPackageOption {
  id: HostingPackage
  name: string
  subtitle: string
  description: string
  baseMonthlyPrice: number
  workCreditHours: number
  features: string[]
}

interface PackageSelectionScreenProps {
  onContinue: (websitePackage: WebsitePackage, hostingPackage: HostingPackage, hostingDuration?: HostingDuration) => void
  isSubmitting?: boolean
}

export const WEBSITE_PACKAGES: WebsitePackageOption[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    subtitle: 'Perfect for small businesses',
    description: 'A professional website with up to 5-pages.',
    basePrice: 1900,
    maxFeatureSelections: 3,
    features: [
      'Up to 5 custom pages',
      'Mobile-responsive design',
      'SEO optimization',
      'Contact form',
      'Google Analytics',
      '30 days support*',
      '3 feature selections'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Website',
    subtitle: 'Best value for growing businesses',
    description: 'Everything you need to compete online and capture leads.',
    basePrice: 3250,
    maxFeatureSelections: 5,
    features: [
      'Up to 8 custom pages',
      'Advanced SEO setup',
      'Lead capture forms',
      'Email integration',
      'CMS for easy updates',
      'Social media integration',
      '60 days support*',
      'Performance optimization',
      '5 feature selections'
    ],
    popular: true
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    subtitle: 'Built for your needs',
    description: 'Complex applications with custom functionality.',
    basePrice: 5250,
    maxFeatureSelections: 8, // 8 features included in base price
    features: [
      'Unlimited pages',
      'Database integration',
      'User authentication',
      'API development',
      'Cloud hosting setup',
      '90 days support',
      'Ongoing maintenance available',
      '8 feature selections'
    ]
  }
]

export const HOSTING_PACKAGES: HostingPackageOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Essential maintenance',
    description: 'Perfect for simple sites that need basic upkeep.',
    baseMonthlyPrice: 75,
    workCreditHours: 1,
    features: [
      '1 hour work credit per month',
      'Security monitoring',
      'Uptime monitoring',
      'Basic analytics reports',
      'Email support',
      'Plugin/software updates',
      'Monthly backup verification'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Perfect for most businesses',
    description: 'Comprehensive support for growing businesses.',
    baseMonthlyPrice: 150,
    workCreditHours: 2,
    features: [
      '2 hours work credit per month',
      'Advanced security scans',
      'Performance monitoring',
      'Detailed analytics reports',
      'Priority email support',
      'Content updates included',
      'SEO health monitoring',
      'Weekly backup verification',
      'Minor feature additions'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Maximum peace of mind',
    description: 'White-glove service for mission-critical sites.',
    baseMonthlyPrice: 300,
    workCreditHours: 4,
    features: [
      '4 hours work credit per month',
      'Proactive security hardening',
      'Real-time performance alerts',
      'Custom analytics dashboards',
      'Phone + email support',
      'Content strategy consultation',
      'Advanced SEO optimization',
      'Daily backup verification',
      'Feature development included',
      'Emergency response (2hr)'
    ]
  }
]

// Duration discounts
const DURATION_DISCOUNTS = {
  3: 0,
  6: 0.05, // 5% discount
  12: 0.10 // 10% discount
}

export function PackageSelectionScreen({
  onContinue,
  isSubmitting = false
}: PackageSelectionScreenProps) {
  const [selectedWebsitePackage, setSelectedWebsitePackage] = useState<WebsitePackage | null>(null)
  const [selectedHostingPackage, setSelectedHostingPackage] = useState<HostingPackage>('none')
  const [hostingDuration, setHostingDuration] = useState<HostingDuration>(3)
  const [paymentBannerMinimized, setPaymentBannerMinimized] = useState(false)
  
  // OPTION B: Object-based state for card expansion - ensures complete isolation per card
  // Each card has its own key in the Record, allowing independent state management
  const [expandedWebsitePackages, setExpandedWebsitePackages] = useState<Record<WebsitePackage, boolean>>({
    starter: false,
    professional: false,
    custom: false
  })
  
  const [expandedHostingPackages, setExpandedHostingPackages] = useState<Record<HostingPackage, boolean>>({
    basic: false,
    pro: false,
    premium: false,
    none: false
  })

  // Toggle website package expansion - IMMUTABLE PATTERN
  // Creates a NEW state object, only updating the clicked card's state
  // This ensures React detects the change and only the target card re-renders
  const toggleWebsitePackage = useCallback((cardId: WebsitePackage) => {
    const timestamp = Date.now()
    console.log(`[PackageSelection] [${timestamp}] Click detected on card: ${cardId}`)
    
    // IMMUTABLE UPDATE PATTERN: Create new object, spread previous state, update only target card
    // Using functional update (prev => ...) so we don't need state in dependencies
    setExpandedWebsitePackages(prev => {
      console.log(`[PackageSelection] [${timestamp}] Current state BEFORE update:`, { ...prev })
      const newState = {
        ...prev,           // Spread all previous values (preserves other cards' states)
        [cardId]: !prev[cardId]  // Toggle ONLY the clicked card's state
      }
      console.log(`[PackageSelection] [${timestamp}] New state AFTER update:`, { ...newState })
      console.log(`[PackageSelection] [${timestamp}] Only ${cardId} changed: ${prev[cardId]} -> ${newState[cardId]}`)
      return newState
    })
  }, []) // Empty deps - using functional updates exclusively

  // Toggle hosting package expansion - IMMUTABLE PATTERN
  const toggleHostingPackage = useCallback((cardId: HostingPackage) => {
    const timestamp = Date.now()
    console.log(`[PackageSelection] [${timestamp}] Click detected on hosting card: ${cardId}`)
    
    // IMMUTABLE UPDATE PATTERN: Create new object, spread previous state, update only target card
    // Using functional update (prev => ...) so we don't need state in dependencies
    setExpandedHostingPackages(prev => {
      const newState = {
        ...prev,           // Spread all previous values (preserves other cards' states)
        [cardId]: !prev[cardId]  // Toggle ONLY the clicked card's state
      }
      console.log(`[PackageSelection] [${timestamp}] Hosting state update:`, { ...newState })
      return newState
    })
  }, []) // Empty deps - using functional updates exclusively

  // Calculate hosting prices with duration discounts
  const hostingPrices = useMemo(() => {
    return HOSTING_PACKAGES.map(pkg => {
      const discount = DURATION_DISCOUNTS[hostingDuration]
      const discountedPrice = pkg.baseMonthlyPrice * (1 - discount)
      const total = discountedPrice * hostingDuration
      const savings = (pkg.baseMonthlyPrice * hostingDuration) - total
      
      return {
        ...pkg,
        monthlyPrice: Math.round(discountedPrice),
        totalPrice: Math.round(total),
        savings: Math.round(savings)
      }
    })
  }, [hostingDuration])

  const canContinue = selectedWebsitePackage !== null && !isSubmitting

  const handleContinue = () => {
    if (canContinue && selectedWebsitePackage) {
      onContinue(selectedWebsitePackage, selectedHostingPackage, hostingDuration)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-0">
      {/* Important Information Banner */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 max-w-4xl mx-auto">
          <h3 
            className={`text-lg font-semibold text-gray-900 ${paymentBannerMinimized ? 'mb-0 cursor-pointer hover:text-blue-700' : 'mb-3'}`}
            onClick={() => paymentBannerMinimized && setPaymentBannerMinimized(false)}
          >
            No Payment Required - This is Just for Planning
          </h3>
          <AnimatePresence>
            {!paymentBannerMinimized && (
              <motion.div
                initial={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong>Important:</strong> Choosing which website package is right for you is <strong>not a commitment to pay</strong> during this form process. This selection simply helps us understand what kind of website preview to build for you.
                  </p>
                  <p>
                    <strong>No payment is due</strong> upon completion of this form, or at any point during your Introspect experience. The pricing estimates shown are accurate and transparent, but you won't be charged anything right now.
                  </p>
                  <p>
                    Here's how it works: Introspect gathers all the requirements needed to build your website. Once we have your website requirements, we hand it off to our development team at Applicreations, where real developers will create a working prototype of your website.
                  </p>
                  <p>
                    <strong>Timeline:</strong> In most simpler websites, the website preview will be delivered in 48 hours or less. Other more complicated sites will require more time and attention to make sure we achieve not just a working product, but one that exceeds your standards and may not hit the 48 hour window. Applicreations will always communicate estimated timelines. After you review your prototype, if you approve and want to move forward, Applicreations will begin finalizing development and polishing your site. <strong>That's when your first payment would be due</strong> - only after you've seen and approved your actual prototype.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={paymentBannerMinimized}
                      onCheckedChange={(checked) => setPaymentBannerMinimized(checked === true)}
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      I understand no payment is due today
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Website Packages */}
      <div className="mb-8">
        {/* VERTICAL STACK - Horizontal cards stacked vertically */}
        <div className="flex flex-col gap-4">
          {WEBSITE_PACKAGES.map((pkg) => {
            const isSelected = selectedWebsitePackage === pkg.id
            // Read expanded state for THIS SPECIFIC CARD ONLY from the Record
            // Each card reads its own state: expandedWebsitePackages[cardId]
            const isExpanded = expandedWebsitePackages[pkg.id] === true
            console.log(`[PackageSelection] Rendering card ${pkg.id}: isExpanded=${isExpanded}, all states:`, { ...expandedWebsitePackages })
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-auto"
              >
                <Card
                  className={`transition-all flex flex-col relative ${
                    isSelected
                      ? 'border-2 border-blue-500 shadow-md'
                      : 'border border-gray-200 hover:border-gray-300'
                  } ${pkg.popular ? 'border-green-500 border-2' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap z-30">
                      Most Popular
                    </div>
                  )}
                  
                  {/* Selection Box - Top Right - INSIDE CARD */}
                  <div 
                    className="absolute top-3 right-3 z-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      // Toggle selection - allow unselecting
                      setSelectedWebsitePackage(isSelected ? null : pkg.id)
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <div className="group relative cursor-pointer">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 bg-white group-hover:border-blue-500 group-hover:bg-blue-50'
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                          {isSelected ? 'Unselect' : 'Select this package'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collapsed State - Horizontal Layout */}
                  <div 
                    className="cursor-pointer flex-1"
                    onClick={(e) => {
                      // CRITICAL: Stop all event propagation immediately to prevent parent handlers
                      e.stopPropagation()
                      e.preventDefault()
                      
                      // Capture the card identifier from the map closure - THIS IS THE KEY
                      // Each card in the map has a unique pkg.id that identifies it
                      const clickedCardId: WebsitePackage = pkg.id
                      
                      // VERIFICATION: Log which card was clicked
                      console.log(`[PackageSelection] Card click handler fired for: ${clickedCardId}`)
                      console.log(`[PackageSelection] Current expanded states:`, { ...expandedWebsitePackages })
                      
                      // Defensive check: Ensure we have a valid card identifier
                      if (!clickedCardId || !['starter', 'professional', 'custom'].includes(clickedCardId)) {
                        console.warn(`[PackageSelection] Invalid card ID, aborting: ${clickedCardId}`)
                        return
                      }
                      
                      // Call toggle handler with the SPECIFIC card identifier
                      // This will update ONLY this card's state in the Record
                      toggleWebsitePackage(clickedCardId)
                    }}
                    onMouseDown={(e) => {
                      // Prevent any mouse event propagation
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  >
                    <CardHeader className="p-4 flex-1 flex flex-row items-center justify-between min-h-[80px]">
                      <div className="flex-1 pr-10">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                          {pkg.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-1">{pkg.description}</p>
                        <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-4 pr-14">
                        <div className="text-right min-w-[120px]">
                          {pkg.basePrice !== null ? (
                            <>
                              <div className="text-xs text-gray-500 mb-0.5">Starting at</div>
                              <div className="text-2xl font-bold text-gray-900">
                                ${pkg.basePrice.toLocaleString()}
                              </div>
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-gray-900">
                              Custom
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </div>

                  {/* Expanded State - Animated */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        key={`website-expanded-${pkg.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="px-4 pb-4 pt-0 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 mt-3">
                            {/* Left column - first half of features */}
                            <div className="space-y-1.5">
                              {pkg.features.slice(0, Math.ceil(pkg.features.length / 2)).map((feature, idx) => {
                                const isFeatureSelection = feature.toLowerCase().includes('feature selection')
                                return (
                                  <div key={`left-${idx}`}>
                                    <div className="flex items-start gap-2 text-sm text-gray-700">
                                      <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="leading-relaxed font-bold">{feature}</span>
                                    </div>
                                    {isFeatureSelection && (
                                      <p className="text-xs text-gray-500 -mt-1 ml-6 leading-relaxed">
                                        {pkg.id === 'custom' ? (
                                          <>*8 features are included in the base custom price. <span style={{ fontWeight: 'bold' }}>Additional features are PRICED SEPARATELY and added to the base price.</span></>
                                        ) : pkg.maxFeatureSelections !== null ? (
                                          <>Select your features (up to {pkg.maxFeatureSelections}) in the next step. <span style={{ fontWeight: 'bold' }}>Each feature is PRICED SEPARATELY and added to the base price.</span></>
                                        ) : (
                                          <>Select your features in the next step. <span style={{ fontWeight: 'bold' }}>Each feature is PRICED SEPARATELY and added to the base price.</span></>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            {/* Right column - second half of features */}
                            <div className="space-y-1.5">
                              {pkg.features.slice(Math.ceil(pkg.features.length / 2)).map((feature, idx) => {
                                const originalIdx = Math.ceil(pkg.features.length / 2) + idx
                                const isFeatureSelection = feature.toLowerCase().includes('feature selection')
                                return (
                                  <div key={`right-${originalIdx}`}>
                                    <div className="flex items-start gap-2 text-sm text-gray-700">
                                      <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="leading-relaxed font-bold">{feature}</span>
                                    </div>
                                    {isFeatureSelection && (
                                      <p className="text-xs text-gray-500 -mt-1 ml-6 leading-relaxed">
                                        {pkg.id === 'custom' ? (
                                          <>*8 features are included in the base custom price. <span style={{ fontWeight: 'bold' }}>Additional features are PRICED SEPARATELY and added to the base price.</span></>
                                        ) : pkg.maxFeatureSelections !== null ? (
                                          <>Select your features (up to {pkg.maxFeatureSelections}) in the next step. <span style={{ fontWeight: 'bold' }}>Each feature is PRICED SEPARATELY and added to the base price.</span></>
                                        ) : (
                                          <>Select your features in the next step. <span style={{ fontWeight: 'bold' }}>Each feature is PRICED SEPARATELY and added to the base price.</span></>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              // Toggle selection - allow unselecting
                              setSelectedWebsitePackage(isSelected ? null : pkg.id)
                            }}
                            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isSelected ? 'Unselect' : 'Select Package'}
                          </button>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Hosting & Maintenance Packages */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hosting & Maintenance
          </h2>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
            {([3, 6, 12] as HostingDuration[]).map((duration) => {
              const discount = DURATION_DISCOUNTS[duration]
              const isSelected = hostingDuration === duration
              return (
                <button
                  key={duration}
                  onClick={() => setHostingDuration(duration)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {duration} Months{discount > 0 && ` (-${Math.round(discount * 100)}%)`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Hosting Package Cards */}
        {/* VERTICAL STACK - Horizontal cards stacked vertically */}
        <div className="flex flex-col gap-3 mb-6">
          {/* None Option */}
          <Card
            className={`transition-all flex flex-col relative ${
              selectedHostingPackage === 'none'
                ? 'border-2 border-blue-500 shadow-md'
                : 'border border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Selection Box - Top Right - INSIDE CARD */}
            <div 
              className="absolute top-3 right-3 z-20"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                // Select "No Hosting" option
                setSelectedHostingPackage('none')
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
            >
              <div className="group relative cursor-pointer">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  selectedHostingPackage === 'none'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white group-hover:border-blue-500 group-hover:bg-blue-50'
                }`}>
                  {selectedHostingPackage === 'none' && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {selectedHostingPackage === 'none' ? 'Unselect' : 'Select this package'}
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="cursor-pointer flex-1"
              onClick={() => setSelectedHostingPackage('none')}
            >
              <CardHeader className="p-4 flex-1 flex flex-row items-center justify-between min-h-[80px]">
                <div className="flex-1 pr-8">
                  <CardTitle className="text-base font-bold text-gray-900 mb-1">
                    No Hosting
                  </CardTitle>
                  <CardDescription className="text-sm">
                    I'll handle hosting myself
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 pr-14">
                  <div className="text-right min-w-[120px]">
                    <span className="text-xl font-bold text-gray-900">$0</span>
                    <span className="text-xs text-gray-500 ml-1.5">/month</span>
                  </div>
                </div>
              </CardHeader>
            </div>
          </Card>

          {/* Hosting Options */}
          {hostingPrices.map((pkg) => {
            const isSelected = selectedHostingPackage === pkg.id
            const isPopular = pkg.id === 'pro'
            // Read expanded state for THIS SPECIFIC CARD ONLY from the Record
            // Each card reads its own state: expandedHostingPackages[cardId]
            const isExpanded = expandedHostingPackages[pkg.id] === true
            
            return (
              <Card
                key={pkg.id}
                className={`transition-all flex flex-col relative ${
                  isSelected
                    ? 'border-2 border-blue-500 shadow-md'
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isPopular ? 'border-green-500 border-2' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap z-30">
                    Most Popular
                  </div>
                )}
                
                {/* Selection Box - Top Right - INSIDE CARD */}
                <div 
                  className="absolute top-3 right-3 z-20"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    // Toggle selection - allow unselecting
                    setSelectedHostingPackage(isSelected ? 'none' : pkg.id)
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <div className="group relative cursor-pointer">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 bg-white group-hover:border-blue-500 group-hover:bg-blue-50'
                    }`}>
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                        {isSelected ? 'Unselect' : 'Select this package'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Collapsed State - Horizontal Layout */}
                <div 
                  className="cursor-pointer flex-1"
                  onClick={(e) => {
                    // CRITICAL: Stop all event propagation immediately
                    e.stopPropagation()
                    e.preventDefault()
                    
                    // Capture the card identifier from the map closure
                    const clickedCardId: HostingPackage = pkg.id
                    
                    // VERIFICATION: Log which card was clicked
                    console.log(`[PackageSelection] Hosting card click: ${clickedCardId}`)
                    
                    // Call toggle handler with the SPECIFIC card identifier
                    // This will update ONLY this card's state in the Record
                    toggleHostingPackage(clickedCardId)
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  <CardHeader className="p-4 flex-1 flex flex-row items-center justify-between min-h-[80px]">
                    <div className="flex-1 pr-8">
                      <CardTitle className="text-base font-bold text-gray-900 mb-1">
                        {pkg.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4 pr-14">
                      <div className="text-right min-w-[120px]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold text-gray-900">
                            ${pkg.monthlyPrice}
                          </span>
                          <span className="text-xs text-gray-500">/month</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </div>

                {/* Expanded State - Animated */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`hosting-expanded-${pkg.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="px-4 pb-4 pt-0 border-t border-gray-200">
                        <div className="mb-2 mt-3">
                          <div className="text-xs text-gray-500 mb-1">
                            ${pkg.totalPrice.toLocaleString()} total for {hostingDuration} months
                          </div>
                          {pkg.savings > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              Save ${pkg.savings}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Monthly Work Credit */}
                        <div className="bg-blue-50 rounded-lg p-2.5 mb-3 text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {pkg.workCreditHours} {pkg.workCreditHours === 1 ? 'Hour' : 'Hours'}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            Monthly Work Credit
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                          {/* Left column - first half of features */}
                          <div className="space-y-1.5">
                            {pkg.features.slice(0, Math.ceil(pkg.features.length / 2)).map((feature, idx) => {
                              return (
                                <div key={`left-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
                                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="leading-relaxed font-bold">{feature}</span>
                                </div>
                              )
                            })}
                          </div>
                          {/* Right column - second half of features */}
                          <div className="space-y-1.5">
                            {pkg.features.slice(Math.ceil(pkg.features.length / 2)).map((feature, idx) => {
                              const originalIdx = Math.ceil(pkg.features.length / 2) + idx
                              return (
                                <div key={`right-${originalIdx}`} className="flex items-start gap-2 text-sm text-gray-700">
                                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="leading-relaxed font-bold">{feature}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            // Toggle selection - allow unselecting
                            setSelectedHostingPackage(isSelected ? 'none' : pkg.id)
                          }}
                          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isSelected ? 'Unselect' : 'Select Package'}
                        </button>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>

        {/* Support Period Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-4xl mx-auto">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">*Support Period:</span> All website projects include complimentary support for the specified period (30-90 days depending on package). After this period, ongoing maintenance is available through our hosting & maintenance packages above.
          </p>
        </div>
      </div>

      {/* Price Calculator */}
      {selectedWebsitePackage && (
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-md">
            <CompactPriceCalculator
              websitePackage={selectedWebsitePackage}
              hostingPackage={selectedHostingPackage}
              hostingDuration={hostingDuration}
              defaultExpanded={true}
            />
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
        >
          {isSubmitting ? 'Processing...' : 'Continue to Features'}
        </Button>
      </div>
    </div>
  )
}

