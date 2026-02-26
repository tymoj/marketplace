# Advanced Skill Patterns

## Running Skills in Subagents

Add `context: fork` to run a skill in isolation. The skill content becomes the subagent's prompt without access to conversation history.

**Warning:** `context: fork` only makes sense for skills with explicit task instructions. Guidelines-only skills ("use these conventions") produce no meaningful output in a subagent.

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

The `agent` field specifies the subagent type: built-in (`Explore`, `Plan`, `general-purpose`) or custom from `.claude/agents/`. Defaults to `general-purpose`.

### Skills vs Subagents

| Approach                     | System prompt                             | Task                        |
| :--------------------------- | :---------------------------------------- | :-------------------------- |
| Skill with `context: fork`   | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content            |
| Subagent with `skills` field | Subagent's markdown body                  | Claude's delegation message |

## Dynamic Context Injection

The `` !`command` `` syntax runs shell commands before skill content reaches Claude. Output replaces the placeholder.

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

This is preprocessing - Claude only sees the final rendered output with actual data.

## Visual Output Generation

Skills can bundle scripts that generate interactive HTML files for data visualization:

```
codebase-visualizer/
├── SKILL.md
└── scripts/
    └── visualize.py    # Generates interactive HTML
```

SKILL.md instructs Claude to run the script:

````yaml
---
name: codebase-visualizer
description: Generate interactive tree visualization of your codebase
allowed-tools: Bash(python *)
---

Run the visualization script:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```
````

This pattern works for dependency graphs, test coverage, API docs, or schema visualizations.

## Extended Thinking

Include the word "ultrathink" anywhere in skill content to enable extended thinking mode.

## Skill Permissions

Three ways to control Claude's skill access:

1. **Disable all skills**: Deny `Skill` tool in `/permissions`
2. **Allow/deny specific skills**: `Skill(commit)` for exact match, `Skill(deploy *)` for prefix match
3. **Hide individual skills**: Add `disable-model-invocation: true` to frontmatter

## Skill Storage Locations

| Location   | Path                                                     | Applies to                     |
| :--------- | :------------------------------------------------------- | :----------------------------- |
| Enterprise | Managed settings                                         | All users in your organization |
| Personal   | `~/.claude/skills/<skill-name>/SKILL.md`                 | All your projects              |
| Project    | `.claude/skills/<skill-name>/SKILL.md`                   | This project only              |
| Plugin     | `<plugin>/skills/<skill-name>/SKILL.md`                  | Where plugin is enabled        |

Priority: enterprise > personal > project. Plugin skills use `plugin-name:skill-name` namespace (no conflicts).

Skills in nested `.claude/skills/` directories are auto-discovered (supports monorepos). Skills from `--add-dir` directories are also loaded automatically.

## Context Budget

Skill descriptions share a context budget of 2% of the context window (fallback: 16,000 chars). If many skills exceed the budget, some are excluded. Check with `/context`. Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var.