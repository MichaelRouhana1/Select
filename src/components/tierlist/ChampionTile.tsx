"use client";

import type { ChampionAtlasData } from "@/types/tierlist";
import { championSpriteStyle } from "@/lib/championSprite";

type ChampionTileProps = {
  championName: string;
  rank?: string;
  atlas: ChampionAtlasData;
  championId?: string;
  sizePx: number;
  rounded?: "md" | "full";
  className?: string;
  href?: string;
};

export function ChampionTile({
  championName,
  rank,
  atlas,
  championId,
  sizePx,
  rounded = "md",
  className = "",
  href,
}: ChampionTileProps) {
  const roundedClass = rounded === "full" ? "rounded-full" : "rounded-md";
  const isExternal = Boolean(href?.startsWith("http"));

  return (
    <a
      href={href ?? "#"}
      onClick={href ? undefined : (e) => e.preventDefault()}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`relative block shrink-0 cursor-pointer ${className}`}
      aria-label={championName}
      title={championName}
    >
      <div
        role="img"
        aria-label={championName}
        className={`flex-shrink-0 overflow-hidden ${roundedClass}`}
        style={{
          width: sizePx,
          height: sizePx,
          ...championSpriteStyle(atlas, championId, sizePx),
        }}
      />
      {rank === "+" ? (
        <span
          className="pointer-events-none absolute right-0.5 top-0.5 flex h-4 min-w-[18px] items-center justify-center rounded bg-black/75 px-1 text-[11px] font-bold leading-none text-[#E8C34B]"
          aria-hidden
        >
          +
        </span>
      ) : null}
    </a>
  );
}
