import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  value: number;
  /** total when in standard mode, also used as visual cap when in segmented mode (defaults to 20) */
  max?: number;
  /** when true, renders N segments instead of a single fill bar */
  segmented?: boolean;
  /** number of segments to render when segmented; defaults to max ?? 20 */
  segments?: number;
  /** hide the trailing numeric readout */
  hideReadout?: boolean;
  className?: string;
  labelWidth?: number;
  readoutWidth?: number;
  readoutFontSize?: number;
};

export function StatBar({
  label,
  value,
  max = 100,
  segmented,
  segments,
  hideReadout,
  className,
  labelWidth = 28,
  readoutWidth = 56,
  readoutFontSize = 14,
}: Props) {
  const segCount = segments ?? (segmented ? max : 20);
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={cn("bar", className)}>
      {label !== undefined && label !== "" && (
        <span
          className="en"
          style={{ fontSize: 9, width: labelWidth }}
        >
          {label}
        </span>
      )}
      {segmented ? (
        <div
          className="seg"
          style={{
            flex: 1,
            gridTemplateColumns: `repeat(${segCount}, 1fr)`,
          }}
        >
          {Array.from({ length: segCount }).map((_, i) => (
            <i key={i} className={i < value ? "on" : ""} />
          ))}
        </div>
      ) : (
        <div className="bar-track">
          <div className="bar-fill" style={{ width: pct + "%" }} />
        </div>
      )}
      {!hideReadout && (
        <span
          className="mono"
          style={{
            fontSize: readoutFontSize,
            width: readoutWidth,
            textAlign: "right",
          }}
        >
          {segmented ? `${value}/${segCount}` : `${value}/${max}`}
        </span>
      )}
    </div>
  );
}
