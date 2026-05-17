# ScarletMu 个人主页 — v1 实现规划

> **归档说明**：本计划写于 2026-05-16，那时 Next.js 应用嵌套在 `scarletmu-home/` 子目录下。完成后已将其上移到仓库根目录；claude-design 的原始产物已迁出 `main`，归档在 `assets` orphan 分支（见 [CLAUDE.md → Design archive](../../CLAUDE.md#design-archive)）。下文路径中所有 `scarletmu-home/X` 现在均对应根目录 `X`；`_design/...` 现需从 `assets` 分支获取（视觉规则已收束到 [`docs/design-constraints.md`](../design-constraints.md)）。

## Context

仓库初始内容是用 claude-design 产出的高保真设计包（HTML + 内联 React + Babel），不是生产代码。设计文档（README.md 第 14–20 行）明确说明：实际开发要在目标代码库中**重新实现**这些设计，把硬编码的占位数据接入真实后端 API。

目前要做的是把 `variant-a.jsx`（主推版）落地为可部署的 Next.js 应用，跑在自有 VDS 上，并接入真实的 GitHub / 天气数据，自有图床。

**用户已确认的方向**：
- 架构：Next.js 14+ App Router 单体（Route Handlers 做 API）
- 半静态数据：YAML / Markdown + Content Layer（git 版本化 + 编辑器友好）
- 第一版第三方集成：GitHub（repos + contributions）、天气（now.place）
- 图床：VDS 本地目录 `/media/*` + Nginx 直接 serve
- 进程：Docker / docker-compose
- 缓存：Next.js 原生 `fetch` `revalidate`（ISR）
- 环境：已有 Nginx（可加 server block）、已有 Docker、域名 DNS 可控

**第一版不做**：WakaTime（now.code）、Last.fm/Spotify（now.music）、`/admin` 编辑界面、博客系统、用户认证。这些在 `now.code/music/book/car` 字段里用 YAML 手填。

---

## 推荐技术选型

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | Next.js 15 App Router | RSC + Route Handlers + 内置 ISR |
| 样式 | Tailwind CSS v4 + 自定义 plugin | 把 `styles.css` 的 tokens 注入 `@theme` |
| 字体 | `next/font/google` | DotGothic16 / Press Start 2P / VT323，自动 self-host |
| 内容 | YAML 文件 + Zod 校验 + 自己的 `lib/content.ts` | 比 Contentlayer（已停维护）轻；以后要加 MDX 博客再升级 |
| GitHub | `@octokit/graphql` | `user.contributionsCollection` + `repositories(orderBy: STARS)` |
| 天气 | Open-Meteo（无需 key） | 也可换 OpenWeatherMap |
| 图片 | Nginx `/media/*` + `next/image` (`remotePatterns` 指向自域名) | 原图丢 VDS 目录，Next 做 on-the-fly resize |
| 客户端数据 | 默认 RSC 拉取；need-fresh-on-client 的少量字段用 SWR | 减少 hydration 体积 |
| 进程 | Docker 多阶段构建 + docker-compose | `next start` 监听 3000，Nginx 反代 + TLS |
| CI/CD | 暂不做；本地 `docker compose pull && up -d`，后续可加 GitHub Actions | 先打通主流程再自动化 |

---

## 项目结构

```
scarletmu-home/
├── app/
│   ├── layout.tsx              # 全局字体 + paper-bg
│   ├── page.tsx                # 主页（聚合所有 section）
│   ├── globals.css             # tailwind base + 残余的全局规则（scanlines / paper-bg）
│   └── api/
│       └── revalidate/route.ts # （可选）手动触发 revalidate 的 secret 接口
├── components/
│   ├── primitives/             # 设计系统原子组件
│   │   ├── Win.tsx
│   │   ├── Chip.tsx
│   │   ├── StatBar.tsx         # 进度条 / 分段条
│   │   ├── ImgPh.tsx           # 占位图（开发态）
│   │   ├── Dotted.tsx
│   │   └── PixelButton.tsx
│   ├── client/                 # 'use client' 隔离的交互
│   │   ├── PlayTime.tsx        # 每秒 tick
│   │   ├── Typewriter.tsx      # 打字机
│   │   └── BgmToggle.tsx       # WebAudio chiptune
│   ├── sections/
│   │   ├── TopStatusBar.tsx
│   │   ├── TrainerCard.tsx     # 左列
│   │   ├── Contributions.tsx   # 中列 a
│   │   ├── Projects.tsx        # 中列 b
│   │   ├── ItashaGallery.tsx   # 右列 a
│   │   ├── PortraitGallery.tsx # 右列 b
│   │   ├── NowPanel.tsx        # 右列 c
│   │   └── FooterHints.tsx
├── content/
│   ├── character.yml           # 名字 / 职业 / tagline / HP/MP/EXP/LV / GOLD
│   ├── stats.yml               # 6 维属性
│   ├── skills.yml              # 技能 chip 列表
│   ├── equipment.yml           # 装备格
│   ├── itasha/*.yml            # 一张痛车一文件（含图片路径）
│   ├── portraits/*.yml         # 一张人像一文件
│   ├── socials.yml             # GH / TG / X / BLOG
│   ├── now-manual.yml          # book / car 这些手填字段
│   └── log-manual.yml          # 手填活动日志（GitHub event 合并进来）
├── lib/
│   ├── content.ts              # 读 YAML + Zod 校验 + 缓存
│   ├── github.ts               # Octokit GraphQL 包装
│   ├── weather.ts              # Open-Meteo 包装
│   └── prng.ts                 # mulberry32（开发态 fallback 用）
├── public/
│   └── fonts/                  # next/font 自动管，通常无需手放
├── media/                      # ← 这个目录在 VDS 上由 Nginx 直接 serve，仓库内可放空 .gitkeep
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts          # 注入设计 tokens
├── tsconfig.json
└── package.json
```

VDS 上对应目录结构：
```
/srv/<app>/
├── app/                  ← docker-compose.yml 在这
└── media/                ← Nginx alias 指过来；不进容器，bind mount 到 app 容器
```

---

## 分阶段实施

### Phase 0 · Bootstrap（半天）

1. `pnpm create next-app scarletmu-home --typescript --tailwind --app --src-dir=false --eslint`
2. 装依赖：`@octokit/graphql`、`zod`、`js-yaml`、`@types/js-yaml`、`swr`（按需）
3. `next.config.ts`：配置 `images.remotePatterns`（自域名）、`output: 'standalone'`（给 Docker 用）
4. 用 `next/font/google` 加载 DotGothic16 / Press Start 2P / VT323，挂到 `<html className={...}>`
5. 跑 `pnpm dev`，确认空页能打开

**验证**：浏览器看到默认 Next 页 + 字体 100% 自托管。

### Phase 1 · 设计系统移植（1 天）

把 `styles.css` 翻译到 Tailwind：

1. `tailwind.config.ts` → `theme.extend`：
   - `colors`：paper / paper-2 / wash / mid / ink / shadow / ink-soft
   - `fontFamily`：jp / en / mono（对应 var(--font-jp/en/mono)）
   - `boxShadow`：drop / drop-sm / drop-soft（`4px 4px 0 <ink>` 等）
   - `borderWidth`：`b: 2px`、`b-thick: 3px`
2. 自己写一个 Tailwind plugin 注册：
   - `.pixel` 类（关字体平滑、设 image-rendering）
   - `.paper-bg`（双层 radial-gradient 点阵）
   - `.scanlines::after`（repeating-linear-gradient）
   - `.invert-hover:hover`（反色 + jitter）
   - `@keyframes jitter / blink / bob`（在 `@layer base` 里写）
3. 写 `components/primitives/Win.tsx`、`Chip.tsx`、`StatBar.tsx`（含 segmented 模式）、`ImgPh.tsx`、`Dotted.tsx`、`PixelButton.tsx` — 全部用 Tailwind utility，不用 styled-components / CSS module。
4. 做一个 `/dev/primitives` 路由集中展示所有原子组件（开发用，正式发布前删）。

**参考实现**：`data.jsx` 第 84–127 行（StatBar / Win / ImgPh / Dotted），`styles.css` 全文。

**验证**：`/dev/primitives` 里所有组件视觉和原版 HTML 1:1 匹配（同时打开浏览器对比）。

### Phase 2 · 静态布局（1.5 天）

直接用 `content/*.yml` 里的占位数据（先把 `data.jsx` 第 4–81 行的数据原样翻译成 YAML），把 `variant-a.jsx` 拆成 8 个 section 组件。

**关键 1:1 复刻细节**（来自 `variant-a.jsx`）：
- 整张画板 1440×1024，三列网格 `440px 1fr 440px`，外 padding 24，列间 gap 16（line 108）
- 顶部 status bar 两行结构 + grid columns（line 61–105）
- contribution heatmap 26×7 grid，4 阶颜色 paper-2 / wash / mid / ink，每格 1px ink 边框 gap 3px（line 263–284）
- equipment 卡片四角 4×4 像素点（line 192–193）
- footer hint bar 绝对定位（line 386–399）

**客户端组件隔离**：只有 `PlayTime` / `Typewriter` / `BgmToggle` 标 `'use client'`，其他保持 RSC。
- `Typewriter` hook 移植自 `data.jsx` line 130–149
- chiptune 合成器移植自 `data.jsx` line 152–203

**响应式**：原设计是 1440×1024 桌面画板。建议第一版用 `viewport` + CSS scale fit 做兜底，移动端版本作为 Phase 7 单独设计。

**验证**：`pnpm dev` 看到的页面和 `screenshots/01-variant-a-full.png` 像素级一致，打字机/play-time tick/BGM 都工作。

### Phase 3 · Content Layer（半天）

`lib/content.ts`：
```ts
import { readFile, readdir } from 'fs/promises';
import { parse } from 'js-yaml';
import { z } from 'zod';

const CharacterSchema = z.object({
  handle: z.string(),
  class: z.string(),
  lv: z.number(),
  exp: z.number().max(20),
  hpNow: z.number(), hpMax: z.number(),
  mpNow: z.number(), mpMax: z.number(),
  hp: z.string(),  // tagline
  // ...
});

export const getCharacter = cache(async () => {
  const raw = await readFile('content/character.yml', 'utf8');
  return CharacterSchema.parse(parse(raw));
});
// 类似的 getStats / getSkills / getEquipment / getItasha / getPortraits / getSocials
```

- 用 `React.cache()` 包裹，单次 render 内多次调用只读一次
- 失败时 build-time 直接报错（Zod 抛出）— 改 YAML 写错能在 CI/dev 立刻发现
- `itasha/*.yml`、`portraits/*.yml` 用 `readdir` 列目录后并发解析

**验证**：把 `content/character.yml` 的 `lv` 改成 99 → 页面顶部 LV.27 → LV.99。

### Phase 4 · GitHub 集成（1 天）

`lib/github.ts`：
```ts
import { graphql } from '@octokit/graphql';

const gql = graphql.defaults({
  headers: { authorization: `bearer ${process.env.GITHUB_TOKEN}` },
});

export async function getContributions() {
  const data = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` },
    body: JSON.stringify({ query: CONTRIB_QUERY, variables: { login: 'ScarletMu' } }),
    next: { revalidate: 3600 },  // 1h ISR
  }).then(r => r.json());
  // 取最近 26 周 × 7 天，按 contributionCount 映射 4 阶
  return mapContributions(data);
}

