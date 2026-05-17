import { cn } from "@/lib/cn";

export function Dotted({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn("dotted", className)} style={style} />;
}

export function Caret() {
  return <span className="caret">_</span>;
}

export function Arrow({ right = false }: { right?: boolean }) {
  return <span className={cn("arrow", right && "r")} />;
}
