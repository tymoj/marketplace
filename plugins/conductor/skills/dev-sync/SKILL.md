---
name: dev-sync
description: >-
  Syncs pipeline artifacts after manual code changes. Run after refactoring,
  hotfixes, or any manual edits made outside /dev-build. Reads the current
  code state, compares it to the approved plan, and updates implementation-log.md
  (and optionally plan.md) to reflect what actually exists.
  Invoke as /dev-sync [task-id].
argument-hint: "[task-id, e.g. task-crd-0001]"
context: fork
agent: sonnet
allowed-tools: Task(code-explorer), Read, Write, Edit, Glob, Grep, Bash
---

# Dev Sync — Reconcile Pipeline After Manual Changes

You reconcile pipeline artifacts with manually changed code. You do **not** write or fix code — you only update the pipeline's record of what was built.

**Task ID:** $ARGUMENTS

---

## PHASE 0 — Load Context

### Step 1: Validate Task ID

Read `.claude/pipeline/$ARGUMENTS/task.md`. Verify:
- The task directory exists
- Phase 3 is `done` (implementation already ran)

If the task directory doesn't exist:
> "Task `$ARGUMENTS` not found. Check `.claude/pipeline/` for valid task IDs."

If Phase 3 is `pending`:
> "Task `$ARGUMENTS` has not been implemented yet. Run `/dev-build $ARGUMENTS` first."

### Step 2: Load Pipeline Files

Read and hold in context:
- `.claude/pipeline/$ARGUMENTS/stack.md`
- `.claude/pipeline/$ARGUMENTS/plan.md`
- `.claude/pipeline/$ARGUMENTS/implementation-log.md`

If `implementation-log.md` is missing, create an empty one before continuing.

### Step 3: Gather Change Description

Ask the user:

> "What did you change after implementation? Please describe:
> 1. Which files or areas were modified?
> 2. What was the reason (refactor, bug fix, design change, etc.)?
> 3. Did the overall architecture or interfaces change, or just internal implementation?"

Wait for the answer before proceeding.

---

## PHASE 1 — Discover Current State

### Step 1: Check Git Diff

Run to identify changed files since the last commit (or recent changes):

```bash
git diff --name-only HEAD 2>/dev/null || echo "no git diff available"
git diff --stat HEAD 2>/dev/null | tail -5 || true
```

If git is not available or the diff is empty, use the file list from the user's description.

### Step 2: Spawn Code Explorer

Spawn `code-explorer` focused on the files the user described as changed. Provide:
- The user's description of what changed
- The file paths or areas to investigate
- The original plan summary (from `plan.md`) so the explorer can identify deviations

Ask `code-explorer` to:
1. Trace the current implementation of the changed areas
2. Identify what exists now vs what the plan described
3. Note any removed, added, or restructured components
4. Flag any interfaces or contracts that changed (API endpoints, method signatures, DB schema)

---

## PHASE 2 — Analyze Deviations

After `code-explorer` returns, classify each change into one of these categories:

| Category | Definition |
|---|---|
| **Cosmetic** | Renamed variables, reformatted code, extracted methods — behavior unchanged |
| **Structural** | Moved classes, split services, reorganized packages — same behavior, different shape |
| **Behavioral** | Changed logic, added/removed features, altered error handling |
| **Interface** | Changed API contracts, method signatures, DB schema, event payloads |

Present the classified list to the user and ask:
> "Does this match what you intended? Is there anything missing?"

Wait for confirmation before updating files.

---

## PHASE 3 — Update Artifacts

### Step 1: Update Implementation Log

Append a new section to `.claude/pipeline/$ARGUMENTS/implementation-log.md`:

```markdown
---

## Post-Implementation Changes

**Synced:** [current date + time]
**Reason:** [user's stated reason]

### Changed Files

| File | Change Type | Summary |
|---|---|---|
| [file path] | [Cosmetic / Structural / Behavioral / Interface] | [one-line description] |

### Deviations from Plan

[List anything that diverged from plan.md — what was planned vs what exists now]

### Notes

[Any relevant context: why the change was made, trade-offs, follow-up needed]
```

### Step 2: Update Plan (if needed)

If any changes are **Structural** or **Interface** category:

Ask:
> "The refactor changed [X]. Should I update `plan.md` to reflect the new architecture, or keep the original plan as a historical record?"

If the user says yes, update the relevant sections of `.claude/pipeline/$ARGUMENTS/plan.md` with an inline note:

```markdown
> **Updated after implementation** ([date]): [description of what changed and why]
```

Do not rewrite the entire plan — add notes inline next to the affected sections.

### Step 3: Update Task Manifest

Append to `.claude/pipeline/$ARGUMENTS/task.md`:

```markdown
| sync — Post-implementation reconcile | done | implementation-log.md |
```

---

## Output

When complete, present a summary:

```
## Sync Complete  [task-id: $ARGUMENTS]

**Files updated:**
- implementation-log.md — added post-implementation changes section
- plan.md — [updated / unchanged]
- task.md — sync entry added

**Changes recorded:** [N cosmetic / N structural / N behavioral / N interface]

**Deviations from plan:** [none / list]

**Follow-up needed:** [none / list any interface changes that affect other teams or services]
```