# 视觉规约

`scarletmu.com` 的自包含视觉参考。源自 claude-design 交付物；完整原文档和参考 JSX 在 `assets` 孤立分支上（见 [CLAUDE.md](../CLAUDE.md#design-archive)），但**本文件才是工作中真正遵循的规范** —— 日常开发不需要再去翻分支。

## 页面意图

把"8-bit RPG 角色信息屏"作为个人主页：

- **顶部** —— 存档状态栏（`FILE 01` / `play-time` / `HP` / `MP` / `EXP`）。营造"这是一个正在进行中的存档"的氛围。
- **左侧** —— 角色档案（Character File）：肖像、身份、技能、六维属性、装备。
- **中间** —— GitHub 贡献热力图 + 开源项目（开发者的"战绩册"）。
- **右侧** —— 痛车画廊（Itasha）/ 人像画廊 / `Now` 面板（当前活动）。
- **底部** —— 按键提示条 + 版权信息，做成游戏内 tooltip bar 的样式。

整页是单 canvas，没有客户端路由。仅桌面端 **1440 × 1024** 固定画布；移动端响应式 v1 不做（见 [architecture.md](./architecture.md)）。

## 硬性规则（不允许打破）

- **单色相**：所有"灰"都坐落在墨绿轴上。**永远不要**引入第二种色相。
- **不要**圆角、不要模糊阴影、不要渐变、不要半透明蒙层（纸纹噪点 + 扫描线 + zebra 条纹的图案 *是*唯一被允许的"透明"形式）。
- **像素渲染**：`.pixel` 根元素必须带上 `-webkit-font-smoothing: none; image-rendering: pixelated;`。任何文字 / 图片**都不要**做亚像素抗锯齿。
- **只用阶梯式动画**：所有 keyframe 过渡用 `steps(2)`（或类似的离散步进）。**禁止** `linear`、`ease-*`、任何平滑插值。一旦上 easing，8-bit 感立刻崩。
- **参考变体**：只有 `variant-a.jsx`（在 `assets` 分支）是实现目标。`variant-b.jsx` / `variant-c.jsx` 是被废弃的探索 —— 没有用户明确要求，不要从中拿任何东西。

## 颜色 token（`app/globals.css` `@theme`）

| Token | Hex | 用途 |
|---|---|---|
| `--color-paper` | `#efe8d4` | 主背景 |
| `--color-paper-2` | `#e6dec7` | 下沉式面板 |
| `--color-wash` | `#d7cdae` | 中级面板填充、热力图 lvl 1 |
| `--color-mid` | `#587a5c` | 次要文字、热力图 lvl 2 |
| `--color-ink` | `#1d3528` | 主文字、边框、热力图 lvl 3 |
| `--color-shadow` | `#0c1a11` | 深阴影（节制使用） |
| `--color-ink-soft` | `rgba(29, 53, 40, 0.55)` | 占位 / 辅助文字 |

## 字体

| 用途 | 字族 | 字号区间 |
|---|---|---|
| 中文 / 日文像素正文 | `DotGothic16` | 13–16px |
| 英文标签 / 数字 / 标题 chip | `Press Start 2P` | 8–22px |
| 终端 / 等宽英文 / 数据值 | `VT323` | 13–16px |

通过 `app/layout.tsx` 里的 `next/font/google` 加载（自动自托管）。生产环境**不要**回退到系统字体。

## 边框 & 阴影

```
--b:                2px solid var(--color-ink)
--b-thick:          3px solid var(--color-ink)
--shadow-drop:      4px 4px 0 var(--color-ink)    /* 主窗口 */
--shadow-drop-sm:   3px 3px 0 var(--color-ink)    /* 卡片、按钮 */
--shadow-drop-soft: 4px 4px 0 var(--color-mid)    /* 次要 */
```

所有阴影都是**实心偏移块**，永远不模糊。

## 间距

4px 栅格：`4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 24`。所有间距都得对得上这套数。

## 图案（可复用的视觉纹理）

- **纸张背景**：双层径向渐变的 1px 点阵（3px + 7px 偏移叠加）。
- **扫描线**：`repeating-linear-gradient`，2px 透明 + 1px 墨绿 @ 6% 透明度，`mix-blend-mode: multiply`。
- **图片占位符**：45° 斜条纹 6/6px + 扫描线 + 纸边标签。
- **条形填充**（HP/MP）：zebra 条纹 `ink 6px` + `mid 2px` 循环。
- **分段条**（EXP/STATS）：N 个离散格子，已填格用 `--color-ink`，空格用 `--color-wash`。
- **装备槽四角**：每个格子四角各 4×4 的墨绿像素点。

## 动画

```
@keyframes jitter             /* 悬停 ±1px 像素抖动，steps(2) */
@keyframes blink              /* 光标，steps(2) */
@keyframes bob                /* 对话箭头点动，steps(2) */
@keyframes modal-overlay-in   /* 遮罩 80ms steps(2) 入场（两帧吃满，NES 切屏感）*/
@keyframes modal-wipe-in      /* 对话框 clip-path 自上而下 240ms steps(6) 卷帘 wipe */
```

## Section 布局

外层画布把所有东西包在 `.pixel.paper-bg` 里。三列 grid `440px 1fr 440px`，外 padding 24px，列间隔 16px。

### 顶部状态栏（横跨三列）

包在一个 `.win` 里。两行。

- **第一行 —— 身份条（反白）**：
  - 背景 `--color-ink`，文字 `--color-paper`
  - grid `auto auto 1fr auto auto auto`，间距 18px，padding `8px 16px`
  - 单元格从左到右：`★ FILE 01` · `play-time HH:MM:SS:FF`（每秒 tick）· `SCARLETMU · PLAYER STATUS · SAVE-FILE 01`（居中，letter-spacing 0.16em）· 当前位置 · `LV.27` · 三个彩色像素点
- **第二行 —— 状态条**：
  - 背景 `--color-paper`，padding `14px 18px`
  - grid `1.1fr 1.1fr 1.6fr auto`
  - 单元格：HP zebra 条 · MP zebra 条 · EXP 分段条（**20 格**）· BGM 切换按钮 + `? HELP` chip

### 左列 —— 角色档案（宽 440px）

单 `.win`。从上到下七部分：

1. **标题栏**：左侧 `◆ CHARACTER FILE · 角色档案`，右侧 `ID No. 02547`。
2. **肖像 + 身份**（grid `190px 1fr`，间距 14px，padding 14px）：
   - 左：190px 肖像，1/1 比例，占位符走扫描线 + 45° 斜条纹。
   - 右（顺序）：
     - 打字机名字 `SCARLETMU` —— `Press Start 2P` 20px，**延迟 700ms** 开始，70ms/字符，结束后留闪烁光标。
     - 职业副标题 `Full-Stack Wanderer` —— `VT323` 14px，颜色 `--color-mid`。
     - 打字机标语 —— **延迟 1100ms** 开始，32ms/字符，结束后留闪烁光标。
     - 内嵌读数（grid `auto 1fr`）：`LV` · `EXP`（20 段条）· `GOLD` · `HOME`。
3. **SKILLS chips**：标题 `SKILLS`，下面是 flex 自动换行的 chip 列表（2px 墨绿边、纸张底色）。
4. **六维属性块（STATS）**：六行，每行是 `<标签> <22 段条> <数值> <一行描述>` 横排。
5. **装备格子（Equipment）**：3 列。每格四个角各 4×4 墨绿像素点 + 槽位标签 + 装备名 + `Lv.XX`。
6. **手柄提示（CONTROLS · 假装能按）**：与上方装备格之间留 20px 上 padding，作为间隔。三行 `60px 1fr` 网格，每行「FC 按键图形 + 自嘲文案」配对：
   - **D-PAD**（3×3 像素十字，6px 单元）：`往哪戳都没用 —— 旅人，原地即终点。`
   - **SEL · STR**（双胶囊，16×5）：`菜单已封印，存档点早就落灰了。`
   - **B · A**（16×16 方钮，实心墨绿底 + 纸色字）：`取消与确认 —— 全都没接线，请用鼠标。`
   - 文案 `VT323` 13px：前缀按键名 `--color-mid`，正文 `--color-ink`。纯装饰，无交互。
7. **对话框页脚**（卡片底部贴边）：背景 `--color-paper-2`，上边框墨绿。一行对话文字 + 结尾闪烁箭头（`bob` 关键帧）。

### 中列 —— Contributions + Projects（1fr，约 460px）

两个 `.win` 上下排列。

- **每日提交条（Daily Code）**：
  - 标题：左 `◆ DAILY CODE · 每日提交`，右 `STREAK {n}d`。
  - 整体高度约 ~110px，三栏 `grid-template-columns: auto 1fr auto`，`align-items: center`，padding `14px 16px`。
  - **左**：最近 7 天 **22×22** 像素方块，2px 墨绿描边，4 级填色（`paper-2 / wash / mid / ink`），格间 6px。今天那格加外圈高亮（`box-shadow: 0 0 0 2px paper, 0 0 0 4px ink`）。下方一行 `Press Start 2P` 8px 字母缩写跟随该日真实星期（M/T/W/T/F/S/S，按 UTC 推导），居中。
  - **中**：左侧 2px 虚线分隔（`border-left`），左内边距 14px。第一行 `Press Start 2P` 8px `--color-mid`：`LAST PUSH · {ago} · {branch}`。第二行 `VT323` 14px `--color-ink`：`{短 sha} · {commit headline}`，单行溢出 ellipsis。
  - **右**：反白小方块（墨绿底 + 纸色字），2px 墨绿边、`min-width: 60`。上方 `Press Start 2P` 8px `COMBO`，下方 `VT323` 22px `×{streakDays}`。
  - 数据：GitHub GraphQL 拉最近 90 天日历，取末尾 7 天按 0 / 1 / 2-3 / 4+ 映射 4 级；末项 `today: true`。`recentPush` 子查询按 `PUSHED_AT` 排序取 1 条，从 `defaultBranchRef.target` 取短 sha + headline。未配置 `GITHUB_TOKEN` 或请求失败时使用 `FAKE_DAILY_CODE` 静态兜底。
  - 已移除：26×7 热力网格、`mulberry32` PRNG、COMMITS / PRs MERGED 统计、LESS-MORE 4 级图例。
- **项目列表**：
  - 标题：左 `◆ OPEN-SOURCE · 开源项目`，右 `06 / 06`。
  - 6 张卡片用 `flex:1` 等分剩余纵向空间。每张卡片：
    - 左：两位数字 `01`…`06`。
    - 中：项目名（`Press Start 2P` 12px）+ 语言 chip + `VT323` 描述。
    - 右：`★ {stars}` · `⑂ {forks}`。
  - 整张卡用 `.invert-hover`（悬停 → 反色 + jitter，chip 同时切到透明底 + 纸色边）。
  - 数据带 `url` 的卡片可点（含键盘 Enter/Space）：弹出**外部跳转确认框**，确认后 `window.open(url, '_blank', 'noopener,noreferrer')`。无 `url` 的卡片只是展示，`cursor: default`，不触发 modal。
  - **确认框**（client island，`components/client/ProjectsList.tsx`）：
    - 全屏 fixed 遮罩，背景用 2px/4px 横向竖纹 `rgba(--color-shadow)`（无 blur，保留单色硬边）。
    - 居中 `.win` 对话框（`min(420px, 100%)`）：标题 `◆ CONFIRM · 外部链接`，正文一行中文确认 + 一块 `.win-recessed` 显示完整 URL（`VT323`，长链 break-all），底部右对齐 `B 取消` / `A 前往` 两枚 `PixelButton`（ghost + 实心）。
    - 关闭路径：点遮罩、ESC、点 B；确认路径：点 A、Enter。

### 右列（440px）—— 三个 `.win` 上下排

- **痛车画廊（Itasha）**：
  - 数据：单文件 `content/itasha.yml`（gitignored，无 `.example.yml` 兜底）。条目按 `order` 排序，最多取前 4 条。文件缺失 / 条目不足 4 条 → 用占位槽位补满。
  - 标题：左 `◆ ITASHA · 痛车`，右 `N / 4 PHOTOS`（N 为已填条数）。
  - **2×2** 网格固定四槽。每个**已填槽**用 `.invert-hover`：4/3 比例图 + 车名（`VT323` 13px）+ `地点 · 日期`（`Press Start 2P` 8px）。
  - **空槽**（"汽修店未开门"）：不带 `.invert-hover`（死格，不响应悬停）。
    - 图区改用 `.warn-tape`：45° 警戒带斜线 `mid 8px / paper 20px` 循环（中绿 × 纸白，低对比、稀疏，不再叠扫描线），居中放一块 paper 底 + ink 边的 `.sign` 牌子，`Press Start 2P` 10px 写 `CLOSED`。
    - 文字行：车名位 `——`（`color: var(--color-ink-soft)`），地点·日期位 `準備中 · TBA`。
- **Now 面板**：
  - **5 个键值行**：`CODE` · `♪` · `BOOK` · `LOC` · `CAR`。
  - 行间虚线分割。
  - 下方 `RECENT LOG` 块：**4 条**，终端样式（例：`T-00:12 > push origin main … OK`）。

### 页脚提示条

**固定定位**在视口右下角（`position: fixed; right: 24; bottom: 24`），跟随滚动。仅一行：`© YEAR ScarletMu · save-file 01 · press START`，`VT323` 13px，颜色 `--color-mid`。

> FC 手柄按键提示已迁入左列角色档案的 `CONTROLS` 块，不再属于页脚。

## 交互

| 交互 | 触发 | 行为 |
|---|---|---|
| Typewriter —— 姓名 | 页面加载 + **700ms** | 打 `SCARLETMU`，70ms/字符，结束后留闪烁光标 `_` |
| Typewriter —— 标语 | 页面加载 + **1100ms** | 打标语，32ms/字符，结束后留闪烁光标 |
| play-time 走时 | 每 **1s** | 身份条里的 `HH:MM:SS:FF` 自增（frames 字段是装饰性的 —— 跟随秒 tick，不是 60fps） |
| 像素抖动（悬停） | 悬停 `.pbtn`、`.invert-hover` | `animation: jitter 120ms steps(2) infinite`（±1px）+ 反色填充 |
| 光标闪烁 | 所有 `.caret` | `animation: blink 1s steps(2) infinite` |
| 对话箭头点动 | 所有箭头 `▶` | `animation: bob 1s steps(2) infinite` |
| BGM 开关 | 点击 `♪ BGM` 按钮 | 开关 WebAudio 方波芯片音乐 —— **A 小调，32 音符循环，130ms/音符**。完整规约：[bgm.md](./bgm.md) |
| 项目跳转确认 | 点击带 `url` 的项目卡片 / Enter / Space | 弹出全屏确认 modal。遮罩 80ms `steps(2)` 入场，对话框 240ms `steps(6)` 自上而下 `clip-path` 卷帘。`B 取消` / 遮罩 / ESC 关闭，`A 前往` / Enter 新标签打开外链 |

## 素材约束

- 肖像（角色档案）：195×260 或任何 3/4 比例。
- 痛车照片：**4/3 比例**。
- 人像画廊照片：**3/4 比例**。
- 所有照片从 `/media/*` 提供（VDS 上 `/opt/scmlab/media` 由 Next.js 容器直接服务 —— 见 [architecture.md](./architecture.md)）。放大时加 `image-rendering: pixelated` 保留 8-bit 颗粒感。

## 什么时候可以偏离

不要偏离，除非用户明确要求。如果真要偏离，在 `docs/iterations/` 下新开一份文档记录改了什么、为什么改 —— 这些规则是整个视觉识别的承重墙。
