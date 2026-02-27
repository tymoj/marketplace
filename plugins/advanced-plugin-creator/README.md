# advanced-plugin-creator

Guide for creating, validating, and packaging Claude Code plugins and skills. Includes best practices, frontmatter reference, helper scripts, and a structured plugin quality reviewer.

## Installation

```bash
claude plugin install advanced-plugin-creator@<marketplace-name>
```

Or load locally for testing:

```bash
claude --plugin-dir ./plugins/advanced-plugin-creator
```

## Skills

### skill-creator

Interactive guide for creating effective Claude Code skills.

```
/advanced-plugin-creator:skill-creator [what the skill should do]
```

Covers:
- Skill structure and SKILL.md authoring
- Frontmatter fields and triggering behavior
- Progressive disclosure (metadata, body, supporting files)
- Degrees of freedom (text vs pseudocode vs scripts)
- Bundled helper scripts for scaffolding and packaging

### validate-plugin

Audits a Claude Code plugin for quality and correctness. Evaluates structure, purpose correctness (Skill vs Agent), invocation design, content quality, and cross-plugin coherence.

```
/advanced-plugin-creator:validate-plugin <path-to-plugin-directory>
```

Produces a structured report with:
- Skill review (structure, purpose, invocation, content quality)
- Agent review (role clarity, tool permissions, prompt quality)
- Cross-component coherence analysis
- Scorecard with actionable improvement suggestions

## Helper Scripts

Located in `skills/skill-creator/scripts/`:

| Script | Purpose |
|--------|---------|
| `init_skill.py` | Scaffold a new skill directory |
| `package_skill.py` | Package a skill for distribution |
| `quick_validate.py` | Quick validation of skill structure |

## Requirements

- Claude Code v1.0.33+
