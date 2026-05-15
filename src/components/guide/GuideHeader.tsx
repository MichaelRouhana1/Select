"use client";

import { ROLE_ROUTES, getRoleLabel, type RoleRoute } from "@/lib/roles";

const GOLD = "#E8C34B";

type GuideHeaderProps = {
  activeRole: RoleRoute;
  tierListHref: string;
  buildHref: (role: RoleRoute) => string;
};

export function GuideHeader({
  activeRole,
  tierListHref,
  buildHref,
}: GuideHeaderProps) {
  const tabs = [
    "QUICK BUILD",
    "FULL BUILD",
    "RUNES",
    "MATCHUPS",
    "SKILL ORDER",
    "BUILDS",
    "ADVANCED BUILDS",
  ] as const;

  return (
    <header data-name="Header Production" className="sticky top-0 z-[300]">
      <nav
        className="flex h-[48px] items-center"
        style={{ backgroundColor: "#0d1117", borderBottom: "1px solid #1e252d" }}
      >
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <a
              href={tierListHref}
              className="whitespace-nowrap text-[14px] font-bold tracking-wider text-white"
              style={{ letterSpacing: "0.08em" }}
            >
              SKILL CAPPED
            </a>
            <div className="h-5 w-px bg-[#252d38]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8b919a]">
              LEAGUE OF LEGENDS
            </span>
          </div>
          <div className="flex items-center gap-5">
            {[
              ["HOW IT WORKS", "https://www.skill-capped.com/lol/how"],
              ["COURSES", "https://www.skill-capped.com/lol/browse/course"],
              ["VIDEOS", "https://www.skill-capped.com/lol/browse/course"],
              [
                "SMURF COMMENTARIES",
                "https://www.skill-capped.com/lol/commentaries",
              ],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8b919a] transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <nav
        className="flex min-h-[48px] items-center"
        style={{ backgroundColor: "#14181f", borderBottom: "1px solid #1e252d" }}
      >
        <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center gap-x-6 gap-y-2 px-8 py-2">
          <a
            href={tierListHref}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8b919a] hover:text-white"
          >
            TIER LIST
          </a>
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8b919a]">
            STATS
          </span>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {tabs.map((tab, i) => (
              <a
                key={tab}
                href={`#${tab.toLowerCase().replace(/\s+/g, "-")}`}
                className={`shrink-0 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] ${
                  i === 1 || i === 2
                    ? "relative text-[#E8C34B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-sm after:bg-[#E8C34B]"
                    : "text-[#8b919a] hover:text-white"
                }`}
                style={i === 1 || i === 2 ? { color: GOLD } : undefined}
              >
                {tab}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div
        className="mx-auto flex w-full max-w-[1320px] gap-2 px-8 py-2"
        style={{ backgroundColor: "#0d1117", borderBottom: "1px solid #1e252d" }}
      >
        {ROLE_ROUTES.map((role) => {
          const href = buildHref(role);
          const external = href.startsWith("http");
          return (
            <a
              key={role}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={`rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                role === activeRole
                  ? "bg-[#252d38] text-[#E8C34B]"
                  : "text-[#8b919a] hover:text-white"
              }`}
            >
              {getRoleLabel(role)}
            </a>
          );
        })}
      </div>
    </header>
  );
}
