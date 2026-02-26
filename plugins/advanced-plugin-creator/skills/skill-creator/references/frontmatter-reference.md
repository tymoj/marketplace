# Frontmatter Reference

Complete reference for all YAML frontmatter fields in SKILL.md files.

## Field Summary

| Field                      | Required    | Description                                                          |
| :------------------------- | :---------- | :------------------------------------------------------------------- |
| `name`                     | No          | Display name and `/slash-command`. Defaults to directory name.       |
| `description`              | Recommended | What the skill does and when to use it. Primary trigger mechanism.   |
| `argument-hint`            | No          | Autocomplete hint, e.g. `[issue-number]` or `[filename] [format]`.  |
| `disable-model-invocation` | No          | `true` = only user can invoke via `/name`. Default: `false`.         |
| `user-invocable`           | No          | `false` = hidden from `/` menu, only Claude invokes. Default: `true`.|
| `allowed-tools`            | No          | Tools Claude can use without permission when skill is active.        |
| `model`                    | No          | Model to use when this skill is active.                              |
| `context`                  | No          | Set to `fork` to run in an isolated subagent context.                |
| `agent`                    | No          | Subagent type when `context: fork` is set (e.g. `Explore`, `Plan`). |
| `hooks`                    | No          | Hooks scoped to this skill's lifecycle.                              |

## Invocation Control

The combination of `disable-model-invocation` and `user-invocable` controls who can trigger the skill:

| Frontmatter                      | User invokes | Claude invokes | Context loading                                              |
| :------------------------------- | :----------- | :------------- | :----------------------------------------------------------- |
| (default)                        | Yes          | Yes            | Description always in context, body loads when invoked        |
| `disable-model-invocation: true` | Yes          | No             | Description NOT in context, body loads when user invokes      |
| `user-invocable: false`          | No           | Yes            | Description always in context, body loads when invoked        |

Use `disable-model-invocation: true` for workflows with side effects (deploy, commit, send messages).
Use `user-invocable: false` for background knowledge that isn't actionable as a command.

## Writing Effective Descriptions

The `description` is the primary trigger mechanism. Claude uses it to decide when to load the skill.

- Include both WHAT the skill does and WHEN to use it
- Include all trigger information here, not in the body (body only loads after triggering)
- Max 1024 characters

**Good example:**
```yaml
description: Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when Claude needs to work with professional documents (.docx files) for creating new documents, modifying content, working with tracked changes, or adding comments.
```

## String Substitutions

Available in skill content (body), replaced before Claude sees the content:

| Variable               | Description                                          |
| :--------------------- | :--------------------------------------------------- |
| `$ARGUMENTS`           | All arguments passed when invoking the skill         |
| `$ARGUMENTS[N]`        | Specific argument by 0-based index                   |
| `$N`                   | Shorthand for `$ARGUMENTS[N]`                        |
| `${CLAUDE_SESSION_ID}` | Current session ID                                   |

If `$ARGUMENTS` is not present in content, arguments are appended as `ARGUMENTS: <value>`.

**Example:**
```yaml
---
name: fix-issue
description: Fix a Gitlab issue
disable-model-invocation: true
---
Fix Gitlab issue $ARGUMENTS following our coding standards.
```

Running `/fix-issue 123` produces: "Fix Gitlab issue 123 following our coding standards."

**Positional arguments example:**
```yaml
---
name: migrate-component
description: Migrate a component between frameworks
---
Migrate the $0 component from $1 to $2.
```

Running `/migrate-component SearchBar React Vue` replaces `$0` with `SearchBar`, etc.

## Argument Hints

Use `argument-hint` to show expected arguments during autocomplete:

```yaml
---
name: fix-issue
argument-hint: "[issue-number]"
---
```

## Allowed Tools

Restrict which tools Claude can use when the skill is active:

```yaml
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read, Grep, Glob
---
```

## Complete Examples

### User-only task skill
```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
context: fork
allowed-tools: Bash(npm *), Bash(git *)
---
```

### Background knowledge skill
```yaml
---
name: api-conventions
description: API design patterns for this codebase
user-invocable: false
---
```

### Research skill in subagent
```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---
```