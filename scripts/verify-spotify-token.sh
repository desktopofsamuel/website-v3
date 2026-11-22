#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/verify/spotify-token"
JAR="$DIR/tla2tools.jar"
TLA="$DIR/SpotifyToken.tla"
VERSION="v1.7.4"
JAR_URL="https://github.com/tlaplus/tlaplus/releases/download/${VERSION}/tla2tools.jar"
JAR_SHA1="bee4a54f3ee3d4afc347c3240ec2d9e93b075104"

if [[ ! -f "$JAR" ]]; then
  curl -fsSL -o "$JAR" "$JAR_URL"
fi

actual="$(openssl sha1 "$JAR" | awk '{print $NF}')"
if [[ "$actual" != "$JAR_SHA1" ]]; then
  echo "tla2tools.jar sha1 $actual does not match $JAR_SHA1"
  exit 1
fi

tlc() {
  java -XX:+UseParallelGC -jar "$JAR" -config "$1" "$TLA"
}

echo "Replay: SingleFlight=FALSE must violate AtMostOneTokenPost"
set +e
broken_out="$(tlc "$DIR/SpotifyTokenBroken.cfg" 2>&1)"
broken_code=$?
set -e
printf '%s\n' "$broken_out"
if [[ $broken_code -eq 0 ]] || ! printf '%s\n' "$broken_out" | grep -q "Invariant AtMostOneTokenPost is violated"; then
  echo "expected AtMostOneTokenPost violation when getAccessToken posts concurrently"
  exit 1
fi

echo "Check: SingleFlight=TRUE must keep AtMostOneTokenPost"
tlc "$DIR/SpotifyToken.cfg"
