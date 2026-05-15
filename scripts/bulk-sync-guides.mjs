/**
 * Bulk-sync Skill-Capped guide JSON for every champion/role pair that appears in
 * the tier list snapshot. Reuses fetch + tsx/extract-guide like sync-guide.mjs,
 * sleeps 7s between upstream requests to reduce Cloudflare friction, rebuilds the
 * registry once at the end.
 *
 * Usage: node scripts/bulk-sync-guides.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TIER_SNAPSHOT = path.join(
  root,
  "src",
  "data",
  "tierlist.snapshot.json",
);

const DELAY_MS = 7000;

/** @typedef {{ displayName: string; slug: string; role: string }} SyncTask */

const DATA_ROLE_TO_ROUTE = {
  TOP: "top",
  JUNGLE: "jungle",
  MID: "mid",
  ADC: "adc",
  SUPPORT: "support",
};

const ROUTE_ITERATION_ORDER = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const ROUTE_SORT_RANK = Object.fromEntries(
  Object.values(DATA_ROLE_TO_ROUTE).map((route, i) => [route, i]),
);

const ROLE_DISPLAY = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "ADC",
  support: "Support",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function championSlugFromName(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/'/g, "");
}

function fetchHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.skill-capped.com/",
    "Cache-Control": "no-cache",
  };
}

/**
 * @returns {SyncTask[]}
 */
function collectTasksFromTierSnapshot(snapshot) {
  const rolesData = snapshot?.tierListData?.rolesData;
  if (!rolesData || typeof rolesData !== "object") {
    throw new Error(`Invalid tier snapshot: missing tierListData.rolesData`);
  }

  /** @type {Map<string, SyncTask>} */
  const unique = new Map();

  for (const dataRole of ROUTE_ITERATION_ORDER) {
    const routeSlug = DATA_ROLE_TO_ROUTE[dataRole];
    const block = rolesData[dataRole];
    if (!block || typeof block !== "object" || !routeSlug) continue;

    for (const value of Object.values(block)) {
      if (!Array.isArray(value)) continue;
      for (const row of value) {
        const name =
          row && typeof row.championName === "string"
            ? row.championName.trim()
            : "";
        if (!name) continue;
        const slug = championSlugFromName(name);
        if (!slug) continue;
        const key = `${slug}:${routeSlug}`;
        if (!unique.has(key)) {
          unique.set(key, {
            displayName: name,
            slug,
            role: routeSlug,
          });
        }
      }
    }
  }

  return [...unique.values()].sort((a, b) => {
    const r =
      ROUTE_SORT_RANK[a.role] - ROUTE_SORT_RANK[b.role];
    return r !== 0 ? r : a.slug.localeCompare(b.slug);
  });
}

async function syncOne(task) {
  const { slug, role } = task;
  const url = `https://www.skill-capped.com/lol/guides/builds/${slug}/${role}`;

  const res = await fetch(url, { headers: fetchHeaders() });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const rawPath = path.join(root, "_guide_raw.html");
  fs.writeFileSync(rawPath, html);

  const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
  const extractScript = path.join(root, "scripts", "extract-guide.ts");

  const child = spawnSync(process.execPath, [
    tsxCli,
    extractScript,
    slug,
    role,
    rawPath,
  ], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (child.status !== 0) {
    const detail = [
      child.stderr?.trim(),
      child.stdout?.trim(),
    ].filter(Boolean).join(" — ");
    throw new Error(detail || `extract exited with code ${child.status}`);
  }
}

async function main() {
  console.log(`Reading tier list snapshot: ${path.relative(root, TIER_SNAPSHOT)}`);
  const snapshot = JSON.parse(fs.readFileSync(TIER_SNAPSHOT, "utf8"));
  const tasks = collectTasksFromTierSnapshot(snapshot);
  const total = tasks.length;

  if (total === 0) {
    console.warn("No champion/role pairs found; exiting.");
    process.exit(1);
  }

  console.log(`Queued ${total} unique champion/role guide sync(s).\n`);

  let success = 0;
  let failed = 0;

  const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
  if (!fs.existsSync(tsxCli)) {
    console.error(`Missing tsx CLI at ${tsxCli}. Run npm install.`);
    process.exit(1);
  }

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const n = i + 1;
    const roleLbl = ROLE_DISPLAY[task.role] ?? task.role;
    const prefix = `[${n}/${total}] Syncing ${task.displayName} (${roleLbl})...`;

    try {
      await syncOne(task);
      success++;
      console.log(`${prefix} Success`);
    } catch (err) {
      failed++;
      const msg =
        err instanceof Error ? err.message : String(err);
      console.error(`${prefix} Failed: ${msg}`);
    }

    if (i < tasks.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone. ${success} ok, ${failed} failed (${total} total).`);
  console.log("Rebuilding guide registry...\n");

  const reg = spawnSync(process.execPath, ["scripts/rebuild-guide-registry.mjs"], {
    stdio: "inherit",
    cwd: root,
  });

  if (reg.status !== 0) {
    process.exit(reg.status ?? 1);
  }
  process.exit(failed > 0 ? 1 : 0);
}

await main();
