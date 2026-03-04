# Angular Material 21 Setup Guide

## Option 1: Angular CLI (Recommended)

```bash
ng add @angular/material
```

This will:
- Install `@angular/material`, `@angular/cdk`, `@angular/animations`
- Ask for prebuilt theme or custom theme
- Configure typography
- Set up `BrowserAnimationsModule` → replaced by `provideAnimationsAsync()` in Angular 21

## Option 2: Manual Setup

### 1. Install packages

```bash
npm install @angular/material @angular/cdk
```

### 2. Configure app (Angular 21 standalone)

```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),   // Angular 21: no Zone.js
    provideRouter(routes),
    provideAnimationsAsync(),            // async animations for better performance
    provideHttpClient(withFetch()),
  ],
};
```

### 3. Create M3 Theme

```scss
// src/styles/theme.scss
@use '@angular/material' as mat;

// Include common styles once
@include mat.core();

// Define M3 theme
$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,      // Change to match your brand
    tertiary: mat.$blue-palette,
  ),
  typography: (
    plain-family: 'Roboto, sans-serif',
    brand-family: 'Roboto, sans-serif',
  ),
  density: (scale: 0),
));

// Apply to :root
:root {
  @include mat.all-component-themes($theme);
  @include mat.color-variants-backwards-compatibility($theme);
}

// Typography CSS classes
html {
  @include mat.typography-hierarchy($theme);
}
```

### 4. Configure angular.json

```json
{
  "styles": [
    "src/styles/theme.scss",
    "src/styles.scss"
  ]
}
```

### 5. Add Material Icons font

In `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<!-- Or Material Symbols (recommended for Angular 21) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

Or self-host via npm:

```bash
npm install material-symbols
```

```scss
// styles.scss
@import 'material-symbols/outlined.css';
```

## Verification

Run the verify script:

```bash
bash scripts/verify-setup.sh
```

Or manually check:

```bash
# Check Material installed
cat package.json | grep @angular/material

# Check theme file
cat src/styles/theme.scss | grep define-theme

# Quick build check
ng build --configuration=development 2>&1 | tail -5
```

## Playwright Verification

After `ng serve`, verify Material components render correctly:

```
playwright:browser_navigate url="http://localhost:4200"
playwright:browser_snapshot    # check mat-toolbar, mat-card appear in accessibility tree
playwright:browser_screenshot  # visual comparison with Stitch design
```

## Troubleshooting

### "mat-card is not a known element"
Add `MatCardModule` to component's `imports` array:
```typescript
imports: [MatCardModule]
```

### No animations
Ensure `provideAnimationsAsync()` is in `app.config.ts` providers.

### Theme not applied
Check `angular.json` includes `theme.scss` in `styles` array, and `@include mat.all-component-themes($theme)` is in the theme file.

### Material Icons not showing
Check font is loaded and use `<mat-icon>` component (not raw text/Unicode).
