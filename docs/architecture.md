# 架构

`scarletmu.com` 锁定的架构决策。不要随便重开；如果确实要改，**新开一份**迭代文档说清楚原因，不要直接覆盖本文。

## 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 16 App Router（单 app） | RSC + Route Handlers + ISR。前后端不拆分。 |
| 样式 | Tailwind CSS v4 | 设计 token 写在 `app/globals.css` 的 `@theme` 里。**没有 `tailwind.config.ts`，也不要加**。 |
| 字体 | `next/font/google` | DotGothic16 / Press Start 2P / VT323，自动自托管。 |
| 半静态数据 | `content/` 下的 YAML + `lib/content.ts` 的 Zod schema | 用 `React.cache()` 包裹。校验失败构建失败。不用 Contentlayer。 |
| 动态数据 | `fetch(url, { next: { revalidate } })` | GitHub GraphQL（ISR 1h）、Open-Meteo（ISR 30min）。 |
| 兜底 | `lib/prng.ts`（mulberry32）+ `content/projects-manual.yml` | `GITHUB_TOKEN` 缺失或请求失败时使用。保证不带 secret 也能本地开发。 |
| 容器 | 多阶段 Dockerfile，`output: "standalone"` | 以非 root 用户 `nextjs` 运行。 |
| 部署 | 自托管 VDS。本仓只产出镜像（`scripts/build.sh`）；运行时配置在 sibling [`Self-Deploy`](../../Self-Deploy/) 仓的 `services/scmlab/` 下。镜像通过 `docker save \| ssh docker load` 流转，无第三方 registry。 |
| 反向代理 | Caddy 容器（`Self-Deploy/infra/caddy/`，共享） | 自动 TLS。Caddy 与 `scmlab-web` 容器共用 `vds-public` Docker network，反代到 `scmlab-web:3000`。SCMLab 容器不对宿主暴露端口。 |
| 媒体托管 | VDS 上 `/opt/scmlab/media`，以只读 bind-mount 注入容器的 `public/media/` | v1 由 Next.js 进程同时服务 `/media/*` 和 `/_next/image`，Caddy 不挂载这个路径。若日后 `/media/*` 成为热点，再加 Caddy 直发并在 `scarletmu.caddy` 中加 `handle_path /media/*`。 |
| 内容数据 | VDS 上 `/opt/scmlab/content`，bind-mount 到容器 `/app/content` | 真实 `*.yml` 不入任何 git 仓；`*.example.yml` 模板仍在本仓中。 |

## 为什么用 VDS 而不是 Vercel

用户自己有一台带宽够用的 VDS，倾向自托管。**不要**主动建议迁移到 Vercel / Cloudflare，除非用户先开口问。

## 客户端 / 服务端边界

- 默认：RSC。
- 只有 `components/client/*` 下的 `PlayTime` / `Typewriter` / `BgmToggle` 标 `'use client'`。其他任何东西都不应该升级成客户端组件，除非有非升不可的理由（浏览器 API、走时、音频）。

## v1 显式不做的事

以下被有意识地砍掉了，**不要主动加**：

- WakaTime（`now.code`）
- Last.fm / Spotify（`now.music`）
- `/admin` 编辑界面
- Postgres / 用户认证
- 移动端响应式（页面固定 1440×1024）
- GitHub Actions 自动部署
- MDX 博客

如果用户要其中任何一项，在 `docs/iterations/` 下开一份新的迭代文档。

## 目录映射

```
app/             # App Router 页面 + globals.css（Tailwind @theme）
components/
  primitives/    # Win / Chip / StatBar / ImgPh / Dotted / Caret / Arrow / PixelButton
  client/        # 'use client' 客户端孤岛
  sections/      # 8 个 section
lib/
  content.ts     # YAML + Zod 加载器，React.cache 包裹
  github.ts      # GraphQL fetch + PRNG 兜底
  weather.ts     # Open-Meteo
  prng.ts        # 开发态热力图的 mulberry32
  cn.ts          # clsx 简单包装
content/         # YAML 半静态数据
public/media/    # 已 gitignore；生产由 MEDIA_DIR 的 bind-mount 注入
deploy/          # 整目录 gitignore —— 仅本地保留的指引文档，指向 sibling Self-Deploy 仓
scripts/build.sh # 镜像工厂入口，产出 scarletmu-home:<tag>（Dockerfile 在仓库根）
# （_design/ 归档在 `assets` 孤立分支 —— 见 CLAUDE.md）
docs/            # 本目录
```
