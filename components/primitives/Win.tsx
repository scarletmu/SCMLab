import { cn } from "@/lib/cn";

type WinProps = {
  title?: React.ReactNode;
  trailing?: React.ReactNode;
  showDots?: boolean;
  bodyClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function Win({
  title,
  trailing,
  showDots = false,
  bodyClassName,
  className,
  style,
  children,
}: WinProps) {
  return (
    <div className={cn("win flex flex-col", className)} style={style}>
      {title !== undefined && (
        <div className="win-title">
          <span>{title}</span>
          {trailing !== undefined ? (
            <span>{trailing}</span>
          ) : showDots ? (
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
          ) : null}
        </div>
      )}
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </div>
  );
}

export function WinDots() {
  return (
    <span className="dots">
      <i />
      <i />
      <i />
    </span>
  );
}
