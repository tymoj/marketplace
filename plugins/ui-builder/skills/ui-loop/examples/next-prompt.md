---
route: products
component: ProductListComponent
feature: products
image: designs/products.png
---
Product listing page with category filtering, search, and responsive grid layout.

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
- Shape — small: 4px | medium: 12px | large: 16px
- Angular Material: light theme, M3 tokens, custom brand overrides

**Angular Component Structure:**
- Layout: Full-width page, 1440px max container, no sidenav
- Header: Shared app toolbar (already in AppComponent)
- Main: Responsive mat-grid-list (4 → 2 → 1 columns)
- Filters: mat-chip-set for categories, mat-form-field search
- Data: resource() loading from mock HTTP service, mat-card skeleton while loading
- View toggle: mat-button-toggle-group (grid / list)

**Page Structure:**
1. **Hero Header:** "Our Collection" heading (mat-headline-large), subtitle
2. **Filter Bar:** mat-chip-set — All, Living Room, Bedroom, Dining, Outdoor; mat-form-field search with clear button
3. **Sort Controls:** mat-select sort options; mat-button-toggle-group grid/list icons
4. **Product Grid:** mat-grid-list with product cards — image, name, price, wishlist icon, Add to Cart button
5. **Loading State:** 8x mat-card skeleton (pulse animation)
6. **Empty State:** mat-icon, "No pieces found", Clear Filters mat-button
7. **Pagination:** mat-paginator, 12/24/48 per page, centered
