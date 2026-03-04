// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Angular Material 21 authentication layout component.
// Standalone, OnPush, signal-based, no hardcoded colors.

import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatTabsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Welcome</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group animationDuration="200ms">
            <!-- Login Tab -->
            <mat-tab label="Sign In">
              <form [formGroup]="loginForm" (ngSubmit)="login()" class="auth-form">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email"
                         autocomplete="email" />
                  <mat-icon matSuffix>email</mat-icon>
                  @if (loginForm.controls.email.hasError('required')) {
                    <mat-error>Email is required</mat-error>
                  }
                  @if (loginForm.controls.email.hasError('email')) {
                    <mat-error>Enter a valid email address</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="showPassword() ? 'text' : 'password'"
                         formControlName="password" autocomplete="current-password" />
                  <button mat-icon-button matSuffix type="button"
                          (click)="showPassword.update(v => !v)"
                          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
                    <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  @if (loginForm.controls.password.hasError('required')) {
                    <mat-error>Password is required</mat-error>
                  }
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit"
                        [disabled]="loginForm.invalid || isLoading()">
                  @if (isLoading()) {
                    <mat-spinner diameter="20" />
                  } @else {
                    Sign In
                  }
                </button>

                <a mat-button routerLink="/forgot-password" class="auth-link">
                  Forgot password?
                </a>
              </form>
            </mat-tab>

            <!-- Register Tab -->
            <mat-tab label="Create Account">
              <form [formGroup]="registerForm" (ngSubmit)="register()" class="auth-form">
                <mat-form-field appearance="outline">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" autocomplete="name" />
                  @if (registerForm.controls.name.hasError('required')) {
                    <mat-error>Name is required</mat-error>
                  }
                  @if (registerForm.controls.name.hasError('minlength')) {
                    <mat-error>At least 2 characters</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email"
                         autocomplete="email" />
                  @if (registerForm.controls.email.invalid && registerForm.controls.email.touched) {
                    <mat-error>Enter a valid email address</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" formControlName="password"
                         autocomplete="new-password" />
                  <mat-hint>Minimum 8 characters</mat-hint>
                  @if (registerForm.controls.password.hasError('minlength')) {
                    <mat-error>At least 8 characters required</mat-error>
                  }
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit"
                        [disabled]="registerForm.invalid || isLoading()">
                  @if (isLoading()) {
                    <mat-spinner diameter="20" />
                  } @else {
                    Create Account
                  }
                </button>
              </form>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-block: 24px;
    }

    .auth-link {
      align-self: flex-end;
    }
  `],
})
export class AuthLayoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async login() {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    try {
      // await this.authService.login(this.loginForm.getRawValue());
      await this.simulateRequest();
      await this.router.navigate(['/dashboard']);
    } catch {
      this.snackBar.open('Invalid credentials', 'Dismiss', { duration: 4000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  async register() {
    if (this.registerForm.invalid) return;
    this.isLoading.set(true);
    try {
      await this.simulateRequest();
      this.snackBar.open('Account created! Please sign in.', 'OK', { duration: 5000 });
    } catch {
      this.snackBar.open('Registration failed', 'Dismiss', { duration: 4000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  private simulateRequest(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
}
