#!/usr/bin/env bash
# Copyright 2026 Google LLC
# SPDX-License-Identifier: Apache-2.0
#
# Verifies Angular Material 21 setup in an Angular project.

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

check() {
  local name="$1"
  local condition="$2"
  local message="$3"
  local is_warning="${4:-false}"

  if eval "$condition"; then
    echo -e "${GREEN}✓${NC} $name"
    PASS=$((PASS + 1))
  else
    if [ "$is_warning" = "true" ]; then
      echo -e "${YELLOW}⚠${NC} $name"
      [ -n "$message" ] && echo "  → $message"
      WARN=$((WARN + 1))
    else
      echo -e "${RED}✗${NC} $name"
      [ -n "$message" ] && echo "  → $message"
      FAIL=$((FAIL + 1))
    fi
  fi
}

echo "Angular Material 21 Setup Verification"
echo "======================================="
echo ""

# ── Dependencies ──────────────────────────────────────────────────────────────
echo "Dependencies:"

check "@angular/material installed" \
  "cat package.json 2>/dev/null | grep -q '\"@angular/material\"'" \
  "Run: npm install @angular/material @angular/cdk"

check "@angular/cdk installed" \
  "cat package.json 2>/dev/null | grep -q '\"@angular/cdk\"'" \
  "Run: npm install @angular/cdk"

check "@angular/animations installed" \
  "cat package.json 2>/dev/null | grep -q '\"@angular/animations\"'" \
  "Run: npm install @angular/animations"

# ── Theme Configuration ────────────────────────────────────────────────────────
echo ""
echo "Theme Configuration:"

check "Theme SCSS file exists" \
  "ls src/styles/theme.scss 2>/dev/null || ls src/theme.scss 2>/dev/null || ls src/styles.scss 2>/dev/null" \
  "Create src/styles/theme.scss with mat.define-theme()"

check "mat.define-theme() used" \
  "grep -r 'define-theme' src/ 2>/dev/null | grep -q 'define-theme'" \
  "Use mat.define-theme() in your theme SCSS file (see resources/setup-guide.md)"

check "mat.all-component-themes() applied" \
  "grep -r 'all-component-themes' src/ 2>/dev/null | grep -q '.'" \
  "Add @include mat.all-component-themes(\$theme) to your theme SCSS"

check "Theme in angular.json styles" \
  "cat angular.json 2>/dev/null | grep -q 'theme.scss'" \
  "Add src/styles/theme.scss to angular.json styles array" \
  "true"

# ── App Configuration ──────────────────────────────────────────────────────────
echo ""
echo "App Configuration (Angular 21):"

check "provideAnimationsAsync() configured" \
  "grep -r 'provideAnimationsAsync' src/ 2>/dev/null | grep -q '.'" \
  "Add provideAnimationsAsync() to app.config.ts providers"

check "provideZonelessChangeDetection() configured" \
  "grep -r 'provideZonelessChangeDetection\|provideExperimentalZonelessChangeDetection' src/ 2>/dev/null | grep -q '.'" \
  "Consider adding provideZonelessChangeDetection() for Angular 21 zoneless mode" \
  "true"

# ── Standalone & Signals Pattern ───────────────────────────────────────────────
echo ""
echo "Angular 21 Patterns:"

check "No NgModules in app/ (standalone pattern)" \
  "! grep -r 'NgModule\b' src/app/ 2>/dev/null | grep -v 'spec\|node_modules' | grep -q 'NgModule'" \
  "Remove NgModule declarations — use standalone: true components" \
  "true"

check "@Input() decorator absent (use input() signals)" \
  "! grep -r '@Input()' src/app/ 2>/dev/null | grep -v 'spec\|node_modules' | grep -q '@Input()'" \
  "Replace @Input() decorators with input() signal functions" \
  "true"

check "@Output() decorator absent (use output() functions)" \
  "! grep -r '@Output()' src/app/ 2>/dev/null | grep -v 'spec\|node_modules' | grep -q '@Output()'" \
  "Replace @Output() + EventEmitter with output() functions" \
  "true"

# ── Material Icons ─────────────────────────────────────────────────────────────
echo ""
echo "Material Icons:"

check "Material Icons font loaded" \
  "grep -r 'Material+Icons\|material-symbols\|Material+Symbols' src/index.html angular.json 2>/dev/null | grep -q '.'" \
  "Add Material Icons font to index.html or install material-symbols package" \
  "true"

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
echo "======================================="
echo -e "Results: ${GREEN}${PASS} passed${NC}, ${YELLOW}${WARN} warnings${NC}, ${RED}${FAIL} failed${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Fix required issues before proceeding."
  echo "See resources/setup-guide.md for detailed instructions."
  exit 1
else
  echo "✓ Angular Material setup looks good!"
  exit 0
fi
