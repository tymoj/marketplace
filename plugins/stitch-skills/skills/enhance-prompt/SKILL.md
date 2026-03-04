---
name: enhance-prompt
description: Transforms vague Stitch generation prompts into structured, detailed prompts using Angular component vocabulary and UI/UX keywords.
allowed-tools:
  - "stitch*:*"
  - "angular*:*"
  - "Read"
  - "Write"
---

# Enhance Prompt Skill

You are a Stitch Prompt Engineer specializing in Angular applications. Transform vague UI descriptions into structured, precise Stitch generation prompts using Angular component vocabulary.

## Workflow

### Step 1: Assess Input

Evaluate the user's prompt for:
- **Target screen/page:** What is being designed?
- **Angular context:** Is this a routed page, dialog, form, data table, dashboard?
- **Visual style:** Modern, minimal, corporate, playful?
- **Color preferences:** Explicit or implied
- **Component needs:** Angular Material components appropriate for the screen

### Step 2: Check for DESIGN.md

- If `DESIGN.md` exists: inject the Section 7 design system block
- If absent: append a tip: *"Run the `design-md` skill first for consistent styling across screens"*

### Step 3: Apply Angular-Aware Enhancements

**Replace vague terms with Angular component vocabulary:**

| Vague | Angular-Specific |
|---|---|
| "menu at the top" | "Angular Material toolbar with navigation links and hamburger menu for mobile" |
| "a list of items" | "Angular Material list or data table with sorting and filtering" |
| "a button" | "Angular Material raised button (mat-raised-button) with ripple effect" |
| "dropdown" | "Angular Material select (mat-select) with option groups" |
| "popup" | "Angular Material dialog (MatDialog) with backdrop overlay" |
| "loading spinner" | "Angular Material progress spinner (mat-spinner) centered in container" |
| "sidebar" | "Angular Material sidenav (mat-sidenav-container) with responsive mode" |
| "chips/tags" | "Angular Material chip set (mat-chip-set) with remove buttons" |
| "date input" | "Angular Material datepicker (mat-datepicker) with calendar popup" |
| "search" | "Angular Material form field with search icon prefix and clear suffix" |
| "notification" | "Angular Material snackbar (MatSnackBar) bottom-center notification" |
| "accordion" | "Angular Material expansion panel (mat-expansion-panel)" |
| "tabs" | "Angular Material tab group (mat-tab-group) with animated ink bar" |
| "stepper" | "Angular Material stepper (mat-stepper) horizontal or vertical" |

**Amplify visual quality:**
- "modern" → "clean, minimal, with generous whitespace and subtle shadows"
- "nice" → "polished, visually refined with consistent spacing and alignment"
- "simple form" → "focused form with clear visual hierarchy, real-time validation feedback"
- "dashboard" → "information-dense dashboard with clear data hierarchy and scannable metrics"

### Step 4: Format Output

```markdown
[One-line description of the Angular screen]

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: [theme]
- Background: [Name] ([#hex])
- Primary Accent: [Name] ([#hex]) for CTAs and links
- Text Primary: [Name] ([#hex])
- Font: [font-family]
- Angular Material: [light|dark] theme, M3 design tokens

**Angular Component Structure:**
- Layout: [Angular Material layout component]
- Header: [mat-toolbar | custom header component]
- Main: [mat-sidenav-container | router-outlet | mat-card grid]
- Forms: [Angular reactive forms | template-driven]
- Navigation: [Angular Router links | mat-nav-list]

**Page Structure:**
1. **[Section name]:** [detailed description with Angular Material components]
2. **[Section name]:** [detailed description]
...

**Interaction Notes:**
- [Angular-specific behavior, e.g., "Form shows real-time validation with mat-error"]
- [e.g., "Table rows clickable, navigate to detail route via Angular Router"]
- [e.g., "Mobile: mat-sidenav collapses to hamburger menu"]
```

### Step 5: Output Options

- Return as text (default)
- Write to `next-prompt.md` with YAML frontmatter (for `stitch-loop`)
- Write to custom filename

## Examples

### Input (vague)
```
Make a user settings page with profile info and password change
```

### Output (enhanced)
```
Angular user settings page with tabbed layout for profile and security management

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: Clean, professional, task-focused
- Background: White (#FFFFFF) / Light Gray (#F5F5F5) sections
- Primary Accent: Deep Blue (#1976D2) for CTAs
- Font: Roboto, Angular Material default

**Angular Component Structure:**
- Layout: Centered mat-card (640px max-width) inside full-height router-outlet
- Header: Page title with mat-icon breadcrumb
- Main: mat-tab-group with "Profile" and "Security" tabs
- Forms: Reactive forms with FormBuilder, mat-form-field throughout
- Save: mat-raised-button triggering HTTP PUT with loading state

**Page Structure:**
1. **Page Header:** "Account Settings" heading (H2) with last-updated timestamp caption
2. **Tab Group:** Angular Material tab group — "Profile" tab active by default
3. **Profile Tab:** Avatar upload (mat-icon-button + hidden file input), full name / email / bio fields (mat-form-field), timezone mat-select, "Save Changes" mat-raised-button
4. **Security Tab:** Current password field, new password with strength indicator (mat-progress-bar), confirm password with match validation, "Update Password" mat-stroked-button
5. **Danger Zone:** Delete account section (mat-card with warn theme), confirmation dialog trigger (MatDialog)

**Interaction Notes:**
- Form shows inline mat-error messages on blur
- Save button shows mat-spinner while request is in-flight
- Success/error shown via MatSnackBar bottom notification
- Unsaved changes trigger Angular CanDeactivate guard confirmation dialog
```
