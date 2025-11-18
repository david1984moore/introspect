# Cursor Workflow Commands v2.3.1

**Complete command reference for the workflow system with intelligent handoff**

---

## 🎯 Command Categories

- **Tier 1: Orchestration** - AI shows options, waits
- **Tier 2: Execution** - AI acts immediately  
- **Tier 3: Development** - System automation
- **Tier 4: Safety** - Validation, correction, and handoff
- **Tier 5: Enhancements** - Additional capabilities

---

## 🚀 Tier 1: Orchestration (Show & Wait)

### `/init` - Start Session
**Behavior:**
- Loads STATUS.md and SCOPE.md
- MANDATORY archive check (never skips)
- Archives files >200 lines automatically
- Shows visual status with progress bars
- Displays current task prominently
- Initializes pattern detection
- Presents 3 action options
- **WAITS for direction**

**Output:**
```
╔═══════════════════════════════════════╗
║  CURSOR WORKFLOW v2.3.1               ║
║  Session: [DATE TIME]                 ║
╚═══════════════════════════════════════╝

📊 Context Status:
   STATUS.md: 47/200 [▓░░░░░░░░░] 24%
   Pattern Detection: Active ✓
   
🎯 Current Task: [from line 1]

⚡ Quick Actions:
   1. Continue (/next)
   2. Start server (/server)
   3. Review scope (/scope)
```

---

### `/pause` - Explain Mode
**Behavior:**
- Switches to explanation mode
- AI explains instead of implementing
- Adds [EXPLAIN MODE] indicator
- Educational focus

**Exit:** Type `/resume`

---

### `/resume` - Dual Purpose
**Two functions:**
1. **From explain mode:** Returns to execute mode
2. **After explanation:** Implements the solution immediately

---

### `/save` - Update Progress
**Behavior:**
- Updates STATUS.md
- Moves completed task to log
- Promotes next task to line 1
- MANDATORY archive check
- Resets pattern detection counters
- Shows session summary

**Critical:** Archives at 200 lines

---

### `STOP` - Emergency Help
**Behavior:**
- Full context dump
- Shows last 3 commands
- Current state explanation
- Recovery suggestions
- Option to /confer if stuck

**Use when:** Completely lost

---

## ⚡ Tier 2: Execution (Immediate Action)

### `/next` - Execute Current Task
**IMMEDIATE EXECUTION - NO OPTIONS**

**Behavior:**
1. Reads STATUS.md line 1
2. Implements complete solution
3. Shows files being modified
4. Updates STATUS.md
5. Tracks attempt count
6. Suggests next command

**Pattern Detection:** After 3 failed attempts, suggests /confer

**Output:**
```
🎯 Executing: [task]

📦 Implementation:
[Complete code here]

✓ Complete. Modified:
- file.js: Added feature
- file.css: Updated styles

⏭️ Next: /verify to test
```

---

### `/verify` - Generate Tests
**Behavior:**
- Analyzes implementation
- Creates specific test scenarios
- Identifies edge cases
- Provides test data
- References exact code

**Does NOT execute tests**

---

### `/commit` - Save to Git
**Behavior:**
1. Stages all changes
2. Generates commit message
3. Commits changes
4. **AUTO-PUSHES to origin/main**
5. Reports hash

**One command = stage + commit + push**

---

## 💻 Tier 3: Development (System Tools)

### `/server` - Dev Server
**Behavior:**
- Checks ports 3000-3010
- Kills ONLY dev processes
- Detects project type
- Starts appropriate server
- Reports URL

**Safe:** Won't kill other Node processes

---

### `/debug` - Browser Testing
**Behavior:**
- Checks server status
- Reads current task
- Opens Chrome to test URL
- Provides test checklist
- Waits for feedback

**Requires:** Server running

---

### `/archive` - Force Archive
**Behavior:**
- Checks all files
- Archives any >200 lines
- Creates timestamped backups
- Updates headers
- Reports results

**Auto-runs during:** /init, /save

---

## 🛡️ Tier 4: Safety (Validation & Handoff)

### `/scope` - Boundary Check
**Behavior:**
- Loads SCOPE.md
- Validates if IN/OUT/UNCLEAR
- Explains reasoning
- Offers alternatives

**Use:** Before new features

---

### `/confer` - Structured Handoff 🆕
**Purpose:** Create comprehensive handoff document when stuck

**Manual Trigger:** Type `/confer` when you need fresh perspective

**Auto-Trigger After:**
- 3+ attempts at same task
- 3+ occurrences of same error
- Circular dependency detected
- Token spike (>5K in response)

**Creates Document With:**
1. **Problem Summary** - Brief, clear description
2. **Goal Statement** - What we're trying to achieve
3. **Attempts Log** - What has been tried, in order
4. **Technical Stack** - Frameworks, libraries, versions
5. **Error Logs** - Complete, formatted
6. **Code Examples** - Relevant snippets with context
7. **File Structure** - If relevant
8. **Current State** - STATUS.md snapshot
9. **Session Metrics** - Time spent, tokens used

**Output Location:** `handoffs/CONFER_[TIMESTAMP].md`

**Example Output:**
```
🤝 Creating Handoff Document

⚠️ Pattern Detected: 3 failed attempts at current task

📝 Generating structured handoff...
   ✔ Problem summary captured
   ✔ Attempts documented
   ✔ Stack details included
   ✔ Errors compiled
   ✔ Code examples preserved

📄 Handoff document created:
   handoffs/CONFER_20241117_143022.md

🔗 Download: [Link to file]

Ready for external analysis.
```

