import type { GuidePageMeta } from "@/types/guide";
import { championLoadingUrl, championSplashUrl } from "@/lib/ddragonAssets";

const TIER_COLORS: Record<string, string> = {
  S: "#FFD400",
  A: "#FF9900",
  B: "#0084FF",
  C: "#E02424",
  D: "#8b919a",
};

type GuideHeroProps = {
  page: GuidePageMeta;
  tierListHref: string;
};

export function GuideHeroBar({ page, tierListHref }: GuideHeroProps) {
  const tierColor = TIER_COLORS[page.tier.toUpperCase()] ?? TIER_COLORS.A;

  return (
    <section
      className="relative w-full overflow-hidden pb-6"
      style={{ backgroundColor: "#0d1117" }}
    >
      <div
        className="relative mx-auto w-full px-4 sm:px-6 xl:max-w-[1256px] xl:px-0"
        style={{ minHeight: 260 }}
      >
        <div
          className="absolute overflow-hidden rounded-[5px] max-sm:left-4 max-sm:right-4 xl:left-0 xl:right-0"
          style={{
            left: "max(16px,(100%-1256px)/2)",
            right: "max(16px,(100%-1256px)/2)",
            top: 16,
            height: 160,
            backgroundColor: "#15181d",
          }}
        >
          <img
            src={championSplashUrl(page.championId, 0)}
            alt=""
            className="h-full w-full object-cover opacity-[0.18]"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        <div className="relative flex flex-col gap-6 pt-4 md:flex-row md:items-start md:justify-between xl:gap-12">
          <div className="flex min-w-0 flex-1 gap-6">
            <div className="relative shrink-0">
              <div
                className="overflow-hidden rounded-full bg-[#15181D]"
                style={{
                  width: 138,
                  height: 138,
                  border: `3px solid ${tierColor}`,
                }}
              >
                <img
                  src={championLoadingUrl(page.championId, 0)}
                  alt={page.championName}
                  width={138}
                  height={138}
                  className="h-full w-full object-cover object-top"
                  style={{
                    transform: "scale(1.08)",
                    transformOrigin: "center top",
                  }}
                />
              </div>
            </div>

            <div className="min-w-0 pt-1">
              <h1 className="font-display text-[clamp(1.65rem,4vw,2.6rem)] font-bold italic leading-none tracking-tight text-white uppercase">
                {page.championName}{" "}
                <span className="text-[#FF9A37]">{page.roleDisplay}</span>
              </h1>
              <p className="mt-2 text-[13px] text-[#8b919a]">
                Patch <span className="text-[#cfd4da]">{page.patch}</span>
              </p>
            </div>
          </div>

          <aside
            className="rounded-lg border border-[#252d38] px-5 py-4 max-md:w-full md:max-w-[380px]"
            style={{ background: "rgba(21,26,34,0.92)" }}
          >
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#E8C34B]">
              Why Skill-Capped?
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#9aa3ae]">
              Hand-crafted Challenger insights—not auto-generated spreadsheets.
              Learn how to leverage every rune, item, and ability for this patch.
            </p>
            <a
              href={tierListHref}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#63b8ff]"
            >
              View {page.roleDisplay} Tier List<span aria-hidden>→</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
