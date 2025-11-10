# Phase 3 Claude Integration: Complete Implementation Guide & Guard Rails V3.2

## READ THIS FIRST: What We're Building

Before diving into technical implementation, you must understand the complete picture of what this system does and how it should behave.

---

## PART 1: THE END RESULT - EXPECTED BEHAVIOR

### The User Experience (What Success Looks Like)

When a user completes an Introspect V3 intake session, this is what happens:

1. **Foundation Questions (Questions 1-6)**
   - User provides: name, email, phone, website type, company/project name, industry
   - Questions appear one at a time in a clean, focused interface
   - **CRITICAL UPDATE**: Website type and industry are presented as selectable options with "Something else" fallback
   - Each question feels conversational and natural
   - No sense of "filling out a form"

2. **Intelligent Orchestration Begins (Question 7+)**
   - **CRITICAL**: The user NEVER knows this transition happened
   - Questions continue to appear one at a time, exactly like before
   - **STANDARD BEHAVIOR**: Questions present multiple choice options (3-6 choices + "Something else")
   - The UI doesn't change. The flow doesn't change. The experience doesn't change.
   - Questions now come from Claude's orchestration engine based on accumulated context
   - Claude asks strategic questions to gather complete technical requirements
   - **NEW**: Claude evaluates information sufficiency before drilling deeper
   - **NEW**: Question count adapts to project complexity
   - Questions reference previous answers naturally: "You mentioned you're building a portfolio—what type of work will you showcase?"

3. **Feature Selection Interface (Questions 10-12)**
   - **CRITICAL: This is a SELF-CONTAINED FEATURE SELECTION SCREEN**
   - **NOT a text question - this is a VISUAL CHIP INTERFACE**
   - Based on website type and needs, Claude presents comprehensive feature list
   - Features displayed as clickable chips with:
     - Feature name
     - Short description (1-2 lines)
     - Price indicator (included in tier vs add-on cost)
   - User can select multiple features by clicking chips
   - Chips have visual states: unselected, selected, hover
   - Features are organized by category (Core, E-commerce, Marketing, etc.)
   - **NO text input on this screen - only chip selection**
   - **NO "Something else" option for features - comprehensive list provided**
   - **NO follow-up questions about features after selection**
   - Submit button becomes active after at least one selection
   - Once submitted, move to next topic - features are DONE

4. **Completion (Dynamic based on complexity)**
   - Claude determines when it has gathered sufficient information for SCOPE.md generation
   - **NEW**: Total question count varies based on project complexity (15-50+ questions)
   - **NEW**: Simple projects may complete faster, complex projects take longer
   - No explicit "You're done!" message—just a smooth transition to completion screen
   - User sees a summary of what they've shared
   - System generates two documents automatically:
     - **SCOPE.md**: Complete technical specification for Cursor AI development
     - **Client PDF**: Human-readable project summary

### What This Is NOT

- ❌ NOT a chatbot where users type free-form questions
- ❌ NOT a multi-turn conversation where Claude responds to user questions
- ❌ NOT a form with dropdown menus and checkboxes
- ❌ NOT an interview where the user knows they're talking to AI
- ❌ NOT a system where users can go "off script" or ask Claude things
- ❌ NOT a wizard with explicit "Step 1 of 5" navigation
- ❌ NOT primarily text input based - multiple choice is the standard
- ❌ NOT limited by arbitrary question counts - adapts to complexity

### What This IS

- ✅ A **single-track orchestration system** where Claude generates strategic questions with options
- ✅ A **requirements gathering engine** disguised as a natural conversation
- ✅ A **multiple-choice driven flow** where users select from curated options
- ✅ An **invisible intelligence layer** that users never see or know about
- ✅ A **conversion-optimized intake** that feels like consulting with a solutions architect
- ✅ A **deterministic state machine** where every answer advances progress toward completion
- ✅ A **selection-based interface** where text input is the exception, not the rule
- ✅ An **adaptive system** that adjusts questions based on website type AND complexity
- ✅ A **sufficiency-aware orchestrator** that knows when to drill deeper vs. move on
- ✅ A **SCOPE.md-driven system** where every question serves document generation

---

## PART 2: SCOPE.MD STRUCTURE - THE MASTER REQUIREMENTS

### Critical Understanding: SCOPE.md is the North Star

**Every question Claude asks must serve SCOPE.md generation.** This is the complete structure that Claude must populate:

### The 14 Required SCOPE.md Sections

#### 1. Executive Summary
**Purpose:** 2-3 sentence high-level project overview that captures entire project
**Required Information:**
- Project name and website type
- Primary business goal
- Target audience
- Key differentiator
**Sufficiency Criteria:** Can write compelling summary that answers "What is this project?"

#### 2. Project Classification
**Purpose:** Categorize project for internal processing and package determination
**Required Information:**
- Website type (portfolio, e-commerce, blog, service, corporate, etc.)
- Industry/sector
- Business model (if applicable - B2B/B2C, transaction model, etc.)
- Project complexity tier (simple, standard, complex)
- Recommended package (Starter $2,500 | Professional $4,500 | Custom $6,000+)
**Sufficiency Criteria:** Clear classification that drives pricing and feature recommendations

#### 3. Client Information
**Purpose:** Contact details and decision-maker identification
**Required Information:**
- Full name
- Email address
- Phone number
- Company/project name
- Decision-maker role (if applicable)
**Sufficiency Criteria:** Complete contact information for project communication

#### 4. Business Context
**Purpose:** Understanding of business model, audience, and goals
**Required Information:**
- Company/project overview (2-3 sentences)
- Target audience (who they are, technical level, primary needs)
- Primary business goal
- Success metrics (2-3 measurable criteria)
- Key value proposition
- Main pain points the website solves
**Sufficiency Criteria:** Can explain the business in detail to a developer who's never heard of it

#### 5. Brand Assets & Identity
**Purpose:** What design assets exist vs. need creation
**Required Information:**
- Existing brand assets (logo, colors, fonts, style guide)
- Brand style direction (modern, traditional, minimal, bold, etc.)
- What needs to be created vs. provided by client
- 1-3 inspiration/reference websites (optional)
**Sufficiency Criteria:** Designer knows what assets to use and what direction to take

#### 6. Content Strategy
**Purpose:** Who provides content and maintenance plan
**Required Information:**
- Content provider (client provides, Applicreations creates, mixed)
- Content readiness (ready now, needs creation, in progress)
- Update frequency (daily, weekly, monthly, rarely)
- Who will maintain content post-launch
- Content types needed (text, images, video, etc.)
**Sufficiency Criteria:** Clear understanding of content workflow and timeline implications

#### 7. Technical Specifications
**Purpose:** Complete feature list and technical requirements
**Required Information:**
- User authentication system (if needed): type and method
- Content management requirements (CMS needed, self-managed, etc.)
- Search/filtering functionality
- Website-type-specific requirements:
  - **Portfolio:** Project organization, case study format, gallery system
  - **E-commerce:** Product catalog size, variants, inventory, checkout, payment processing
  - **Blog:** Category system, comments, subscriptions, RSS
  - **Service:** Booking system, quote requests, service areas
  - **Corporate:** Investor relations, careers, news/press, team directory
- Integration requirements (email service, analytics, CRM, payment processors, etc.)
- Compliance requirements (HIPAA, PCI-DSS, GDPR, ADA/WCAG)
- Security requirements
- Performance requirements (expected traffic, critical performance needs)
**Sufficiency Criteria:** Developer can build entire technical architecture without clarification

#### 8. Media & Interactive Elements
**Purpose:** Rich media and interaction requirements
**Required Information:**
- Video requirements (host, autoplay, background video, etc.)
- Image galleries/sliders
- Animation requirements
- Interactive elements (calculators, configurators, etc.)
- Audio/podcast players
- Map integrations
**Sufficiency Criteria:** Developer knows all rich media components to implement

#### 9. Design Direction
**Purpose:** Visual design preferences and requirements
**Required Information:**
- Overall design style (modern, traditional, minimal, bold, etc.)
- Color scheme direction (if known)
- Typography preferences (if known)
- Layout preferences (grid, single-column, asymmetric, etc.)
- Reference websites with specific elements noted
**Sufficiency Criteria:** Designer can create mockups that align with client's vision

#### 10. Features & Functionality Breakdown
**Purpose:** Complete feature list with pricing and rationale
**Required Information:**
- Base package selected (Starter/Professional/Custom)
- All add-on features selected from Feature Library
- Feature bundle discounts applied
- Feature conflicts identified and resolved
- Feature dependencies documented
- Rationale for each major feature selection
**Sufficiency Criteria:** Complete feature manifest with accurate pricing and no conflicts

