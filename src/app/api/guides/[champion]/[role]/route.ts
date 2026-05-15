import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(
  _request: Request,
  context: { params: Promise<{ champion: string; role: string }> },
) {
  const { champion, role } = await context.params;
  const safeChamp = champion.toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeRole = role.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!safeChamp || !safeRole || safeChamp !== champion || safeRole !== role) {
    return NextResponse.json({ error: "Invalid champion or role" }, { status: 400 });
  }

  const file = path.join(
    process.cwd(),
    "src",
    "data",
    "guides",
    `${safeChamp}-${safeRole}.json`,
  );
  try {
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch {
    return NextResponse.json(
      { error: "Guide snapshot not found. Run POST /api/guides/sync first." },
      { status: 404 },
    );
  }
}
