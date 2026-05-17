# Handoff: ScarletMu 个人主页 (8-bit RPG · Home Page)

## Overview

这是 **ScarletMu** 的个人主页设计 — 一个全栈开发者的作品集兼名片站，采用 **8-bit RPG 角色信息界面**的视觉隐喻：
- 顶部状态条像存档界面（FILE 01 / play-time / HP / MP / EXP）
- 左侧"训练家手册"展示个人信息、技能、属性、装备
- 中间展示 GitHub 提交热力图 + 开源项目列表
- 右侧展示痛车画廊、人像画廊、当前活动
- 整体配色为**纸白 + 单色墨绿**，无第二色相
- 字体使用像素字体（DotGothic16/Press Start 2P/VT323）

## About the Design Files

**本包内的 HTML 文件是设计参考，不是生产代码。** 它们是用 React + 内联 CSS 制作的高保真原型，用于展示最终视觉和交互。

实际开发时应：
1. 在目标代码库中（推荐 Next.js + Tailwind，或同等现代框架）**重新实现**这些设计；
2. 将设计中硬编码的占位数据接入**真实后端 API**；
3. 沿用代码库现有的组件库、状态管理、构建工具，不必照搬本包的 React/Babel 内联结构。

## Fidelity

**High-fidelity (hifi)**。颜色、字号、间距、阴影、动画都已敲定，请按本文档的 token 表 1:1 还原。布局精度按 1440×1024 桌面画板设计，需做响应式适配。

## Screens / Views

整个主页是单页面应用，无路由跳转。1440×1024 桌面画板，三列网格：

### 1. Top Status Bar（顶部状态条）

**Purpose**：建立 RPG 存档界面的隐喻基调，传达"这是个活页面"。

**Layout**：两行结构，外层 `.win`（边框 2px ink、4px ink 实色阴影）。
- **Row 1 — Identity strip (inverted)**：
  - 背景 `--ink` (`#1d3528`)，文字 `--paper` (`#efe8d4`)
  - Grid columns: `auto auto 1fr auto auto auto`，gap 18px，padding 8px 16px
  - 内容：`★ FILE 01` | `play-time HH:MM:SS:FF`（每秒递增） | `SCARLETMU · PLAYER STATUS · SAVE-FILE 01`（居中，字距 0.16em） | 当前地点 | `LV.27` | 三色像素圆点
- **Row 2 — Gauges**：
  - 背景 `--paper`，padding 14px 18px
  - Grid columns: `1.1fr 1.1fr 1.6fr auto`
  - HP / MP 进度条（双色斑马纹填充） + EXP 分段条（20 格） + `BGM` 按钮 + `？ HELP` 按钮

**关键交互**：play-time 每秒 tick；BGM 按钮点击启停 WebAudio 方波 chiptune。

### 2. Left Column · Trainer Card（训练家手册）

宽 440px，整列是一张大 `.win`。

**Sections (top → bottom)**：

1. **Title bar**：`◆ TRAINER CARD · 训练家手册` | `ID No. 02547`
2. **Portrait + Identity (grid 190px / 1fr, gap 14px, padding 14px)**：
   - 左：190px 全身像占位（3/4 比例，斜纹+扫描线）
   - 右：
     - **打字机名字**：`SCARLETMU` (Press Start 2P 20px) — 700ms 后开始打字
     - 职业副标：`Full-Stack Wanderer` (VT323 14px, color mid)
     - **打字机 tagline**：`> 沉迷于 Vibe Coding 的闲鱼摄影佬和痛车佬…` — 1100ms 后开始
     - 内联读数表 (grid auto/1fr)：LV / EXP（20 分段条） / GOLD / HOME
