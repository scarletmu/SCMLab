import { StatBar } from "@/components/primitives";
import { PixelButton } from "@/components/primitives/PixelButton";
import { PlayTime } from "@/components/client/PlayTime";
import { BgmToggle } from "@/components/client/BgmToggle";
import type { Character } from "@/lib/content";

export function TopStatusBar({
  character,
  weatherLabel,
}: {
  character: Character;
  weatherLabel: string;
}) {
  return (
    <div className="win mb-4 p-0">
      {/* Row 1 — identity strip (inverted) */}
      <div
        className="status-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto auto auto",
          alignItems: "center",
          gap: 18,
          padding: "8px 16px",
          borderBottom: "2px solid var(--color-ink)",
        }}
      >
        <span className="en" style={{ fontSize: 11 }}>
          ★ {character.fileNo}
        </span>
        <PlayTime />
        <span
          className="en"
          style={{
            fontSize: 9,
            justifySelf: "center",
            letterSpacing: "0.16em",
          }}
        >
          {character.saveLabel}
        </span>
        <span className="mono" style={{ fontSize: 13 }}>
          {weatherLabel}
        </span>
        <span className="en" style={{ fontSize: 9 }}>
          LV.{character.lv}
        </span>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>

      {/* Row 2 — gauges */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.1fr 1.6fr auto",
          gap: 24,
          padding: "14px 18px",
          alignItems: "center",
        }}
      >
        <div className="flex flex-col gap-2">
          <span className="en" style={{ fontSize: 8 }}>
            HP
          </span>
          <StatBar value={character.hp.now} max={character.hp.max} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="en" style={{ fontSize: 8 }}>
            MP
          </span>
          <StatBar value={character.mp.now} max={character.mp.max} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="en" style={{ fontSize: 8 }}>
            EXP · LV.{character.lv} → LV.{character.lv + 1}
          </span>
          <StatBar value={character.exp} segmented />
        </div>
        <div className="flex flex-row gap-2">
          <BgmToggle />
          <PixelButton ghost>？ HELP</PixelButton>
        </div>
      </div>
    </div>
  );
}
