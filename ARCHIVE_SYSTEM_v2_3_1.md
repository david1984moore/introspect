# Archive System Documentation v2.3.1

**Self-archiving system for token optimization, infinite scalability, and intelligent handoffs**

---

## 🎯 Overview

The archive system maintains constant ~3.4K token usage regardless of project age by automatically moving old content to timestamped archive files at 200-line thresholds. Integrated with pattern detection to prevent wasteful repetition through structured handoffs.

### Core Principles
- **Token Efficient:** Active files stay <800 tokens
- **Fully Accessible:** Archives available on-demand
- **Self-Managing:** Automatic triggers
- **Transparent:** User doesn't see retrieval
- **Intelligent:** Detects when stuck and creates handoffs

---

## 📁 Archive Structure

```
project/
├── .cursorrules.md      # AI guide (~2.1K tokens)
├── STATUS.md            # Current state (<800 tokens)
├── SCOPE.md             # Boundaries (<600 tokens)
├── archives/            # Historical content
│   ├── STATUS_20241116_143022.md
│   ├── STATUS_20241115_091500.md
│   ├── SCOPE_20241114_160000.md
│   └── [older archives...]
└── handoffs/            # Confer documents (NEW!)
    ├── CONFER_20241117_093000.md
    └── [older handoffs...]
```

---

## 🔄 How It Works

### Automatic Triggers

**MANDATORY checks during:**

1. **`/init` command**
   - Always runs (never skipped)
   - Archives before showing options
   - Initializes pattern detection
   - Ensures clean start

2. **`/save` command**
   - Always runs (never skipped)
   - Archives before saving progress
   - Resets pattern counters
   - Maintains efficiency

3. **`/archive` command**
   - Manual trigger
   - Proactive cleanup
   - Run anytime

4. **`/confer` command (NEW)**
   - Triggered manually or automatically
   - After 3 failed attempts
   - Creates handoff document
   - Preserves problem context

### Archive Process

```bash
1. Detect: Check line count (wc -l)
2. Create: mkdir -p archives
3. Backup: cp STATUS.md archives/STATUS_YYYYMMDD_HHMMSS.md
4. Truncate: Keep only essentials
5. Update: Add archive reference to header
6. Confirm: Show visual status
```

### Handoff Process (NEW)

```bash
1. Detect: Pattern recognition (3+ attempts)
2. Create: mkdir -p handoffs
3. Generate: CONFER_YYYYMMDD_HHMMSS.md
4. Include: Problem, attempts, stack, errors, code
5. Save: Self-contained document
6. Link: Provide download link
```

---

## 📊 Visual Indicators

### Progress Bars

Every response shows:
```
STATUS.md: 47/200 lines  [▓░░░░░░░░░] 24% ✓
STATUS.md: 187/200 lines [▓▓▓▓▓▓▓▓▓░] 94% ⚠️
STATUS.md: 212/200 lines [▓▓▓▓▓▓▓▓▓▓] 106% 🚨
Pattern: 3 attempts detected 🤝
```

### Status Symbols
- ✓ Healthy (<180 lines)
- ⚠️ Warning (180-200 lines OR patterns detected)
- 🚨 Archiving now (>200 lines)
- 🤝 Handoff suggested (3+ attempts)
- 🔍 Pattern detected

---

## 📋 What Gets Preserved

### STATUS.md Keeps:
- Current task (line 1)
- Next 5 queued tasks
- Current session only
- Last 5 decisions
- Active blockers
- Current stats
- **Pattern detection counters**

### STATUS.md Archives:
- All completed tasks
- Historical sessions
- Old decisions
- Resolved blockers
- Past implementations
- **Historical pattern data**

### SCOPE.md Keeps:
- Active IN SCOPE items
- Current OUT OF SCOPE
- Active boundaries
- Current standards

### SCOPE.md Archives:
- Completed features
- Historical changes
- Old boundaries
- Past decisions

### Handoff Documents Include (NEW):
- Problem summary
- Goal statement
- Attempts log (chronological)
- Technical stack details
- Complete error logs
- Relevant code snippets
- File structure (if needed)
- Current STATUS.md snapshot
- Session metrics

---

## 🤖 AI Access Pattern

### For Archives
When user asks about past work:

```python
1. Check header for archive location
2. Use: view /archives/STATUS_20241115_091500.md
3. Read content
4. Synthesize answer
5. Respond naturally (don't mention retrieval)
```

### For Handoffs (NEW)
When creating handoff:

