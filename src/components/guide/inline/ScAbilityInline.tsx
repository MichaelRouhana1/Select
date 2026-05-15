export function ScAbilityInline({ spellKey }: { spellKey: string }) {
  const key = spellKey.toUpperCase();
  return (
    <span className="mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded bg-[#252d38] px-1 text-[11px] font-bold text-[#e8c34b]">
      {key}
    </span>
  );
}
