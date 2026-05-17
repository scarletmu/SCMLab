"use client";

import { useRef, useState } from "react";
import { PixelButton } from "@/components/primitives/PixelButton";

// Mega-Man-ish riff in A minor
const NOTES = [
  "A4", "C5", "E5", "A5", "G5", "E5", "C5", "E5",
  "F5", "A5", "C6", "A5", "G5", "E5", "C5", "D5",
  "E5", "G5", "B5", "D6", "C6", "B5", "G5", "E5",
  "A5", "E5", "C5", "A4", "G4", "A4", "C5", "E5",
];
const FREQ: Record<string, number> = {
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
};

type Chiptune = {
  ctx: AudioContext;
  master: GainNode;
  on: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

export function BgmToggle() {
  const [on, setOn] = useState(false);
  const ref = useRef<Chiptune | null>(null);

  function play() {
    if (ref.current?.on) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = ref.current?.ctx ?? new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.04;
    master.connect(ctx.destination);
    const state: Chiptune = { ctx, master, on: true, timer: null };
    ref.current = state;

    const stepMs = 130;
    let i = 0;
    const playOne = () => {
      if (!state.on) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = FREQ[NOTES[i % NOTES.length]] ?? 440;
      osc.connect(g);
      g.connect(master);
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(1, t0 + 0.005);
      g.gain.linearRampToValueAtTime(0, t0 + stepMs / 1000 - 0.005);
      osc.start(t0);
      osc.stop(t0 + stepMs / 1000);
      i += 1;
      state.timer = setTimeout(playOne, stepMs);
    };
    playOne();
  }

  function stop() {
    const state = ref.current;
    if (!state) return;
    state.on = false;
    if (state.timer) clearTimeout(state.timer);
    try {
      state.master.disconnect();
    } catch {}
  }

  return (
    <PixelButton
      onClick={() => {
        if (on) {
          stop();
          setOn(false);
        } else {
          play();
          setOn(true);
        }
      }}
    >
      ♪ BGM {on ? "ON" : "OFF"}
    </PixelButton>
  );
}
