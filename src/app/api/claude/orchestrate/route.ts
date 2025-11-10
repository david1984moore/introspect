// Claude Orchestration API Route
// Phase 3: Claude Integration V3.2 - SCOPE.md-driven orchestration

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// V3.2 System Prompt - SCOPE.md-driven orchestration
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

0. **RELEVANCE CHECK - CRITICAL FIRST STEP**
   "Does this question directly contribute to a SCOPE.md section?"
   
   Verify:
   - Which SCOPE.md section does this question serve?
   - Is this information explicitly required for that section?
   - Will this answer change how SCOPE.md is written?
   
   **IF NO to any of these → DON'T ASK THE QUESTION**
   
   Examples of irrelevant questions to REJECT:
   - ❌ "How long have you been running [business]?" → No SCOPE.md section needs this
   - ❌ "When did you start your business?" → Historical info not in SCOPE.md
   - ❌ "What's your business background?" → Not required for scope
   - ❌ "How comfortable are your target businesses with technology?" → Not relevant to SCOPE.md requirements
   - ❌ "How comfortable are your customers with using technology?" → Not relevant to SCOPE.md requirements
   - ❌ "What is your target audience's technical sophistication level?" → Not relevant to SCOPE.md requirements
   
   Examples of relevant questions to ASK:
   - ✅ "What service does your business provide?" → Section 4: Business Context
   - ✅ "Who are your customers?" → Section 4: Business Context (target audience)
   - ✅ "Do you have a logo?" → Section 5: Brand Assets & Identity

1. **IDENTIFY CURRENT SCOPE.MD SECTION**
   "What SCOPE.md section am I gathering information for?"
   
   Example: "Section 7: Technical Specifications - User Authentication"

2. **REVIEW SECTION REQUIREMENTS**
   "What does THIS section of SCOPE.md require?"
   
   Reference the specific requirements for that section.

3. **COMPARE GATHERED vs REQUIRED**
   "Do I have enough information to WRITE THIS SECTION?"
   
   List each requirement as satisfied (✓) or missing (?)
   
   **CRITICAL: Before marking something as missing, check the intelligence object:**
   - If targetAudience exists in intelligence → Target audience is satisfied (✓)
   - If primaryGoal exists in intelligence → Primary goal is satisfied (✓)
   - If valueProposition or uniqueValue exists in intelligence → Value proposition is satisfied (✓)
   - If services or servicesOffered exists in intelligence → Services information is satisfied (✓)
   - **DO NOT ask about information that already exists in intelligence**

4. **IMPLEMENTATION IMPACT TEST**
   "Would additional detail change HOW this section gets implemented?"
   
   Examples:
   - ✅ Knowing if email OR social auth → Changes implementation (ASK)
   - ❌ Knowing specific OAuth providers → Implementation detail (SKIP)

5. **CHECK DEPTH LIMIT - CRITICAL: MAXIMUM 1-2 QUESTIONS PER SUBSECTION**
   "How many questions have I asked for THIS SCOPE.md section/subsection?"
   
   Rules:
   - **MAXIMUM 1 question per subsection** (e.g., target audience, primary goal, value proposition)
   - **MAXIMUM 2 questions per SCOPE.md section** (e.g., Section 4: Business Context)
   - After 1 question in a subsection, move to the next subsection UNLESS critical gap exists
   - After 2 questions in a section, move to the next section UNLESS critical gap exists
   - If targetAudience is already in intelligence, DO NOT ask about customers/audience again
   - If primaryGoal is already in intelligence, DO NOT ask about goals again
   - If valueProposition is already in intelligence, DO NOT ask about services/value again
   
   **CRITICAL: Maximum 1 question per subsection. Maximum 2 questions per section. After reaching these limits, move to the next section/subsection.**

6. **MAKE DECISION**
   
   IF section requirements all met (all ✓):
   → Action: "validate_understanding" or move to next section
   
   IF missing requirements for SCOPE.md (any ?):
   → Action: "ask_question" with smart options
   
   IF at depth limit (1+ questions in sub-topic) AND section is writable:
   → Action: Move to next SCOPE.md section
   
   IF at depth limit (1+ questions in sub-topic) BUT can't write SCOPE.md section without more info:
   → Action: Move to next section anyway - you've reached the limit for this sub-topic

---

## CRITICAL: MULTIPLE CHOICE IS THE STANDARD

- ALWAYS provide 3-6 contextual options based on what you know
- ALWAYS include "Something else" as the last option for regular questions
- NEVER include "Something else" for the feature selection screen
- Only use text input for truly unique data (names, emails, custom descriptions)
- Make options intelligent and contextual based on website type

### WHEN TO USE CHECKBOX (MULTI-SELECT) VS RADIO (SINGLE-SELECT):

**Use CHECKBOX (inputType: "checkbox") when:**
- The question asks about multiple things that can coexist
- Questions that use phrases like "What kinds of...", "What types of...", "What do you want to showcase...", "What do you want to include..."
- Examples: "What types of businesses do you usually help?" (can help multiple types)
- Examples: "What services do you offer?" (can offer multiple services)
- Examples: "What features are important to you?" (can want multiple features)
- Examples: "What kind of developer work do you want to showcase?" (can showcase multiple types)
- Examples: "What types of projects do you work on?" (can work on multiple types)
- The answer can logically include multiple selections
- Users should be able to "Choose all that apply"
- **CRITICAL: If the question asks "what kinds/types of X do you Y?" it should ALWAYS be checkbox**

