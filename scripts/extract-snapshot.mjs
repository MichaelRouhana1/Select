import fs from "node:fs";

const html = fs.readFileSync("_tier_raw.html", "utf8");

const tierIdx = html.indexOf("tierListData");
if (tierIdx === -1) {
  console.error("tierListData not found");
  process.exit(1);
}

let objStart = tierIdx - 1;
while (objStart >= 0 && html[objStart] !== "{") objStart--;
if (objStart < 0) {
  console.error("opening { not found");
  process.exit(1);
}

const selIdx = html.indexOf("selectedRole");
if (selIdx === -1) {
  console.error("selectedRole not found");
  process.exit(1);
}

const tail = html.slice(selIdx);
const endMatch = tail.match(/^selectedRole\\":\\"[A-Z]+\\"}/);
if (!endMatch) {
  console.error("could not match selectedRole closing");
  process.exit(1);
}

const objEnd = selIdx + endMatch[0].length;

let jsonSlice = html.slice(objStart, objEnd);
jsonSlice = jsonSlice.replace(/\\"/g, '"');

let parsed;
try {
  parsed = JSON.parse(jsonSlice);
} catch (e) {
  console.error("JSON.parse failed:", e.message);
  fs.writeFileSync("_extract_fail.json", jsonSlice.slice(0, 6000));
  process.exit(1);
}

const snapshot = {
  _meta: {
    patch: parsed.tierListData?.patch ?? "unknown",
    generatedAt: new Date().toISOString(),
    source: "https://www.skill-capped.com/lol/guides/tierlist/mid",
  },
  tierListData: parsed.tierListData,
  champNameToIdMap: parsed.champNameToIdMap,
  championAtlasData: parsed.championAtlasData,
};

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/tierlist.snapshot.json",
  JSON.stringify(snapshot, null, 2),
);
console.log("Wrote src/data/tierlist.snapshot.json patch=", snapshot._meta.patch);
