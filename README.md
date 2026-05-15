# Picker Tier Lists

Personal League of Legends tier list viewer modeled after Skill-Capped’s tier list UX (dark chrome, OP / Low Elo / Bans strips, S–C grids, sprite atlas portraits).

## Requirements

- Node 20+
- npm

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run sync-tierlist -- [role]` | Fetch Skill-Capped HTML (`role` defaults to `mid`) and regenerate [`src/data/tierlist.snapshot.json`](src/data/tierlist.snapshot.json) |

### Refreshing tier data

Tier assignments ship as a **checked-in snapshot** so the UI stays fast and stable.

1. **Optional automation**: `npm run sync-tierlist -- [role]` downloads that tier URL into `_tier_raw.html`, then [`scripts/extract-snapshot.mjs`](scripts/extract-snapshot.mjs) parses embedded Next.js payload fields (`tierListData`, `championAtlasData`, `champNameToIdMap`) into `src/data/tierlist.snapshot.json`.

2. **Manual fallback**: Save “View Source” HTML as `_tier_raw.html` in the project root and run `node scripts/extract-snapshot.mjs`.

Respect Skill-Capped’s [Terms of Use](https://www.skill-capped.com/) and avoid aggressive polling; refresh when patches land or when you deliberately want newer ratings.

### Attribution / branding

Sprite atlas and role icons may load from Skill-Capped / ImageKit URLs. This app is **not** affiliated with Skill-Capped—layout mirrors their tier list for personal drafting workflows.

## Routes

- `/` → redirects to `/tierlist/mid`
- `/tierlist/[role]` → `top` \| `jungle` \| `mid` \| `adc` \| `support`

Champion detail pages are planned later; portrait tiles currently no-op (`preventDefault` on `#`).
