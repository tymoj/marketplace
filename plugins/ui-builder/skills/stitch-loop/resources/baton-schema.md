# Stitch Loop Baton Schema (next-prompt.md)

## Format

```yaml
---
route: <angular-route-path>
component: <ComponentClassName>
feature: <feature-module-name>
---
<prompt-content>
```

## Field Definitions

| Field | Required | Description | Example |
|---|---|---|---|
| `route` | ✅ | Angular Router path (no leading `/`) | `products/list` |
| `component` | ✅ | PascalCase Angular component name | `ProductListComponent` |
| `feature` | ✅ | Feature folder name (kebab-case) | `products` |

## Body Requirements

The prompt body MUST include:

1. **One-line description** — what this screen is
2. **`**DESIGN SYSTEM (REQUIRED):**`** block — copy from `DESIGN.md` Section 7
3. **`**Angular Component Structure:**`** — layout, navigation, data fetching pattern
4. **`**Page Structure:**`** — numbered sections with Angular Material component names

## Validation Checklist

Before writing `next-prompt.md`:

- [ ] `route` field is set and does NOT already appear in `SITE.md` sitemap
- [ ] `component` field follows PascalCase + `Component` suffix convention
- [ ] Design system block is present (from DESIGN.md Section 7)
- [ ] Angular component structure section specifies:
  - Layout component (`mat-sidenav-container` / simple `router-outlet` / etc.)
  - Whether page is a full-width layout or constrained card/form
  - Data source (mock data / HTTP service / Angular resource)
- [ ] Page structure numbers each section with Angular Material components named explicitly

## Example

```yaml
---
route: products
component: ProductListComponent
feature: products
---
Angular product listing page with filtering, sorting, and grid/list view toggle

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: Sophisticated minimal, gallery-like
- Background: Warm Barely-There Cream (#FCFAFA)
- Primary Accent: Deep Muted Teal-Navy (#294056)
- Text Primary: Charcoal Near-Black (#2C2C2C)
- Font: Manrope, modern geometric sans-serif
- Angular Material: light theme, M3 tokens

**Angular Component Structure:**
- Layout: Full-width with 1440px container, no sidenav on this page
- Header: Shared mat-toolbar (from AppComponent)
- Main: mat-grid-list (responsive 4→2→1 columns)
- Filters: mat-chip-set for category filters, mat-form-field for search
- View toggle: mat-button-toggle-group for grid/list switch
- Data: resource() with mock HTTP, skeleton loading with mat-card

**Page Structure:**
1. **Page Header:** "Products" heading (H1 mat-headline-large), item count chip, view toggle button group (grid/list)
2. **Filter Bar:** Horizontal scrollable mat-chip-set (All, Furniture, Lighting, Accessories, Decor), mat-form-field search input with search icon suffix
3. **Product Grid:** mat-grid-list with ProductCardComponent, 4 columns desktop / 2 tablet / 1 mobile; each card shows image, name, price, mat-icon-button wishlist, "Add to Cart" mat-raised-button
4. **Empty State:** mat-icon (inbox), "No products found" headline, "Clear Filters" mat-button
5. **Pagination:** mat-paginator bottom-center, 12/24/48 per page options
```
