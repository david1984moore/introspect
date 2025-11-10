# Cursor Workflow Commands - v2.0

## 🚀 Core Workflow

### `/init` - Start session
- Loads STATUS.md, SCOPE.md
- **Checks for auto-archive (>500 lines)**
- Shows current task and options

### `/next` - Get next step
- Executes next queued task
- Updates STATUS.md automatically
- Pure implementation, no explanations

### `/pause` - Learning mode
- AI explains instead of implementing
- Good for understanding complex code

## 🗂️ Archive Management

### `/archive` - Check & archive files
- Scans all workflow files for size
- Archives any file >500 lines
- Reports: "Archived STATUS.md (523 lines)"

### `/save` - Update STATUS.md
- Saves current progress
- **Triggers archive check**
- Updates session metrics

## 💻 Development Tools

### `/dev` - Fresh dev server
- Kills ALL existing node processes
- Clears ports 3000-3010
- Starts new dev server
- Reports active port (e.g., "Running on :3000")

### `/debug` - Browser testing
- Opens Chrome automatically
- Navigates to current feature
- Suggests test scenarios
- Reports findings

## ✅ Quality Control

### `/verify` - Test implementation
- Suggests testing approach
- Identifies edge cases
- Recommends test data

### `/commit` - Save to Git
- Stages all changes (`git add .`)
- Commits with generated message
- **Pushes to origin/main**
- Reports: "Pushed: feat: [task name]"

### `/memory` - Add to Memory File
- Reads current conversation context
- Extracts the current topic/decision being discussed
- Appends formatted entry to `archives/memories.md`
- Includes date, status, and key details
- Reports: "Added to memories: [topic]"

## 🎯 Scope Management

### `/scope` - Check boundaries
- Reviews SCOPE.md
- Validates new requests
- Prevents scope creep

### `/options` - Show commands
- Displays this full list
- Quick reference during coding

## 🛠️ Utilities

### `/format` - Fix AI format
- Reloads .cursorrules
- Resets AI behavior
- Use when output degrades

### `STOP` - Emergency clarity
- AI explains full context
- Current file, last command
- Suggests recovery path

---

## 📊 Archive Thresholds

| File | Max Lines | Action |
|------|-----------|--------|
| STATUS.md | 500 | Auto-archive old sessions |
| SCOPE.md | 500 | Archive completed features |
| Other .md | 1000 | Manual archive only |

---

## ⚡ Command Chaining

Common sequences:
1. `/init` → `/next` → `/verify` → `/commit`
2. `/dev` → `/debug` → `/verify`
3. `/archive` → `/save` → `/commit`

---

## 🎮 Pro Tips

- **/archive first** - Start sessions clean
- **/dev after pull** - Fresh server state
- **/debug for UI** - Quick browser checks
- **/commit often** - Includes push now!
- **STOP if lost** - Full context reset

---

**Token Saver:** This file loads on-demand only!
**Keep open in browser during sessions**