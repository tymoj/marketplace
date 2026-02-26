---
name: validate-plugin
description: Audit a Claude Code plugin for quality and correctness. Use when the user wants to review, validate, or get improvement suggestions for a plugin's skills and agents. Evaluates structure, purpose correctness (Skill vs Agent), invocation design, content quality, and cross-plugin coherence. Produces a structured report with a scorecard.
argument-hint: "<path-to-plugin-directory>"
---

# Plugin Quality Reviewer

Audit the plugin at `$ARGUMENTS` (or ask the user to provide the path if not given).

Read every `skills/*/SKILL.md` and every `agents/*.md` file in the plugin directory. Then produce a structured review report following the parts below.

---

## PART 1 — SKILL REVIEW

For each skill in `skills/*/SKILL.md`, evaluate:

### 1.1 Structure & Syntax
- Does the file exist at the correct path (`skills/<name>/SKILL.md`)?
- Is YAML frontmatter present and valid?
- Does `name` follow the rules: max 64 chars, lowercase letters/numbers/hyphens only, no XML tags, no reserved words?
- Is `description` present, non-empty, under 1024 chars, and free of XML tags?
- Is the SKILL.md body under 500 lines? Flag if not.

### 1.2 Purpose Correctness
- Is this genuinely a **Skill** (reusable expertise / "how to do X" knowledge injected into context)?
- Or is it behaving like an **Agent** (doing isolated multi-step work that should run in its own context window)? Flag if so.
- Is the skill focused on a single, coherent domain or task?

### 1.3 Invocation Design
- Is the `description` written so Claude can semantically match it to user requests? Does it contain natural trigger phrases?
- If `disable-model-invocation: true` is set, is manual-only invocation appropriate for this use case?
- If `agent:` is specified, is forking to a subagent appropriate here?

### 1.4 Content Quality
- Are instructions clear, step-by-step, and actionable?
- Are bundled scripts (if any) necessary and do they serve a deterministic task better handled as code than prose?
- Does the skill use progressive disclosure (core instructions in SKILL.md, details in referenced files) rather than dumping everything inline?
- Are there any signs of security risk (e.g., scripts that could exfiltrate data, overly broad tool permissions)?

### 1.5 Improvement Suggestions
Provide up to 3 concrete improvement suggestions per skill.

---

## PART 2 — AGENT REVIEW

For each agent in `agents/*.md`, evaluate:

### 2.1 Structure & Syntax
- Is the file a single `.md` file (not a directory) inside `agents/`?
- Does it have valid YAML frontmatter with `name` and `description`?
- Is the `description` clear about **when Claude should invoke this agent** (not just what it does)?

### 2.2 Purpose Correctness
- Is this genuinely an **Agent** (isolated, multi-step task execution with its own context window)?
- Or is it behaving like a **Skill** (just providing instructions or reference knowledge)? Flag if so.
- Does the agent have a clearly bounded, specific task — or is it too broad?

### 2.3 System Prompt Quality
- Does the system prompt clearly define the agent's role, expertise, and behavior?
- Are tool restrictions (`allowed-tools`) specified appropriately — not too permissive, not unnecessarily limited?
- Does the agent know when to stop and return results to the main conversation?
- Is there any risk of the agent overstepping (e.g., write access when only reads are needed)?

### 2.4 Skill/Agent Relationship
- Does the agent correctly leverage Skills for reusable knowledge rather than duplicating that knowledge in its own prompt?
- Is there overlap between agent prompts and existing skills that should be consolidated?

### 2.5 Improvement Suggestions
Provide up to 3 concrete improvement suggestions per agent.

---

## PART 3 — CROSS-PLUGIN ANALYSIS

1. **Role confusion list**: Enumerate any components in the wrong category (Skill doing Agent work, or vice versa) with a recommended fix.
2. **Overlap / redundancy**: Identify skills or agents whose responsibilities overlap significantly.
3. **Missing pieces**: Based on the plugin's apparent purpose, are there Skills or Agents that are missing and would improve coherence?
4. **Namespace check**: Do skill names follow the `plugin-name:skill-name` pattern if needed? Any naming conflicts?

---

## OUTPUT FORMAT

Produce the report in this structure:

```
## Plugin Review: <plugin name>

### Skills
#### <skill-name>
- Structure: ✅ / ⚠️ / ❌  [brief note]
- Purpose: ✅ correct Skill usage / ⚠️ should be an Agent / ❌ [issue]
- Invocation: ✅ / ⚠️ / ❌  [brief note]
- Content quality: ✅ / ⚠️ / ❌  [brief note]
- Suggestions:
  1. ...
  2. ...

### Agents
#### <agent-name>
- Structure: ✅ / ⚠️ / ❌  [brief note]
- Purpose: ✅ correct Agent usage / ⚠️ should be a Skill / ❌ [issue]
- System prompt quality: ✅ / ⚠️ / ❌  [brief note]
- Tool permissions: ✅ / ⚠️ / ❌  [brief note]
- Suggestions:
  1. ...
  2. ...

### Cross-Plugin Analysis
- Role confusion: ...
- Overlap: ...
- Missing pieces: ...
- Namespace: ...

### Summary scorecard
| Component | Type | Purpose ✅/⚠️/❌ | Quality ✅/⚠️/❌ | Priority fix |
|-----------|------|----------------|----------------|--------------|
| ...       | Skill/Agent | ... | ... | ... |
```

Be specific and actionable. Reference exact file paths, frontmatter fields, and line-level issues where possible.