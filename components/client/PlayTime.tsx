"use client";

import { useEffect, useState } from "react";

const BASE_SECS = 3 * 3600 + 14 * 60 + 27;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PlayTime() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const total = BASE_SECS + tick;
  const hh = pad(Math.floor(total / 3600));
  const mm = pad(Math.floor((total % 3600) / 60));
  const ss = pad(total % 60);
  const ff = pad((tick * 17) % 60); // fake frame counter
  return (
    <span className="mono" style={{ fontSize: 14 }}>
      play-time&nbsp;{hh}:{mm}:{ss}:{ff}
    </span>
  );
}
