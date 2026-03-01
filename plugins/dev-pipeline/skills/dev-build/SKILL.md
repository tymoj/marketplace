---
name: dev-build
description: >-
  Executes an approved plan from /dev-plan. Takes a task ID (e.g. task-crd-0001),
  reads the approved plan, then runs implementation with Agent Teams, code simplification,
  testing, and code review. Invoke as /dev-build [task-id].
argument-hint: "[task-id, e.g. task-crd-0001]"
context: fork
agent: sonnet
allowed-tools: Task(code-explorer, code-architect, jpa-expert, liquibase-expert, mysql-expert, oracle-expert, angular-expert, node-expert, python-expert, code-simplifier, test-generator, test-analyzer, code-reviewer, security-reviewer, silent-failure-hunter), TeamCreate, TeamDelete, TaskCreate, TaskList, TaskGet, TaskUpdate, SendMessage, Read, Write, Edit, Glob, Grep, Bash
---

# Dev Build — Execution Phases (3–5)

You execute an approved implementation plan produced by `/dev-plan`. You coordinate specialist agents to implement, test, and review the changes.

**Task ID:** $ARGUMENTS

---

## PHASE 0 — Load Context

### Step 1: Validate Task ID

Read `.claude/pipeline/$ARGUMENTS/task.md` to verify:
1. The task directory exists
2. Phase 2 status is `done` (plan was approved)
3. Phase 3 status is `pending` (not already implemented)

If the task directory doesn't exist, tell the user:
> "Task `$ARGUMENTS` not found. Run `/dev-plan` first to create a plan."

If Phase 2 is not done, tell the user:
> "Task `$ARGUMENTS` plan is not yet approved. Run `/dev-plan` to complete planning."

If Phase 3 is already done, ask the user if they want to re-run implementation.

### Step 2: Load Pipeline Files

Read these files and hold their contents in context:
- `.claude/pipeline/$ARGUMENTS/task.md` — task manifest
- `.claude/pipeline/$ARGUMENTS/stack.md` — confirmed stack
- `.claude/pipeline/$ARGUMENTS/plan.md` — approved plan

Extract the task description from `task.md` and the stack details from `stack.md`.

Hold the task ID (from `$ARGUMENTS`) in memory for the entire run.

### Step 3: Confirm

Tell the user:
> "Loaded task **$ARGUMENTS**: [task description from task.md]"
> "Stack: [stack summary from stack.md]"
> "Starting implementation of the approved plan."

Update `.claude/pipeline/$ARGUMENTS/task.md` — set Status to `in_progress`.

---

## PHASE 3 — Implementation

Execute the approved plan. Use Agent Teams for parallel work when enabled, or fall back to sequential subagents.

### Step 0: Detect Execution Mode

Check whether Agent Teams is available:

```bash
echo "${CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS:-0}"
```

- If `1` → use **Agent Teams mode** (Steps 1–5 below)
- If `0` or unset → use **Sequential Subagent mode** (Step 6 below)

Tell the user which mode will be used before proceeding.

---

### Agent Teams Mode (Steps 1–5)

> Teammates are full, independent Claude Code sessions that share a task list and message each other directly. Each teammate has its own context window.

#### Step 1: Create the Team

Use `TeamCreate` with `team_name: "pipeline-$TASK_ID"`.

#### Step 2: Create Tasks

Read `.claude/pipeline/$TASK_ID/plan.md` and `.claude/pipeline/$TASK_ID/stack.md`. Break the plan into discrete, file-scoped tasks. Each task must have no overlapping file ownership, defined inputs/outputs, and a domain tag (`db`, `backend`, `frontend`, `config`).

Use `TaskCreate` for each task, then `TaskUpdate` with `addBlockedBy` for dependencies (e.g., DB migration → entity → service → controller). Aim for 5–6 tasks per teammate.

#### Step 3: Spawn Teammates

Use the `Task` tool with `team_name: "pipeline-$TASK_ID"`, `subagent_type: "general-purpose"`, and a descriptive `name`. Substitute the **actual resolved task ID** into all paths — never pass the literal `$TASK_ID`.

Every teammate prompt must include these **coordination rules**:
> Check `TaskList` for available tasks. Claim with `TaskUpdate` (set `owner` to your name), prefer lowest ID first. When your work produces output another teammate needs, use `SendMessage` to notify them by name. Mark tasks completed via `TaskUpdate` when done, then check `TaskList` for next work.

**Spawn these teammates based on scope:**

| Name | Spawn if | Prompt context | Handles |
|---|---|---|---|
| `backend` | backend work exists | Read plan + stack. Follow spring-conventions, jpa-patterns, rest-api-design skills. Message `db` when entities change. Message `frontend` with API contracts. | entities, services, controllers, DTOs, config |
| `db` | DB changes exist | Read plan + stack. Use `liquibase-expert` agent (via Task tool) for Liquibase, or vendor-specific DB agent for Flyway/raw SQL. Message `backend` when migrations are ready. | migrations, indexes, constraints, seed data |
| `frontend` | frontend work exists | Read plan + stack. Follow rest-api-design skill. Ask `backend` for API contracts if not in plan. | components, pages, state, API integration, routing |

**Fullstack rule:** When both backend and frontend work exist, always spawn at least 2 teammates so they work in parallel and communicate API contracts via `SendMessage`.

