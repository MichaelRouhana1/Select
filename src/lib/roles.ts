import type { RoleTierData } from "@/types/tierlist";

export const ROLE_ROUTES = [
  "top",
  "jungle",
  "mid",
  "adc",
  "support",
] as const;

export type RoleRoute = (typeof ROLE_ROUTES)[number];

const ROUTE_TO_DATA: Record<RoleRoute, string> = {
  top: "TOP",
  jungle: "JUNGLE",
  mid: "MID",
  adc: "ADC",
  support: "SUPPORT",
};

export function isRoleRoute(s: string): s is RoleRoute {
  return (ROLE_ROUTES as readonly string[]).includes(s);
}

export function dataRoleFromRoute(route: RoleRoute): string {
  return ROUTE_TO_DATA[route];
}

export function getRoleLabel(route: RoleRoute): string {
  const labels: Record<RoleRoute, string> = {
    top: "Top",
    jungle: "Jungle",
    mid: "Mid",
    adc: "ADC",
    support: "Support",
  };
  return labels[route];
}

export function getRoleData(
  rolesData: Record<string, RoleTierData>,
  route: RoleRoute,
): RoleTierData | undefined {
  return rolesData[dataRoleFromRoute(route)];
}
