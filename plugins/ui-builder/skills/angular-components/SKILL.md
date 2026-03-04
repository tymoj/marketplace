---
name: image-to-angular
description: >-
  Converts local design images (PNG, JPG, Figma exports, screenshots, mockups)
  into production-ready Angular 21 standalone components with Angular Material.
  Reads images natively via Read tool — no Stitch MCP required.
  Supports forms, tables, dashboards, and any UI pattern.
user-invocable: true
---

# image-to-angular

Convert any design image into a pixel-close Angular 21 component with Angular Material.

## Input

Provide:
1. **Image path(s)** — e.g. `designs/checkout.png`, `mockups/dashboard.jpg`
2. **Component name** — PascalCase, e.g. `CheckoutFormComponent`
3. **Route** (optional) — e.g. `checkout` (omit for presentational components)
4. **Feature folder** (optional) — e.g. `checkout` (defaults to kebab-case of component name)

## Workflow

### Step 1: Read Design Images

Use the **Read tool** to load every provided image. Read all images before analyzing.

For multiple images (e.g., default state + error state + mobile), read them all — they provide complementary information about the component's states and responsive behavior.

### Step 2: Analyze the Design

Work through the image systematically using the image-analysis-guide.md checklist:

**Layout:**
- Overall structure (single column / two column / sidebar+content / grid / centered card)
- Container max-width
- Section hierarchy and visual grouping
- Spacing between elements

**Color roles** (record exact hex for each):
- Background, Surface, Primary action, Text primary/secondary, Border, Error, Success

**Typography:**
- Font family (infer from letterforms), heading sizes, body size, label size

**Component inventory** — for every visible element:
- What it is visually
- Its Angular Material equivalent
- Its visual state (default, focused, error, disabled, loading)

**Form field analysis** (if the design contains a form):

For every form field, record:
| # | Label | Input type | Placeholder | Required | Validation hints | Error message |
|---|---|---|---|---|---|---|
| 1 | [label] | [text/email/password/number/tel/date/select/checkbox/radio/textarea] | [placeholder] | [yes/no] | [min length, format, range] | [error text if shown] |

**Interactive elements:**
- Button labels, types (submit/button/reset), visual style (filled/outlined/text)
- Icon names (infer from shape — search, close, chevron, add, delete, etc.)
- Navigation links

### Step 3: Map to Angular Material

Produce a mapping table:

| Design Element | Angular Material | Module Import |
|---|---|---|
| [element] | [component] | [MatXxxModule] |

### Step 4: Plan Component Architecture

Decide:
- **Smart vs presentational**: route components are smart (fetch data, manage state); shared components are presentational (inputs/outputs only)
- **Inputs**: what data does this component receive?
- **Outputs**: what events does it emit?
- **Local state**: what signals does it need?
- **Services**: what does it inject?
- **Form**: does it need a reactive form? What validators?

### Step 5: Discover Angular Project

Check for `angular.json` to confirm the workspace. Use Angular CLI MCP if available:
- `angular:list_projects` — confirm app name and root
- `angular:get_best_practices` — confirm Angular version-specific patterns

### Step 6: Install Angular Material (if not present)

Check `package.json` for `@angular/material`. If missing:
```bash
ng add @angular/material
```
Confirm `provideAnimationsAsync()` is in `app.config.ts`.

### Step 7: Scaffold the Component

```bash
ng generate component [feature]/[component-name] \
  --standalone \
  --style=scss \
  --change-detection=OnPush \
  --skip-tests
```

### Step 8: Implement the Component

Follow Angular 21 patterns strictly:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// ... other Material imports

interface [ComponentName]Data {
  // TypeScript interface matching the design's data model
}

@Component({
  selector: 'app-[component-name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Only import what this component uses
    MatCardModule,
  ],
  template: `
    <!-- Use new control flow: @if, @for (track), @switch, @let -->
  `,
  styles: [`
    /* CSS custom properties using --mat-* tokens, not hardcoded hex */
  `],
})
export class [ComponentName]Component {
  // Inputs — signal-based, never @Input()
  data = input.required<[ComponentName]Data>();

  // Outputs — never @Output() + EventEmitter
  actionClicked = output<string>();

  // Local state — signal()
  isLoading = signal(false);

  // Derived state — computed()
  displayValue = computed(() => this.data().someField);

  // DI — inject(), never constructor injection
  private readonly router = inject(Router);
}
```

**Template rules:**
- Use `@if (condition) { } @else { }` — never `*ngIf`
- Use `@for (item of items(); track item.id) { }` — never `*ngFor`
- Use `@switch (value()) { @case ('x') { } }` — never `ngSwitch`
- Use `@let label = computedValue();` for local template variables

**Styling rules:**
- Use `--mat-*` CSS custom properties, never hardcoded hex colors
- Match spacing, border-radius, and shadow exactly to the design
- Use the design's exact values as CSS custom property overrides in `:host`

### Step 9: Implement the Form (if applicable)

```typescript
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// In @Component imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, ...]

private readonly fb = inject(FormBuilder);

form = this.fb.nonNullable.group({
  // One control per detected form field
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  // ... add controls matching every field in the design
});

onSubmit(): void {
  if (this.form.invalid) return;
  // handle submission
}
```

**Form template pattern:**
```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" placeholder="you@example.com">
    <mat-error>
      @if (form.controls.email.hasError('required')) { Email is required }
      @if (form.controls.email.hasError('email')) { Enter a valid email }
    </mat-error>
  </mat-form-field>

  <button mat-flat-button type="submit" [disabled]="form.invalid || isLoading()">
    @if (isLoading()) { <mat-spinner diameter="20"/> } @else { Submit }
  </button>
</form>
```

- Every field from the design gets a `mat-form-field`
- Every validation rule inferred from the design gets a `Validator` and a `<mat-error>`
- Password fields get a show/hide toggle using a `signal(false)` for `showPassword`
- Disabled/loading states use signals bound to `[disabled]`

### Step 10: Register Route (if applicable)

In `src/app/app.routes.ts`:
```typescript
{
  path: '[route]',
  loadComponent: () =>
    import('./[feature]/[component-name]/[component-name].component')
      .then(m => m.[ComponentName]Component),
  title: '[Page Title]',
},
```

### Step 11: Validate

```bash
node scripts/validate.js src/app/[feature]/[component-name]/[component-name].component.ts
```

Then build:
```bash
ng build
```

Fix any TypeScript or build errors before proceeding.

### Step 12: Playwright Visual Verification

Start the dev server, then use Playwright MCP:

1. `playwright:browser_navigate` → `http://localhost:4200/[route]`
2. `playwright:browser_screenshot` → save as `screenshots/[component-name]-actual.png`
3. Compare with the original design image side by side
4. Identify any deviations in: layout, spacing, colors, typography, component style
5. Fix deviations and re-screenshot until the component matches the design

### Step 13: Architecture Checklist

Run through `resources/architecture-checklist.md` before declaring done.

## Examples

See `examples/activity-card.component.ts` for a complete Angular 21 component example.
