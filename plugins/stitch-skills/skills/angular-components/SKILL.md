---
name: angular:components
description: Converts Stitch designs into Angular 21 standalone components. Uses Angular CLI MCP for scaffolding and best practices, Playwright MCP for visual verification against the original design.
allowed-tools:
  - "stitch*:*"
  - "angular*:*"
  - "playwright*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Angular Components Skill

Converts Stitch MCP designs into production-ready Angular 21 standalone components using signals, Angular Material, and Playwright visual testing.

## Prerequisites

Ensure both MCPs are configured in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "angular": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

## Workflow

### Step 1: Discover MCP Tools

Run `list_tools` to identify:
- **Stitch prefix** (e.g., `stitch:`, `mcp_stitch:`)
- **Angular prefix** — verify `angular:list_projects`, `angular:get_best_practices` are available
- **Playwright prefix** — verify `playwright:browser_navigate`, `playwright:browser_snapshot` are available
- **Experimental Angular tools** — check for `angular:devserver.start`, `angular:build`, `angular:test`

### Step 2: Retrieve Stitch Design

```
[stitch-prefix]:get_screen projectId="[PROJECT_ID]" screenId="[SCREEN_ID]"
```

Key fields from response:
- `htmlCode.downloadUrl` — design HTML (requires curl, not AI web fetch)
- `screenshot.downloadUrl` — reference screenshot for visual comparison
- `deviceType` — typically `DESKTOP` (2560px viewport)

Download HTML via curl to handle GCS redirects:

```bash
bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/source.html"
```

Also download screenshot for Playwright comparison:

```bash
bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]" "temp/reference-screenshot.png"
```

### Step 3: Angular Project Discovery

1. `angular:list_projects` → identify app name and existing structure
2. `angular:get_best_practices` → load Angular 21 patterns (signals, standalone, zoneless)
3. `angular:search_documentation query="standalone components input output signals"` → API reference
4. `angular:find_examples` → relevant official examples

Review existing project structure:
```bash
find src/app -type f -name "*.ts" | head -30
```

### Step 4: Plan Component Architecture

From the HTML source, identify components:
- **Smart components** (have services, routing, state): pages, containers
- **Dumb/presentational components** (props-only): cards, list items, headers, forms

Plan file structure:
```
src/
├── app/
│   ├── [feature]/
│   │   ├── components/
│   │   │   ├── [component].component.ts
│   │   │   ├── [component].component.scss
│   │   │   └── [component].component.spec.ts
│   │   ├── [feature].routes.ts
│   │   └── models/
│   │       └── [feature].model.ts
│   └── shared/
│       └── data/
│           └── mock-data.ts
```

### Step 5: Install Dependencies (if needed)

```bash
# Angular Material (if not installed)
ng add @angular/material

# Or via npm
npm install @angular/material @angular/cdk @angular/animations
```

### Step 6: Generate Component Scaffolding

Use Angular CLI to generate properly structured components:

```bash
ng generate component [feature]/components/[component-name] \
  --standalone \
  --style=scss \
  --change-detection=OnPush \
  --skip-tests=false
```

Or if `angular:build` experimental tool is available, use Angular MCP for scaffolding guidance.

### Step 7: Implement Angular 21 Component

Use `resources/component-template.ts` as the base. Apply these rules:

**Angular 21 Patterns:**
```typescript
import {
  Component, input, output, signal, computed, effect,
  inject, ChangeDetectionStrategy, OnInit
} from '@angular/core';

@Component({
  selector: 'app-[name]',
  standalone: true,                                    // Always standalone
  changeDetection: ChangeDetectionStrategy.OnPush,     // Always OnPush
  imports: [
    // Import Angular Material modules directly
    MatCardModule, MatButtonModule, MatIconModule,
    // Import Angular common directives
    NgFor, NgIf, AsyncPipe, DatePipe,
  ],
  templateUrl: './[name].component.html',   // or template: `...`
  styleUrl: './[name].component.scss',
})
export class [Name]Component {
  // Inputs: use signal-based input() NOT @Input() decorator
  title = input.required<string>();
  subtitle = input<string>('');
  items = input<Item[]>([]);

  // Outputs: use output() NOT @Output() + EventEmitter
  itemSelected = output<Item>();
  actionClicked = output<void>();

  // Internal state: use signal()
  private readonly selectedIndex = signal(-1);

  // Services: inject() function NOT constructor injection
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  // Derived state: computed()
  readonly selectedItem = computed(() =>
    this.items()[this.selectedIndex()] ?? null
  );
  readonly hasItems = computed(() => this.items().length > 0);

  // Side effects: effect() for reactive side effects
  private readonly titleEffect = effect(() => {
    document.title = this.title();
  });

  // Methods
  selectItem(index: number): void {
    this.selectedIndex.set(index);
    this.itemSelected.emit(this.items()[index]);
  }
}
```

