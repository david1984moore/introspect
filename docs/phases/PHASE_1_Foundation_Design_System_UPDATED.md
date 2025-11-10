# Phase 1: Foundation & Design System
**Days 1-3 | Introspect V3 Implementation**

## Overview

This phase establishes the foundational architecture and design system for Introspect V3, implementing Jobs/Ives design principles and creating the single-track intake flow foundation.

**Duration:** 3 days  
**Dependencies:** None (starting fresh)  
**Deliverables:** 
- Configured Next.js 15.5.6 project with TypeScript
- Jobs/Ives design system implementation
- Landing page with AI signals
- Core component library
- Foundation form (Questions 1-4)
- Business model classification types

---

## Day 1: Project Setup & Design System

### 1.1 Next.js Project Configuration

```bash
# Create project with specific versions
npx create-next-app@latest introspect-v3 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd introspect-v3

# Install specific versions
npm install next@15.5.6 react@19.1.0 react-dom@19.1.0
npm install -D typescript@5.x @types/react @types/node
```

### 1.2 Design System Implementation

**File:** `src/styles/design-system.ts`

```typescript
// Perfect Fourth Typography Scale (1.333 ratio)
export const typography = {
  '3xl': 'text-[3.157rem] leading-[1.1]',  // 50.52px - Hero
  '2xl': 'text-[2.369rem] leading-[1.2]',  // 37.90px - Section
  'xl': 'text-[1.777rem] leading-[1.3]',   // 28.43px - Subsection
  'lg': 'text-[1.333rem] leading-[1.4]',   // 21.33px - Emphasis
  'base': 'text-base leading-[1.6]',       // 16px - Body
  'sm': 'text-[0.875rem] leading-[1.5]',   // 14px - Small
  'xs': 'text-[0.75rem] leading-[1.5]',    // 12px - Fine print
} as const

// 8-point spacing grid
export const spacing = {
  0: '0',
  1: '0.5rem',   // 8px
  2: '1rem',     // 16px
  3: '1.5rem',   // 24px
  4: '2rem',     // 32px
  6: '3rem',     // 48px
  8: '4rem',     // 64px
  12: '6rem',    // 96px
  16: '8rem',    // 128px
} as const

// OKLCH color system for perceptual uniformity
export const colors = {
  primary: 'oklch(58% 0.20 240)',     // Blue
  accent: 'oklch(72% 0.18 160)',      // Teal
  gray: {
    900: 'oklch(15% 0 0)',            // Text
    800: 'oklch(25% 0 0)',
    700: 'oklch(40% 0 0)',
    600: 'oklch(50% 0 0)',
    500: 'oklch(60% 0 0)',
    400: 'oklch(70% 0 0)',
    300: 'oklch(80% 0 0)',
    200: 'oklch(90% 0 0)',
    100: 'oklch(96% 0 0)',            // Background
    50: 'oklch(98% 0 0)',
  },
  success: 'oklch(70% 0.20 140)',
  warning: 'oklch(75% 0.15 80)',
  error: 'oklch(65% 0.25 30)',
} as const

// Apple system font stack
export const fontFamily = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),
}
```

### 1.3 Business Model Types Definition

**File:** `src/types/business-models.ts`

```typescript
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
```

---

## Day 2: Landing Page & Core Components

### 2.1 Landing Page with AI Signals

**File:** `src/app/page.tsx`

```tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Sparkles, Clock } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - 70% whitespace principle */}
      <section className="container mx-auto px-4 pt-16 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* AI Signal Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-primary/10 text-primary text-sm"
          >
            <Brain className="w-4 h-4" />
            AI-Powered Discovery
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[3.157rem] leading-[1.1] font-semibold text-gray-900"
          >
            Transform Client Conversations into
            <span className="text-primary block mt-2">
              Complete Project Specifications
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[1.333rem] text-gray-600 max-w-2xl mx-auto"
          >
            Skip the sales calls. Our intelligent system gathers 100% of project 
            requirements through guided conversation, then generates complete 
            technical specifications and client proposals automatically.
          </motion.p>

          {/* CTA with Progressive Disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/intake">
              <Button size="lg" className="group">
                Begin Your Project Discovery
                <ArrowRight className="ml-2 w-4 h-4 transition-transform 
                                     group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>15-20 minutes</span>
              <Sparkles className="w-4 h-4 ml-2" />
              <span>No forms, just conversation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Intelligent Orchestration',
                description: 'Not a chatbot. A systematic discovery process that adapts to your specific business model.',
                icon: Brain,
              },
              {
                title: 'Complete Specifications',
                description: '100% of required information gathered. No follow-up calls or clarification needed.',
                icon: Sparkles,
              },
              {
                title: 'Instant Documentation',
                description: 'Technical specs for developers. Business-friendly proposals for clients. Both generated automatically.',
                icon: Clock,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center space-y-3"
              >
                <feature.icon className="w-8 h-8 mx-auto text-primary" />
                <h3 className="text-[1.333rem] font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### 2.2 Core Component Library

**File:** `src/components/ui/button.tsx`

```tsx
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-lg font-medium
   transition-all focus-visible:outline-none focus-visible:ring-2
   focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:opacity-90',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100',
        outline: 'border border-gray-300 hover:bg-gray-100',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-[1.125rem]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

