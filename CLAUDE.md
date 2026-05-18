# CLAUDE.md

LLM-facing index for `scarletmu.com` — ScarletMu's personal homepage. 8-bit RPG visual metaphor. Next.js 16 App Router + Tailwind v4 + RSC/ISR, Dockerized, deployed to a self-hosted VDS behind a shared Caddy reverse proxy. Production runtime configuration lives in a sibling [`Self-Deploy`](../Self-Deploy/) repository; this repo is only the image factory.

## Repo layout

| Path | Role |
|---|---|
| `app/` | App Router pages, `globals.css` (Tailwind v4 `@theme` tokens) |
| `components/primitives/` | Win / Chip / StatBar / ImgPh / Dotted / Caret / Arrow / PixelButton |
| `components/client/` | `'use client'` islands: PlayTime, Typewriter, BgmToggle |
| `components/sections/` | 8 page sections matching `variant-a.jsx` (on `assets` branch) |
| `lib/` | `content.ts` (YAML+Zod), `github.ts` (GraphQL + PRNG fallback), `weather.ts` (Open-Meteo), `prng.ts`, `cn.ts` |
| `content/*.example.yml` | Tracked templates with safe placeholder data — schema in `lib/content.ts` |
| `content/*.yml` | **Gitignored** (real personal data). On VDS, bind-mounted from the content path configured in `.env` (`CONTENT_DIR`). Loader prefers real, falls back to example so fresh clones run without setup. **Exception:** `content/itasha.yml` has no `.example.yml` fallback — missing or short → gallery fills with `CLOSED` warning-tape placeholders. |
| `public/media/` | Gitignored. On VDS, bind-mounted from the media path configured in `.env` (`MEDIA_DIR`) |
| `deploy/` | **Not in the repo.** Entire directory is gitignored. Holds a local pointer to the sibling `Self-Deploy/services/scmlab/` checkout, which is where the runtime Compose / Caddy / release scripts actually live. |
| `scripts/build.sh` | Image factory entry point. `scripts/build.sh v0.1.0` produces `scarletmu-home:v0.1.0` locally; nothing here ships to the VDS. |
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

This repo only produces the image. Everything from "image exists locally" onward — Compose file, Caddy reverse-proxy fragment, ssh-based image shipping, runtime `.env`, bind-mounted real content/media — lives in the sibling `Self-Deploy/services/scmlab/` repository.

Shape of the runtime: a shared Caddy container (owned by `Self-Deploy/infra/caddy/`) terminates TLS on 443 and reverse-proxies `scmlab-web:3000` over a shared Docker network. The SCMLab container binds no host port. Media originals + real `content/*.yml` live on the VDS under `/opt/scmlab/{media,content}` and are bind-mounted read-only into the container.

Release loop:

```bash
# 1. Build (this repo)
scripts/build.sh v0.1.0

# 2. Ship + restart (Self-Deploy repo)
cd ../Self-Deploy/services/scmlab
IMAGE_TAG=v0.1.0 scripts/release.sh
```

See `Self-Deploy/services/scmlab/docs/deployment.md` for the full procedure, including first-time VDS setup and content/media updates that don't require a release.

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
