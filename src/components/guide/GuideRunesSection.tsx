"use client";

import type { GuideRunesV3 } from "@/types/guide";
import { summonerSpellUrl } from "@/lib/ddragonAssets";
import { useGuidePatch } from "@/contexts/GuidePatchContext";
import { MdxLite } from "@/lib/parseMdxLite";
import { RuneIcon, RuneTreeIcon } from "@/components/guide/RuneIcon";
import { SectionDivider } from "@/components/guide/SectionDivider";

const DEFAULT_STAT_IDS = [5005, 5008, 5001];
const KEYSTONE_IDS = new Set([
  8010, 8112, 8128, 8214, 8229, 8230, 8351, 8358, 8360, 8369, 8437, 8465, 9923,
]);

function reorderPrimary(ids: number[]) {
  const copy = [...ids];
  const kIdx = copy.findIndex((id) => KEYSTONE_IDS.has(id));
  if (kIdx > 0) {
    const [keystone] = copy.splice(kIdx, 1);
    copy.unshift(keystone!);
  }
  return copy;
}

export function GuideRunesSection({
  runes,
  summonerSpells,
}: {
  runes: GuideRunesV3;
  summonerSpells: string[];
}) {
  const patch = useGuidePatch();
  const insights = runes.runeInsights;
  const ordered =
    insights?.insightsOrder
      ?.map((o) => insights.insights[o.id])
      .filter(Boolean) ?? [];

  const primaryIds = reorderPrimary(runes.primary.activeRuneIds);
  const sorcAlt = insights?.insights?.["sorcery-alt"];

  return (
    <section id="runes" className="scroll-mt-28">
      <SectionDivider title="Recommended Runes" />

      <div className="rounded-xl border border-[#252d38] bg-[#12171c] p-5 sm:p-7">
        <div className="mb-8 flex gap-4 border-b border-[#252d38]/80 pb-6">
          <span className="rounded-md bg-[#252d38] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#E8C34B]">
            Recommended Build
          </span>
        </div>

        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-12 xl:gap-10 xl:divide-x xl:divide-[#252d38]/60">
          {/* Left — runes */}
          <div className="flex flex-row flex-wrap justify-center gap-x-16 gap-y-10 xl:col-span-5 xl:flex-nowrap xl:justify-between xl:self-start xl:pr-10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <RuneTreeIcon tree={runes.primary.tree} size={30} />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#d44d4d]">
                  {runes.primary.tree}
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                {primaryIds.map((id, idx) => {
                  const size =
                    KEYSTONE_IDS.has(id) && idx === 0 ? 56 : idx === 0 ? 52 : idx === 1 ? 46 : 40;
                  return (
                    <div key={`${id}-p-${idx}`} className="relative flex justify-center pt-3">
                      <span className="absolute left-[-6px] top-0 z-10 flex h-7 min-w-[26px] items-center justify-center rounded-full border border-[#ff9437] bg-[#1e0c07] px-1 font-display text-[11px] font-bold text-[#ffb347]">
                        {idx + 1}
                      </span>
                      <RuneIcon
                        runeId={id}
                        size={size}
                        highlight="primary"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-5">
                {DEFAULT_STAT_IDS.map((id) => (
                  <RuneIcon key={`stat-${id}`} runeId={id} size={32} highlight="shard" />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <RuneTreeIcon tree={runes.secondary.tree} size={30} />
                <span className="text-[12px] font-semibold uppercase tracking-wide text-[#5eb7d9]">
                  {runes.secondary.tree}
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                {runes.secondary.activeRuneIds.map((id, idx) => (
                  <div key={`${id}-s-${idx}`} className="relative flex justify-center pt-3">
                    <span className="absolute left-[-8px] top-0 z-10 rounded-full bg-[#E8C34B] px-2 py-0.5 font-display text-[11px] font-bold text-black">
                      {idx + 2}
                    </span>
                    <RuneIcon runeId={id} size={42} highlight="secondary" />
                  </div>
                ))}
              </div>
              {sorcAlt?.secondaryOption ? (
                <div className="mt-6 max-w-[200px] rounded-lg border border-[#493d7a]/80 bg-[#181029] px-3 py-2 text-center text-[10px] font-semibold uppercase leading-relaxed tracking-wide text-[#c49cff]">
                  OR {sorcAlt.secondaryOption.header}
                </div>
              ) : null}
              {sorcAlt?.runeId && sorcAlt.runeId2 ? (
                <div className="flex gap-6">
                  <RuneIcon runeId={sorcAlt.runeId} size={40} highlight="shard" />
                  <RuneIcon runeId={sorcAlt.runeId2} size={40} highlight="shard" />
                </div>
              ) : null}
            </div>
          </div>

          {/* Right — summoners + insight cards */}
          <div className="min-w-0 space-y-5 xl:col-span-7 xl:!border-l xl:pl-10">
            <div className="rounded-lg bg-[#0d1117] px-6 py-5 sm:px-8">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8b919a]">
                Summoner spells
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-8 pt-4">
                {summonerSpells.map((spell) => (
                  <div key={spell} className="flex items-center gap-3">
                    <img
                      src={summonerSpellUrl(spell, patch)}
                      alt={spell}
                      width={40}
                      height={40}
                      className="rounded-md border border-[#2d3642] bg-[#14181f]"
                    />
                    <span className="font-display text-lg font-semibold italic text-white">
                      {spell}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[14px] italic text-[#b7c4d8]">
                These are the best every game.
              </p>
            </div>

            <div className="max-h-none space-y-3 overflow-x-hidden overflow-y-visible sm:max-h-none xl:max-h-[640px] xl:overflow-y-auto xl:pr-2">
              {ordered.map((insight, i) => (
                <article
                  key={insight.id}
                  className="relative rounded-xl border border-[#1e252d] bg-[#151920] p-6 sm:p-8"
                >
                  <span
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold text-black"
                    style={{
                      backgroundColor:
                        i === 0 ? "#ff7a2f" : i === 1 ? "#e8c34b" : "#a855f7",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="mb-4 flex flex-wrap items-start gap-4 pr-14">
                    <RuneTreeIcon tree={insight.tree} size={24} />
                    <h3 className="flex-1 text-[17px] font-bold leading-snug text-white">
                      {insight.insightTitle}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b919a]">
                      {insight.tree}
                    </span>
                  </div>
                  <MdxLite source={insight.insight} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
