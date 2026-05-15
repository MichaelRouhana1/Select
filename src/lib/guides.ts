import type { GuideSnapshot } from "@/types/guide";
import { dataRoleFromRoute, isRoleRoute, type RoleRoute } from "@/lib/roles";

export function championSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/'/g, "");
}

export function guideStorageKey(championSlug: string, roleSlug: string) {
  return `${championSlug}-${roleSlug}`;
}

export function buildGuideHref(championName: string, roleRoute: RoleRoute) {
  const slug = championSlugFromName(championName);
  return `/builds/${slug}/${roleRoute}`;
}

export function parseBuildRoute(
  champion: string,
  rest?: string[],
): { championSlug: string; roleSlug: string } | null {
  const roleSlug = rest?.[0] ?? "jungle";
  if (!isRoleRoute(roleSlug)) return null;
  return { championSlug: champion.toLowerCase(), roleSlug };
}

export function roleRouteFromGuideRole(role: string): RoleRoute | null {
  const map: Record<string, RoleRoute> = {
    TOP: "top",
    JUNGLE: "jungle",
    MIDDLE: "mid",
    MID: "mid",
    ADC: "adc",
    BOTTOM: "adc",
    SUPPORT: "support",
    UTILITY: "support",
  };
  return map[role.toUpperCase()] ?? null;
}

export function mergePageStats(snapshot: GuideSnapshot): GuideSnapshot["page"] {
  const { page, aggData } = snapshot;
  return {
    ...page,
    stats: {
      winRate: aggData.winRate,
      pickRate: aggData.pickRate,
      banRate: aggData.banRate,
      games: aggData.games,
    },
    summonerSpells: aggData.summonerSpells,
  };
}

export function tierListRoleForGuide(roleSlug: string): RoleRoute | null {
  return isRoleRoute(roleSlug) ? roleSlug : null;
}

export function dataRoleKey(roleSlug: RoleRoute) {
  return dataRoleFromRoute(roleSlug);
}
