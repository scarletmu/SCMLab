# CLAUDE.md

LLM-facing index for `scarletmu.com` — ScarletMu's personal homepage. 8-bit RPG visual metaphor. Next.js 16 App Router + Tailwind v4 + RSC/ISR, Dockerized, deployed to a self-hosted VDS behind Nginx.

## Repo layout

| Path | Role |
|---|---|
| `app/` | App Router pages, `globals.css` (Tailwind v4 `@theme` tokens) |
| `components/primitives/` | Win / Chip / StatBar / ImgPh / Dotted / Caret / Arrow / PixelButton |
| `components/client/` | `'use client'` islands: PlayTime, Typewriter, BgmToggle |
| `components/sections/` | 8 page sections matching `variant-a.jsx` (on `assets` branch) |
| `lib/` | `content.ts` (YAML+Zod), `github.ts` (GraphQL + PRNG fallback), `weather.ts` (Open-Meteo), `prng.ts`, `cn.ts` |
| `content/*.example.yml` | Tracked templates with safe placeholder data — schema in `lib/content.ts` |
| `content/*.yml` | **Gitignored** (real personal data). On VDS, bind-mounted from the content path configured in `.env` (`CONTENT_DIR`). Loader prefers real, falls back to example so fresh clones run without setup. |
| `public/media/` | Gitignored. On VDS, bind-mounted from the media path configured in `.env` (`MEDIA_DIR`) |
| `deploy/` | **Not in the repo.** Entire directory is gitignored — runbook + Nginx config live locally and on the VDS only. |
| `docs/` | Architecture, design constraints, iteration history |
| `_design/` | **Not on `main`.** Lives on the `assets` orphan branch. See [Design archive](#design-archive) below. |

## Read before changing visuals

[`docs/design-constraints.md`](./docs/design-constraints.md) — color tokens, typography, animation rules, section-by-section layout specs, interaction timings, the "single hue / no rounding / no blur / stepped animations" hard rules. **This file is self-sufficient** for normal work; only fetch the `assets` branch if you need the original JSX reference layouts or screenshots.

## Read before changing architecture

[`docs/architecture.md`](./docs/architecture.md) — locked-in stack decisions and the v1-out-of-scope list (WakaTime, Last.fm, `/admin`, Postgres, mobile, CI/CD, MDX blog — don't add unprompted).

## Conventions

- **Tailwind v4 only**: tokens live in `app/globals.css` under `@theme`. There is no `tailwind.config.ts` and there shouldn't be.
- **Content edits**: edit `content/*.yml` locally (gitignored, real data). When adding a new field, also update the matching `*.example.yml` so fresh clones and the production image still parse. Zod validates at load; build fails on schema violation.
- **Data fetching**: server-side `fetch(..., { next: { revalidate } })`. No client-side data fetching for the static page.
- **Client islands**: only `components/client/*` carries `'use client'`. Don't promote anything else without a concrete reason (browser API, time tick, audio).
- **Deploy target is the user's VDS**. Do not suggest Vercel / Cloudflare Pages / other PaaS unless asked.
- **The design archive lives on the `assets` orphan branch**. See [Design archive](#design-archive) below for access. The working spec lives in `docs/design-constraints.md` on `main`.

## Deploy

The `deploy/` directory is not in the repo (gitignored end-to-end). Shape of the setup: rsync to a VDS, `docker compose up -d --build`, Nginx reverse-proxies `127.0.0.1:3000`, certbot for TLS. Media originals + real content live outside the container and are bind-mounted in via `MEDIA_DIR` / `CONTENT_DIR` from `.env`. The actual runbook + Nginx server block live locally on the site operator's machine and on the VDS.

## Iteration history

- [`docs/iterations/v1-initial-build.md`](./docs/iterations/v1-initial-build.md) — original 2026-05-16 plan (in Chinese; paths refer to the pre-flatten `scarletmu-home/` subdir).

## User-facing docs

[`README.md`](./README.md) is the human-readable quick-start. This file (`CLAUDE.md`, also reachable as `AGENTS.md`) is the agent-facing index.

## Design archive

The original `claude-design` output (`variant-a.jsx` reference layout, `data.jsx` placeholder data, `styles.css` original tokens, `screenshots/`, full handoff `README.md`) is **not on `main`**. It lives on the `assets` orphan branch — kept in version control without inflating the main branch tree.

You usually do not need it: [`docs/design-constraints.md`](./docs/design-constraints.md) is the self-sufficient working spec. Fetch the archive only when you need the original JSX layout as a 1:1 visual reference or to verify the implementation against the original screenshots.

```bash
# Mount the archive as a sibling directory (recommended)
git fetch origin assets
git worktree add ../scmlab-design assets
# → original files now at ../scmlab-design/_design/

# Or, browse on GitHub once pushed:
#   https://github.com/<owner>/<repo>/tree/assets/_design

# To remove the worktree when done:
git worktree remove ../scmlab-design
```