#### 11. Post-Launch Support Plan
**Purpose:** Maintenance, training, and future phase planning
**Required Information:**
- Support duration included in package
- Training requirements (admin training, content management, etc.)
- Maintenance plan (who handles updates, security, backups)
- Future enhancement phases (if discussed)
- Hosting tier (Starter $75/mo | Professional $150/mo | Custom $300/mo)
**Sufficiency Criteria:** Clear support and maintenance plan post-launch

#### 12. Project Timeline
**Purpose:** Development milestones with specific dates
**Required Information:**
- Desired launch date/timeline
- Content delivery milestone
- Design approval milestone
- Development milestone
- Testing/QA milestone
- Launch milestone
- Dependencies and blockers
**Sufficiency Criteria:** Realistic timeline with clear milestones and client responsibilities

#### 13. Investment Summary
**Purpose:** Complete pricing breakdown with ROI when calculable
**Required Information:**
- Base package price
- Add-on features with individual prices
- Bundle discounts applied
- Subtotal
- Hosting (monthly recurring)
- Total project investment
- ROI calculation (if metrics available)
- Payback period (if calculable)
- Payment schedule
**Sufficiency Criteria:** Transparent, accurate pricing that matches package and features

#### 14. Validation Outcomes
**Purpose:** Document understanding confirmations and conflict resolutions
**Required Information:**
- Validation loop responses (if any)
- Feature conflicts identified and how resolved
- Assumption clarifications
- Client confirmation of key decisions
**Sufficiency Criteria:** All validation interactions documented for reference

---

## PART 3: INFORMATION-TO-SCOPE MAPPING

### How Gathered Information Maps to SCOPE.md Sections

This is the explicit mapping that Claude must reference when evaluating sufficiency:

#### Foundation Questions (1-6) → SCOPE.md Mapping
```
Question 1: Name → Section 3 (Client Information)
Question 2: Email → Section 3 (Client Information)
Question 3: Phone → Section 3 (Client Information)
Question 4: Website Type → Section 2 (Project Classification)
Question 5: Company/Project Name → Section 3 (Client Information)
Question 6: Industry → Section 2 (Project Classification)
```

#### Business Context Questions → SCOPE.md Mapping
```
Target Audience → Section 4 (Business Context)
Primary Goal → Section 4 (Business Context)
Success Metrics → Section 4 (Business Context)
Problem Being Solved → Section 4 (Business Context)
Value Proposition → Section 4 (Business Context)
Business Model → Section 2 (Project Classification) + Section 4 (Business Context)
```

#### Core Functionality Questions → SCOPE.md Mapping
```
User Accounts → Section 7 (Technical Specifications)
Content Management → Section 7 (Technical Specifications) + Section 6 (Content Strategy)
Search/Filtering → Section 7 (Technical Specifications)
Website-Type-Specific Features → Section 7 (Technical Specifications)
Performance Requirements → Section 7 (Technical Specifications)
```

#### Feature Selection → SCOPE.md Mapping
```
All Selected Features → Section 10 (Features & Functionality Breakdown)
Feature Conflicts → Section 14 (Validation Outcomes)
Feature Bundles → Section 13 (Investment Summary)
```

#### Design & Branding Questions → SCOPE.md Mapping
```
Design Style → Section 5 (Brand Assets) + Section 9 (Design Direction)
Existing Assets → Section 5 (Brand Assets)
Inspiration Examples → Section 9 (Design Direction)
```

#### Integration Questions → SCOPE.md Mapping
```
Email Service → Section 7 (Technical Specifications)
Payment Processing → Section 7 (Technical Specifications)
Analytics → Section 7 (Technical Specifications)
CRM/Other Integrations → Section 7 (Technical Specifications)
Compliance Requirements → Section 7 (Technical Specifications)
```

#### Technical Requirements Questions → SCOPE.md Mapping
```
Expected Traffic → Section 7 (Technical Specifications)
Performance Needs → Section 7 (Technical Specifications)
Security Requirements → Section 7 (Technical Specifications)
Special Technical Needs → Section 7 (Technical Specifications)
```

#### Timeline & Budget Questions → SCOPE.md Mapping
```
Timeline → Section 12 (Project Timeline)
Budget → Section 2 (Project Classification) + Section 13 (Investment Summary)
Priorities → Section 12 (Project Timeline)
```

#### Content & Media Questions → SCOPE.md Mapping
```
Content Provider → Section 6 (Content Strategy)
Content Readiness → Section 6 (Content Strategy)
Update Frequency → Section 6 (Content Strategy)
Video Requirements → Section 8 (Media & Interactive Elements)
Image Requirements → Section 8 (Media & Interactive Elements)
Interactive Elements → Section 8 (Media & Interactive Elements)
```

#### Support & Maintenance Questions → SCOPE.md Mapping
```
Training Needs → Section 11 (Post-Launch Support Plan)
Maintenance Plan → Section 11 (Post-Launch Support Plan)
Future Phases → Section 11 (Post-Launch Support Plan)
Hosting Tier → Section 11 (Post-Launch Support Plan)
```

---

## PART 4: CLAUDE'S ROLE - SCOPE.MD-DRIVEN ORCHESTRATOR

### CRITICAL UNDERSTANDING: Every Question Must Serve SCOPE.md

**Claude's primary jobs are:**
1. Receive complete conversation history and current intelligence
2. **IDENTIFY which SCOPE.md section needs information**
3. **EVALUATE: Does current information satisfy that section's requirements?**
4. **IF SUFFICIENT**: Move to next section
5. **IF INSUFFICIENT**: Generate the single best next question WITH 3-6 SMART OPTIONS
6. Always includes "Something else" as the final option (EXCEPT for feature selection)
7. Returns the question and options in a structured format
8. Updates intelligence based on the answer received
9. **Tracks depth within sections to prevent excessive drilling**

### The SCOPE.md-Driven Sufficiency Framework

Before asking any question, Claude must evaluate using SCOPE.md as reference:

```
SCOPE.MD-DRIVEN SUFFICIENCY CHECK:

1. IDENTIFY CURRENT SCOPE.MD SECTION
   "What SCOPE.md section am I currently gathering information for?"
   
   Examples:
   - Section 4: Business Context
   - Section 7: Technical Specifications (user accounts)
   - Section 10: Features & Functionality Breakdown

2. REVIEW SECTION REQUIREMENTS
   "What does THIS SPECIFIC SCOPE.md section require?"
   
   Example for Section 4 (Business Context):
   - Company/project overview (2-3 sentences)
   - Target audience (who, technical level, needs)
   - Primary business goal
   - Success metrics (2-3 measurable)
   - Key value proposition
   - Main pain points solved

3. COMPARE GATHERED vs. REQUIRED
   "Do I have enough information to WRITE THIS SECTION of SCOPE.md?"
   
   List what you HAVE:
   - [Data point 1 that satisfies requirement X]
   - [Data point 2 that satisfies requirement Y]
   
   List what you NEED:
   - [Missing requirement Z]

4. EVALUATE IMPLEMENTATION IMPACT
   "Would additional detail change how THIS GETS BUILT?"
   
   YES → Ask follow-up question (max 3 per sub-topic)
   NO → Move to next section/sub-topic

5. CHECK DEPTH LIMIT
   "How many questions have I asked for THIS SCOPE.md section?"
   
   Rules:
   - <3 questions in sub-topic → Can continue if needed
   - ≥3 questions in sub-topic → Move on unless critical gap exists

6. MAKE DECISION
   
   IF all section requirements met:
   → Action: "validate_understanding" or move to next section
   
   IF missing information that affects SCOPE.md completeness:
   → Action: "ask_question" with smart options
   
   IF at depth limit BUT critical SCOPE.md gap:
   → Action: "ask_question" (ONE more question max)
   
   IF at depth limit AND section is complete:
   → Action: Move to next SCOPE.md section
```

### Example: SCOPE.md-Driven Sufficiency Evaluation

**SCENARIO: Section 4 - Business Context (Target Audience)**

```
User answers: "Small business owners"

SCOPE.MD SECTION 4 REQUIREMENTS:
- ✓ Company overview
- ? Target audience (who, technical level, needs) ← INCOMPLETE
- ✓ Primary goal
- ? Success metrics ← INCOMPLETE
- ✓ Value proposition

SUFFICIENCY EVALUATION:
❓ Can I write Section 4 (Business Context) - Target Audience subsection?

Current information: "Target audience is small business owners"

Section 4 requires for target audience:
- WHO they are: "Small business owners" ← TOO VAGUE
- Technical level: ← MISSING
- Primary needs: ← MISSING

IMPLEMENTATION IMPACT:
- Affects UI complexity decisions
- Affects feature recommendations
- Affects messaging strategy

DEPTH CHECK: 1 question in this sub-topic

DECISION: ✅ INSUFFICIENT - Ask follow-up

Next question: "What type of small businesses?"
Options: [Service-based, Product-based, E-commerce, Professional services, Something else]
```

**After Follow-up:**

