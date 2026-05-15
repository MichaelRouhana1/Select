import fs from "node:fs";

const html = fs.readFileSync("_shaco_raw.html", "utf8");
const chunks = [];
const re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
let m;
while ((m = re.exec(html))) {
  chunks.push(m[1].replace(/\\"/g, '"').replace(/\\u003c/g, "<").replace(/\\u003e/g, ">"));
}
const big = chunks.find((c) => c.includes('"buildData"') && c.includes("Shaco"));

const idx = big.indexOf('"buildData"');
const ctx = big.slice(idx - 8000, idx);
const keys = [
  "championId",
  "championName",
  "role",
  "roleDisplay",
  "patch",
  "tier",
  "tierGrade",
  "buildVariants",
  "buildOptions",
  "selectedBuild",
  "pageTitle",
  "hasFullBuild",
];
for (const k of keys) {
  const re2 = new RegExp(`"${k}":(".*?"|[0-9.]+|true|false|null|\\[[^\\]]*\\])`, "g");
  const hits = [...ctx.matchAll(re2)];
  if (hits.length) console.log(k, hits.map((h) => h[1]).slice(-3));
}
