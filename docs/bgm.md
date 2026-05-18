# BGM — WebAudio 芯片音乐合成器

代码内置的 8-bit 合成器，**没有音频文件**。整个循环是浏览器运行时根据一份写死的**三声部芯片乐谱**（Lead 主旋律 + Harm 副旋律 + Bass 贝斯）和频率表实时生成的。源码在 [`components/client/BgmToggle.tsx`](../components/client/BgmToggle.tsx)。

## 为什么这么做

- **零网络成本**：`/public/` 下没有任何 `.ogg` / `.mp3`，没有 Range 请求，没有编解码器授权问题。BGM 开不开页面体积都一样。
- **不会自动播放**：`new AudioContext()` 只在用户点击时创建，所以页面默认是静音的，永远不会触发浏览器的 autoplay 拦截策略。
- **和设计语言贴合**：方波（旋律 / 副旋律）+ 三角波（贝斯）正好就是 FC / Game Boy 那几条通道的声源 —— 这个音乐**本身就是** 8-bit，而不是用现代音色去"模拟"8-bit。

## 工作原理

### 1. 素材层（写死在源码里）

乐谱以**绝对音名 + 八分音符栅格**的形式直接写在源码里：每个 token 占 1 个八分音符的格子，三个声部（Lead / Harm / Bass）是各自独立的字符串。编译时由一个 ~20 行的解析器展开成 `[音名 | 休止, 时长]` 序列。改谱不用算毫秒、不用算时间偏移，直接改字符串里的格子就行。

```ts
// 4/4, ♩=170,每格 = 八分音符
const LEAD = parseVoice(`
  D4 A4 D5 E5 F5 E5 D5 A4 | D4 A4 D5 E5 F5 E5 D5 A4   // Intro 1
  Bb3 F4 Bb4 C5 D5 C5 Bb4 F4 | ...                    // Intro 2
  ...
  A4 - Bb4 - C5 - C5 - | Bb4 - A4 - G4 - A4 -         // Chorus 1
  ...
`);

const HARM = parseVoice(`
  ${"_ ".repeat(80)}                   // Intro + Verse 静音 80 个八分
  F4 - - - - - F4 - | E4 - - - - - C4 -  // Pre-Chorus 进入
  ...
`);

const BASS = parseVoice(`
  D3 - - - - - - - | D3 - - - - - - -   // 整小节根音
  ...
`);

const VOICES = [
  { events: LEAD, type: "square",   gain: 0.9  },
  { events: HARM, type: "square",   gain: 0.5  },
  { events: BASS, type: "triangle", gain: 0.95 },
];
```

解析规则就三条：

- 一个 token (`D4`、`Bb2`、`F5`…) = **1 个八分音符**的攻击
- `-` = **延长**上一个事件 1 个八分（用来拼出四分、附点四分、二分、附点二分、全音符之类）
- `_` = 1 个八分**休止**（用于 Harm 在 Intro/Verse 不出现的段落）
- `|` 仅作为视觉小节线，解析时和空格等价

举例：`D4 - - - - - A4 -` 是 8 个 token = 1 个小节，解析为 `D4(附点二分音符)` + `A4(四分音符)`；`A4 - Bb4 - C5 - C5 -` 是 4 个四分音符 `A4 Bb4 C5 C5`。

整首曲子是 **26 个小节、4/4、170 BPM**，一个完整循环大约 **37 秒**。三个声部各自总长都是 208 个八分音符（断言点：脚本里 `Lead 116 events / Harm 47 events / Bass 30 events`，时长都是 208 八分）。曲式：

- **Intro**（8 小节）：Lead 跑流水般的八分走句穿过 D / Bb / A / C 四个根音，Bass 一拍一个整小节长音垫底，Harm 沉默
- **Verse**（2 小节）：Lead 和 Bass 同步切到 D 的切分节奏（`D - - D - D - -`），气氛收紧
- **Pre-Chorus**（8 小节）：Harm 进入，主歌主题第一次出现，Lead 在 A4 → F4 / D4 → A4 之间长音陈述
- **Chorus**（8 小节）：Lead / Harm 两条方波平行三度行进，从主题展开到三度爬升再回落到 F4 长音结束

整段音域横跨 **F2 → F5**（差不多四个八度）—— Bass 在 F2 / A2 / Bb2 / C3 / D3 给出根音支撑，Lead 在 A3 → F5 飞翔。

### 2. 合成链路（原生 WebAudio）