```
User answers: "Professional services like lawyers and accountants"

SCOPE.MD SECTION 4 REQUIREMENTS CHECK:
Target audience subsection now has:
- WHO: Small business owners, professional services (lawyers/accountants) ← SPECIFIC
- Technical level: Professional but not tech-savvy (inferred) ← REASONABLE INFERENCE
- Primary needs: Credibility, compliance, professionalism (inferred) ← REASONABLE INFERENCE
- B2B context (inferred)

SUFFICIENCY EVALUATION:
❓ Can I write complete target audience subsection for Section 4?

YES - I can write:
"Target audience consists of small business owners operating in professional services, specifically legal practices and accounting firms. These are B2B-focused professionals who value credibility and compliance but typically have limited technical expertise. They require professional, trustworthy web presence that meets industry standards."

IMPLEMENTATION IMPACT of asking more:
- ❌ Specific practice areas (tax vs corporate law) → Doesn't change features or architecture
- ❌ Firm size distribution → Doesn't affect implementation
- ❌ Geographic distribution → Not relevant to build

DEPTH CHECK: 2 questions in this sub-topic

DECISION: ✅ SUFFICIENT - Move to next requirement

Move to: Success metrics (still in Section 4)
```

### The Single-Track Flow with SCOPE.md Reference

```
Claude identifies current SCOPE.md section
  ↓
Claude evaluates section requirements
  ↓
IF SECTION COMPLETE → Move to next section
  ↓
IF SECTION INCOMPLETE → Generate question with options 
  ↓
User selects option (or "Something else" + types)
  ↓
Answer stored & intelligence updated
  ↓
Claude evaluates SCOPE.md section again [REPEAT]
```

---

## PART 5: SYSTEM PROMPT UPDATE - SCOPE.MD-DRIVEN ORCHESTRATION

### Updated Claude System Prompt (V3.2 - SCOPE.md Integration)

```typescript
const CLAUDE_SYSTEM_PROMPT_V3_2 = `
You are the orchestration engine for Introspect V3, an intelligent client intake system for Applicreations, a web development company.

YOUR ROLE:
You are NOT a chatbot. You do NOT have conversations with users. You do NOT answer user questions.

Your PRIMARY jobs are:
1. Analyze the complete conversation history including website type
2. **IDENTIFY which SCOPE.md section needs information**
3. **EVALUATE if you have sufficient information to WRITE that SCOPE.md section**
4. Identify what information is still needed (if insufficient)
5. Generate the single best NEXT question with SMART OPTIONS
6. Extract intelligence from the user's last answer
7. Update progress tracking

---

## CRITICAL: SCOPE.MD-DRIVEN SUFFICIENCY EVALUATION

**YOU MUST REFERENCE SCOPE.MD STRUCTURE FOR EVERY DECISION**

The end goal is generating a complete SCOPE.md document with 14 required sections. Every question you ask must serve completing these sections.

### THE 14 SCOPE.MD SECTIONS YOU MUST COMPLETE:

1. **Executive Summary** - 2-3 sentence project overview
2. **Project Classification** - Website type, industry, business model, complexity, package
3. **Client Information** - Contact details
4. **Business Context** - Company overview, audience, goals, metrics, value prop, pain points
5. **Brand Assets & Identity** - Existing assets vs. needs creation, style direction
6. **Content Strategy** - Provider, readiness, update frequency, maintenance plan
7. **Technical Specifications** - Features, auth, CMS, integrations, compliance, security, performance
8. **Media & Interactive Elements** - Video, galleries, animations, interactive components
9. **Design Direction** - Style, colors, typography, layout, references
10. **Features & Functionality Breakdown** - Package, add-ons, pricing, conflicts, rationale
11. **Post-Launch Support Plan** - Support duration, training, maintenance, hosting
12. **Project Timeline** - Milestones, dependencies, launch date
13. **Investment Summary** - Pricing breakdown, ROI, payment schedule
14. **Validation Outcomes** - Understanding confirmations, conflict resolutions

### SCOPE.MD SUFFICIENCY CHECK PROCESS:

**BEFORE ASKING ANY QUESTION:**

1. **IDENTIFY CURRENT SCOPE.MD SECTION**
   "What SCOPE.md section am I gathering information for?"
   
   Example: "Section 7: Technical Specifications - User Authentication"

2. **REVIEW SECTION REQUIREMENTS**
   "What does THIS section of SCOPE.md require?"
   
   Reference the specific requirements for that section (see section requirements above).

3. **COMPARE GATHERED vs REQUIRED**
   "Do I have enough information to WRITE THIS SECTION?"
   
   Example for Section 7 (Technical Specifications) - User Auth:
   REQUIRED:
   - Whether user accounts needed: ✓ or ?
   - If yes, authentication method: ✓ or ?
   - If yes, user roles/permissions: ✓ or ?
   
   List each requirement as satisfied (✓) or missing (?)

4. **IMPLEMENTATION IMPACT TEST**
   "Would additional detail change HOW this section gets implemented?"
   
   Examples:
   - ✅ Knowing if email OR social auth → Changes implementation (ASK)
   - ❌ Knowing specific OAuth providers → Implementation detail (SKIP)
   - ✅ Knowing if multi-role permissions → Changes data model (ASK)
   - ❌ Knowing exact role names → Design decision (SKIP)

5. **CHECK DEPTH LIMIT**
   "How many questions have I asked for THIS SCOPE.md section/sub-topic?"
   
   Rules:
   - 0-2 questions in sub-topic: Can continue if information needed for SCOPE.md
   - 3+ questions in sub-topic: Move to next section UNLESS critical gap exists
   
   Critical gaps = Missing information that prevents writing SCOPE.md section

6. **MAKE DECISION**
   
   IF section requirements all met (all ✓):
   → Action: "validate_understanding" or move to next section
   
   IF missing requirements for SCOPE.md (any ?):
   → Action: "ask_question" with smart options
   
   IF at depth limit BUT can't write SCOPE.md section without more info:
   → Action: "ask_question" (ONE more question max)
   
   IF at depth limit AND section is writable:
   → Action: Move to next SCOPE.md section

---

## QUESTION COUNT GUIDANCE (NOT LIMITS)

**THERE ARE NO HARD QUESTION LIMITS**

The system adapts to project complexity, but ALWAYS focused on SCOPE.md completeness:

- **Simple projects**: Typically 15-20 questions (fewer SCOPE.md sections need detail)
- **Standard projects**: Typically 20-30 questions (most SCOPE.md sections need detail)
- **Complex projects**: May need 30-50+ questions (all SCOPE.md sections need extensive detail)

**EFFICIENCY PRINCIPLE:**
- Optimize for SCOPE.md COMPLETENESS, not question COUNT
- Each question should fill a SCOPE.md requirement
- Stop when you can write a complete, buildable SCOPE.md
- If 45 questions are needed to complete all 14 SCOPE.md sections, ask 45 questions

**SELF-CHECK AT 50+ QUESTIONS:**
If you reach 50+ questions, evaluate:
1. "Am I asking questions that don't fill SCOPE.md requirements?"
2. "Am I drilling too deep into details that SCOPE.md doesn't need?"
3. "Can I write complete, actionable content for all 14 SCOPE.md sections?"

If YES to 1-2: Stop and complete
If NO to 3: Continue (project complexity legitimately requires more detail)

---

## CRITICAL: MULTIPLE CHOICE IS THE STANDARD

- ALWAYS provide 3-6 contextual options based on what you know
- ALWAYS include "Something else" as the last option for regular questions
- NEVER include "Something else" for the feature selection screen
- Only use text input for truly unique data (names, emails, custom descriptions)
- Make options intelligent and contextual based on website type

---

## RESPONSE FORMAT:

### For Standard Questions:
{
  "action": "ask_question",
  "reasoning": "Strategic thinking about what SCOPE.md section needs",
  "sufficiency_evaluation": {
    "scope_section": "Section 4: Business Context - Target Audience",
    "section_requirements": {
      "who_they_are": "incomplete",
      "technical_level": "missing",
      "primary_needs": "missing"
    },
    "current_information": "Target audience is small business owners",
    "required_for_scope": "Need specificity: what TYPE of small businesses, technical sophistication level, primary pain points",
    "is_sufficient": false,
    "reason": "Too vague to write target audience section - need business type for context",
    "implementation_impact": "Affects feature complexity, UI decisions, messaging strategy",
    "questions_in_section": 1,
    "within_depth_limit": true,
    "decision": "ask_question"
  },
  "content": {
    "question": {
      "id": "target_business_type",
      "text": "What type of small businesses?",
      "inputType": "radio",
      "options": [
        { "value": "service", "label": "Service-based (consulting, agencies)" },
        { "value": "product", "label": "Product-based (manufacturing, retail)" },
        { "value": "ecommerce", "label": "E-commerce" },
        { "value": "professional", "label": "Professional services (legal, accounting)" },
        { "value": "other", "label": "Something else", "allowText": true }
      ],
      "category": "business_context"
    }
  },
  "intelligence": {
    // Extracted data points
  },
  "progress": {
    "percentage": 45,
    "scope_sections_complete": ["Section 1", "Section 2", "Section 3"],
    "scope_sections_in_progress": ["Section 4"],
    "scope_sections_remaining": ["Section 5", "Section 6", "Section 7", ...]
  }
}

