# Archive System Documentation

**Version:** 2.0
**Last Updated:** 2025-11-05

---

## 🎯 System Overview

The Self-Archiving Executor System maintains minimal token usage while preserving complete project history through intelligent file archiving.

### Key Principles
- **Token Efficient**: Keep active files <800 tokens
- **Fully Accessible**: All archives easily referenceable
- **Self-Documenting**: Clear header references to archived content
- **AI-Autonomous**: Agent can fetch archives when needed

---

## 📁 Archive Structure

```
project-root/
├── .cursorrules           # AI instructions (~2K tokens, always loaded)
├── STATUS.md              # Current state (<800 tokens)
├── SCOPE.md               # Active boundaries (<600 tokens)
├── docs/
│   ├── reference/
│   │   ├── ALIASES.md             # Command reference (on-demand)
│   │   ├── USER_GUIDE.md          # User docs (on-demand)
│   │   └── QUICK_REF.md           # Cheat sheet (on-demand)
│   └── phases/                    # Phase documentation
└── archives/              # Historical content
    ├── STATUS_20250105_143022.md
    ├── STATUS_20250104_091500.md
    ├── SCOPE_20250103_160000.md
    └── [timestamped archives...]
```

---

## 🔄 How It Works

### Automatic Triggers

Archives are created automatically when:
1. Any file exceeds **500 lines**
2. Any file exceeds **~1000 tokens**
3. STATUS.md has **100+ completed tasks**

### When Archives Trigger

During these commands:
- `/init` - Checks all files at session start
- `/save` - Checks STATUS.md when saving progress
- `/archive` - Manual check of all workflow files

### Archive Process

1. **Detection**: Line count checked (`wc -l STATUS.md SCOPE.md`)
2. **Directory**: Ensures `/archives/` exists (`mkdir -p archives`)
3. **Backup**: Copies full file to `/archives/[FILE]_YYYYMMDD_HHMMSS.md`
4. **Truncate**: Reduces original to essential content only
5. **Header Update**: Adds archive reference to truncated file

---

## 📋 Header Reference System

Every archived file gets a header with metadata pointing to its archive.

### STATUS.md Header Format
```markdown
# Project Status

**Current Task:** Implement user authentication
**Archive Count:** 3 (last: 2025-01-05 14:30)
**Archive Location:** `/archives/STATUS_20250105_143022.md`
**Line Count:** 47 / 500 (auto-archives at 500)

---
```

### SCOPE.md Header Format
```markdown
# Project Scope

**Archive Count:** 2 (last: 2025-01-05 14:30)
**Archive Location:** `/archives/SCOPE_20250105_143022.md`
**Line Count:** 82 / 500 (auto-archives at 500)

---
```

---

## 📦 What Gets Preserved

### STATUS.md Archives Contain:
- ✅ Complete session logs (all historical work)
- ✅ All completed tasks
- ✅ All decision logs
- ✅ Full implementation notes
- ✅ Session metrics and timings