export async function getProjects() {
  // 用 fetch 走 next.revalidate，类似上面
  // 取 owner repos，按 stargazerCount desc，取前 6
}
```

GraphQL query：
```graphql
query($login: String!, $from: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from) {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
        totalContributions
      }
      totalPullRequestContributions
    }
    repositories(first: 6, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}, privacy: PUBLIC) {
      nodes { name description stargazerCount forkCount primaryLanguage { name } url pushedAt }
    }
  }
}
```

**注意**：
- GraphQL 一次拿到 contribution + repos + 用户基本信息（节约 rate-limit）
- 把 `pushedAt` 最新的 repo 作为 `LAST PUSH` 显示在 Contributions header
- 4 阶映射：`count === 0 ? 0 : count < 3 ? 1 : count < 8 ? 2 : 3`（按真实分布调）
- 开发态如果没有 token，fallback 到 `lib/prng.ts`（移植 variant-a.jsx 第 16–41 行的 mulberry32），避免本地开发被卡

**Secrets**：`.env.local` 放 `GITHUB_TOKEN`，docker-compose 用 `.env` 注入，VDS 上 `chmod 600`。Token 只需要 `public_repo` + `read:user` 范围。

**验证**：把 `next.revalidate` 临时改成 10，刷新页面能看到真实 ScarletMu 仓库；改回 3600。

### Phase 5 · 天气集成（2 小时）

`lib/weather.ts`：调 Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=31.23&longitude=121.47&current=temperature_2m,weather_code` 返回 `{ temp, condition }`，拼成 `now.place = "上海 · 阴 17°C"`。

