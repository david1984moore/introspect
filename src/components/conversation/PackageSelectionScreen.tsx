'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceCalculator } from './PriceCalculator'

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

const WEBSITE_PACKAGES: WebsitePackageOption[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    subtitle: 'Perfect for small businesses',
    description: 'A professional 5-page website that gets you online fast.',
    basePrice: 2500,
    features: [
      '5 custom pages',
      'Mobile-responsive design',
      'SEO optimization',
      'Contact form',
      'Google Analytics',
      '30 days support*'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Website',
    subtitle: 'Best value for growing businesses',
    description: 'Everything you need to compete online and capture leads.',
    basePrice: 4500,
    features: [
      'Up to 8 custom pages',
      'Advanced SEO setup',
      'Lead capture forms',
      'Email integration',
      'CMS for easy updates',
      'Social media integration',
      '60 days support*',
      'Performance optimization'
    ],
    popular: true
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    subtitle: 'Built for your needs',
    description: 'Complex applications with custom functionality.',
    basePrice: null,
    features: [
      'Unlimited pages',
      'Custom features',
      'Database integration',
      'User authentication',
      'API development',
      'Cloud hosting setup',
      '90 days support',
      'Ongoing maintenance available'
    ]
  }
]

const HOSTING_PACKAGES: HostingPackageOption[] = [
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
      {/* Website Packages */}
      <div className="mb-10">
        {/* GRID CONTAINER - items-start prevents cards from stretching to match tallest card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
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
                  className={`transition-all flex flex-col relative overflow-hidden ${
                    isSelected
                      ? 'border-2 border-blue-500 shadow-md'
                      : 'border border-gray-200 hover:border-gray-300'
                  } ${pkg.popular ? 'border-green-500 border-2' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap z-10">
                      Most Popular
                    </div>
                  )}
                  
                  {/* Selection Box - Top Right - INSIDE CARD */}
                  <div 
                    className="absolute top-3 right-3 z-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setSelectedWebsitePackage(pkg.id)
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
                      <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                          Select this package
                        </div>
                        <div className="absolute right-1.5 -top-1 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collapsed State - Always Visible */}
                  <div 
                    className="cursor-pointer flex-1 flex flex-col"
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
                    <CardHeader className="p-5 flex-1 flex flex-col justify-center min-h-[140px]">
                      <div className="pr-8">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-3">
                          {pkg.name}
                        </CardTitle>
                        <div>
                          {pkg.basePrice !== null ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                ${pkg.basePrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">one-time</span>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-gray-900">
                              Custom
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </div>

                  {/* Selected Indicator - Show when collapsed and selected */}
                  {!isExpanded && isSelected && (
                    <div className="px-5 pb-4">
                      <div className="flex items-center justify-center gap-1.5 text-blue-600 font-medium text-xs pt-3 border-t border-gray-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </div>
                    </div>
                  )}

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
                        <CardContent className="px-5 pb-5 pt-0">
                          <p className="text-sm text-blue-600 font-medium mb-2">
                            {pkg.subtitle}
                          </p>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {pkg.description}
                          </p>
                          
                          <ul className="space-y-2 mb-4">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setSelectedWebsitePackage(pkg.id)
                            }}
                            className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select Package'}
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
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Hosting & Maintenance Packages
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed">
            Keep your website secure, fast, and up-to-date with our comprehensive maintenance packages. Each includes monthly work credits for updates and improvements.
          </p>
        </div>

        {/* Duration Selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            {([3, 6, 12] as HostingDuration[]).map((duration) => {
              const discount = DURATION_DISCOUNTS[duration]
              const isSelected = hostingDuration === duration
              return (
                <button
                  key={duration}
                  onClick={() => setHostingDuration(duration)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
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
        {/* GRID CONTAINER - items-start prevents cards from stretching to match tallest card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-start">
          {/* None Option */}
          <Card
            className={`cursor-pointer transition-all flex flex-col ${
              selectedHostingPackage === 'none'
                ? 'border-2 border-gray-400 shadow-md'
                : 'border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedHostingPackage('none')}
          >
            <CardHeader className="p-5 flex-1 flex flex-col justify-center min-h-[140px]">
              <CardTitle className="text-base font-bold text-gray-900 mb-3">
                No Hosting
              </CardTitle>
              <CardDescription className="text-sm">
                I'll handle hosting myself
              </CardDescription>
              <div className="mt-3">
                <span className="text-xl font-bold text-gray-900">$0</span>
                <span className="text-xs text-gray-500 ml-1.5">/month</span>
              </div>
            </CardHeader>
            {selectedHostingPackage === 'none' && (
              <CardContent className="pt-0 pb-4 px-5">
                <div className="flex items-center justify-center gap-1.5 text-gray-600 font-medium text-xs pt-3 border-t border-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selected</span>
                </div>
              </CardContent>
            )}
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
                className={`transition-all flex flex-col relative overflow-hidden ${
                  isSelected
                    ? 'border-2 border-blue-500 shadow-md'
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isPopular ? 'border-green-500 border-2' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap z-10">
                    Most Popular
                  </div>
                )}
                
                {/* Selection Box - Top Right - INSIDE CARD */}
                <div 
                  className="absolute top-3 right-3 z-20"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setSelectedHostingPackage(pkg.id)
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
                    <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                        Select this package
                      </div>
                      <div className="absolute right-1.5 -top-1 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
                
                {/* Collapsed State - Always Visible */}
                <div 
                  className="cursor-pointer flex-1 flex flex-col"
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
                  <CardHeader className="p-5 flex-1 flex flex-col justify-center min-h-[140px]">
                    <div className="pr-8">
                      <CardTitle className="text-base font-bold text-gray-900 mb-3">
                        {pkg.name}
                      </CardTitle>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-gray-900">
                          ${pkg.monthlyPrice}
                        </span>
                        <span className="text-xs text-gray-500">/month</span>
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
                      <CardContent className="px-5 pb-5 pt-0">
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">
                            ${pkg.totalPrice.toLocaleString()} total for {hostingDuration} months
                          </div>
                          {pkg.savings > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              Save ${pkg.savings}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {pkg.subtitle}
                        </p>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Monthly Work Credit */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {pkg.workCreditHours} {pkg.workCreditHours === 1 ? 'Hour' : 'Hours'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Monthly Work Credit
                          </div>
                        </div>
                        
                        <ul className="space-y-2 mb-4">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setSelectedHostingPackage(pkg.id)
                          }}
                          className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select Package'}
                        </button>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Indicator - Show when collapsed and selected */}
                {!isExpanded && isSelected && (
                  <div className="px-5 pb-4">
                    <div className="flex items-center justify-center gap-1.5 text-blue-600 font-medium text-xs pt-3 border-t border-gray-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Support Period Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">*Support Period:</span> All website projects include complimentary support for the specified period (30-90 days depending on package). After this period, ongoing maintenance is available through our hosting & maintenance packages above.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
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

