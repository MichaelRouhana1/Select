import fs from "node:fs";

const html = fs.readFileSync("_shaco_raw.html", "utf8");
const chunks = [];
const re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
let m;
while ((m = re.exec(html))) {
  chunks.push(m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'));
}

const big = chunks.find((c) => c.includes('"buildData"') && c.includes("Your Clone Keeps"));
const anchor = '"buildData"';
const idx = big.indexOf(anchor);
console.log("before buildData:", big.slice(idx - 150, idx));
console.log("after buildData start:", big.slice(idx, idx + 500));

// Try extract buildData object only
const keyIdx = big.indexOf('"buildData":');
let objStart = keyIdx + '"buildData":'.length;
while (objStart < big.length && big[objStart] !== "{") objStart++;
let depth = 0;
let objEnd = -1;
for (let i = objStart; i < big.length; i++) {
  if (big[i] === "{") depth++;
  else if (big[i] === "}") {
    depth--;
    if (depth === 0) {
      objEnd = i + 1;
      break;
    }
  }
}
const slice = big.slice(objStart, objEnd);
console.log("buildData slice len", slice.length);
try {
  const parsed = JSON.parse(slice);
  console.log("buildData keys", Object.keys(parsed).slice(0, 40));
  fs.writeFileSync("_shaco_build_data.json", JSON.stringify(parsed, null, 2));
  console.log("wrote _shaco_build_data.json");
} catch (e) {
  console.error("parse fail", e.message);
}
