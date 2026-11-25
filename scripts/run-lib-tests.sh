#!/bin/sh
set -e
root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$root"

files=$(ls lib/*.test.ts 2>/dev/null || true)
[ -z "$files" ] && exit 0

exec node --experimental-strip-types --test $files
