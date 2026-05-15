interface SectionDividerProps {
  title: string;
  className?: string;
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  return (
    <div
      className={`relative my-12 flex flex-col items-center px-4 ${className}`}
      role="separator"
      aria-label={title}
    >
      <div className="flex w-full items-center gap-4">
        <span
          className="h-[1px] flex-1"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #d4af37 45%, transparent 100%)",
          }}
        />
        <div
          className="rounded-sm px-8 py-1.5"
          style={{
            border: "1px solid rgba(212,175,55,0.45)",
            background:
              "linear-gradient(180deg, rgba(30,33,41,0.95) 0%, rgba(12,14,18,0.98) 100%)",
            boxShadow: "0 0 20px rgba(212,175,55,0.12)",
          }}
        >
          <span className="font-display whitespace-nowrap text-[13px] font-bold italic tracking-[0.2em] text-[#E8C34B]">
            {title}
          </span>
        </div>
        <span
          className="h-[1px] flex-1"
          style={{
            background:
              "linear-gradient(270deg, transparent 0%, #d4af37 45%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
