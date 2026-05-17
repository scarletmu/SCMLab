// ─── ScarletMu data + shared primitives ────────────────────────
// Everything user-content & shared mini-components in one file.

const SM = {
  handle: "ScarletMu",
  hp: "沉迷于 Vibe Coding 的闲鱼摄影佬和痛车佬",
  hpEn: "vibe-coding · photography · itasha",
  class: "Full-Stack Wanderer",
  lv: 27,
  exp: 14,    // of 20 segments
  hpNow: 78, hpMax: 100,
  mpNow: 42, mpMax: 100,

  stats: [
    { k: "STR", v: 14, note: "后端 / 数据" },
    { k: "DEX", v: 18, note: "前端 / 动效" },
    { k: "INT", v: 16, note: "架构 / 抽象" },
    { k: "VIT", v: 12, note: "维护 / 运维" },
    { k: "LUK", v: 21, note: "玄学调参" },
    { k: "AGI", v: 17, note: "Vibe 直觉" },
  ],

  equipment: [
    { slot: "EDITOR",  name: "Neovim+",       lvl: "Lv.MAX" },
    { slot: "FRAME",   name: "React 18",      lvl: "Lv.18" },
    { slot: "ENGINE",  name: "Node / Go",     lvl: "Lv.16" },
    { slot: "DB",      name: "Postgres",      lvl: "Lv.14" },
    { slot: "STYLE",   name: "Tailwind",      lvl: "Lv.20" },
    { slot: "LENS",    name: "85mm f/1.4",    lvl: "Lv.??" },
  ],

  skills: [
    "TypeScript", "React", "Next.js", "Go", "Python",
    "PostgreSQL", "Redis", "Docker", "Vibe-Code Lv.99"
  ],

  projects: [
    { name: "pixel-press",  desc: "用 8-bit 风格写博客的静态站点框架。",       lang: "TS",  stars: 412, forks: 28 },
    { name: "itasha-cam",   desc: "痛车扫街自动对焦小工具 / iOS 端。",          lang: "Swift", stars: 188, forks: 11 },
    { name: "vibe-cli",     desc: "把日常脚本变成 vibe 的命令行玩具集。",       lang: "Go",  stars: 327, forks: 19 },
    { name: "scm-portrait", desc: "人像 RAW 批量风格化的 Python 流水线。",      lang: "Py",  stars: 96,  forks: 7  },
    { name: "rpg-resume",   desc: "把简历当成存档读档的 React 组件库。",        lang: "TS",  stars: 1240, forks: 64 },
    { name: "chiptune-fm",  desc: "用 WebAudio 现写的 chiptune 合成器。",       lang: "JS",  stars: 233, forks: 14 },
  ],

  itasha: [
    { car: "GR Yaris × 角色A",   place: "Bigsight P2",    date: "2025.07" },
    { car: "S15 × 角色B",         place: "舞洲 ITS",       date: "2025.05" },
    { car: "FD3S × 角色C",       place: "Odaiba",         date: "2024.11" },
    { car: "AE86 × 角色D",       place: "Daikoku PA",     date: "2024.08" },
  ],

  portraits: [
    { id: "P-01", t: "胶片 · 室内" },
    { id: "P-02", t: "胶片 · 暮色" },
    { id: "P-03", t: "数码 · 棚拍" },
    { id: "P-04", t: "胶片 · 街拍" },
  ],

  now: {
    code: "scm-portrait/pipelines.py",
    music: "Mega Man 2 — Wily Stage 1",
    book:  "《计算机程序的构造和解释》",
    place: "上海 · 阴 17°C",
    car:   "S15 Silvia 涂装设计中…",
  },

  socials: [
    { k: "GH",  v: "github.com/ScarletMu" },
    { k: "TG",  v: "@scarletmu" },
    { k: "X",   v: "@scarlet_mu" },
    { k: "BLOG",v: "scarletmu.dev" },
  ],

  log: [
    { t: "T-00:12", s: "> push origin main … OK" },
    { t: "T-02:40", s: "> 在 daikoku 拍到一辆 R34" },
    { t: "T-04:15", s: "> deploy pixel-press v0.4.2" },
    { t: "T-09:30", s: "> coffee.refill() → energy +20" },
  ],
};