```
Lead 事件 → [ Osc (square)   ] → [ Gain (ADSR, peak=0.9 ) ] ─┐
Harm 事件 → [ Osc (square)   ] → [ Gain (ADSR, peak=0.5 ) ] ─┼→ [ Master gain (0.025) ] → 扬声器
Bass 事件 → [ Osc (triangle) ] → [ Gain (ADSR, peak=0.95) ] ─┘
```

启动播放时，把三个声部的事件**合并排序成一条按绝对时间升序的事件流** `EVENTS`，调度循环再统一吃这条流。三声部因此共享同一套调度，但每个事件保留自己的 `type` / `gain`。

每个事件（时长由乐谱决定，最短八分音符 ≈ 176ms、最长全音符 ≈ 1.4s）：

1. `ctx.createOscillator()`，`type` 来自该声部（Lead/Harm = `"square"`，Bass = `"triangle"`），`frequency = FREQ[note]`
2. `ctx.createGain()` 当作这个音符独立的包络节点；peak 值 = 该声部的 `gain`
3. 用一个轻量化的 ADSR 包络消除"咔"声爆音，并让长音真正"持续"：
   - t₀ 时刻 gain = `0`
   - 线性上升到 `peak`，耗时 5ms（attack）
   - 保持在 `peak`，直到 t₀ + (dur − release)
   - 线性回落到 `0`，在 t₀ + dur 时刻达到（release ≈ 25ms，对极短音符按 15% 自适应）
4. `osc.start(t₀)` / `osc.stop(t₀ + dur)` —— 震荡器停掉后会被 GC 回收
5. 调度循环使用**前瞻调度**：每 50ms 用 `setTimeout` 醒来一次，把"未来 200ms 之内"该响的事件全部用 `osc.start(精确时间)` 提前排进 WebAudio 时间线。`setTimeout` 本身的抖动因此不会积累成节奏漂移。事件流走完时游标归零、`songStart` 跳一个 loop 长度，下一轮无缝接上。

`master.gain.value = 0.025` 把整体音量压在"背景音乐"档位 —— 比单声部时代的 `0.04` 略低，因为三个声部叠加后峰值响度会自然抬高。如果将来觉得太响或太轻，这是最安全的单点调节。

### 3. 生命周期

- **首次点击**：创建 `AudioContext`、master `GainNode`，启动调度循环。
- **关掉**：把 `state.on = false`（下一次 tick 直接 return，不再排新音符）+ `master.disconnect()` 切断输出。已经排进 WebAudio 时间线、还没响完的音符会被静音掉，不会留尾音。
- **再次开启**：复用现有的 `AudioContext`（如果还存在），调度从头开始。浏览器对每个 tab 限制只能开一个 `AudioContext`，所以复用是正确做法。

## 为什么效果"牛逼"（拆解）

| 元素 | 选择 | 为什么有效 |
|---|---|---|
| 波形 | Lead/Harm 用 `square` 方波 + Bass 用 `triangle` 三角波 | 这正是 FC 的"旋律两条 + 贝斯一条"的标配。方波带来辨识度极高的中高频颗粒，三角波负责低频又不会糊作一团 —— 三角波几乎只有奇次谐波且大幅衰减，是 FC 工程师当年为贝斯选定的妥协方案。 |
| 声部 | Lead (0.9) + Harm (0.5) + Bass (0.95) | Lead 在最前景；Harm 故意压低到 Lead 一半左右，作为平行三度填充而不是抢戏的第二旋律；Bass 因为三角波感知响度本来就低，所以可以给到几乎和 Lead 一样的 gain。 |
| 节奏 | 170 BPM 4/4，最小单位八分音符 | Intro 流水般的八分走句直接把人扔进"关卡 BGM"语境；Verse 切到 `D - - D - D - -` 的切分制造紧张感；Pre-Chorus/Chorus 切到二分/四分的长音让旋律有呼吸。 |
| 包络 | 5ms attack + 持续 + ~25ms release | 没有它，方波在起停瞬间会产生"咔"声。中段保持在 peak 而不是线性衰减，这样附点二分音符 / 全音符这种长音不会有"消失"感。 |
| 音域 | F2 → F5（差不多四个八度） | Bass 在 F2 / A2 / Bb2 / C3 / D3 给根音支撑，Lead 落在 A3 → F5 的方波"甜区"，最顶上的 F5 正好顶在能量峰上。 |
| 曲式 | Intro → Verse → Pre-Chorus → Chorus | 不是"一句循环到底"。前奏走句、节奏切分、主题陈述、主歌爆发各占一段，听起来更像一首"短曲"而不是一段 riff。 |
| 循环长度 | 26 小节 ≈ 37 秒 | 比单声部时代的 ~85 秒短得多 —— 三声部信息密度本来就高，loop 短一点反而不容易产生疲劳。 |
| 主音量 | `master.gain = 0.025` | 三个声部叠加后即使是这个值也比单声部时代 `0.04` 听感更响。0.025 大约把综合峰值压在 -25 dBFS 上下，安静地坐在前台浏览体验下面，不抢戏。 |

