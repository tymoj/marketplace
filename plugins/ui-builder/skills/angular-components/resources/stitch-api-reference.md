# Stitch API Reference for Angular Components

## `get_screen` Response Structure

Key properties used by the `angular:components` skill:

```typescript
interface StitchScreenResponse {
  htmlCode: {
    downloadUrl: string;  // GCS redirect URL — MUST use curl, not AI fetch
  };
  screenshot: {
    downloadUrl: string;  // Reference screenshot for Playwright visual comparison
  };
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET'; // Desktop = 2560px viewport
  screenName: string;
  projectId: string;
}
```

## Download Requirements

### HTML Source (htmlCode.downloadUrl)

GCS (Google Cloud Storage) URLs redirect. AI web fetch tools do NOT follow these redirects.
**Always use the provided curl script:**

```bash
bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/source.html"
```

### Reference Screenshot (screenshot.downloadUrl)

Download for Playwright visual comparison:

```bash
bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]" "temp/reference-screenshot.png"
```

### Background Images / Assets

Extract all background image URLs from the HTML source and store in `mock-data.ts`:

```typescript
// DO NOT hardcode asset URLs in component templates
// src/app/shared/data/mock-data.ts
export const MOCK_ASSETS = {
  heroImage: 'https://...',
  productImages: ['https://...', 'https://...'],
} as const;
```

## HTML Source Parsing for Angular

### Extract Tailwind/CSS Config

Look in the `<head>` for inline Tailwind config or custom CSS variables:

```html
<script>
  tailwind.config = { theme: { extend: { colors: { primary: '#294056' } } } }
</script>
```

Map these to Angular Material CSS variables in your component SCSS:

```scss
// Map Stitch design tokens to Angular Material tokens
:host {
  --mat-primary: var(--stitch-primary-color, #294056);
}
```

### Extract Component Structure

Look for repeated patterns in the HTML:
- `data-stitch-id` attributes — preserve these as Angular `[attr.data-stitch-id]` bindings or HTML comments for future Stitch sync
- Repeated card/list patterns → Angular `@for` directive
- Conditional sections → Angular `@if` / `@switch`
- Tab panels → `mat-tab-group`
- Modal/overlay → `MatDialog` service call

### Preserve Stitch IDs

Preserve `data-stitch-id` attributes for future design-code sync:

```typescript
// In component template
<mat-card [attr.data-stitch-id]="item.stitchId">
```

Or as HTML comments if IDs are static:
```html
<!-- stitch-id: card-component-xyz -->
<mat-card>
```

## Playwright Visual Verification

After generating the Angular component, verify visually:

```
playwright:browser_navigate url="http://localhost:4200/[route]"
playwright:browser_snapshot     ← verify accessibility tree
playwright:browser_screenshot   ← compare with temp/reference-screenshot.png
```

### What to Check

| Stitch Element | Angular Equivalent | Visual Check |
|---|---|---|
| Primary color fills | `mat-raised-button` / `mat-card` with primary | Button/card background matches |
| Typography | `mat-typography` classes | Font, weight, size matches |
| Card borders | `mat-card` with elevation | Shadow/border matches |
| Form inputs | `mat-form-field` | Label, border, focus state match |
| Icons | `<mat-icon>` | Icon name and position match |
| Chips/tags | `mat-chip-set` | Chip colors/shape match |
| Loading state | `mat-spinner` | Spinner present during loading |
| Empty state | `@empty` block in `@for` | Empty state message shown |
