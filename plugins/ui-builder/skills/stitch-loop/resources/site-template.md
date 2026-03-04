# SITE.md Template

Copy this template to create your Angular project's `SITE.md`.

---

# [Your App Name] — Angular Site

## Core Identity

**Brand:** [Brand name]
**Mission:** [1–2 sentences describing what the app does and for whom]
**Aesthetic:** [Visual style description]
**Tagline:** "[Optional tagline]"

## Visual Language

- **Palette:** [Primary] `#hex`, [Secondary] `#hex`, [Text] `#hex`
- **Font:** [Font name] — [style description]
- **Photography/Imagery:** [description of imagery style]
- **Motion:** [animation style description]

## Architecture & Structure

```
src/app/
├── core/
│   ├── layout/
│   │   └── app-shell/        ← mat-toolbar + mat-sidenav (shared layout)
│   └── services/
├── [feature-1]/
│   ├── pages/
│   │   └── [page-name]/     ✓ Completed / ← In Progress / ⏳ Queued
│   ├── components/
│   └── models/
├── [feature-2]/
│   └── pages/
└── shared/
    ├── components/
    └── data/
```

## Sitemap

| Route | Component | Status |
|---|---|---|
| `/` | `HomeComponent` | ⏳ Queued |
| `/[route]` | `[Name]Component` | ⏳ Queued |

Statuses: ✓ Complete | 🔄 In Progress | ⏳ Queued

## Roadmap

### High Priority
1. `/` — [Description] ← **CURRENT** (or first page)
2. `/[route]` — [Description]

### Medium Priority
3. `/[route]` — [Description]

### Future
4. `/[route]` — [Description]

## Angular Router Config

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./[feature]/pages/home/home.component')
        .then(m => m.HomeComponent),
    title: '[App Name]',
  },
  // Add new routes here as pages are completed
];
```

## Rules of Engagement

- All pages use consistent design tokens from `DESIGN.md`
- All route components: standalone + ChangeDetectionStrategy.OnPush + signals
- Navigation links update via `AppComponent.navLinks` array
- File naming: kebab-case for files and folders
- No duplicate pages — always check sitemap before generating
- [Add your project-specific rules here]

---

# DESIGN.md Template

```markdown
# [App Name] Design System

## 1. Visual Theme & Atmosphere
[2–3 evocative sentences describing the aesthetic]

## 2. Color Palette & Roles
| Name | Hex | Role |
|---|---|---|
| [Descriptive Name] | `#hex` | [Functional role] |

## 3. Typography Rules
- **Font:** [Family] — [description]
- **Display:** [weight] [size] / [line-height]
- **Body:** [weight] [size] / [line-height]

## 4. Component Stylings
[Buttons, cards, inputs, navigation descriptions]

## 5. Layout Principles
[Max-width, grid, spacing]

## 6. Angular Material Theme
[theme.scss snippet]

## 7. Design System Block (copy into Stitch prompts)
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first (Angular SPA)
- Theme: [theme description]
- Background: [Name] ([#hex])
- Primary Accent: [Name] ([#hex])
- Text Primary: [Name] ([#hex])
- Font: [font-family]
- Angular Material: [light|dark] theme, M3 tokens
```
