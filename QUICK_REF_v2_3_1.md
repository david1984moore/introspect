# 🚀 QUICK REFERENCE v2.3.1

**Essential commands and workflows at a glance**

---

## ⚡ Most Used Commands

```bash
/init     → Start session (loads, archives, shows options)
/next     → Execute immediately (no options!)
/verify   → Generate test plan
/commit   → Save + auto-push to git
/save     → Update progress + archive check
/confer   → Create handoff when stuck (NEW!)
```

---

## 📁 File Limits

| File | Max Lines | Auto-Archive | Visual |
|------|-----------|--------------|---------|
| STATUS.md | 200 | ✅ Yes | [▓▓░░░░░░░░] |
| SCOPE.md | 200 | ✅ Yes | [▓▓░░░░░░░░] |
| .cursorrules | N/A | ❌ No | Guide only |

**Warning at:** 180 lines (90%) ⚠️  
**Archive at:** 200 lines (automatic)  
**Confer at:** 3 failed attempts 🤝

---

## 🎮 Command Tiers

### Tier 1: Orchestration (Wait)
```bash
/init      # Show options, wait
/pause     # Explain mode
/resume    # Exit explain OR implement
/save      # Update + archive
STOP       # Emergency help
```

### Tier 2: Execution (Immediate)
```bash
/next      # Execute NOW (no options!)
/verify    # Test plan
/commit    # Stage + commit + push
```

### Tier 3: Development
```bash
/server    # Fresh dev server
/debug     # Open browser
/archive   # Force cleanup
```

### Tier 4: Safety & Handoff
```bash
/confer    # Create handoff doc (NEW!)
/pattern   # Check repetitions (NEW!)
/scope     # Check boundaries
/realign   # Fix drift
/reset     # Reload rules
```

### Tier 5: Enhancements
```bash
/queue     # View tasks
/stats     # Metrics
/preview   # Show before do
```

---

## 🔄 Standard Workflow

```bash
/init → /server → /next → /debug → /verify → /commit → /save
```
**Time:** 5-10 min | **Tokens:** ~3.4K

## 🤝 When Stuck Workflow

```bash
[3 failed attempts] → /confer → [download doc] → [fresh AI]
```
**Auto-triggers:** After 3x same error or approach

---

## 📊 Visual Status Guide

```
Good:  47/200  [▓░░░░░░░░░] 24% ✓
Warn:  187/200 [▓▓▓▓▓▓▓▓▓░] 94% ⚠️
Bad:   212/200 [▓▓▓▓▓▓▓▓▓▓] 106% 🚨
Stuck: 3 attempts detected 🤝 → /confer
```

---

## ⚠️ Critical Rules

1. **`/next` executes immediately** (no options shown)
2. **`/commit` auto-pushes** (no separate push command)
3. **`/init` always archives** (mandatory check)
4. **`/save` always archives** (mandatory check)
5. **Archive at 200 lines** (automatic)
6. **`/confer` at 3 failures** (auto-suggest)

---

## 🆘 When Stuck

| Issue | Fix |
|-------|-----|
| Lost | `STOP` |
| Verbose AI | `/realign` |
| Very verbose | `/reset` |
| Big files | `/archive` |
| Port issue | `/server` |
| Scope? | `/scope` |
| **Stuck/Spinning** | **`/confer`** |
| **Repeating errors** | **`/pattern` → `/confer`** |

---

## 🤝 The /confer Command

**Creates handoff document with:**
- Problem summary
- Goal statement
- What's been tried
- Technical stack
- All errors
- Code examples
- Ready for fresh AI

**Auto-triggers after:**
- 3 failed attempts
- 3 same errors
- Token spike (>5K)
- Circular patterns

---

## 💡 Pro Tips

- 🚀 `/archive` at session start (proactive)
- 🤝 `/confer` after 3 failures (don't spin)
- 🔍 `/pattern` to check repetition
- 💻 `/server` after git pull
- 🧪 `/debug` for all UI changes  
- 💾 `/commit` frequently
- 📏 Watch ⚠️ warnings
- 🎯 `/realign` at first drift

---

## 🎯 Quick Patterns

**Full cycle:**
```
/init → /server → /next → /debug → /verify → /commit → /save
```

**Quick fix:**
```
/server → /next → /debug → /commit
```

**Learning:**
```
/pause → [questions] → /resume → /next
```

**Stuck resolution:**
```
/pattern → /confer → [handoff to fresh AI]
```

**Cleanup:**
```
/archive → /save → /commit
```

---

## 📈 Success Metrics

✓ **Tokens:** <3.4K always  
✓ **Files:** <200 lines  
✓ **Speed:** <10 min/cycle  
✓ **Drift:** Rare /reset  
✓ **Stuck:** /confer within 3 attempts

---

## 🎬 Mental Model

**You = Director** (strategy)  
**AI = Executor** (tactics)  
**Pattern Detection = Safety Net** (prevents spinning)

You type: `/next`  
AI does: Complete implementation

You type: `/confer`  
AI does: Create handoff document

**5 words → 500 lines of work**  
**1 command → Fresh perspective**

---

## 📋 Session Checklist

**Start:**
- [ ] `/init`
- [ ] Check warnings
- [ ] `/server`

**Work:**
- [ ] `/next`
- [ ] `/debug`
- [ ] `/verify`
- [ ] `/commit`

**If Stuck:**
- [ ] `/pattern` (check)
- [ ] `/confer` (handoff)

**End:**
- [ ] `/save`
- [ ] `/stats`

---

## 🔍 Pattern Detection

**AI tracks:**
- Attempt counts
- Error repetition
- Token spikes
- Circular patterns

**Thresholds:**
- 3x = Suggest /confer
- 5x = Auto-trigger /confer
- >5K tokens = Warning

---

**Keep this open while coding!**

Version: 2.3.1 | Archive: 200 lines | Pattern: 3 attempts | Tokens: ~3.4K