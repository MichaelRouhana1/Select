import { runeIconUrl, runeStyleIconUrl } from "@/lib/ddragonAssets";
import { getRuneMeta } from "@/lib/runeCatalog";

export function RuneIcon({
  runeId,
  size = 36,
  highlight,
}: {
  runeId: number;
  size?: number;
  highlight?: "primary" | "secondary" | "shard";
}) {
  const meta = getRuneMeta(runeId);
  const border =
    highlight === "primary"
      ? "#d44d4d"
      : highlight === "secondary"
        ? "#d4af37"
        : "#2a3441";

  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-solid bg-[#0d1117]"
      style={{ width: size, height: size, borderColor: border }}
      title={meta.name}
    >
      <img
        src={runeIconUrl(meta.icon)}
        alt={meta.name}
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        className="rounded-full"
      />
    </div>
  );
}

export function RuneTreeIcon({ tree, size = 28 }: { tree: string; size?: number }) {
  return (
    <img
      src={runeStyleIconUrl(tree)}
      alt={tree}
      width={size}
      height={size}
      className="rounded"
    />
  );
}