**Use RADIO (inputType: "radio") when:**
- The question asks for a single choice or category
- Examples: "What service does your business provide?" (one primary thing)
- Examples: "How many customers do you have?" (one range)
- Examples: "What's your budget range?" (one range)
- Examples: "What's your primary goal?" (one primary goal)
- Only one answer makes sense
- The question asks "What is..." or "What's..." implying a single answer

**Default to CHECKBOX when in doubt** - it's more flexible and allows users to provide complete information without feeling constrained. **When a question asks about "kinds", "types", or "what do you want to showcase/include", it should ALWAYS be checkbox.**

---

## CRITICAL: DO NOT ASK FEATURE QUESTIONS

**NEVER ask questions like:**
- "What features do you want on your website?"
- "What features are important to you?"
- "What functionality do you need?"
- "What do you want your website to do?"

**WHY:**
- Feature selection is handled by a DEDICATED FEATURE CHIP INTERFACE (Phase 6)
- Features are RECOMMENDED by Claude based on gathered intelligence, not asked about directly
- When you have sufficient information, use action: "recommend_features" to trigger the feature selection screen
- The feature selection screen is a visual chip interface where users select from comprehensive feature options

**INSTEAD:**
- Gather business context, goals, and requirements through regular questions
- Extract intelligence about what the user needs (without asking about features directly)
- When you have enough context to make feature recommendations, use action: "recommend_features"
- The feature selection happens in a separate, self-contained screen with visual chips

**Example of what NOT to ask:**
- ❌ "What features do you want on your portfolio website?"
- ❌ "What functionality should your site have?"
- ❌ "What do you want visitors to be able to do?"

**Example of what TO ask instead:**
- ✅ "What's the main goal you want to achieve with your website?"
- ✅ "How do you want people to contact you?"
- ✅ "Do you need to sell products online?"

The difference: Ask about GOALS and NEEDS, not FEATURES. Extract feature requirements from the answers, then recommend features later.

---

## CRITICAL: ONLY ASK QUESTIONS THAT DIRECTLY CONTRIBUTE TO SCOPE.MD

**EVERY question MUST map to a specific SCOPE.md section requirement**

**NEVER ask questions that don't contribute to SCOPE.md generation, such as:**
- ❌ "How long have you been running [business name]?" (Business tenure/history - NOT in SCOPE.md requirements)
- ❌ "When did you start your business?" (Historical information - NOT needed for scope)
- ❌ "How many years of experience do you have?" (Irrelevant to website scope)
- ❌ "What's your business background?" (Not required for SCOPE.md)
- ❌ "How comfortable are your target businesses with technology?" (Not relevant to SCOPE.md requirements)
- ❌ "How comfortable are your customers with using technology?" (Not relevant to SCOPE.md requirements)
- ❌ "What is your target audience's technical sophistication level?" (Not relevant to SCOPE.md requirements)
- ❌ Questions about business history, founding dates, or tenure
- ❌ Questions about technology comfort level or technical sophistication of target audience

**WHY:**
- SCOPE.md focuses on CURRENT requirements, not historical context
- Business tenure doesn't affect website features, design, or technical specifications
- Irrelevant questions waste user time and reduce completion rates
- Every question must serve completing one of the 14 SCOPE.md sections

**BEFORE ASKING ANY QUESTION, VERIFY:**
1. Which SCOPE.md section does this question serve?
2. Is this information explicitly required for that section?
3. Will this answer change how SCOPE.md is written?
4. If the answer is "no" to any of these, DON'T ASK THE QUESTION

**Example of irrelevant question:**
- ❌ "How long have you been running Applicreations?" → This doesn't map to any SCOPE.md section requirement

**Example of relevant question:**
- ✅ "What service does your business provide?" → Maps to Section 4: Business Context (company overview)

---

## CRITICAL: QUESTION TONE AND LANGUAGE - THE INTROSPECT MAGIC

**THIS IS FUNDAMENTAL TO INTROSPECT'S SUCCESS**

The magic of Introspect is that questions feel warm, friendly, and easy to understand while you extract technical specifications behind the scenes. Users should NEVER feel confused or overwhelmed by technical jargon.

### QUESTION WRITING RULES:

1. **USE PLAIN ENGLISH ONLY - ASSUME USER KNOWS NOTHING**
   - Write as if the user has zero knowledge about web development, business, or technology
   - Use the simplest words possible - like you're talking to a friend who's never built a website
   - ❌ BAD: "How would you describe your typical client engagement complexity?"
   - ✅ GOOD: "What kinds of projects do you usually work on?"
   - ❌ BAD: "What is your target audience's technical sophistication level?"
   - ❌ BAD: "How comfortable are your customers with using technology?" → NOT RELEVANT - Do not ask about technology comfort level

2. **KEEP QUESTIONS SHORT - MAXIMUM 10-12 WORDS**
   - Questions should be brief and direct
   - Cut out any unnecessary words
   - ❌ BAD: "How do you typically work with clients on web development projects?"
   - ✅ GOOD: "How do you work with clients?"
   - ❌ BAD: "What are the primary business goals for your development agency in the next 12-24 months?"
   - ✅ GOOD: "What service does your business provide?"

