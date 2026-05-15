export function TierListHero({ patch }: { patch: string }) {
  return (
    <div className="flex flex-col items-center px-4 pb-2 pt-10">
      <div
        id="tier-list-section"
        className="relative scroll-mt-[116px] pb-2 pt-0"
      >
        <div className="flex flex-col items-center">
          <div className="mb-1 w-full px-[2px] text-center">
            <span
              className="inline-block font-semibold uppercase tracking-[0.08em] text-[rgb(232,232,232)]"
              style={{
                fontSize: "clamp(10px, 1vw, 13px)",
                letterSpacing: "0.08em",
              }}
            >
              SKILL CAPPED
            </span>
          </div>
          <h2
            className="font-display whitespace-nowrap text-center uppercase italic text-[#E8C34B]"
            style={{
              fontWeight: 700,
              fontSize: "clamp(52px, 7.5vw, 104px)",
              lineHeight: 0.72,
              marginTop: 0,
              letterSpacing: "0.02em",
              textShadow: "0 2px 40px rgba(232, 195, 75, 0.08)",
            }}
          >
            TIER LIST
          </h2>
          <p
            className="mt-3 text-center uppercase leading-none tracking-[0.04em] text-[rgb(232,232,232)]"
            style={{
              fontSize: "clamp(18px, 2.6vw, 32px)",
            }}
          >
            <span style={{ fontWeight: 400, opacity: 0.95 }}>PATCH </span>
            <span style={{ fontWeight: 700 }}>{patch}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
