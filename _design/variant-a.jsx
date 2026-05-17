// ─── Variation A (refined) · 主推版 ─────────────────────────────
// 1440 × 1024 · A's classic menu grid + B's trainer-card hero merged
//                 into the left column; top status bar now also shows
//                 SAVE FILE id + play-time.

function VariantA() {
  const { out: heroName, done: nameDone } = useTypewriter("SCARLETMU", 70, 200);
  const { out: heroSub,  done: subDone  } = useTypewriter(
    "> 沉迷于 Vibe Coding 的闲鱼摄影佬和痛车佬…",
    32, 1100
  );

  // ─── deterministic 26w × 7d contribution heatmap ───────────────
  // (mulberry32 prng → 4 shades; biased so recent weeks are denser)
  const COLS = 26, ROWS = 7;
  const heat = React.useMemo(() => {
    let s = 0xC0FFEE;
    const rand = () => {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const grid = [];
    for (let w = 0; w < COLS; w++) {
      // recency bias: last 8 weeks get hotter floors
      const recency = w / (COLS - 1);
      for (let d = 0; d < ROWS; d++) {
        const r = rand();
        // weekend (d===0 || d===6) slightly cooler
        const weekendPenalty = (d === 0 || d === 6) ? 0.15 : 0;
        let v = r * 0.9 + recency * 0.5 - weekendPenalty;
        let lvl = 0;
        if (v > 0.35) lvl = 1;
        if (v > 0.6)  lvl = 2;
        if (v > 0.85) lvl = 3;
        grid.push({ w, d, lvl });
      }
    }
    return grid;
  }, []);
  const totalCommits = 1247;
  const streak = 38;

  // tick a fake play-time so it feels alive
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const baseSec = 3 * 3600 + 14 * 60 + 27;
  const total = baseSec + tick;
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  const ff = String((tick * 17) % 60).padStart(2, "0"); // fake "frames"

  return (
    <div className="pixel paper-bg" style={{ width: 1440, height: 1024, padding: 24 }}>
      {/* ─── Top status bar (two rows · identity + gauges) ─── */}
      <div className="win" style={{ marginBottom: 16, padding: 0 }}>
        {/* row 1 — identity strip (inverted) */}
        <div className="status-strip" style={{
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto auto auto",
          alignItems: "center", gap: 18,
          padding: "8px 16px",
          borderBottom: "var(--b)"
        }}>
          <span className="en" style={{ fontSize: 11 }}>★ FILE 01</span>
          <span className="mono" style={{ fontSize: 14 }}>
            play-time&nbsp;{hh}:{mm}:{ss}:{ff}
          </span>
          <span className="en" style={{ fontSize: 9, justifySelf: "center", letterSpacing: "0.16em" }}>
            SCARLETMU · PLAYER STATUS · SAVE-FILE 01
          </span>
          <span className="mono" style={{ fontSize: 13 }}>{SM.now.place}</span>
          <span className="en" style={{ fontSize: 9 }}>LV.{SM.lv}</span>
          <span className="dots"><i/><i/><i/></span>
        </div>

        {/* row 2 — gauges */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.1fr 1.6fr auto",
          gap: 24, padding: "14px 18px", alignItems: "center"
        }}>
          <div className="col gap-2">
            <span className="en" style={{ fontSize: 8 }}>HP</span>
            <StatBar label="" value={SM.hpNow} max={SM.hpMax} />
          </div>
          <div className="col gap-2">
            <span className="en" style={{ fontSize: 8 }}>MP</span>
            <StatBar label="" value={SM.mpNow} max={SM.mpMax} />
          </div>
          <div className="col gap-2">
            <span className="en" style={{ fontSize: 8 }}>EXP · LV.{SM.lv} → LV.{SM.lv+1}</span>
            <StatBar label="" value={SM.exp} segmented />
          </div>
          <div className="row gap-2">
            <BgmToggle />
            <button className="pbtn ghost">？ HELP</button>
          </div>
        </div>
      </div>

      {/* ─── 3-column grid ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "440px 1fr 440px", gap: 16, height: 884 }}>

        {/* ══ LEFT · Trainer-card hero + stats + equipment ══ */}
        <div className="win col" style={{ overflow: "hidden" }}>
          <div className="win-title">
            <span>◆ TRAINER CARD · 训练家手册</span>
            <span className="en" style={{ fontSize: 8 }}>ID No. 02547</span>
          </div>

          {/* upper: portrait + name/tagline/readout */}
          <div style={{ padding: 14, display: "grid", gridTemplateColumns: "190px 1fr", gap: 14 }}>
            <ImgPh label="PORTRAIT" ratio="3/4" />

            <div className="col gap-3" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="en" style={{ fontSize: 20, lineHeight: 1.1 }}>
                  {heroName}{!nameDone && <span className="caret">_</span>}
                </div>
                <div className="mono" style={{ fontSize: 14, marginTop: 4, color: "var(--mid)" }}>
                  {SM.class}
                </div>
                <div className="t-mono" style={{ fontSize: 13, marginTop: 6, color: "var(--ink)" }}>
                  {subDone ? "> " + SM.hp : heroSub}<span className="caret">_</span>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "5px 10px", alignItems: "center"
              }}>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>LV.</span>
                <span className="mono" style={{ fontSize: 15 }}>{SM.lv}</span>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>EXP</span>
                <div className="seg" style={{ gridTemplateColumns: "repeat(20, 1fr)" }}>
                  {Array.from({length:20}).map((_,i)=>(<i key={i} className={i<SM.exp?"on":""} />))}
                </div>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>GOLD</span>
                <span className="mono" style={{ fontSize: 14 }}>¥ 1,287</span>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>HOME</span>
                <span className="mono" style={{ fontSize: 13 }}>{SM.now.place}</span>
              </div>
            </div>
          </div>

          {/* skills chips */}
          <div style={{ padding: "0 14px 12px" }}>
            <div className="en" style={{ fontSize: 8, color: "var(--mid)", marginBottom: 6 }}>SKILLS</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {SM.skills.map(s => <span key={s} className="chip invert-hover">{s}</span>)}
            </div>
          </div>

          <Dotted />

          {/* 6 stats with segs */}
          <div style={{ padding: "10px 14px 8px" }}>
            <div className="en" style={{ fontSize: 8, color: "var(--mid)", marginBottom: 6 }}>STATS</div>
            <div className="col gap-2">
              {SM.stats.map(s => (
                <div key={s.k} className="row" style={{ alignItems: "center", gap: 10 }}>
                  <span className="en" style={{ fontSize: 9, width: 32 }}>{s.k}</span>
                  <div className="seg" style={{ flex: 1, gridTemplateColumns: "repeat(22, 1fr)" }}>
                    {Array.from({ length: 22 }).map((_, i) => (
                      <i key={i} className={i < s.v ? "on" : ""} />
                    ))}
                  </div>
                  <span className="mono" style={{ fontSize: 14, width: 22, textAlign: "right" }}>{s.v}</span>
                  <span className="mono" style={{ fontSize: 12, color: "var(--mid)", width: 80 }}>{s.note}</span>
                </div>
              ))}
            </div>
          </div>

          <Dotted />

          {/* equipment slots */}
          <div style={{ padding: "10px 14px 12px" }}>
            <div className="en" style={{ fontSize: 8, color: "var(--mid)", marginBottom: 6 }}>EQUIPMENT</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {SM.equipment.map(e => (
                <div key={e.slot} className="invert-hover" style={{
                  border: "var(--b)", background: "var(--paper-2)", padding: 7, position: "relative"
                }}>
                  <i style={{position:"absolute",top:2,left:2,width:4,height:4,background:"var(--ink)"}} />
                  <i style={{position:"absolute",bottom:2,right:2,width:4,height:4,background:"var(--ink)"}} />
                  <div className="en" style={{ fontSize: 8, color: "var(--mid)" }}>{e.slot}</div>
                  <div className="mono" style={{ fontSize: 13, marginTop: 2 }}>{e.name}</div>
                  <div className="en" style={{ fontSize: 8, marginTop: 2 }}>{e.lvl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* dialogue box footer */}
          <div style={{
            marginTop: "auto", borderTop: "var(--b)", padding: "12px 16px", background: "var(--paper-2)"
          }}>
            <div className="t-mono" style={{ fontSize: 14, lineHeight: 1.35 }}>
              {SM.handle}：「你好，旅人。从右侧选一个房间开始探索吧。」
              <span className="arrow r" style={{ display: "inline-block", marginLeft: 8, verticalAlign: "middle" }} />
            </div>
          </div>
        </div>

        {/* ══ MIDDLE · contribution heatmap + projects ══ */}
        <div className="col gap-3">
          <div className="win">
            <div className="win-title">
              <span>◆ CONTRIBUTIONS · 提交活力</span>
              <span className="en" style={{ fontSize: 8 }}>LAST 26 WEEKS</span>
            </div>
            <div style={{ padding: "12px 14px 14px" }}>
              {/* stats row */}
              <div className="row gap-4" style={{ alignItems: "baseline", marginBottom: 10 }}>
                <div className="col" style={{ gap: 2 }}>
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>COMMITS</span>
                  <span className="en" style={{ fontSize: 14 }}>{totalCommits.toLocaleString()}</span>
                </div>
                <div className="col" style={{ gap: 2 }}>
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>STREAK</span>
                  <span className="en" style={{ fontSize: 14 }}>{streak}d</span>
                </div>
                <div className="col" style={{ gap: 2 }}>
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>PRs MERGED</span>
                  <span className="en" style={{ fontSize: 14 }}>12</span>
                </div>
                <div className="col" style={{ gap: 2 }}>
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>LAST PUSH</span>
                  <span className="mono" style={{ fontSize: 14 }}>2h ago · main</span>
                </div>
                <div style={{ marginLeft: "auto" }} className="row gap-2" >
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>LESS</span>
                  {[0,1,2,3].map(l => (
                    <i key={l} style={{
                      width: 10, height: 10, display: "inline-block",
                      border: "1px solid var(--ink)",
                      background:
                        l === 0 ? "var(--paper-2)" :
                        l === 1 ? "var(--wash)"    :
                        l === 2 ? "var(--mid)"     : "var(--ink)"
                    }} />
                  ))}
                  <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>MORE</span>
                </div>
              </div>

              {/* heatmap grid + day-of-week column */}
              <div className="row" style={{ alignItems: "stretch", gap: 8 }}>
                <div className="col" style={{
                  fontFamily: "var(--font-en)", fontSize: 8, color: "var(--mid)",
                  justifyContent: "space-between", paddingTop: 1, paddingBottom: 1
                }}>
                  <span>M</span><span>W</span><span>F</span>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gridAutoRows: "1fr",
                  gap: 3,
                  flex: 1,
                  aspectRatio: `${COLS} / ${ROWS}`,
                  gridAutoFlow: "column"
                }}>
                  {heat.map((c, i) => (
                    <i key={i} style={{
                      gridColumn: c.w + 1,
                      gridRow: c.d + 1,
                      border: "1px solid var(--ink)",
                      background:
                        c.lvl === 0 ? "var(--paper-2)" :
                        c.lvl === 1 ? "var(--wash)"    :
                        c.lvl === 2 ? "var(--mid)"     : "var(--ink)"
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="win grow" style={{ display: "flex", flexDirection: "column" }}>
            <div className="win-title">
              <span>◆ OPEN-SOURCE · 开源项目</span>
              <span className="en" style={{ fontSize: 8 }}>06 / 06</span>
            </div>
            <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {SM.projects.map((p, i) => (
                <div key={p.name} className="invert-hover" style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  border: "var(--b)",
                  background: "var(--paper)",
                  boxShadow: "var(--drop-sm)",
                  flex: 1
                }}>
                  <span className="en" style={{ fontSize: 12 }}>{String(i+1).padStart(2,"0")}</span>
                  <div className="col" style={{ gap: 4 }}>
                    <div className="row gap-2" style={{ alignItems: "center" }}>
                      <span className="en" style={{ fontSize: 12 }}>{p.name}</span>
                      <span className="chip">{p.lang}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 14, color: "var(--mid)" }}>{p.desc}</span>
                  </div>
                  <div className="col" style={{ alignItems: "flex-end", gap: 2 }}>
                    <span className="mono" style={{ fontSize: 14 }}>★ {p.stars}</span>
                    <span className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>⑂ {p.forks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT · galleries + now/log ══ */}
        <div className="col gap-3">
          <div className="win">
            <div className="win-title"><span>◆ ITASHA · 痛车</span><span className="en" style={{fontSize:8}}>4 PHOTOS</span></div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {SM.itasha.map((it, i) => (
                  <div key={i} className="invert-hover" style={{ border: "var(--b)", background: "var(--paper)", padding: 6 }}>
                    <ImgPh label={`car-0${i+1}.png`} ratio="4/3" />
                    <div className="col" style={{ paddingTop: 6 }}>
                      <span className="mono" style={{ fontSize: 13 }}>{it.car}</span>
                      <span className="en" style={{ fontSize: 8, color: "var(--mid)", marginTop: 2 }}>{it.place} · {it.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="win">
            <div className="win-title"><span>◆ PORTRAIT · 人像</span><span className="en" style={{fontSize:8}}>SET 03</span></div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {SM.portraits.map(p => (
                  <div key={p.id}>
                    <ImgPh label={p.id} ratio="3/4" />
                    <div className="en" style={{ fontSize: 8, marginTop: 4, textAlign: "center" }}>{p.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="win grow">
            <div className="win-title"><span>◆ NOW · 当前状态</span><span className="dots"><i/><i/><i/></span></div>
            <div style={{ padding: 12 }} className="col gap-2">
              {[
                ["CODE", SM.now.code],
                ["♪",    SM.now.music],
                ["BOOK", SM.now.book],
                ["LOC",  SM.now.place],
                ["CAR",  SM.now.car],
              ].map(([k,v]) => (
                <div key={k} className="row gap-3" style={{ alignItems: "center" }}>
                  <span className="en" style={{ fontSize: 8, width: 44, color: "var(--mid)" }}>{k}</span>
                  <span className="mono" style={{ fontSize: 14 }}>{v}</span>
                </div>
              ))}
              <Dotted />
              <div className="en" style={{ fontSize: 9 }}>RECENT LOG</div>
              {SM.log.map((l, i) => (
                <div key={i} className="row gap-3">
                  <span className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>{l.t}</span>
                  <span className="mono" style={{ fontSize: 13 }}>{l.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── footer / hint bar ─── */}
      <div style={{
        position: "absolute", left: 24, right: 24, bottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div className="row gap-3">
          <span className="chip">↑↓ SELECT</span>
          <span className="chip">⏎ ENTER</span>
          <span className="chip">␣ SKIP</span>
          <span className="chip">{SM.socials.map(s => s.k).join(" · ")}</span>
        </div>
        <div className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>
          © {new Date().getFullYear()} ScarletMu  ·  save-file 01  ·  press START
        </div>
      </div>
    </div>
  );
}

window.VariantA = VariantA;
