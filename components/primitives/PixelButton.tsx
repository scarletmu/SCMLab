import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ghost?: boolean;
  cjk?: boolean;
};

export function PixelButton({
  ghost,
  cjk,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={cn("pbtn", ghost && "ghost", cjk && "cjk", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
