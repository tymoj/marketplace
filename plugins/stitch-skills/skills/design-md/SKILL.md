---
name: design-md
description: Analyzes a Stitch project screen and generates a comprehensive DESIGN.md file documenting the design system. Output is framework-agnostic and compatible with Angular Material theming.
allowed-tools:
  - "stitch*:*"
  - "angular*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Design MD Skill

Analyzes a Stitch screen and generates a `DESIGN.md` documenting its design system. The output feeds into `enhance-prompt`, `angular:components`, and `stitch-loop` skills, and can be translated into Angular Material M3 theme tokens.

## Workflow

### Step 1: Discover MCP Prefix

Run `list_tools` to find the Stitch MCP prefix (may be `stitch:`, `mcp_stitch:`, or similar).

Also check for `angular:get_best_practices` for Angular Material theming guidance.

### Step 2: Retrieve Screen Design

```
[stitch-prefix]:get_screen projectId="[PROJECT_ID]" screenId="[SCREEN_ID]"
```

### Step 3: Download HTML Source

Use Bash (not AI web fetch) to handle GCS redirects:

```bash
bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/source.html"
```

### Step 4: Extract Design Tokens

From the HTML source, extract:
- **Color palette** — background, surface, primary, secondary, text, border, status colors (as hex)
- **Typography** — font families, weights, sizes, line heights, letter spacing
- **Spacing** — padding, margins, gaps (convert to rem/px scale)
- **Borders** — radius values, widths, styles
- **Shadows** — box-shadow values, elevation levels
- **Breakpoints** — any responsive media query thresholds

### Step 5: Translate to Natural Language

Convert technical CSS values to evocative design language:
- `box-shadow: 0 1px 2px rgba(0,0,0,0.08)` → "Whisper-soft diffused shadow"
- `border-radius: 12px` → "Gently rounded corners"
- `letter-spacing: 0.06em` → "Subtly airy letter spacing"
- `font-weight: 600` → "Semi-bold, confident weight"

### Step 6: Generate Angular Material Theme Mapping

After the standard DESIGN.md sections, add a Section 6 with Angular Material M3 token mappings:

```typescript
// Angular Material M3 theme tokens derived from this design
const theme = createTheme({
  color: {
    primary: createPalette(primaryHex),    // --mat-primary
    secondary: createPalette(secondaryHex), // --mat-secondary
    tertiary: createPalette(tertiaryHex),   // --mat-tertiary
  },
  typography: {
    plain: fontFamily,
    brand: brandFontFamily,
  },
  density: {
    scale: 0,  // -1, -2, -3 for compact
  }
});
```

### Step 7: Write DESIGN.md

Output a `DESIGN.md` file with these sections:

1. **Visual Theme & Atmosphere** — 2-3 sentences describing the overall aesthetic
2. **Color Palette & Roles** — each color with hex, name, and functional role
3. **Typography Rules** — font families, size scale, weight usage, line heights
4. **Component Stylings** — buttons, cards, inputs, navigation, badges
5. **Layout Principles** — max-width, columns, section spacing, mobile-first breakpoints
6. **Angular Material Theme** — M3 token mappings + ready-to-use theme config

## Output Format

```markdown
# [Project Name] Design System

## 1. Visual Theme & Atmosphere
[2-3 evocative sentences]

## 2. Color Palette & Roles
| Name | Hex | Role |
|------|-----|------|
| Warm Cream | #FCFAFA | Primary background |
...

## 3. Typography Rules
- **Font:** [Family] — [description]
- **Display:** [weight] [size] / [line-height]
- **Body:** [weight] [size] / [line-height]

## 4. Component Stylings
...

## 5. Layout Principles
...

## 6. Angular Material Theme (copy into your theme.scss)
```scss
@use '@angular/material' as mat;

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$[palette]-palette,
  ),
  typography: (
    plain-family: '[font-family]',
  ),
));
```

## 7. Design System Block (copy into Stitch prompts)
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: [theme description]
- Background: [Name] ([#hex])
...
```
