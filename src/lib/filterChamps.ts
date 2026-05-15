import type { ChampEntry } from "@/types/tierlist";

export function filterChamps<T extends ChampEntry>(
  entries: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => e.championName.toLowerCase().includes(q));
}
