/** Aggregates keyed by sequential node id (popular skill order tree). */

export type SkillOrderTreeNode =
  | {
      wins?: number;
      numGames?: number;
      children?: Record<string, SkillOrderTreeNode> | null;
    }
  | undefined;

export function bestSkillOrderStats(
  roots: Record<string, SkillOrderTreeNode> | null | undefined,
): { wins: number; games: number } | null {
  if (!roots || typeof roots !== "object") return null;
  let best: { wins: number; games: number } | null = null;

  for (const seed of Object.values(roots)) {
    if (!seed) continue;
    let n = seed as NonNullable<SkillOrderTreeNode>;
    while (n && n.children && Object.keys(n.children).length > 0) {
      const children = Object.values(n.children).filter(Boolean) as NonNullable<
        SkillOrderTreeNode
      >[];
      if (!children.length) break;
      n = children.sort(
        (a, b) => (b.numGames ?? 0) - (a.numGames ?? 0),
      )[0]!;
    }
    const cand = { wins: n.wins ?? 0, games: n.numGames ?? 0 };
    if (cand.games > 0 && (!best || cand.games > best.games)) best = cand;
  }
  return best;
}

export function formatSamples(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