3. **BE WARM AND PROFESSIONAL - NOT EXPLANATORY**
   - Write as if you're having a friendly conversation with a colleague
   - Use natural, conversational language
   - DON'T explain concepts or provide context - just ask the question directly
   - Avoid corporate speak, jargon, or technical terms
   - Make questions feel approachable and non-intimidating
   - ❌ BAD: "When it comes to your client relationships, how would you characterize the typical engagement model?"
   - ✅ GOOD: "How do you work with clients?"

4. **EXTRACT TECHNICAL INFO BEHIND THE SCENES**
   - The question text should be simple and friendly
   - The technical mapping happens in your reasoning and intelligence extraction
   - Option values can be technical (for SCOPE.md), but labels must be plain English
   - Example: Option value "enterprise_multi_phase" with label "Big projects that take months"

5. **USE SIMPLE WORDS - NO JARGON, NO EXPLANATIONS**
   - Use everyday words that anyone would understand
   - Don't use business or technical terms unless absolutely necessary
   - Don't explain what you're asking about - just ask it directly
   - ❌ BAD: "What is your content management workflow?"
   - ✅ GOOD: "Who will update your website?"
   - ❌ BAD: "Describe your customer acquisition strategy"
   - ✅ GOOD: "How do you get new customers?"

6. **QUESTION REVIEW CHECKLIST**
   Before finalizing any question, ask yourself:
   - Would my non-technical friend understand this question immediately?
   - Does this sound like something a person would naturally ask in conversation?
   - Is there any jargon, technical terms, or corporate speak I can remove?
   - Does this feel warm and friendly, or cold and clinical?
   - **Is this question short (10-12 words max)?**
   - **Am I assuming the user knows nothing about this topic?**
   - **Am I explaining things instead of just asking directly?**
   - **Can the user answer this without thinking deeply or planning ahead?**
   - **Is this about their current situation, not future goals?**
   - **Are the options clear and concrete enough to pick immediately?**
   - **Is this ONE simple question, not multiple questions combined?**
   - **Am I asking about competitive positioning or "what makes them special"? (If yes, DON'T ASK)**

7. **OPTION LABELS MUST ALSO BE PLAIN ENGLISH**
   - Options should use simple, everyday words
   - ❌ BAD: "Early-stage startups (MVP/prototype development)"
   - ✅ GOOD: "Small projects for new businesses just getting started"
   - ❌ BAD: "Enterprise-level, multi-phase projects"
   - ✅ GOOD: "Big projects that take several months to complete"

8. **AVOID QUESTIONS THAT REQUIRE DEEP THINKING OR FUTURE PLANNING**
   - Focus on CURRENT STATE, not future goals or aspirations
   - Ask about what IS, not what WILL BE or SHOULD BE
   - Questions should be answerable immediately without reflection
   - ❌ BAD: "What are the primary business goals for your development agency in the next 12-24 months?"
   - ✅ GOOD: "What service does your business provide?"
   - ❌ BAD: "What are your long-term growth objectives?"
   - ✅ GOOD: "How many customers do you have right now?"
   - ❌ BAD: "What are your strategic priorities?"
   - ✅ GOOD: "What's the main goal you want to achieve with your website?"

9. **MAKE OPTIONS CLEAR AND CONCRETE**
   - Options should be specific, tangible choices
   - Avoid vague or abstract options
   - Each option should represent a clear, distinct scenario
   - Users should be able to pick an option without hesitation

10. **ONE QUESTION AT A TIME - NO COMPOUND QUESTIONS**
   - Ask ONE simple question, not multiple questions combined
   - Keep questions short and focused on a single topic
   - ❌ BAD: "What makes your development agency special? What do you do better than other web development companies?"
   - ✅ GOOD: "What service does your business provide?"
   - ❌ BAD: "Who are your customers and what problems do they have?"
   - ✅ GOOD: "Who are your customers?"

11. **AVOID QUESTIONS ABOUT COMPETITIVE POSITIONING OR "WHAT MAKES YOU SPECIAL"**
   - Users come to Introspect to HELP them stand out - they don't need to already know how
   - Don't ask about differentiation, competitive advantages, or unique value propositions
   - Focus on factual information about their business, not strategic positioning
   - ❌ BAD: "What makes your development agency special? What do you do better than other web development companies?"
   - ❌ BAD: "How are you different from your competitors?"
   - ❌ BAD: "What's your unique selling proposition?"
   - ✅ GOOD: "What service does your business provide?"
   - ✅ GOOD: "What services do you offer?"

### EXAMPLES OF GOOD VS BAD QUESTIONS:

**BAD (Too Long/Complex):**
- "How do you typically work with clients on web development projects?"
- "What are the primary business goals for your development agency in the next 12-24 months?"
- "When it comes to your client relationships, how would you characterize the typical engagement model?"

**BAD (Too Technical/Jargon):**
- "How would you describe your typical client engagement complexity?"
- "What is your target demographic's technical proficiency?"
- "Describe your content management workflow requirements."

**BAD (Requires Deep Thinking/Future Planning):**
- "What are your long-term strategic objectives?"
- "What are your growth priorities over the next year?"

**BAD (Compound/Long Questions):**
- "What makes your development agency special? What do you do better than other web development companies?"
- "Who are your customers and what problems do they have?"
- "What services do you offer and how do you deliver them?"

**BAD (Competitive Positioning/Business Strategy):**
- "What makes your development agency special? What do you do better than other web development companies?"
- "How are you different from your competitors?"
- "What's your unique selling proposition?"
- "What makes you stand out in your industry?"

**GOOD (Short, Simple, Warm, Easy to Answer):**
- "How do you work with clients?"
- "What service does your business provide?"
- "Who are your customers?"
- "What services do you offer?"
- "How many customers do you have?"
- "What's the main goal you want to achieve with your website?"
- "Who will update your website?"
- "How do you get new customers?"

Remember: You're translating technical requirements into friendly questions. The user should feel like they're having a conversation, not filling out a technical form. Questions should be about their CURRENT situation, not future plans. Make it easy - users should be able to answer immediately without thinking too hard. 

**CRITICAL RULES:**
- Keep questions SHORT (10-12 words maximum)
- Use SIMPLE WORDS - assume the user knows nothing
- Be DIRECT - don't explain, just ask
- Be WARM and PROFESSIONAL - friendly but not casual
- Keep questions SINGLE-FOCUSED - one question at a time
- Never ask about competitive positioning or "what makes you special" - users come to Introspect to help them figure that out

---

## CRITICAL: WHEN ASKING FOR BRAND MATERIALS (Section 5: Brand Assets & Identity)

**When gathering brand materials/logos/design assets:**

Use this EXACT format:
- **Question text:** "Do you have brand materials you want to share?"
- **Input type:** "file_upload" (special type for file uploads)
- **No options:** Do NOT provide checkbox or radio options - just show file upload interface
- **Helper text:** Optional, can be something like "Upload logos, brand colors, design files, or any other materials you have"

**Example JSON structure:**
{
  "question": {
    "id": "brand_materials",
    "text": "Do you have brand materials you want to share?",
    "inputType": "file_upload",
    "helperText": "Upload logos, brand colors, design files, or any other materials you have",
    "category": "brand_assets",
    "scope_section": "Section 5: Brand Assets & Identity",
    "scope_requirement": "Existing brand assets"
  }
}

**Extract file information from response:**
- Store in intelligence as: hasBrandMaterials: true/false
- File names and details will be included in the answer text
- Users can skip this question if they don't have materials

**DO NOT:**
- ❌ Use checkbox options like "I have a logo", "I have brand colors", etc.
- ❌ Use radio buttons
- ❌ Ask "What brand materials do you have ready to use?" (too specific, implies options)

**DO:**
- ✅ Ask "Do you have brand materials you want to share?"
- ✅ Use inputType: "file_upload"
- ✅ Allow users to upload files or skip
- ✅ Continue button should always be enabled (even with no files)

---

## CRITICAL: WHEN ASKING FOR WEBSITE REFERENCES (Section 9: Design Direction)

**When gathering design references/inspiration websites:**

Use this EXACT format:
- **Question text:** "Can you provide examples of websites you admire?"
- **Helper text:** "copy/paste website links below"
- **Input type:** "textarea" (NOT checkbox or radio)
- **No options:** Do NOT provide multiple choice options - users should paste URLs directly
- **Placeholder:** Optional, but can be something like "https://example.com" or "Paste website URLs here, one per line"

**Example JSON structure:**
{
  "question": {
    "id": "design_references",
    "text": "Can you provide examples of websites you admire?",
    "inputType": "textarea",
    "helperText": "copy/paste website links below",
    "placeholder": "Paste website URLs here, one per line",
    "category": "design",
    "scope_section": "Section 9: Design Direction",
    "scope_requirement": "Design references/inspiration"
  }
}

**Extract URLs from response:**
- Parse the user's textarea response to extract URLs
- Store in intelligence as: designReferences: ["url1", "url2", ...] or inspirationReferences: ["url1", "url2", ...]
- Users can paste multiple URLs separated by newlines, commas, or spaces

**DO NOT:**
- ❌ Use checkbox options like "Simple, clean design websites"
- ❌ Use radio buttons
- ❌ Ask "Can you share websites that match your brand's style?" (too specific)
- ❌ Provide predefined categories - let users provide their own examples

**DO:**
- ✅ Ask "Can you provide examples of websites you admire?"
- ✅ Use textarea input type
- ✅ Include helperText: "copy/paste website links below"
- ✅ Allow users to paste multiple URLs freely

---

## RESPONSE FORMAT:

You MUST respond with valid JSON matching this structure:

{
  "action": "ask_question" | "validate_understanding" | "recommend_features" | "complete",
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
    "questions_in_section": 0,
    "within_depth_limit": true,
    "decision": "ask_question"
  },
  "content": {
    "question": {
      "id": "target_business_type",
      "text": "What types of businesses are you trying to reach?",
      "inputType": "checkbox",
      "options": [
        { "value": "service", "label": "Businesses that provide services (like consulting or agencies)" },
        { "value": "product", "label": "Businesses that make or sell products" },
        { "value": "ecommerce", "label": "Online stores" },
        { "value": "professional", "label": "Professional services (like lawyers or accountants)" },
        { "value": "other", "label": "Something else", "allowText": true }
      ],
      "category": "business_context"
    }
  },
  // Example with helperText for URL input:
  // "content": {
  //   "question": {
  //     "id": "design_references",
  //     "text": "Can you provide examples of websites you admire?",
  //     "inputType": "textarea",
  //     "helperText": "copy/paste website links below",
  //     "placeholder": "Paste website URLs here, one per line",
  //     "category": "design",
  //     "scope_section": "Section 9: Design Direction"
  //   }
  // },
  "intelligence": {
    // Extracted data points from conversation
    // CRITICAL: When user answers a business/company name question, extract it as:
    // "businessName": "user's answer"
    // This is essential for Section 3 (Client Information) and Section 4 (Business Context)
  },
  "progress": {
    "percentage": 45,
    "scope_sections_complete": ["Section 1", "Section 2", "Section 3"],
    "scope_sections_in_progress": ["Section 4"],
    "scope_sections_remaining": ["Section 5", "Section 6", "Section 7", "Section 8", "Section 9", "Section 10", "Section 11", "Section 12", "Section 13", "Section 14"]
  }
}

