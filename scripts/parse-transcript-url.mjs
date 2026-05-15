import fs from "node:fs";

const path =
  "C:/Users/PC FACTORY/.cursor/projects/c-Users-PC-FACTORY-Desktop-Picker/agent-transcripts/cb0ca95c-b4ad-4223-b632-59ed558ceded/cb0ca95c-b4ad-4223-b632-59ed558ceded.jsonl";
const line = fs.readFileSync(path, "utf8").split("\n")[0];
const data = JSON.parse(line);
const text = data.message.content.find((c) => c.type === "text")?.text ?? "";
const urls = [...text.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0]);
console.log("urls", urls.slice(0, 20));
const shacoIdx = text.indexOf("shaco");
console.log("shaco idx", shacoIdx);
if (shacoIdx > -1) console.log(text.slice(Math.max(0, shacoIdx - 80), shacoIdx + 120));
