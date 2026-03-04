---
name: design-md
description: >-
  Extract design tokens from local design images (PNG, JPG, Figma exports,
  screenshots) and generate DESIGN.md with Angular Material M3 theme mapping.
  No external MCP required — uses Claude's native image reading via Read tool.
user-invocable: true
---

# design-md

Extract design tokens from local design images and produce a `DESIGN.md` for your Angular project.

## Input

Provide one or more of:
- Path to a design image: `designs/home.png`, `mockups/checkout.jpg`
- Multiple images covering different screens of the same app
- A folder: `designs/` — glob for images, then read each one

## Workflow

### Step 1: Read Design Images

Use the **Read tool** to load each image. Claude reads PNG, JPG, WebP, and PDF natively.

If the user gives a folder path, use Glob to list `*.{png,jpg,jpeg,webp,pdf}` inside it, then Read each file. Analyze all images before writing anything.

### Step 2: Extract Color Palette

For each distinct color visible, assign a semantic role:

| Role | What to look for |
|---|---|
| Background | Main page/screen background |
| Surface | Card, panel, dialog backgrounds |
| Primary | Brand/action color — filled buttons, links, active states |
| Secondary | Supporting accent — badges, secondary buttons |
| Text Primary | Main body text |
| Text Secondary | Captions, labels, placeholders |
| Text Disabled | Disabled controls |
| Border | Dividers, input outlines, separators |
| Error | Validation errors, destructive actions |
| Success | Confirmation states |
| Warning | Caution/alert states |

Record exact hex values. If a color is not precisely readable, use the closest approximate and mark it `~`.

### Step 3: Extract Typography

- **Font family** — infer from letterforms (geometric, humanist, serif, monospace) or mark as `system-sans`
- For each text level: Display, Headline, Title, Body, Label, Caption → record size, weight, line-height

### Step 4: Extract Spacing & Shape

- **Grid unit**: 4px or 8px (infer from gaps between elements)
- **Container max-width**: widest content area
- **Section padding** / **Card padding** / **Element gap**
- **Border radius — small** (chips, badges) / **medium** (cards, inputs) / **large** (dialogs, sheets)

### Step 5: Component Inventory

List every UI component visible and map to Angular Material:

| Visual Element | Style | Angular Material |
|---|---|---|
| Top bar | Flat / Elevated | `mat-toolbar` |
| Card / Panel | Outlined / Filled | `mat-card` |
| Text input | Outlined / Filled | `mat-form-field + matInput` |
| Dropdown | Outlined / Filled | `mat-select` |
| Checkbox | Standard | `mat-checkbox` |
| Radio | Standard | `mat-radio-group` |
| Toggle | Standard | `mat-slide-toggle` |
| Button (filled) | — | `mat-flat-button` |
| Button (outlined) | — | `mat-stroked-button` |
| Button (text) | — | `mat-button` |
| Icon button | — | `mat-icon-button` |
| Table | Standard | `mat-table` |
| Tabs | Primary / Secondary | `mat-tab-group` |
| Chip | Filter / Assist | `mat-chip-set` |
| Date picker | — | `mat-datepicker` |
| Paginator | — | `mat-paginator` |

### Step 6: Write DESIGN.md

Write `DESIGN.md` to the project root:

````markdown
# [App Name] Design System

## 1. Visual Theme & Atmosphere
[2–3 sentences describing the aesthetic mood inferred from the images]

## 2. Color Palette & Roles

| Name | Hex | Role |
|---|---|---|
| [Descriptive Name] | `#hex` | [Functional role] |

## 3. Typography Rules
- **Font:** [Family] — [description]
- **Display:** [weight] [size]px / [line-height]
- **Headline:** [weight] [size]px / [line-height]
- **Title:** [weight] [size]px / [line-height]
- **Body:** [weight] [size]px / [line-height]
- **Label:** [weight] [size]px / [line-height]
- **Caption:** [weight] [size]px / [line-height]

## 4. Component Stylings
[Describe buttons, cards, inputs, navigation as observed in the images]

## 5. Layout Principles
- Max-width: [value]px
- Base grid: [4px / 8px]
- Section padding: [value]
- Card padding: [value]
- Gap between cards: [value]

## 6. Angular Material Theme

```scss
@use '@angular/material' as mat;

$app-theme: mat.define-theme((
  color: (
    theme-type: [light|dark],
    primary: mat.$[closest-palette]-palette,
  ),
  typography: (
    plain-family: "'[Font]', sans-serif",
  ),
  density: (scale: 0),
));

:root {
  @include mat.all-component-themes($app-theme);
  --mat-app-background-color: [background-hex];
  --mat-app-on-background: [text-primary-hex];
  --mat-app-surface: [surface-hex];
  --mdc-outlined-text-field-outline-color: [border-hex];
}
```

## 7. Design System Block (copy into component prompts)

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: [theme description]
- Background: [Name] ([#hex])
- Surface: [Name] ([#hex])
- Primary Accent: [Name] ([#hex])
- Text Primary: [Name] ([#hex])
- Text Secondary: [Name] ([#hex])
- Borders: [Name] ([#hex])
- Font: [font-family]
- Shape — small: [Xpx] | medium: [Xpx] | large: [Xpx]
- Angular Material: [light|dark] theme, M3 tokens, custom brand overrides
````

### Step 7: Confirm

> "`DESIGN.md` written. Section 7 is ready to paste into any component prompt."

## Rules

- Only record colors that are visibly present — never invent values
- If a role has no visible color (e.g., no error state shown), omit that row
- If multiple images conflict, use the most common value and note the discrepancy
