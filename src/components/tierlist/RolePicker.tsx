import Link from "next/link";
import type { RoleRoute } from "@/lib/roles";
import { ROLE_ROUTES, getRoleLabel } from "@/lib/roles";
import { ROLE_ICON_URLS } from "@/lib/roleIcons";

const GOLD = "#E8C34B";

export function RolePicker({
  activeRole,
  variant = "hero",
}: {
  activeRole: RoleRoute;
  variant?: "hero" | "dock";
}) {
  const wrap =
    variant === "hero"
      ? "flex items-center gap-2 py-2"
      : "flex items-center gap-1.5 px-4 py-2";

  const outer =
    variant === "hero"
      ? "relative flex flex-col items-center justify-center gap-1.5 rounded-md border-0 bg-transparent p-0 transition-all duration-200"
      : "relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-0 bg-transparent p-0 transition-all duration-200";

  const boxInactive =
    variant === "hero"
      ? "flex items-center justify-center rounded-md transition-all duration-200"
      : "flex items-center justify-center rounded-[5px] transition-all duration-200";

  const imgOuter =
    variant === "hero"
      ? { width: 48, height: 48, borderRadius: 6 }
      : { width: 36, height: 36, borderRadius: 5 };

  const imgInner =
    variant === "hero"
      ? { width: 28, height: 28 }
      : { width: 22, height: 22 };

  const labelCls =
    variant === "hero"
      ? "select-none text-center text-[10px] font-semibold uppercase tracking-[0.04em] transition-colors duration-200"
      : "select-none text-center text-[8px] font-semibold uppercase tracking-[0.04em] transition-colors duration-200";

  const outerWidth = variant === "hero" ? { width: 56 } : { width: 46 };

  return (
    <div className={`flex items-center gap-5 ${wrap}`}>
      {ROLE_ROUTES.map((role) => {
        const active = role === activeRole;
        const inactiveBoxStyle = {
          ...imgOuter,
          backgroundColor: "rgba(149, 127, 87, 0.12)",
          border: "2px solid rgba(149, 127, 87, 0.2)",
          boxShadow: "none",
        };
        const activeBoxStyle = {
          ...imgOuter,
          backgroundColor: "rgba(232, 195, 75, 0.22)",
          border: `2px solid ${GOLD}`,
          boxShadow:
            variant === "hero"
              ? `0 0 14px rgba(232, 195, 75, 0.35)`
              : `0 0 10px rgba(232,195,75,0.35)`,
        };

        const imgFilter = active
          ? { opacity: 1, filter: "brightness(1.15)" }
          : {
              opacity: 0.35,
              filter: "brightness(0.55) saturate(0)",
            };

        const labelStyle = active
          ? { color: GOLD }
          : { color: "rgba(232, 232, 232, 0.38)" };

        return (
          <Link
            key={role}
            href={`/tierlist/${role}`}
            title={getRoleLabel(role)}
            prefetch
            className={outer}
            style={{ ...outerWidth, cursor: "pointer" }}
          >
            <div
              className={boxInactive}
              style={active ? activeBoxStyle : inactiveBoxStyle}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={getRoleLabel(role)}
                src={ROLE_ICON_URLS[role]}
                width={imgInner.width}
                height={imgInner.height}
                className="object-contain transition-all duration-200"
                style={{
                  color: "transparent",
                  ...imgFilter,
                }}
                decoding="async"
              />
            </div>
            <span className={labelCls} style={labelStyle}>
              {role === "adc" ? "ADC" : getRoleLabel(role)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
