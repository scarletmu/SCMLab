import Image from "next/image";
import { ImgPh } from "@/components/primitives";
import type { Itasha } from "@/lib/content";

export function ItashaGallery({ items }: { items: Itasha[] }) {
  return (
    <div className="win">
      <div className="win-title">
        <span>◆ ITASHA · 痛车</span>
        <span className="en" style={{ fontSize: 8 }}>
          {items.length} PHOTOS
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
          {items.map((it, i) => (
            <div
              key={i}
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
        </div>
      </div>
    </div>
  );
}
