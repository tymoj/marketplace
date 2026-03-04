# Furniture Collections Design System

*Generated from Stitch Project: Furniture Collections List (ID: 13534454087919359824)*

## 1. Visual Theme & Atmosphere

A sophisticated, minimalist sanctuary that channels Scandinavian restraint and luxury editorial calm. Every element retreats to let photography speak — furniture pieces float in generous whitespace like gallery installations. The palette whispers rather than shouts: warm cream grounds the experience, deep teal-navy anchors CTAs with quiet authority.

## 2. Color Palette & Roles

| Name | Hex | Role |
|---|---|---|
| Warm Barely-There Cream | `#FCFAFA` | Primary background — creates warmth without yellow |
| Crisp Very Light Gray | `#F5F5F5` | Card surfaces, elevated sections |
| Deep Muted Teal-Navy | `#294056` | Primary CTA, links, active states, focused inputs |
| Charcoal Near-Black | `#2C2C2C` | Headings, primary text |
| Soft Warm Gray | `#6B6B6B` | Body copy, secondary labels |
| Ultra-Soft Silver Gray | `#E0E0E0` | Borders, dividers, subtle separators |
| Success Moss | `#10B981` | Positive feedback, confirmation states |
| Alert Terracotta | `#EF4444` | Errors, destructive actions |
| Informational Slate | `#64748B` | Neutral informational messages |

## 3. Typography Rules

- **Font:** Manrope — modern geometric sans-serif, humanist proportions
- **Display H1:** Semi-bold 600 / 2.75–3.5rem / 1.15 line-height / -0.02em letter-spacing
- **Heading H2:** Semi-bold 600 / 2rem / 1.25 line-height
- **Heading H3:** Medium 500 / 1.375rem / 1.35 line-height
- **Body:** Regular 400 / 1rem / 1.7 line-height
- **Caption/Label:** Regular 400 / 0.8125rem / 1.5 line-height / 0.02em letter-spacing
- **Nav Items:** Medium 500 / 0.9375rem / 0.06em letter-spacing — airy, editorial

## 4. Component Stylings

### Buttons
- Primary: Teal-navy `#294056` background, white text, 8px border-radius, 44px min-height
- Secondary/Outline: 1.5px teal-navy border, transparent background, same radius
- Hover: 8% opacity teal-navy overlay, 200ms ease transition
- Disabled: 40% opacity

### Cards
- Background: `#F5F5F5` surface
- Border-radius: 12px — gently rounded
- Shadow: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` — whisper-soft
- Hover: `0 4px 12px rgba(0,0,0,0.08)` — subtle lift, 250ms ease
- Padding: 20–24px

### Navigation Header
- Background: `#FCFAFA` with 1px `#E0E0E0` bottom border
- Height: 64–72px
- Logo: Charcoal near-black, font-size 1.25rem, medium 500
- Nav links: 0.06em letter-spacing, soft warm gray default, teal-navy on hover/active

### Inputs
- Border: 1px `#E0E0E0`, 8px radius
- Focus: 2px teal-navy ring, border color `#294056`
- Placeholder: `#6B6B6B` soft warm gray

### Product/Collection Image
- Aspect ratio: 3:4 portrait or 4:3 landscape
- Object-fit: cover
- Border-radius: 8–12px
- No hard shadow — let the subject breathe

## 5. Layout Principles

- **Max container:** 1440px (centered, auto margins)
- **Grid:** 12-column, 24px gutters, 48px edge padding (desktop)
- **Tablet:** 8-column, 16px gutters, 32px edges (≥768px)
- **Mobile:** 4-column, 16px gutters, 16px edges (≥375px)
- **Section vertical rhythm:** 80–96px between major sections (desktop), 48–64px (mobile)
- **Cards per row:** 4 (desktop) → 3 (tablet) → 2 (mobile-landscape) → 1 (mobile)

## 6. Angular Material Theme

```scss
// theme.scss — Angular Material 21 M3 theme
@use '@angular/material' as mat;

$furniture-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$cyan-palette,      // approximates #294056 teal-navy
    tertiary: mat.$green-palette,    // approximates #10B981 success
  ),
  typography: (
    plain-family: "'Manrope', 'Inter', sans-serif",
    brand-family: "'Manrope', sans-serif",
    bold-weight: 600,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (scale: 0),
));

// Override with exact brand colors via CSS custom properties
:root {
  --mat-primary-container: #294056;
  --mat-on-primary-container: #FCFAFA;
  --mat-surface: #FCFAFA;
  --mat-surface-variant: #F5F5F5;
  --mat-outline: #E0E0E0;
  --mat-on-surface: #2C2C2C;
  --mat-on-surface-variant: #6B6B6B;
}
```

## 7. Design System Block

*Copy this block into all Stitch generation prompts:*

```
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
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
- Layout: 12-column, 1440px max, generous whitespace
```
