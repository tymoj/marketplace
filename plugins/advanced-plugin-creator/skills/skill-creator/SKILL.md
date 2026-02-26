---
name: skill-creator
description: Guide for creating effective skills. Use when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations. Also use when users ask about skill best practices, frontmatter fields, or skill structure.
---

# Skill Creator

Skills are modular packages that extend Claude's capabilities. They follow the [Agent Skills](https://agentskills.io) open standard. A skill is a directory with a `SKILL.md` entrypoint and optional supporting files.

## Core Principles

### Concise is Key

The context window is a shared resource. Only add context Claude doesn't already have. Prefer concise examples over verbose explanations. Challenge each piece: "Does Claude really need this?"

### Set Appropriate Degrees of Freedom

- **High freedom** (text instructions): Multiple valid approaches, context-dependent decisions
- **Medium freedom** (pseudocode/parameterized scripts): Preferred pattern with acceptable variation
- **Low freedom** (specific scripts, few params): Fragile operations, consistency-critical sequences

### Progressive Disclosure

Skills use three-level loading to manage context:

1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - Loaded when skill triggers (keep under 500 lines)
3. **Supporting files** - Loaded as needed by Claude (unlimited)

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── reference.md       # Detailed docs (loaded when needed)
├── examples/          # Example outputs
└── scripts/
    └── helper.py      # Executable scripts
```

### SKILL.md (required)

Two parts:

- **Frontmatter** (YAML between `---` markers): Controls triggering and behavior
- **Body** (Markdown): Instructions loaded after the skill triggers

### Frontmatter Fields

Only `description` is formally recommended. All fields are optional:

| Field                      | Description                                                          |
| :------------------------- | :------------------------------------------------------------------- |
| `name`                     | Display name and `/slash-command`. Defaults to directory name.       |
| `description`              | What the skill does and WHEN to use it. Primary trigger mechanism.   |
| `argument-hint`            | Autocomplete hint, e.g. `[issue-number]`.                           |
| `disable-model-invocation` | `true` = only user can invoke. For side-effect workflows.            |
| `user-invocable`           | `false` = hidden from `/` menu. For background knowledge.           |
| `allowed-tools`            | Tools allowed without permission when skill is active.               |
| `model`                    | Model to use when skill is active.                                   |
| `context`                  | `fork` to run in isolated subagent.                                  |
| `agent`                    | Subagent type with `context: fork` (e.g. `Explore`, `Plan`).        |
| `hooks`                    | Hooks scoped to skill lifecycle.                                     |

**Critical**: The `description` is the primary trigger. Include both WHAT the skill does and WHEN to use it. All trigger info goes here, not in the body (body only loads after triggering).

For complete field documentation and examples, see [references/frontmatter-reference.md](references/frontmatter-reference.md).

### Supporting Files

Reference files from SKILL.md so Claude knows they exist and when to load them:

```markdown
## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

**scripts/**: Executable code for deterministic/repeated operations. Token-efficient, can be executed without loading into context.

**references/**: Documentation loaded into context as needed. For files >100 lines, include a table of contents. If >10k words, include grep patterns in SKILL.md.

**assets/**: Files used in output (templates, images, fonts). Not loaded into context.

**Guidelines:**
- Keep references one level deep from SKILL.md
- Information lives in SKILL.md OR reference files, not both
- Keep only essential workflow guidance in SKILL.md; move detailed material to reference files
- Delete any supporting directories not needed by the skill

### What NOT to Include

Do not create extraneous files: README.md, INSTALLATION_GUIDE.md, CHANGELOG.md, etc. Skills are for AI agents, not human documentation.

## Advanced Features

For subagent execution (`context: fork`), dynamic context injection (`` !`command` ``), string substitutions (`$ARGUMENTS`, `$N`), visual output, permissions, and storage locations, see [references/advanced-patterns.md](references/advanced-patterns.md).

## Progressive Disclosure Patterns

When a skill supports multiple variations or frameworks, keep core workflow in SKILL.md and move variant details to reference files:

**Pattern 1: High-level guide with references**
```markdown
# PDF Processing
## Quick start
[code example]
## Advanced features
- **Form filling**: See [forms.md](forms.md)
- **API reference**: See [reference.md](reference.md)
```

**Pattern 2: Domain-specific organization**
```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── references/
    ├── finance.md
    ├── sales.md
    └── product.md
```

**Pattern 3: Framework variants**
```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

## Skill Creation Process

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (run package_skill.py)
6. Iterate based on real usage

### Step 1: Understand with Concrete Examples

Skip only when usage patterns are already clear. Ask targeted questions:

- "What functionality should this skill support?"
- "Can you give examples of how this would be used?"
- "What would a user say that should trigger this skill?"

Avoid overwhelming users with too many questions at once.

### Step 2: Plan Reusable Contents

For each example, consider:
1. How to execute from scratch
2. What scripts, references, and assets would help when doing this repeatedly

Examples:
- Rotating PDFs repeatedly → `scripts/rotate_pdf.py`
- Building frontends repeatedly → `assets/hello-world/` template
- Querying BigQuery → `references/schema.md` with table schemas

### Step 3: Initialize the Skill

Skip if iterating on an existing skill. For new skills:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

Creates skill directory with SKILL.md template and example resource directories.

### Step 4: Edit the Skill

The skill is for another Claude instance to use. Include non-obvious procedural knowledge and domain-specific details.

#### Consult Design Pattern Guides

- **Multi-step processes**: See [references/workflows.md](references/workflows.md)
- **Output formats and quality**: See [references/output-patterns.md](references/output-patterns.md)

#### Implementation Order

1. Start with reusable resources (scripts, references, assets). May require user input (e.g., brand assets, templates).
2. Test scripts by running them. For many similar scripts, test a representative sample.
3. Delete unneeded example files from initialization.
4. Write SKILL.md using imperative/infinitive form.

#### Writing the Frontmatter

- `name`: Kebab-case, max 64 characters
- `description`: Include what + when. Max 1024 characters. This is the trigger mechanism.
- Add `disable-model-invocation: true` for skills with side effects (deploy, commit)
- Add `user-invocable: false` for background knowledge skills
- Add `context: fork` and `agent` for skills that should run in isolation
- Add `allowed-tools` to restrict tool access
- See [references/frontmatter-reference.md](references/frontmatter-reference.md) for complete field docs

#### Writing the Body

Focus on instructions Claude needs after triggering. Do NOT put "When to Use" sections in the body (this info belongs in the description).

### Step 5: Package the Skill

```bash
scripts/package_skill.py <path/to/skill-folder> [output-directory]
```

Validates automatically, then creates a distributable `.skill` file (zip format).

### Step 6: Iterate

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Update SKILL.md or resources
4. Test again