"use client";

import type { GuideAggData, ItemGroup } from "@/types/guide";
import { itemIconUrl } from "@/lib/ddragonAssets";
import { useGuidePatch } from "@/contexts/GuidePatchContext";
import { MdxLite } from "@/lib/parseMdxLite";
import { SectionDivider } from "@/components/guide/SectionDivider";

const GROUP_ACCENTS = [
  { bar: "#E8C34B", glow: "0 0 24px rgba(232,195,75,0.12)" },
  { bar: "#5ad4a8", glow: "0 0 22px rgba(90,212,168,0.1)" },
  { bar: "#6aa7ff", glow: "0 0 22px rgba(106,167,255,0.12)" },
  { bar: "#d47cff", glow: "0 0 22px rgba(212,124,255,0.1)" },
];

function lateGameSlotRows(
  late: GuideAggData["lateGameItems"],
): Array<{ key: string; label: string; items: { itemId: string }[] }> {
  if (!late || Array.isArray(late)) return [];
  const rec = late as Record<string, Array<{ itemId: string }>>;
  const order: Array<[string, string]> = [
    ["slot4", "Fourth-item flex"],
    ["slot5", "Fifth-item flex"],
    ["slot6", "Sixth-item flex"],
  ];
  return order.flatMap(([key, label]) => {
    const items = rec[key]?.filter((e) => e.itemId);
    return items?.length ? [{ key, label, items }] : [];
  });
}

export function GuideItemsSection({
  championName,
  groups,
  startingBundle,
  startingExplainer,
  lateGameItems,
}: {
  championName: string;
  groups: ItemGroup[];
  startingBundle?: { itemIds: string[]; stats: { wins: number; numGames: number } };
  startingExplainer?: string;
  lateGameItems?: GuideAggData["lateGameItems"];
}) {
  const patch = useGuidePatch();
  const lateRows = lateGameSlotRows(lateGameItems);

  const startingWr =
    startingBundle && startingBundle.stats.numGames > 0
      ? (
          (startingBundle.stats.wins / startingBundle.stats.numGames) *
          100
        ).toFixed(1)
      : null;

  if (!groups.length && !startingBundle?.itemIds?.length && !lateRows.length) {
    return null;
  }

  return (
    <section id="full-build" className="scroll-mt-28">
      <SectionDivider title={`${championName} Builds`.toUpperCase()} />

      {startingBundle?.itemIds?.length ? (
        <div
          className="mb-8 rounded-xl border border-[#2a3342] bg-[#12171c] p-6"
          style={{ boxShadow: "inset 0 0 0 1px rgba(232,195,75,0.06)" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C34B]">
            ★ Starting loadout
          </p>
          {startingExplainer?.trim() ? (
            <p className="mt-2 text-[13px] leading-relaxed text-[#9aa3ae]">
              {startingExplainer}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-end gap-4">
            <div className="flex flex-wrap gap-3">
              {startingBundle.itemIds.map((id) => (
                <img
                  key={id}
                  src={itemIconUrl(id, patch)}
                  alt=""
                  width={52}
                  height={52}
                  className="rounded-lg border border-[#2f3845] bg-black/25"
                />
              ))}
            </div>
            {startingWr != null && startingBundle ? (
              <div className="text-[12px] text-[#8b919a]">
                <span className="font-display text-lg font-bold text-white">
                  {startingWr}%
                </span>{" "}
                win rate over{" "}
                <span className="text-[#cfd4da]">
                  {startingBundle.stats.numGames.toLocaleString()}
                </span>{" "}
                games (most common start)
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {groups.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group, idx) => {
            const accent = GROUP_ACCENTS[idx % GROUP_ACCENTS.length]!;
            return (
              <article
                key={group.id}
                className="flex gap-5 overflow-hidden rounded-xl border border-[#252d38] bg-[#151a21] p-5 lg:gap-8"
                style={{ boxShadow: accent.glow }}
              >
                <div
                  className="w-1 shrink-0 self-stretch rounded-full"
                  style={{ backgroundColor: accent.bar }}
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
                  <div className="flex shrink-0 flex-col items-center gap-4 lg:items-start lg:pt-1">
                    <h3 className="text-center font-display text-[15px] font-bold uppercase tracking-wide text-[#cdd4dc] lg:text-left">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                      {group.items.map((item) => (
                        <div key={item.itemId} className="text-center">
                          <img
                            src={itemIconUrl(item.itemId, patch)}
                            alt=""
                            width={52}
                            height={52}
                            className="rounded-lg border border-[#2f3845]"
                          />
                          <p className="mt-1 max-w-[76px] text-[10px] leading-tight text-[#8b919a]">
                            {item.itemText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(group.insightHeader || group.insight) && (
                    <div className="min-w-0 flex-1 rounded-lg border border-[#232a34] bg-[#12171c]/80 p-4 lg:border-l lg:border-t-0 lg:border-[#252d38] lg:bg-transparent lg:p-0 lg:pl-2">
                      {group.insightHeader ? (
                        <p className="mb-2 text-[12px] font-bold text-white lg:mb-3">
                          {group.insightHeader}
                        </p>
                      ) : null}
                      {group.insight ? <MdxLite source={group.insight} /> : null}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {lateRows.length > 0 ? (
        <div className="mt-10 space-y-6">
          <p className="text-center font-display text-[13px] font-bold uppercase tracking-[0.22em] text-[#8b919a]">
            Popular ranked options · late slots
          </p>
          {lateRows.map((row) => (
            <div
              key={row.key}
              className="rounded-xl border border-[#252d38] bg-[#12171c] px-5 py-4"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d7680]">
                {row.label}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {row.items.map((e) => (
                  <img
                    key={`${row.key}-${e.itemId}`}
                    src={itemIconUrl(e.itemId, patch)}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-md border border-[#2f3845] opacity-95"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