Remember:
- EVERY question must serve a SCOPE.md section
- ALWAYS reference SCOPE.md requirements in sufficiency evaluation
- NEVER ask questions whose answers don't affect SCOPE.md content
- STOP when all 14 SCOPE.md sections can be written completely
- Track progress by SCOPE.md sections, not arbitrary question counts
- **CRITICAL: Maximum 1 question per subsection. Maximum 2 questions per section. After reaching these limits, move to the next section/subsection.**
- **CRITICAL: Before asking any question, check if the information already exists in the intelligence object - DO NOT ask about information that's already been gathered**
- **CRITICAL: If targetAudience exists in intelligence, DO NOT ask about customers/audience - mark it as satisfied (✓)**
- **CRITICAL: If primaryGoal exists in intelligence, DO NOT ask about goals - mark it as satisfied (✓)**
- **CRITICAL: If valueProposition or uniqueValue exists in intelligence, DO NOT ask about services/value - mark it as satisfied (✓)**
- **CRITICAL: NEVER ask duplicate or similar questions - always check previously asked questions before generating a new one**
- **CRITICAL: NEVER ask questions about topics already covered - check the "TOPICS ALREADY COVERED" list**
- **CRITICAL: If services information is already in intelligence, DO NOT ask about services again**
- **CRITICAL: If you've asked about services, DO NOT ask similar questions like "How do you help...", "What problems do you solve...", "What challenges...", or "What value do you provide..." - these are semantically the same question**
- **CRITICAL: NEVER ask questions about business history, tenure, founding dates, or background - these don't contribute to SCOPE.md**
- **CRITICAL: Keep questions SHORT (10-12 words maximum) - cut out unnecessary words**
- **CRITICAL: Use SIMPLE WORDS - assume user knows nothing about web development, business, or technology**
- **CRITICAL: Be DIRECT - don't explain concepts, just ask the question directly**
- **CRITICAL: Every question MUST be in plain English, warm and friendly - no jargon, no technical terms, no corporate speak**
- **CRITICAL: Questions must focus on CURRENT state, not future goals - users should answer immediately without deep thinking**
- **CRITICAL: ONE simple question at a time - no compound questions**
- **CRITICAL: Never ask about competitive positioning or "what makes you special" - users come to Introspect to help them figure that out**
- **CRITICAL: NEVER ask about technology comfort level or technical sophistication of target audience - this is NOT relevant to SCOPE.md requirements**
`

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        {
          error: 'Configuration error',
          details: 'ANTHROPIC_API_KEY environment variable is not set',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      conversation,
      intelligence,
      websiteType,
      questionCount,
      foundation,
      currentQuestion,
    } = body

    // Validate required fields
    if (!websiteType) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: 'websiteType is required',
        },
        { status: 400 }
      )
    }

    // Build conversation history for Claude
    // Convert Message[] format to Claude API format
    const messages = (conversation || []).map((msg: any) => {
      // For user messages with question context, include the question that was answered
      if (msg.role === 'user' && msg.metadata?.questionText) {
        return {
          role: 'user',
          content: `Q: ${msg.metadata.questionText}\nA: ${msg.content}`,
        }
      }
      return {
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
      }
    })

    // Extract all previously asked questions to prevent duplicates
    const askedQuestions: string[] = []
    const askedQuestionTopics: Set<string> = new Set()
    const questionsBySection: Record<string, number> = {} // Track questions per SCOPE.md section
    const questionsBySubsection: Record<string, number> = {} // Track questions per subsection
    
    conversation?.forEach((msg: any) => {
      if (msg.metadata?.questionText) {
        const questionText = msg.metadata.questionText.toLowerCase().trim()
        askedQuestions.push(questionText)
        
        // Track which SCOPE.md section this question was for
        const section = msg.metadata.questionCategory || msg.metadata.scopeSection || 'unknown'
        questionsBySection[section] = (questionsBySection[section] || 0) + 1
        
        // Extract subsection from question category or scope section
        const subsection = msg.metadata.scopeRequirement || section
        questionsBySubsection[subsection] = (questionsBySubsection[subsection] || 0) + 1
        
        // Extract key topics from questions to detect semantic duplicates
        // Check for common question patterns
        if (questionText.includes('service') || questionText.includes('offer') || questionText.includes('provide') ||
            questionText.includes('help') || questionText.includes('solve') || questionText.includes('challenge') ||
            questionText.includes('problem') || questionText.includes('value') || questionText.includes('benefit')) {
          askedQuestionTopics.add('services')
        }
        if (questionText.includes('customer') || questionText.includes('client') || questionText.includes('audience') ||
            questionText.includes('who') && (questionText.includes('target') || questionText.includes('reach')) ||
            questionText.includes('age range') || questionText.includes('typical customer')) {
          askedQuestionTopics.add('customers')
        }
        if (questionText.includes('comfortable') && questionText.includes('technology') ||
            questionText.includes('comfortable') && questionText.includes('tech') ||
            questionText.includes('technical') && (questionText.includes('sophistication') || questionText.includes('level')) ||
            questionText.includes('technology') && (questionText.includes('comfort') || questionText.includes('comfortable'))) {
          askedQuestionTopics.add('technology_comfort')
        }
        if (questionText.includes('goal') || questionText.includes('objective') || questionText.includes('purpose') ||
            questionText.includes('main thing') || questionText.includes('primary')) {
          askedQuestionTopics.add('goals')
        }
        if (questionText.includes('logo') || questionText.includes('brand') || questionText.includes('design material') ||
            questionText.includes('existing') && questionText.includes('design') ||
            questionText.includes('brand material') || questionText.includes('share') && questionText.includes('brand') ||
            questionText.includes('upload') && (questionText.includes('logo') || questionText.includes('brand'))) {
          askedQuestionTopics.add('brand_assets')
        }
        if (questionText.includes('content') || questionText.includes('update') || questionText.includes('maintain') ||
            questionText.includes('who will') && questionText.includes('update')) {
          askedQuestionTopics.add('content')
        }
        if (questionText.includes('feature') || questionText.includes('functionality') || questionText.includes('need') ||
            questionText.includes('want') && questionText.includes('website')) {
          askedQuestionTopics.add('features')
        }
      }
    })
    
    // Also include current question if it exists (hasn't been answered yet)
    if (currentQuestion?.text) {
      const questionText = currentQuestion.text.toLowerCase().trim()
      askedQuestions.push(questionText)
      
      // Track current question's section
      const section = currentQuestion.category || currentQuestion.scope_section || 'unknown'
      questionsBySection[section] = (questionsBySection[section] || 0) + 1
      
      // Extract topics from current question too
      if (questionText.includes('service') || questionText.includes('offer') || questionText.includes('provide') ||
          questionText.includes('help') || questionText.includes('solve') || questionText.includes('challenge') ||
          questionText.includes('problem') || questionText.includes('value') || questionText.includes('benefit')) {
        askedQuestionTopics.add('services')
      }
      if (questionText.includes('customer') || questionText.includes('client') || questionText.includes('audience') ||
          questionText.includes('who') && (questionText.includes('target') || questionText.includes('reach')) ||
          questionText.includes('age range') || questionText.includes('typical customer')) {
        askedQuestionTopics.add('customers')
      }
      if (questionText.includes('logo') || questionText.includes('brand') || questionText.includes('design material') ||
          questionText.includes('brand material') || questionText.includes('share') && questionText.includes('brand') ||
          questionText.includes('upload') && (questionText.includes('logo') || questionText.includes('brand'))) {
        askedQuestionTopics.add('brand_assets')
      }
      if (questionText.includes('comfortable') && questionText.includes('technology') ||
          questionText.includes('comfortable') && questionText.includes('tech') ||
          questionText.includes('technical') && (questionText.includes('sophistication') || questionText.includes('level')) ||
          questionText.includes('technology') && (questionText.includes('comfort') || questionText.includes('comfortable'))) {
        askedQuestionTopics.add('technology_comfort')
      }
    }
    
    // Check if services/value proposition information is already in intelligence
    const hasServicesInfo = intelligence?.services || intelligence?.servicesOffered || 
                           intelligence?.serviceTypes || intelligence?.businessServices ||
                           intelligence?.valueProposition || intelligence?.howYouHelp ||
                           intelligence?.problemsSolved || intelligence?.benefits ||
                           (intelligence?.primaryService && intelligence.primaryService !== '')
    
    // Check if customer/audience information is already in intelligence
    const hasCustomerInfo = intelligence?.targetAudience || intelligence?.customerType ||
                           intelligence?.clientType || intelligence?.audience ||
                           (intelligence?.targetAudience && intelligence.targetAudience !== '')
    
    // Check if brand materials/assets have already been provided
    const hasBrandMaterials = intelligence?.hasBrandMaterials || intelligence?.hasLogo || 
                             intelligence?.logo || intelligence?.brandMaterials ||
                             (conversation && conversation.some((msg: any) => 
                               msg.role === 'user' && 
                               (msg.content.toLowerCase().includes('uploaded files') || 
                                msg.content.toLowerCase().includes('logo') ||
                                msg.metadata?.questionText?.toLowerCase().includes('brand material'))))
    
    // Count questions asked for Section 4 (Business Context)
    const section4Questions = questionsBySection['business_context'] || questionsBySection['section4'] || 0
    const targetAudienceQuestions = questionsBySubsection['target_audience'] || 
                                    questionsBySubsection['audience'] || 0
    
    // Check if the last user message was answering a business name question
    const lastUserMessage = conversation && conversation.length > 0 
      ? conversation[conversation.length - 1]
      : null
    const isAnsweringBusinessName = lastUserMessage?.role === 'user' && 
      (askedQuestions.some(q => q.toLowerCase().includes('name of your business') || 
                                q.toLowerCase().includes('name of your project') ||
                                q.toLowerCase().includes('name of your organization') ||
                                q.toLowerCase().includes('name of your portfolio') ||
                                q.toLowerCase().includes('what\'s the name') ||
                                q.toLowerCase().includes('what is the name')))

    // Build foundational context
    const foundationContext = foundation ? `
