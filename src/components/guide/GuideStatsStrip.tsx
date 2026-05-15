import type { GuidePageMeta } from "@/types/guide";

const TIER_COLORS: Record<string, string> = {
  S: "#FFD400",
  A: "#FF9900",
  B: "#0084FF",
  C: "#E02424",
  D: "#8b919a",
};

type GuideStatsStripProps = {
  page: GuidePageMeta;
};

export function GuideStatsStrip({ page }: GuideStatsStripProps) {
  const stats = [
    { label: "Win Rate", value: `${page.stats.winRate?.toFixed(1) ?? "—"}%` },
    { label: "Pick Rate", value: `${page.stats.pickRate?.toFixed(1) ?? "—"}%` },
    { label: "Ban Rate", value: `${page.stats.banRate?.toFixed(1) ?? "—"}%` },
    {
      label: "Games",
      value: page.stats.games != null ? page.stats.games.toLocaleString() : "—",
    },
  ];

  const tierClr = TIER_COLORS[page.tier.toUpperCase()] ?? TIER_COLORS.A;

  return (
    <section
      className="w-full py-6 md:py-8"
      style={{
        borderBottom: "1px solid #1e252d",
        background: "#0a0c10",
      }}
      aria-label="Tier and statistics"
    >
      <div className="mx-auto flex max-w-[1256px] flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="font-display font-bold italic uppercase leading-none md:shrink-0" style={{ color: tierClr }}>
          <div className="text-[clamp(3.5rem,12vw,5.5rem)]">{page.tier}</div>
          <div className="text-[clamp(1rem,3vw,1.25rem)] tracking-[0.35em] text-[#7a8491]">
            tier
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:justify-end md:gap-x-10">
          {stats.map(({ label, value }) => (
            <div key={label} className="min-w-[96px]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f7780]">
                {label}
              </div>
              <div className="font-display mt-1 text-xl font-bold italic text-white md:text-2xl">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