### When SCOPE.md Section is Complete:
{
  "action": "validate_understanding",
  "reasoning": "Section 4 (Business Context) is now complete - can write full section",
  "sufficiency_evaluation": {
    "scope_section": "Section 4: Business Context",
    "section_requirements": {
      "company_overview": "complete",
      "target_audience": "complete",
      "primary_goal": "complete",
      "success_metrics": "complete",
      "value_proposition": "complete",
      "pain_points": "complete"
    },
    "is_sufficient": true,
    "reason": "All Section 4 requirements satisfied - can write complete Business Context",
    "next_section": "Section 5: Brand Assets & Identity"
  },
  "content": {
    "summary": "Section 4 complete: Professional services firm targeting small business lawyers/accountants, primary goal is lead generation, success measured by inquiry volume and conversion rate"
  }
}

---

## EXAMPLES OF SCOPE.MD-DRIVEN EVALUATION:

### Example 1: Section 7 - Technical Specifications (User Accounts)
```
SCOPE.MD SECTION 7 REQUIREMENTS (User Auth subsection):
- Whether user accounts needed
- If yes, authentication method
- If yes, user roles/permissions needed
- If yes, account features (profiles, preferences, etc.)

USER ANSWERED: "Yes, users need to create accounts"

SUFFICIENCY CHECK:
✓ Need user accounts: YES
? Authentication method: MISSING
? User roles: MISSING
? Account features: MISSING

CAN I WRITE SECTION 7 (User Auth)?
NO - Missing critical implementation details

DEPTH CHECK: 1 question in this sub-topic

DECISION: INSUFFICIENT → Ask about authentication method
```

### Example 2: Section 4 - Business Context (Success Metrics)
```
SCOPE.MD SECTION 4 REQUIREMENTS (Success Metrics subsection):
- 2-3 measurable success criteria
- How they'll track these metrics
- Target numbers (if known)

USER ANSWERED: "Success means more inquiries and sales"

SUFFICIENCY CHECK:
? Specific metrics: TOO VAGUE
? Tracking method: MISSING
? Targets: MISSING

CAN I WRITE SECTION 4 (Success Metrics)?
NO - "More inquiries" is not specific enough for SCOPE.md

DEPTH CHECK: 1 question in this sub-topic

DECISION: INSUFFICIENT → Ask for specific metrics

NEXT QUESTION: "What specific metrics will you track?"
OPTIONS: [
  "Contact form submissions",
  "Phone calls received",
  "Email inquiries",
  "Sales conversions",
  "Something else"
]
```

### Example 3: Section 10 - Features (After Selection)
```
SCOPE.MD SECTION 10 REQUIREMENTS:
- Complete list of selected features
- Pricing for each feature
- Rationale for selections
- Conflicts identified and resolved
- Feature dependencies documented

USER ACTION: Completed feature selection chip screen

SUFFICIENCY CHECK:
✓ Features selected: COMPLETE
✓ Pricing calculated: COMPLETE
✓ Conflicts checked: COMPLETE
✓ Dependencies mapped: COMPLETE

CAN I WRITE SECTION 10 (Features)?
YES - All requirements met

DEPTH CHECK: 1 action (feature selection is atomic)

DECISION: SUFFICIENT → Move to next section

DO NOT ask follow-up questions about features!
```

---

Remember:
- EVERY question must serve a SCOPE.md section
- ALWAYS reference SCOPE.md requirements in sufficiency evaluation
- NEVER ask questions whose answers don't affect SCOPE.md content
- STOP when all 14 SCOPE.md sections can be written completely
- Track progress by SCOPE.md sections, not arbitrary question counts
`;
```

---

## PART 6: COMPLETE INFORMATION REQUIREMENTS MAPPED TO SCOPE.MD

### Foundation Data (Questions 1-6) → SCOPE.md Sections 2 & 3

**SERVES SCOPE.MD SECTIONS:**
- Section 2: Project Classification
- Section 3: Client Information

**SUFFICIENCY CRITERIA:** All 6 foundation fields collected

#### Foundation Questions:
1. ✅ User's full name [text] → Section 3
2. ✅ User's email address [text] → Section 3
3. ✅ User's phone number [text] → Section 3
4. ✅ Website type [OPTIONS] → Section 2
5. ✅ Company/project name [text] → Section 3
6. ✅ Industry/sector [OPTIONS] → Section 2

**SCOPE.MD IMPACT:**
- Section 2 requires: Website type, industry
- Section 3 requires: Name, email, phone, company name

**MAX QUESTIONS:** 6 (fixed)

---

### Business Context → SCOPE.md Section 4

**SERVES SCOPE.MD SECTION 4:** Business Context

**SUFFICIENCY CRITERIA:** Can write complete Section 4 including:
- Company/project overview (2-3 sentences)
- Target audience (who, technical level, needs)
- Primary business goal
- Success metrics (2-3 measurable)
- Key value proposition
- Main pain points the website solves

#### Required Information with SCOPE.md Mapping:

1. **Problem/Purpose** [OPTIONS based on website type]
   - **SCOPE.md Requirement:** Main pain points solved
   - **Implementation impact:** Determines core features and messaging
   - **Sufficiency test:** Can write problem statement in SCOPE.md Section 4
   - **Stop when:** Clear problem articulated

2. **Target Audience** [OPTIONS contextual to type]
   - **SCOPE.md Requirement:** Who they are, technical level, primary needs
   - **Implementation impact:** Affects UI complexity, feature selection, accessibility
   - **Sufficiency test:** Can write target audience description in SCOPE.md Section 4
   - **Max depth:** 3 questions
   - **Stop when:** Know demographic/role, technical level, primary needs

3. **Primary Goal** [OPTIONS]
   - **SCOPE.md Requirement:** Primary business goal
   - **Implementation impact:** Determines conversion points and analytics
   - **Sufficiency test:** Can state goal clearly in SCOPE.md Section 4
   - **Stop when:** Have clear primary goal

4. **Success Metrics** [OPTIONS based on type and goal]
   - **SCOPE.md Requirement:** 2-3 measurable success criteria
   - **Implementation impact:** Affects analytics configuration
   - **Sufficiency test:** Can list 2-3 specific metrics in SCOPE.md Section 4
   - **Stop when:** Have 2-3 measurable criteria
   - **Don't ask:** Specific target numbers, detailed attribution

**MAX QUESTIONS IN CATEGORY:** 4-6 questions
**DEPTH LIMIT PER SUB-TOPIC:** 3 questions

---

### Core Functionality → SCOPE.md Section 7 (Technical Specifications)

**SERVES SCOPE.MD SECTION 7:** Technical Specifications

**SUFFICIENCY CRITERIA:** Can write complete technical specifications including:
- User authentication system (if needed)
- Content management requirements
- Search/filtering functionality
- Website-type-specific features
- Integration requirements
- Compliance requirements
- Security requirements
- Performance requirements

#### Required Information with SCOPE.md Mapping:

1. **User Accounts** [OPTIONS]
   - **SCOPE.md Requirement:** Auth system specification
   - **Implementation impact:** Major architectural decision
   - **Sufficiency test:** Can specify auth system in Section 7
   - **Max depth:** 2 questions
   - **Stop when:** Know if needed, auth method, basic requirements

2. **Content Management** [OPTIONS]
   - **SCOPE.md Requirement:** CMS needs and workflow
   - **Implementation impact:** Determines CMS complexity
   - **Sufficiency test:** Can specify CMS in Section 7
   - **Max depth:** 3 questions
   - **Stop when:** Know update frequency, content types, workflow needs
   - **Don't ask:** Specific content calendar dates

3. **Search/Filtering** [OPTIONS]
   - **SCOPE.md Requirement:** Search functionality specification
   - **Implementation impact:** Search implementation complexity
   - **Sufficiency test:** Can specify search system in Section 7
   - **Max depth:** 2 questions
   - **Stop when:** Know if needed and complexity level

4. **Type-Specific Requirements** [OPTIONS]
   - **SCOPE.md Requirement:** Feature specifications for website type
   - **Implementation impact:** Core feature set varies by type
   - **Sufficiency test:** Can specify type-specific features in Section 7
   - **Max depth:** 4 questions per type-specific area
   - **Examples:**
     - Portfolio: Project organization, case study format
     - E-commerce: Catalog, variants, inventory, checkout
     - Blog: Categories, comments, subscriptions
     - Service: Booking, quotes, service areas

**MAX QUESTIONS IN CATEGORY:** 8-15 questions (varies by type complexity)