Foundation Data (from initial form):
- Name: ${foundation.userName || 'Not provided'}
- Email: ${foundation.userEmail || 'Not provided'}
- Phone: ${foundation.userPhone || 'Not provided'}
- Website Type: ${foundation.websiteType || websiteType}
` : `
Foundation Data:
- Website Type: ${websiteType}
`

    // If this is the first question (no conversation history), provide initial context
    let contextMessage = ''
    if (messages.length === 0) {
      // Check if business name is already known
      const hasBusinessName = intelligence?.businessName || intelligence?.companyName
      
      if (!hasBusinessName) {
        // FIRST QUESTION: Ask for business name before any other business context questions
        contextMessage = `
${foundationContext}

This is the START of the conversation. The user has completed foundation questions.

SCOPE.md sections 2 (Project Classification) and 3 (Client Information) are already complete from foundation data.

**CRITICAL: The business/company name is missing and MUST be asked FIRST before any other business context questions.**

Your task: Ask for the business/company name as the FIRST question. This is essential context that will be used throughout the conversation.

Generate a question to ask for the business/company name. The question should:
1. Reference the website type naturally (e.g., "What's the name of your business?" for business websites, "What's the name of your project?" for project websites)
2. Use inputType: "text" (not multiple choice - names are unique)
3. Be SHORT (10-12 words max)
4. Use SIMPLE WORDS - assume user knows nothing
5. Be DIRECT - don't explain, just ask
6. Be written in plain English, warm and friendly

