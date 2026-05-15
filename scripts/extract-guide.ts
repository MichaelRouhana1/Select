import fs from "node:fs";
import path from "node:path";
import { parseGuideFromHtml } from "../src/lib/skillCappedGuideParser";

const championSlug = process.argv[2] ?? "shaco";
const roleSlug = process.argv[3] ?? "jungle";
const htmlPath = process.argv[4] ?? "_guide_raw.html";

const html = fs.readFileSync(htmlPath, "utf8");
const snapshot = parseGuideFromHtml(html, championSlug, roleSlug);

const outDir = path.join("src", "data", "guides");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${championSlug}-${roleSlug}.json`);
fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
console.log("Wrote", outFile);