**Styling Rules:**
- SCSS files, no inline styles
- Use Angular Material CSS variables (`--mat-*`) for colors
- Use `mat.m3-theme` mixins for component-level theming
- No hardcoded hex values in templates or SCSS
- Use Angular CDK Layout for responsive breakpoints

**Template Rules:**
- Use `@for` / `@if` / `@switch` control flow (Angular 17+ syntax, not `*ngFor` / `*ngIf`)
- Use `@let` for local variable bindings
- Use `(click)` for events, `[attr]` for property bindings, `{{ }}` for interpolation
- Prefer `matInput` + `mat-form-field` over raw inputs

### Step 8: Type Model

Create a TypeScript interface for the component's data model in `models/`:

```typescript
// [feature].model.ts
export interface [Feature] {
  readonly id: string;
  readonly name: string;
  // ... typed fields matching Stitch design data
}
```

### Step 9: Mock Data

Extract static/example data to `shared/data/mock-data.ts`:

```typescript
// mock-data.ts
import type { [Feature] } from '../[feature]/models/[feature].model';

export const MOCK_[FEATURES]: readonly [Feature][] = [
  { id: '1', name: 'Example', ... },
];
```

### Step 10: Validate

Run validation script:

```bash
npm run validate src/app/[feature]/components/[component].component.ts
```

Checks:
- Component has `standalone: true`
- Uses `input()` signal functions (not `@Input()` decorator)
- Uses `ChangeDetectionStrategy.OnPush`
- No hardcoded hex colors
- TypeScript interface defined for component data

### Step 11: Build Verification

If `angular:build` (experimental) is available:
```
angular:build project="[app-name]"
```

Otherwise:
```bash
ng build --configuration=development 2>&1 | tail -20
```

Fix any TypeScript or template compilation errors before proceeding.

### Step 12: Visual Verification with Playwright MCP

Start dev server (use Angular MCP experimental if available):
```
angular:devserver.start project="[app-name]"
```
Or:
```bash
ng serve &
```

Then visually verify with Playwright:

```
playwright:browser_navigate url="http://localhost:4200"
playwright:browser_snapshot   ← accessibility tree verification
playwright:browser_screenshot ← visual comparison with temp/reference-screenshot.png
playwright:browser_close
```

Compare the screenshot against the Stitch reference image:
- Layout structure matches
- Colors from DESIGN.md are applied
- Typography looks correct
- Interactive elements are accessible

### Step 13: Architecture Checklist

Review `resources/architecture-checklist.md` before marking complete.

## Angular 21 Quick Reference

### New Control Flow Syntax (use this, not *ngFor/*ngIf)

```html
<!-- List rendering -->
@for (item of items(); track item.id) {
  <app-item [data]="item" />
} @empty {
  <p class="empty-state">No items found</p>
}

<!-- Conditional rendering -->
@if (isLoading()) {
  <mat-spinner />
} @else if (hasError()) {
  <app-error-state [message]="errorMessage()" />
} @else {
  <app-content />
}

<!-- Switch -->
@switch (status()) {
  @case ('active') { <mat-chip color="primary">Active</mat-chip> }
  @case ('inactive') { <mat-chip>Inactive</mat-chip> }
  @default { <mat-chip color="warn">Unknown</mat-chip> }
}

<!-- Local variable -->
@let user = currentUser();
<h1>Welcome, {{ user.name }}</h1>
```

### Async Data with Resource API

```typescript
// Angular 21: resource() for async data
import { resource, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({ ... })
export class ProductListComponent {
  private readonly http = inject(HttpClient);

  readonly products = resource({
    loader: () => firstValueFrom(
      this.http.get<Product[]>('/api/products')
    )
  });

  // Access: products.value(), products.isLoading(), products.error()
}
```

### Reactive Forms with Signals

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  ...
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    // form.getRawValue() is fully typed
    console.log(this.form.getRawValue());
  }
}
```
