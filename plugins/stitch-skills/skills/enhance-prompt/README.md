# enhance-prompt

Transforms vague Stitch generation prompts into structured, Angular-specific prompts using Angular Material component vocabulary and UI/UX keywords.

## Install

```bash
bash plugins/stitch-skills/install.sh
```

## Example Prompt

```
Enhance this Stitch prompt for an Angular app: "user profile page with edit form"
```

## What It Produces

A structured prompt with:
- Design system block (from `DESIGN.md` if available)
- Angular Material component vocabulary
- Numbered page structure with Angular-specific component names
- Interaction notes (routing, forms, dialogs, snackbars)

## Skill Structure

```
enhance-prompt/
├── SKILL.md
├── README.md
└── references/
    └── KEYWORDS.md
```
