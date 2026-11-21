import { spawn, execFileSync } from "node:child_process";
import { openSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logPath = "/tmp/website-v3-t3-7ea066cf-3001.log";
const nextBin = path.join(root, "node_modules/.bin/next");

function isListening() {
  try {
    execFileSync("lsof", ["-nP", "-iTCP:3001", "-sTCP:LISTEN"], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

if (isListening()) {
  console.log("already listening on http://127.0.0.1:3001");
  process.exit(0);
}

const logFd = openSync(logPath, "a");
const child = spawn(
  nextBin,
  ["dev", "-H", "127.0.0.1", "-p", "3001"],
  {
    cwd: root,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: process.env,
  },
);

child.unref();
console.log(
  `started pid ${child.pid} → http://127.0.0.1:3001 (log ${logPath})`,
);