### STATUS.md Active Keeps:
- 📌 Current task (what you're working on NOW)
- 📌 Next 5 queued tasks (immediate roadmap)
- 📌 Current session log ONLY
- 📌 Last ~5 relevant decisions

### SCOPE.md Archives Contain:
- ✅ Completed features
- ✅ Historical decisions
- ✅ Deprecated boundaries
- ✅ Evolution of project scope

### SCOPE.md Active Keeps:
- 📌 IN SCOPE (active features being built)
- 📌 OUT OF SCOPE (current boundaries)
- 📌 PARKING LOT (near-future considerations)
- 📌 Technical boundaries

---

## 🤖 AI Access to Archives

The AI can autonomously access archived content when needed:

### View Specific Archive
```bash
view /archives/STATUS_20250105_143022.md
```

### Search Across Archives
```bash
grep -r "authentication implementation" archives/
```

### List All Archives
```bash
ls -lt archives/
```

### AI Decision Process
1. User asks about past work
2. AI checks current STATUS.md header for archive reference
3. AI uses `view` tool to read archived content
4. AI synthesizes information from both current + archived context

---

## 💡 Example Archive Cycle

### Before Archive (STATUS.md @ 523 lines)
```markdown
# Project Status
**Current Task:** Implement user dashboard
**Archive Count:** 2 (last: 2025-01-04 09:15)
...
[hundreds of lines of completed sessions]
```

### Archive Trigger
```bash
User: /init
AI: STATUS.md exceeds 500 lines. Archiving...
    ✓ Created archives/STATUS_20250105_143022.md (523 lines)
    ✓ Updated STATUS.md header with archive reference
    ✓ Active file now 47 lines
```

### After Archive (STATUS.md @ 47 lines)
```markdown
# Project Status

**Current Task:** Implement user dashboard
**Archive Count:** 3 (last: 2025-01-05 14:30)
**Archive Location:** `/archives/STATUS_20250105_143022.md`
**Line Count:** 47 / 500 (auto-archives at 500)

---

## Queued Tasks
1. Add authentication to dashboard
2. Implement user profile page
3. Create settings interface
4. Add data visualization
5. Implement export functionality

## Session Log
### Session 12 - 2025-01-05
**Time:** 14:30 - Active
**Focus:** User dashboard implementation
[Current session only...]
```

---

## 🎮 Manual Archive Command

### `/archive` Command Usage

```bash
User: /archive
AI: Checking files for archiving...
    
    File size check:
    - STATUS.md: 47 lines ✓ OK
    - SCOPE.md: 82 lines ✓ OK
    - docs/reference/ALIASES.md: 143 lines ✓ OK
    
    No files require archiving.
```

Or if archiving needed:

```bash
User: /archive
AI: Checking files for archiving...
    
    File size check:
    - STATUS.md: 523 lines ⚠️ EXCEEDS LIMIT
    - SCOPE.md: 82 lines ✓ OK
    
    Archiving STATUS.md...
    ✓ Archived to archives/STATUS_20250105_143022.md
    ✓ Updated header with archive reference
    ✓ Active file now 47 lines
```

---

## 📊 Token Savings Analysis

### Before Archiving
- .cursorrules: ~2,000 tokens (always loaded)
- STATUS.md: ~2,500 tokens (growing)
- SCOPE.md: ~1,200 tokens (growing)
- **Total context: ~5,700 tokens**

### After Archiving
- .cursorrules: ~2,000 tokens (always loaded)
- STATUS.md: ~800 tokens (lean)
- SCOPE.md: ~600 tokens (lean)
- **Total context: ~3,400 tokens**
- **Savings: ~40% (2,300 tokens)**

### Archives (on-demand loading only)
- Previous sessions: Available but NOT auto-loaded
- AI fetches only when needed for context
- Preserves full history without token cost

---

## ✅ Best Practices

1. **Archive Proactively**: Run `/archive` at session start if resuming after breaks
2. **Trust the Headers**: Archive references always point to latest backup
3. **Let AI Decide**: Agent will fetch archives when it needs historical context
4. **Monitor Line Counts**: Header shows current/max lines (e.g., "47 / 500")
5. **Commit Archives**: Include `/archives/` folder in git commits

---

## 🚫 What NOT to Do

- ❌ Don't manually delete archives (they're your history!)
- ❌ Don't edit archive files (they're snapshots)
- ❌ Don't bypass the archive system by manually trimming files
- ❌ Don't worry about archive bloat (markdown is tiny)

---

## 🔮 Future Enhancements (Parking Lot)

- Archive analytics dashboard
- Selective section archiving
- Archive compression after 100+ files
- Cross-archive search interface
- Archive restoration tools

---

**Remember:** Archives are your project's memory. The system keeps recent work hot (in active files) and historical work cold (in archives), optimizing for both speed and completeness.
