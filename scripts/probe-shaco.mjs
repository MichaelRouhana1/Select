const url = "https://www.skill-capped.com/lol/guides/builds/shaco/jungle";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0" },
});
const t = await res.text();
await import("node:fs").then((fs) => fs.writeFileSync("_shaco_raw.html", t));
console.log("status", res.status, "bytes", t.length);
for (const k of [
  "sc-public-guide-audit",
  "allChampionsData",
  "Hail of Blades",
  "Shaco Jungle",
  "ScChampionInline",
  "ScRuneInline",
  "build",
]) {
  console.log(k, t.includes(k));
}
