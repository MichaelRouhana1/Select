import { tierSnapshot } from "@/data/tierSnapshot";
import { championSpriteStyle } from "@/lib/championSprite";

export function ScChampionInline({ championId }: { championId: string }) {
  const atlas = tierSnapshot.championAtlasData;
  const id = championId.replace(/\s/g, "");

  return (
    <span
      className="mx-0.5 inline-flex items-center gap-1 align-middle"
      title={championId}
    >
      <span
        className="inline-block shrink-0 overflow-hidden rounded-full"
        style={{
          width: 18,
          height: 18,
          ...championSpriteStyle(atlas, id, 18),
        }}
      />
      <span className="font-semibold text-[#e8c34b]">{championId}</span>
    </span>
  );
}
