# Phase Completion Workflow

**CRITICAL:** When a phase is completed, STATUS.md MUST be automatically updated.

## Required Updates to STATUS.md

When marking a phase as complete, update the following sections:

### 1. Current Task (Top of File)
```markdown
**Current Task:** Phase X - [Phase Name] Complete ✅
```

### 2. Queued Tasks Section
Add the completed phase to the list:
```markdown
X. ✅ **Phase X: [Phase Name]** ← COMPLETE
```

### 3. Session Log
Add a new session entry documenting all work:
```markdown
### Session X - YYYY-MM-DD
**Focus:** Phase X Implementation - [Phase Name]
**Completed:**
- ✅ [Item 1]
- ✅ [Item 2]
- ✅ [Item 3]

**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]
```

### 4. Phase Progress Section
Add or update the phase progress section:
```markdown
## Phase X Progress

**Status:** ✅ Complete
- ✅ [Deliverable 1]
- ✅ [Deliverable 2]
- ✅ [Deliverable 3]
```

### 5. Quick Stats (If Applicable)
Update component counts, features, or other metrics:
```markdown
- **Components:** [Updated count]
- **[Other metric]:** [Updated value]
```

## Checklist

When completing a phase:
- [ ] Update "Current Task" header
- [ ] Add phase to "Queued Tasks" as complete
- [ ] Create new Session Log entry with all completed items
- [ ] Add/update Phase Progress section
- [ ] Update Quick Stats if metrics changed
- [ ] Verify all deliverables from phase documentation are listed
- [ ] Ensure next phase is listed in Queued Tasks

## Example: Phase 6 Completion

See STATUS.md lines 135-162 for a complete example of Phase 6 completion documentation.

