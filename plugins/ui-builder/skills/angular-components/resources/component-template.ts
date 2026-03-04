// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Angular 21 standalone component template.
// Replace all occurrences of "StitchComponent" and "stitch-component" with your component name.
// Replace StitchComponentData with your typed interface.

import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

// 1. Define a typed interface for the component's data model.
//    Move to src/app/[feature]/models/[feature].model.ts
export interface StitchComponentData {
  readonly id: string;
  // Add fields here matching the Stitch design data
}

@Component({
  selector: 'app-stitch-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Import Angular Material modules directly (no NgModule)
    MatCardModule,
    MatButtonModule,
    // Add other imports: DatePipe, NgFor, AsyncPipe, etc.
  ],
  template: `
    <!-- Replace with your Angular Material template -->
    <!-- Use new control flow: @for, @if, @switch, @let -->
    <mat-card>
      <mat-card-content>
        {{ label() }}
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="handleAction()">Action</button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './stitch-component.component.scss',
})
export class StitchComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────
  // Use input() for required inputs, input<T>(default) for optional
  data = input.required<StitchComponentData>();
  label = input<string>('');
  disabled = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────────────
  // Use output() instead of @Output() + EventEmitter
  actionClicked = output<StitchComponentData>();
  stateChanged = output<boolean>();

  // ── Internal State ───────────────────────────────────────────────────────
  // Use signal() for mutable local state
  private readonly isActive = signal(false);

  // ── Derived State ────────────────────────────────────────────────────────
  // Use computed() for values derived from signals
  readonly displayLabel = computed(() =>
    this.label() || this.data().id
  );

  // ── Services ─────────────────────────────────────────────────────────────
  // Use inject() instead of constructor injection
  // private readonly myService = inject(MyService);

  // ── Methods ──────────────────────────────────────────────────────────────
  handleAction(): void {
    if (this.disabled()) return;
    this.isActive.update(v => !v);
    this.actionClicked.emit(this.data());
    this.stateChanged.emit(this.isActive());
  }
}
