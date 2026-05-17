import { Dotted } from "@/components/primitives";
import type { NowManual, LogEntry } from "@/lib/content";

export function NowPanel({
  now,
  weatherLabel,
  log,
}: {
  now: NowManual;
  weatherLabel: string;
  log: LogEntry[];
}) {
  const rows: Array<[string, string]> = [
    ["CODE", now.code],
    ["♪", now.music],
    ["BOOK", now.book],
    ["LOC", weatherLabel],
    ["CAR", now.car],
  ];
  return (
    <div className="win grow">
      <div className="win-title">
        <span>◆ NOW · 当前状态</span>
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div style={{ padding: 12 }} className="flex flex-col gap-2">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex flex-row items-center"
            style={{ gap: 12 }}
          >
            <span
              className="en"
              style={{ fontSize: 8, width: 44, color: "var(--color-mid)" }}
            >
              {k}
            </span>
            <span className="mono" style={{ fontSize: 14 }}>
              {v}
            </span>
          </div>
        ))}
        <Dotted />
        <div className="en" style={{ fontSize: 9 }}>
          RECENT LOG
        </div>
        {log.map((l, i) => (
          <div key={i} className="flex flex-row" style={{ gap: 12 }}>
            <span
              className="mono"
              style={{ fontSize: 13, color: "var(--color-mid)" }}
            >
              {l.t}
            </span>
            <span className="mono" style={{ fontSize: 13 }}>
              {l.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
