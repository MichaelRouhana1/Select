"use client";

import { useMemo, useState } from "react";
import type { GuideSkills } from "@/types/guide";
import { championSplashUrl } from "@/lib/ddragonAssets";
import { MdxLite } from "@/lib/parseMdxLite";
import { SectionDivider } from "@/components/guide/SectionDivider";
import { bestSkillOrderStats, formatSamples, type SkillOrderTreeNode } from "@/lib/guideAggStats";

const SPELL_LABEL: Record<string, string> = { q: "Q", w: "W", e: "E", r: "R" };
const ROW_KEYS = ["q", "w", "e", "r"] as const;

export function GuideSkillsSection({
  skills,
  championName,
  championId,
  skillOrderTree,
}: {
  skills: GuideSkills;
  championName: string;
  championId: string;
  skillOrderTree?: Record<string, SkillOrderTreeNode> | null;
}) {
  const [activeId, setActiveId] = useState(skills.insights[0]?.id ?? "");
  const active =
    skills.insights.find((i) => i.id === activeId) ?? skills.insights[0];

  const priority = skills.priority
    .map((s) => SPELL_LABEL[s] ?? s.toUpperCase())
    .join(" › ");

  const pathStats = useMemo(
    () => bestSkillOrderStats(skillOrderTree),
    [skillOrderTree],
  );
  const skillWr =
    pathStats && pathStats.games > 0
      ? ((pathStats.wins / pathStats.games) * 100).toFixed(1)
      : null;

  const order = skills.order;

  return (
    <section id="skill-order" className="scroll-mt-28">
      <SectionDivider title={`${championName} Abilities`.toUpperCase()} />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="rounded-xl border border-[#252d38] bg-[#12171c] p-8 xl:col-span-5">
          <p className="font-semibold uppercase tracking-[0.14em] text-[#E8C34B]">
            ★ Skill Priority
          </p>
          <p className="mt-6 text-center font-display text-[clamp(2rem,5vw,3.25rem)] font-bold italic leading-none text-white">
            {priority}
          </p>
          {skillWr != null && pathStats ? (
            <div className="mt-8 text-center">
              <p className="font-display text-[2.5rem] font-black leading-none text-white md:text-[2.9rem]">
                {skillWr}% WR
              </p>
              <p className="mt-3 text-sm text-[#8b919a]">
                {formatSamples(pathStats.games)} matches (popular leveling path)
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-[#252d38] bg-[#151a21] p-6 xl:col-span-7">
          <p className="font-semibold uppercase tracking-[0.14em] text-[#E8C34B]">
            ★ Skill Path
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#8b919a]">
            Each column is a level; the highlighted cell marks which ability received the point.
          </p>
          <div className="mt-6 overflow-x-auto pb-2">
            <div
              className="grid items-center gap-y-2"
              style={{
                gridTemplateColumns: `52px repeat(${order.length}, minmax(22px,1fr))`,
                minWidth: 52 + order.length * 26,
              }}
            >
              <div />
              {order.map((_, i) => (
                <span key={i} className="text-center text-[11px] font-semibold text-[#6d7680]">
                  {i + 1}
                </span>
              ))}
              {ROW_KEYS.map((row) => (
                <div key={`row-${row}`} className="contents">
                  <div className="font-display text-xl font-bold uppercase text-[#cdd4dc]">
                    {SPELL_LABEL[row]}
                  </div>
                  {order.map((spell, col) => {
                    const hit = spell === row;
                    const lvl = col + 1;
                    const milestone =
                      hit && row === "r" && (lvl === 6 || lvl === 11 || lvl === 16);
                    return (
                      <div key={`${row}-${col}`} className="flex min-h-[44px] items-center justify-center">
                        {hit ? (
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-md font-display text-sm font-bold shadow-inner ${
                              milestone
                                ? "bg-purple-600/80 text-white ring-2 ring-purple-300/70"
                                : "bg-[#2a3342] text-[#E8C34B] ring-1 ring-[#3d4858]"
                            }`}
                            title={`Level ${lvl}`}
                          >
                            {SPELL_LABEL[spell]}
                          </span>
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-[#1e252d]" aria-hidden />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-[#252d38] bg-[#12171c]">
        <div className="flex flex-wrap gap-2 border-b border-[#252d38] p-3 sm:gap-4">
          {skills.insights.map((insight) => (
            <button
              key={insight.id}
              type="button"
              onClick={() => setActiveId(insight.id)}
              className={`rounded px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide sm:min-w-[120px] sm:text-[12px] ${
                active?.id === insight.id
                  ? "bg-[#252d38] text-[#E8C34B]"
                  : "bg-transparent text-[#8b919a] hover:bg-[#1a1f28] hover:text-white"
              }`}
            >
              {insight.title}
            </button>
          ))}
        </div>
        {active ? (
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
            <div>
              <h4 className="mb-4 font-display text-xl font-bold text-white">
                {active.title}
              </h4>
              <MdxLite source={active.reason} />
            </div>
            <div className="relative hidden min-h-[220px] overflow-hidden rounded-xl border border-[#242b36] lg:block">
              <img
                src={championSplashUrl(championId, 0)}
                alt=""
                className="h-full w-full object-cover opacity-[0.18]"
                style={{ objectPosition: "center 16%" }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
