# Angular Material 21 Component Catalog

## Layout & Navigation

| Component | Module | Use Case |
|---|---|---|
| `mat-toolbar` | `MatToolbarModule` | Top app bar, page header |
| `mat-sidenav-container` | `MatSidenavModule` | App shell with side navigation |
| `mat-tab-group` | `MatTabsModule` | Tabbed content sections |
| `mat-stepper` | `MatStepperModule` | Multi-step wizard flows |
| `mat-expansion-panel` | `MatExpansionModule` | Collapsible content, FAQ |
| `mat-bottom-sheet` | `MatBottomSheetModule` | Mobile action sheets |

### mat-toolbar

```typescript
imports: [MatToolbarModule]
```
```html
<mat-toolbar color="primary">
  <button mat-icon-button><mat-icon>menu</mat-icon></button>
  <span>App Title</span>
  <span class="toolbar-spacer"></span>
  <button mat-button>Profile</button>
</mat-toolbar>
```
Colors: `color="primary"` | `color="accent"` | default (surface)

### mat-sidenav

```html
<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <mat-nav-list>
      <a mat-list-item routerLink="/home">
        <mat-icon matListItemIcon>home</mat-icon>
        <span matListItemTitle>Home</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```
Modes: `side` (persistent) | `push` (shifts content) | `over` (overlay)

---

## Content Display

| Component | Module | Use Case |
|---|---|---|
| `mat-card` | `MatCardModule` | Content card with header, content, actions |
| `mat-list` | `MatListModule` | Structured list, navigation list |
| `mat-table` | `MatTableModule` | Data table (combine with MatSort, MatPaginator) |
| `mat-chip-set` | `MatChipsModule` | Tag/category chips |
| `mat-badge` | `MatBadgeModule` | Notification count overlay |
| `mat-progress-bar` | `MatProgressBarModule` | Linear progress indicator |
| `mat-progress-spinner` | `MatProgressSpinnerModule` | Circular loading indicator |
| `mat-divider` | `MatDividerModule` | Horizontal separator |

### mat-card

```html
<mat-card appearance="outlined">
  <mat-card-header>
    <img mat-card-avatar [src]="user.avatar" [alt]="user.name" />
    <mat-card-title>{{ user.name }}</mat-card-title>
    <mat-card-subtitle>{{ user.role }}</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>{{ user.bio }}</p>
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-button>Edit</button>
    <button mat-raised-button color="primary">View Profile</button>
  </mat-card-actions>
</mat-card>
```
Appearances: `raised` (default, elevated) | `outlined` (border, no elevation) | `flat`

### mat-table (with sort + pagination)

```typescript
imports: [MatTableModule, MatSortModule, MatPaginatorModule]
```
```html
<mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
  </ng-container>
  <!-- more columns -->
  <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: columns;" (click)="select(row)"></mat-row>
</mat-table>
<mat-paginator [pageSizeOptions]="[10, 25, 100]" />
```

---

## Forms & Inputs

| Component | Module | Use Case |
|---|---|---|
| `mat-form-field` | `MatFormFieldModule` | Unified input wrapper (all inputs go inside this) |
| `matInput` | `MatInputModule` | Text, email, password, number inputs |
| `mat-select` | `MatSelectModule` | Dropdown selection |
| `mat-checkbox` | `MatCheckboxModule` | Boolean checkbox |
| `mat-radio-group` | `MatRadioModule` | Single-select radio buttons |
| `mat-slide-toggle` | `MatSlideToggleModule` | On/off toggle switch |
| `mat-slider` | `MatSliderModule` | Range/value slider |
| `mat-datepicker` | `MatDatepickerModule` | Calendar date picker |
| `mat-autocomplete` | `MatAutocompleteModule` | Searchable autocomplete |
| `mat-chip-grid` | `MatChipsModule` | Multi-value chip input |

### mat-form-field appearances

