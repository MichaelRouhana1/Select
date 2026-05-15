"use client";

import type { ReactNode } from "react";
import { ScAbilityInline } from "@/components/guide/inline/ScAbilityInline";
import { ScChampionInline } from "@/components/guide/inline/ScChampionInline";
import { ScItemInline } from "@/components/guide/inline/ScItemInline";
import { ScMonsterCampInline } from "@/components/guide/inline/ScMonsterCampInline";
import { ScRuneInline } from "@/components/guide/inline/ScRuneInline";
import { ScSummonerInline } from "@/components/guide/inline/ScSummonerInline";

function decodeEntities(text: string) {
  return text
    .replace(/&#x20;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\\n/g, "\n");
}

function parseInlineMdx(source: string): ReactNode[] {
  const text = decodeEntities(source);
  const tagRe =
    /<Sc(\w+)([^>]*)\/>|<span className="tip-highlight">([\s\S]*?)<\/span>/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = tagRe.exec(text))) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    if (m[3] !== undefined) {
      nodes.push(
        <span key={key++} className="font-semibold text-[#E8C34B]">
          {m[3]}
        </span>,
      );
    } else {
      const tag = m[1];
      const attrs = m[2];
      const read = (name: string) => {
        const am = attrs.match(new RegExp(`${name}=\\\\"([^\\\\"]+)\\\\"`));
        return am?.[1] ?? attrs.match(new RegExp(`${name}="([^"]+)"`))?.[1];
      };
      switch (tag) {
        case "ChampionInline":
          nodes.push(
            <ScChampionInline key={key++} championId={read("championId") ?? ""} />,
          );
          break;
        case "RuneInline":
          nodes.push(
            <ScRuneInline
              key={key++}
              runeIdentifier={read("runeIdentifier") ?? ""}
            />,
          );
          break;
        case "ItemInline":
          nodes.push(
            <ScItemInline key={key++} itemName={read("itemName") ?? ""} />,
          );
          break;
        case "AbilityInline_v2":
          nodes.push(
            <ScAbilityInline key={key++} spellKey={read("spellKey") ?? "Q"} />,
          );
          break;
        case "MonsterCampInline":
          nodes.push(
            <ScMonsterCampInline key={key++} camp={read("camp") ?? ""} />,
          );
          break;
        case "SummonerInline":
          nodes.push(
            <ScSummonerInline
              key={key++}
              summonerIdentifier={read("summonerIdentifier") ?? ""}
            />,
          );
          break;
        default:
          break;
      }
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderBlocks(source: string): ReactNode {
  const lines = decodeEntities(source).split(/\n/);
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul
        key={key++}
        className="my-2 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#c8cdd3]"
      >
        {list.map((item, i) => (
          <li key={i}>{parseInlineMdx(item.replace(/^\*\s*/, ""))}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("* ")) {
      list.push(trimmed);
      continue;
    }
    flushList();
    blocks.push(
      <p key={key++} className="mb-2 text-[13px] leading-relaxed text-[#c8cdd3]">
        {parseInlineMdx(trimmed)}
      </p>,
    );
  }
  flushList();
  return <>{blocks}</>;
}

export function MdxLite({ source }: { source: string }) {
  if (!source || source.startsWith("$")) {
    return null;
  }
  return <div className="mdx-lite">{renderBlocks(source)}</div>;
}
