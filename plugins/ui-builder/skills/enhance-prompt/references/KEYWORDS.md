# Angular UI/UX Keyword Reference

## Angular Material Components

### Layout & Navigation
- `mat-toolbar` — top app bar, supports color themes
- `mat-sidenav-container` / `mat-sidenav` — responsive side navigation
- `mat-nav-list` — navigation list with `mat-list-item`
- `mat-tab-group` / `mat-tab` — tabbed interface with animated ink bar
- `mat-stepper` — step-by-step wizard (horizontal/vertical)
- `mat-expansion-panel` / `mat-accordion` — collapsible sections
- `mat-bottom-sheet` — mobile-first bottom sheet overlay

### Content Containers
- `mat-card` / `mat-card-header` / `mat-card-content` / `mat-card-actions` — content card
- `mat-list` / `mat-list-item` — structured list
- `mat-grid-list` / `mat-grid-tile` — responsive grid
- `mat-divider` — horizontal or vertical separator
- `mat-chip-set` / `mat-chip` / `mat-chip-row` — tag/chip group

### Forms & Inputs
- `mat-form-field` — unified form field wrapper with label, hint, error
- `matInput` — text input directive (inside `mat-form-field`)
- `mat-select` / `mat-option` / `mat-optgroup` — dropdown select
- `mat-checkbox` — material checkbox
- `mat-radio-group` / `mat-radio-button` — radio selection
- `mat-slide-toggle` — toggle switch
- `mat-slider` — range slider
- `mat-datepicker` — calendar popup date picker
- `mat-autocomplete` — searchable autocomplete dropdown
- `mat-chip-grid` — chip input for multi-value fields

### Buttons & Actions
- `mat-button` — text button (no background)
- `mat-raised-button` — filled primary action button
- `mat-stroked-button` — outlined button
- `mat-flat-button` — filled without elevation
- `mat-icon-button` — icon-only circular button
- `mat-fab` / `mat-mini-fab` — floating action button
- `mat-button-toggle-group` — segmented button group

### Data Display
- `mat-table` — data table with `matColumnDef`, `mat-header-cell`, `mat-cell`
- `mat-sort` — column sorting directive
- `mat-paginator` — pagination controls
- `mat-progress-bar` — linear progress indicator
- `mat-progress-spinner` — circular loading spinner
- `mat-badge` — notification badge overlay
- `mat-tooltip` — hover tooltip

### Overlays & Feedback
- `MatDialog` — modal dialog service
- `MatSnackBar` — bottom notification toast
- `mat-menu` / `mat-menu-item` — contextual dropdown menu
- `mat-bottom-sheet` — slide-up overlay panel
- `mat-select` panel — built-in dropdown overlay

## Angular-Specific Vocabulary

### Architecture Terms
- **Standalone component** — no NgModule, self-contained
- **Signal** — reactive primitive (`signal()`, `computed()`, `effect()`)
- **Input signal** — `input()` / `input.required()` for component props
- **Output** — `output()` for event emission
- **Resource** — `resource()` / `rxResource()` for async data loading
- **Route** — Angular Router URL-to-component mapping
- **Lazy route** — `loadComponent()` for code-split pages
- **Guard** — `CanActivate` / `CanDeactivate` route protection
- **Resolver** — pre-fetch data before route activation
- **Interceptor** — HTTP middleware for auth headers, error handling

### Form Vocabulary
- **Reactive form** — `FormBuilder`, `FormGroup`, `FormControl`, `FormArray`
- **Template-driven form** — `ngModel`, `#formRef`
- **Validators** — `Validators.required`, `Validators.email`, custom validators
- **Async validator** — server-side validation (unique username check, etc.)
- **ControlValueAccessor** — custom form control integration

### Routing & Navigation
- **Router outlet** — `<router-outlet>` placeholder for routed views
- **Router link** — `[routerLink]="['/path', id]"` declarative navigation
- **Route params** — `injectRouteParam()` / `ActivatedRoute`
- **Query params** — URL search parameters
- **Navigation extras** — `state`, `replaceUrl`, `queryParamsHandling`

## Adjective Palettes (Angular Context)

### Enterprise / Professional
clean, structured, information-dense, high-contrast, accessible, keyboard-navigable

### Modern SPA
fluid, responsive, animated, interactive, real-time, reactive

### Material Design
elevated, layered, purposeful motion, depth hierarchy, contained, outlined

### Dark Theme
inverted, deep-surface, high-emphasis text, reduced-tint surfaces

## Angular Material Color Roles (M3)

| CSS Variable | Role |
|---|---|
| `--mat-primary` | Primary brand color, filled buttons, active states |
| `--mat-on-primary` | Text/icons on primary color |
| `--mat-secondary` | Secondary actions, chips |
| `--mat-tertiary` | Accents, highlights |
| `--mat-surface` | Card and dialog backgrounds |
| `--mat-surface-variant` | Chip backgrounds, subtle containers |
| `--mat-outline` | Input borders, dividers |
| `--mat-on-surface` | Primary text |
| `--mat-on-surface-variant` | Secondary text, placeholders |
| `--mat-error` | Error states |
| `--mat-on-error` | Text on error background |

## Shape Scale (Angular Material)

| Token | Value | Natural Language |
|---|---|---|
| `--mat-shape-none` | 0px | Sharp, squared-off edges |
| `--mat-shape-extra-small` | 4px | Barely softened corners |
| `--mat-shape-small` | 8px | Gently softened corners |
| `--mat-shape-medium` | 12px | Moderately rounded corners |
| `--mat-shape-large` | 16px | Generously rounded corners |
| `--mat-shape-extra-large` | 28px | Very rounded, pillow-like |
| `--mat-shape-full` | 50% | Pill-shaped, fully circular |
