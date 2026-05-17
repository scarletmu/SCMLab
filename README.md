# ScarletMu Home

ScarletMu 的个人主页 —— 8-bit RPG 风格的训练家手册。

## 技术栈

- **框架**：Next.js 16（App Router）+ Tailwind v4
- **数据**：YAML + Zod（半静态）／ GitHub GraphQL（ISR 1h）／ Open-Meteo（ISR 30min）
- **运行**：Docker + Nginx 反代 + certbot，自托管 VDS
- **客户端组件**：仅 `PlayTime` / `Typewriter` / `BgmToggle`

## 隐私分层

仓库公开，所有带个人特征的东西都 gitignore：

- `content/*.yml` —— 角色 / 装备 / 画廊真实数据（仅 `*.example.yml` 模板入库）
- `public/media/` —— 原图；生产由 VDS bind-mount 注入
- `deploy/` —— 部署 runbook、Nginx 配置；整个目录都不入库

## 文档

| 路径 | 内容 |
|---|---|
| [`docs/design-constraints.md`](./docs/design-constraints.md) | 视觉规约：tokens、动画规则、section 布局 |
| [`docs/architecture.md`](./docs/architecture.md) | 架构决策、v1 不做的事 |
| [`docs/iterations/`](./docs/iterations/) | 迭代历史 |
| [`CLAUDE.md`](./CLAUDE.md) | LLM-facing 索引（同 `AGENTS.md`） |

`assets` 孤立分支保存 claude-design 原始产物 —— 见 [CLAUDE.md → Design archive](./CLAUDE.md#design-archive)。

## 本地起步

```bash
pnpm install && pnpm dev    # http://localhost:3000
```

`.env.local` 不填也能跑 —— GitHub 数据回退到静态 fallback，content 回退到 `*.example.yml`。
