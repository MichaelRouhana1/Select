import type { CSSProperties } from "react";
import Link from "next/link";
import type { ChampEntry } from "@/types/tierlist";
import type { ChampionAtlasData } from "@/types/tierlist";
import type { RoleRoute } from "@/lib/roles";
import { buildGuideHref } from "@/lib/guides";
import { championSpriteStyle } from "@/lib/championSprite";

function OpPortrait({
  entry,
  atlas,
  champNameToIdMap,
  activeRole,
}: {
  entry: ChampEntry;
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  activeRole: RoleRoute;
}) {
  const id = champNameToIdMap[entry.championName];
  const sprite: CSSProperties = championSpriteStyle(atlas, id, 112);

  return (
    <Link
      href={buildGuideHref(entry.championName, activeRole)}
      className="relative block shrink-0"
      style={{ width: 120, height: 120 }}
      aria-label={entry.championName}
      title={entry.championName}
    >
      <div className="relative h-full w-full rounded-full">
        <div className="op-glow-pulse relative h-full w-full rounded-full">
          <div
            className="op-ring-spin absolute rounded-full"
            style={{
              inset: -4,
              background:
                "conic-gradient(rgb(128,0,255), rgb(168,85,247), rgb(212,176,255), rgb(168,85,247), rgb(128,0,255))",
            }}
          />
          <div className="absolute inset-1 overflow-hidden rounded-full">
            <div
              role="img"
              aria-label={entry.championName}
              className="overflow-hidden rounded-full"
              style={{ width: 112, height: 112, ...sprite }}
            />
          </div>
        </div>
      </div>
      {entry.rank === "+" ? (
        <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-bold text-[#E8C34B]">
          +
        </span>
      ) : null}
    </Link>
  );
}

function CircularStripPortrait({
  entry,
  atlas,
  champNameToIdMap,
  variant,
  activeRole,
}: {
  entry: ChampEntry;
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  variant: "low" | "ban";
  activeRole: RoleRoute;
}) {
  const grad =
    variant === "low"
      ? {
          bg: "linear-gradient(135deg, rgb(106, 184, 255) 0%, rgb(255,255,255) 50%, rgb(106, 184, 255) 100%)",
          glow: "rgba(106,184,255,0.4)",
        }
      : {
          bg: "linear-gradient(135deg, rgb(255, 107, 107) 0%, rgb(255,255,255) 50%, rgb(255, 107, 107) 100%)",
          glow: "rgba(255,107,107,0.4)",
        };

  const id = champNameToIdMap[entry.championName];
  const sprite: CSSProperties = championSpriteStyle(atlas, id, 84);

  return (
    <Link
      href={buildGuideHref(entry.championName, activeRole)}
      className="relative block shrink-0"
      style={{ width: 90, height: 90 }}
      aria-label={entry.championName}
      title={entry.championName}
    >
      <div
        className="rounded-full"
        style={{
          width: 90,
          height: 90,
          padding: 3,
          background: grad.bg,
          boxShadow: `0 0 12px ${grad.glow}, 0 0 24px ${grad.glow}`,
        }}
      >
        <div
          role="img"
          aria-label={entry.championName}
          className="overflow-hidden rounded-full"
          style={{ width: 84, height: 84, ...sprite }}
        />
      </div>
    </Link>
  );
}

const purple = "rgb(154, 53, 254)";

function OverpoweredTitle() {
  return (
    <div className="mt-6 w-full max-w-[500px]">
      <div className="relative flex w-full items-center justify-center gap-4 overflow-hidden">
        <div className="flex w-[150px] shrink-0 items-center justify-end">
          <svg width="21" height="10" viewBox="0 0 21 10" fill="none">
            <polygon
              points="20.77 5 3.05 5 0.82 0.67 18.54 0.67"
              fill="none"
              stroke={purple}
              strokeMiterlimit={10}
            />
          </svg>
          <div className="h-px flex-1" style={{ backgroundColor: purple }} />
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
            <polygon
              points="0,7 7,0 14,7 7,14"
              fill="none"
              stroke={purple}
              strokeMiterlimit={10}
            />
          </svg>
        </div>
        <div className="relative shrink-0 px-4 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 font-display text-[28px] font-bold uppercase italic leading-[1.3] tracking-[0.06em] text-transparent"
            style={{
              textShadow: "0 0 16px rgba(154, 53, 254, 0.55)",
            }}
          >
            OVERPOWERED
          </div>
          <div
            className="font-display relative text-[28px] font-bold uppercase italic leading-[1.3] tracking-[0.06em]"
            style={{
              background:
                "linear-gradient(rgb(212,176,255) 0%, rgb(168,85,247) 40%, rgb(128,0,255) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OVERPOWERED
          </div>
        </div>
        <div className="flex w-[150px] shrink-0 items-center justify-start">
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
            <polygon
              points="0,7 7,0 14,7 7,14"
              fill="none"
              stroke={purple}
              strokeMiterlimit={10}
            />
          </svg>
          <div className="h-px flex-1" style={{ backgroundColor: purple }} />
          <svg width="21" height="10" viewBox="0 0 21 10" fill="none">
            <polygon
              points="0.23 5 17.95 5 20.18 0.67 2.46 0.67"
              fill="none"
              stroke={purple}
              strokeMiterlimit={10}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LowEloBlock({
  entries,
  atlas,
  champNameToIdMap,
  activeRole,
}: {
  entries: ChampEntry[];
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  activeRole: RoleRoute;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="font-display text-[26px] uppercase italic tracking-[0.06em] text-[#f5f5f5]"
        style={{ fontWeight: 700 }}
      >
        LOW ELO PICKS
      </span>
      <div
        className="relative rounded-[15px] border-2 border-[#957f57]"
        style={{
          width: 350,
          height: 110,
          backgroundColor: "#0084FF",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ gap: 14 }}
        >
          {entries.map((e) => (
            <CircularStripPortrait
              key={`low-${e.championName}`}
              entry={e}
              atlas={atlas}
              champNameToIdMap={champNameToIdMap}
              variant="low"
              activeRole={activeRole}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BansBlock({
  entries,
  atlas,
  champNameToIdMap,
  activeRole,
}: {
  entries: ChampEntry[];
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  activeRole: RoleRoute;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="font-display text-[26px] uppercase italic tracking-[0.06em] text-[#f5f5f5]"
        style={{ fontWeight: 700 }}
      >
        BANS
      </span>
      <div
        className="relative rounded-[15px] border-2 border-[#957f57]"
        style={{
          width: 350,
          height: 110,
          backgroundColor: "#CC2E2E",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ gap: 14 }}
        >
          {entries.map((e) => (
            <CircularStripPortrait
              key={`ban-${e.championName}`}
              entry={e}
              atlas={atlas}
              champNameToIdMap={champNameToIdMap}
              variant="ban"
              activeRole={activeRole}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SpecialTierSections({
  op,
  lowElo,
  bans,
  atlas,
  champNameToIdMap,
  activeRole,
}: {
  op: ChampEntry[];
  lowElo: ChampEntry[];
  bans: ChampEntry[];
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  activeRole: RoleRoute;
}) {
  const hasFeatured = op.length > 0 || lowElo.length > 0 || bans.length > 0;
  if (!hasFeatured) return null;

  return (
    <div className="flex w-full flex-col items-center gap-8 pb-2 pt-2">
      <div className="flex w-full flex-col items-center gap-8">
        {op.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto w-full max-w-[500px]">
              <div
                className="absolute left-0 right-0 rounded-[15px] border border-[#957f57]"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: 110,
                  background:
                    "linear-gradient(90deg, rgb(165,74,255) 0%, rgb(128,0,255) 100%)",
                }}
              />
              <div
                className="relative flex items-center justify-center"
                style={{ gap: 16, padding: "6px 24px" }}
              >
                {op.map((e) => (
                  <OpPortrait
                    key={`op-${e.championName}-${e.rank}`}
                    entry={e}
                    atlas={atlas}
                    champNameToIdMap={champNameToIdMap}
                    activeRole={activeRole}
                  />
                ))}
              </div>
            </div>
            <OverpoweredTitle />
          </div>
        ) : null}

        <div className="flex flex-row flex-wrap justify-center gap-x-12 gap-y-8">
          <LowEloBlock
            entries={lowElo}
            atlas={atlas}
            champNameToIdMap={champNameToIdMap}
            activeRole={activeRole}
          />
          <BansBlock
            entries={bans}
            atlas={atlas}
            champNameToIdMap={champNameToIdMap}
            activeRole={activeRole}
          />
        </div>
      </div>
    </div>
  );
}