3. **Skills chips**：标题 `SKILLS`，下方 wrap 排列 chip（2px ink 边框，paper 底）
4. **6 维属性 (STATS)**：每行 `<标签> <22 分段条> <数值> <说明>`，横向布局
5. **Equipment 装备格 (3 cols)**：每格四角像素点 + slot 标签 + 装备名 + Lv.XX
6. **Dialogue footer (sticky bottom)**：背景 `--paper-2`，顶部 ink 边框，文案 `「你好，旅人。从右侧选一个房间开始探索吧。」`，末尾闪烁箭头

### 3. Middle Column · Contributions + Projects

宽 1fr（约 460px）。

**3a. Contributions Heatmap**：
- 标题：`◆ CONTRIBUTIONS · 提交活力` | `LAST 26 WEEKS`
- 顶行：COMMITS 总数 / STREAK 天数 / PRs MERGED / LAST PUSH，右侧 LESS→MORE 4 阶颜色图例
- 热力图：26 列 × 7 行像素方格，4 阶颜色（paper-2 / wash / mid / ink），每格 1px ink 边框，gap 3px。最左侧 M/W/F 周轴
- 数据生成逻辑：mulberry32 PRNG seed 0xC0FFEE，最近周递增 bias，周末轻度冷却（参考 `variant-a.jsx` 中实现）。**生产中应改为从 GitHub API 拉取真实贡献数据。**

**3b. Projects List**：
- 标题：`◆ OPEN-SOURCE · 开源项目` | `06 / 06`
- 6 张项目卡，flex:1 平分剩余空间，每张包含：
  - 左：两位编号（`01`...`06`）
  - 中：项目名（Press Start 2P 12px） + 语言 chip + VT323 描述
  - 右：`★ {stars}` + `⑂ {forks}`
- 整张卡 `invert-hover`：hover 时反色，chip 也跟着翻成透明底/纸白边

### 4. Right Column · Galleries + Now

宽 440px，三个 `.win` 垂直堆叠。

**4a. Itasha Gallery（痛车）**：
- 标题：`◆ ITASHA · 痛车` | `4 PHOTOS`
- 2×2 网格，每个 cell 是 `invert-hover` 卡片：4/3 占位图 + 车型名 (VT323 13px) + 地点+日期 (Press Start 2P 8px)

**4b. Portrait Gallery（人像）**：
- 标题：`◆ PORTRAIT · 人像` | `SET 03`
- 4 列网格，3/4 占位图 + 下方说明（如"胶片 · 室内"）

**4c. Now · 当前状态**：
- 5 行键值：CODE / ♪ / BOOK / LOC / CAR
- 虚线分割
- `RECENT LOG` 4 条日志：`T-00:12 > push origin main … OK` 等

### 5. Footer hint bar

绝对定位，画板底部：
- 左：键位 chip — `↑↓ SELECT` / `⏎ ENTER` / `␣ SKIP` / `GH · TG · X · BLOG`
- 右：`© YEAR ScarletMu · save-file 01 · press START`

## Interactions & Behavior

| 交互 | 触发 | 行为 |
|---|---|---|
| **打字机开场** | 页面加载 | 名字（200ms 延迟、70ms/char）、tagline（1100ms 延迟、32ms/char），打字完成后保留闪烁 caret `_` |
| **play-time tick** | 每秒 | 顶部 status strip 中 `play-time` 字段 +1 秒，frames 字段假装在跑 |
| **像素抖动 hover** | 鼠标悬停按钮 / 卡片 | `.pbtn:hover` + `.invert-hover:hover` 触发 `animation: jitter 120ms steps(2) infinite`（±1px 抖动）+ 反色填充 |
| **菜单选中态** | `.menu-row.active` | 当前已无菜单组件，但 class 保留可复用 |
| **BGM 开关** | 点击右上 `♪ BGM OFF` 按钮 | 启停 WebAudio 方波 chiptune（A minor 32 音符循环 130ms/note）。**生产可换成真实 chiptune mp3 或保留合成器** |
| **caret 闪烁** | `.caret` | `animation: blink 1s steps(2) infinite` |

