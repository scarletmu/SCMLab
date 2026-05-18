import Image from "next/image";
import { Chip, ImgPh, Dotted, Arrow } from "@/components/primitives";
import { Typewriter } from "@/components/client/Typewriter";
import type {
  Character,
  Stat,
  EquipmentItem,
} from "@/lib/content";

export function CharacterFile({
  character,
  stats,
  equipment,
  skills,
}: {
  character: Character;
  stats: Stat[];
  equipment: EquipmentItem[];
  skills: string[];
}) {
  return (
    <div className="win flex flex-col overflow-hidden">
      <div className="win-title">
        <span>◆ CHARACTER FILE · 角色档案</span>
        <span className="en" style={{ fontSize: 8 }}>
          ID No. {character.idNo}
        </span>
      </div>

      {/* Portrait + identity */}
      <div
        style={{
          padding: 14,
          display: "grid",
          gridTemplateColumns: "190px 1fr",
          gap: 14,
        }}
      >
        {character.image ? (
          <div
            style={{
              aspectRatio: "1 / 1",
              border: "2px solid var(--color-ink)",
              position: "relative",
              overflow: "hidden",
              background: "var(--color-paper)",
            }}
          >
            <Image
              src={character.image}
              alt={`${character.handle} portrait`}
              fill
              priority
              sizes="190px"
              style={{
                objectFit: "cover",
                imageRendering: "pixelated",
              }}
            />
          </div>
        ) : (
          <ImgPh label="PORTRAIT" ratio="1/1" />
        )}

        <div className="flex flex-col gap-3 justify-between">
          <div>
            <div className="en" style={{ fontSize: 20, lineHeight: 1.1 }}>
              <Typewriter
                text={character.handle.toUpperCase()}
                speed={70}
                startDelay={200}
              />
            </div>
            <div
              className="mono"
              style={{ fontSize: 14, marginTop: 4, color: "var(--color-mid)" }}
            >
              {character.class}
            </div>
            <div
              className="t-mono"
              style={{ fontSize: 13, marginTop: 6, color: "var(--color-ink)" }}
            >
              <Typewriter
                text={`> ${character.tagline}…`}
                speed={32}
                startDelay={1100}
                showCaretWhenDone
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "5px 10px",
              alignItems: "center",
            }}
          >
            <span
              className="en"
              style={{ fontSize: 8, color: "var(--color-mid)" }}
            >
              LV.
            </span>
            <span className="mono" style={{ fontSize: 15 }}>
              {character.lv}
            </span>
            <span
              className="en"
              style={{ fontSize: 8, color: "var(--color-mid)" }}
            >
              EXP
            </span>
            <div
              className="seg"
              style={{ gridTemplateColumns: "repeat(20, 1fr)" }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <i key={i} className={i < character.exp ? "on" : ""} />
              ))}
            </div>
            <span
              className="en"
              style={{ fontSize: 8, color: "var(--color-mid)" }}
            >
              GOLD
            </span>
            <span className="mono" style={{ fontSize: 14 }}>
              {character.gold}
            </span>
            <span
              className="en"
              style={{ fontSize: 8, color: "var(--color-mid)" }}
            >
              HOME
            </span>
            <span className="mono" style={{ fontSize: 13 }}>
              {character.home}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div style={{ padding: "0 14px 12px" }}>
        <div
          className="en"
          style={{ fontSize: 8, color: "var(--color-mid)", marginBottom: 6 }}
        >
          SKILLS
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {skills.map((s) => (
            <Chip key={s} invertHover>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <Dotted />

      {/* Stats */}
      <div style={{ padding: "10px 14px 8px" }}>
        <div
          className="en"
          style={{ fontSize: 8, color: "var(--color-mid)", marginBottom: 6 }}
        >
          STATS
        </div>
        <div className="flex flex-col gap-2">
          {stats.map((s) => (
            <div
              key={s.k}
              className="flex flex-row items-center"
              style={{ gap: 10 }}
            >
              <span className="en" style={{ fontSize: 9, width: 32 }}>
                {s.k}
              </span>
              <div
                className="seg"
                style={{ flex: 1, gridTemplateColumns: "repeat(22, 1fr)" }}
              >
                {Array.from({ length: 22 }).map((_, i) => (
                  <i key={i} className={i < s.v ? "on" : ""} />
                ))}
              </div>
              <span
                className="mono"
                style={{ fontSize: 14, width: 22, textAlign: "right" }}
              >
                {s.v}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  color: "var(--color-mid)",
                  width: 80,
                }}
              >
                {s.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dotted />

      {/* Equipment */}
      <div style={{ padding: "10px 14px 12px" }}>
        <div
          className="en"
          style={{ fontSize: 8, color: "var(--color-mid)", marginBottom: 6 }}
        >
          EQUIPMENT
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {equipment.map((e) => (
            <div
              key={e.slot}
              className="invert-hover"
              style={{
                border: "2px solid var(--color-ink)",
                background: "var(--color-paper-2)",
                padding: 7,
                position: "relative",
              }}
            >
              <i
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  width: 4,
                  height: 4,
                  background: "var(--color-ink)",
                }}
              />
              <i
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 4,
                  height: 4,
                  background: "var(--color-ink)",
                }}
              />
              <div
                className="en"
                style={{ fontSize: 8, color: "var(--color-mid)" }}
              >
                {e.slot}
              </div>
              <div className="mono" style={{ fontSize: 13, marginTop: 2 }}>
                {e.name}
              </div>
              <div className="en" style={{ fontSize: 8, marginTop: 2 }}>
                {e.lvl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dotted />

      {/* Controller hint — decorative FC button glyphs with cheeky tooltips */}
      <div style={{ padding: "20px 14px 14px" }}>
        <div
          className="en"
          style={{
            fontSize: 8,
            color: "var(--color-mid)",
            marginBottom: 12,
          }}
        >
          CONTROLS · 假装能按
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr",
            gap: "10px 14px",
            alignItems: "center",
          }}
        >
          {/* Row 1 — D-Pad */}
          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: "6px 6px 6px",
              gridTemplateRows: "6px 6px 6px",
              gap: 1,
              justifySelf: "center",
            }}
          >
            <span />
            <span style={{ background: "var(--color-ink)" }} />
            <span />
            <span style={{ background: "var(--color-ink)" }} />
            <span style={{ background: "var(--color-ink)" }} />
            <span style={{ background: "var(--color-ink)" }} />
            <span />
            <span style={{ background: "var(--color-ink)" }} />
            <span />
          </div>
          <div
            className="t-mono"
            style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.3 }}
          >
            <span style={{ color: "var(--color-mid)" }}>D-PAD </span>
            往哪戳都没用 —— 旅人，原地即终点。
          </div>

          {/* Row 2 — SELECT · START */}
          <div
            aria-hidden
            style={{ display: "flex", gap: 4, justifyContent: "center" }}
          >
            <span
              style={{ width: 16, height: 5, background: "var(--color-ink)" }}
            />
            <span
              style={{ width: 16, height: 5, background: "var(--color-ink)" }}
            />
          </div>
          <div
            className="t-mono"
            style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.3 }}
          >
            <span style={{ color: "var(--color-mid)" }}>SEL · STR </span>
            菜单已封印，存档点早就落灰了。
          </div>

          {/* Row 3 — B · A */}
          <div
            aria-hidden
            style={{ display: "flex", gap: 4, justifyContent: "center" }}
          >
            {(["B", "A"] as const).map((k) => (
              <span
                key={k}
                className="mono"
                style={{
                  width: 16,
                  height: 16,
                  background: "var(--color-ink)",
                  color: "var(--color-paper)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  lineHeight: 1,
                }}
              >
                {k}
              </span>
            ))}
          </div>
          <div
            className="t-mono"
            style={{ fontSize: 13, color: "var(--color-ink)", lineHeight: 1.3 }}
          >
            <span style={{ color: "var(--color-mid)" }}>B · A </span>
            取消与确认 —— 全都没接线，请用鼠标。
          </div>
        </div>
      </div>

      {/* Dialogue footer */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "2px solid var(--color-ink)",
          padding: "12px 16px",
          background: "var(--color-paper-2)",
        }}
      >
        <div className="t-mono" style={{ fontSize: 14, lineHeight: 1.35 }}>
          {character.handle}：「你好，旅人。从右侧选一个房间开始探索吧。」
          <span
            style={{
              display: "inline-block",
              marginLeft: 8,
              verticalAlign: "middle",
            }}
          >
            <Arrow right />
          </span>
        </div>
      </div>
    </div>
  );
}
