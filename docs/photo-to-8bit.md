# 照片 → 8-bit 风格化提示词

把"现实照片"喂给生图大模型（Nano Banana / Sora Image / Midjourney / Stable Diffusion / DALL·E 等），让输出能直接塞进 `scarletmu.com` 的角色档案、痛车画廊、人像画廊。这份文档是**喂给生图模型的提示词组装手册** —— 不是程序读的配置，是给我自己复制粘贴用的。

## 风格底色（必须遵守）

整站建立在一个**单色相**的 8-bit 视觉系统上。任何风格化输出都要落进这套色板，不能引入第二个色相：

| Token | Hex | 在生成图里的角色 |
|---|---|---|
| `paper` | `#efe8d4` | 最亮的底色（高光、纸面） |
| `paper-2` | `#e6dec7` | 次亮，过渡色块 |
| `wash` | `#d7cdae` | 中灰过渡，半阴影 |
| `mid` | `#587a5c` | 主中间调（皮肤、车漆中明度区） |
| `ink` | `#1d3528` | 主轮廓、暗部 |
| `shadow` | `#0c1a11` | 极少量最深处（眼窝、车底） |

整个色板 = **米黄纸**（3 档）+ **墨绿墨水**（3 档），一共 **6 色**。8-bit 实际渲染时强烈建议进一步压到 4–5 色，靠**抖动（dithering）**而不是新颜色去过渡。

## 硬性规则

- **真正的像素**：每个像素必须是正方形、边界锐利、**没有任何抗锯齿/亚像素羽化**。如果模型默认输出"软像素艺术"（带 anti-aliasing 的 fake pixel art），换提示词或后期手动 nearest-neighbor 缩放。
- **不要圆角、不要模糊阴影、不要 bloom、不要发光、不要 lens flare、不要景深虚化、不要电影感。**
- **不要渐变填充**。明暗过渡靠**抖动点阵 / 棋盘格 / 斜线网纹**实现。
- **不要彩色**。皮肤不是粉色、天不是蓝色、植被也不是常规绿 —— 一切都要被压到上面那套墨绿/纸色色板。
- **不要保留照片的真实纹理**。头发丝、车漆反光、镜头光圈这些"摄影元素"全部删掉，换成**色块 + 像素边线**。
- **保留主体可辨识度**。脸型/车型/构图要让本人和懂车的朋友一眼认出，但所有细节都要"被像素吃掉"一层。

## 输出规格（按使用位置区分）

| 使用位置 | 比例 | 推荐"内部像素分辨率" | 最终展示尺寸 |
|---|---|---|---|
| 训练家肖像（左列） | **3 : 4** | 96 × 128 | 192 × 256（2×） |
| 人像画廊（右列） | **3 : 4** | 72 × 96 | 96 × 128 起 |
| 痛车画廊（右列） | **4 : 3** | 128 × 96 | 256 × 192（2×） |

**重点**：生图模型容易输出 1024×1024 之类的高分辨率"看起来像素风"图。要的不是"看起来像"，是"真的就是"。两种做法二选一：

1. 直接让模型按上表的内部分辨率出图（多数模型支持 `--ar 3:4` + 限制像素密度）。
2. 让模型出大图，但提示里强制要求"每个 logical pixel 必须是 8×8 或 16×16 的真实色块"，**生成后用 GIMP/Photoshop 把图 nearest-neighbor 下采样到 96×128**，再 nearest-neighbor 放大回展示尺寸。

CSS 端会带上 `image-rendering: pixelated` 做放大保护，前提是图本身是干净的低分辨率位图。

## 通用提示词模板（英文）

> 生图模型对英文提示词敏感度更高，下面所有 prompt block 都是直接复制到模型里的英文版本。中文说明只给我自己看。

### 基础风格头（所有照片都拼这一段）

```
8-bit pixel art, NES / Famicom era aesthetic, true pixel grid with hard square pixels, no anti-aliasing, no sub-pixel smoothing, no motion blur, no depth of field, no lens flare, no bloom, flat shading with visible dithering (checkerboard and diagonal hatch) for tonal transitions, limited palette of 6 colors only: cream paper #efe8d4, soft cream #e6dec7, warm beige #d7cdae, muted sage green #587a5c, deep forest ink #1d3528, near-black shadow #0c1a11. monochromatic green-on-cream color scheme, NO other hues whatsoever (no blue sky, no pink skin, no chromatic accents), parchment / save-file UI vibe.
```

### 反提示（negative prompt，配合支持 negative 的模型用）

