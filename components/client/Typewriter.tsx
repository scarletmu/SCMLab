"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  text,
  speed = 32,
  startDelay = 0,
  prefix = "",
  className,
  style,
  showCaretWhenDone = false,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  showCaretWhenDone?: boolean;
}) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          setDone(true);
          return;
        }
        timer = setTimeout(tick, speed);
      };
      tick();
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(start);
      clearTimeout(timer!);
    };
  }, [text, speed, startDelay]);
  return (
    <span className={className} style={style}>
      {done ? prefix + text : out}
      {(!done || showCaretWhenDone) && <span className="caret">_</span>}
    </span>
  );
}
