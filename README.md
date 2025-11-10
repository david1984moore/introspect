# Introspect V3

**AI-Powered Client Intake System** - Transform unstructured client conversations into complete technical specifications through intelligent orchestration.

**Status:** Phase 3 In Progress (Core Complete)  
**Version:** 0.1.0  
**Last Updated:** November 2025

---

## 🎯 What It Does

Introspect guides clients through an intelligent conversation to gather all information needed for a complete project specification. It uses Claude AI (Haiku 3.5) to orchestrate the conversation, asking targeted questions and tracking progress across 14 SCOPE.md sections.

**Key Features:**
- Progressive disclosure foundation form (Q1-Q4)
- AI-driven conversation orchestration with SCOPE.md-driven sufficiency evaluation
- Multiple choice question system with "Something else" fallback
- Feature selection chip interface with package recommendations
- Real-time progress tracking (14 SCOPE.md sections)
- Unified progress bar (never decreases)
- Session persistence with client-side encryption
- Start Over functionality with confirmation modal

---

## ✅ Current Status

### Phase 1: Foundation ✅ Complete
- Next.js 15.5.6 with TypeScript
- Design system (Perfect Fourth typography, 8-point grid, OKLCH colors)
- Foundation form with progressive disclosure (4 questions)
- Core UI components (Button, Input, RadioGroup, Checkbox, Dialog, Label, Textarea)

### Phase 2: State & Security ✅ Complete
- Zustand store with persistence and client-side encryption
- Business model classification state management
- Feature selection management with conflict detection
- Security utilities (encryption, rate limiting, input sanitization)
- Session management with recovery capabilities
- Cloud sync API route foundation (returns mock data - Supabase not configured)

### Phase 3: Claude Integration 🚧 In Progress
- ✅ SCOPE.md-driven orchestration (V3.2)
- ✅ Claude API integration (Haiku 3.5 for cost optimization)
- ✅ Conversation UI with question display and typing indicators
- ✅ Multiple choice question rendering (radio and checkbox)
- ✅ Feature Selection Chip Interface with visual selection
- ✅ Package recommendation display with pricing
- ✅ Progress tracking system (14-section based)
- ✅ Start Over functionality with confirmation modal
- ⏳ SCOPE.md document generation (next)
- ⏳ Testing and validation (next)

---

## 📁 Project Structure

```
introspect-v3/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── intake/
│   │   │   ├── page.tsx                # Foundation form (Q1-Q4)
│   │   │   └── conversation/
│   │   │       └── page.tsx           # AI conversation interface
│   │   └── api/
│   │       ├── claude/orchestrate/     # Claude orchestration API
│   │       └── sessions/sync/          # Session sync API (mock)
│   ├── components/
│   │   ├── ui/                         # Base UI components (7)
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── textarea.tsx
│   │   ├── FeatureChip.tsx            # Feature selection chip
│   │   ├── FeatureSelectionScreen.tsx # Feature selection interface
│   │   └── StartOverModal.tsx         # Reset confirmation
│   ├── stores/
│   │   └── conversationStore.ts       # Zustand state management
│   ├── types/                          # TypeScript definitions
│   └── lib/
│       └── security/                   # Encryption, rate limiting
├── docs/
│   ├── reference/                     # Workflow documentation
│   ├── phases/                         # Phase documentation (10 files)
│   └── APPLICREATIONS_FEATURE_LIBRARY_V1_1_COMPLETE.md
├── STATUS.md                           # Current task tracking
├── SCOPE.md                            # Project boundaries
└── archives/                          # Historical archives
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Anthropic API key (set `ANTHROPIC_API_KEY` in `.env.local`)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# ANTHROPIC_API_KEY=your_api_key_here

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

The app will be available at `http://localhost:3000`

---

## 🏗️ Architecture

**Tech Stack:**
- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **State:** Zustand with persistence and client-side encryption
- **AI:** Anthropic Claude Haiku 3.5 (`claude-3-5-haiku-20241022`) - cost-optimized model
- **Database:** Supabase package installed but **not configured** (returns mock session data)

**Design Principles:**
- Single-track architecture (one conversation path, AI adapts)
- 100% information requirement (all 14 SCOPE.md sections must complete)
- Progressive disclosure (one question at a time)
- 3-second rule (all interactions <3s or show progress)
- Jobs/Ives design (70% whitespace, systematic spacing)

**Security:**
- Client-side encryption for localStorage (XOR-based sync, AES-GCM async available)
- Input sanitization with DOMPurify
- Rate limiting utilities (foundation in place)
- Prompt injection detection

---

## 📊 Implementation Details

**Components:** 10 total
- 7 base UI components (Button, Checkbox, Dialog, Input, Label, RadioGroup, Textarea)
- 3 custom components (FeatureChip, FeatureSelectionScreen, StartOverModal)

**Pages:** 3
- Landing page (`/`)
- Foundation form (`/intake`)
- Conversation interface (`/intake/conversation`)

**API Routes:** 2
- `/api/claude/orchestrate` - Claude conversation orchestration
- `/api/sessions/sync` - Session sync (returns mock data - Supabase not configured)

**State Management:**
- Zustand store with persistence middleware
- Client-side encryption for sensitive data
- SCOPE.md section-based progress tracking (14 sections)
- Feature selection and conflict detection
- Business model classification

**Claude Integration:**
- Model: `claude-3-5-haiku-20241022` (Haiku 3.5)
- V3.2 system prompt with SCOPE.md-driven sufficiency evaluation
- Maximum 1 question per sub-topic
- Plain English questions (10-12 words max)
- Multiple choice standard (radio/checkbox based on question type)

---

## 📚 Documentation

- `SCOPE.md` - Core architectural principles
- `STATUS.md` - Current task tracking and progress
- `docs/phases/` - Detailed phase documentation (10 phase files)
- `docs/reference/` - Workflow documentation (ALIASES.md, USER_GUIDE.md, QUICK_REF.md, ARCHIVE_SYSTEM.md)
- `docs/APPLICREATIONS_FEATURE_LIBRARY_V1_1_COMPLETE.md` - Feature catalog (200+ features)

---

## 🔧 Development

**Current Focus:** SCOPE.md document generation and testing

**Code Quality:**
- TypeScript strict mode
- Zero type errors
- Zero linter errors
- Comprehensive type definitions

**Known Limitations:**
- Supabase integration not configured (session sync returns mock data)
- SCOPE.md generation not yet implemented
- PDF generation not yet implemented
- Email delivery not yet implemented

---

## 📋 Next Steps

1. **SCOPE.md Generation** - Generate complete SCOPE.md document from collected data
2. **Testing & Validation** - Comprehensive testing of conversation flow
3. **Supabase Integration** - Configure database for session persistence
4. **PDF Generation** - Client-facing PDF document creation
5. **Email Delivery** - Automated email delivery system

---

**Built with:** Next.js, TypeScript, Tailwind CSS, Zustand, Anthropic Claude API (Haiku 3.5)
