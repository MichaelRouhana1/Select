"use client";

import type { GuideSnapshot } from "@/types/guide";
import { useGuidePatch } from "@/contexts/GuidePatchContext";
import { itemIconUrl } from "@/lib/ddragonAssets";
import { SectionDivider } from "@/components/guide/SectionDivider";
import { MdxLite } from "@/lib/parseMdxLite";

type AdvLayout = {
  layoutId?: string;
  title?: string;
  elements?: Array<{ type?: string; itemId?: string }>;
  content?: { content?: string; contentTitle?: string };
};

export function GuideAdvancedSection({
  itemsAdvanced,
  championName,
}: {
  itemsAdvanced: GuideSnapshot["buildData"]["itemsAdvancedV1"];
  championName: string;
}) {
  const patch = useGuidePatch();
  if (
    !itemsAdvanced ||
    typeof itemsAdvanced !== "object" ||
    !("layouts" in itemsAdvanced)
  )
    return null;

  const layouts = (itemsAdvanced as { layouts: AdvLayout[] }).layouts;
  if (!layouts?.length) return null;

  return (
    <section id="advanced-builds" className="scroll-mt-28">
      <SectionDivider title={`${championName} Advanced Builds`.toUpperCase()} />
      <div className="space-y-10">
        {layouts.map((layout) => (
          <article
            key={layout.layoutId ?? layout.title}
            className="grid gap-8 rounded-xl border border-[#252d38] bg-[#12171c] p-6 lg:grid-cols-[260px_minmax(0,1fr)]"
          >
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="flex items-center gap-2 pb-6 font-display text-lg font-bold italic capitalize text-[#cfd4dc]">
                ★ <span>{layout.title ?? "Build"}</span>
              </h3>
              <div className="grid max-w-[220px] grid-cols-3 gap-8">
                {(layout.elements ?? [])
                  .filter((el) => el.type === "item" && el.itemId)
                  .map((el) => (
                    <img
                      key={el.itemId}
                      src={itemIconUrl(String(el.itemId), patch)}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-md border border-[#2f3845] bg-black/30"
                    />
                  ))}
              </div>
            </div>
            <div className="min-h-0 text-[14px] leading-relaxed text-[#b8c0c9] lg:border-l lg:border-[#1e252d] lg:pl-8">
              {layout.content?.contentTitle ? (
                <p className="mb-4 font-display text-lg font-semibold capitalize text-[#7c8592]">
                  {layout.content.contentTitle}
                </p>
              ) : null}
              {(layout.content?.content ?? "").trim().startsWith("$") ||
              !(layout.content?.content ?? "").trim() ? null : (
                <MdxLite source={layout.content?.content ?? ""} />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