`fetch` 的 `next: { revalidate: 1800 }`（30 min）。

经纬度暂时硬编码，放 `content/character.yml` 里。

**验证**：页面 LOC 行显示实时温度。

### Phase 6 · 图床 + 媒体（半天）

仓库结构：
- `content/itasha/2025-07-bigsight.yml` 内含 `image: /media/itasha/2025-07-bigsight.jpg`
- 原图丢 VDS `/srv/<app>/media/itasha/2025-07-bigsight.jpg`
- 不进 git 仓库（开发态 `media/` 目录 .gitignore；本地放几张测试图）

Nginx server block 片段：
```nginx
server {
  server_name scarletmu.dev;
  location /media/ {
    alias /srv/<app>/media/;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
  }
}
```

`next.config.ts`：
```ts
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'scarletmu.dev', pathname: '/media/**' }],
}
```

页面里用 `<Image src="/media/itasha/xxx.jpg" width={400} height={300} />` — Next 在服务端拉原图后转 WebP 输出，配合 `image-rendering: pixelated` 仍然像素感。

**验证**：上传 4 张痛车 + 4 张人像到 VDS `/srv/<app>/media/`，对应 YAML 写好路径，画廊里能看到。

### Phase 7 · 容器化 + 部署（半天）

`Dockerfile`（多阶段）：
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
RUN corepack enable && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
EXPOSE 3000
CMD ["node", "server.js"]
```

`docker-compose.yml`：
```yaml
services:
  web:
    build: .
    restart: unless-stopped
    ports: ["127.0.0.1:3000:3000"]
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - /srv/<app>/media:/app/media:ro  # 如果 next/image 要直接读本地原图
```

部署流程（手动版，先把链路打通）：
1. 本地 `docker build -t scarletmu-home .`
2. `docker save | ssh vds 'docker load'` 或推到自建 registry / GHCR
3. VDS 上 `cd /srv/<app>/app && docker compose up -d`
4. Nginx `sudo nginx -s reload`
5. `certbot --nginx -d scarletmu.dev` 出 TLS

**验证**：浏览器打开 `https://scarletmu.dev` 看到完整页面，play-time 在跑，GitHub 数据真实。

