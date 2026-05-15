import type { GuideSnapshot } from "@/types/guide";

import guide_0 from "./guides/shaco-jungle.json";

const guides: Record<string, GuideSnapshot> = {
  "shaco-jungle": guide_0 as GuideSnapshot,
};

export const GUIDE_KEYS = Object.keys(guides);

export function getGuideSnapshot(key: string): GuideSnapshot | undefined {
  return guides[key];
}

export function listGuideKeys(): string[] {
  return GUIDE_KEYS;
}
