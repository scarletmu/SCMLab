"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/primitives";
import { PixelButton } from "@/components/primitives/PixelButton";
import type { ProjectManual } from "@/lib/content";

export function ProjectsList({ projects }: { projects: ProjectManual[] }) {
  const [pending, setPending] = useState<ProjectManual | null>(null);

  useEffect(() => {
    if (!pending) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPending(null);
      if (e.key === "Enter" && pending?.url) {
        window.open(pending.url, "_blank", "noopener,noreferrer");
        setPending(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending]);

  return (
    <>
      {projects.map((p, i) => {
        const clickable = Boolean(p.url);
        return (
          <div
            key={p.name}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={() => clickable && setPending(p)}
            onKeyDown={(e) => {
              if (!clickable) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPending(p);
              }
            }}
            className={clickable ? "invert-hover" : undefined}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr auto",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              border: "2px solid var(--color-ink)",
              background: "var(--color-paper)",
              boxShadow: "var(--shadow-drop-sm)",
              flex: 1,
              cursor: clickable ? "pointer" : "default",
            }}
          >
            <span className="en" style={{ fontSize: 12 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2 items-center">
                <span className="en" style={{ fontSize: 12 }}>
                  {p.name}
                </span>
                <Chip>{p.lang}</Chip>
              </div>
              <span
                className="mono"
                style={{ fontSize: 14, color: "var(--color-mid)" }}
              >
                {p.desc}
              </span>
            </div>
            <div className="flex flex-col items-end" style={{ gap: 2 }}>
              <span className="mono" style={{ fontSize: 14 }}>
                ★ {p.stars}
              </span>
              <span
                className="mono"
                style={{ fontSize: 13, color: "var(--color-mid)" }}
              >
                ⑂ {p.forks}
              </span>
            </div>
          </div>
        );
      })}

      {pending && (
        <ConfirmModal
          project={pending}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            if (pending.url) {
              window.open(pending.url, "_blank", "noopener,noreferrer");
            }
            setPending(null);
          }}
        />
      )}
    </>
  );
}

function ConfirmModal({
  project,
  onCancel,
  onConfirm,
}: {
  project: ProjectManual;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="modal-overlay-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background:
          "repeating-linear-gradient(0deg, rgba(12,26,17,0.78) 0 2px, rgba(12,26,17,0.92) 2px 4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="win modal-wipe-in"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(420px, 100%)" }}
      >
        <div className="win-title">
          <span>◆ CONFIRM · 外部链接</span>
          <span className="en" style={{ fontSize: 8 }}>
            !! / !!
          </span>
        </div>
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <p
            className="cjk"
            style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}
          >
            即将离开本站，前往 GitHub 查看
            <span className="en" style={{ margin: "0 6px", fontSize: 12 }}>
              {project.name}
            </span>
            ，是否继续？
          </p>
          <div
            className="win-recessed"
            style={{
              padding: "8px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              wordBreak: "break-all",
              color: "var(--color-ink)",
            }}
          >
            {project.url}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            }}
          >
            <PixelButton ghost onClick={onCancel}>
              <span style={{ opacity: 0.7 }}>B</span> 取消
            </PixelButton>
            <PixelButton onClick={onConfirm} autoFocus>
              <span style={{ opacity: 0.7 }}>A</span> 前往
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
