export interface ChampEntry {
  rank: string;
  championName: string;
}

export interface RoleTierData {
  op: ChampEntry[];
  lowElo: ChampEntry[];
  bans: ChampEntry[];
  s: ChampEntry[];
  a: ChampEntry[];
  b: ChampEntry[];
  c: ChampEntry[];
}

export interface ChampionFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionAtlasData {
  version: string;
  atlasUrl: string;
  width: number;
  height: number;
  cellSize: number;
  generatedAt?: string;
  atlasBytes?: number;
  championCount?: number;
  frameByChampionId: Record<string, ChampionFrame>;
  missingChampionIds?: string[];
}

export interface TierSnapshotMeta {
  patch: string;
  generatedAt: string;
  source: string;
}

export interface TierSnapshot {
  _meta: TierSnapshotMeta;
  tierListData: {
    patch: string;
    rolesData: Record<string, RoleTierData>;
  };
  champNameToIdMap: Record<string, string>;
  championAtlasData: ChampionAtlasData;
}
