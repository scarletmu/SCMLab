"use client";

import { useRef, useState } from "react";
import { PixelButton } from "@/components/primitives/PixelButton";

// 三声部芯片乐谱,4/4,♩=170,每格 = 八分音符
const BPM = 170;
const EIGHTH = 30 / BPM; // 八分音符时长 (s) = 60 / BPM / 2

const FREQ: Record<string, number> = {
  F2: 87.31, A2: 110.0, Bb2: 116.54, C3: 130.81, D3: 146.83,
  A3: 220.0, Bb3: 233.08,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
};

// [音名 | null = 休止, 时长 (单位:八分音符个数)]
type Ev = [string | null, number];

// 每个 token 占 1 个八分音符。`-` 延长上一事件,`_` 休止,`|` 当作空格忽略
function parseVoice(text: string): Ev[] {
  const tokens = text.split(/[\s|]+/).filter(Boolean);
  const out: Ev[] = [];
  for (const t of tokens) {
    if (t === "-") {
      if (out.length > 0) out[out.length - 1][1] += 1;
    } else if (t === "_") {
      if (out.length > 0 && out[out.length - 1][0] === null) {
        out[out.length - 1][1] += 1;
      } else {
        out.push([null, 1]);
      }
    } else {
      out.push([t, 1]);
    }
  }
  return out;
}

// Lead (主旋律) — 26 小节,贯穿全曲
const LEAD = parseVoice(`
  D4 A4 D5 E5 F5 E5 D5 A4 | D4 A4 D5 E5 F5 E5 D5 A4
  Bb3 F4 Bb4 C5 D5 C5 Bb4 F4 | Bb3 F4 Bb4 C5 D5 C5 Bb4 F4
  A3 E4 A4 Bb4 C5 Bb4 A4 E4 | A3 E4 A4 Bb4 C5 Bb4 A4 E4
  C4 G4 C5 D5 E5 D5 C5 G4 | C4 G4 C5 D5 E5 D5 C5 G4
  D4 - - D4 - D4 - - | D4 - - D4 - D4 - -
  A4 - - - - - A4 - | G4 - - - - - F4 -
  D4 - - - F4 - - - | G4 - - - A4 - - -
  A4 - - - - - A4 - | G4 - - - - - F4 -
  D4 - - - F4 - - - | G4 - - - - - - -
  A4 - Bb4 - C5 - C5 - | Bb4 - A4 - G4 - A4 -
  A4 - Bb4 - C5 - C5 - | D5 - C5 - Bb4 - A4 -
  F5 - E5 - D5 - C5 - | D5 - C5 - Bb4 - A4 -
  G4 - A4 - Bb4 - C5 - | A4 - G4 - F4 - - -
`);

// Harm (副旋律) — Intro+Verse 静音 (80 个八分休止),Pre-Chorus 起进入
const HARM = parseVoice(`
  ${"_ ".repeat(80)}
  F4 - - - - - F4 - | E4 - - - - - C4 -
  A3 - - - C4 - - - | D4 - - - E4 - - -
  F4 - - - - - F4 - | E4 - - - - - C4 -
  A3 - - - C4 - - - | D4 - - - - - - -
  F4 - G4 - A4 - A4 - | G4 - F4 - E4 - F4 -
  F4 - G4 - A4 - A4 - | Bb4 - A4 - G4 - F4 -
  A4 - G4 - F4 - E4 - | F4 - E4 - D4 - C4 -
  E4 - F4 - G4 - A4 - | F4 - E4 - C4 - - -
`);

// Bass — 全程踩根音,Intro/Pre-Chorus/Chorus 多为整小节长音,Verse 跟着 Lead 切分
const BASS = parseVoice(`
  D3 - - - - - - - | D3 - - - - - - -
  Bb2 - - - - - - - | Bb2 - - - - - - -
  A2 - - - - - - - | A2 - - - - - - -
  C3 - - - - - - - | C3 - - - - - - -
  D3 - - D3 - D3 - - | D3 - - D3 - D3 - -
  Bb2 - - - - - - - | C3 - - - - - - -
  D3 - - - - - - - | A2 - - - - - - -
  Bb2 - - - - - - - | C3 - - - - - - -
  D3 - - - - - - - | F2 - - - - - - -
  Bb2 - - - - - - - | C3 - - - - - - -
  D3 - - - - - - - | A2 - - - - - - -
  Bb2 - - - - - - - | C3 - - - - - - -
  D3 - - - - - - - | F2 - - - - - - -
`);

type Voice = { events: Ev[]; type: OscillatorType; gain: number };
const VOICES: Voice[] = [
  { events: LEAD, type: "square",   gain: 0.9 },  // 主旋律 — 方波,经典 NES 旋律通道
  { events: HARM, type: "square",   gain: 0.5 },  // 副旋律 — 也是方波,但压低让 Lead 在上面
  { events: BASS, type: "triangle", gain: 0.95 }, // 贝斯 — 三角波,NES 贝斯通道音色
];

type Note = { type: OscillatorType; gain: number; note: string; t: number; dur: number };
const EVENTS: Note[] = (() => {
  const out: Note[] = [];
  for (const v of VOICES) {
    let t = 0;
    for (const [note, dur] of v.events) {
      if (note !== null) out.push({ type: v.type, gain: v.gain, note, t, dur });
      t += dur;
    }
  }
  out.sort((a, b) => a.t - b.t);
  return out;
})();

const TOTAL_EIGHTHS = Math.max(
  ...VOICES.map((v) => v.events.reduce((a, [, d]) => a + d, 0)),
);

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
    // 三声部叠加,master 比单声部时代略低
    master.gain.value = 0.025;
    master.connect(ctx.destination);
    const state: Chiptune = { ctx, master, on: true, timer: null };
    ref.current = state;

    let cursor = 0;
    let songStart = ctx.currentTime + 0.05;
    const loopDur = TOTAL_EIGHTHS * EIGHTH;

    const scheduleTick = () => {
      if (!state.on) return;
      const lookahead = ctx.currentTime + 0.2;
      // 前瞻调度:把未来 200ms 内该响的所有声部事件全部排进 WebAudio 时间线
      while (true) {
        const ev = EVENTS[cursor];
        const startAt = songStart + ev.t * EIGHTH;
        if (startAt >= lookahead) break;
        const dur = ev.dur * EIGHTH;

        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = ev.type;
        osc.frequency.value = FREQ[ev.note] ?? 440;
        osc.connect(g);
        g.connect(master);

        const attack = 0.005;
        const release = Math.min(0.025, dur * 0.15);
        g.gain.setValueAtTime(0, startAt);
        g.gain.linearRampToValueAtTime(ev.gain, startAt + attack);
        g.gain.setValueAtTime(ev.gain, startAt + dur - release);
        g.gain.linearRampToValueAtTime(0, startAt + dur);
        osc.start(startAt);
        osc.stop(startAt + dur);

        cursor++;
        if (cursor >= EVENTS.length) {
          cursor = 0;
          songStart += loopDur;
        }
      }
      state.timer = setTimeout(scheduleTick, 50);
    };
    scheduleTick();
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
