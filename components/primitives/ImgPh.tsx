import { cn } from "@/lib/cn";

export function ImgPh({
  label,
  ratio = "4 / 3",
  className,
  style,
}: {
  label?: string;
  ratio?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("imgph", className)}
      style={{ aspectRatio: ratio, ...style }}
    >
      {label && <span className="label mono">{label}</span>}
    </div>
  );
}