```python
1. Collect current context
2. Document all attempts
3. Format for portability
4. Save to handoffs/CONFER_YYYYMMDD_HHMMSS.md
5. Provide download link
6. Ready for fresh AI analysis
```

**Transparent to user** - they just get the answer or handoff

---

## 🔍 Pattern Detection Integration (NEW)

### What Gets Tracked
- Task attempt counts
- Error occurrence frequency
- Approach variations tried
- Token usage spikes
- Circular dependencies

### Thresholds
- **3 attempts** → Suggest /confer
- **5 attempts** → Auto-trigger /confer
- **>5K tokens** → Immediate /confer suggestion

### Storage
Pattern data maintained in:
- Active: STATUS.md (current counters)
- Historical: Archives (past patterns)
- Analysis: Handoff documents (complete context)

---

## 💡 Archive Example

### Before (523 lines):
```markdown
# Project Status
**Archive Count:** 2
**Line Count:** 523 / 200

[Hundreds of lines of old sessions...]
```

Visual: `[▓▓▓▓▓▓▓▓▓▓] 261% 🚨`

### Trigger:
```
User: /init

AI: 🚨 Archiving required...
    ✓ Created archives/STATUS_20241116_143022.md
    ✓ Reduced to 47 lines
    ✓ Updated references
    ✓ Pattern detection reset
```

### After (47 lines):
```markdown
# Project Status
**Archive Count:** 3
**Archive Location:** archives/STATUS_20241116_143022.md
**Line Count:** 47 / 200
**Pattern Count:** 0

[Only current work...]
```

Visual: `[▓░░░░░░░░░] 24% ✓`

---

## 🤝 Handoff Example (NEW)

### Trigger:
```
User: /next
[Third failed attempt detected]

AI: 🔍 Pattern detected: 3 attempts at current task
    
    Suggestion: /confer to create handoff document
```

### Creation:
```
User: /confer

AI: 🤝 Creating Handoff Document
    
    ✓ Problem summary captured
    ✓ 3 attempts documented
    ✓ Stack: Next.js 14, TypeScript, Tailwind
    ✓ 2 unique errors compiled
    ✓ Code examples preserved
    
    📄 Created: handoffs/CONFER_20241117_093000.md
    🔗 Download: [Link]
```

### Document Structure:
```markdown
# Handoff Document - CONFER_20241117_093000

## Problem Summary
[Clear, concise problem description]

## Goal
[What we're trying to achieve]

## Attempts Log
1. [First approach - what failed]
2. [Second approach - what failed]
3. [Third approach - what failed]

## Technical Stack
- Next.js 14.0.3
- TypeScript 5.2.2
- [etc...]

## Errors Encountered
[Complete error logs]

## Relevant Code
[Code snippets with context]

## Current State
[STATUS.md snapshot]
```

---

## 📈 Token Impact

### Without Archiving:
```
Week 1:  3,400 tokens
Week 2:  5,700 tokens (+68%)
Week 4:  8,200 tokens (+141%)
Week 8: 12,500 tokens (+268%)
```

### With Archiving:
```
Week 1:  3,400 tokens
Week 2:  3,400 tokens (flat)
Week 4:  3,400 tokens (flat)
Week 52: 3,400 tokens (flat!)
```

### With Pattern Detection (NEW):
```
Stuck scenario without: 15,000+ tokens (5 attempts)
Stuck scenario with:     9,000 tokens (3 attempts + handoff)
Savings: 40% on stuck problems
```

**Total Savings:** 58% by week 4, 72% by week 8, 40% additional on stuck problems

---

## ✅ Best Practices

