# Image Analysis Guide

Use this checklist when analyzing a design image before generating an Angular component.

## 1. Overall Layout

- [ ] What is the page structure? (centered card / full-width / sidebar+content / grid / split-pane)
- [ ] What is the approximate container max-width?
- [ ] How many columns? Does it appear to be responsive?
- [ ] Is there a fixed header / sticky navbar?
- [ ] Is there a sidebar? Is it collapsible?

## 2. Color Extraction

For each distinct color, identify its role:

| Role | Look for |
|---|---|
| Background | Outermost fill / page color |
| Surface | Card, panel, modal fills |
| Primary | Filled buttons, active tabs, links, highlighted elements |
| Secondary | Secondary buttons, badges, accents |
| Text Primary | Main body text, headings |
| Text Secondary | Captions, labels, placeholder text, helper text |
| Border | Input outlines, dividers, table borders |
| Error | Red-tinted inputs, error messages |
| Success | Green-tinted elements, success banners |

Record as hex. Mark uncertain values with `~`.

## 3. Typography

- [ ] What is the font family? (infer: geometric = Manrope/Poppins; humanist = Inter; transitional = Source Sans; serif = Playfair/Merriweather)
- [ ] Heading sizes (H1, H2, H3) — estimate in px
- [ ] Body text size
- [ ] Label / caption size
- [ ] Font weight: light (300), regular (400), medium (500), semibold (600), bold (700)

## 4. Component Inventory

Scan every visible element and record:

| # | Visual Element | Angular Material | State visible |
|---|---|---|---|
| 1 | [what you see] | [mat-xxx] | default / hover / active / disabled / error |

Common Angular Material mappings:

| Visual | Material |
|---|---|
| Top bar with logo + nav | `mat-toolbar` |
| Card / panel / section box | `mat-card` |
| Text input (outlined border) | `mat-form-field appearance="outline"` + `matInput` |
| Text input (filled background) | `mat-form-field appearance="fill"` + `matInput` |
| Dropdown / select | `mat-select` inside `mat-form-field` |
| Checkbox | `mat-checkbox` |
| Radio buttons | `mat-radio-group` + `mat-radio-button` |
| Toggle switch | `mat-slide-toggle` |
| Filled / raised button | `mat-flat-button` or `mat-raised-button` |
| Outlined button | `mat-stroked-button` |
| Text-only button | `mat-button` |
| Icon-only button | `mat-icon-button` |
| Floating action button | `mat-fab` or `mat-mini-fab` |
| Data table | `mat-table` with `matSort`, `matPaginator` |
| List of items | `mat-list` + `mat-list-item` |
| Horizontal / vertical tabs | `mat-tab-group` |
| Accordion / expansion panel | `mat-expansion-panel` |
| Chips / tags | `mat-chip-set` + `mat-chip` |
| Filter chips | `mat-chip-listbox` |
| Badge / counter | `matBadge` directive |
| Progress spinner | `mat-spinner` or `mat-progress-spinner` |
| Linear progress bar | `mat-progress-bar` |
| Date picker | `matDatepicker` |
| Slider | `mat-slider` |
| Stepper / wizard | `mat-stepper` |
| Bottom sheet | `MatBottomSheet` |
| Dialog / modal | `MatDialog` |
| Snackbar / toast | `MatSnackBar` |
| Tooltip | `matTooltip` directive |
| Menu / dropdown menu | `mat-menu` + `[matMenuTriggerFor]` |
| Navigation drawer | `mat-sidenav` inside `mat-sidenav-container` |
| Paginator | `mat-paginator` |

## 5. Form Field Analysis

For every input field in the design, fill in this table:

| # | Label text | Input type | Placeholder | Required? | Validation clues | Error message (if shown) |
|---|---|---|---|---|---|---|
| 1 | | text/email/password/number/tel/date/select/checkbox/radio/textarea | | yes/no | | |

**Infer validators from context:**
- "Email" field → `Validators.email`
- "Password" → `Validators.minLength(8)`, pattern for complexity
- "Phone" → pattern validator for phone format
- "Required" label / asterisk → `Validators.required`
- Number range visible → `Validators.min()` / `Validators.max()`
- Character limit shown → `Validators.maxLength()`
- "Confirm password" → custom cross-field validator

## 6. Interactive States

Check if the design shows multiple states for any element:
- [ ] Default / rest state
- [ ] Hover / focus state
- [ ] Active / selected state
- [ ] Disabled state
- [ ] Loading state (skeleton, spinner)
- [ ] Empty state (no data)
- [ ] Error state (form validation, API error)

## 7. Motion & Feedback Cues

- [ ] Any loading indicators? (spinner, progress bar, skeleton)
- [ ] Success/error feedback? (snackbar, inline message, color change)
- [ ] Transition hints? (slide-in, fade, expand)

## 8. Data Model Inference

From the content visible in the design, infer the TypeScript interface:
- What fields does each list item / card show?
- What types are they? (string, number, boolean, Date, enum)
- Are there nested objects?

Define the interface before writing the component.
