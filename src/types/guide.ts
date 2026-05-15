import type { SkillOrderTreeNode } from "@/lib/guideAggStats";

export interface GuidePageMeta {
  championId: string;
  championName: string;
  championSlug: string;
  role: string;
  roleSlug: string;
  roleDisplay: string;
  patch: string;
  tier: string;
  summonerSpells?: string[];
  stats: {
    winRate: number | null;
    pickRate: number | null;
    banRate: number | null;
    games: number | null;
  };
}

export interface MatchupEntry {
  championId: string;
  winRate: number;
  games: number;
}

export interface GuideAggData {
  winRate: number;
  pickRate: number;
  banRate: number;
  games: number;
  summonerSpells: string[];
  matchups?: {
    hardest: MatchupEntry[];
    best: MatchupEntry[];
  };
  startingItemsTop?: Array<{
    itemIds: string[];
    stats: { wins: number; numGames: number };
  }>;
  /** Popular sequential skill leveling tree from aggregate data */
  skillOrderTree?: Record<string, SkillOrderTreeNode> | null;
  lateGameItems?:
    | Array<{ itemId: string; wins: number; games: number }>
    | Record<
        string,
        Array<{ itemId: string; wins: number; games: number }>
      >;
}

export interface RuneInsight {
  id: string;
  tree: string;
  runeId: number;
  runeId2?: number;
  insightTitle: string;
  insight: string;
  secondaryOption?: { header: string };
}

export interface GuideRunesV3 {
  stats: string[];
  primary: {
    tree: string;
    activeRuneIds: number[];
    optionalRuneIds: number[];
  };
  secondary: {
    tree: string;
    activeRuneIds: number[];
    optionalRuneIds: number[];
  };
  runeInsights?: {
    insights: Record<string, RuneInsight>;
    insightsOrder: Array<{ id: string }>;
  };
}

export interface SkillInsight {
  id: string;
  title: string;
  level: number;
  spell: string;
  reason: string;
}

export interface GuideSkills {
  name: string;
  order: string[];
  priority: string[];
  insights: SkillInsight[];
}

export interface ItemGroup {
  id: string;
  title: string;
  insightHeader?: string;
  insight?: string;
  items: Array<{ itemId: string; itemText: string }>;
}

export interface GuideSnapshot {
  _meta: { generatedAt: string; source: string; ddragonPatch?: string };
  page: GuidePageMeta;
  aggData: GuideAggData;
  buildData: {
    skills: GuideSkills[];
    runesv3: GuideRunesV3;
    itemsSimpleV1?: {
      itemGroups: ItemGroup[];
      startingItems?: { sectionExplainer?: string; items: unknown[] };
    };
    itemsAdvancedV1?: unknown;
  };
}