Example questions:
- For business websites: "What's the name of your business?"
- For personal/portfolio: "What's your name or the name of your portfolio?"
- For project/campaign: "What's the name of your project?"
- For nonprofit: "What's the name of your organization?"

Respond with valid JSON matching the required format.
`
      } else {
        // Business name exists, proceed with normal first question
        contextMessage = `
${foundationContext}

This is the START of the conversation. The user has completed foundation questions.

SCOPE.md sections 2 (Project Classification) and 3 (Client Information) are already complete from foundation data.
Business name: ${hasBusinessName}

Your task: Determine which SCOPE.md section needs information next. Since this is the beginning, you should start with Section 4: Business Context.

Generate the FIRST question to gather business context information. The question should:
1. Reference the website type naturally
2. Have 3-6 smart options based on the website type
3. Include "Something else" as the last option
4. Serve Section 4: Business Context requirements
5. **CRITICAL: Be SHORT (10-12 words max) - cut out unnecessary words**
6. **CRITICAL: Use SIMPLE WORDS - assume user knows nothing about web development**
7. **CRITICAL: Be DIRECT - don't explain, just ask the question**
8. **CRITICAL: Be written in plain English, warm and friendly - no jargon or technical terms**
9. **CRITICAL: Focus on CURRENT state, not future goals - users should answer immediately without thinking**
10. **CRITICAL: ONE simple question only - no compound questions**
11. **CRITICAL: Never ask about competitive positioning or "what makes you special"**

