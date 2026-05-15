"use client";

import type { GuideSnapshot } from "@/types/guide";
import type { RoleRoute } from "@/lib/roles";
import { mergePageStats } from "@/lib/guides";
import { GuidePatchProvider } from "@/contexts/GuidePatchContext";
import { GuideHeader } from "@/components/guide/GuideHeader";
import { GuideHeroBar } from "@/components/guide/GuideHeroBar";
import { GuideStatsStrip } from "@/components/guide/GuideStatsStrip";
import { GuideRunesSection } from "@/components/guide/GuideRunesSection";
import { GuideMatchups } from "@/components/guide/GuideMatchups";
import { GuideSkillsSection } from "@/components/guide/GuideSkillsSection";
import { GuideItemsSection } from "@/components/guide/GuideItemsSection";
import { GuideAdvancedSection } from "@/components/guide/GuideAdvancedSection";

const DEFAULT_DDRAGON_PATCH = "15.24.1";

type GuideShellProps = {
  snapshot: GuideSnapshot;
  activeRole: RoleRoute;
  tierListHref: string;
};

export function GuideShell({
  snapshot,
  activeRole,
  tierListHref,
}: GuideShellProps) {
  const championSlug = snapshot.page.championSlug;
  const buildHref = (role: RoleRoute) => `/builds/${championSlug}/${role}`;
  const page = mergePageStats(snapshot);
  const { buildData, aggData } = snapshot;
  const skills = buildData.skills[0];
  const itemGroups = buildData.itemsSimpleV1?.itemGroups ?? [];
  const matchups = aggData.matchups;
  const ddragonPatch =
    snapshot._meta.ddragonPatch?.trim() || DEFAULT_DDRAGON_PATCH;
  const startingBundle = aggData.startingItemsTop?.[0];
  const startingExplainer =
    buildData.itemsSimpleV1?.startingItems &&
    typeof buildData.itemsSimpleV1.startingItems === "object" &&
    "sectionExplainer" in buildData.itemsSimpleV1.startingItems
      ? String(
          (buildData.itemsSimpleV1.startingItems as { sectionExplainer?: string })
            .sectionExplainer ?? "",
        )
      : undefined;

  return (
    <GuidePatchProvider patch={ddragonPatch}>
      <div className="min-h-screen" style={{ backgroundColor: "#0d1117" }}>
        <GuideHeader
          activeRole={activeRole}
          tierListHref={tierListHref}
          buildHref={buildHref}
        />

        <GuideHeroBar page={page} tierListHref={tierListHref} />
        <GuideStatsStrip page={page} />

        <main className="mx-auto w-full max-w-[1256px] space-y-2 px-5 py-8 pb-16">
          <GuideRunesSection
            runes={buildData.runesv3}
            summonerSpells={aggData.summonerSpells}
          />

          {matchups ? (
            <GuideMatchups
              championName={page.championName}
              matchupRole={activeRole}
              hardest={matchups.hardest}
              best={matchups.best}
            />
          ) : null}

          {skills ? (
            <GuideSkillsSection
              skills={skills}
              championId={page.championId}
              championName={page.championName}
              skillOrderTree={aggData.skillOrderTree}
            />
          ) : null}

          <GuideItemsSection
            championName={page.championName}
            groups={itemGroups}
            startingBundle={startingBundle}
            startingExplainer={startingExplainer}
            lateGameItems={aggData.lateGameItems}
          />

          <GuideAdvancedSection
            itemsAdvanced={buildData.itemsAdvancedV1}
            championName={page.championName}
          />
        </main>
      </div>
    </GuidePatchProvider>
  );
}
