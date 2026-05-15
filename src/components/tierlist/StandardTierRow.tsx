import type { ChampEntry } from "@/types/tierlist";
import type { ChampionAtlasData } from "@/types/tierlist";
import { ChampionTile } from "@/components/tierlist/ChampionTile";
import {
  buildGuideHref,
  championSlugFromName,
  guideStorageKey,
  skillCappedBuildUrl,
} from "@/lib/guides";
import { getGuideSnapshot } from "@/data/guideRegistry";
import type { RoleRoute } from "@/lib/roles";

type TierKey = "s" | "a" | "b" | "c";

/** Default fill for tier letter column + champion panel (reference: ~#1a1f2e). */
const TIER_PANEL_BG = "#1a1f2e";

const TIER_VISUAL: Record<
  TierKey,
  {
    letter: string;
    /** Solid color for the letter + stars + outer panel border. */
    accent: string;
    /** Background fill for the label column (S is filled with the accent). */
    labelBg: string;
    /** Color of the letter glyph. */
    letterColor: string;
    starLayout: "s" | "a" | "b" | "c";
  }
> = {
  s: {
    letter: "s",
    accent: "#FFD400",
    labelBg: "#FFD400",
    letterColor: "#383838",
    starLayout: "s",
  },
  a: {
    letter: "a",
    accent: "#FF9900",
    labelBg: TIER_PANEL_BG,
    letterColor: "#FF9900",
    starLayout: "a",
  },
  b: {
    letter: "b",
    accent: "#0084FF",
    labelBg: TIER_PANEL_BG,
    letterColor: "#0084FF",
    starLayout: "b",
  },
  c: {
    letter: "c",
    accent: "#E02424",
    labelBg: TIER_PANEL_BG,
    letterColor: "#E02424",
    starLayout: "c",
  },
};

function Star({ fill }: { fill: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarsCluster({
  tier,
  fill,
}: {
  tier: TierKey;
  fill: string;
}) {
  const layout = TIER_VISUAL[tier].starLayout;
  if (layout === "s") {
    return (
      <div className="relative h-[36px] w-[42px]">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <Star fill={fill} />
        </div>
        <div className="absolute left-[1px] top-[9px]">
          <Star fill={fill} />
        </div>
        <div className="absolute right-[1px] top-[9px]">
          <Star fill={fill} />
        </div>
        <div className="absolute bottom-0 left-[6px]">
          <Star fill={fill} />
        </div>
        <div className="absolute bottom-0 right-[6px]">
          <Star fill={fill} />
        </div>
      </div>
    );
  }
  if (layout === "a") {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <Star fill={fill} />
        <div className="flex flex-row gap-1.5">
          <Star fill={fill} />
          <Star fill={fill} />
        </div>
      </div>
    );
  }
  if (layout === "b") {
    return (
      <div className="flex flex-row gap-1.5">
        <Star fill={fill} />
        <Star fill={fill} />
      </div>
    );
  }
  return <Star fill={fill} />;
}

/**
 * Tier row: navy label strip (letter + stars) + separate rounded panel with
 * thin tier-colored border wrapping the champion grid (reference layout).
 */
export function StandardTierRow({
  tier,
  entries,
  atlas,
  champNameToIdMap,
  activeRole,
}: {
  tier: TierKey;
  entries: ChampEntry[];
  atlas: ChampionAtlasData;
  champNameToIdMap: Record<string, string>;
  activeRole: RoleRoute;
}) {
  const v = TIER_VISUAL[tier];

  if (entries.length === 0) return null;

  return (
    <div className="flex w-full justify-center px-2 py-3 sm:px-4">
      <div className="relative flex w-full max-w-[940px] flex-row items-center">
        <div
          className="flex h-[150px] w-[78px] shrink-0 flex-col items-center justify-center gap-2 rounded-l-lg px-2 py-3"
          style={{ backgroundColor: v.labelBg }}
        >
          <div
            className="font-display uppercase italic leading-none"
            style={{
              fontWeight: 700,
              fontSize: 48,
              color: v.letterColor,
            }}
          >
            {v.letter}
          </div>
          <StarsCluster tier={tier} fill={v.letterColor} />
        </div>

        <div
          className="flex min-h-[120px] min-w-0 flex-1 flex-wrap content-start gap-2 rounded-lg border border-solid p-4 shadow-[0_4px_24px_rgba(0,0,0,0.28)]"
          style={{
            backgroundColor: TIER_PANEL_BG,
            borderColor: v.accent,
          }}
        >
          {entries.map((ch) => {
            const slug = championSlugFromName(ch.championName);
            const guideKey = guideStorageKey(slug, activeRole);
            const hasGuide = Boolean(getGuideSnapshot(guideKey));
            const href = hasGuide
              ? buildGuideHref(ch.championName, activeRole)
              : skillCappedBuildUrl(slug, activeRole);
            return (
              <ChampionTile
                key={`${tier}-${ch.championName}`}
                championName={ch.championName}
                rank={ch.rank}
                atlas={atlas}
                championId={champNameToIdMap[ch.championName]}
                sizePx={70}
                rounded="md"
                href={href}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