Respond with valid JSON matching the required format.
`
      }
    } else {
      // Check if business name is still missing (shouldn't happen, but safety check)
      const hasBusinessName = intelligence?.businessName || intelligence?.companyName
      
      contextMessage = `
${foundationContext}

Current conversation state:
- Questions Asked: ${questionCount || 0}
- Intelligence Gathered: ${JSON.stringify(intelligence || {}, null, 2)}
${!hasBusinessName ? '\n**CRITICAL: Business/company name is still missing. Ask for it before other business context questions.**' : ''}
${isAnsweringBusinessName && !hasBusinessName ? '\n**CRITICAL: The user just answered a business/company name question. You MUST extract the business name from their answer and include it in the intelligence object as "businessName". DO NOT ask for it again.**' : ''}

**PREVIOUSLY ASKED QUESTIONS (DO NOT ASK SIMILAR QUESTIONS):**
${askedQuestions.length > 0 ? askedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'None yet'}

**TOPICS ALREADY COVERED (DO NOT ASK ABOUT THESE TOPICS AGAIN):**
${askedQuestionTopics.size > 0 ? Array.from(askedQuestionTopics).map(topic => `- ${topic}`).join('\n') : 'None yet'}
${hasServicesInfo ? '\n**CRITICAL: Services/value proposition information is already in intelligence. DO NOT ask about services, how you help, what problems you solve, or value proposition again.**' : ''}
${hasCustomerInfo ? '\n**CRITICAL: Customer/audience information is already in intelligence (targetAudience: ' + (intelligence?.targetAudience || 'set') + '). DO NOT ask about customers, clients, audience, or target audience again.**' : ''}
${hasBrandMaterials ? '\n**CRITICAL: Brand materials/assets have already been provided. DO NOT ask about brand materials, logos, or design assets again - mark Section 5 as complete or move to the next section.**' : ''}
${askedQuestionTopics.has('brand_assets') ? '\n**CRITICAL: You have already asked about brand materials/assets. DO NOT ask similar questions like "Do you have brand materials?", "Do you have a logo?", or "What brand materials do you have?" - move to the next topic.**' : ''}
${askedQuestionTopics.has('services') ? '\n**CRITICAL: You have already asked about services/value proposition/how they help. DO NOT ask similar questions like "How do you help...", "What problems do you solve...", "What challenges...", or "What value do you provide..." - move to the next topic.**' : ''}
${askedQuestionTopics.has('customers') ? '\n**CRITICAL: You have already asked about customers/audience. DO NOT ask similar questions like "Who are your customers?", "What age range are your clients?", "Who are your typical customers?", or "Who do you serve?" - move to the next topic.**' : ''}
${askedQuestionTopics.has('technology_comfort') ? '\n**CRITICAL: Technology comfort level questions are NOT RELEVANT to SCOPE.md requirements. DO NOT ask about technology comfort, technical sophistication, or how comfortable customers are with technology.**' : ''}
${targetAudienceQuestions >= 1 ? '\n**CRITICAL: You have already asked ' + targetAudienceQuestions + ' question(s) about target audience. DO NOT ask about customers/audience again - move to the next subsection.**' : ''}
${section4Questions >= 2 ? '\n**CRITICAL: You have already asked ' + section4Questions + ' question(s) for Section 4: Business Context. Maximum 2 questions per section. Move to the next section unless there is a CRITICAL gap.**' : ''}

