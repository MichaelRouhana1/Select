import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tierSnapshot } from "@/data/tierSnapshot";
import { TierListShell } from "@/components/tierlist/TierListShell";
import {
  getRoleLabel,
  isRoleRoute,
  type RoleRoute,
} from "@/lib/roles";

type Props = {
  params: Promise<{ role: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  if (!isRoleRoute(role)) {
    return { title: "Tier list" };
  }
  const label = getRoleLabel(role as RoleRoute);
  return {
    title: `${label} Tier List`,
    description: `Patch ${tierSnapshot.tierListData.patch} — ${label} lane tier list.`,
  };
}

export default async function TierListRolePage({ params }: Props) {
  const { role } = await params;
  if (!isRoleRoute(role)) notFound();

  return <TierListShell snapshot={tierSnapshot} activeRole={role} />;
}
