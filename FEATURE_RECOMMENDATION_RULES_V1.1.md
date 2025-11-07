# Feature Recommendation Rules
**Introspect V3 - Intelligence-to-Feature Mapping Engine**

**Version:** 1.1  
**Date:** November 6, 2025  
**Author:** David Moore (Applicreations)  
**Purpose:** Define systematic rules for Claude to generate context-aware feature recommendations  
**Status:** Production Ready  
**Changelog:** Aligned timing with Architecture (10-12 questions), simplified ROI approach, added question efficiency context, added compliance-driven recommendations

---

## Document Purpose

This document serves as the **recommendation engine specification** that bridges:

1. **Intelligence Gathered** (from conversation) → 
2. **Feature Selection** (what to recommend) → 
3. **Priority Classification** (essential/highly recommended/nice to have) → 
4. **Personalized Reasoning** (why this feature for this client)

Claude uses these rules to generate consistent, high-quality feature recommendations that align with the client's specific business context, goals, and constraints.

---

## Executive Summary

**The Problem This Solves:**

The Architecture document defines *how* features should be presented (modal UI, after gathering context). The Feature Library defines *what* features exist (with pricing and descriptions). But there's a critical gap: **How does Claude decide which features to recommend and why?**

This document provides that missing link with:
- Pattern recognition rules for identifying business contexts
- Priority classification logic for each feature
- Reasoning templates that ensure personalization
- ROI guidance using session data
- Conflict detection and resolution strategies

**How Claude Uses This:**

During conversation (questions 5-15), Claude extracts structured intelligence about the business. When sufficient context is gathered (typically questions 10-12), Claude evaluates every feature in the library against the rules in this document to determine:
1. Is this feature relevant?
2. How critical is it (essential/recommended/nice)?
3. Why specifically does THIS client need it?
4. What's the quantified value/ROI?

The output is a personalized feature recommendation presented via modal overlay, with each feature justified by the client's specific situation.

**Question Efficiency Context:**

Feature presentation occurs during the 20-25 question optimization window (maximum 30 questions absolute limit). The feature recommendation interaction counts as 1-2 questions in the overall flow, so recommendations should be comprehensive enough that follow-up feature questions aren't needed. This is why feature presentation timing and completeness are critical - it's a single opportunity to present all relevant options.

---

## Part 1: How Claude Uses This Document

### Intelligence Extraction Phase

As Claude asks questions, it builds a structured intelligence object:

```typescript
interface SessionIntelligence {
  // Business Model Classification
  businessModel: 'service' | 'product' | 'content' | 'membership' | 'hybrid'
  
  // Business Context
  businessType: string
  industry: string
  primaryGoal: string
  targetAudience: string
  
  // Operational Indicators  
  requiresScheduling: boolean
  hasInventory: boolean
  acceptsPayments: boolean
  hasMembers: boolean
  publishesContent: boolean
  
  // Volume & Scale
  appointmentsPerWeek?: number
  productsToSell?: number
  memberCount?: number
  estimatedTraffic: 'low' | 'medium' | 'high'
  
  // Pain Points
  manualProcesses: string[]
  currentNoShowRate?: number
  timeSpentOnTask?: Record<string, number>
  
  // Compliance & Security
  complianceRequirements?: ('HIPAA' | 'PCI-DSS' | 'GDPR' | 'ADA')[]
  securityNeeds?: string[]
  
  // Goals & Constraints
  budgetRange: string
  launchTimeline: string
}
```

### Recommendation Trigger

**CRITICAL TIMING ALIGNMENT:**

Present features when ALL conditions met:
- ✓ Business type identified
- ✓ Primary goal defined
- ✓ Target audience specified
- ✓ Core user actions identified
- ✓ Business context category ≥80% complete
- ✓ Technical context category ≥60% complete
- ✓ 10-12 questions answered (minimum 8, maximum 15)
- ✓ Features not yet presented

**Typical Question Count:** 10-12 questions (aligns with Architecture specification)

**Absolute Boundaries:**
- Do NOT present before question 8 (insufficient context)
- Do NOT present after question 15 (too late in flow)
- Present exactly ONCE per conversation

---

## Part 2: Feature Evaluation Framework

For each feature, Claude determines:

### 1. Relevance
Does this feature apply to this business context?

**Check:**
- Business model match (service/product/content/membership)
- Industry fit
- Scale appropriateness  
- Technical prerequisite met

### 2. Priority
How critical is this feature?

**Essential IF:**
- Directly enables primary revenue stream
- Prevents significant financial loss (>$10K annually)
- Required by industry standards or compliance
- Competitive necessity (competitors all have it)