---

## Day 3: Foundation Form Implementation

### 3.1 Foundation Form with Progressive Disclosure

**File:** `src/app/intake/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useConversationStore } from '@/stores/conversationStore'

// Validation schemas
const foundationSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Please enter a valid email'),
  userPhone: z.string().optional(),
  websiteType: z.enum(['business', 'personal', 'project', 'nonprofit', 'other']),
  otherDescription: z.string().optional(),
})

type FoundationData = z.infer<typeof foundationSchema>

const websiteTypes = [
  { value: 'business', label: 'Business Website', icon: '🏢' },
  { value: 'personal', label: 'Personal/Portfolio', icon: '👤' },
  { value: 'project', label: 'Project/Campaign', icon: '🚀' },
  { value: 'nonprofit', label: 'Non-Profit Organization', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '✨' },
]

export default function FoundationForm() {
  const router = useRouter()
  const { setFoundation } = useConversationStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FoundationData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNext = () => {
    // Validate current step
    let isValid = true
    const newErrors: Record<string, string> = {}

    if (currentStep === 1 && !formData.userName) {
      newErrors.userName = 'Please enter your name'
      isValid = false
    }
    if (currentStep === 2 && !formData.userEmail) {
      newErrors.userEmail = 'Please enter your email'
      isValid = false
    }

    setErrors(newErrors)
    
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = () => {
    try {
      const validated = foundationSchema.parse(formData)
      
      // Set foundation data and mark initial business model as unknown
      setFoundation({
        userName: validated.userName,
        userEmail: validated.userEmail,
        userPhone: validated.userPhone || '',
        websiteType: formData.websiteType === 'other' 
          ? formData.otherDescription || 'other'
          : formData.websiteType!,
      })
      
      // Navigate to conversation
      router.push('/intake/conversation')
    } catch (error) {
      console.error('Validation error:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-gray-600">
              Foundation Questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What's your name?
                  </h2>
                  <p className="text-gray-600">
                    Let's start with a proper introduction.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userName"
                    type="text"
                    placeholder="John Smith"
                    value={formData.userName || ''}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    onKeyPress={handleKeyPress}
                    className={errors.userName ? 'border-red-500' : ''}
                    autoFocus
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-500">{errors.userName}</p>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Hi {formData.userName}! What's your email?
                  </h2>
                  <p className="text-gray-600">
                    We'll send your project scope here.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.userEmail || ''}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    onKeyPress={handleKeyPress}
                    className={errors.userEmail ? 'border-red-500' : ''}
                    autoFocus
                  />
                  {errors.userEmail && (
                    <p className="text-sm text-red-500">{errors.userEmail}</p>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full">
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 3: Phone (Optional) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Phone number?
                  </h2>
                  <p className="text-gray-600">
                    Optional - for urgent updates only.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Input
                    id="userPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.userPhone || ''}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <Button onClick={handleNext} className="w-full">
                    Continue
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    variant="ghost" 
                    className="w-full"
                  >
                    Skip
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Website Type */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What kind of website are we building?
                  </h2>
                  <p className="text-gray-600">
                    This helps me ask the right questions.
                  </p>
                </div>
                
                <RadioGroup
                  value={formData.websiteType}
                  onValueChange={(value) => setFormData({ ...formData, websiteType: value as any })}
                >
                  {websiteTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3 mb-3">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label 
                        htmlFor={type.value}
                        className="flex items-center gap-2 cursor-pointer flex-1 p-3 
                                 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-base">{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {formData.websiteType === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Input
                      id="otherDescription"
                      type="text"
                      placeholder="Describe your project..."
                      value={formData.otherDescription || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        otherDescription: e.target.value 
                      })}
                      autoFocus
                    />
                  </motion.div>
                )}

                <Button 
                  onClick={handleNext} 
                  className="w-full"
                  disabled={!formData.websiteType}
                >
                  Start Conversation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
```

---

## Testing Checklist

### Design System
- [ ] Typography scale follows Perfect Fourth (1.333)
- [ ] All spacing uses 8-point grid
- [ ] Colors use OKLCH values
- [ ] System fonts load instantly
- [ ] 70% whitespace on landing page

### Foundation Form
- [ ] Progressive disclosure works (one question at a time)
- [ ] Enter key advances to next question
- [ ] Validation prevents empty submissions
- [ ] Skip works for phone field
- [ ] "Other" reveals text input
- [ ] All inputs have proper labels

### Performance
- [ ] Landing page FCP < 1.5s
- [ ] No layout shifts (CLS = 0)
- [ ] Smooth animations (60fps)
- [ ] Mobile responsive at 320px

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Color contrast > 4.5:1

---

## Success Criteria

✅ Jobs/Ives design principles implemented  
✅ Landing page creates trust and clarity  
✅ Foundation form completes without friction  
✅ Business model types defined for Phase 3  
✅ Component library follows design system  
✅ Mobile responsive at all breakpoints  
✅ Animations smooth and purposeful  
✅ Code structure ready for feature expansion

---

## Next Phase

Phase 2 will add state management with Zustand, security layers, and session persistence, preparing for Claude orchestration and feature recommendations in Phase 3.
