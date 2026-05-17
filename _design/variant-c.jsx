// ─── Variation C · Terminal + Dungeon-map layout ───────────────
// 1440 × 1024 · CLI-driven feel · two-pane shell + ascii map

function VariantC() {
  // typewriter terminal preamble
  const lines = [
    "$ login scarletmu --save 01",
    "  loading character.yaml ………… OK",
    "  mounting /dev/itasha ………… OK",
    "  mounting /dev/portrait ………… OK",
    "  starting bgm.service ………… IDLE",
    "$ cat ~/.profile",
    "  > 沉迷于 Vibe Coding 的闲鱼摄影佬和痛车佬",
    "$ ls -la ~/dungeon",
  ];
  const [shown, setShown] = React.useState(0);
  const [tail, setTail] = React.useState("");
  React.useEffect(() => {
    if (shown >= lines.length) return;
    const txt = lines[shown];
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTail(txt.slice(0, i));
      if (i >= txt.length) {
        clearInterval(id);
        setTimeout(() => { setShown(s => s + 1); setTail(""); }, 220);
      }
    }, 22);
    return () => clearInterval(id);
  }, [shown]);

  const rooms = [
    { id: "A1", k: "PROJECTS", cjk: "项目",  count: 6, icon: "[#]", hot: true  },
    { id: "B1", k: "ITASHA",   cjk: "痛车",  count: 4, icon: "[%]", hot: false },
    { id: "C1", k: "PORTRAIT", cjk: "人像",  count: 4, icon: "[@]", hot: false },
    { id: "A2", k: "STATS",    cjk: "状态",  count: 6, icon: "[*]", hot: false },
    { id: "B2", k: "LOG",      cjk: "日志",  count: 4, icon: "[~]", hot: false },
    { id: "C2", k: "CONTACT",  cjk: "联络",  count: 4, icon: "[!]", hot: false },
  ];

  return (
    <div className="pixel paper-bg scanlines" style={{ width: 1440, height: 1024, padding: 24 }}>

      {/* ─── shell status header ─── */}
      <div className="win" style={{ marginBottom: 14, padding: 0 }}>
        <div style={{ padding: "10px 16px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
          <span className="en" style={{ fontSize: 14 }}>scarletmu@dungeon:~$</span>
          <span className="mono" style={{ fontSize: 15, color: "var(--mid)" }}>
            uptime 03:14h · battery 78% · location {SM.now.place}
          </span>
          <div className="row gap-2">
            <BgmToggle />
            <button className="pbtn">⎋ EXIT</button>
          </div>
        </div>
        <div style={{ borderTop: "var(--b)", padding: "8px 16px", display: "grid", gridTemplateColumns: "180px 240px 240px 1fr auto", gap: 16, alignItems: "center", background: "var(--ink)", color: "var(--paper)" }}>
          <span className="en" style={{ fontSize: 11, color: "var(--paper)" }}>{SM.handle} · LV.{SM.lv}</span>
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <span className="en" style={{ fontSize: 8, color: "var(--paper)" }}>HP</span>
            <div className="bar-track" style={{ flex: 1, background: "#0c1a11", borderColor: "var(--paper)" }}>
              <div className="bar-fill" style={{ width: SM.hpNow + "%", background: "var(--paper)" }} />
            </div>
            <span className="mono" style={{ fontSize: 13, color: "var(--paper)" }}>{SM.hpNow}/{SM.hpMax}</span>
          </div>
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <span className="en" style={{ fontSize: 8, color: "var(--paper)" }}>MP</span>
            <div className="bar-track" style={{ flex: 1, background: "#0c1a11", borderColor: "var(--paper)" }}>
              <div className="bar-fill" style={{ width: SM.mpNow + "%", background: "var(--paper)" }} />
            </div>
            <span className="mono" style={{ fontSize: 13, color: "var(--paper)" }}>{SM.mpNow}/{SM.mpMax}</span>
          </div>
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <span className="en" style={{ fontSize: 8, color: "var(--paper)" }}>EXP</span>
            <div className="seg" style={{ flex: 1, gridTemplateColumns: "repeat(20, 1fr)" }}>
              {Array.from({length:20}).map((_,i)=>(
                <i key={i} style={{ background: i < SM.exp ? "var(--paper)" : "transparent", border: "1px solid var(--paper)" }} />
              ))}
            </div>
          </div>
          <span className="mono" style={{ fontSize: 13, color: "var(--paper)" }}>save-01</span>
        </div>
      </div>

      {/* ─── main 3-pane ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr 420px", gap: 14, height: 870 }}>

        {/* LEFT — Terminal pane */}
        <div className="win col">
          <div className="win-title"><span>◆ /dev/tty1 · 终端</span><span className="dots"><i/><i/><i/></span></div>
          <div style={{ padding: 14, background: "var(--paper)", flex: 1, overflow: "hidden" }}>
            <div className="col gap-2 mono" style={{ fontSize: 14 }}>
              {lines.slice(0, shown).map((l, i) => (
                <div key={i} style={{ color: l.startsWith("$") ? "var(--ink)" : "var(--mid)" }}>{l}</div>
              ))}
              {shown < lines.length && (
                <div style={{ color: lines[shown].startsWith("$") ? "var(--ink)" : "var(--mid)" }}>
                  {tail}<span className="caret">_</span>
                </div>
              )}
              {shown >= lines.length && (
                <>
                  <div className="mono" style={{ fontSize: 13, color: "var(--mid)", paddingTop: 4 }}>
                    drwxr-xr-x  6 scm scm  pr 2025-08-01 projects/<br/>
                    drwxr-xr-x  4 scm scm  it 2025-07-22 itasha/<br/>
                    drwxr-xr-x  4 scm scm  pt 2025-06-09 portraits/<br/>
                    -rw-r--r--  1 scm scm  st 2025-08-12 stats.yaml<br/>
                    -rw-r--r--  1 scm scm  ny 2025-08-12 now.json
                  </div>
                  <div className="mono" style={{ fontSize: 14 }}>$ <span className="caret">_</span></div>
                </>
              )}
            </div>

            <Dotted />

            <div className="en" style={{ fontSize: 9, marginBottom: 8 }}>RECENT ENTRIES</div>
            <div className="col gap-2">
              {SM.log.map((l, i) => (
                <div key={i} className="row gap-3 invert-hover" style={{ padding: "2px 4px" }}>
                  <span className="mono" style={{ fontSize: 13, color: "var(--mid)", width: 64 }}>{l.t}</span>
                  <span className="mono" style={{ fontSize: 13 }}>{l.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE — dungeon map + projects ls */}
        <div className="col gap-3">
          {/* ASCII dungeon map */}
          <div className="win">
            <div className="win-title"><span>◆ ~/dungeon · MAP</span><span className="en" style={{ fontSize: 8 }}>06 ROOMS</span></div>
            <div style={{ padding: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }}>
                {rooms.map((r, i) => {
                  const col = i % 3;
                  const row = Math.floor(i / 3);
                  return (
                    <div key={r.id} className="invert-hover" style={{
                      border: "var(--b)",
                      borderRight: col === 2 ? "var(--b)" : "none",
                      borderBottom: row === 1 ? "var(--b)" : "none",
                      padding: 12,
                      background: r.hot ? "var(--ink)" : "var(--paper)",
                      color: r.hot ? "var(--paper)" : "var(--ink)",
                      position: "relative", minHeight: 110
                    }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span className="en" style={{ fontSize: 9, color: "inherit" }}>{r.id}</span>
                        <span className="en" style={{ fontSize: 9, color: "inherit" }}>{r.icon}</span>
                      </div>
                      <div className="en" style={{ fontSize: 13, marginTop: 14, color: "inherit" }}>{r.k}</div>
                      <div className="mono" style={{ fontSize: 14, marginTop: 2, color: "inherit" }}>{r.cjk}</div>
                      <div className="mono" style={{ fontSize: 13, color: "inherit", opacity: 0.7, marginTop: 6 }}>
                        {r.count} entries
                      </div>
                      {r.hot && (
                        <span style={{
                          position: "absolute", top: 8, right: 28,
                          fontFamily: "var(--font-en)", fontSize: 8,
                          background: "var(--paper)", color: "var(--ink)", padding: "2px 4px"
                        }}>YOU</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mono" style={{ fontSize: 13, color: "var(--mid)", marginTop: 10 }}>
                ┌──┬──┬──┐  ◄ click a room to enter. current: A1 / projects.
              </div>
            </div>
          </div>

          {/* Projects ls */}
          <div className="win grow">
            <div className="win-title">
              <span>◆ A1 · projects/ · 开源项目</span>
              <span className="en" style={{ fontSize: 8 }}>$ ls -la</span>
            </div>
            <div style={{ padding: 14 }}>
              {/* table header */}
              <div className="mono" style={{
                fontSize: 13, color: "var(--mid)",
                display: "grid", gridTemplateColumns: "44px 1fr 60px 60px 60px",
                gap: 12, paddingBottom: 6, borderBottom: "2px dashed var(--ink)"
              }}>
                <span>perm</span><span>name · desc</span><span>lang</span><span>★</span><span>⑂</span>
              </div>
              <div className="col" style={{ marginTop: 6 }}>
                {SM.projects.map((p, i) => (
                  <div key={p.name} className="invert-hover" style={{
                    display: "grid", gridTemplateColumns: "44px 1fr 60px 60px 60px",
                    gap: 12, padding: "8px 4px", borderBottom: "1px dashed rgba(29,53,40,0.25)",
                    alignItems: "center"
                  }}>
                    <span className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>rwxr-x</span>
                    <div className="col" style={{ gap: 2 }}>
                      <span className="en" style={{ fontSize: 11 }}>{p.name}</span>
                      <span className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>{p.desc}</span>
                    </div>
                    <span className="chip">{p.lang}</span>
                    <span className="mono" style={{ fontSize: 14 }}>{p.stars}</span>
                    <span className="mono" style={{ fontSize: 14 }}>{p.forks}</span>
                  </div>
                ))}
              </div>
              <div className="mono" style={{ fontSize: 14, marginTop: 12 }}>
                $ cd projects/ && open <span className="caret">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — stats yaml + galleries preview */}
        <div className="col gap-3">

          <div className="win">
            <div className="win-title"><span>◆ stats.yaml</span><span className="en" style={{ fontSize: 8 }}>RO</span></div>
            <div style={{ padding: 14 }}>
              <div className="mono" style={{ fontSize: 14, lineHeight: 1.5 }}>
                <div><span style={{ color: "var(--mid)" }}>name: </span>"{SM.handle}"</div>
                <div><span style={{ color: "var(--mid)" }}>class:</span> {SM.class}</div>
                <div><span style={{ color: "var(--mid)" }}>lv:   </span> {SM.lv}</div>
                <div><span style={{ color: "var(--mid)" }}>stats:</span></div>
                {SM.stats.map(s => (
                  <div key={s.k} style={{ marginLeft: 14 }}>
                    <span style={{ color: "var(--mid)" }}>- {s.k.toLowerCase()}: </span>{s.v}
                    <span style={{ color: "var(--mid)" }}> # {s.note}</span>
                  </div>
                ))}
                <div><span style={{ color: "var(--mid)" }}>skills:</span></div>
                <div style={{ marginLeft: 14 }}>
                  {SM.skills.map(s => (
                    <span key={s} className="chip" style={{ marginRight: 4, marginBottom: 4 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* gallery preview – itasha */}
          <div className="win">
            <div className="win-title">
              <span>◆ ~/itasha · 痛车</span>
              <span className="en" style={{ fontSize: 8 }}>4 IMG</span>
            </div>
            <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
              {SM.itasha.map((it, i) => (
                <div key={i} className="invert-hover" style={{ border: "var(--b)", padding: 4 }}>
                  <ImgPh label={`car-${i+1}`} ratio="4/3" />
                  <div className="mono" style={{ fontSize: 12, paddingTop: 4 }}>{it.car}</div>
                  <div className="en" style={{ fontSize: 8, color: "var(--mid)" }}>{it.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* gallery preview – portrait */}
          <div className="win">
            <div className="win-title">
              <span>◆ ~/portraits · 人像</span>
              <span className="en" style={{ fontSize: 8 }}>4 IMG</span>
            </div>
            <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {SM.portraits.map(p => (
                <div key={p.id} className="invert-hover" style={{ border: "var(--b)", padding: 4 }}>
                  <ImgPh label={p.id} ratio="3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* contact / now */}
          <div className="win grow">
            <div className="win-title"><span>◆ now.json · CONTACT</span><span className="dots"><i/><i/><i/></span></div>
            <div className="col gap-2" style={{ padding: 14 }}>
              <div className="mono" style={{ fontSize: 14 }}>♪ {SM.now.music}</div>
              <div className="mono" style={{ fontSize: 14 }}>⌗ {SM.now.code}</div>
              <Dotted />
              <div className="col gap-2">
                {SM.socials.map(s => (
                  <div key={s.k} className="row invert-hover" style={{
                    padding: "4px 6px", border: "2px solid transparent",
                    justifyContent: "space-between"
                  }}>
                    <span className="en" style={{ fontSize: 10 }}>{s.k}</span>
                    <span className="mono" style={{ fontSize: 13 }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        position: "absolute", left: 24, right: 24, bottom: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div className="row gap-3">
          <span className="chip">: HELP</span>
          <span className="chip">/ SEARCH</span>
          <span className="chip">q QUIT</span>
        </div>
        <div className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>
          scarletmu@dungeon · zsh 5.9 · ttys001 · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

window.VariantC = VariantC;