## State Management

```ts
// 全局：
- playTimeSeconds: number       // 每秒 tick
- bgmOn: boolean                // BGM 开关
- typewriterDone: { name, sub } // 打字机完成态

// 数据（应来自后端）：
- character: { handle, class, lv, exp, hp, mp, gold, home, stats[6], skills[], equipment[] }
- projects: Project[]            // GitHub 拉取
- contributions: Cell[]          // GitHub 拉取（26周×7天 + 总数/streak/prs/lastPush）
- itasha: ItashaPhoto[]         // 自有图库
- portraits: Portrait[]         // 自有图库
- now: { code, music, book, loc, car }   // wakatime / lastfm / 手动
- log: LogEntry[]               // 活动日志
- socials: { k, v }[]
```

## Suggested Backend / API Surface

如果要做真后端，推荐以下接口（REST 或 GraphQL）：

```
GET  /api/character         # 人物属性、技能、装备（admin 可编辑）
GET  /api/projects          # 缓存自 GitHub API；按 stars 排序
GET  /api/contributions     # 缓存自 GitHub 贡献日历
GET  /api/now               # 实时拼接：wakatime(code) + lastfm(♪) + 手填(book/car) + 天气(loc)
GET  /api/gallery/itasha    # 自有 CDN 图库
GET  /api/gallery/portrait  # 自有 CDN 图库
GET  /api/log               # 最近 N 条活动（commit、push、新照片等）
```

**第三方建议**：
- GitHub: `@octokit/rest` 拉 repos + contributions (REST contrib 用 GraphQL `user.contributionsCollection`)
- WakaTime API for `now.code`
- Last.fm / Spotify API for `now.music`
- 自建图床 / Cloudflare R2 + Image Resizing 处理 gallery

**缓存策略**：projects / contributions 用 60min ISR；now 用 60s SWR；gallery 用 24h CDN cache。

## Design Tokens

### Colors (CSS Custom Properties)

```css
--paper:    #efe8d4;   /* warm aged paper · 主背景 */
--paper-2:  #e6dec7;   /* paper recessed · 凹陷面板 */
--wash:     #d7cdae;   /* panel fill · 中间灰绿 */
--mid:      #587a5c;   /* mid green · 次要文字 / heatmap lvl 2 */
--ink:      #1d3528;   /* primary ink · 主文字 / 边框 */
--shadow:   #0c1a11;   /* deep shadow · 极少用 */
--ink-soft: rgba(29, 53, 40, 0.55);   /* 占位辅文字 */
```

**铁律**：不引入第二个色相。所有"灰度"都在墨绿轴上。

### Typography

| 用途 | 字体 | 字号 |
|---|---|---|
| CJK 像素正文 | `DotGothic16` (Google Fonts) | 13–16px |
| 英文标签 / 数字 / "title chips" | `Press Start 2P` (Google Fonts) | 8–22px |
| 终端 / 等宽英文 / 数据值 | `VT323` (Google Fonts) | 13–16px |

字体平滑必须关闭：`-webkit-font-smoothing: none; image-rendering: pixelated;`

### Borders & Shadows

```css
--b:        2px solid var(--ink);
--b-thick:  3px solid var(--ink);
--drop:     4px 4px 0 var(--ink);     /* 主窗口阴影 */
--drop-sm:  3px 3px 0 var(--ink);     /* 卡片 / 按钮阴影 */
--drop-soft:4px 4px 0 var(--mid);     /* 次要阴影 */
```

**禁用**：圆角、模糊阴影、渐变、半透明叠加（除占位图自身扫描线外）。

### Spacing

基于 4px 网格：`4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 24`。`gap-2=8` / `gap-3=12` / `gap-4=16` / `gap-5=24`。

### Patterns

