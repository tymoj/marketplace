# Angular Material 21 Customization Guide

## M3 Theming from Stitch Design Tokens

### Step 1: Map Stitch Colors to M3 Palettes

Angular Material M3 uses palettes from `@angular/material`. Find the closest match to your Stitch brand color:

```scss
@use '@angular/material' as mat;

// Available palettes:
// $red-palette, $pink-palette, $purple-palette, $deep-purple-palette
// $indigo-palette, $blue-palette, $light-blue-palette, $cyan-palette
// $teal-palette, $green-palette, $light-green-palette, $lime-palette
// $yellow-palette, $amber-palette, $orange-palette, $deep-orange-palette
// $brown-palette, $grey-palette, $blue-grey-palette
// $azure-palette, $violet-palette, $rose-palette (M3 specific)
```

### Step 2: Override with Exact Brand Colors via CSS Variables

After applying the Material palette theme, override specific tokens:

```scss
:root {
  // --- PRIMARY COLOR OVERRIDES ---
  // These override the palette-generated values with exact Stitch hex values

  // Filled button (mat-raised-button)
  --mdc-filled-button-container-color: #294056;
  --mdc-filled-button-label-text-color: #FFFFFF;

  // Outlined button focus/active ring
  --mdc-outlined-button-outline-color: #294056;

  // Card surface
  --mdc-elevated-card-container-color: #F5F5F5;
  --mdc-outlined-card-outline-color: #E0E0E0;

  // Form field focus
  --mdc-outlined-text-field-focus-outline-color: #294056;
  --mdc-outlined-text-field-focus-label-text-color: #294056;

  // Tab group
  --mat-tab-header-active-label-text-color: #294056;
  --mat-tab-header-active-indicator-color: #294056;

  // Checkbox/Radio checked state
  --mdc-checkbox-selected-checkmark-color: #FFFFFF;
  --mdc-checkbox-selected-focus-icon-color: #294056;
  --mdc-checkbox-selected-hover-icon-color: #294056;
  --mdc-checkbox-selected-icon-color: #294056;
  --mdc-checkbox-selected-pressed-icon-color: #294056;

  // Slide toggle
  --mdc-switch-selected-handle-color: #294056;
  --mdc-switch-selected-track-color: #294056;
}
```

### Step 3: Typography from Stitch DESIGN.md

```scss
// Map Stitch typography to Angular Material type scale
html {
  // Override Material typography CSS variables
  --mat-toolbar-title-text-font: 'Manrope', sans-serif;
  --mat-toolbar-title-text-size: 1.25rem;
  --mat-toolbar-title-text-weight: 600;

  // Heading sizes from DESIGN.md
  --mat-headline-large-font: 'Manrope', sans-serif;
  --mat-headline-large-size: 2.75rem;
  --mat-headline-large-weight: 600;
  --mat-headline-large-line-height: 1.15;

  --mat-body-large-font: 'Manrope', sans-serif;
  --mat-body-large-size: 1rem;
  --mat-body-large-line-height: 1.7;
}
```

## Component-Level Theming

### Themed Card Component

```scss
// feature-card.component.scss
@use '@angular/material' as mat;

// Apply theme mixin scoped to this component
:host {
  @include mat.card-overrides((
    elevated-container-color: var(--brand-surface),
    elevated-container-elevation: 2,
  ));
}
```

### Density for Compact Layouts

```scss
// For dense forms/tables (admin dashboards, data views)
$compact-theme: mat.define-theme((
  color: (theme-type: light, primary: mat.$azure-palette),
  density: (scale: -2),  // -1, -2, -3 progressively more compact
));

.compact-form {
  @include mat.form-field-density($compact-theme);
  @include mat.button-density($compact-theme);
}
```

## Dark Mode

### System-Preference Dark Mode

```scss
// theme.scss
@use '@angular/material' as mat;

$light-theme: mat.define-theme((
  color: (theme-type: light, primary: mat.$azure-palette),
));

$dark-theme: mat.define-theme((
  color: (theme-type: dark, primary: mat.$azure-palette),
));

:root {
  @include mat.all-component-themes($light-theme);
}

@media (prefers-color-scheme: dark) {
  :root {
    @include mat.all-component-colors($dark-theme);
  }
}
```

### Manual Dark Mode Toggle

```scss
// Apply dark theme when body has .dark-mode class
.dark-mode {
  @include mat.all-component-colors($dark-theme);
}
```

```typescript
// dark-mode.service.ts
@Injectable({ providedIn: 'root' })
export class DarkModeService {
  private readonly isDark = signal(false);

  toggle(): void {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-mode', this.isDark());
  }
}
```

## Custom Variants (CVA-style with Angular)

### Custom Button Wrapper

```typescript
@Component({
  selector: 'app-loading-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  template: `
    <button mat-raised-button [color]="color()" [disabled]="loading() || disabled()"
            (click)="clicked.emit()">
      @if (loading()) {
        <mat-spinner diameter="18" class="button-spinner" />
      }
      <ng-content />
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }
    .button-spinner { margin-inline-end: 8px; }
  `],
})
export class LoadingButtonComponent {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  color = input<'primary' | 'accent' | 'warn'>('primary');
  clicked = output<void>();
}
```

## Shape Customization

```scss
:root {
  // Override M3 shape tokens globally
  --mdc-shape-small: 8px;     // buttons, chips, inputs
  --mdc-shape-medium: 12px;   // cards, dialogs
  --mdc-shape-large: 16px;    // side sheets
  --mdc-shape-extra-large: 28px;

  // Component-specific shape
  --mdc-filled-button-container-shape: 8px;
  --mdc-elevated-card-container-shape: 12px;
  --mdc-dialog-container-shape: 16px;
}
```
