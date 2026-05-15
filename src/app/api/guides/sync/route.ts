import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  GuideParseError,
  parseGuideFromHtml,
} from "@/lib/skillCappedGuideParser";

function browserFetchHeaders(): HeadersInit {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.skill-capped.com/",
    "Cache-Control": "no-cache",
  };
}

export async function POST(request: Request) {
  const secret = process.env.GUIDE_SYNC_SECRET?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !secret) {
    return NextResponse.json(
      { error: "GUIDE_SYNC_SECRET is not configured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization") ?? "";
  const token =
    auth.startsWith("Bearer ") ? auth.slice(7) : request.headers.get("x-api-key");
  const bypassAuthDev = !isProd && !secret;
  const authOk =
    bypassAuthDev || Boolean(secret && token && token === secret);
  if (!authOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { champion?: string; role?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const champion = body.champion?.toLowerCase()?.replace(/[^a-z0-9]/g, "");
  const role = body.role?.toLowerCase()?.replace(/[^a-z0-9]/g, "");
  if (!champion || !role) {
    return NextResponse.json(
      { error: 'Body must include "champion" and "role" slugs' },
      { status: 400 },
    );
  }

  const url = `https://www.skill-capped.com/lol/guides/builds/${champion}/${role}`;
  const res = await fetch(url, { headers: browserFetchHeaders() });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream fetch failed", status: res.status },
      { status: 502 },
    );
  }
  const html = await res.text();

  try {
    const snapshot = parseGuideFromHtml(html, champion, role);
    const guidesDir = path.join(process.cwd(), "src", "data", "guides");
    fs.mkdirSync(guidesDir, { recursive: true });
    const outFile = path.join(guidesDir, `${champion}-${role}.json`);
    fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2));

    const reg = spawnSync(process.execPath, ["scripts/rebuild-guide-registry.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    if (reg.status !== 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Wrote snapshot but registry rebuild failed",
          stderr: reg.stderr,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      key: `${champion}-${role}`,
      path: path.relative(process.cwd(), outFile).replace(/\\/g, "/"),
    });
  } catch (err) {
    if (err instanceof GuideParseError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    throw err;
  }
}
