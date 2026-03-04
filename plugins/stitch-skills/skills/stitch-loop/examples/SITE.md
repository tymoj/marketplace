# Oakwood Furniture Co. — Angular Site

## Core Identity

**Brand:** Oakwood Furniture Co.
**Mission:** Handcrafted, sustainable wood furniture for design-conscious buyers.
**Aesthetic:** Warm, minimal, artisanal. Gallery-like layouts that let the product photography breathe.
**Tagline:** "Crafted to last. Designed to inspire."

## Visual Language

- **Palette:** Warm cream `#FCFAFA`, Deep teal-navy `#294056`, Charcoal `#2C2C2C`
- **Font:** Manrope — geometric, modern, humanist
- **Photography:** Full-bleed product shots, natural light, minimal props
- **Motion:** Subtle spring animations, 200ms ease transitions

## Architecture & Structure

```
src/app/
├── core/
│   ├── layout/
│   │   └── app-shell/          ← mat-toolbar + mat-sidenav-container
│   └── services/
├── home/
│   └── pages/home/             ✓ Completed
├── products/
│   ├── pages/
│   │   ├── product-list/       ← In progress
│   │   └── product-detail/     ← Queued
│   ├── components/
│   │   └── product-card/       ✓ Completed
│   └── models/
├── about/
│   └── pages/about/            ← Queued
└── contact/
    └── pages/contact/          ← Queued
```

## Sitemap

| Route | Component | Status |
|---|---|---|
| `/` | `HomeComponent` | ✓ Complete |
| `/products` | `ProductListComponent` | 🔄 In Progress |
| `/products/:id` | `ProductDetailComponent` | ⏳ Queued |
| `/about` | `AboutComponent` | ⏳ Queued |
| `/contact` | `ContactComponent` | ⏳ Queued |

## Roadmap

### High Priority
1. `/products` — Product listing with filter/search ← **CURRENT**
2. `/products/:id` — Individual product detail with image gallery
3. `/contact` — Contact form with showroom location

### Medium Priority
4. `/about` — Brand story, team, sustainability commitment
5. `/cart` — Shopping cart sidebar (MatDrawer)

### Future
6. `/account` — User account, order history
7. `/wishlist` — Saved items grid

## Angular Router Config

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/pages/home/home.component').then(m => m.HomeComponent), title: 'Oakwood Furniture Co.' },
  { path: 'products', loadComponent: () => import('./products/pages/product-list/product-list.component').then(m => m.ProductListComponent), title: 'Our Collection | Oakwood' },
  // Add new routes here as pages are completed
];
```

## Rules of Engagement

- All pages use consistent typography and spacing from DESIGN.md
- Navigation links update automatically via AppComponent `navLinks` array
- All route components are standalone + OnPush + signals
- Photography is always full-width / full-card, never cropped in odd ways
- File naming: kebab-case for all files and folders
- No duplicate pages — check this sitemap before generating
