#!/usr/bin/env bash
# Validates Mermaid syntax in markdown files containing ```mermaid blocks.
# Used as a PostToolUse hook for Write|Edit operations.
# Requires: mmdc (npm install -g @mermaid-js/mermaid-cli)
#
# Exit 0 = valid or not a mermaid file (no blocking)
# Non-zero exit + stderr message = shown to Claude as hook feedback

FILE_PATH="$1"

# Skip if no file path or file doesn't exist
[ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ] && exit 0

# Only process .md files
[[ "$FILE_PATH" == *.md ]] || exit 0

# Check if file contains mermaid code blocks
grep -q '```mermaid' "$FILE_PATH" 2>/dev/null || exit 0

# Check if mmdc is available — skip silently if not
command -v mmdc &>/dev/null || exit 0

# Extract mermaid blocks and validate each
TEMP_DIR=$(mktemp -d)
HAS_ERROR=false
BLOCK_NUM=0

awk '/^```mermaid$/,/^```$/{if(/^```mermaid$/){f=1;n++;next}if(/^```$/){f=0;next}if(f)print > "'"$TEMP_DIR"'/block_"n".mmd"}' "$FILE_PATH"

for block in "$TEMP_DIR"/block_*.mmd; do
  [ -f "$block" ] || continue
  BLOCK_NUM=$((BLOCK_NUM + 1))
  OUTPUT=$(mmdc -i "$block" -o /dev/null 2>&1)
  if [ $? -ne 0 ]; then
    echo "Mermaid syntax error in block $BLOCK_NUM of $FILE_PATH:" >&2
    echo "$OUTPUT" >&2
    HAS_ERROR=true
  fi
done

rm -rf "$TEMP_DIR"
$HAS_ERROR && exit 1
exit 0