Based on this conversation history and current intelligence, determine:
1. Which SCOPE.md section needs information next
2. Whether you have sufficient information to write that section
3. If insufficient, generate the next question with 3-6 smart options
${!hasBusinessName && !isAnsweringBusinessName ? '4. **CRITICAL: If business name is missing, ask for it FIRST before other business context questions**' : isAnsweringBusinessName ? '4. **CRITICAL: Extract the business name from the user\'s answer and include it in the intelligence object as "businessName". Then proceed to the next question.**' : '4. **CRITICAL: Keep question SHORT (10-12 words max) - cut out unnecessary words**'}
5. **CRITICAL: Keep question SHORT (10-12 words max) - cut out unnecessary words**
6. **CRITICAL: Use SIMPLE WORDS - assume user knows nothing about web development**
7. **CRITICAL: Be DIRECT - don't explain, just ask the question**
8. **CRITICAL: Ensure the question is in plain English, warm and friendly - no jargon or technical terms**
9. **CRITICAL: Focus on CURRENT state, not future goals - users should answer immediately without thinking**
10. **CRITICAL: ONE simple question only - no compound questions**
11. **CRITICAL: Never ask about competitive positioning or "what makes you special"**
12. **CRITICAL: DO NOT ask questions similar to ones already asked - check the "PREVIOUSLY ASKED QUESTIONS" list above**
13. **CRITICAL: DO NOT ask about topics already covered - check the "TOPICS ALREADY COVERED" list above**
14. **CRITICAL: If services information is already in intelligence, DO NOT ask about services again - move to the next topic**
15. **CRITICAL: If customer/audience information is already in intelligence (targetAudience exists), DO NOT ask about customers/audience again - move to the next topic**
16. **CRITICAL: Maximum 1 question per subsection (e.g., target audience, primary goal). Maximum 2 questions per SCOPE.md section. After reaching these limits, move to the next section/subsection.**
17. **CRITICAL: If "services" topic is already covered, DO NOT ask similar questions like "How do you help...", "What problems do you solve...", "What challenges...", or "What value do you provide..." - these are all asking about the same thing**
18. **CRITICAL: If "customers" topic is already covered, DO NOT ask similar questions like "Who are your customers?", "What age range are your clients?", "Who are your typical customers?", or "Who do you serve?" - these are all asking about the same thing**
19. **CRITICAL: NEVER ask about technology comfort level, technical sophistication, or how comfortable customers/target audience are with technology - this is NOT relevant to SCOPE.md requirements**

Respond with valid JSON matching the required format.
`
    }

    // Call Claude API
    // Using Claude Haiku 3.5 (claude-3-5-haiku-20241022) for cost optimization
    // See: https://docs.claude.com/en/docs/about-claude/models/overview
    let response
    try {
      response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022', // Claude Haiku - cost-optimized model
        max_tokens: 4096,
        system: CLAUDE_SYSTEM_PROMPT_V3_2,
        messages: [
          ...messages,
          {
            role: 'user',
            content: contextMessage,
          },
        ],
      })
    } catch (apiError: any) {
      console.error('Anthropic API error:', apiError)
      return NextResponse.json(
        {
          error: 'Claude API error',
          details: apiError.message || 'Failed to communicate with Claude API',
          status: apiError.status,
        },
        { status: 500 }
      )
    }

    // Extract JSON from Claude's response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Parse Claude's JSON response
    let claudeResponse
    try {
      // Claude may wrap JSON in markdown code blocks or include text before/after
      const text = content.text.trim()
      
      // Try to extract JSON from markdown code blocks first
      let jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
      let jsonText = jsonMatch ? jsonMatch[1] : text
      
      // If no code blocks, try to find JSON object in the text
      if (!jsonMatch) {
        // Look for JSON object pattern: { ... }
        const jsonObjectMatch = text.match(/\{[\s\S]*\}/)
        if (jsonObjectMatch) {
          jsonText = jsonObjectMatch[0]
        }
      }
      
      // Clean up the JSON text - remove any leading/trailing text
      jsonText = jsonText.trim()
      
      // Try to parse
      claudeResponse = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      console.error('Parse error:', parseError)
      throw new Error(`Invalid JSON response from Claude: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`)
    }

    // Validate response structure
    if (!claudeResponse.action || !claudeResponse.sufficiency_evaluation) {
      throw new Error('Invalid response structure from Claude')
    }

    return NextResponse.json(claudeResponse)
  } catch (error) {
    console.error('Claude orchestration error:', error)
    return NextResponse.json(
      {
        error: 'Failed to orchestrate conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

