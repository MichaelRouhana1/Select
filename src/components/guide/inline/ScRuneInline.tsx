import { runeIconUrl } from "@/lib/ddragonAssets";

const RUNE_ICONS: Record<string, string> = {
  "Hail of Blades": "Styles/Domination/HailOfBlades/HailOfBlades.png",
  "Approach Velocity": "Styles/Inspiration/ApproachVelocity/ApproachVelocity.png",
  "Magical Footwear": "Styles/Inspiration/MagicalFootwear/MagicalFootwear.png",
  "Gathering Storm": "Styles/Sorcery/GatheringStorm/GatheringStorm.png",
  "Absolute Focus": "Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
};

export function ScRuneInline({ runeIdentifier }: { runeIdentifier: string }) {
  const icon = RUNE_ICONS[runeIdentifier];
  return (
    <span
      className="mx-0.5 inline-flex items-center gap-1 align-middle"
      title={runeIdentifier}
    >
      {icon ? (
        <img
          src={runeIconUrl(icon)}
          alt=""
          width={18}
          height={18}
          className="rounded-full"
        />
      ) : null}
      <span className="font-semibold text-[#e8c34b]">{runeIdentifier}</span>
    </span>
  );
}
