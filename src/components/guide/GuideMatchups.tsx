import Link from "next/link";
import type { MatchupEntry } from "@/types/guide";
import type { RoleRoute } from "@/lib/roles";
import { buildGuideHref } from "@/lib/guides";
import { tierSnapshot } from "@/data/tierSnapshot";
import { championSpriteStyle } from "@/lib/championSprite";
import { formatSamples } from "@/lib/guideAggStats";
import { SectionDivider } from "@/components/guide/SectionDivider";

function displayNameFromAggId(id: string) {
  return id.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").trim();
}

function Row({
  subtitle,
  title,
  accent,
  entries,
  matchupRole,
}: {
  subtitle: string;
  title: string;
  accent: "bad" | "good";
  entries: MatchupEntry[];
  matchupRole: RoleRoute;
}) {
  const atlas = tierSnapshot.championAtlasData;
  const map = tierSnapshot.champNameToIdMap;
  const hue = accent === "bad" ? "#f47a7a" : "#6ee3a1";
  const border = accent === "bad" ? "rgba(239,98,125,0.35)" : "rgba(109,212,155,0.28)";

  return (
    <div
      className="flex max-w-full flex-col rounded-xl px-5 py-8 sm:px-7"
      style={{
        backgroundColor: "#121821",
        border: `1px solid ${border}`,
        boxShadow:
          accent === "bad"
            ? "0px 0px 30px rgba(250,90,120,0.06)"
            : "0px 0px 30px rgba(90,229,157,0.07)",
      }}
    >
      <h3
        className="text-center font-display text-[clamp(1.25rem,3.5vw,1.875rem)] font-black uppercase italic outline-none tracking-wider md:tracking-normal"
        style={{ color: hue }}
      >
        {title.toUpperCase()}
      </h3>
      <p className="mt-3 text-center text-[15px] font-semibold capitalize text-[#e5e9ef] italic">
        {subtitle}
      </p>
      <div className="mt-[-2px]" aria-hidden />

      <div className="-mx-2 mt-8 flex gap-8 overflow-x-auto pb-2 sm:flex-nowrap sm:justify-evenly">
        {entries.map((m) => {
          const atlasId = map[m.championId] ?? m.championId;
          const label = displayNameFromAggId(m.championId);
          const games = formatSamples(m.games);
          const href = buildGuideHref(label, matchupRole);

          return (
            <Link
              key={m.championId}
              href={href}
              aria-label={`${label} — ${m.winRate}% win rate, view build`}
              className="flex min-w-[120px] flex-col items-center gap-3 rounded-lg outline-none ring-offset-2 ring-offset-[#121821] transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            >
              <div
                className="rounded-full p-[3px]"
                style={{
                  boxShadow:
                    accent === "bad"
                      ? "0 0 28px rgba(250, 90, 120, 0.18)"
                      : "0 0 28px rgba(90, 229, 157, 0.16)",
                  background:
                    accent === "bad"
                      ? "linear-gradient(145deg, rgba(255,80,100,0.45), rgba(30,20,24,0.2))"
                      : "linear-gradient(145deg, rgba(80,230,150,0.4), rgba(20,30,24,0.2))",
                }}
              >
                <div
                  role="img"
                  aria-hidden
                  className="overflow-hidden rounded-full bg-[#0d1117]"
                  style={{
                    width: 80,
                    height: 80,
                    ...championSpriteStyle(atlas, atlasId, 80),
                  }}
                />
              </div>
              <div className="max-w-[128px] text-center">
                <p className="text-[15px] font-bold leading-tight text-white">{label}</p>
                <p className="mt-1 text-[14px] font-semibold" style={{ color: hue }}>
                  {m.winRate}% WR
                </p>
                <p className="text-[12px] text-[#8b919a]">{games} games</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function GuideMatchups({
  championName,
  matchupRole,
  hardest,
  best,
}: {
  championName: string;
  matchupRole: RoleRoute;
  hardest: MatchupEntry[];
  best: MatchupEntry[];
}) {
  return (
    <section id="matchups" className="scroll-mt-28">
      <SectionDivider title="Matchups" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-11">
        <Row
          title="Hardest Matchups"
          subtitle={`${championName} struggles most against these champions.`}
          accent="bad"
          entries={hardest}
          matchupRole={matchupRole}
        />
        <Row
          title="Best Matchups"
          subtitle={`${championName} is strong against these champions.`}
          accent="good"
          entries={best}
          matchupRole={matchupRole}
        />
      </div>
    </section>
  );
}
