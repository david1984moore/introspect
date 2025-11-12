# Duplicate Question Prevention System - Comprehensive Analysis

**Date:** 2025-01-XX  
**Issue:** User reported being asked duplicate question "How will you manage and maintain your website's content?" despite already answering a similar question.

---

## Executive Summary

The current duplicate question prevention system has several gaps that allow semantically similar questions to be asked multiple times. The system relies primarily on:
1. Exact text matching
2. Basic semantic similarity (85% threshold)
3. Topic-based tracking (limited topics)
4. Intelligence field checking (only for 3 topics: services, customers, brand materials)

**Root Cause:** The question "How will you manage and maintain your website's content?" was not detected as a duplicate of "Who will update your website?" because:
- Different wording (manage/maintain vs update)
- Semantic similarity function is too basic (word overlap only)
- No intelligence field check for content management
- Topic detection doesn't catch "manage" as content-related

---

## Current System Architecture

### 1. Duplicate Detection Mechanism

**Location:** `src/app/api/claude/orchestrate/route.ts` (lines 1608-1633)

**How it works:**
```typescript
const isDuplicate = askedQuestions.some(askedQ => {
  // Check for exact match (case-insensitive)
  if (askedQ === normalizedQuestionText) return true
  // Check for semantic similarity (questions that are very similar)
  const similarity = calculateSimilarity(askedQ, normalizedQuestionText)
  return similarity > 0.85 // 85% similarity threshold
})
```

**Issues:**
- Only checks against previously asked questions (text matching)
- Semantic similarity function is too simplistic (word overlap only)
- 85% threshold may be too high for questions with different wording
- No check against intelligence fields to see if information already exists

### 2. Semantic Similarity Function

**Location:** `src/app/api/claude/orchestrate/route.ts` (lines 1419-1432)

**Current Implementation:**
```typescript
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.split(/\s+/).filter(w => w.length > 2)
  const words2 = str2.split(/\s+/).filter(w => w.length > 2)
  const commonWords = words1.filter(w => words2.includes(w))
  const totalWords = new Set([...words1, ...words2]).size
  return commonWords.length / totalWords
}
```

**Issues:**
- Only considers word overlap, not semantic meaning
- "manage", "maintain", "update" are different words but semantically equivalent
- Doesn't consider synonyms or related terms
- Ignores word order and context

**Example:**
- Question 1: "Who will update your website?"
- Question 2: "How will you manage and maintain your website's content?"
- Common words: ["will", "your", "website"] (3 words)
- Total unique words: ["who", "will", "update", "your", "website", "how", "you", "manage", "and", "maintain", "content"] (11 words)
- Similarity: 3/11 = 27% (below 85% threshold) ❌

### 3. Topic-Based Tracking

**Location:** `src/app/api/claude/orchestrate/route.ts` (lines 941-1093)

**Current Topics Tracked:**
- `services` - Services offered
- `customers` - Target audience/customers
- `technology_comfort` - Technology comfort level
- `goals` - Business goals
- `brand_assets` - Brand materials/assets
- `design_style` - Design aesthetic/style
- `content` - Content-related questions
- `features` - Feature questions
- `tools_integrations` - Tools and integrations

**Content Topic Detection:**
```typescript
// Check content
if (!topics.has('content')) {
  for (const keyword of topicKeywords.content) {
    if (questionText.includes(keyword)) {
      topics.add('content')
      break
    }
  }
  // Check compound content pattern
  if (!topics.has('content') && questionText.includes('who will') && questionText.includes('update')) {
    topics.add('content')
  }
}
```

**Issues:**
- Keywords: `['content', 'update', 'maintain', 'who will']`
- Missing keywords: "manage", "manage and maintain", "content management", "who will manage"
- Compound pattern only checks "who will" + "update", not "how will" + "manage/maintain"
- Once topic is marked, no further checks are made for related questions

### 4. Intelligence Field Checking

**Location:** `src/app/api/claude/orchestrate/route.ts` (lines 1247-1266)

**Currently Checked:**
- `hasServicesInfo` - Checks multiple service-related fields
- `hasCustomerInfo` - Checks audience/customer fields
- `hasBrandMaterials` - Checks brand asset fields

**Missing Checks:**
- ❌ No check for `contentReadiness`
- ❌ No check for `contentUpdateFrequency`
- ❌ No check for content management fields
- ❌ No check for "who will update" information

**Intelligence Fields Available:**
- `contentReadiness?: 'ready' | 'in_progress' | 'need_help'`
- `contentUpdateFrequency?: 'daily' | 'weekly' | 'monthly' | 'few_months' | 'rarely' | string`
- But no field for "who will manage/update" content

