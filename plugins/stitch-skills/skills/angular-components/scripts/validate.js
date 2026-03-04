#!/usr/bin/env node
// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Validates an Angular 21 component file for architectural compliance.
// Checks: standalone, OnPush, input() signals, no hardcoded hex colors.
//
// Usage: node scripts/validate.js <path-to-component.ts>

import { readFileSync } from 'fs';
import { resolve } from 'path';

const targetFile = process.argv[2];

if (!targetFile) {
  console.error('Usage: node scripts/validate.js <path-to-component.ts>');
  process.exit(1);
}

const filePath = resolve(targetFile);
let source;

try {
  source = readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`✗ Could not read file: ${filePath}`);
  console.error(err.message);
  process.exit(1);
}

console.log(`\nValidating: ${filePath}\n`);

const results = [];

// ── Check 1: standalone: true ────────────────────────────────────────────────
{
  const hasStandalone = /standalone\s*:\s*true/.test(source);
  results.push({
    name: 'standalone: true in @Component',
    pass: hasStandalone,
    message: hasStandalone
      ? 'Component is standalone'
      : 'Missing standalone: true — add it to @Component decorator',
  });
}

// ── Check 2: ChangeDetectionStrategy.OnPush ──────────────────────────────────
{
  const hasOnPush = /ChangeDetectionStrategy\.OnPush/.test(source);
  results.push({
    name: 'ChangeDetectionStrategy.OnPush',
    pass: hasOnPush,
    message: hasOnPush
      ? 'OnPush change detection strategy used'
      : 'Missing OnPush — add changeDetection: ChangeDetectionStrategy.OnPush to @Component',
  });
}

// ── Check 3: input() signals (not @Input()) ───────────────────────────────────
{
  const hasInputDecorator = /@Input\s*\(/.test(source);
  const hasInputSignal = /\binput\s*[<(]/.test(source) || /\binput\.required/.test(source);

  if (hasInputDecorator) {
    results.push({
      name: 'Input signals (not @Input decorator)',
      pass: false,
      message: 'Found @Input() decorator — replace with input() or input.required() signal functions',
    });
  } else if (hasInputSignal) {
    results.push({
      name: 'Input signals',
      pass: true,
      message: 'Uses input() signal functions correctly',
    });
  } else {
    results.push({
      name: 'Input signals',
      pass: true,
      message: 'No inputs found (may be intentional for leaf components)',
    });
  }
}

// ── Check 4: output() function (not @Output() + EventEmitter) ────────────────
{
  const hasOutputDecorator = /@Output\s*\(/.test(source);
  if (hasOutputDecorator) {
    results.push({
      name: 'output() functions (not @Output decorator)',
      pass: false,
      message: 'Found @Output() decorator — replace with output() function',
    });
  } else {
    results.push({
      name: 'output() functions',
      pass: true,
      message: 'No @Output() decorators found',
    });
  }
}

// ── Check 5: TypeScript interface for data model ──────────────────────────────
{
  const hasInterface = /\binterface\s+\w+/.test(source);
  results.push({
    name: 'TypeScript interface defined',
    pass: hasInterface,
    message: hasInterface
      ? 'TypeScript interface found for component data'
      : 'No TypeScript interface found — define an interface for component input data',
  });
}

// ── Check 6: No hardcoded hex colors ─────────────────────────────────────────
{
  // Match hex colors outside of comments
  const hexPattern = /#[0-9A-Fa-f]{6}\b/g;
  const sourceWithoutComments = source
    .replace(/\/\/[^\n]*/g, '')   // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // remove multi-line comments

  const hexMatches = sourceWithoutComments.match(hexPattern) || [];

  if (hexMatches.length > 0) {
    results.push({
      name: 'No hardcoded hex colors',
      pass: false,
      message: `Found hardcoded hex colors: ${hexMatches.slice(0, 5).join(', ')}${hexMatches.length > 5 ? '...' : ''} — use Angular Material CSS variables (--mat-*) instead`,
    });
  } else {
    results.push({
      name: 'No hardcoded hex colors',
      pass: true,
      message: 'No hardcoded hex colors found',
    });
  }
}

// ── Check 7: Uses Angular Material (mat- components) ─────────────────────────
{
  const hasAngularMaterial =
    /MatCardModule|MatButtonModule|MatIconModule|MatFormFieldModule|mat-card|mat-button|matInput/.test(source);
  results.push({
    name: 'Uses Angular Material',
    pass: hasAngularMaterial,
    message: hasAngularMaterial
      ? 'Angular Material components imported and used'
      : 'No Angular Material found — consider using mat-card, mat-button, etc.',
  });
}

// ── Print results ─────────────────────────────────────────────────────────────
let failures = 0;

for (const result of results) {
  const icon = result.pass ? '✓' : '✗';
  const label = result.pass ? '\x1b[32m' : '\x1b[31m'; // green : red
  const reset = '\x1b[0m';
  console.log(`${label}${icon}${reset} ${result.name}`);
  if (!result.pass) {
    console.log(`  → ${result.message}`);
    failures++;
  }
}

console.log('');

if (failures === 0) {
  console.log('✨ All checks passed!');
  process.exit(0);
} else {
  console.log(`✗ ${failures} check(s) failed.`);
  process.exit(1);
}
