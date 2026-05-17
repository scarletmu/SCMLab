export function FooterHints() {
  return (
    <div
      className="mono"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        fontSize: 13,
        color: "var(--color-mid)",
        pointerEvents: "none",
      }}
    >
      © {new Date().getFullYear()} ScarletMu · save-file 01 · press START
    </div>
  );
}