### 5. Context Message to Claude

**Location:** `src/app/api/claude/orchestrate/route.ts` (lines 1379-1409)

**Current Context Includes:**
- Previously asked questions list
- Topics already covered
- Sections already asked about
- Some intelligence field checks (services, customers, brand materials)

**Missing:**
- ❌ No intelligence field checks for content management
- ❌ No explicit mapping of questions to SCOPE.md sections
- ❌ No clear guidance on what questions map to which sections
- ❌ No validation that intelligence fields are populated before asking

---

## SCOPE.md Section Requirements

### Section 6: Content Strategy

**Required Information:**
1. Content Provider (who creates content)
2. Content Readiness (ready/in_progress/needs_creation)
3. Update Frequency (daily/weekly/monthly/few_months/rarely)
4. Maintenance Plan (who manages updates)

**Current Questions Asked:**
1. "Do you have content ready for your new website?" → `contentReadiness`
2. "How often will you need to make updates on your website?" → `contentUpdateFrequency`
3. "Who will update your website?" → Should map to content provider/manager
4. "How will you manage and maintain your website's content?" → DUPLICATE of #3

**Gap:** Questions 3 and 4 are semantically the same but worded differently.

---

## Root Cause Analysis

### Why the Duplicate Wasn't Caught

1. **Different Wording:**
   - Original: "Who will update your website?"
   - Duplicate: "How will you manage and maintain your website's content?"
   - Only 3 common words out of 11 total = 27% similarity (below 85% threshold)

2. **Topic Detection Missed It:**
   - "manage" and "maintain" are not in the content keywords list
   - Compound pattern only checks "who will" + "update", not "how will" + "manage"

3. **No Intelligence Field Check:**
   - No field exists for "who will update/manage content"
   - Even if answered, there's no way to check if this information exists

4. **No SCOPE.md Section Mapping:**
   - Questions aren't explicitly mapped to SCOPE.md sections
   - No validation that Section 6 requirements are met before moving on

---

## Recommendations

### Priority 1: Critical Fixes (Immediate)

#### 1.1 Enhance Semantic Similarity Detection

**Action:** Improve the `calculateSimilarity` function to handle synonyms and related terms.

**Implementation:**
```typescript
// Add synonym mapping for content management
const contentManagementSynonyms = {
  'update': ['update', 'manage', 'maintain', 'edit', 'change', 'modify'],
  'content': ['content', 'website', 'site', 'pages', 'information'],
  'who': ['who', 'how', 'what', 'which'],
  'will': ['will', 'would', 'should', 'can', 'may']
}

const calculateSimilarity = (str1: string, str2: string): number => {
  // Normalize synonyms
  const normalize = (text: string) => {
    let normalized = text.toLowerCase()
    Object.entries(contentManagementSynonyms).forEach(([key, synonyms]) => {
      synonyms.forEach(syn => {
        normalized = normalized.replace(new RegExp(`\\b${syn}\\b`, 'gi'), key)
      })
    })
    return normalized
  }
  
  const norm1 = normalize(str1)
  const norm2 = normalize(str2)
  
  // Then calculate similarity on normalized text
  // ... existing logic
}
```

#### 1.2 Add Intelligence Field Checks for Content Management

**Action:** Check intelligence fields before asking content-related questions.

**Implementation:**
```typescript
// Check if content management information exists
const hasContentManagementInfo = 
  intelligence?.contentReadiness || 
  intelligence?.contentUpdateFrequency ||
  intelligence?.contentManager ||
  intelligence?.whoWillUpdate ||
  (conversation && conversation.some((msg: any) => 
    msg.role === 'user' && 
    (msg.metadata?.questionText?.toLowerCase().includes('who will update') ||
     msg.metadata?.questionText?.toLowerCase().includes('manage') ||
     msg.metadata?.questionText?.toLowerCase().includes('maintain'))))
```

#### 1.3 Expand Content Topic Keywords

**Action:** Add more keywords to catch content management questions.

**Implementation:**
```typescript
const topicKeywords: Record<string, string[]> = {
  content: [
    'content', 'update', 'maintain', 'manage', 
    'who will', 'how will', 'what will',
    'edit', 'change', 'modify', 'content management',
    'website management', 'site management'
  ],
  // ... other topics
}
```

#### 1.4 Add Intelligence Field to SessionIntelligence

**Action:** Add field to track who will manage content.

**Implementation:**
```typescript
export interface SessionIntelligence {
  // ... existing fields
  contentManager?: 'client' | 'agency' | 'collaborative' | 'other'
  whoWillUpdate?: string // Free text if "other"
}
```

