import Image from "next/image";
import { ImgPh } from "@/components/primitives";
import type { Itasha } from "@/lib/content";

const SLOTS = 4;

export function ItashaGallery({ items }: { items: Itasha[] }) {
  const filled = items.slice(0, SLOTS);
  const emptyCount = SLOTS - filled.length;

  return (
    <div className="win">
      <div className="win-title">
        <span>◆ ITASHA · 痛车</span>
        <span className="en" style={{ fontSize: 8 }}>
          {filled.length} / {SLOTS} PHOTOS
        </span>
      </div>
      <div style={{ padding: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
          }}
        >
          {filled.map((it, i) => (
            <div
              key={`f-${i}`}
              className="invert-hover"
              style={{
                border: "2px solid var(--color-ink)",
                background: "var(--color-paper)",
                padding: 6,
              }}
            >
              {it.image ? (
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    border: "2px solid var(--color-ink)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={it.image}
                    alt={it.car}
                    fill
                    sizes="180px"
                    style={{
                      objectFit: "cover",
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
              ) : (
                <ImgPh label={`car-0${i + 1}.png`} ratio="4/3" />
              )}
              <div className="flex flex-col" style={{ paddingTop: 6 }}>
                <span className="mono" style={{ fontSize: 13 }}>
                  {it.car}
                </span>
                <span
                  className="en"
                  style={{
                    fontSize: 8,
                    color: "var(--color-mid)",
                    marginTop: 2,
                  }}
                >
                  {it.place} · {it.date}
                </span>
              </div>
            </div>
          ))}

          {Array.from({ length: emptyCount }).map((_, i) => (
            <div
              key={`e-${i}`}
              style={{
                border: "2px solid var(--color-ink)",
                background: "var(--color-paper)",
                padding: 6,
              }}
            >
              <div
                className="warn-tape"
                style={{ aspectRatio: "4 / 3" }}
                aria-label="garage closed"
              >
                <span className="sign">CLOSED</span>
              </div>
              <div className="flex flex-col" style={{ paddingTop: 6 }}>
                <span
                  className="mono"
                  style={{ fontSize: 13, color: "var(--color-ink-soft)" }}
                >
                  ——
                </span>
                <span
                  className="en"
                  style={{
                    fontSize: 8,
                    color: "var(--color-mid)",
                    marginTop: 2,
                  }}
                >
                  準備中 · TBA
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
