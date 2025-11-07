# 🚀 QUICK REFERENCE - v2.0

## ⚡ Essential Commands
```bash
/init     → Start (auto-archives!)
/next     → Get next step
/verify   → Test implementation
/commit   → Save + PUSH to git
```

## 🆕 New in v2.0
```bash
/archive  → Check & archive big files
/dev      → Kill all & start fresh server
/debug    → Open Chrome for testing
```

## 📁 Files & Limits

| File | Max Lines | Auto-Archive |
|------|-----------|--------------|
| STATUS.md | 500 | ✅ Yes |
| SCOPE.md | 500 | ✅ Yes |
| Others | 1000 | ❌ Manual |

## 🎯 Session Flow

### Standard Session
1. `/init` - Loads files (may archive)
2. `/dev` - Start fresh server
3. `/next` - Work on task
4. `/debug` - Test in browser
5. `/verify` - Check thoroughly
6. `/commit` - Save & push
7. `/save` - Update progress

### Quick Test Cycle
```bash
/dev → /debug → /verify → /commit
```

### Archive Maintenance
```bash
/archive → /save → /commit
```

## 🔥 Token Savers

- **Auto-archive** at 500 lines
- **STATUS.md** keeps only current + 5 tasks
- **Archives** in `/archives/` folder
- **On-demand loading** for reference files

## 🆘 When Stuck

| Problem | Solution |
|---------|----------|
| "What to do?" | `/next` or `/options` |
| "Don't understand" | `/pause` for explanation |
| "Is this in scope?" | `/scope` to check |
| "AI output messy" | `/format` to reset |
| "Totally lost" | `STOP` for full context |
| "Files too big" | `/archive` to clean up |
| "Port in use" | `/dev` kills everything |

## 📊 Archive Status

Check current file sizes:
```bash
# AI will automatically check during:
/init    # Session start
/save    # Progress update  
/archive # Manual check
```

## ⚠️ Important Changes

1. **`/commit` now pushes!** No need for separate push
2. **`/dev` kills ALL servers** - Complete restart
3. **`/debug` opens browser** - Automatic navigation
4. **Files auto-archive** - No manual cleanup needed

## 🎮 Command Combos

**Full cycle:**
```
/init → /dev → /next → /debug → /verify → /commit → /save
```

**Quick fix:**
```
/dev → /debug → /commit
```

**Maintenance:**
```
/archive → /save → /commit
```

---

## 💡 Pro Tips

- 🚀 `/archive` first if returning after break
- 💻 `/dev` after any git pull
- 🧪 `/debug` for all UI changes
- 💾 `/commit` frequently (auto-pushes!)
- 📏 Watch line counts in STATUS.md header

---

**Token Budget:** <500 per file after archive
**Archive Trigger:** 500 lines
**Keep this open during coding!**