**Highly Recommended IF:**
- Saves >5 hours/week in manual processes
- Improves revenue >15% based on industry data
- Solves identified pain point user explicitly mentioned
- Enables strategic goal user stated

**Nice to Have IF:**
- Beneficial but not critical to core operations
- Future enhancement opportunity
- Budget-dependent luxury feature
- Emerging best practice (not yet standard)

### 3. Reasoning
Why specifically for THIS client?

**Formula:**
```
[Their Business Context] + [Specific Need/Pain Point] + [Feature Solution] + [Quantified Benefit]
```

**Example:**
"Your salon with 50 weekly appointments across 3 stylists spends ~12 hours weekly on phone scheduling. This system eliminates scheduling phone tag, reduces no-shows from 18% to 5% through automated reminders, and captures bookings 24/7. Estimated annual value: $31,200 in recovered time and reduced no-shows."

### 4. ROI Guidance (Simplified Approach)

**Qualitative ROI with Quantification When Data Available**

Provide clear benefit descriptions with quantified value only when user provided specific metrics:

**Time Savings ROI:**
```
IF user mentioned time spent on task:
  "Saves approximately [X] hours per week, worth ~$[hourly rate × hours × 52] annually"

IF user didn't provide specific numbers:
  "Significantly reduces time spent on [task], freeing your team for revenue-generating work"
```

**Revenue Impact ROI:**
```
IF user provided revenue/transaction data:
  "Industry data shows [X]% improvement in [metric], which for your volume means approximately $[calculated amount] additional annual revenue"

IF user didn't provide numbers:
  "Typically increases [metric] by [X]%, directly impacting bottom-line revenue"
```

**No-Show/Loss Prevention ROI:**
```
IF user mentioned no-show rate or appointment volume:
  "Reduces no-shows from [current]% to ~5%, recovering approximately $[calculated loss] annually"

IF user didn't provide specifics:
  "Dramatically reduces no-shows through automated reminders, protecting revenue from missed appointments"
```

**Payback Period (when feature cost and annual value both known):**
```
"Payback period: approximately [X] months"
```

**Key Principle:** Always provide tangible benefit description. Add numbers when you have them, omit calculations when you don't. Never use placeholder numbers or generic ranges.

---

## Part 3: Business Model Classification

Claude must first classify the business model to filter relevant features:

### Service Provider Model

**Indicators:**
- Mentions appointments, bookings, sessions, consultations
- Time-based service delivery
- References scheduling, availability, calendar
- Pain points: no-shows, double-bookings, phone tag

**Examples:** Salons, consultants, therapists, photographers, tutors, coaches

**Relevant Features:**
- HIGH: Appointment/Booking Systems, SMS Notifications
- MEDIUM: Customer Portal, Email Marketing  
- LOW: E-commerce, Inventory Management

### Product-Based Retail Model

**Indicators:**
- Selling physical/digital products
- Mentions inventory, catalog, shipping
- References online sales, shopping cart
- Pain points: inventory tracking, order processing

**Examples:** Retailers, craftspeople, manufacturers, wholesalers

**Relevant Features:**
- HIGH: E-commerce, Payment Processing, Inventory Management
- MEDIUM: Email Marketing, Shipping Integration
- LOW: Appointment Systems, Booking

### Content Publisher Model

**Indicators:**
- Blog, news, media focus
- Emphasis on articles, audience building
- Mentions SEO, social presence, email list
- Pain points: content organization, engagement

**Examples:** Bloggers, news sites, magazines, content creators

**Relevant Features:**
- HIGH: Blog System, Email Marketing, Newsletter
- MEDIUM: Advanced SEO, Social Integration
- LOW: E-commerce, Booking Systems

### Membership/Community Model

**Indicators:**
- Mentions members, subscriptions, community
- Exclusive content or recurring access
- References member management, tiers
- Pain points: access control, billing

**Examples:** Associations, online courses, subscription services, communities

**Relevant Features:**
- HIGH: Membership Portal, Payment Processing
- MEDIUM: Email Marketing, Content Management
- LOW: Basic e-commerce

### Hybrid Models

**Recognition:**
Many businesses combine models (e.g., salon that sells products, content site with membership). Identify primary revenue model and secondary models.

**Approach:**
- Prioritize features for primary model
- Include essential features for secondary model
- Note the hybrid nature in reasoning: "As a salon with retail component..."

---

## Part 4: Key Feature Rules

### Appointment Scheduling System - $800

