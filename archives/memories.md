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