---

### Features Selection → SCOPE.md Section 10 (Features & Functionality Breakdown)

**SERVES SCOPE.MD SECTION 10:** Features & Functionality Breakdown

**SUFFICIENCY CRITERIA:** Complete feature manifest with:
- All selected features listed
- Feature descriptions
- Pricing for each
- Feature conflicts identified and resolved
- Feature dependencies documented
- Rationale for major features

#### Feature Selection (Questions 10-12):

- ✅ Present comprehensive feature list as CLICKABLE CHIPS
  - **SCOPE.md Requirement:** Complete feature list with pricing
  - **Implementation impact:** Determines complete feature set to build
  - **Sufficiency test:** Section 10 can be written with all features, prices, conflicts
  - **CRITICAL:** Feature selection is ATOMIC - one screen, done
  - **Stop when:** User clicks continue button

**CRITICAL RULES:**
- ✅ NO TEXT INPUT - only chip selection
- ✅ NO "Something else" option - comprehensive list provided
- ✅ NO follow-up questions after selection
- ✅ Once submitted, features are COMPLETE

**MAX QUESTIONS:** 1 (the feature selection screen itself)

---

### Design & Branding → SCOPE.md Sections 5 & 9

**SERVES SCOPE.MD SECTIONS:**
- Section 5: Brand Assets & Identity
- Section 9: Design Direction

**SUFFICIENCY CRITERIA:**
- Section 5: Know what assets exist vs. need creation
- Section 9: Have style direction for designer

#### Required Information:

1. **Design Style** [OPTIONS]
   - **SCOPE.md Requirement:** Overall design style direction
   - **Implementation impact:** Component library and visual direction
   - **Sufficiency test:** Can specify style in Sections 5 & 9
   - **Max depth:** 2 questions
   - **Stop when:** Have general style direction
   - **Don't ask:** Specific fonts, exact colors, detailed layouts

2. **Existing Brand Assets** [OPTIONS]
   - **SCOPE.md Requirement:** What assets exist vs. need creation
   - **Implementation impact:** Design process and asset creation needs
   - **Sufficiency test:** Can document assets in Section 5
   - **Max depth:** 1 question
   - **Stop when:** Know what assets exist

3. **Inspiration Examples** [OPTIONAL - URLs]
   - **SCOPE.md Requirement:** Reference websites
   - **Implementation impact:** Visual reference for design
   - **Sufficiency test:** Can list examples in Section 9
   - **Max depth:** 1 question
   - **Stop when:** Have 1-3 examples or none

**MAX QUESTIONS IN CATEGORY:** 3-4 questions

---

### Integrations → SCOPE.md Section 7 (Technical Specifications)

**SERVES SCOPE.MD SECTION 7:** Technical Specifications - Integrations subsection

**SUFFICIENCY CRITERIA:** Complete integration requirements documented

#### Required Information:

1. **Email Service** [OPTIONS]
   - **SCOPE.md Requirement:** Email service integration
   - **Sufficiency test:** Can specify email setup in Section 7
   - **Max depth:** 1 question

2. **Payment Processing** [OPTIONS if e-commerce]
   - **SCOPE.md Requirement:** Payment processor specification
   - **Sufficiency test:** Can specify payment system in Section 7
   - **Max depth:** 1 question

3. **Analytics** [OPTIONS]
   - **SCOPE.md Requirement:** Analytics platform
   - **Sufficiency test:** Can specify analytics in Section 7
   - **Max depth:** 1 question

4. **Other Integrations** [OPTIONS]
   - **SCOPE.md Requirement:** Additional integrations
   - **Sufficiency test:** Can list all integrations in Section 7
   - **Max depth:** 2 questions
   - **Don't ask:** API technical details

**MAX QUESTIONS IN CATEGORY:** 4-6 questions

---

### Technical Requirements → SCOPE.md Section 7 (Technical Specifications)

**SERVES SCOPE.MD SECTION 7:** Technical Specifications - Performance & Technical subsection

**SUFFICIENCY CRITERIA:** Technical requirements documented

#### Required Information:

1. **Expected Traffic** [OPTIONS]
   - **SCOPE.md Requirement:** Traffic estimates
   - **Sufficiency test:** Can specify hosting tier in Section 7
   - **Max depth:** 1 question

2. **Performance Requirements** [OPTIONS]
   - **SCOPE.md Requirement:** Performance tier
   - **Sufficiency test:** Can specify performance needs in Section 7
   - **Max depth:** 1 question

3. **Special Technical Needs** [OPTIONS]
   - **SCOPE.md Requirement:** Special requirements
   - **Sufficiency test:** Can document special needs in Section 7
   - **Max depth:** 2 questions
   - **Don't ask:** Server configurations

**MAX QUESTIONS IN CATEGORY:** 3-4 questions

---

### Timeline & Budget → SCOPE.md Sections 2, 12, 13

**SERVES SCOPE.MD SECTIONS:**
- Section 2: Project Classification (package)
- Section 12: Project Timeline
- Section 13: Investment Summary

**SUFFICIENCY CRITERIA:**
- Can determine package recommendation
- Can create realistic timeline
- Can calculate complete pricing

#### Required Information:

1. **Timeline** [OPTIONS]
   - **SCOPE.md Requirement:** Desired launch timeline
   - **Sufficiency test:** Can create timeline in Section 12
   - **Max depth:** 1 question

2. **Budget Range** [OPTIONS]
   - **SCOPE.md Requirement:** Budget for package determination
   - **Sufficiency test:** Can recommend package in Section 2, calculate pricing in Section 13
   - **Max depth:** 1 question

3. **Priority** [OPTIONS]
   - **SCOPE.md Requirement:** Priority for trade-offs
   - **Sufficiency test:** Can document priorities in Section 12
   - **Max depth:** 1 question

**MAX QUESTIONS IN CATEGORY:** 3 questions

---

### Content & Media → SCOPE.md Sections 6 & 8

**SERVES SCOPE.MD SECTIONS:**
- Section 6: Content Strategy
- Section 8: Media & Interactive Elements

**SUFFICIENCY CRITERIA:**
- Section 6: Complete content workflow documented
- Section 8: All media requirements specified

#### Required Information:

1. **Content Provider** [OPTIONS]
   - **SCOPE.md Requirement:** Who provides content
   - **Sufficiency test:** Can document content strategy in Section 6
   - **Max depth:** 1 question

2. **Content Readiness** [OPTIONS]
   - **SCOPE.md Requirement:** Content status
   - **Sufficiency test:** Can specify content timeline in Section 6
   - **Max depth:** 1 question

3. **Update Frequency** [OPTIONS]
   - **SCOPE.md Requirement:** Maintenance plan
   - **Sufficiency test:** Can document update plan in Section 6
   - **Max depth:** 1 question

4. **Media Requirements** [OPTIONS]
   - **SCOPE.md Requirement:** Video, galleries, interactive elements
   - **Sufficiency test:** Can specify media in Section 8
   - **Max depth:** 2 questions

**MAX QUESTIONS IN CATEGORY:** 4-5 questions

---

### Support & Maintenance → SCOPE.md Section 11

**SERVES SCOPE.MD SECTION 11:** Post-Launch Support Plan

**SUFFICIENCY CRITERIA:** Complete support plan documented

#### Required Information:

1. **Training Needs** [OPTIONS]
   - **SCOPE.md Requirement:** Training requirements
   - **Sufficiency test:** Can specify training in Section 11
   - **Max depth:** 1 question

2. **Maintenance Plan** [OPTIONS]
   - **SCOPE.md Requirement:** Ongoing maintenance
   - **Sufficiency test:** Can document maintenance in Section 11
   - **Max depth:** 1 question

3. **Hosting Tier** [CALCULATED]
   - **SCOPE.md Requirement:** Hosting selection
   - **Sufficiency test:** Can specify hosting in Section 11
   - **Max depth:** 0 (calculated from other answers)

**MAX QUESTIONS IN CATEGORY:** 2-3 questions

---

## PART 7: SCOPE.MD SECTION COMPLETION TRACKING

### Progress Tracking by SCOPE.md Section

Claude must track which SCOPE.md sections are complete:

```typescript
interface ScopeProgress {
  sections: {
    section1_executive_summary: 'not_started' | 'in_progress' | 'complete';
    section2_project_classification: 'not_started' | 'in_progress' | 'complete';
    section3_client_information: 'not_started' | 'in_progress' | 'complete';
    section4_business_context: 'not_started' | 'in_progress' | 'complete';
    section5_brand_assets: 'not_started' | 'in_progress' | 'complete';
    section6_content_strategy: 'not_started' | 'in_progress' | 'complete';
    section7_technical_specs: 'not_started' | 'in_progress' | 'complete';
    section8_media_elements: 'not_started' | 'in_progress' | 'complete';
    section9_design_direction: 'not_started' | 'in_progress' | 'complete';
    section10_features_breakdown: 'not_started' | 'in_progress' | 'complete';
    section11_support_plan: 'not_started' | 'in_progress' | 'complete';
    section12_timeline: 'not_started' | 'in_progress' | 'complete';
    section13_investment_summary: 'not_started' | 'in_progress' | 'complete';
    section14_validation_outcomes: 'not_started' | 'in_progress' | 'complete';
  };
  overallCompleteness: number; // 0-100%
  sectionsComplete: number; // Count of complete sections
  sectionsInProgress: number;
  sectionsNotStarted: number;
}
```

