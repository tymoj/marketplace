// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Gold-standard Angular 21 component converted from Stitch design.
// Demonstrates: standalone, OnPush, input() signals, Angular Material,
// no hardcoded colors, new control flow syntax.

import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ActivityAction = 'MERGED' | 'COMMIT' | 'REVIEW' | 'COMMENT';

export interface ActivityCardData {
  readonly id: string;
  readonly username: string;
  readonly action: ActivityAction;
  readonly timestamp: string; // ISO 8601
  readonly avatarUrl: string;
  readonly repoName: string;
  readonly repoUrl?: string;
  readonly message?: string;
}

@Component({
  selector: 'app-activity-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card class="activity-card" [attr.data-action]="data().action.toLowerCase()">
      <mat-card-header>
        <img
          mat-card-avatar
          [src]="data().avatarUrl"
          [alt]="data().username + ' avatar'"
          class="activity-card__avatar"
        />
        <mat-card-title>{{ data().username }}</mat-card-title>
        <mat-card-subtitle>
          <mat-chip
            [class]="'activity-card__badge activity-card__badge--' + data().action.toLowerCase()"
            [matTooltip]="actionLabel()"
          >
            <mat-icon matChipAvatar>{{ actionIcon() }}</mat-icon>
            {{ data().action }}
          </mat-chip>
        </mat-card-subtitle>
      </mat-card-header>

      @if (data().message) {
        <mat-card-content>
          <p class="activity-card__message">{{ data().message }}</p>
        </mat-card-content>
      }

      <mat-card-actions align="end">
        <a
          mat-button
          class="activity-card__repo-link"
          [href]="data().repoUrl ?? '#'"
          target="_blank"
          rel="noopener noreferrer"
        >
          <mat-icon>code</mat-icon>
          {{ data().repoName }}
        </a>
        <span class="activity-card__timestamp mat-body-small">
          {{ data().timestamp | date: 'MMM d, h:mm a' }}
        </span>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .activity-card {
      margin-block-end: 0.75rem;
    }

    .activity-card__avatar {
      border-radius: 50%;
    }

    .activity-card__message {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 40ch;
    }

    .activity-card__timestamp {
      margin-inline-start: auto;
      opacity: 0.6;
    }

    .activity-card__repo-link {
      font-size: 0.875rem;
    }

    /* Action badge colors via CSS custom properties (no hardcoded hex) */
    .activity-card__badge--merged {
      background-color: var(--mat-tertiary-container);
      color: var(--mat-on-tertiary-container);
    }

    .activity-card__badge--commit {
      background-color: var(--mat-primary-container);
      color: var(--mat-on-primary-container);
    }

    .activity-card__badge--review {
      background-color: var(--mat-secondary-container);
      color: var(--mat-on-secondary-container);
    }

    .activity-card__badge--comment {
      background-color: var(--mat-surface-variant);
      color: var(--mat-on-surface-variant);
    }
  `],
})
export class ActivityCardComponent {
  // Inputs — signal-based (Angular 21)
  data = input.required<ActivityCardData>();

  // Outputs
  cardClicked = output<ActivityCardData>();

  // Derived state
  readonly actionIcon = computed((): string => {
    switch (this.data().action) {
      case 'MERGED':  return 'merge';
      case 'COMMIT':  return 'commit';
      case 'REVIEW':  return 'rate_review';
      case 'COMMENT': return 'comment';
    }
  });

  readonly actionLabel = computed((): string => {
    switch (this.data().action) {
      case 'MERGED':  return 'Merged pull request';
      case 'COMMIT':  return 'Pushed a commit';
      case 'REVIEW':  return 'Submitted a review';
      case 'COMMENT': return 'Left a comment';
    }
  });

  handleClick(): void {
    this.cardClicked.emit(this.data());
  }
}
