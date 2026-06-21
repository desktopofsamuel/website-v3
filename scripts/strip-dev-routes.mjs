#!/usr/bin/env node
/**
 * Removes dev-only App Router routes before production builds on Vercel.
 * Runtime NODE_ENV checks are not enough — Next still bundles route handlers
 * (and sharp) into serverless functions.
 */
import fs from "node:fs";
import path from "node:path";

const shouldStrip = process.env.VERCEL === "1";

if (!shouldStrip) {
  process.exit(0);
}

const root = process.cwd();
const devPaths = [
  "app/dev",
  "app/api/dev",
  // In-development features: kept for local dev, stripped from public production builds.
  "app/api/feed",
  "app/api/resources-career",
];

for (const rel of devPaths) {
  const target = path.join(root, rel);
  if (!fs.existsSync(target)) continue;
  fs.rmSync(target, { recursive: true, force: true });
  console.log(`[strip-dev-routes] removed ${rel}`);
}
