---
name: dev-init
description: >-
  Bootstrap pipeline files without running the full pipeline. Generates a task ID,
  auto-detects the tech stack, and asks what was implemented — then writes stack.md,
  implementation-log.md, and task.md so individual agents (test-generator, dev-sync,
  code-reviewer, etc.) can be run standalone. Use when you've already written code
  and want to run a single pipeline phase without the full /dev-plan + /dev-build flow.
  Invoke as /dev-init [optional description].
user-invocable: true
argument-hint: "[optional: short description of what was implemented]"
context: fork
agent: sonnet
allowed-tools: Read, Write, Bash
---

# Dev Init — Bootstrap Pipeline Files

You create the minimum pipeline context needed to run individual pipeline agents
(`test-generator`, `code-reviewer`, `dev-sync`, etc.) without running the full pipeline.

**Description:** $ARGUMENTS

---

## STEP 1 — Generate Task ID

```bash
LAST=$(ls -d .claude/pipeline/task-crd-* 2>/dev/null | grep -oE '[0-9]+$' | sort -n | tail -1)
NEXT=$(printf '%04d' $(( ${LAST:-0} + 1 )))
TASK_ID="task-crd-${NEXT}"
mkdir -p ".claude/pipeline/${TASK_ID}"
echo "Task ID: ${TASK_ID}"
```

Hold the resolved `TASK_ID` in memory for all remaining steps.

---

## STEP 2 — Detect Stack

Run these commands to identify the tech stack:

```bash
# Build files
ls pom.xml build.gradle build.gradle.kts package.json requirements.txt pyproject.toml Cargo.toml go.mod 2>/dev/null || echo "none found"

# Java/Spring version
grep -h "spring-boot\|java.version\|sourceCompatibility" pom.xml build.gradle build.gradle.kts 2>/dev/null | head -5 || echo "not a Java project"

# Node.js frameworks
cat package.json 2>/dev/null | grep -E '"react"|"vue"|"angular"|"next"|"nuxt"|"svelte"|"express"|"fastify"|"nestjs"|"typescript"' | sed 's/[[:space:]]//g' | head -10 || echo "no package.json"

# Database
grep -rh "datasource.url\|DATABASE_URL\|jdbc:oracle:thin\|jdbc:mysql\|jdbc:postgresql\|jdbc:tidb" src/ .env .env.example application*.yml application*.properties 2>/dev/null | head -5 || echo "no datasource config found"

# Migration tool
grep -rh "liquibase\|flyway" pom.xml build.gradle build.gradle.kts application*.yml application*.properties 2>/dev/null | head -5 || echo "no migration tool detected"

# Python framework
grep -hE "fastapi|django|flask|sqlalchemy|alembic" requirements.txt pyproject.toml setup.py 2>/dev/null | head -5 || echo "not a Python project"

# Test framework
grep -rh "junit\|testng\|jest\|vitest\|pytest\|cypress\|playwright" pom.xml build.gradle package.json requirements.txt 2>/dev/null | grep -v "node_modules" | head -5 || echo "no test config found"
```

From the results, extract: language, framework, framework version, database vendor, migration tool, test framework, build tool.

---

## STEP 3 — Ask One Question

Present the detected stack and ask the user to describe what was implemented:

> I detected: **[stack summary]**.
>
> To set up the pipeline context, please describe what you implemented:
>
> 1. **What feature or change did you make?** (1–2 sentences)
> 2. **Which files were created or modified?** (list paths)
> 3. **What does each changed file do?** (one line per file is enough)
> 4. **Is the stack detection above correct?** If not, what should it be?

Wait for the user's answer before writing any files.

---

## STEP 4 — Write Pipeline Files

### `stack.md`

Save to `.claude/pipeline/$TASK_ID/stack.md`:

```markdown
# Confirmed Stack

- Task ID: $TASK_ID
- Language: [e.g., Java 21]
- Framework: [e.g., Spring Boot 3.2]
- Database: [e.g., MySQL 8]
- Migration tool: [e.g., Flyway / Liquibase / none]
- Build tool: [e.g., Maven]
- Test framework: [e.g., JUnit 5 + Mockito]
- Frontend: [e.g., Angular 17 / none]
- Scope: [backend / frontend / fullstack]
```

### `implementation-log.md`

Save to `.claude/pipeline/$TASK_ID/implementation-log.md`:

```markdown
# Implementation Log

**Task ID:** $TASK_ID
**Description:** $ARGUMENTS
**Created via:** /dev-init (manual bootstrap — no full pipeline run)

## Summary

[1–2 sentence summary from the user's description]

## Changed Files

| File | Action | Description |
|---|---|---|
| [path] | created / modified | [one-line description] |
```

### `task.md`

Save to `.claude/pipeline/$TASK_ID/task.md`:

```markdown
# Task: $ARGUMENTS

- **Task ID**: $TASK_ID
- **Started**: [current date + time]
- **Status**: implementation_done
- **Stack**: [stack summary]
- **Scope**: [backend / frontend / fullstack]
- **Bootstrap**: manual (/dev-init)

## Phase Log

| Phase | Status | Output file |
|---|---|---|
| 0 — Stack confirmation | done | stack.md |
| 1 — Discovery & analysis | skipped | — |
| 2 — Plan | skipped | — |
| 3 — Implementation | done | implementation-log.md |
| 3.5 — Simplify | pending | — |
| 4 — Test | pending | test-results.md |
| 5 — Review | pending | review-results.md |
```

---

## STEP 5 — Output Summary

Print a clean summary:

```
## Pipeline Initialized  [task-id: $TASK_ID]

stack.md              ✓  [stack summary]
implementation-log.md ✓  [N files logged]
task.md               ✓

You can now run individual pipeline phases:

  /conductor:dev-build $TASK_ID          — run phases 3.5–5 (simplify, test, review)
  /conductor:dev-sync  $TASK_ID          — reconcile after manual changes

Or invoke agents directly:
  "Use the test-generator agent for task $TASK_ID"
  "Use the code-reviewer agent for task $TASK_ID"
  "Use the security-reviewer agent for task $TASK_ID"
```