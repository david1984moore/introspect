# Cursor Workflow System - User Guide v2.0

## 🎯 What's New in v2.0

### Smart Archiving System
- **Automatic**: Files archive at 500 lines
- **Manual**: `/archive` command for on-demand archiving
- **Preserves**: Current work while storing history

### Enhanced Commands
- `/dev` - Complete server management
- `/debug` - Autonomous browser testing  
- `/commit` - Now includes git push
- `/archive` - Manual archive trigger

---

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Download workflow files to project root
# 2. Open project in Cursor
# 3. Type in chat:
/init

# That's it! Follow the numbered options
```

### Every Session Workflow
```bash
/init          # Start (auto-archives if needed)
/next          # Work on current task
/verify        # Test what you built
/commit        # Save and push to git
/save          # Update progress
```

---

## 📁 File Structure

```
your-project/
├── .cursorrules      # AI instructions (2K tokens)
├── STATUS.md         # Current tasks (auto-archives)
├── SCOPE.md          # Project boundaries
├── docs/
│   ├── reference/
│   │   ├── ALIASES.md        # Command reference
│   │   ├── USER_GUIDE.md     # This file
│   │   └── QUICK_REF.md       # Cheat sheet
│   └── phases/                # Phase documentation
└── archives/         # Auto-created when needed
    ├── STATUS_20250105_143022.md
    └── SCOPE_20251110_103552.md
```

---

## 🗂️ Archive System

### How It Works

1. **Automatic Detection**
   - During `/init` - Checks all files
   - During `/save` - Checks STATUS.md
   - During `/archive` - Manual check

2. **Archive Triggers**
   - Any file >500 lines
   - STATUS.md >100 completed tasks
   - Manual `/archive` command

3. **What Gets Preserved**
   - STATUS.md: Current task + 5 queued
   - SCOPE.md: Active features only
   - Archives: Complete history

### Archive Example
```bash
User: /init
AI: STATUS.md has 523 lines. Archiving...
    ✓ Created archives/STATUS_20250105_143022.md
    ✓ Reduced STATUS.md to 47 lines
    Current task: Implement user dashboard
```

---

## 💻 Command Reference

### Session Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/init` | Start session | Beginning of every session |
| `/next` | Execute next task | Ready for implementation |
| `/pause` | Explain only | Learning mode |
| `/save` | Update progress | End of work block |

### Development Commands

| Command | Purpose | What It Does |
|---------|---------|--------------|
| `/dev` | Fresh server | Kills all, starts new |
| `/debug` | Test in browser | Opens Chrome to feature |
| `/verify` | Test approach | Suggests how to test |
| `/commit` | Git save | Add, commit, AND push |

### Management Commands

| Command | Purpose | Details |
|---------|---------|---------|
| `/archive` | Force archive | Checks all files |
| `/scope` | Validate request | Prevents scope creep |
| `/format` | Fix AI output | Reloads rules |
| `STOP` | Emergency help | Full context dump |

---

## 🎮 Common Workflows

### Starting Fresh Project
```bash
/init          # Setup workspace
/scope         # Review what we're building
/next          # Start first task
/dev           # Launch dev server
```

### Resuming Work
```bash
/init          # Load context (may archive)
/dev           # Fresh server
/next          # Continue where left off
```

### Testing Changes
```bash
/debug         # Open browser
/verify        # Get test suggestions
/commit        # Save if good
```

### Session Cleanup
```bash
/save          # Update STATUS.md
/archive       # Check file sizes
/commit        # Push everything
```

---

## 🔧 Troubleshooting

### Problem: Files getting too large
**Solution:** Run `/archive` regularly
- Auto-triggers at 500 lines
- Manual trigger anytime
- Preserves full history

### Problem: Lost context
**Solution:** Type `STOP`
- AI explains current state
- Shows last command
- Suggests `/init` to recover

### Problem: Port conflicts
**Solution:** Use `/dev`
- Kills ALL node processes
- Clears ports 3000-3010
- Starts fresh server

### Problem: AI not following format
**Solution:** Type `/format`
- Reloads .cursorrules
- Resets AI behavior

---

## 📊 Token Management

### File Token Budgets
- **.cursorrules**: ~2,000 tokens (always loaded)
- **STATUS.md**: <800 tokens (after archive)
- **SCOPE.md**: <600 tokens (after archive)
- **Others**: Loaded on-demand only

### Token Saving Tips
1. Archive aggressively (>/archive` often)
2. Keep STATUS.md focused (current + 5 tasks)
3. Move completed items to archives
4. Don't quote entire files in chat

---

## ⚡ Pro Configuration

### Customize Archive Threshold
Edit in .cursorrules:
```markdown
# Change from 500 to your preference
Archive when any file exceeds:
- 500 lines OR  # <-- Modify this
```

### Add Custom Commands
In .cursorrules, add to COMMAND SYSTEM section:
```markdown
- `/custom` - Your description here
```

Then define behavior:
```markdown
### `/custom` - Your Command
# Implementation steps
```

---

## 🎯 Best Practices

1. **Start Clean**: `/init` at session start
2. **Archive Early**: Don't wait for auto-trigger
3. **Commit Often**: Now includes push!
4. **Stay in Scope**: Check `/scope` if unsure
5. **Test Frequently**: `/debug` for quick checks

---

## 📈 Measuring Success

You'll know the system works when:
- ✅ Sessions start with one command (`/init`)
- ✅ Files stay under 500 lines automatically
- ✅ Context remains clear after hours of work
- ✅ Git history is clean and pushed
- ✅ Token usage drops by 70%+

---

## 🆘 Support

### Getting Help
1. Type `STOP` for context dump
2. Check `docs/reference/ALIASES.md` for commands
3. Review archives/ for history
4. Reset with `/format` if needed

### Reporting Issues
Track in STATUS.md under "Blockers":
- What command failed
- What was expected
- What actually happened

---

## 🚦 Quick Reference Card

```
EVERY SESSION:
/init → /next → /verify → /commit → /save

WHEN NEEDED:
/archive - Clean up large files
/dev     - Fresh server
/debug   - Browser test
/scope   - Check boundaries
STOP     - Emergency help
```

---

**Remember:** The AI executes, you direct. Keep tokens low, productivity high!