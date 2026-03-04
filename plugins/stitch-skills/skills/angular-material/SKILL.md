---
name: angular-material
description: Expert guidance for integrating Angular Material 21 (M3) into Stitch-generated Angular apps. Covers setup, theming, component usage, and customization.
allowed-tools:
  - "angular*:*"
  - "stitch*:*"
  - "playwright*:*"
  - "Bash"
  - "Read"
  - "Write"
---

# Angular Material Skill

Expert guidance for Angular Material 21 with Material Design 3 (M3) tokens, custom theming from Stitch designs, and production-ready component patterns.

## Workflow

### Stage 1: Discovery & Planning

1. `angular:list_projects` → identify project structure
2. `angular:search_documentation query="angular material m3 theming"` → current M3 docs
3. `angular:get_best_practices` → Angular Material integration patterns
4. Check if `@angular/material` is installed:

```bash
cat package.json | grep @angular/material
```

5. Identify components needed from `resources/component-catalog.md`

### Stage 2: Setup & Configuration

If Angular Material is not installed:

```bash
ng add @angular/material
```

This installs `@angular/material`, `@angular/cdk`, configures animations, and adds typography.

For manual setup:
```bash
npm install @angular/material @angular/cdk
```

In `app.config.ts`:
```typescript
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),  // Angular 21: zoneless by default
    provideAnimationsAsync(),
  ],
};
```

### Stage 3: M3 Theme from Stitch Design

Create `src/styles/theme.scss` from your `DESIGN.md` color palette:

```scss
@use '@angular/material' as mat;

// 1. Define M3 theme
$app-theme: mat.define-theme((
  color: (
    theme-type: light,  // or dark
    primary: mat.$violet-palette,   // closest Material palette to your brand
    tertiary: mat.$rose-palette,
  ),
  typography: (
    plain-family: "'Your Font', sans-serif",
    brand-family: "'Your Display Font', sans-serif",
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (scale: 0),  // -1, -2, -3 for compact layouts
));

// 2. Apply theme globally
:root {
  @include mat.all-component-themes($app-theme);
  @include mat.typography-hierarchy($app-theme);
}

// 3. Override with exact Stitch brand colors
:root {
  // Map Stitch design tokens to Material CSS variables
  // Get these hex values from your DESIGN.md

  // Example overrides (replace with values from DESIGN.md):
  // --mdc-filled-button-container-color: #294056;
  // --mat-card-elevated-container-color: #F5F5F5;
}
```

In `angular.json`, ensure theme is loaded:
```json
{
  "styles": ["src/styles/theme.scss", "src/styles.scss"]
}
```

### Stage 4: Component Integration

Use Angular Material components in standalone components. Import modules directly:

```typescript
// In your standalone component
@Component({
  standalone: true,
  imports: [
    // Import specific Material modules (tree-shakable)
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
```

### Stage 5: Visual Verification with Playwright

After implementing Material components:

```
playwright:browser_navigate url="http://localhost:4200"
playwright:browser_snapshot
playwright:browser_screenshot
```

Compare with Stitch reference: verify Material theme colors match design tokens.

## Angular Material 21 Component Patterns

### Standalone App Shell

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()" aria-label="Toggle navigation">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-title">{{ title }}</span>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="!isMobile()">
        <mat-nav-list>
          @for (link of navLinks; track link.route) {
            <a mat-list-item [routerLink]="link.route" routerLinkActive="active">
              <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
              <span matListItemTitle>{{ link.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AppComponent {
  readonly title = 'My App';
  readonly isMobile = inject(BreakpointObserver)
    .observe([Breakpoints.Handset])
    .pipe(map(r => r.matches));

  readonly navLinks = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/products', icon: 'inventory', label: 'Products' },
    { route: '/settings', icon: 'settings', label: 'Settings' },
  ];
}
```

### Data Table with Sort & Pagination

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
  ],
  template: `
    <mat-form-field>
      <mat-label>Filter</mat-label>
      <input matInput (input)="applyFilter($event)" placeholder="Search..." />
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>

    <mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="4">No results found</td>
      </tr>
    </mat-table>

    <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons />
  `,
})
export class DataTableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns = ['name', 'email', 'role', 'actions'];
  readonly dataSource = new MatTableDataSource(MOCK_DATA);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
```

### Reactive Form with Validation

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
        @if (form.controls.name.hasError('required')) {
          <mat-error>Name is required</mat-error>
        }
        @if (form.controls.name.hasError('minlength')) {
          <mat-error>At least 2 characters</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Role</mat-label>
        <mat-select formControlName="role">
          <mat-option value="admin">Admin</mat-option>
          <mat-option value="user">User</mat-option>
          <mat-option value="viewer">Viewer</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit"
              [disabled]="form.invalid || isSubmitting()">
        @if (isSubmitting()) {
          <mat-spinner diameter="20" />
        } @else {
          Save
        }
      </button>
    </form>
  `,
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user' as const, Validators.required],
  });

  async submit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    try {
      // await this.userService.save(this.form.getRawValue());
      this.snackBar.open('Saved successfully', 'Dismiss', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
```