### Phase 8（可选 · 以后再做）

- CI/CD：GitHub Actions on push to main → build image → push GHCR → SSH 到 VDS `docker compose pull && up -d`
- 移动端响应式
- `/admin` + Postgres（如果发现 YAML 手编太烦）
- WakaTime / Last.fm 集成
- 博客 MDX

---

## 关键文件改动清单

| 文件 | 角色 |
|---|---|
| `tailwind.config.ts` | 设计 tokens 注入 theme |
| `app/globals.css` | `.pixel` / `.paper-bg` / `.scanlines` 等不适合 utility 化的样式 |
| `app/layout.tsx` | 字体加载 + `<html className="pixel">` |
| `app/page.tsx` | 编排 8 个 section |
| `components/primitives/*.tsx` | 原子组件 — 参考 `data.jsx:84-127` |
| `components/sections/*.tsx` | 拆自 `variant-a.jsx:58-402` |
| `lib/content.ts` | YAML + Zod 加载 |
| `lib/github.ts` | Octokit GraphQL |
| `lib/weather.ts` | Open-Meteo |
| `content/*.yml` | 半静态数据 — 从 `data.jsx:4-81` 翻译 |
| `next.config.ts` | standalone output + remotePatterns |
| `Dockerfile` + `docker-compose.yml` | 容器化 |

---

## 端到端验证

按 Phase 顺序逐步验证。最终 acceptance：

1. `pnpm dev` 本地开发态：所有 section 和原 HTML 设计 1:1 一致；打字机、play-time、BGM、hover 反色、jitter 抖动都正常
2. 改 `content/character.yml` 的 `lv` / tagline → 刷新立即生效
3. GitHub 数据走真实 API：contribution 热力图分布合理（不是 PRNG）、projects 列表是真实仓库
4. 天气 LOC 实时
5. 放图到 VDS `/srv/<app>/media/itasha/*.jpg` → 痛车画廊正常显示
6. `docker compose up -d` 在 VDS 上跑起来；Nginx 反代到 `https://scarletmu.dev` 出 200
7. `curl https://scarletmu.dev/media/itasha/xxx.jpg` 走 Nginx 直发不走 Next.js
8. Lighthouse Performance > 90、Accessibility > 90

---

## 时间估算

| Phase | 内容 | 估时 |
|---|---|---|
| 0 | Bootstrap | 0.5d |
| 1 | 设计系统 | 1d |
| 2 | 静态布局 | 1.5d |
| 3 | Content Layer | 0.5d |
| 4 | GitHub 集成 | 1d |
| 5 | 天气 | 0.25d |
| 6 | 图床 / 媒体 | 0.5d |
| 7 | 容器化 + 部署 | 0.5d |
| **总计** | | **~6 个工作日** |

可以一鼓作气 Phase 0 → 2 先出可看的本地版本（约 3 天），然后再补后端集成。