## 局限

当前实现是刻意保持极简的。已知的取舍：

- **单声道（mono）**。三个声部全都汇入同一个 master，没有声像分离。真正的 FC 也基本是 mono，所以这其实是"对的"局限。
- **没有打击声部**。FC 的噪声通道（hi-hat / snare）和 DPCM 通道（采样鼓）这里都没实现，所以律动全靠 Bass 一条线撑着。
- **循环接缝硬切**。Chorus 最后一个 F4 长音 → Intro 开头 D4 八分之间没有过渡处理，闭眼听还是能感觉到回到原点。
- **没有相位失谐**。经典芯片音乐常常叠两个稍微失谐几个 cents 的方波制造"chorus"厚度感。单震荡器 = 听感偏薄。
- **十二平均律的频率表**。真正的 PSG 芯片用硬件分频器产生音高，会有微妙的非平均律偏差；这里没模拟。

## 升级路径（只在显式要求时才动）

按工作量从小到大：

1. **加 hi-hat / kick**：再加一个声部，用 `BufferSource` 装一段过滤过的白噪声，在弱拍上触发。在不动旋律的情况下补出律动 —— 这是当前最缺的一块。
2. **chorus 叠层**：把 Lead 的震荡器复制一份，失谐约 7 cents，混入 -6 dB。改动极小但厚度提升明显。
3. **Pulse width 变化**：用 `OscillatorNode` 替换 `PeriodicWave` 自定义占空比，从 50% 改到 25%（细方波）能切换出经典 FC "Pulse 1"的细脆音色。常用于副旋律以和主旋律区分。
4. **多段编曲 + 过渡**：现在已经有 Intro/Verse/Pre-Chorus/Chorus 的段落抽象了，可以把"播放顺序"参数化，每轮循环用 Markov 表挑下一段。开始有"在作曲"而不是"在循环"的感觉。
5. **预渲染 `.ogg` 芯片音乐**：直接放弃实时合成，由 Nginx 直出真实音频。音质天花板最高，但失去了"零资产"特性、并且要走一次 fetch。

以上都不在 v1 路线图里 —— 见 [architecture.md](./architecture.md#out-of-scope-for-v1)。

## 如果你要改这段代码

修改 `BgmToggle.tsx` 时请注意：

- 保持 `master.gain = 0.025` 作为默认音量 —— 三个声部叠加后这个值已经接近"背景音乐"上限，再往上就开始吵。如果某个声部听起来太弱，**优先调那个声部的 `gain`** 而不是 master。
- 不要把 Bass 的 `triangle` 换成 `square`：方波贝斯会和 Lead/Harm 频谱打架，瞬间糊成一团。FC 给贝斯通道选三角波是有道理的。
- 不要把 Lead 的 `square` 换成 `sawtooth` 之前先试听；锯齿波更刺耳，且包络需要重新调。
- 5ms 的 attack 是有意定得很紧的；改到 1ms 会重新出现"咔"声，改到 20ms 会让起音变"软"、破坏 8-bit 感。release 是 ~25ms（对极短音符按 15% 时长自适应），不要把它也压到 5ms —— 那样长音收尾时会突兀。
- 改谱时直接编辑 `LEAD` / `HARM` / `BASS` 模板字符串就行；token = 八分音符格子，`-` 延长上一事件，`_` 休止，`|` 仅作小节线视觉用。**三个声部的总八分数必须相等**（当前都是 208），否则 loop 会错位。BPM 改 `BPM` 常量；改完不需要算时长，解析器和调度器都基于八分音符栅格。
- 这个循环和 `Typewriter` / `PlayTime` **没有**共用调度器，是故意分开的 —— 三者节奏不同，任何一个 tick 漏了不应该带飞其他两个。
