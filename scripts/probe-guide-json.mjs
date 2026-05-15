import fs from "node:fs";

const html = fs.readFileSync("_shaco_raw.html", "utf8");

const needles = [
  "winRate",
  "pickRate",
  "banRate",
  "gamesAnalyzed",
  "recommendedBuild",
  "primaryRunes",
  "matchups",
  "skillOrder",
  "guideContent",
  "championStats",
  "buildVariants",
  "pageData",
  "championBuild",
  "fullBuild",
];

for (const k of needles) {
  const c = (html.match(new RegExp(k, "g")) || []).length;
  if (c) console.log(k, c);
}

// Try tier-list style escaped JSON blob
function tryExtract(anchor) {
  const tierIdx = html.indexOf(anchor);
  if (tierIdx === -1) return null;
  let objStart = tierIdx - 1;
  while (objStart >= 0 && html[objStart] !== "{") objStart--;
  if (objStart < 0) return null;
  // scan forward for balanced braces (rough)
  let depth = 0;
  let objEnd = -1;
  for (let i = objStart; i < Math.min(html.length, objStart + 2_000_000); i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        objEnd = i + 1;
        break;
      }
    }
  }
  if (objEnd < 0) return null;
  let jsonSlice = html.slice(objStart, objEnd);
  jsonSlice = jsonSlice.replace(/\\"/g, '"');
  try {
    return JSON.parse(jsonSlice);
  } catch (e) {
    fs.writeFileSync("_guide_extract_fail.json", jsonSlice.slice(0, 8000));
    console.error("parse fail", anchor, e.message);
    return null;
  }
}

for (const anchor of ["allChampionsData", "championPageData", "guideData"]) {
  const parsed = tryExtract(anchor);
  if (!parsed) continue;
  console.log("\nanchor", anchor, "top keys", Object.keys(parsed).slice(0, 30));
  const sub = parsed[anchor] ?? parsed;
  if (typeof sub === "object") console.log("sub keys", Object.keys(sub).slice(0, 20));
}
