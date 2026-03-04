# UI Loop Baton Schema (next-prompt.md)

## Format

```yaml
---
route: <angular-route-path>
component: <ComponentClassName>
feature: <feature-folder-name>
image: <path-to-design-image>
---
<prompt-content>
```

## Field Definitions

| Field | Required | Description | Example |
|---|---|---|---|
| `route` | yes | Angular Router path (no leading `/`) | `checkout` |
| `component` | yes | PascalCase Angular component name | `CheckoutFormComponent` |
| `feature` | yes | Feature folder name (kebab-case) | `checkout` |
| `image` | yes | Path to the design image for this page | `designs/checkout.png` |

## Body Requirements

The prompt body MUST include:

1. **One-line description** — what this screen is and does
2. **`**DESIGN SYSTEM (REQUIRED):**`** block — copy from `DESIGN.md` Section 7 verbatim
3. **`**Angular Component Structure:**`** — layout, data fetching pattern
4. **`**Page Structure:**`** — numbered sections (can be brief; image is the source of truth)

## Validation Checklist

Before writing `next-prompt.md`:

- [ ] `route` does NOT already appear as ✓ Complete in `SITE.md` sitemap
- [ ] `image` file exists at the specified path
- [ ] `component` follows PascalCase + `Component` suffix
- [ ] Design system block is present (from `DESIGN.md` Section 7)
- [ ] Angular component structure section specifies layout and data source

## Example

```yaml
---
route: checkout
component: CheckoutFormComponent
feature: checkout
image: designs/checkout.png
---
Multi-step checkout form with shipping address, payment details, and order summary.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: Clean minimal e-commerce, white surfaces, blue accent
- Background: White (#FFFFFF)
- Surface: Light Gray (#F8F9FA)
- Primary Accent: Royal Blue (#2563EB)
- Text Primary: Slate (#1E293B)
- Text Secondary: Gray (#64748B)
- Font: Inter, modern geometric sans-serif
- Shape — small: 4px | medium: 8px | large: 16px
- Angular Material: light theme, M3 tokens

**Angular Component Structure:**
- Layout: Centered two-column (form left, order summary right), 1200px max
- Header: Shared mat-toolbar (from AppComponent)
- Data: FormBuilder.nonNullable multi-group form
- Steps: mat-stepper with 3 steps

**Page Structure:**
1. **Progress Stepper:** mat-stepper — Shipping / Payment / Review
2. **Shipping Form:** mat-form-field fields for name, address, city, zip, country select
3. **Payment Form:** card number, expiry, CVV inputs
4. **Order Summary:** mat-card, item list, subtotal, shipping, total
5. **Actions:** Back mat-stroked-button, Continue / Place Order mat-flat-button
```
