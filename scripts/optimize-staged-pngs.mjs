#!/usr/bin/env node
/**
 * Pre-commit auto-fix for PNGs under public/static/.
 *
 * Runs oxipng losslessly on staged PNGs, restores original iCCP chunks
 * (oxipng renames the profile keyword), and re-stages any smaller file.
 * Fails the commit when a PNG is staged and oxipng is not on PATH.
 *
 * Install oxipng:
 *   brew install oxipng
 *   cargo install oxipng
 * Ubuntu/Debian do not ship oxipng in the default apt repositories.
 * Use a release build: https://github.com/oxipng/oxipng/releases
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OXIPNG_ARGS = [
  "-o",
  "4",
  "--strip",
  "eXIf,iTXt,tEXt,zTXt,tIME",
  "--nx",
  "--nb",
  "--nc",
  "--np",
  "--ng",
  "-i",
  "keep",
];

const INSTALL_HELP = `oxipng is required before committing PNG files under public/static/.
Install it and commit again:

  brew install oxipng
  cargo install oxipng

Ubuntu/Debian do not ship oxipng in the default apt repositories.
Install a release build instead:
  https://github.com/oxipng/oxipng/releases
`;

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function readIhdr(buf) {
  if (buf.length < 29 || !buf.subarray(0, 8).equals(PNG_SIG)) {
    throw new Error("not a PNG");
  }
  if (buf.subarray(12, 16).toString("ascii") !== "IHDR") {
    throw new Error("missing IHDR");
  }
  return {
    w: buf.readUInt32BE(16),
    h: buf.readUInt32BE(20),
    depth: buf[24],
    color: buf[25],
    interlace: buf[28],
  };
}

function pngChunks(buf) {
  const list = [];
  let i = 8;
  while (i + 12 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.subarray(i + 4, i + 8).toString("ascii");
    const end = i + 12 + len;
    if (end > buf.length) {
      throw new Error(`truncated ${type} chunk`);
    }
    list.push({ type, start: i, end });
    i = end;
    if (type === "IEND") break;
  }
  return list;
}

/** Keep embedded ICC profiles byte-identical. oxipng rewrites the iCCP keyword. */
export function restoreIccp(original, optimized) {
  const src = pngChunks(original).filter((chunk) => chunk.type === "iCCP");
  const dst = pngChunks(optimized).filter((chunk) => chunk.type === "iCCP");
  if (src.length === 0) return Buffer.from(optimized);
  if (src.length !== dst.length) {
    throw new Error("iCCP chunk count changed");
  }
  let out = Buffer.from(optimized);
  for (let n = src.length - 1; n >= 0; n -= 1) {
    const piece = original.subarray(src[n].start, src[n].end);
    out = Buffer.concat([
      out.subarray(0, dst[n].start),
      piece,
      out.subarray(dst[n].end),
    ]);
  }
  return out;
}

function sameIhdr(a, b) {
  return (
    a.w === b.w &&
    a.h === b.h &&
    a.depth === b.depth &&
    a.color === b.color &&
    a.interlace === b.interlace
  );
}

function stagedPaths() {
  const out = execFileSync(
    "git",
    ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"],
    { encoding: "buffer" }
  );
  return out.toString("utf8").split("\0").filter(Boolean);
}

function isStaticPng(rel) {
  const norm = rel.split(path.sep).join("/");
  return norm.startsWith("public/static/") && norm.toLowerCase().endsWith(".png");
}

function worktreeMatchesIndex(file) {
  const result = spawnSync("git", ["diff", "--quiet", "--", file], {
    stdio: "ignore",
  });
  return result.status === 0;
}

function oxipngAvailable() {
  const result = spawnSync("oxipng", ["--version"], { encoding: "utf8" });
  if (result.error && result.error.code === "ENOENT") return false;
  return result.status === 0;
}

function main() {
  const pngs = stagedPaths().filter(isStaticPng);
  if (pngs.length === 0) process.exit(0);

  if (!oxipngAvailable()) {
    console.error(INSTALL_HELP);
    process.exit(1);
  }

  for (const file of pngs) {
    if (!fs.existsSync(file)) {
      console.error(`Staged PNG is missing from the worktree: ${file}`);
      process.exit(1);
    }
    if (!worktreeMatchesIndex(file)) {
      console.error(
        `${file} has unstaged changes. Stage or discard them before committing so oxipng only rewrites the staged image.`
      );
      process.exit(1);
    }

    const original = fs.readFileSync(file);
    const beforeHdr = readIhdr(original);
    const result = spawnSync("oxipng", [...OXIPNG_ARGS, file], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      fs.writeFileSync(file, original);
      console.error(result.stderr || result.stdout || `oxipng failed on ${file}`);
      process.exit(1);
    }

    try {
      const optimized = fs.readFileSync(file);
      const restored = restoreIccp(original, optimized);
      const afterHdr = readIhdr(restored);
      if (!sameIhdr(beforeHdr, afterHdr)) {
        throw new Error(
          `oxipng changed image structure for ${file} ` +
            `(${beforeHdr.w}x${beforeHdr.h} depth ${beforeHdr.depth} color ${beforeHdr.color} ` +
            `-> ${afterHdr.w}x${afterHdr.h} depth ${afterHdr.depth} color ${afterHdr.color})`
        );
      }
      if (restored.equals(original)) {
        if (!optimized.equals(original)) fs.writeFileSync(file, original);
        console.log(`oxipng: ${file} already optimal`);
        continue;
      }
      fs.writeFileSync(file, restored);
      execFileSync("git", ["add", "--", file], { stdio: "inherit" });
      console.log(
        `oxipng: ${file} ${original.length} -> ${restored.length} (re-staged)`
      );
    } catch (error) {
      fs.writeFileSync(file, original);
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

const entry = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main();
}
