#!/usr/bin/env bash
# Copyright 2026 Google LLC
# SPDX-License-Identifier: Apache-2.0
#
# Downloads a Stitch asset from a GCS redirect URL.
# Uses curl with redirect following and TLS/SNI support.
# Required because AI web fetch tools do not follow GCS redirects.
#
# Usage: bash fetch-stitch.sh "<url>" "<output-path>"

set -e

if [ "$#" -ne 2 ]; then
  echo "Error: Two arguments required." >&2
  echo "Usage: bash fetch-stitch.sh \"<url>\" \"<output-path>\"" >&2
  exit 1
fi

URL="$1"
OUTPUT="$2"

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT")"

echo "Downloading Stitch asset..."
echo "  URL:    ${URL:0:80}..."
echo "  Output: $OUTPUT"

if curl -L -f -sS \
    --connect-timeout 10 \
    --max-time 60 \
    --compressed \
    -H "User-Agent: Mozilla/5.0 (compatible; StitchSkills/1.0)" \
    -o "$OUTPUT" \
    "$URL"; then
  echo "✓ Downloaded successfully: $OUTPUT"
  echo "  Size: $(wc -c < "$OUTPUT") bytes"
else
  echo "✗ Download failed." >&2
  echo "  URL: $URL" >&2
  exit 1
fi