### Priority 2: Structural Improvements (Short-term)

#### 2.1 Create Question-to-SCOPE.md Section Mapping

**Action:** Create explicit mapping of questions to SCOPE.md sections.

**Implementation:**
```typescript
const SCOPE_SECTION_QUESTIONS: Record<string, {
  section: string
  requiredFields: string[]
  questions: string[]
}> = {
  'section6_content_strategy': {
    section: 'Section 6: Content Strategy',
    requiredFields: ['contentReadiness', 'contentUpdateFrequency', 'contentManager'],
    questions: [
      'Do you have content ready for your new website?',
      'How often will you need to make updates on your website?',
      'Who will update your website?',
      'How will you manage and maintain your website\'s content?'
    ]
  },
  // ... other sections
}
```

#### 2.2 Enhance Context Message with Section Requirements

**Action:** Add explicit section requirements to context message.

**Implementation:**
```typescript
// Check Section 6 requirements
const section6Complete = 
  intelligence?.contentReadiness && 
  intelligence?.contentUpdateFrequency && 
  intelligence?.contentManager

if (section6Complete) {
  contextMessage += '\n**Section 6: Content Strategy - COMPLETE (do not ask content questions)**'
} else {
  const missingFields = []
  if (!intelligence?.contentReadiness) missingFields.push('contentReadiness')
  if (!intelligence?.contentUpdateFrequency) missingFields.push('contentUpdateFrequency')
  if (!intelligence?.contentManager) missingFields.push('contentManager')
  contextMessage += `\n**Section 6: Content Strategy - Missing: ${missingFields.join(', ')}**`
}
```

#### 2.3 Improve Duplicate Detection with Section Awareness

**Action:** Check if a question maps to a section that's already complete.

**Implementation:**
```typescript
// Before asking a question, check if it maps to a completed section
const questionSection = mapQuestionToSection(questionText)
if (questionSection && scopeProgress.sections[questionSection] === 'complete') {
  // Reject question - section already complete
  return NextResponse.json({
    error: 'Section already complete',
    details: `This question maps to ${questionSection} which is already complete.`,
    action: 'reject_section_complete'
  }, { status: 400 })
}
```

### Priority 3: Long-term Enhancements

#### 3.1 Implement Question Intent Classification

**Action:** Use NLP to classify question intent and map to SCOPE.md sections.

**Benefits:**
- Better duplicate detection
- Clearer section mapping
- More accurate progress tracking

#### 3.2 Create Question Template System

**Action:** Define canonical question templates for each SCOPE.md section.

**Benefits:**
- Consistent question wording
- Easier duplicate detection
- Better user experience

#### 3.3 Add Question Validation Layer

**Action:** Validate questions against section requirements before asking.

**Benefits:**
- Prevents asking questions for completed sections
- Ensures all required information is gathered
- Better progress tracking

---

## Implementation Plan

### Phase 1: Immediate Fixes (This Session)
1. ✅ Add intelligence field checks for content management
2. ✅ Expand content topic keywords
3. ✅ Improve semantic similarity with synonyms
4. ✅ Add contentManager field to SessionIntelligence

### Phase 2: Structural Improvements (Next Session)
1. Create question-to-section mapping
2. Enhance context message with section requirements
3. Add section-aware duplicate detection

### Phase 3: Long-term Enhancements (Future)
1. Implement question intent classification
2. Create question template system
3. Add comprehensive validation layer

---

## Testing Strategy

### Test Cases for Duplicate Detection

1. **Exact Duplicate:**
   - Q1: "Who will update your website?"
   - Q2: "Who will update your website?"
   - Expected: Rejected ✅

2. **Semantic Duplicate (Current Issue):**
   - Q1: "Who will update your website?"
   - Q2: "How will you manage and maintain your website's content?"
   - Expected: Rejected (currently fails) ❌

3. **Different Topics:**
   - Q1: "Who will update your website?"
   - Q2: "What services does your business provide?"
   - Expected: Allowed ✅

4. **Intelligence Field Check:**
   - Intelligence has `contentManager: 'client'`
   - Question: "Who will update your website?"
   - Expected: Rejected (information already exists) ❌

---

## Conclusion

The duplicate question prevention system needs significant improvements to handle semantically similar questions. The current system relies too heavily on exact text matching and basic word overlap, which fails to catch questions that ask the same thing with different wording.

**Key Improvements Needed:**
1. Enhanced semantic similarity with synonyms
2. Intelligence field checks for all topics
3. Explicit question-to-section mapping
4. Section-aware duplicate detection

These improvements will ensure that users are never asked the same question twice, even if worded differently.

