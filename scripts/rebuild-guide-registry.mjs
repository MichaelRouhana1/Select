/**
 * Regenerates src/data/guideRegistry.ts from JSON files in src/data/guides/
 */

import fs from "node:fs";
import path from "node:path";

const guidesDir = path.join("src", "data", "guides");
const outFile = path.join("src", "data", "guideRegistry.ts");

const files = fs
  .readdirSync(guidesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.error("No JSON files in", guidesDir);
  process.exit(1);
}

const imports = files.map(
  (f, i) => `import guide_${i} from "./guides/${f}";`,
);

const entries = files.map((f, i) => {
  const key = f.replace(/\.json$/, "");
  return `  "${key}": guide_${i} as GuideSnapshot,`;
});

const content = `import type { GuideSnapshot } from "@/types/guide";

${imports.join("\n")}

const guides: Record<string, GuideSnapshot> = {
${entries.join("\n")}
};

export const GUIDE_KEYS = Object.keys(guides);

export function getGuideSnapshot(key: string): GuideSnapshot | undefined {
  return guides[key];
}

export function listGuideKeys(): string[] {
  return GUIDE_KEYS;
}
`;

fs.writeFileSync(outFile, content);
console.log("Wrote", outFile, "with", files.length, "guides");
