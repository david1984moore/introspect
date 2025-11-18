# Introspect V3 - Development Memories

This file contains important development decisions, patterns, and knowledge that should be remembered across sessions.

---

## Unified Progress Bar System

**Date:** 2025-01-XX  
**Status:** Active

**CRITICAL:** Introspect uses a SINGLE UNIFIED progress bar system that tracks progress from question 1 through document generation.

**Key Points:**
- **Single Source of Truth:** `completionPercentage` from the conversation store (`src/stores/conversationStore.ts`)
- **Calculation:** `(completedSections / 14) * 100` where sections are the 14 SCOPE.md sections
- **Never Decreases:** All update points use `Math.max()` protection to ensure progress only increases
- **Unified Display:** Both intake page (`/intake`) and conversation page (`/intake/conversation`) use the same `completionPercentage` value
- **Progress Flow:**
  - Starts at 0%
  - Foundation questions complete → sections 2 & 3 → 14%
  - Conversation questions → sections 4-9 → increases incrementally
  - Feature selection → section 10 → increases
  - Remaining sections → 11-14 → reaches 100%

**Implementation Details:**
- All progress updates happen in `src/stores/conversationStore.ts`
- Section-based tracking with `scopeProgress.sections` object
- `Math.max()` protection in:
  - `setFoundation()` - initializes sections 2 & 3
  - `orchestrateNext()` - updates from Claude responses
  - `updateIntelligence()` - section-based calculation
  - `submitFeatureSelection()` - marks section 10 complete

**Deprecated:** The old `categoryProgress` and `calculateCompleteness()` function exist but are unused. All progress tracking now uses the unified section-based system.

---

## Animation System Implementation

**Date:** 2025-01-10  
**Status:** ✅ Complete

**CRITICAL:** All question types now have smooth, polished animations with proper timing and state management.

**Key Points:**
- **Unified Animation Flow:** All question types (radio, text, textarea) use the same animation sequence
- **ProcessingIndicator:** Replaced old "Thinking..." spinner with modern ProcessingIndicator component
- **Animation Phases:** `idle` → `optionSelected` → `questionExit` → `processing` → `questionEnter` → `ready` → `idle`
- **Timing:** Polished durations (600ms container, 500ms questions/options, 40px Y translation)

**Implementation Details:**
- **Animation Controller:** `src/lib/conversationAnimationState.ts` manages animation phases
- **Question Display:** `src/components/conversation/QuestionDisplay.tsx` handles entrance/exit animations
- **Timing Constants:** `src/lib/animationTimings.ts` contains all animation durations
- **Main Logic:** `src/app/intake/conversation/page.tsx` orchestrates animation triggers

**Critical Fixes:**
1. **Race Condition Fix:** Reset animation tracking when transitioning from foundational questions
2. **First Question Fix:** Always trigger animation for first question, regardless of `isTyping` state
3. **Text Question Fix:** Text/textarea questions now trigger exit animations before submitting
4. **Old Spinner Removal:** Completely removed old typing indicator, replaced with ProcessingIndicator
5. **Timing Polish:** Increased all animation durations for smoother, more noticeable transitions

**Animation Flow:**
1. User answers question → Exit animation triggers (optionSelected → questionExit)
2. Exit completes → ProcessingIndicator shows (processing phase)
3. Answer submits → API call happens during processing phase
4. New question arrives → Entrance animation triggers (questionEnter → ready → idle)
5. Question fully visible → User can interact

**Files Modified:**
- `src/app/intake/conversation/page.tsx` - Main conversation page logic
- `src/components/conversation/QuestionDisplay.tsx` - Question display component
- `src/lib/animationTimings.ts` - Animation timing constants
- `src/lib/conversationAnimationState.ts` - Animation state controller

---

## Question Card Spacing Optimization

**Date:** 2025-11-18  
**Status:** ✅ Complete

**Issue:** Question cards had excessive white space that required scrolling to view complete questions, negatively impacting user experience.

**Root Causes Identified:**
1. **Multiple Container Wrappers:** Nested containers each adding padding (`max-w-2xl` + `px-4` + `px-6 py-4`)
2. **Overly Generous Padding:** Original spacing was designed for larger displays
   - Question headers: `px-9 pt-7 pb-5` (huge padding)
   - Question body: `px-9 py-5`
   - Footer buttons: `px-9 pt-6 pb-7`
   - Checkbox questions even worse: `px-16 pt-14 pb-10`
3. **Restrictive Width Constraints:** `max-w-2xl` unnecessarily limiting card width
4. **Large Spacing Between Elements:** `space-y-3` on helper text, large gaps between options

**Solutions Implemented:**

**1. QuestionDisplay Component (`src/components/conversation/QuestionDisplay.tsx`):**
- Removed outer container wrapper (`max-w-2xl mx-auto px-4`)
- Added `max-w-4xl mx-auto` directly to card for better space utilization
- Reduced padding: `px-9` → `px-6`, `pt-7` → `pt-5`, `pb-5` → `pb-3`
- Condensed helper text margins: `mt-3 mb-3` → `mt-2 mb-1`
- Reduced button heights: `h-14` → `h-12`, `h-10` → `h-9`
- Tightened button spacing: `space-y-3` → `space-y-2.5`

**2. OptionSelector Component (`src/components/conversation/OptionSelector.tsx`):**
- Reduced option spacing: `space-y-2` → `space-y-1.5`
- Tightened option padding: `p-3` → `p-2.5`

**3. Main Conversation Page (`src/app/intake/conversation/page.tsx`):**
- Reduced container padding: `px-6 py-4` → `px-4 py-3`
- Reduced grid gap: `gap-8` → `gap-6`
- Removed restrictive `max-w-3xl mx-auto` constraint
- **Checkbox questions** (most dramatic changes):
  - Header: `px-16 pt-14 pb-10` → `px-6 pt-5 pb-3`
  - Body: `px-16 py-12` → `px-6 py-4`
  - Footer: `px-16 pt-8 pb-14` → `px-6 pt-4 pb-5`
  - Options: `space-y-6` → `space-y-3`, `space-x-5` → `space-x-3`
  - Font sizes reduced for compact layout
  - Added `max-w-4xl mx-auto` for consistency
- **File upload questions** updated to match condensed spacing

**4. Checkbox Checkmark Fix (`src/components/ui/checkbox.tsx`):**
- **Issue:** Checkmark icon didn't fill checkbox center properly
- **Solution:** Changed from fixed size (`h-4 w-4`) to responsive sizing (`h-full w-full p-0.5`)
- Added bold stroke (`strokeWidth={3}`) for better visibility
- Now scales properly with any checkbox size (works for both `h-4 w-4` and `h-5 w-5`)

**Results:**
- Questions now viewable without scrolling in most cases
- Maintained readability while dramatically reducing white space
- Consistent spacing across all question types
- Checkbox checkmarks now properly fill and are highly visible

**Files Modified:**
- `src/components/conversation/QuestionDisplay.tsx` - Question display component
- `src/components/conversation/OptionSelector.tsx` - Option selector for radio questions
- `src/app/intake/conversation/page.tsx` - Main conversation page with all question types
- `src/components/ui/checkbox.tsx` - Base checkbox component

---