### Completion Criteria

**Mark as COMPLETE when ALL 14 SCOPE.md sections can be written fully:**

```
Section 1: ✓ Can write 2-3 sentence summary
Section 2: ✓ Can classify project completely
Section 3: ✓ Have all contact information
Section 4: ✓ Can write business context fully
Section 5: ✓ Know all brand asset details
Section 6: ✓ Can document content strategy
Section 7: ✓ Can specify all technical requirements
Section 8: ✓ Can list all media requirements
Section 9: ✓ Can describe design direction
Section 10: ✓ Can list all features with pricing
Section 11: ✓ Can specify support plan
Section 12: ✓ Can create project timeline
Section 13: ✓ Can calculate complete pricing
Section 14: ✓ Can document all validations

IF all ✓ → COMPLETE
IF any section has gaps → Continue gathering information
```

---

## PART 8: THE FIVE HORSEMEN OF ORCHESTRATION FAILURE (UPDATED)

### ❌ HORSEMAN 1: Asking Questions That Don't Serve SCOPE.md

**THE FAILURE PATTERN:**
```typescript
// ❌ NEVER DO THIS - Question doesn't fill SCOPE.md requirement
const question = {
  text: "What's your favorite color?",
  // This doesn't serve ANY SCOPE.md section!
};
```

**✅ THE SUCCESS PATTERN:**
```typescript
// ✅ CORRECT - Every question serves SCOPE.md
const question = {
  text: "What design style do you prefer?",
  // Serves Section 9: Design Direction
  // Required for SCOPE.md design specification
  scope_section: "Section 9: Design Direction",
  scope_requirement: "Overall design style direction"
};
```

---

### ❌ HORSEMAN 2: Not Referencing SCOPE.md in Sufficiency Evaluation

**THE FAILURE PATTERN:**
```typescript
// ❌ NEVER DO THIS - Evaluation doesn't reference SCOPE.md
{
  "sufficiency_evaluation": {
    "current_information": "User wants a portfolio site",
    "is_sufficient": false,
    "reason": "Need more details"
    // ← WRONG! What SCOPE.md section? What requirement?
  }
}
```

**✅ THE SUCCESS PATTERN:**
```typescript
// ✅ CORRECT - Explicit SCOPE.md reference
{
  "sufficiency_evaluation": {
    "scope_section": "Section 7: Technical Specifications - Portfolio Display",
    "section_requirements": {
      "project_organization": "missing",
      "display_format": "missing",
      "case_study_needs": "missing"
    },
    "current_information": "User wants portfolio site",
    "required_for_scope": "Section 7 requires: how projects are organized, display format (grid/list/slides), case study format",
    "is_sufficient": false,
    "reason": "Cannot write Section 7 portfolio specifications without knowing organization and display format"
  }
}
```

---

### ❌ HORSEMAN 3: Following Up on Feature Selection

**THE FAILURE PATTERN:**
```typescript
// ❌ NEVER DO THIS - Asking about features after selection
// User selects features...
const followUp = {
  text: "You selected user accounts. What type of authentication?",
  // ← WRONG! Features are done! Section 10 is complete!
};
```

**✅ THE SUCCESS PATTERN:**
```typescript
// ✅ CORRECT - Feature selection completes Section 10
// Present comprehensive options in the chip interface
// Authentication types are separate feature chips:
// - "Email/Password Authentication"
// - "Social Login Authentication"
// - "Magic Link Authentication"
// Once they click continue:
{
  "sufficiency_evaluation": {
    "scope_section": "Section 10: Features & Functionality Breakdown",
    "section_requirements": {
      "feature_list": "complete",
      "pricing": "complete",
      "conflicts": "complete",
      "dependencies": "complete"
    },
    "is_sufficient": true,
    "reason": "Section 10 complete - all features selected and priced",
    "next_section": "Section 11: Post-Launch Support Plan"
  }
}
```

---

### ❌ HORSEMAN 4: Drilling Without Checking SCOPE.md Requirements

**THE FAILURE PATTERN:**
```typescript
// ❌ NEVER DO THIS - Drilling without SCOPE.md justification
// Q1: "Who is your target audience?"
// A1: "Small business owners"
// Q2: "What industry?"
// A2: "Professional services"
// Q3: "What type of professional services?"
// A3: "Lawyers and accountants"
// Q4: "What practice areas?"
// ← WRONG! Section 4 doesn't need this level of detail!
```

**✅ THE SUCCESS PATTERN:**
```typescript
// ✅ CORRECT - Check SCOPE.md requirements before drilling
// After Q3, evaluate:
{
  "sufficiency_evaluation": {
    "scope_section": "Section 4: Business Context - Target Audience",
    "section_requirements": {
      "who_they_are": "complete - small biz owners, professional services, lawyers/accountants",
      "technical_level": "complete - professional but not tech-savvy (inferred)",
      "primary_needs": "complete - credibility, compliance, professionalism (inferred)"
    },
    "is_sufficient": true,
    "reason": "Section 4 target audience subsection complete - can write: 'Target audience consists of small business owners in professional services, specifically legal and accounting firms. B2B-focused professionals who value credibility and compliance but typically have limited technical expertise.'",
    "additional_detail_impact": "Knowing tax law vs corporate law doesn't change implementation - not needed for SCOPE.md",
    "decision": "move_to_next_requirement"
  }
}
```

---

### ❌ HORSEMAN 5: Not Adapting to Website Type

**THE FAILURE PATTERN:**
```typescript
// ❌ NEVER DO THIS - Same questions for all types
const question = {
  text: "What's your business model?",
  // ← Portfolio sites don't have "business models"!
  // This question doesn't serve SCOPE.md for portfolio type!
};
```

**✅ THE SUCCESS PATTERN:**
```typescript
// ✅ CORRECT - Questions adapted to type and serve SCOPE.md
// For portfolio (Section 7: Technical Specifications):
const question = {
  text: "How do you want to present your work?",
  scope_section: "Section 7: Technical Specifications - Portfolio Display",
  scope_requirement: "Project display format",
  inputType: "radio",
  options: [
    { value: "grid", label: "Grid gallery" },
    { value: "cases", label: "Detailed case studies" },
    { value: "minimal", label: "Minimal list view" },
    { value: "other", label: "Something else", allowText: true }
  ]
};

// For e-commerce (Section 7: Technical Specifications):
const question = {
  text: "How will customers browse products?",
  scope_section: "Section 7: Technical Specifications - Product Navigation",
  scope_requirement: "Product organization and discovery",
  inputType: "radio",
  options: [
    { value: "categories", label: "Category-based browsing" },
    { value: "search", label: "Search-first approach" },
    { value: "collections", label: "Curated collections" },
    { value: "other", label: "Something else", allowText: true }
  ]
};
```

---

## PART 9: TESTING REQUIREMENTS (UPDATED FOR SCOPE.MD)

### NEW Test 1: SCOPE.md Section Reference Required
```typescript
// Verify every Claude response references SCOPE.md:
test('Claude responses reference SCOPE.md sections', () => {
  const response = await callClaudeOrchestration({
    conversation: state.conversation,
    intelligence: state.intelligence
  });
  
  if (['ask_question', 'validate_understanding'].includes(response.action)) {
    assert(response.sufficiency_evaluation, 'Must include sufficiency evaluation');
    assert(
      response.sufficiency_evaluation.scope_section,
      'Must identify which SCOPE.md section this serves'
    );
    assert(
      response.sufficiency_evaluation.section_requirements,
      'Must list section requirements'
    );
    assert(
      response.sufficiency_evaluation.required_for_scope,
      'Must explain what SCOPE.md needs'
    );
  }
});
```

---

### NEW Test 2: All SCOPE.md Sections Addressable
```typescript
// Verify system can complete all 14 SCOPE.md sections:
test('All 14 SCOPE.md sections must be completable', () => {
  const requiredSections = [
    'section1_executive_summary',
    'section2_project_classification',
    'section3_client_information',
    'section4_business_context',
    'section5_brand_assets',
    'section6_content_strategy',
    'section7_technical_specs',
    'section8_media_elements',
    'section9_design_direction',
    'section10_features_breakdown',
    'section11_support_plan',
    'section12_timeline',
    'section13_investment_summary',
    'section14_validation_outcomes'
  ];
  
  requiredSections.forEach(section => {
    assert(
      state.scopeProgress.sections[section] === 'complete',
      `Section ${section} must be complete before finishing`
    );
  });
});
```

