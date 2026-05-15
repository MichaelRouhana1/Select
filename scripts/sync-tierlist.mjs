/**
 * Fetches Skill-Capped tier list HTML into `_tier_raw.html`, then runs the extractor.
 * Respect robots.txt / Terms of Use; prefer occasional manual refreshes over hammering their CDN.
 *
 * Usage: node scripts/sync-tierlist.mjs [role]
 *   role defaults to "mid" (top|jungle|mid|adc|support).
 */

const role = process.argv[2] ?? "mid";
const url = `https://www.skill-capped.com/lol/guides/tierlist/${role}`;
const res = await fetch(url);
if (!res.ok) {
  console.error("Fetch failed", res.status, res.statusText);
  process.exit(1);
}
const html = await res.text();
const fs = await import("node:fs");
fs.writeFileSync("_tier_raw.html", html);
console.log("Saved _tier_raw.html", html.length, "bytes from", url);

await import("./extract-snapshot.mjs");