```html
<!-- Outline (recommended for most forms) -->
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput type="email" />
  <mat-icon matSuffix>email</mat-icon>
  <mat-hint>We'll never share your email</mat-hint>
  <mat-error>Invalid email address</mat-error>
</mat-form-field>

<!-- Fill (for search bars, compact forms) -->
<mat-form-field appearance="fill">
  <mat-label>Search</mat-label>
  <input matInput />
  <mat-icon matPrefix>search</mat-icon>
</mat-form-field>
```

### mat-select

```html
<mat-form-field appearance="outline">
  <mat-label>Role</mat-label>
  <mat-select formControlName="role">
    <mat-optgroup label="Staff">
      <mat-option value="admin">Admin</mat-option>
      <mat-option value="manager">Manager</mat-option>
    </mat-optgroup>
    <mat-optgroup label="Customers">
      <mat-option value="user">User</mat-option>
    </mat-optgroup>
  </mat-select>
</mat-form-field>
```

---

## Buttons & Actions

| Directive | Use Case |
|---|---|
| `mat-button` | Low emphasis text action |
| `mat-stroked-button` | Medium emphasis outlined action |
| `mat-flat-button` | Medium emphasis filled (no shadow) |
| `mat-raised-button` | High emphasis filled primary action |
| `mat-icon-button` | Icon-only action (toolbar, list actions) |
| `mat-fab` | Primary floating action (full) |
| `mat-mini-fab` | Primary floating action (compact) |

```html
<button mat-raised-button color="primary">Primary</button>
<button mat-stroked-button color="primary">Secondary</button>
<button mat-button>Tertiary</button>
<button mat-icon-button aria-label="Edit">
  <mat-icon>edit</mat-icon>
</button>
```
Colors: `color="primary"` | `color="accent"` | `color="warn"`

### Button Toggle Group

```html
<mat-button-toggle-group [value]="selectedView()">
  <mat-button-toggle value="list">
    <mat-icon>list</mat-icon>
  </mat-button-toggle>
  <mat-button-toggle value="grid">
    <mat-icon>grid_view</mat-icon>
  </mat-button-toggle>
</mat-button-toggle-group>
```

---

## Overlays & Feedback

| Service/Component | Module | Use Case |
|---|---|---|
| `MatDialog` | `MatDialogModule` | Modal dialogs |
| `MatSnackBar` | `MatSnackBarModule` | Toast notifications |
| `MatBottomSheet` | `MatBottomSheetModule` | Action sheets |
| `mat-menu` | `MatMenuModule` | Contextual dropdown menus |
| `mat-tooltip` | `MatTooltipModule` | Hover tooltips |

### MatDialog

```typescript
const dialogRef = inject(MatDialog).open(ConfirmDialogComponent, {
  data: { message: 'Are you sure?' },
  width: '400px',
});

dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  if (confirmed) this.doAction();
});
```

### MatSnackBar

```typescript
inject(MatSnackBar).open('Saved successfully', 'Dismiss', {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
});
```

---

## Quick Composition Patterns

### Page with Loading State

```html
@if (data.isLoading()) {
  <div class="page-loading">
    <mat-spinner />
  </div>
} @else if (data.error()) {
  <mat-card class="error-card">
    <mat-card-content>
      <mat-icon color="warn">error</mat-icon>
      {{ data.error()?.message }}
    </mat-card-content>
    <mat-card-actions>
      <button mat-button (click)="data.reload()">Retry</button>
    </mat-card-actions>
  </mat-card>
} @else {
  <!-- main content -->
}
```

### Empty State

```html
@if (items().length === 0) {
  <div class="empty-state">
    <mat-icon>inbox</mat-icon>
    <h3 class="mat-headline-small">No items found</h3>
    <p class="mat-body-medium">Get started by adding your first item.</p>
    <button mat-raised-button color="primary" (click)="addItem()">
      <mat-icon>add</mat-icon>
      Add Item
    </button>
  </div>
}
```