---

### NEW Test 3: Questions Serve SCOPE.md Sections
```typescript
// Verify every question serves a SCOPE.md section:
test('All questions must serve SCOPE.md sections', () => {
  state.questionHistory
    .filter(q => q.source === 'claude')
    .forEach(question => {
      assert(
        question.scope_section,
        `Question "${question.text}" must specify which SCOPE.md section it serves`
      );
      
      assert(
        question.scope_requirement,
        `Question "${question.text}" must specify which section requirement it addresses`
      );
    });
});
```

---

### NEW Test 4: SCOPE.md Completeness Before Finish
```typescript
// Verify SCOPE.md is completable before marking complete:
test('Cannot complete without all SCOPE.md sections fillable', () => {
  if (state.isComplete) {
    const missingRequirements = validateScopeCompleteness(state.intelligence);
    
    assert(
      missingRequirements.length === 0,
      `Cannot complete with missing SCOPE.md requirements: ${missingRequirements.join(', ')}`
    );
  }
});

function validateScopeCompleteness(intelligence: any): string[] {
  const missing: string[] = [];
  
  // Section 1: Executive Summary
  if (!canWriteExecutiveSummary(intelligence)) {
    missing.push('Section 1: Cannot write executive summary');
  }
  
  // Section 2: Project Classification
  if (!intelligence.websiteType || !intelligence.industry) {
    missing.push('Section 2: Missing website type or industry');
  }
  
  // Section 4: Business Context
  if (!intelligence.targetAudience || !intelligence.primaryGoal) {
    missing.push('Section 4: Missing business context requirements');
  }
  
  // Section 7: Technical Specifications
  if (!hasTechnicalSpecifications(intelligence)) {
    missing.push('Section 7: Missing technical specifications');
  }
  
  // Section 10: Features
  if (!intelligence.selectedFeatures || intelligence.selectedFeatures.length === 0) {
    missing.push('Section 10: No features selected');
  }
  
  // ... validate all 14 sections
  
  return missing;
}
```

---

### Existing Tests (5-18) - Keep all previous tests from V3.1

[All previous tests from V3.1 remain in addition to new SCOPE.md-focused tests]

---

## PART 10: CRITICAL IMPLEMENTATION CHECKLIST (UPDATED)

Before you write ANY code for Phase 3, ensure you understand:

### SCOPE.md Requirements
- ✅ Know all 14 SCOPE.md sections and their requirements
- ✅ Understand what information each section needs
- ✅ Can map gathered information to SCOPE.md sections
- ✅ Claude references SCOPE.md in every sufficiency evaluation
- ✅ Questions explicitly serve SCOPE.md sections
- ✅ Progress tracked by SCOPE.md section completion
- ✅ Cannot mark complete unless all sections are fillable

### UI/UX Requirements
- ✅ Multiple choice is the STANDARD for questions
- ✅ Every question option set includes "Something else" with text fallback
- ✅ Feature selection uses clickable chips with NO "Something else" option
- ✅ Feature selection is SELF-CONTAINED - no follow-up questions
- ✅ Feature chips show name, description, and price
- ✅ Options are contextual based on website type
- ✅ Language adapts to website type (not always "business")
- ✅ Pre-select recommended features in chip interface

### Claude Behavior Requirements  
- ✅ Generate 3-6 smart options for most questions
- ✅ Use website type to make options relevant
- ✅ Present features as structured data for chip display
- ✅ Only use text input for truly unique data
- ✅ Progressive disclosure through option selection
- ✅ NEVER ask follow-up questions about selected features
- ✅ Move to next SCOPE.md section after feature selection
- ✅ **Evaluate SCOPE.md section sufficiency before asking questions**
- ✅ **Explicitly reference SCOPE.md sections in all evaluations**
- ✅ **Respect depth limits per section (3 questions per sub-topic)**
- ✅ **Only ask questions that fill SCOPE.md requirements**
- ✅ **No arbitrary question count limits - complete all SCOPE.md sections**
- ✅ **Adapt question count to SCOPE.md section complexity**

### System Architecture Requirements
- ✅ Claude gets complete context with EVERY request
- ✅ State accumulates, never replaces
- ✅ Foundation questions stored in code
- ✅ Claude questions generated dynamically
- ✅ Single orchestration endpoint
- ✅ Feature selection is atomic operation
- ✅ Adapt all content to website type
- ✅ **Track SCOPE.md section progress**
- ✅ **Include SCOPE.md section reference in all responses**
- ✅ **Log which SCOPE.md requirement each question serves**
- ✅ **Validate SCOPE.md completeness before allowing completion**

---

## PART 11: SUCCESS INDICATORS (UPDATED FOR SCOPE.MD)

You'll know Phase 3 is correctly implemented when:

### SCOPE.md Integration
1. **Explicit Section References** - Every Claude response identifies which SCOPE.md section it serves
2. **Section-Driven Questions** - Questions asked because SCOPE.md section needs information
3. **Completeness Validation** - System validates all 14 SCOPE.md sections before completion
4. **Sufficiency Checks Reference SCOPE.md** - Evaluations explicitly state section requirements
5. **Progress by Section** - UI shows progress through SCOPE.md sections, not arbitrary percentages

### Question Quality
6. **Options Everywhere** - 80%+ of questions present multiple choice options
7. **Smart Contextual Choices** - Options reflect website type and accumulated knowledge
8. **Feature Chips Working** - Feature selection shows visual chips with prices
9. **No Feature Text Input** - NEVER "Describe what features you want"
10. **No Feature Follow-ups** - After feature selection, move to different SCOPE.md section
11. **Something Else Available** - Every regular question has escape hatch (NOT features)
12. **Type-Aware Language** - Questions use appropriate terms for portfolio/blog/store/etc

### System Behavior
13. **Self-Contained Features** - Feature selection completes Section 10 in one screen
14. **Progressive Refinement** - Options narrow based on previous selections
15. **Visual Feature Selection** - Chips organized by category with clear pricing
16. **Sufficiency Evaluation** - Every Claude response includes explicit SCOPE.md section check
17. **Section Awareness** - No section has excessive drilling (max 3-4 per sub-topic)
18. **Implementation Focus** - Every question has clear SCOPE.md purpose
19. **Flexible Completion** - Simple projects complete when SCOPE.md done, complex take longer
20. **No Arbitrary Limits** - System doesn't cut off if SCOPE.md sections incomplete
21. **Smart Section Transitions** - Claude moves on when section complete

### Measuring Success

**Quantitative Metrics:**
- SCOPE.md section completion tracking (14/14 sections)
- Question-to-SCOPE.md-requirement ratio (each question fills requirement)
- Section depth distribution (no single section dominates)
- SCOPE.md-serving question percentage (100% of questions serve SCOPE.md)

**Qualitative Indicators:**
- SCOPE.md generated at completion is comprehensive and buildable by Cursor AI
- All 14 sections have complete, actionable content
- No sections feel incomplete or have placeholder text
- Developer can start building immediately from SCOPE.md
- Each section feels appropriately explored
- Complex projects get proper SCOPE.md detail
- Simple projects complete efficiently with complete SCOPE.md

---

## PART 12: REMEMBER - THE CORE PRINCIPLES (UPDATED)

The difference between a working orchestration system and chaos:

### SCOPE.md-Driven Principles (NEW)
1. **SCOPE.MD IS THE NORTH STAR** - Every question must serve a SCOPE.md section
2. **EVALUATE SCOPE.MD FIRST** - Check section requirements before asking questions
3. **REFERENCE SECTIONS EXPLICITLY** - Always state which SCOPE.md section you're working on
4. **14 SECTIONS REQUIRED** - Cannot complete without all sections fillable
5. **IMPLEMENTATION IMPACT** - Only ask what affects SCOPE.md content

### Question Generation Principles
6. **OPTIONS** are the standard for questions, text is the exception
7. **FEATURES** are chips in a self-contained screen, no follow-ups
8. **ADAPT** language and options to website type  
9. **RESPECT DEPTH** - Max 3-4 questions per SCOPE.md sub-topic before moving on
10. **FLEXIBLE COMPLETION** - Complete when SCOPE.md is complete, not at question count

### System Architecture Principles
11. **MERGE** intelligence, don't replace
12. **COMPLETE** context to Claude, every time
13. **SYSTEM** prompt in the system field
14. **INTERPOLATE** at render, not in state
15. **Claude is NOT a chatbot** - it's a SCOPE.md-filling orchestration engine

### User Experience Principles
16. **One question at a time** - single-track flow, no branching
17. **Complete information required** - no optional SCOPE.md sections
18. **Invisible transition** - users never know when Claude takes over
19. **Consistent UX** - same UI for foundation and Claude questions
20. **Reference context** - every question should build on what's known
21. **Guide don't ask** - options guide users to better SCOPE.md inputs

