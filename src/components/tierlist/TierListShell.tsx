"use client";

import { useMemo, useState } from "react";
import type { TierSnapshot } from "@/types/tierlist";
import type { RoleRoute } from "@/lib/roles";
import { getRoleData } from "@/lib/roles";
import { filterChamps } from "@/lib/filterChamps";
import { SiteHeader } from "@/components/tierlist/SiteHeader";
import { TierListHero } from "@/components/tierlist/TierListHero";
import { RolePicker } from "@/components/tierlist/RolePicker";
import { SpecialTierSections } from "@/components/tierlist/SpecialTierSections";
import { StandardTierRow } from "@/components/tierlist/StandardTierRow";

const PAGE_BG = "#0b0e13";

export function TierListShell({
  snapshot,
  activeRole,
}: {
  snapshot: TierSnapshot;
  activeRole: RoleRoute;
}) {
  const [query, setQuery] = useState("");

  const roleData = getRoleData(snapshot.tierListData.rolesData, activeRole);

  const filtered = useMemo(() => {
    if (!roleData) return null;
    return {
      op: filterChamps(roleData.op, query),
      lowElo: filterChamps(roleData.lowElo, query),
      bans: filterChamps(roleData.bans, query),
      s: filterChamps(roleData.s, query),
      a: filterChamps(roleData.a, query),
      b: filterChamps(roleData.b, query),
      c: filterChamps(roleData.c, query),
    };
  }, [roleData, query]);

  if (!roleData || !filtered) {
    return (
      <div className="min-h-screen p-8 text-center text-[#e8e8e8]">
        No tier data for this role.
      </div>
    );
  }

  const atlas = snapshot.championAtlasData;
  const map = snapshot.champNameToIdMap;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      <SiteHeader
        searchQuery={query}
        onSearchChange={setQuery}
        tierListHref={`/tierlist/${activeRole}`}
      />

      <div
        data-name="TL_PageTierListV2"
        className="min-h-screen w-full"
        style={{
          backgroundColor: PAGE_BG,
          fontFamily:
            "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <section className="w-full" style={{ backgroundColor: PAGE_BG }}>
          <TierListHero patch={snapshot.tierListData.patch} />
          <div className="flex justify-center pb-3 pt-1">
            <RolePicker activeRole={activeRole} variant="hero" />
          </div>

          <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-10 px-5 pb-24 pt-4 xl:px-10">
            <div
              role="region"
              aria-label="Featured tiers"
              className="mx-auto w-full max-w-[940px] shrink-0"
            >
              <SpecialTierSections
                op={filtered.op}
                lowElo={filtered.lowElo}
                bans={filtered.bans}
                atlas={atlas}
                champNameToIdMap={map}
                activeRole={activeRole}
              />
            </div>

            <div className="flex min-w-0 w-full flex-col items-center gap-8">
              <StandardTierRow
                tier="s"
                entries={filtered.s}
                atlas={atlas}
                champNameToIdMap={map}
                activeRole={activeRole}
              />
              <StandardTierRow
                tier="a"
                entries={filtered.a}
                atlas={atlas}
                champNameToIdMap={map}
                activeRole={activeRole}
              />
              <StandardTierRow
                tier="b"
                entries={filtered.b}
                atlas={atlas}
                champNameToIdMap={map}
                activeRole={activeRole}
              />
              <StandardTierRow
                tier="c"
                entries={filtered.c}
                atlas={atlas}
                champNameToIdMap={map}
                activeRole={activeRole}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
