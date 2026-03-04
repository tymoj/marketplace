# Angular Components Architecture Checklist

Review all items before marking a component as complete.

## Angular 21 Patterns

- [ ] Component has `standalone: true` in `@Component` decorator
- [ ] Uses `ChangeDetectionStrategy.OnPush` in `@Component` decorator
- [ ] Props use `input()` / `input.required()` signal functions (NOT `@Input()` decorator)
- [ ] Events use `output()` function (NOT `@Output()` + `EventEmitter`)
- [ ] Internal state uses `signal()` and `computed()` (NOT class properties)
- [ ] Services injected with `inject()` function (NOT constructor parameters)
- [ ] Template uses new control flow (`@for`, `@if`, `@switch`, `@let`) NOT structural directives (`*ngFor`, `*ngIf`)
- [ ] Template `@for` loops include `track` expression

## Type Safety

- [ ] TypeScript interface defined for component's data model
- [ ] Interface uses `readonly` modifier for all fields
- [ ] No `any` types
- [ ] No `as` casts (use type narrowing)
- [ ] Strict null checks satisfied (no `!` non-null assertions without comment)

## Structural Integrity

- [ ] Smart/container components separated from presentational components
- [ ] Static mock data in `src/app/shared/data/mock-data.ts`
- [ ] Models in `src/app/[feature]/models/`
- [ ] No business logic in templates
- [ ] No direct DOM manipulation (use Angular renderer or CDK)

## Angular Material Integration

- [ ] Angular Material modules imported directly in component `imports` array
- [ ] Using `mat-` prefixed components for UI elements (buttons, cards, inputs, etc.)
- [ ] Form fields use `mat-form-field` wrapper with `matInput`
- [ ] Icons use `<mat-icon>` component

## Styling

- [ ] SCSS file used for component styles (`.component.scss`)
- [ ] NO hardcoded hex color values in templates
- [ ] NO hardcoded hex color values in SCSS
- [ ] Colors use Angular Material CSS variables (`--mat-*`) or theme mixins
- [ ] Responsive styles use Angular CDK breakpoints or Material breakpoint tokens
- [ ] No `!important` in SCSS

## Accessibility

- [ ] Interactive elements have descriptive `aria-label` or `aria-labelledby`
- [ ] Images have `[alt]` attribute bound to meaningful description
- [ ] Form fields associated with labels via `mat-form-field` / `<label>`
- [ ] Color is not the only visual differentiator (also use icon, text, shape)
- [ ] Focus styles are visible (Angular Material default or custom)

## Testing

- [ ] Component spec file exists (`[name].component.spec.ts`)
- [ ] Spec uses `TestBed.configureTestingModule` with `imports: [ComponentUnderTest]`
- [ ] Key user interactions tested
- [ ] Input/output signal bindings tested

## Build

- [ ] `ng build --configuration=development` completes with 0 errors
- [ ] No TypeScript errors
- [ ] No template compilation errors
- [ ] Playwright visual verification completed (screenshot compared to Stitch reference)
