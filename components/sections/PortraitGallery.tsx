import Image from "next/image";
import { ImgPh } from "@/components/primitives";
import type { Portrait } from "@/lib/content";

export function PortraitGallery({ items }: { items: Portrait[] }) {
  return (
    <div className="win">
      <div className="win-title">
        <span>◆ PORTRAIT · 人像</span>
        <span className="en" style={{ fontSize: 8 }}>
          SET 03
        </span>
      </div>
      <div style={{ padding: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
          }}
        >
          {items.map((p) => (
            <div key={p.id}>
              {p.image ? (
                <div
                  style={{
                    aspectRatio: "3 / 4",
                    border: "2px solid var(--color-ink)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="100px"
                    style={{
                      objectFit: "cover",
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
              ) : (
                <ImgPh label={p.id} ratio="3/4" />
              )}
              <div
                className="en"
                style={{ fontSize: 8, marginTop: 4, textAlign: "center" }}
              >
                {p.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