```
photorealistic, photograph, 3d render, smooth gradient, anti-aliased, blurry, depth of field, bokeh, lens flare, glow, bloom, soft lighting, cinematic, HDR, rounded corners, gradient mesh, watercolor, painterly brush strokes, full color spectrum, blue, red, yellow, purple, skin tone, realistic skin, JPEG artifacts, signature, watermark, modern pixel art with anti-aliasing, "smooth pixel art".
```

## 各场景的具体提示词

### A. 训练家肖像（角色头像，3:4）

用途：左列角色档案顶部 195×260 那块。要求**正面/3⁄4 侧脸、上半身、表情中性偏自信**。

```
{基础风格头}
Front-facing upper-body portrait of a single character, head and shoulders visible, neutral confident expression, soft eye contact with viewer, clean simple background of paper cream #efe8d4 with subtle 1px dithered noise (no scene, no environment).
Render in 96 x 128 internal pixel resolution at 3:4 aspect ratio. Hair, clothing, and skin all rendered in the cream-and-green palette only — treat skin highlights as cream tones, mid-tones as warm beige, shadows as muted sage green, deepest accents as forest ink. Outline the silhouette with 1-pixel forest ink lines. Use dithering to suggest cheek shadow and hair volume; do NOT use gradients.
Reference era: Pokémon Gen 1 trainer card portrait, Mother / Earthbound character bust, Game Boy Pocket sprite, 1989-1992 JRPG box art pixel illustration.
```

### B. 痛车画廊（车辆 + 场景，4:3）

用途：右列 2×2 网格，每张是一辆痛车配地点信息。**要求侧面或 3⁄4 角度全车、车身贴纸可辨识、地点轮廓做剪影背景**。

```
{基础风格头}
Side or three-quarter view of a single sports car (subject vehicle) in the foreground, full car body visible from bumper to bumper, parked or static. Distinctive itasha-style anime decals on the side panels rendered as flat pixel blocks (no smooth artwork — every decal element is a chunky pixel shape in the cream-and-green palette).
Background is a minimal silhouette of the location (e.g. convention hall, mountain pass guardrail, harbor warehouse, parking deck) reduced to 2-3 flat tone bands with dithered transitions. No sky color, no clouds, no people in background. Ground plane is a flat horizontal band.
Render in 128 x 96 internal pixel resolution at 4:3 aspect ratio. Car body uses the full 6-color palette with forest ink #1d3528 for outlines and panel breaks, muted sage #587a5c for mid-tone body color, warm beige #d7cdae for highlights, near-black #0c1a11 for under-body shadow and wheel wells.
Reference era: Out Run arcade sprite, Sega Saturn 2D racing game intermission art, Famicom Disk System car illustrations.
```

可选附加（按车款指定）：

- `subject vehicle: Toyota GR Yaris, hatchback silhouette`
- `subject vehicle: Nissan Silvia S15, low coupe profile`
- `subject vehicle: Mazda RX-7 FD3S, long hood teardrop body`
- `subject vehicle: Toyota Sprinter Trueno AE86, boxy 80s coupe with pop-up headlights`

### C. 人像画廊（生活/胶片照，3:4）

用途：右列 4 列网格，每张配 `胶片 · 室内` 这种短说明。**比训练家肖像更松，可以是半身/全身、可以背对镜头、可以带场景元素**。

```
{基础风格头}
Candid lifestyle portrait, single subject, can be full-body or three-quarter crop, any pose including back-to-camera or side profile, optionally holding an object (camera, book, mug). Optional minimal background element: a window with paper-cream light, a chair silhouette, a doorframe — reduced to flat dithered shapes.
Render in 72 x 96 internal pixel resolution at 3:4 aspect ratio. Preserve the subject's silhouette and posture exactly from the source photo. Reduce all clothing patterns, hair detail, and skin tone variation to the 6-color cream-and-green palette using dithering only.
Reference era: Game Boy Camera self-portrait, Famicom RPG NPC sprite scaled up, 90s pocket camera viewfinder.
```

## 与现实照片的对位流程

我自己实际工作流（按顺序）：

1. **挑底片**：脸/车要在画面中央，光比不要太极端（强逆光 → 8-bit 化后会塌成纯墨绿剪影）。
2. **预处理**（可选）：在 Photoshop / Affinity 里先把照片去饱和、提对比度、压成双色调（暗部映射到 `#1d3528`、亮部映射到 `#efe8d4`），让生图模型有个"已经在调内"的输入。
3. **喂图 + 提示词**：用 image-to-image / reference 图功能，强度 0.5–0.7（保留构图，丢弃真实纹理）。提示词 = 上面的基础风格头 + 场景段。
4. **手动 nearest-neighbor 下采样**：模型输出 1024×1024 之后，用 GIMP "缩放图像 → 立方" ❌，必须选 "无（None）" 或 "最近邻"，目标尺寸按上表。
5. **可选调色校准**：把最终图丢进 GIMP "图像 → 模式 → 索引" → 自定义调色板，限制到 6 色，确认没有偏色像素混进来。
6. **存到 `/srv/<app>/media/{itasha,portraits}/<slug>.png`**，在对应 `content/*.yml` 里填路径。