### DO:
- ✅ Run `/archive` at session start
- ✅ Act on ⚠️ warnings (don't wait)
- ✅ Use `/save` every 30 minutes
- ✅ Archive before major features
- ✅ Trust the system
- ✅ **Use `/confer` after 3 failed attempts**
- ✅ **Check `/pattern` when feeling stuck**

### DON'T:
- ❌ Wait for 200 lines
- ❌ Edit archive files
- ❌ Delete archives
- ❌ Skip /init or /save
- ❌ Try to disable checks
- ❌ **Keep trying same approach**
- ❌ **Ignore pattern warnings**

---

## 🚫 Common Mistakes

### Waiting Too Long
**Problem:** Files hit 500+ lines  
**Impact:** Token explosion  
**Solution:** Act on ⚠️ at 180 lines

### Editing Archives
**Problem:** Modifying archived files  
**Impact:** Corrupted history  
**Solution:** Archives are read-only

### Deleting Archives
**Problem:** Removing old archives  
**Impact:** Lost context  
**Solution:** Keep all (they're tiny ~40KB each)

### Skipping Checks
**Problem:** Trying to bypass  
**Impact:** System breaks  
**Solution:** Checks are mandatory for a reason

### Not Using /confer (NEW)
**Problem:** Spinning on same problem  
**Impact:** Token waste, no progress  
**Solution:** /confer after 3 attempts

---

## 📊 Archive Analytics

Use `/stats` to see:
```
📊 Archive Statistics

Total archives:      12
Oldest:             27 days ago
Most recent:        Today
Average frequency:   Every 2.3 days

Handoff documents:   3 (NEW!)
Last handoff:       2 hours ago
Success rate:       100% resolved

Token savings:
  Without: 8,200 tokens (estimated)
  With:    3,400 tokens (current)
  Savings: 58% reduction

Pattern prevention:
  Attempts saved: 47
  Token savings:  6,200 additional

File health:
  Never exceeded 200 lines ✓
```

---

## 🔮 The Philosophy

### Mental Model

Think of it like **RAM vs Disk vs External Help:**
- **STATUS.md** = Working memory (RAM)
- **Archives** = Long-term storage (Disk)
- **Handoffs** = External expertise (Fresh perspective)
- **200 lines** = Memory limit
- **3 attempts** = Handoff threshold
- **Archive** = Page to disk
- **Confer** = Call for help

### Why It Works

**Traditional:** Everything in one file → grows forever → breaks

**Archive System:** Hot/cold separation → constant size → scales forever

**With Handoff:** Stuck detection → structured transfer → fresh solution

### The Trade-offs

**Archive Cost:** Extra files in `/archives/`  
**Archive Benefit:** 70% token savings forever  

**Handoff Cost:** Admission of being stuck  
**Handoff Benefit:** 40% token savings + actual progress

**Result:** Clear winners

---

## 🆘 Troubleshooting

### Archive Not Triggering

**Check:**
```bash
wc -l STATUS.md    # Should be <200
grep "200" .cursorrules.md  # Should exist
```

**Fix:** Run `/archive` manually

### Can't Find Old Info

**Check:**
```bash
ls -la archives/    # List all archives
grep -r "search term" archives/  # Search
```

**Fix:** Ask AI - it will fetch automatically

### Pattern Not Detected

**Check:**
```bash
/pattern    # View current counts
/stats      # Check pattern status
```

**Fix:** Manual `/confer` always available

### Archives Too Frequent

**This is good!** More archives = better efficiency  
If truly problematic, edit threshold in .cursorrules.md

### Handoffs Not Working

**Check:**
```bash
ls -la handoffs/    # Should exist
cat handoffs/CONFER_*.md  # Should be complete
```

**Fix:** Ensure handoffs/ directory exists

---

## 📝 Header Format

Every archived file gets updated header:

```markdown
# Project Status

**Current Task:** [Active task]
**Archive Count:** 3 (last: 2024-11-16 14:30)
**Archive Location:** /archives/STATUS_20241116_143022.md
**Line Count:** 47 / 200
**Pattern Count:** 0 / 3
**Last Handoff:** /handoffs/CONFER_20241117_093000.md
```

This enables:
- Quick archive checks
- Historical reference
- Token monitoring
- Continuity tracking
- Pattern awareness
- Handoff history

---

## 🎯 Key Insights

1. **Archives are cheap** - 100 archives = ~4MB
2. **Tokens are expensive** - Save 70% forever
3. **Retrieval is automatic** - AI handles it
4. **History is preserved** - Nothing lost
5. **Scaling is infinite** - Works at any project size
6. **Patterns are detectable** - Stop spinning early
7. **Handoffs work** - Fresh perspective solves problems

---

## 📈 Expected Results

**Week 1:**
- 2-3 archives created
- Token usage flat at 3.4K
- 0-1 handoffs needed
- No manual intervention

**Month 1:**
- 10-15 archives
- Still 3.4K tokens
- 2-3 handoffs used
- Problems solved faster

**Year 1:**
- 100+ archives
- Still 3.4K tokens!
- 20+ successful handoffs
- Complete history preserved

---

**Remember:** 
- Archives are your project's memory system
- Pattern detection is your safety net
- Handoffs are your escape hatch
- Keep current work hot, historical work cold, stuck work transferred

---

**Version:** 2.3.1  
**Archive Threshold:** 200 lines  
**Pattern Threshold:** 3 attempts  
**Token Target:** 3.4K forever  
**Handoff Format:** Self-contained markdown