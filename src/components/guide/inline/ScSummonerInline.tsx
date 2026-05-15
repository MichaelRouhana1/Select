"use client";

import { summonerSpellUrl } from "@/lib/ddragonAssets";
import { useGuidePatch } from "@/contexts/GuidePatchContext";

export function ScSummonerInline({
  summonerIdentifier,
}: {
  summonerIdentifier: string;
}) {
  const patch = useGuidePatch();
  return (
    <span className="mx-0.5 inline-flex items-center gap-1 align-middle">
      <img
        src={summonerSpellUrl(summonerIdentifier, patch)}
        alt=""
        width={18}
        height={18}
        className="rounded"
      />
      <span className="font-semibold text-[#e8c34b]">{summonerIdentifier}</span>
    </span>
  );
}
