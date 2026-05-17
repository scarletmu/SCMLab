import type { DailyCode } from "@/lib/prng";

const HEAT_VARS = [
  "var(--color-paper-2)",
  "var(--color-wash)",
  "var(--color-mid)",
  "var(--color-ink)",
] as const;

const CELL = 22;
const GAP = 6;

export function Contributions({ daily }: { daily: DailyCode }) {
  return (
    <div className="win">
      <div className="win-title">
        <span>◆ DAILY CODE · 每日提交</span>
        <span className="en" style={{ fontSize: 8 }}>
          STREAK {daily.streakDays}d
        </span>
      </div>
      <div
        style={{
          padding: "14px 16px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 16,
          alignItems: "center",
        }}
      >
        {/* Left — 7 daily blocks + weekday letters */}
        <div className="flex flex-col" style={{ gap: 5 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(7, ${CELL}px)`,
              gap: GAP,
            }}
          >
            {daily.last7.map((d, i) => (
              <i
                key={i}
                style={{
                  width: CELL,
                  height: CELL,
                  border: "2px solid var(--color-ink)",
                  background: HEAT_VARS[d.lvl],
                  boxShadow: d.today
                    ? "0 0 0 2px var(--color-paper), 0 0 0 4px var(--color-ink)"
                    : undefined,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(7, ${CELL}px)`,
              gap: GAP,
            }}
          >
            {daily.last7.map((d, i) => (
              <span
                key={i}
                className="en"
                style={{
                  fontSize: 8,
                  color: "var(--color-mid)",
                  textAlign: "center",
                }}
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>

        {/* Middle — LAST PUSH */}
        <div
          style={{
            borderLeft: "2px dashed var(--color-ink)",
            paddingLeft: 14,
            minWidth: 0,
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div
            className="en"
            style={{
              fontSize: 8,
              color: "var(--color-mid)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            LAST PUSH · {daily.lastPush.ago} · {daily.lastPush.branch}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--color-ink)",
            }}
          >
            {daily.lastPush.sha} · {daily.lastPush.msg}
          </div>
        </div>

        {/* Right — streak combo badge */}
        <div
          style={{
            background: "var(--color-ink)",
            border: "2px solid var(--color-ink)",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            minWidth: 60,
          }}
        >
          <span
            className="en"
            style={{ fontSize: 8, color: "var(--color-paper)" }}
          >
            COMBO
          </span>
          <span
            className="mono"
            style={{
              fontSize: 22,
              lineHeight: 1,
              color: "var(--color-paper)",
            }}
          >
            ×{daily.streakDays}
          </span>
        </div>
      </div>
    </div>
  );
}