## 常见踩坑

- **模型偷偷加蓝天**：天空是最容易破坏单色相的地方。提示词里**明确写 `no blue sky, sky replaced by cream paper #efe8d4 background`**。
- **模型输出"现代 pixel art"**：带 anti-aliasing 的"软像素"。这种图放进 `image-rendering: pixelated` 容器里会糊一层。必须再三强调 `hard edges, no anti-aliasing, NES era`。
- **皮肤被渲染成粉色**：很多模型有"美化人像"的隐性偏好。提示词里写 `skin tones remapped to cream and beige palette only, no pink, no peach, no salmon`。
- **车漆变成蓝/红**：同上，强调 `car body color must use only the 6-color palette, original car color is irrelevant`。
- **细节过度**：写实派模型会想表现"每根头发丝"。强调 `treat hair as 3-4 solid color blocks with dithered edges, do NOT render individual strands`。

## 验收清单

每张图入库前过一遍：

- [ ] 用吸管在图上随机点 20 个像素 —— 颜色全部落在 6 色调色板里（或夹在两色之间的抖动）。
- [ ] 放大到 200% 看像素边缘 —— 是硬切的方块边，不是渐变羽化。
- [ ] 主体（脸 / 车型）能在缩略图尺寸（96px 宽）下被认出来。
- [ ] 没有蓝、红、黄、紫等任何"反色相"像素混入。
- [ ] 整张图的视觉感受和 [`design-constraints.md`](./design-constraints.md) 描述的"米黄纸 + 墨绿墨"系统是连续的，放进角色档案或画廊里不"出戏"。

## 尝试记录

### Attempt 001 — selfie 训练家肖像

- 时间：2026-05-17 01:36 CST
- 输入：`image-sample/selfie.png`，原图是 1280 × 1707 的正面自拍，人物居中，眼镜、黑发、黑色上衣和双肩包肩带特征明显。
- 目标：按「A. 训练家肖像」处理成 3:4 头像，用作角色档案顶部肖像。
- 输出：覆盖写回 `image-sample/selfie.png`，最终尺寸 192 × 256，对应 96 × 128 internal pixel resolution 的 2× 最近邻放大。

实际提示词策略：

- 用原自拍作为 identity/reference image。
- 保留脸型、眼镜、发型、正面上半身构图、中性表情。
- 背景从停车场改成 `#efe8d4` 纸色底 + 轻微 1px 点阵噪声。
- 眼镜用 `#1d3528` 1px 线和少量纸色高光表达。
- 头发压成 3–4 块实色暗部 + dithering，不画发丝。
- 皮肤映射到纸色/米色/鼠尾草绿阴影，不允许粉色、桃色或其他色相。
- 衣服和肩带简化成大块深色像素。

后处理流程：

1. 模型先产出大图（1086 × 1448），视觉上已经接近目标，但仍不是可直接入库的低分辨率位图。
2. 用 `ffmpeg` 最近邻缩到 96 × 128。
3. 用自定义 6 色 palette 做 `paletteuse` 量化和 Bayer dithering。
4. 再最近邻放大到 192 × 256。
5. 因 `ffmpeg` 色彩转换第一次让若干颜色偏移 1 个 RGB 值，最后用 `lutrgb` 把颜色钉回精确 token。

最终验收结果：

```text
file image-sample/selfie.png
image-sample/selfie.png: PNG image data, 192 x 256, 8-bit/color RGB, non-interlaced

sips -g pixelWidth -g pixelHeight image-sample/selfie.png
pixelWidth: 192
pixelHeight: 256

unique RGB colors:
0c1a11
1d3528
587a5c
d7cdae
e6dec7
efe8d4
```

结论：

- 成功项：主体可辨识，眼镜/发型/脸型/肩带都保留下来；最终只有规定 6 色；边缘是硬像素；放到 96px 宽仍能读出人像。
- 可改进：脸部细节略偏「干净」，下一版可以在脸颊、鼻梁、下巴处增加更明确的 1px dithering，但要避免变脏或丢失亲和感。

