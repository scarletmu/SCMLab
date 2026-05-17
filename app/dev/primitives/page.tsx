import {
  Win,
  Chip,
  StatBar,
  ImgPh,
  Dotted,
  Caret,
  Arrow,
  PixelButton,
} from "@/components/primitives";

export const metadata = { title: "Primitives · dev" };

export default function DevPrimitives() {
  return (
    <main className="pixel paper-bg min-h-screen p-6 space-y-6">
      <h1 className="en text-base">◆ DESIGN PRIMITIVES · 视觉对照</h1>
      <p className="mono text-sm">
        和 claude-design 原始 HTML（`assets` 分支下 `_design/ScarletMu Home.html`）1:1 对照。发布前删此页。
      </p>

      <div className="grid grid-cols-2 gap-6">
        <Win title="◆ WIN · 基础窗体" showDots>
          <p className="mono text-base">这是 `.win` 容器，4px ink 阴影。</p>
          <Dotted />
          <p className="mono text-base">
            带 caret 的输入感{" "}
            <Caret />
          </p>
        </Win>

        <Win
          title="◆ CHIPS · 标签"
          trailing={<span className="en text-[8px]">12 TAGS</span>}
        >
          <div className="flex flex-wrap gap-2">
            <Chip>TypeScript</Chip>
            <Chip>React</Chip>
            <Chip>Next.js</Chip>
            <Chip solid>SOLID</Chip>
            <Chip invertHover>HOVER ME</Chip>
          </div>
        </Win>

        <Win title="◆ BARS · 进度条">
          <div className="space-y-2">
            <StatBar label="HP" value={78} max={100} />
            <StatBar label="MP" value={42} max={100} />
            <StatBar label="EXP" value={14} segmented />
          </div>
        </Win>

        <Win title="◆ BUTTONS">
          <div className="flex flex-wrap gap-2 items-center">
            <PixelButton>♪ BGM OFF</PixelButton>
            <PixelButton ghost>？ HELP</PixelButton>
            <PixelButton cjk>开始游戏</PixelButton>
          </div>
        </Win>

        <Win title="◆ IMG PLACEHOLDER">
          <div className="grid grid-cols-2 gap-2">
            <ImgPh label="PORTRAIT" ratio="3/4" />
            <ImgPh label="car-01.png" ratio="4/3" />
          </div>
        </Win>

        <Win title="◆ ARROW + CARET">
          <p className="t-mono">
            旅人，前进吧 <Arrow right />
          </p>
          <Dotted />
          <p className="mono text-base">
            打字中 <Caret />
          </p>
        </Win>
      </div>
    </main>
  );
}