---

### `/pattern` - Pattern Analysis 🆕
**Shows:**
- Attempt counts per task
- Repetition patterns detected
- Auto-trigger thresholds
- Suggestion for /confer if needed
- Option to reset counters

**Example Output:**
```
🔍 Pattern Analysis

Current Task Attempts: 3 ⚠️
Unique Errors: 2
Approaches Tried: 3
Token Average: 3.8K ⚠️

⚠️ Threshold reached: Consider /confer

Reset counters? (/pattern reset)
```

---

### `/realign` - Gentle Correction
**Behavior:**
- Reminds AI of patterns
- Corrects verbose drift
- Light touch correction
- Checks if /confer needed

**Escalation:** 
1. First drift → Ignore
2. Second → /realign
3. Persistent → /reset
4. Stuck → /confer

---

### `/reset` - Reload Rules
**Behavior:**
- Reloads .cursorrules.md
- Resets templates
- Restores patterns
- Clears pattern counters
- Preserves context

**Use:** When /realign fails

---

## 🆕 Tier 5: Enhancements

### `/queue` - Task List
**Shows:**
- Current task
- Next 5 queued
- Total backlog count
- Priority order

---

### `/stats` - Metrics
**Shows:**
- Session duration
- Tasks completed
- Token usage
- File health
- Archive count
- Pattern detection status
- Confer documents created

---

### `/preview [cmd]` - Preview
**Shows what command will do**

Example:
```
/preview commit

Will:
1. Stage 3 files
2. Commit "feat: add dashboard"
3. Push to origin/main

Proceed? (/commit to execute)
```

---

## 📊 Visual Indicators

**Progress Bars:**
```
23/200 lines  [▓▓░░░░░░░░] 12%
187/200 lines [▓▓▓▓▓▓▓▓▓░] 94% ⚠️
```

**Symbols:**
- ✓ Success/Healthy
- ⚠️ Warning (>90% or patterns)
- 🚨 Critical (>100% or stuck)
- 📊 Status
- 🎯 Current
- 📋 List
- ⏭️ Next
- 🤝 Handoff/Confer
- 🔍 Pattern detected

---

## 🔄 Common Workflows

### Standard Session
```
1. /init     → Load context, check archives
2. /server   → Start dev server
3. /next     → Execute task
4. /debug    → Test in browser
5. /verify   → Check implementation
6. /commit   → Save & push
7. /save     → Update progress
```

### Quick Fix
```
/init → /next → /debug → /commit
```

### Learning
```
/init → /pause → [ask questions] → /resume → /next
```

### When Stuck
```
[3 failed attempts] → /confer → [download handoff] → [fresh AI]
```

### Maintenance
```
/archive → /save → /commit
```

---

## ⚠️ Critical Behaviors

**ALWAYS:**
- `/commit` auto-pushes (no separate push)
- `/next` executes immediately (no options)
- `/save` and `/init` check archives (mandatory)
- Archive at 200 lines (automatic)
- Pattern detection active (3 attempts = /confer)

**NEVER:**
- Skip archive checks
- Show code fragments
- Ask permission for /next
- Separate commit from push
- Ignore pattern detection

---

## 🔥 Quick Reference

```
EVERY SESSION:
/init → /server → /next → /debug → /verify → /commit → /save

WHEN STUCK:
/confer   - Create handoff document
/pattern  - Check repetition patterns
/scope    - Check boundaries
/realign  - Fix drift
/reset    - Reload rules
STOP      - Emergency help

MAINTENANCE:
/archive  - Force cleanup
/stats    - View metrics
/queue    - See tasks
```

---

## 💡 Pro Tips

1. **Run /archive proactively** - Don't wait for 200 lines
2. **Use /confer early** - After 3 failures, get fresh perspective
3. **Watch pattern detection** - AI tracks repetition
4. **Use /server after git pull** - Fresh state
5. **Run /debug for all UI changes** - Immediate feedback
6. **Commit frequently** - Small atomic commits
7. **Watch progress bars** - Act on ⚠️ warnings
8. **Use /realign early** - Prevent drift
9. **Check /stats periodically** - Track efficiency
10. **Trust pattern detection** - Auto-suggests /confer

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Lost | `STOP` → `/init` |
| Verbose AI | `/realign` → `/reset` |
| Files too big | `/archive` |
| Port conflict | `/server` |
| Wrong scope | `/scope [request]` |
| Want options | `/init` (not /next) |
| Stuck on task | `/confer` → fresh AI |
| Repeating errors | `/pattern` → `/confer` |

---

## 📈 Success Metrics

**Token Efficiency:**
- Target: <3.4K per turn
- Check: Every response shows estimate
- Success: Flat across weeks

**Pattern Detection:**
- Target: Catch repetition at 3x
- Check: /pattern command
- Success: Auto-suggest /confer

**File Health:**
- Target: <200 lines always
- Check: Progress bars
- Success: Never exceed without archiving

**Speed:**
- Target: <10 min per cycle
- Check: Session logs
- Success: Consistent timing

**Handoffs:**
- Target: Clean escape when stuck
- Check: /stats for confer count
- Success: Fresh perspective works

---

**Remember:**
- You direct (strategy) 🎬
- AI executes (tactics) ⚡
- Archives save tokens 🗂️
- Progress guides you 📊
- Patterns prevent spinning 🔍
- Handoffs provide escape 🤝

---

**Version:** 2.3.1  
**Archive:** 200 lines  
**Pattern:** 3 attempts  
**Tokens:** ~3.4K target