#### Step 4: Assign Initial Tasks

Use `TaskUpdate` with the `owner` parameter to assign the first unblocked tasks to each teammate. Teammates self-claim subsequent tasks as dependencies resolve.

#### Step 5: Monitor and Finalize

1. Teammate messages arrive automatically — do NOT poll or sleep
2. Use `TaskList` periodically to check progress
3. If stuck, use `SendMessage` to give guidance
4. When all tasks are complete, log to `.claude/pipeline/$TASK_ID/implementation-log.md`
5. Send `shutdown_request` to each teammate via `SendMessage`
6. After all teammates confirm shutdown, clean up with `TeamDelete`

---

### Step 6: Sequential Subagent Fallback

If Agent Teams is not enabled, execute the plan sequentially using the `Task` tool to spawn subagents:

1. DB migration → `liquibase-expert` (if Liquibase) or `mysql-expert` / `oracle-expert`
2. Entity/model → `jpa-expert` (Java) or appropriate backend agent (see tech-router skill)
3. Service/controller → appropriate backend agent
4. Frontend → `angular-expert`

Log each completed step to `.claude/pipeline/$TASK_ID/implementation-log.md`.

---

Update `.claude/pipeline/$TASK_ID/task.md` — mark Phase 3 as `done`.

---

## PHASE 3.5 — Simplify

Run post-implementation cleanup before testing.

1. Spawn `code-simplifier` with the contents of `.claude/pipeline/$TASK_ID/implementation-log.md` as context
2. It will refine recently written code for clarity and consistency without changing behavior
3. Review its changes — reject any that alter functionality or add unneeded abstractions
4. Update `.claude/pipeline/$TASK_ID/implementation-log.md` with simplification changes

---

## PHASE 4 — Test

Generate tests, run them, then analyze test quality.

### Step 1: Generate Tests

Read `.claude/pipeline/$TASK_ID/stack.md` for test framework details. Spawn `test-generator` with `.claude/pipeline/$TASK_ID/implementation-log.md` as context. It generates tests appropriate for the confirmed stack.

### Step 2: Run Tests

Run the test suite using the correct command for the stack:

| Stack | Command |
|---|---|
| Java (Maven) | `mvn test` |
| Java (Gradle) | `./gradlew test` |
| Node.js | `npm test` or `npx vitest` |
| Python | `pytest` |

Report results: total, passed, failed, with error details for each failure.

If failures occur: attempt to fix each failing test, then re-run once. Do not retry in a loop.

### Step 3: Analyze Test Quality

Spawn `test-analyzer` to review test coverage quality. It identifies critical gaps (rated 8–10 on a severity scale) that must be addressed.

For critical gaps: generate additional tests and re-run. If still failing after one fix attempt, report failures with details and continue to Phase 5.

Save all test results to `.claude/pipeline/$TASK_ID/test-results.md`.

Update `.claude/pipeline/$TASK_ID/task.md` — mark Phase 4 as `done`.

---

## PHASE 5 — Review

Run code review, security review, and error-handling audit in parallel.

### Step 1: Spawn Reviewers Concurrently

Spawn all three reviewers simultaneously:
- `code-reviewer` — code quality, readability, maintainability (reports only issues with confidence ≥80)
- `security-reviewer` — OWASP Top 10, authentication, authorization, input validation, data exposure
- `silent-failure-hunter` — silent failures, inadequate error handling, inappropriate fallback behavior

### Step 2: Synthesize Findings

Consolidate all findings grouped by severity:

- **CRITICAL** — must fix before merge (security vulnerabilities, data loss risk, broken functionality)
- **WARNING** — should fix (code quality, performance concerns, missing edge cases)
- **SUGGESTION** — consider for follow-up (refactoring opportunities, style improvements)

### Step 3: Auto-Fix Critical Issues

For each CRITICAL finding:
1. Attempt to fix it directly
2. Re-run the affected reviewer to confirm the fix
3. Document the fix in the review results

### Step 4: Present Final Summary

Present to the user:

```
## Review Summary  [task-id: $TASK_ID]

**CRITICAL: [N] issues** | **WARNING: [N] issues** | **SUGGESTION: [N] issues**

### Critical Issues
[Each issue: file:line — description — fix applied or action required]

### Warnings
[Each issue: file:line — description]

### Suggestions
[Each issue: file:line — description]

---
**Recommendation:** [ready to merge / needs fixes / needs discussion]
**All artifacts:** .claude/pipeline/$TASK_ID/
```

Save review results to `.claude/pipeline/$TASK_ID/review-results.md`.

Update `.claude/pipeline/$TASK_ID/task.md` — mark Phase 5 as `done`, set Status to `completed`.

---

## Phase Output Files

Phases 3–5 produce these files (added to the existing task directory):

```
.claude/pipeline/
└── task-crd-0001/
    ├── task.md                 ← updated manifest
    ├── stack.md                ← from /dev-plan
    ├── analysis.md             ← from /dev-plan
    ├── plan.md                 ← from /dev-plan
    ├── implementation-log.md   ← Phase 3: what was implemented and where
    ├── test-results.md         ← Phase 4: test execution results
    └── review-results.md       ← Phase 5: code and security review findings
```