- **Paper bg**：双层 radial-gradient 1px 点阵（3px 和 7px 错位）模拟纸纹
- **Scanlines**：repeating-linear-gradient 2px 透明 + 1px ink @ 6% opacity，mix-blend multiply
- **Image placeholder**：45° 斜条纹 6/6px + 扫描线 + paper 边框标签
- **Bar fill**：斑马纹 ink 6px + mid 2px 重复
- **Equipment slot**：四角 4×4 ink 像素点

## Animations

```css
@keyframes jitter { /* hover 像素抖动 */
  0%   { transform: translate(0,0); }
  50%  { transform: translate(1px,-1px); }
  100% { transform: translate(-1px,1px); }
}
@keyframes blink { 50% { background: transparent; } }      /* caret */
@keyframes bob   { 50% { transform: translateX(3px); } }   /* 对话箭头 */
```

所有过渡使用 `steps(2)` 阶跃，**禁止**线性 / 缓动 — 保持 8-bit 数字感。

## Assets

**当前为占位**：
- 全身像（PORTRAIT）— 195×260px 比例
- 痛车照片 4 张 — 4/3 比例
- 人像照片 4 张 — 3/4 比例

**生产时**：所有图片都应通过自有图床提供，建议提供 WebP + AVIF + 像素化变体（CSS `image-rendering: pixelated` 配合 nearest-neighbor 缩放）。

字体来自 Google Fonts，无需自部署：
```
https://fonts.googleapis.com/css2?family=DotGothic16&family=Press+Start+2P&family=VT323&display=swap
```

## Files in this bundle

| 文件 | 作用 |
|---|---|
| `ScarletMu Home.html` | 入口 — 用 `<DesignCanvas>` 把 3 个方向放在一起，A 是主推版 |
| `styles.css` | 完整设计系统 CSS（tokens / `.win` / `.chip` / `.bar` / `.imgph` / hover 反色规则） |
| `variant-a.jsx` | **主推版** — 顶部状态条 + 训练家手册 + 提交热力图 + 项目 + 画廊 + Now |
| `variant-b.jsx` | 参考：训练家手册形象先行版（保留对比用） |
| `variant-c.jsx` | 参考：终端 + 地下城地图版（保留对比用） |
| `data.jsx` | 全部占位数据 + `<StatBar>` `<Win>` `<ImgPh>` 等共享组件 + `useTypewriter` hook + chiptune 合成器 |
| `design-canvas.jsx` | 设计画板组件（开发时丢弃，仅是展示用） |
| `screenshots/` | 视觉参考截图（基准设计快照） |

**开发时只参考 `variant-a.jsx`**；B/C 是设计探索阶段的对照方案，不用实现。

## How to view the design at full fidelity

直接用浏览器打开 `ScarletMu Home.html` 即可在 1440+px 显示器上看到完整原生渲染（带打字机开场、play-time tick、hover 反色、chiptune BGM toggle 等所有交互）。`screenshots/01-overview.png` 仅是缩略图占位。

## Recommended Stack (for actual implementation)

- **Framework**: Next.js 14+ App Router (SSR + ISR + 边缘缓存)
- **Styling**: Tailwind CSS + 自定义 `tailwind.config.ts` 把上面 tokens 注入 `theme.extend.colors`
- **Fonts**: `next/font/google` 加载 `DotGothic16` / `Press_Start_2P` / `VT323`
- **Data**: SWR / TanStack Query；后端用 Hono 或 Next API routes；数据库 Postgres + Prisma 或者纯 KV (现在主页内容并不大)
- **Audio**: WebAudio 合成器或一个 30KB chiptune mp3 loop
- **图床**: Cloudflare R2 + Workers
- **部署**: Vercel / Cloudflare Pages

实现时建议先把 **CSS tokens** 和 **`.win` / `.chip` / `.imgph` / `.bar` / `.seg`** 这几个原子组件用 Tailwind plugin 或 utility class 重写出来，其余 layout 跟着 `variant-a.jsx` 的 grid 结构搭就行。