**Context Requirements:**
- Service provider model confirmed
- Appointment volume estimated (>5/week)

**Priority Logic:**

**Essential IF:**
- >15 appointments/week
- Core business model is appointment-based
- High no-show rate mentioned (>10%)
- Competition offers online booking

**Highly Recommended IF:**
- 5-15 appointments/week
- Time zone complexity mentioned
- Currently using basic calendar/manual system
- Growth goal requires better scheduling

**Reasoning Template:**
```
"As a [service type], your time is your inventory. With [X] appointments weekly, this scheduling system eliminates [manual process pain point], integrates with your calendar to prevent double-bookings, and allows clients to book instantly from real-time availability. [Add quantified benefit if data provided]."
```

**ROI Guidance:**
```
IF appointment volume and time spent provided:
  "Eliminates approximately [X] hours weekly of scheduling coordination, worth $[value] annually. Reduces no-shows through automated reminders, typically recovering $[estimated value] in lost appointments."

IF only appointment volume provided:
  "Significantly reduces scheduling overhead and captures bookings 24/7, even outside business hours. Automated reminders typically reduce no-shows by 60%."

IF minimal data:
  "Streamlines appointment management, reduces administrative burden, and improves client experience through 24/7 booking availability."
```

---

### E-commerce (Basic) - $1,200

**Context Requirements:**
- Product catalog size defined (<50 items)
- Sales model understood
- Payment acceptance needed

**Priority Logic:**

**Essential IF:**
- Product sales are primary revenue stream
- Currently losing sales (no online channel mentioned)
- Competition has e-commerce
- User mentioned wanting to sell online

**Highly Recommended IF:**
- 10-50 products to sell
- Expanding beyond local market goal
- Products represent significant revenue (30%+ of business)
- Inventory management is pain point

**Reasoning Template:**
```
"Your [product category] business with [X] products needs 24/7 sales capability beyond [current limitation]. E-commerce system provides professional storefront, secure checkout with Stripe integration, and reach beyond [local area]. [Add revenue projection if baseline data provided]."
```

**ROI Guidance:**
```
IF current revenue data provided:
  "Online sales expansion typically adds 40-60% to revenue within first year for businesses like yours, representing approximately $[estimated additional revenue]."

IF product count and pricing known:
  "With [X] products at average [price range], online channel accessibility provides significant growth opportunity."

IF minimal data:
  "Enables 24/7 sales, geographic expansion, and serves as foundation for long-term business growth."
```

---

### Email Marketing Integration - $400

**Context Requirements:**
- Customer-facing business
- Growth goals identified
- Customer repeat potential

**Priority Logic:**

**Essential IF:**
- E-commerce business (email drives 25-30% of online revenue)
- Customer lifetime value model mentioned
- Content publishing (audience growth is goal)
- Competition using email effectively

**Highly Recommended IF:**
- Any business wanting repeat customers
- Building brand awareness as goal
- Newsletter or content sharing planned
- Customer communication identified as need

**Reasoning Template:**
```
"Email marketing drives [industry-specific]% of [business type] revenue. [IF data: With [Y] annual customers and [Z] average transaction value, industry conversion rates suggest $[amount] in email-attributed revenue]. Integration enables automated campaigns for [specific use cases from their goals]."
```

**ROI Guidance:**
```
IF e-commerce with revenue data:
  "Email typically drives 25-30% of online revenue. For your volume, this represents approximately $[calculated] in attributed sales."

IF service business with repeat potential:
  "Increases repeat booking rates by 20-30% and generates 15-25% of revenue from existing customers through stay-top-of-mind communication."

IF content/audience building:
  "Converts website visitors to engaged audience. Email subscribers are 3-5x more likely to return and engage with content."

IF minimal data:
  "Most cost-effective marketing channel with highest ROI. Essential for building customer relationships and driving repeat business."
```

---

### Booking System - $800

**Context Requirements:**
- Reservation/booking model confirmed (not appointments)
- Volume estimated (bookings/day or week)

**Note:** Different from Appointment Scheduling - Booking is for reservations (restaurants, hotels, equipment rental), while Appointment Scheduling is for time-based services.

**Priority Logic:**

**Essential IF:**
- Primary revenue depends on bookings/reservations
- >20 bookings/week
- Competition offers online booking
- 24/7 availability is advantage

**Highly Recommended IF:**
- 10-20 bookings/week
- Time-saving opportunity identified
- Customer convenience is differentiator
- Peak time management is challenge

**Reasoning Template:**
```
"Your [business type] manages [X] weekly reservations. Booking system eliminates phone interruptions during [busy periods], captures bookings 24/7, and reduces no-shows through automated reminders. [Add time savings if data provided]."
```

