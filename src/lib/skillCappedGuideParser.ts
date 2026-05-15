import { z } from "zod";
import type { GuideSnapshot } from "@/types/guide";

const aggDataEssentialSchema = z
  .object({
    summonerSpells: z.array(z.string()).min(1),
    startingItemsTop: z
      .array(
        z.object({
          itemIds: z.array(z.string()).min(1),
          stats: z.object({ wins: z.number(), numGames: z.number() }).optional(),
        }),
      )
      .min(1),
  })
  .passthrough();

const runesEssentialSchema = z
  .object({
    primary: z.object({
      tree: z.string().min(1),
      activeRuneIds: z.array(z.number()).min(3),
      optionalRuneIds: z.array(z.number()).optional(),
    }),
    secondary: z.object({
      tree: z.string().min(1),
      activeRuneIds: z.array(z.number()).min(1),
      optionalRuneIds: z.array(z.number()).optional(),
    }),
  })
  .passthrough();

const itemGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  insightHeader: z.string().optional(),
  insight: z.string().optional(),
  items: z.array(
    z.object({ itemId: z.string(), itemText: z.string() }).passthrough(),
  ),
});

const buildDataEssentialSchema = z
  .object({
    runesv3: runesEssentialSchema,
    skills: z
      .array(
        z
          .object({
            order: z.array(z.string()).min(1),
            priority: z.array(z.string()).min(1),
            insights: z.array(z.unknown()).optional(),
          })
          .passthrough(),
      )
      .min(1),
    itemsSimpleV1: z.object({
      itemGroups: z.array(itemGroupSchema).min(1),
    }),
  })
  .passthrough();

const guideSnapshotSchema = z
  .object({
    page: z
      .object({
        championId: z.string().min(1),
        championName: z.string().min(1),
        championSlug: z.string().min(1),
        roleSlug: z.string().min(1),
        patch: z.string().min(1),
        tier: z.string().min(1),
      })
      .passthrough(),
    aggData: aggDataEssentialSchema,
    buildData: buildDataEssentialSchema,
  })
  .passthrough();

export class GuideParseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GuideParseError";
  }
}

export function readRscChunks(html: string): string[] {
  const chunks: string[] = [];
  const re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    chunks.push(
      m[1]
        .replace(/\\"/g, '"')
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">"),
    );
  }
  return chunks;
}

export function extractJsonObject(source: string, key: string): unknown {
  const needle = `"${key}":`;
  const keyIdx = source.indexOf(needle);
  if (keyIdx === -1) return null;

  let objStart = keyIdx + needle.length;
  while (objStart < source.length && /\s/.test(source[objStart]!)) objStart++;
  if (source[objStart] !== "{") return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  let objEnd = -1;

  for (let i = objStart; i < source.length; i++) {
    const ch = source[i]!;
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        objEnd = i + 1;
        break;
      }
    }
  }

  if (objEnd < 0) return null;
  let slice = source.slice(objStart, objEnd);
  slice = slice.replace(/\\\\"/g, '\\"');
  return JSON.parse(slice) as unknown;
}

export function extractDdragonPatchFromHtml(html: string): string | undefined {
  const m = html.match(/ddragoncdn\/cdn\/([\d.]+)\//i);
  return m?.[1];
}

export function parseHtmlPageMeta(
  html: string,
  championSlug: string,
  roleSlug: string,
): GuideSnapshot["page"] {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch?.[1] ?? "";
  const patchMatch =
    title.match(/Patch\s+([\d.]+)/i) ?? html.match(/Patch\s+([\d.]+)/i);
  const patch = patchMatch?.[1] ?? "unknown";

  const champName =
    title.split(" ")[0] ||
    championSlug.charAt(0).toUpperCase() + championSlug.slice(1);
  const roleDisplay =
    roleSlug.charAt(0).toUpperCase() + roleSlug.slice(1);

  const tierMatch = html.match(
    /font-display[^>]*>[\s\S]*?>\s*([SABCD])\s*<\/[^>]+>[\s\S]*?TIER/i,
  );
  const tier = tierMatch?.[1] ?? "A";

  return {
    championId: champName.replace(/[^a-zA-Z']/g, "") === champName
      ? champName.replace(/\s/g, "")
      : champName,
    championName: champName,
    championSlug,
    role: roleSlug.toUpperCase() === "ADC" ? "ADC" : roleSlug.toUpperCase(),
    roleSlug,
    roleDisplay,
    patch,
    tier,
    stats: {
      winRate: null,
      pickRate: null,
      banRate: null,
      games: null,
    },
  };
}

function validateGuideSnapshot(raw: unknown): GuideSnapshot {
  const parsed = guideSnapshotSchema.safeParse(raw);
  if (!parsed.success) {
    throw new GuideParseError(
      `Guide snapshot validation failed: ${parsed.error.message}`,
      parsed.error,
    );
  }
  return raw as GuideSnapshot;
}

/** Locate decoded Flight/RSC payload that contains serialized guide snapshots. */
function findGuideFlightPayload(chunks: string[]): string | null {
  const hasPair = (s: string) =>
    s.includes('"buildData"') && s.includes('"aggData"');

  const single = chunks.find((c) => hasPair(c));
  if (single) return single;

  const joined = chunks.join("\n");
  return hasPair(joined) ? joined : null;
}

function liteGuideEmbeddedJsonMissing(html: string): boolean {
  return /sc-public-guide-audit[\s\S]*?"build"\s*:\s*null/.test(html);
}

export function parseGuideFromHtml(
  html: string,
  championSlug: string,
  roleSlug: string,
): GuideSnapshot {
  const chunks = readRscChunks(html);
  const blob = findGuideFlightPayload(chunks);

  if (!blob) {
    const hint =
      liteGuideEmbeddedJsonMissing(html)
        ? " (Skill-Capped served a lite page without embedded build JSON — uncommon/off-meta builds sometimes omit it)"
        : " (payload may split across Flight chunks; concat found no snapshot)";
    throw new GuideParseError(
      `guide RSC chunk not found (buildData/aggData)${hint}`,
    );
  }

  const buildData = extractJsonObject(blob, "buildData");
  const aggData = extractJsonObject(blob, "aggData");
  if (!buildData || !aggData || typeof buildData !== "object") {
    throw new GuideParseError("failed to extract buildData from HTML");
  }
  if (!aggData || typeof aggData !== "object") {
    throw new GuideParseError("failed to extract aggData from HTML");
  }

  const pageMeta = parseHtmlPageMeta(html, championSlug, roleSlug);
  const agg = aggData as GuideSnapshot["aggData"];

  pageMeta.stats = {
    winRate: agg.winRate ?? pageMeta.stats.winRate,
    pickRate: agg.pickRate ?? pageMeta.stats.pickRate,
    banRate: agg.banRate ?? pageMeta.stats.banRate,
    games: agg.games ?? pageMeta.stats.games,
  };
  pageMeta.patch = (pageMeta.patch ?? "").replace(/\.$/, "") || "unknown";
  pageMeta.summonerSpells = agg.summonerSpells ?? [];

  const ddragonPatch =
    extractDdragonPatchFromHtml(html) ?? "15.24.1";

  const snapshot: GuideSnapshot = {
    _meta: {
      generatedAt: new Date().toISOString(),
      source: `https://www.skill-capped.com/lol/guides/builds/${championSlug}/${roleSlug}`,
      ddragonPatch,
    },
    page: pageMeta,
    aggData: agg,
    buildData: buildData as GuideSnapshot["buildData"],
  };

  return validateGuideSnapshot(snapshot);
}
