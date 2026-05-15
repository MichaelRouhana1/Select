import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideSnapshot, listGuideKeys } from "@/data/guideRegistry";
import { GuideShell } from "@/components/guide/GuideShell";
import { guideStorageKey, parseBuildRoute } from "@/lib/guides";
import { isRoleRoute, type RoleRoute } from "@/lib/roles";

type Props = {
  params: Promise<{ champion: string; rest?: string[] }>;
};

export function generateStaticParams() {
  return listGuideKeys().map((key) => {
    const [champion, role] = key.split("-");
    return { champion, rest: [role] };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { champion, rest } = await params;
  const parsed = parseBuildRoute(champion, rest);
  if (!parsed) return { title: "Build" };
  const snap = getGuideSnapshot(
    guideStorageKey(parsed.championSlug, parsed.roleSlug),
  );
  if (!snap) return { title: "Build" };
  const page = snap.page;
  return {
    title: `${page.championName} ${page.roleDisplay} Build`,
    description: `Patch ${page.patch} — ${page.championName} ${page.roleDisplay} build with runes, items, and Challenger insights.`,
  };
}

export default async function ChampionBuildPage({ params }: Props) {
  const { champion, rest } = await params;
  const parsed = parseBuildRoute(champion, rest);
  if (!parsed || !isRoleRoute(parsed.roleSlug)) notFound();

  const key = guideStorageKey(parsed.championSlug, parsed.roleSlug);
  const snapshot = getGuideSnapshot(key);
  if (!snapshot) notFound();

  const activeRole = parsed.roleSlug as RoleRoute;
  return (
    <GuideShell
      snapshot={snapshot}
      activeRole={activeRole}
      tierListHref={`/tierlist/${activeRole}`}
    />
  );
}
