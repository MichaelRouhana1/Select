import type { CSSProperties } from "react";
import type { ChampionAtlasData } from "@/types/tierlist";

export function championSpriteStyle(
  atlas: ChampionAtlasData,
  championId: string | undefined,
  cellSizePx: number,
): CSSProperties {
  if (!championId) {
    return {
      backgroundColor: "#1e252d",
    };
  }

  const frame = atlas.frameByChampionId[championId];
  if (!frame) {
    return {
      backgroundColor: "#1e252d",
    };
  }

  const scale = cellSizePx / frame.w;

  return {
    backgroundImage: `url(${atlas.atlasUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${atlas.width * scale}px ${atlas.height * scale}px`,
    backgroundPosition: `${-frame.x * scale}px ${-frame.y * scale}px`,
  };
}