**ROI Guidance:**
```
IF booking volume and no-show rate provided:
  "Manages [X] weekly bookings efficiently and reduces no-shows from [current]% to ~5%, protecting approximately $[calculated] annual revenue."

IF only volume provided:
  "Streamlines [X] weekly reservations, eliminating phone tag and capturing bookings during closed hours."

IF minimal data:
  "Provides 24/7 booking capability, reduces administrative burden, and improves customer experience."
```

---

### SMS Notifications - $300

**Context Requirements:**
- Time-sensitive communication needs
- Appointment/booking business
- Mobile-first customer base

**Priority Logic:**

**Essential IF:**
- High no-show rate mentioned (>15%)
- Appointment-based business model
- Delivery business requiring updates
- Mentioned wanting better reminder system

**Highly Recommended IF:**
- Moderate no-show rate (8-15%)
- Customer convenience is differentiator
- Day-of event reminders needed
- Time-sensitive updates required

**Reasoning Template:**
```
"SMS reminders have 98% open rate vs email's 20%. [IF data: At [Y] weekly appointments with [Z]% no-show rate, reducing to ~5% recovers approximately $[amount]/year]. Automation sends 24-hour and 2-hour reminders without staff involvement."
```

**ROI Guidance:**
```
IF appointment volume and no-show rate provided:
  "Reduces no-shows from [X]% to ~5%. At [Y] weekly appointments worth $[Z] each, this recovers approximately $[calculated] annually. Note: Includes small ongoing SMS cost (~$0.0075/message)."

IF only appointment volume:
  "Dramatically reduces no-shows through timely reminders. For businesses with [X] weekly appointments, typical savings far exceed the $300 setup cost within first month."

IF minimal data:
  "Most effective reminder method available. SMS ensures critical notifications are seen and acted upon."
```

---

### Advanced SEO Package - $600

**Context Requirements:**
- Organic search is acquisition channel
- Competitive landscape understood
- Content or product volume justifies optimization

**Priority Logic:**

**Essential IF:**
- Primary customer acquisition is search
- Highly competitive market
- Technical SEO issues identified
- Local search is critical (local business)

**Highly Recommended IF:**
- Want to reduce paid ad dependency
- Long-term organic growth strategy
- Content strategy benefits from keyword optimization
- Competing for valuable search terms

**Reasoning Template:**
```
"Your [industry] business competes for '[keywords]' against [competitive situation]. Advanced SEO targets [optimization opportunities]. [IF data: Ranking improvements typically generate [X] additional monthly organic visitors worth $[calculated value] vs current baseline]."
```

**ROI Guidance:**
```
IF traffic or customer acquisition cost data:
  "Organic search reduces customer acquisition cost from $[current CAC] to near-zero for ranked keywords. For target search volume, represents $[value] in avoided advertising spend annually."

IF competitive analysis done:
  "Your competitors ranking for [keywords] capture traffic you're missing. SEO investment targets these high-value opportunities."

IF minimal data:
  "Organic search provides sustainable, long-term traffic without ongoing advertising costs. Compounds in value over time."
```

---

### Payment Processing Integration - $500

**Context Requirements:**
- Business accepts payments
- Online payment capability needed

**Priority Logic:**

**Essential IF:**
- E-commerce selected
- Membership portal selected
- Online transactions are business model
- User explicitly needs to accept payments online

**Highly Recommended IF:**
- Currently using external payment processing
- Invoice payment automation desired
- Multiple payment methods needed
- Deposit/booking payment required

**Note:** This is typically an auto-include with E-commerce or Membership Portal due to dependency.

**Reasoning Template:**
```
"Secure Stripe integration enables [specific payment needs]. Accepts all major credit cards, Apple Pay, Google Pay, with PCI compliance handled automatically. [IF transaction volume known: Processing [X] transactions monthly, integrated checkout increases conversion by 15-30%]."
```

**ROI Guidance:**
```
IF transaction volume and cart abandonment data:
  "Streamlined checkout typically reduces cart abandonment from [X]% to ~8%, recovering approximately $[calculated] in otherwise-lost sales."

IF only transaction needs described:
  "Professional payment processing builds customer trust and enables business model. Essential infrastructure for online transactions."
```

---

### Blog/News System - $400

**Context Requirements:**
- Content publishing plan
- Audience building goal
- SEO strategy includes content

**Priority Logic:**

**Essential IF:**
- Content publishing is primary function
- News/updates are core offering
- Content marketing is acquisition strategy