### Attempt 002 — Subaru SG9 痛车画廊图

- 时间：2026-05-17 01:44 CST
- 输入：`image-sample/subaruSG9.png`，原图实际是 JPEG 数据但扩展名为 `.png`，尺寸 1280 × 853。画面是 Subaru Forester SG9 三分之四前侧角度，城市玻璃建筑停车场背景，车身痛贴、金色轮毂、机盖进气口和车顶行李架特征明显。
- 目标：按「B. 痛车画廊」处理成 4:3 车辆图，用作右列 2×2 痛车网格。
- 输出：
  - `image-sample/subaruSG9-generated.png`：模型原始风格化输出，1448 × 1086。**这一版是当前风格主方向**，车辆和痛贴可读性明显更好。
  - `image-sample/subaruSG9-generated-6color.png`：保留 1448 × 1086 尺寸，只把颜色锁回 6 色 palette 的版本。
  - `image-sample/subaruSG9-8bit.png`：严格 128 × 96 internal pixel resolution 的 2× 最近邻放大实验，256 × 192。该版本符合规格但车图信息损失过大。

实际提示词策略：

- 用原车照作为 reference/edit target。
- 保留 SG9 旅行车/SUV 轮廓、三分之四前侧构图、机盖进气口、格栅、金色轮毂、车顶行李架、停车场城市背景。
- 痛贴不追求逐字还原，把侧门和机盖图案压成大块 pixel decal，保留「痛车」识别度。
- 原图里的真人不作为主体，提示模型简化或省略，让车辆成为唯一视觉焦点。
- 背景玻璃楼和树丛简化成 2–3 档色块、网格窗和剪影，天空与反光全部压回纸色调。
- 全图限定 6 色：`#efe8d4`、`#e6dec7`、`#d7cdae`、`#587a5c`、`#1d3528`、`#0c1a11`。

后处理流程：

1. 模型先产出大图（1448 × 1086），构图和车型保留较好，但仍包含高分辨率像素画细节。
2. 复制原始生成图到 `image-sample/subaruSG9-generated.png` 作为对照。
3. 第一轮严格实验：用 `ffmpeg` 最近邻缩到 128 × 96，按亮度映射到站点 6 色 palette，并加入轻微 4×4 Bayer 阈值扰动，再放大到 256 × 192，写出 `image-sample/subaruSG9-8bit.png`。
4. 复盘后确认：痛车照片不适合头像那种硬压 internal resolution 的方式。车辆贴纸、车型线条、轮毂和背景地点都依赖更多像素，128 × 96 下会变得太小，基本无法看清。
5. 第二轮保留大图尺寸：直接把 `image-sample/subaruSG9-generated.png` 的每个像素映射到最近的 6 色 token，写出 `image-sample/subaruSG9-generated-6color.png`。这版保留模型输出的像素画观感和细节密度，同时满足色板约束。

最终验收结果：

```text
file image-sample/subaruSG9-generated-6color.png
image-sample/subaruSG9-generated-6color.png: PNG image data, 1448 x 1086, 8-bit/color RGB, non-interlaced

sips -g pixelWidth -g pixelHeight image-sample/subaruSG9-generated-6color.png
pixelWidth: 1448
pixelHeight: 1086

unique RGB colors:
0c1a11
1d3528
587a5c
d7cdae
e6dec7
efe8d4

file image-sample/subaruSG9-8bit.png
image-sample/subaruSG9-8bit.png: PNG image data, 256 x 192, 8-bit/color RGB, non-interlaced

sips -g pixelWidth -g pixelHeight image-sample/subaruSG9-8bit.png
pixelWidth: 256
pixelHeight: 192

unique RGB colors:
0c1a11
1d3528
587a5c
d7cdae
e6dec7
efe8d4
```

结论：

- 成功项：`subaruSG9-generated.png` 的风格方向正确，车辆尺度、痛贴密度、城市背景和像素画观感都更适合痛车画廊。`subaruSG9-generated-6color.png` 在保留可读性的同时把颜色锁回站点 palette。
- 规格调整：痛车图不应机械套用 128 × 96 internal resolution。这个尺寸适合小型画廊缩略图实验，但不适合展示痛车细节。后续痛车主图可以保留模型高分辨率像素风输出，必要时只做 6 色 palette lock；CSS 端仍用 `image-rendering: pixelated` 控制展示。
- 可改进：下一版 prompt 继续沿用 `subaruSG9-generated.png` 的风格，但可以减少背景树丛密度，让车辆再占画面 5–10%，同时要求侧门 decal 的角色脸和大字块更清楚。
