#!/usr/bin/env bash
# Copyright 2026 Google LLC
# Adapted for Angular 21 + Angular MCP + Playwright MCP
# SPDX-License-Identifier: Apache-2.0
#
# Installs Stitch Skills into ~/.claude/skills/

set -e

SKILLS_DIR="$(dirname "$0")/skills"
TARGET_DIR="$HOME/.claude/skills"

mkdir -p "$TARGET_DIR"

echo "Installing Stitch Skills (Angular 21 edition)..."

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$skill_dir")
  target="$TARGET_DIR/$skill_name"
  echo "  → $skill_name"
  rm -rf "$target"
  cp -r "$skill_dir" "$target"
done

echo ""
echo "✓ Installed skills:"
ls "$TARGET_DIR"
echo ""
echo "Add MCPs to .claude/settings.json:"
echo '{'
echo '  "mcpServers": {'
echo '    "angular": { "command": "npx", "args": ["-y", "@angular/cli", "mcp"] },'
echo '    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }'
echo '  }'
echo '}'
