const LABELS: Record<string, string> = {
  raptors: "Raptors",
  red: "Red Buff",
  blue: "Blue Buff",
  krugs: "Krugs",
  wolves: "Wolves",
  gromp: "Gromp",
};

export function ScMonsterCampInline({ camp }: { camp: string }) {
  const label = LABELS[camp.toLowerCase()] ?? camp;
  return <span className="font-semibold text-[#7eb8ff]">{label}</span>;
}