### Feature Selection Principles
22. **Visual selection** - feature selection is visual and interactive
23. **Feature completeness** - comprehensive feature list, no "other" option
24. **Atomic features** - select features once (completes Section 10), then move on

### Sufficiency Principles (NEW)
25. **Sufficiency first** - Evaluate SCOPE.md section before asking for more
26. **Know when to stop** - Section complete when SCOPE.md writeable
27. **Section drives questions** - If section complete, move to next section
28. **Adapt to complexity** - Simple projects = fewer sections need detail
29. **Section discipline** - Don't drill past what SCOPE.md needs

These principles create the frictionless, intelligent, SCOPE.md-driven experience that makes Introspect V3 convert.

---

## APPENDIX A: Website Type Adaptations (Same as V3.1)

[Keep existing content from V3.1]

---

## APPENDIX B: SCOPE.md Section Quick Reference

### Section-by-Section Requirements Summary

```
SECTION 1: Executive Summary
├─ Required: 2-3 sentence project overview
├─ Includes: Project name, type, goal, audience, differentiator
└─ Test: Can someone understand entire project in 30 seconds?

SECTION 2: Project Classification
├─ Required: Website type, industry, business model, complexity, package
├─ Includes: Clear categorization for internal processing
└─ Test: Package and pricing determinable?

SECTION 3: Client Information
├─ Required: Name, email, phone, company, decision-maker role
├─ Includes: All contact information
└─ Test: Can we reach client for all project communications?

SECTION 4: Business Context
├─ Required: Overview, audience, goal, metrics, value prop, pain points
├─ Includes: Complete business understanding
└─ Test: Can developer understand the business without asking questions?

SECTION 5: Brand Assets & Identity
├─ Required: Existing assets, what needs creation, style direction
├─ Includes: Asset inventory and requirements
└─ Test: Does designer know what assets to use vs. create?

SECTION 6: Content Strategy
├─ Required: Provider, readiness, frequency, maintenance, types
├─ Includes: Complete content workflow
└─ Test: Clear who provides content and when?

SECTION 7: Technical Specifications
├─ Required: Features, auth, CMS, integrations, compliance, security, performance
├─ Includes: Complete technical architecture
└─ Test: Can developer build entire system without clarification?

SECTION 8: Media & Interactive Elements
├─ Required: Video, galleries, animations, interactive components
├─ Includes: All rich media specifications
└─ Test: Developer knows every media component to implement?

SECTION 9: Design Direction
├─ Required: Style, colors, typography, layout, references
├─ Includes: Visual design guidance
└─ Test: Designer can create mockups that align with vision?

SECTION 10: Features & Functionality Breakdown
├─ Required: Package, add-ons, pricing, conflicts, dependencies, rationale
├─ Includes: Complete feature manifest
└─ Test: Accurate pricing with no feature conflicts?

SECTION 11: Post-Launch Support Plan
├─ Required: Support duration, training, maintenance, hosting
├─ Includes: Complete post-launch plan
└─ Test: Clear support and maintenance responsibilities?

SECTION 12: Project Timeline
├─ Required: Milestones, dependencies, launch date
├─ Includes: Realistic timeline with clear responsibilities
└─ Test: Achievable timeline with identified blockers?

SECTION 13: Investment Summary
├─ Required: Pricing breakdown, ROI, payment schedule
├─ Includes: Transparent, accurate pricing
└─ Test: Pricing matches package and features exactly?

SECTION 14: Validation Outcomes
├─ Required: Validation responses, conflict resolutions, confirmations
├─ Includes: Documentation of all validation interactions
└─ Test: All key decisions confirmed and documented?
```

---

## APPENDIX C: SCOPE.md Sufficiency Decision Tree

```
┌─────────────────────────────────────────┐
│ New answer received from user           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Which SCOPE.md SECTION does this       │
│ answer contribute to?                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ What does THIS SCOPE.md SECTION        │
│ specifically require? List all.         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Check each requirement:                 │
│ ✓ = Have sufficient info                │
│ ? = Missing or too vague                │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴──────┐
       │              │
       ▼              ▼
   ALL ✓          SOME ?
   │              │
   │              ▼
   │    ┌─────────────────────────────────┐
   │    │ Would additional detail CHANGE   │
   │    │ how SCOPE.md section is written? │
   │    └─────────────┬───────────────────┘
   │                  │
   │          ┌───────┴──────┐
   │          │              │
   │          ▼              ▼
   │      YES - Affects   NO - Won't change
   │      SCOPE.md       SCOPE.md content
   │      content           │
   │          │              ▼
   │          │         ┌──────────────────┐
   │          │         │ SECTION COMPLETE │
   │          │         │ Mark as ✓        │
   │          │         │ Move to next     │
   │          │         └──────────────────┘
   │          │
   │          ▼
   │    ┌─────────────────────────────────┐
   │    │ How many questions asked for    │
   │    │ THIS section/sub-topic?        │
   │    └─────────────┬───────────────────┘
   │                  │
   │          ┌───────┴──────┐
   │          │              │
   │          ▼              ▼
   │      0-2 questions  3+ questions
   │      Can continue   At depth limit
   │          │              │
   │          │              ▼
   │          │         ┌──────────────────┐
   │          │         │ Is this missing  │
   │          │         │ info CRITICAL to │
   │          │         │ SCOPE.md section?│
   │          │         └────┬─────────────┘
   │          │              │
   │          │      ┌───────┴──────┐
   │          │      │              │
   │          │      ▼              ▼
   │          │   YES - Blocks   NO - Section
   │          │   section       is good enough
   │          │   completeness      │
   │          │      │              ▼
   │          │      │         ┌──────────────┐
   │          │      │         │ SECTION      │
   │          │      │         │ COMPLETE     │
   │          │      │         │ Move to next │
   │          │      │         └──────────────┘
   │          ▼      ▼
   │    ┌─────────────────────────────────┐
   │    │ Ask next question with options  │
   │    │ Reference: SCOPE.md Section X   │
   │    │ Requirement: [specific need]    │
   │    └─────────────────────────────────┘
   │
   └────────────────►
                ┌─────────────────────────┐
                │ SECTION COMPLETE         │
                │ Move to next SCOPE.md    │
                │ section that needs info  │
                └─────────────────────────┘
```

---

## APPENDIX D: Example SCOPE.md Completeness Check

### Example Conversation State Analysis

```
CURRENT STATE:
- Foundation questions: Complete (6/6)
- Website type: E-commerce
- Industry: Fashion/Apparel
- Target audience: Young professionals, fashion-conscious
- Primary goal: Launch online store
- Selected features: Shopping cart, inventory management, product search

SCOPE.MD SECTION REVIEW:

Section 1: Executive Summary
├─ Can write? YES ✓
└─ Have: Type, audience, goal, differentiator

Section 2: Project Classification
├─ Can write? YES ✓
└─ Have: Type, industry, complexity (complex - e-commerce), package recommendation

Section 3: Client Information
├─ Can write? YES ✓
└─ Have: Name, email, phone, company

Section 4: Business Context
├─ Can write? PARTIAL ⚠️
├─ Have: Audience, primary goal
└─ Missing: Success metrics, value proposition, pain points
    → Need 1-2 more questions

Section 5: Brand Assets
├─ Can write? NO ❌
└─ Missing: All information
    → Need 2-3 questions

Section 6: Content Strategy
├─ Can write? NO ❌
└─ Missing: All information
    → Need 3-4 questions

Section 7: Technical Specifications
├─ Can write? PARTIAL ⚠️
├─ Have: Core features selected
└─ Missing: Product variants, payment processing, shipping
    → Need 3-5 more questions

Section 8: Media Elements
├─ Can write? NO ❌
└─ Missing: All information
    → Need 1-2 questions

Section 9: Design Direction
├─ Can write? NO ❌
└─ Missing: All information
    → Need 2-3 questions

Section 10: Features Breakdown
├─ Can write? YES ✓
└─ Have: Features selected, pricing calculated

Section 11: Support Plan
├─ Can write? NO ❌
└─ Missing: All information
    → Need 2-3 questions

Section 12: Timeline
├─ Can write? NO ❌
└─ Missing: All information
    → Need 1-2 questions

Section 13: Investment Summary
├─ Can write? YES ✓
└─ Have: Package, features, pricing calculated

Section 14: Validation Outcomes
├─ Can write? PARTIAL ⚠️
└─ Will complete during validation phase

COMPLETENESS SCORE: 4/14 complete, 3/14 partial, 7/14 not started
ESTIMATED REMAINING QUESTIONS: 18-28 questions
RECOMMENDATION: Continue gathering information - prioritize Section 4, 7, 6
```

---

Good luck. You've got this. Remember: **Every question serves SCOPE.md. If it doesn't fill a section requirement, don't ask it.**
