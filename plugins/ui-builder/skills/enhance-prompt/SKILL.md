---
name: enhance-prompt
description: >-
  Transforms a rough design description or image analysis into a structured,
  detailed Angular component specification. Produces a prompt ready to paste
  into image-to-angular or ui-loop.
user-invocable: true
---

# enhance-prompt

Turn a vague component description or quick image observation into a precise Angular Material component specification.

## Input

One of:
- A rough description: "a checkout form with name, email, address, and payment fields"
- An image path: `designs/dashboard.png` — skill reads and analyzes it
- A partial spec: anything the user has already written about the component

## Workflow

### Step 1: Understand the Input

If an image path is provided, use the **Read tool** to load it and analyze it before writing anything.

If a text description is provided, identify what is known and what is ambiguous.

### Step 2: Resolve Ambiguities

For each ambiguous element, make a concrete decision using Angular Material best practices:
- "a form" → list every field with type, label, placeholder, validators
- "a table" → specify columns, sortable/filterable, paginated, row actions
- "a dashboard" → list cards, what metric each shows, chart type if any
- "navigation" → top toolbar or sidenav, items, active state
- "a modal" → what triggers it, its content, confirm/cancel actions

Do not ask the user — make sensible decisions and document them.

### Step 3: Write the Enhanced Specification

Output a structured prompt in this format:

```
[One-line description of what this screen is and does]

**DESIGN SYSTEM (REQUIRED):**
[Paste Section 7 from DESIGN.md if available, or describe colors/font/theme]

**Angular Component Structure:**
- Layout: [Full-width page / Centered card / Sidebar + content / Grid]
- Container: [max-width value]px centered
- Header: [Shared mat-toolbar / Page-specific header / None]
- Data: [Mock data / resource() from HTTP service / FormBuilder]
- Change detection: OnPush
- Standalone: true

**Page Structure:**
1. **[Section Name]:** [Angular Material components] — [description]
2. **[Section Name]:** [Angular Material components] — [description]
...

**Form Fields (if applicable):**
| # | Label | Type | Placeholder | Required | Validators | Error message |
|---|---|---|---|---|---|---|
| 1 | [label] | [input type] | [placeholder] | [yes/no] | [Validators.x] | [message] |

**States to Implement:**
- Default: [description]
- Loading: [skeleton / spinner — which components]
- Empty: [mat-icon + heading + action button]
- Error: [inline error / snackbar / error card]
- [Other states visible in design]

**Angular Material Imports Required:**
- [MatXxxModule]
- [MatYyyModule]
```

### Step 4: Deliver

Output the enhanced specification. The user can paste it directly into the `ui-loop` baton or the `image-to-angular` skill.

## Angular Material Vocabulary Reference

See `references/KEYWORDS.md` for the complete component name and vocabulary mapping.
