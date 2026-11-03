#!/usr/bin/env node
/**
 * Point Git at .githooks so the oxipng pre-commit check runs after install.
 * No-op when this tree is not a checkout (for example a packaged install).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

if (!fs.existsSync(".git")) {
  process.exit(0);
}

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: "ignore",
  });
} catch {
  process.exit(0);
}