**Highly Recommended IF:**
- SEO strategy requires content
- Thought leadership positioning goal
- Regular updates/news needed
- Customer education is value-add

**Reasoning Template:**
```
"Your [content strategy] requires professional publishing platform. Blog system includes content management, categories/tags, comments, social sharing, and SEO optimization. [IF publishing frequency known: Supports [X] posts monthly with streamlined workflow]."
```

---

### Membership Portal - $1,500

**Context Requirements:**
- Membership/subscription model
- Gated content or services
- Recurring access model

**Priority Logic:**

**Essential IF:**
- Membership is business model
- Tiered access levels needed
- Recurring billing required
- Private content/community

**Highly Recommended IF:**
- Exclusive content strategy
- Member-only benefits
- Community building goal
- Subscription revenue desired

**Reasoning Template:**
```
"Your membership model requires secure access control, tier management, and integration with payment processing for recurring billing. Portal provides member dashboard, content gating, and automated access management. [IF member count projection: Scaling to [X] members with automated management]."
```

---

### Live Chat - $500

**Context Requirements:**
- Customer service is priority
- Real-time communication valuable
- Conversion optimization goal

**Priority Logic:**

**Essential IF:**
- High-value transactions requiring consultation
- Complex products needing guidance
- Customer mentioned wanting live support

**Highly Recommended IF:**
- Conversion optimization is goal
- Customer service differentiator
- Support team available for chat
- E-commerce with consultation needs

**Reasoning Template:**
```
"Live chat increases conversion rates by 15-45% by answering questions at decision moment. [IF e-commerce: For your transaction value, this represents significant revenue impact]. Includes offline message collection for 24/7 inquiry capture."
```

---

### Newsletter System - $350

**Context Requirements:**
- Email list building goal
- Regular communication planned
- Audience engagement strategy

**Priority Logic:**

**Essential IF:**
- Content publisher model
- Audience building is primary goal
- Email list is core asset

**Highly Recommended IF:**
- Regular updates/announcements
- Customer retention through communication
- Content distribution strategy
- Lead nurturing process

**Reasoning Template:**
```
"Professional newsletter system with signup forms, template management, list segmentation, and analytics. Supports [described communication strategy]. [IF list size goal provided: Designed to scale with [X] subscriber growth]."
```

---

### Inventory Management - $900

**Context Requirements:**
- Product-based business
- Inventory tracking needed
- Stock management is pain point

**Priority Logic:**

**Essential IF:**
- E-commerce with >50 products
- Stock-outs are current problem
- Multiple locations/channels
- Wholesale/bulk operations

**Highly Recommended IF:**
- 25-50 products
- Growth to multiple channels planned
- Manual tracking is time-consuming
- Stock accuracy is important

**Reasoning Template:**
```
"Your [product count] product catalog requires real-time inventory tracking across [sales channels]. System prevents overselling, automates reorder alerts, and provides inventory reporting. [IF stock-out data: Eliminates lost sales from stock-outs, typically $[estimated] annually]."
```

---

## Part 5: Compliance-Driven Feature Recommendations

**NEW SECTION: When intelligence includes compliance requirements, certain features become essential or highly recommended.**

### HIPAA Compliance Requirements

**When Detected:**
- User mentions healthcare, medical, patient data
- Explicitly states HIPAA compliance needed
- Describes protected health information (PHI)

**Essential Features:**
- **Security Audit Package** - $600
  - *Reasoning:* "HIPAA compliance requires documented security measures, encrypted data transmission, and access logging. This package ensures your website meets federal requirements for protected health information."

- **Secure Forms with Encryption** - $400
  - *Reasoning:* "Patient information submitted through your website must be encrypted and secured. HIPAA-compliant form handling protects both your practice and patient privacy."

**Highly Recommended:**
- **SSL Certificate** (included in packages, but emphasize)
- **User Authentication** - $600
  - *Reasoning:* "HIPAA requires secure access control for any patient data access. Authentication system provides compliant user management and audit trails."

### PCI-DSS Compliance (Payment Card Industry)

**When Detected:**
- E-commerce selected
- Payment processing needed
- Credit card acceptance mentioned

**Essential Features:**
- **Payment Processing Integration** - $500
  - *Reasoning:* "PCI compliance is mandatory for accepting credit cards. Stripe integration handles all PCI requirements, protecting your business from security risks and liability."

