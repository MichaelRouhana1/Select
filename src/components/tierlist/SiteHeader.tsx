"use client";

const GOLD = "#E8C34B";

type SiteHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  tierListHref: string;
};

export function SiteHeader({
  searchQuery,
  onSearchChange,
  tierListHref,
}: SiteHeaderProps) {
  return (
    <header data-name="Header Production" className="sticky top-0 z-[300]">
      <nav
        className="flex h-[48px] items-center"
        style={{
          backgroundColor: "#0d1117",
          borderBottom: "1px solid #1e252d",
        }}
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
            <div className="h-5 w-px" style={{ backgroundColor: "#252d38" }} />
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 leading-normal text-[11px] font-semibold uppercase tracking-[0.05em]"
              style={{
                color: "#8b919a",
                transition: "color 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                fontFamily: "inherit",
              }}
            >
              LEAGUE OF LEGENDS
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
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
                className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.05em]"
                style={{
                  color: "#8b919a",
                  transition: "color 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                  fontFamily: "inherit",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <nav
        className="flex min-h-[48px] items-center py-2 md:py-0"
        style={{
          backgroundColor: "#14181f",
          borderBottom: "1px solid #1e252d",
        }}
      >
        <div className="relative mx-auto flex w-full max-w-[1320px] flex-col items-stretch gap-3 px-8 md:flex-row md:items-center">
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-3"
                style={{ color: "#6b7280" }}
              >
                <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <input
                type="search"
                placeholder="Search champion..."
                aria-label="Search champion"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  borderRadius: 6,
                  fontSize: 13,
                  outline: "none",
                  width: 280,
                  maxWidth: "100%",
                  border: "1px solid #1e252d",
                  backgroundColor: "#0d1117",
                  color: "#e6e6e6",
                  transition:
                    "border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-10 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <a
              href={tierListHref}
              className="relative shrink-0 pb-0.5 text-[12px] font-bold uppercase tracking-[0.05em] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-sm after:bg-[#E8C34B]"
              style={{
                color: GOLD,
              }}
            >
              TIER LIST
            </a>
            <span
              className="shrink-0 cursor-not-allowed pb-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]"
              style={{ color: "#8b919a" }}
              title="Coming later"
            >
              STATS
            </span>
          </div>

          <div
            className="hidden shrink-0 md:block md:w-[280px]"
            aria-hidden
          />
        </div>
      </nav>
    </header>
  );
}
