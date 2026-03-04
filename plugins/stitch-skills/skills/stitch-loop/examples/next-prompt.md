---
route: products
component: ProductListComponent
feature: products
---
Angular product listing page with category filtering, search, and responsive grid layout for Oakwood Furniture Co.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: Sophisticated minimal, gallery-like, photography-first
- Background: Warm Barely-There Cream (#FCFAFA)
- Surface: Crisp Very Light Gray (#F5F5F5)
- Primary Accent: Deep Muted Teal-Navy (#294056) for CTAs and links
- Text Primary: Charcoal Near-Black (#2C2C2C)
- Text Secondary: Soft Warm Gray (#6B6B6B)
- Borders: Ultra-Soft Silver Gray (#E0E0E0)
- Font: Manrope, modern geometric sans-serif
- Buttons: Subtly rounded (8px), teal-navy filled
- Cards: Gently rounded (12px), whisper-soft shadow
- Angular Material: light theme, M3 tokens, custom brand overrides

**Angular Component Structure:**
- Layout: Full-width page, 1440px max container, no sidenav
- Header: Shared app toolbar (already in AppComponent)
- Main: Responsive mat-grid-list (4 → 2 → 1 columns)
- Filters: mat-chip-set for categories, mat-form-field search
- Data: resource() loading from mock HTTP service, mat-card skeleton while loading
- View toggle: mat-button-toggle-group (grid / list)

**Page Structure:**
1. **Hero Header:** "Our Collection" heading (mat-headline-large), subtitle "Handcrafted furniture for thoughtful spaces"
2. **Filter Bar:** mat-chip-set — All, Living Room, Bedroom, Dining, Outdoor (teal-navy active chip); mat-form-field search with search icon prefix, clear button suffix
3. **Sort Controls:** mat-select — Featured / Price: Low to High / Price: High to Low / Newest; mat-button-toggle-group — grid icon / list icon
4. **Product Grid:** mat-grid-list, ProductCardComponent — photography-first card (image top 60%, name + material caption, price, whisper-shadow mat-card); wishlist mat-icon-button (heart icon); "Add to Cart" mat-stroked-button below fold
5. **Loading State:** 8 × mat-card skeleton (pulse animation via Angular CDK) while resource() loads
6. **Empty State:** mat-icon (chair), "No pieces found" heading, "Clear Filters" mat-button
7. **Pagination:** mat-paginator — 12 / 24 / 48 per page, centered
