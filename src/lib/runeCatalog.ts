/** Perk id → display name + ddragon icon path (subset; fallback uses id). */
export const RUNE_BY_ID: Record<
  number,
  { name: string; icon: string; style?: string }
> = {
  9923: {
    name: "Hail of Blades",
    icon: "Styles/Domination/HailOfBlades/HailOfBlades.png",
    style: "Domination",
  },
  8143: {
    name: "Treasure Hunter",
    icon: "Styles/Domination/TreasureHunter/TreasureHunter.png",
    style: "Domination",
  },
  8137: {
    name: "Sudden Impact",
    icon: "Styles/Domination/SuddenImpact/SuddenImpact.png",
    style: "Domination",
  },
  8135: {
    name: "Sixth Sense",
    icon: "Styles/Domination/SixthSense/SixthSense.png",
    style: "Domination",
  },
  8138: {
    name: "Eyeball Collection",
    icon: "Styles/Domination/EyeballCollection/EyeballCollection.png",
    style: "Domination",
  },
  8304: {
    name: "Magical Footwear",
    icon: "Styles/Inspiration/MagicalFootwear/MagicalFootwear.png",
    style: "Inspiration",
  },
  8410: {
    name: "Approach Velocity",
    icon: "Styles/Inspiration/ApproachVelocity/ApproachVelocity.png",
    style: "Inspiration",
  },
  8233: {
    name: "Gathering Storm",
    icon: "Styles/Sorcery/GatheringStorm/GatheringStorm.png",
    style: "Sorcery",
  },
  8236: {
    name: "Absolute Focus",
    icon: "Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
    style: "Sorcery",
  },
  5008: {
    name: "Adaptive Force",
    icon: "StatMods/StatModsAdaptiveForceIcon.png",
  },
  5005: {
    name: "Attack Speed",
    icon: "StatMods/StatModsAttackSpeedIcon.png",
  },
  5001: {
    name: "Health",
    icon: "StatMods/StatModsHealthPlusIcon.png",
  },
};

export function getRuneMeta(id: number) {
  return (
    RUNE_BY_ID[id] ?? {
      name: `Rune ${id}`,
      icon: "StatMods/StatModsAdaptiveForceIcon.png",
    }
  );
}
