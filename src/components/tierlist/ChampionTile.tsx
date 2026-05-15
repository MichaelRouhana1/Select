"use client";

import Link from "next/link";
import type { ChampionAtlasData } from "@/types/tierlist";
import { championSpriteStyle } from "@/lib/championSprite";

function isHttpUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

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
  const baseClass = `relative block shrink-0 cursor-pointer ${className}`;

  const inner = (
    <>
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
    </>
  );

  if (!href) {
    return (
      <span
        className={`${baseClass} cursor-default`}
        aria-label={championName}
        title={championName}
      >
        {inner}
      </span>
    );
  }

  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        aria-label={championName}
        title={championName}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={baseClass}
      aria-label={championName}
      title={championName}
    >
      {inner}
    </Link>
  );
}