**Note:** Stripe handles PCI compliance, so additional security features not required unless storing payment data (which we don't recommend).

### GDPR Compliance (EU Data Protection)

**When Detected:**
- European customers mentioned
- International audience
- Explicitly states GDPR compliance needed

**Highly Recommended Features:**
- **Cookie Consent System** - $200
  - *Reasoning:* "GDPR requires explicit consent for cookies and tracking. Compliant consent management protects you from fines up to 4% of global revenue."

- **Privacy Tools Package** - $300
  - *Reasoning:* "GDPR grants users right to access, modify, and delete their data. Privacy tools provide compliant data management and request handling."

### ADA/WCAG Accessibility Compliance

**When Detected:**
- Government contract mentioned
- Educational institution
- Explicitly states accessibility requirements
- Legal/compliance concerns mentioned

**Essential Features:**
- **WCAG 2.1 AA Compliance Package** - $800
  - *Reasoning:* "ADA compliance is legally required for [government/education/public accommodation]. WCAG 2.1 AA certification protects against discrimination lawsuits and ensures inclusive access."

**Highly Recommended:**
- **Accessibility Audit & Remediation** - $500
  - *Reasoning:* "Annual accessibility audits maintain compliance and identify issues before they become legal liabilities."

---

## Part 6: Package Selection Logic

### Decision Tree

```typescript
// Custom Package IF:
if (
  productsToSell > 50 ||
  needsCustomDevelopment ||
  apiIntegrations > 2 ||
  hasComplianceRequirements.length > 0 ||
  customFunctionality ||
  membershipPortal
) return 'custom'

// Professional Package IF:
if (
  pages > 5 || 
  needsCMS ||
  needsBlog ||
  updateFrequency === 'regular' ||
  multipleFeatures > 3
) return 'professional'

// Default: Starter
return 'starter'
```

### Package Inclusions

**Starter ($2,500):**
- Up to 5 pages
- Responsive design, SSL
- Basic SEO, contact form
- 30 days support

**Professional ($4,500):** ⭐ Most Popular
- Everything in Starter +
- Up to 8 pages
- CMS, Blog, Advanced SEO
- Social/Email integration
- 90 days support

**Custom ($6,000+):**
- Everything in Professional +
- Unlimited pages
- Custom development
- API development
- Compliance packages
- 6 months support

---

## Part 7: Feature Conflict & Dependency Management

### Feature Conflicts (Choose One)

**Redundant Pairs:**
1. **Booking System ↔ Appointment Scheduling**
   - Choose based on business model:
   - *Booking System:* Reservations, rentals, events (restaurants, hotels, equipment)
   - *Appointment Scheduling:* Time-based services (consultants, salons, healthcare)
   - **Never recommend both**

2. **E-commerce Basic ↔ E-commerce Advanced**
   - Choose based on product count and complexity:
   - *Basic:* <50 products, straightforward catalog
   - *Advanced:* >50 products, complex variants, wholesale
   - **Upgrade to Advanced, don't include both**

3. **Customer Portal ↔ Membership Portal**
   - Choose based on access model:
   - *Customer Portal:* Order history, account management
   - *Membership Portal:* Tiered access, subscriptions, gated content
   - **Membership Portal supersedes Customer Portal**

### Complementary Features (Recommend Together)

**Strong Synergies:**
1. **Appointment/Booking + SMS Notifications**
   - Reason: SMS dramatically improves no-show rates for scheduled events
   - Discount consideration: Could offer bundle at $1,050 (vs $1,100)

2. **E-commerce + Email Marketing**
   - Reason: Email drives 25-30% of e-commerce revenue
   - Essential pairing for online retail success

3. **Blog System + Newsletter System**
   - Reason: Content distribution requires both publishing and distribution
   - Natural content marketing stack

4. **Membership Portal + Email Marketing**
   - Reason: Member communication and retention requires systematic email
   - Essential for community engagement

### Required Dependencies (Auto-Include)

**Automatic Additions:**
1. **E-commerce → requires Payment Processing**
   - Don't present as separate choice
   - Include in e-commerce pricing explanation
   - "E-commerce includes secure Stripe payment processing"

2. **Membership Portal → requires Payment Processing**
   - Same as e-commerce
   - "Membership includes recurring payment management"

3. **E-commerce Advanced → highly recommend Inventory Management**
   - Present as highly recommended, not automatic
   - ">50 products benefit significantly from inventory automation"

---

## Part 8: Presentation Strategy

### Priority Ordering Within Modal

**Display Order:**
1. **Package Selection** (at top, radio cards)
   - Starter | Professional | Custom
   - Show what's included in each

2. **Essential Features** (expanded by default)
   - Order by revenue impact (highest first)
   - Maximum 3 features in Essential tier
   - Red "Essential" badge

3. **Highly Recommended** (expanded by default)
   - Order by ROI payback speed (fastest first)
   - Maximum 5 features
   - Amber "Highly Recommended" badge

4. **Nice to Have** (collapsed by default, "Show More")
   - Order by price (lowest first)
   - Maximum 5 features
   - Gray "Optional" badge

### Recommendation Count Limits

**Strict Limits to Prevent Decision Paralysis:**
- Essential: Max 3 features (typically 1-2)
- Highly Recommended: Max 5 features (typically 3-4)
- Nice to Have: Max 5 features (collapsed)
- **Total: Maximum 13 features across all tiers**

**If more than 13 features qualify:**
1. Prioritize features most specific to their stated needs
2. Combine similar features (e.g., offer "Advanced package" instead of listing individual components)
3. Choose highest-value features using ROI/impact

### Real-Time Price Calculation

**Sticky Footer Shows:**
```
Package: $4,500
Features: $2,100
────────────────
Total: $6,600

Hosting: $150/month

[Continue with These Features]
```

**Updates Instantly:** Price recalculates as user selects/deselects features

---

## Part 9: Confidence Thresholds & Quality Gates

### Before Presenting Features - Quality Checklist

**Intelligence Completeness:**
- ✓ Business model classified (>75% confidence)
- ✓ Primary goal articulated clearly
- ✓ Target audience described with specifics
- ✓ Core functionality needs identified
- ✓ Business context category ≥80% complete
- ✓ Technical context category ≥60% complete

**Pattern Match Strength:**
- ✓ Can identify at least 3 relevant features with high confidence
- ✓ Can articulate specific reasoning for each recommendation
- ✓ No major contradictions in gathered intelligence
- ✓ Business model classification is clear (not ambiguous)

**If Confidence <75%:**
- Do NOT present features yet
- Ask 2-3 more clarifying questions
- Focus on missing context areas
- Re-evaluate after additional intelligence gathered

### Post-Selection Validation

**After User Selects Features:**
1. Check for unresolved conflicts (booking + appointment both selected)
2. Verify dependencies included (e-commerce without payment processing)
3. Confirm budget alignment (selected features within stated budget range)
4. Flag for human review if:
   - Total project value >$10,000
   - Compliance requirements present
   - Custom features selected
   - Budget/feature mismatch detected

---

## Part 10: Example Scenario (Complete Walkthrough)

### Local Salon - "Luxe Hair Studio"

**Intelligence Gathered (Questions 1-10):**
```
Business Model: Service (appointment-based)
Business: Luxe Hair Studio (salon)
Industry: Personal care services
Primary Goal: Reduce phone interruptions, increase bookings
Target Audience: Busy professionals, ages 25-45, urban location
Core Operations: Hair styling, coloring, treatments
Volume: 50 appointments/week across 3 stylists
Current No-Show Rate: 18% (user mentioned this is a problem)
Pain Points: 
  - "We spend so much time on the phone scheduling"
  - "No-shows are killing our revenue"
  - "Clients can't book after hours"
Current Tools: Paper appointment book
Budget Range: Professional package ($4,000-$5,000)
Timeline: Launch in 6 weeks
Content: Professional photos being taken next week
```

**Feature Recommendations:**

#### **ESSENTIAL**

**1. Appointment Scheduling System - $800**

*Priority Reasoning:* Core business model is appointment-based with high volume (50/week). Primary pain point is phone scheduling consuming staff time. Current 18% no-show rate indicates urgent need for automated reminders.

*Recommendation:*
"With 50 weekly appointments across 3 stylists, phone scheduling consumes approximately 12 hours of staff time weekly. This appointment system eliminates scheduling phone tag through 24/7 online booking with real-time stylist availability. Clients select their preferred stylist and available time slot directly. Automated reminders reduce your no-show rate from 18% to ~5%, recovering approximately $23,400 annually in lost appointments. System integrates with staff calendars to prevent double-bookings."

*ROI:* "Recovers ~12 hours weekly in staff time (worth ~$15,600/year at $25/hour) plus $23,400 in reduced no-shows = $39,000 total annual value. Payback in less than 1 week."

---

**2. SMS Notifications - $300**

*Priority Reasoning:* Appointment-based business with high no-show rate. SMS works in tandem with scheduling system for maximum no-show reduction. User explicitly mentioned no-shows as problem.

*Recommendation:*
"SMS reminders have 98% open rate versus email's 20%, ensuring clients actually see appointment reminders. Works with your scheduling system to send automated 24-hour and 2-hour reminders. Further reduces no-shows from 5% to ~3%, adding $5,200 in additional recovered revenue. No staff time required - fully automated."

*ROI:* "Additional $5,200 in recovered appointments annually, minus ~$195 in SMS costs = $5,000 net annual value. Payback in under 3 weeks."

---

#### **HIGHLY RECOMMENDED**

**3. Email Marketing Integration - $400**

*Priority Reasoning:* 50 weekly clients = 200+ potential email subscribers monthly. Service business benefits from stay-top-of-mind communication for rebooking. Typical 6-8 week rebooking cycle benefits from email reminders.

*Recommendation:*
"Your 50 weekly clients represent 200+ contacts monthly. Email marketing increases rebooking rates by 20-25% through automated 6-week 'time for your next appointment' campaigns. Also enables promotional campaigns for new services and seasonal specials. Industry data shows salons generate 15-20% of revenue from email marketing. For your volume, this represents approximately $21,000 in additional annual revenue."

*ROI:* "Estimated $21,000 additional revenue from improved rebooking rates and promotional campaigns. Payback in under 1 week."

---

**4. Online Payment Processing - $500**

*Priority Reasoning:* Enables deposit collection for appointments, reducing no-shows further. Allows prepayment for services. Required for any online transactions.

*Recommendation:*
"Accept deposits at booking time to further reduce no-shows - clients who prepay $25 deposit show up 95%+ of the time. Also enables gift certificate sales online and prepayment for services. Secure Stripe integration accepts all major cards and Apple Pay. Deposits automatically applied to final bill."

*ROI:* "Deposit requirement can virtually eliminate remaining no-shows (additional $3,000-$5,000 protected revenue). Gift certificate sales generate additional revenue, especially during holidays."

---

#### **NICE TO HAVE** (Collapsed)

**5. Customer Portal - $1,200**

*Recommendation:*
"Clients can view appointment history, rebook previous services, update contact information, and view their styling notes (previous colors, preferences). Enhances customer experience and reduces front-desk administrative work."

---

**6. Social Media Integration - $250**

*Recommendation:*
"Instagram is powerful for salons. Integration displays your Instagram feed on website, includes social sharing for referrals, and enables Facebook booking button. Helps convert social media followers to booked appointments."

---

### **PACKAGE & PRICING SUMMARY**

**Recommended Package: Professional ($4,500)**
*Rationale:* Your business needs CMS for managing stylist bios and service descriptions, blog for hair care tips (SEO benefit), and capacity for 8 pages (Home, About, Services, Stylists, Booking, Contact, Blog, Gallery).

**Selected Features:**
- Essential: Appointment Scheduling ($800) + SMS Notifications ($300)
- Highly Recommended: Email Marketing ($400) + Payment Processing ($500)

**Total Project Investment:** $6,500
**Monthly Hosting:** $150 (Standard plan for booking system)

**Annual ROI:** ~$68,000 in recovered time and increased revenue
**Payback Period:** 6 weeks

**Timeline:** 6 weeks from kickoff (aligns with your goal)

---

## Conclusion

This document provides Claude with comprehensive, systematic rules for generating personalized, high-quality feature recommendations. By following these frameworks, Claude consistently delivers:

1. **Context-Aware Recommendations** - Features match actual business needs
2. **Personalized Reasoning** - Specific to this client's situation
3. **Appropriate Quantification** - Numbers when available, qualitative when not
4. **Clear Priority Classification** - Essential vs nice-to-have based on intelligence
5. **Conflict-Free Selection** - No redundant or contradictory features

**Key Success Factors:**

- Gather sufficient intelligence (10-12 questions minimum)
- Use business-specific language and industry context
- Quantify benefits when user provided specific metrics
- Keep feature count reasonable (3-13 total recommendations)
- Classify priority rigorously based on gathered intelligence
- Validate against quality checklist before presentation
- Respect question efficiency constraints (20-25 total target)

**Remember:** Feature recommendations transform a generic product catalog into a personalized business solution. The quality of recommendations directly correlates with completion rates and customer satisfaction. This is intelligent orchestration at its finest.

---

**Document Version:** 1.1  
**Date:** November 6, 2025  
**Author:** David Moore (Applicreations)  
**Status:** Production Ready  
**Changes in v1.1:**
- Aligned feature timing with Architecture (10-12 questions, not 8)
- Simplified ROI approach (qualitative + quantification when data available)
- Added question efficiency context
- Added compliance-driven recommendations section
- Added business model classification requirement
- Enhanced conflict detection specificity
- Updated all ROI guidance templates for new approach
