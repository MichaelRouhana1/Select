/**
 * Fetches a Skill-Capped champion build page and extracts snapshot JSON.
 *
 * Usage: node scripts/sync-guide.mjs <champion> <role>
 *   e.g. node scripts/sync-guide.mjs shaco jungle
 */

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const champion = process.argv[2];
const role = process.argv[3];
if (!champion || !role) {
  console.error("Usage: node scripts/sync-guide.mjs <champion> <role>");
  process.exit(1);
}

const url = `https://www.skill-capped.com/lol/guides/builds/${champion}/${role}`;
const res = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.skill-capped.com/",
    "Cache-Control": "no-cache",
  },
});
if (!res.ok) {
  console.error("Fetch failed", res.status, res.statusText, url);
  process.exit(1);
}
const html = await res.text();
const rawPath = path.join(root, "_guide_raw.html");
fs.writeFileSync(rawPath, html);
console.log("Saved _guide_raw.html", html.length, "bytes from", url);

const tsx = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
const extract = path.join(root, "scripts", "extract-guide.ts");
const child = spawnSync(
  process.execPath,
  [tsx, extract, champion, role, rawPath],
  { stdio: "inherit", cwd: root },
);
if (child.status !== 0) {
  process.exit(child.status ?? 1);
}

const reg = spawnSync(process.execPath, ["scripts/rebuild-guide-registry.mjs"], {
  stdio: "inherit",
  cwd: root,
});
process.exit(reg.status ?? 1);
