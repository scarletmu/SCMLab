import { cn } from "@/lib/cn";

export function Chip({
  children,
  className,
  solid,
  invertHover,
}: {
  children: React.ReactNode;
  className?: string;
  solid?: boolean;
  invertHover?: boolean;
}) {
  return (
    <span
      className={cn(
        "chip",
        solid && "solid",
        invertHover && "invert-hover",
        className,
      )}
    >
      {children}
    </span>
  );
}
