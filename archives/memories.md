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