// ─── shared mini components ────────────────────────────────────
function StatBar({ label, value, max = 100, segmented }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="bar">
      <span className="en" style={{ fontSize: 9, width: 28 }}>{label}</span>
      {segmented ? (
        <div className="seg" style={{ flex: 1 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <i key={i} className={i < value ? "on" : ""} />
          ))}
        </div>
      ) : (
        <div className="bar-track">
          <div className="bar-fill" style={{ width: pct + "%" }} />
        </div>
      )}
      <span className="mono" style={{ fontSize: 14, width: 56, textAlign: "right" }}>
        {segmented ? `${value}/20` : `${value}/${max}`}
      </span>
    </div>
  );
}

function Win({ title, ascii, children, style, accent }) {
  return (
    <div className="win" style={style}>
      <div className="win-title">
        <span>{ascii} {title}</span>
        <span className="dots"><i/><i/><i/></span>
      </div>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}

function ImgPh({ label, ratio = "4 / 3", style }) {
  return (
    <div className="imgph" style={{ aspectRatio: ratio, ...style }}>
      <span className="label mono">{label}</span>
    </div>
  );
}

function Dotted() { return <div className="dotted" style={{ margin: "8px 0" }} />; }

// ─── typewriter hook ───────────────────────────────────────────
function useTypewriter(text, speed = 28, startDelay = 0) {
  const [out, setOut] = React.useState("");
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    let i = 0;
    let cancelled = false;
    const start = setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) { setDone(true); return; }
        setTimeout(tick, speed);
      };
      tick();
    }, startDelay);
    return () => { cancelled = true; clearTimeout(start); };
  }, [text, speed, startDelay]);
  return { out, done };
}

// ─── tiny chiptune player (WebAudio square wave) ───────────────
function makeChiptune() {
  let ctx = null;
  let masterGain = null;
  let timer = null;
  let on = false;

  // Mega-Man-ish riff fragment in A minor
  const notes = [
    "A4","C5","E5","A5", "G5","E5","C5","E5",
    "F5","A5","C6","A5", "G5","E5","C5","D5",
    "E5","G5","B5","D6", "C6","B5","G5","E5",
    "A5","E5","C5","A4", "G4","A4","C5","E5",
  ];
  const fmap = { "A4":440,"B4":493.88,"C5":523.25,"D5":587.33,"E5":659.25,"F5":698.46,"G5":783.99,"A5":880,"B5":987.77,"C6":1046.5,"D6":1174.66,"G4":392 };

  function noteAt(i) { return notes[i % notes.length]; }
  function play() {
    if (on) return;
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(ctx.destination);
    on = true;
    let i = 0;
    const step = 130; // ms per note
    const playOne = () => {
      if (!on) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = fmap[noteAt(i)] || 440;
      osc.connect(g); g.connect(masterGain);
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0.0, t0);
      g.gain.linearRampToValueAtTime(1, t0 + 0.005);
      g.gain.linearRampToValueAtTime(0, t0 + step / 1000 - 0.005);
      osc.start(t0);
      osc.stop(t0 + step / 1000);
      i += 1;
      timer = setTimeout(playOne, step);
    };
    playOne();
  }
  function stop() {
    on = false;
    if (timer) { clearTimeout(timer); timer = null; }
    if (masterGain) { try { masterGain.disconnect(); } catch (e) {} masterGain = null; }
  }
  return { play, stop, isOn: () => on };
}

const chiptune = makeChiptune();

function BgmToggle() {
  const [on, setOn] = React.useState(false);
  return (
    <button
      className="pbtn"
      onClick={() => {
        if (on) { chiptune.stop(); setOn(false); }
        else    { chiptune.play(); setOn(true); }
      }}
    >
      ♪ BGM {on ? "ON" : "OFF"}
    </button>
  );
}

Object.assign(window, {
  SM, StatBar, Win, ImgPh, Dotted, useTypewriter, chiptune, BgmToggle
});
