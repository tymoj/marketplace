---
name: stitch-loop
description: Autonomous baton-passing loop for iterative Angular app building. Each iteration generates a Stitch screen, converts it to an Angular route component, and queues the next screen. Uses Angular CLI MCP for routing and Playwright MCP for visual verification.
allowed-tools:
  - "stitch*:*"
  - "angular*:*"
  - "playwright*:*"
  - "Bash"
  - "Read"
  - "Write"
---

# Stitch Loop Skill

Autonomous iterative loop that builds an Angular app screen-by-screen. Each cycle:
1. Reads the queued prompt from `next-prompt.md`
2. Generates the screen via Stitch MCP
3. Converts it to an Angular 21 standalone route component
4. Registers the route in Angular Router
5. Verifies with Playwright MCP
6. Updates `SITE.md` and queues the next screen

## Prerequisites

Configure MCPs in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "angular": { "command": "npx", "args": ["-y", "@angular/cli", "mcp"] },
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
  }
}
```

## Workflow

### Step 1: Read the Baton

Read `next-prompt.md`. Extract:
- `route` frontmatter field → Angular route path (e.g., `home`, `products/list`)
- `component` frontmatter field → Angular component name (e.g., `HomeComponent`, `ProductListComponent`)
- Prompt body → Stitch generation prompt

### Step 2: Consult Project Context

1. Read `SITE.md` → project vision, sitemap (already completed routes), roadmap
2. Read `DESIGN.md` → design system (inject into Stitch prompt)
3. `angular:list_projects` → project structure
4. Check `src/app/app.routes.ts` → existing routes (do NOT duplicate)

**Stop if** the `route` already appears in `SITE.md` sitemap. Update `next-prompt.md` to skip to the next queued page.

### Step 3: Generate Screen with Stitch MCP

1. Run `list_tools` to find Stitch prefix
2. Call `[stitch-prefix]:generate_screen` (or equivalent) with the enhanced prompt from `next-prompt.md`
3. `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/[route]-source.html"` → download HTML
4. `bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]" "temp/[route]-screenshot.png"` → download reference

### Step 4: Generate Angular Route Component

Use the `angular:components` skill workflow to convert the HTML to Angular 21:

```bash
ng generate component [feature]/pages/[route-name] \
  --standalone \
  --style=scss \
  --change-detection=OnPush
```

Component location: `src/app/[feature]/pages/[route-name]/[route-name].component.ts`

Apply Angular 21 patterns (see `angular-components` skill):
- `input()` / `output()` signals
- Angular Material components
- Angular Material CSS variables (no hardcoded hex)
- New `@for`/`@if` control flow

### Step 5: Register Angular Route

Add lazy-loaded route to `src/app/app.routes.ts`:

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  // ... existing routes
  {
    path: '[route-path]',
    loadComponent: () =>
      import('./[feature]/pages/[route-name]/[route-name].component')
        .then(m => m.[RouteComponentName]),
    title: '[Page Title]',
  },
];
```

For nested routes, add to the appropriate feature routes file.

Also update navigation component if it has a links list.

### Step 6: Add Navigation Link

If a navigation list exists (e.g., `AppComponent` nav links array), add entry:

```typescript
readonly navLinks = [
  // ... existing links
  { route: '/[route-path]', icon: '[material-icon]', label: '[Label]' },
];
```

### Step 7: Build Verification

```bash
ng build --configuration=development 2>&1 | tail -10
```

Fix any TypeScript/template errors.

### Step 8: Visual Verification with Playwright

Start dev server and verify:

```
playwright:browser_navigate url="http://localhost:4200/[route-path]"
playwright:browser_snapshot
playwright:browser_screenshot
playwright:browser_close
```

Compare screenshot against `temp/[route]-screenshot.png` reference.

### Step 9: Update SITE.md

Add completed route to the `Sitemap` section:

```markdown
## Sitemap
- `/` → HomeComponent ✓
- `/[route-path]` → [ComponentName] ✓ (just added)
```

Update roadmap: move this page from "upcoming" to "completed".

### Step 10: Write Next Baton

Update `next-prompt.md` with the next page from the SITE.md roadmap:

```yaml
---
route: [next-route-path]
component: [NextComponentName]
---
[Next page description with design system block]

**DESIGN SYSTEM (REQUIRED):**
[Copy from DESIGN.md Section 7]

**Angular Component Structure:**
- Layout: [Angular Material layout]
- Navigation: Consistent with completed pages

**Page Structure:**
1. **[Section]:** [description with Angular Material components]
...
```

## Critical Rules

- **Never duplicate routes** — check `SITE.md` sitemap before generating
- **Always include design system block** in Stitch prompts (from `DESIGN.md` Section 7)
- **Always update `next-prompt.md`** before completing the cycle (enables autonomous chaining)
- **Use lazy loading** (`loadComponent()`) for all route components
- **Consistent navigation** — new routes appear in nav automatically via `navLinks` array
- **Always verify** with Playwright before marking complete

## Orchestration Modes

### Continuous (Autonomous)

Claude Code repeats the loop automatically until roadmap is complete:
```
Run stitch-loop continuously until all pages in SITE.md roadmap are complete.
```

### Human-in-the-Loop

Run one cycle, pause for review:
```
Run one stitch-loop cycle for the next page in the roadmap.
```

### Angular CLI MCP Assisted

If `angular:devserver.start` (experimental) is available, use it to manage the dev server between cycles:
```
angular:devserver.start project="[app-name]"
[run cycles]
angular:devserver.stop project="[app-name]"
```
