// ─── Variation B · Trainer-card / Game-Boy box-art layout ──────
// 1440 × 1024 · portrait-forward, projects as "inventory items",
//                gallery as a horizontal strip.

function VariantB() {
  const { out: heroTitle } = useTypewriter("ScarletMu", 70, 200);
  const { out: heroSub, done: subDone } = useTypewriter("> 选择存档 …  CHOOSE A FILE TO CONTINUE", 28, 1100);

  return (
    <div className="pixel paper-bg" style={{ width: 1440, height: 1024, padding: 24 }}>

      {/* ─── top strip ─── */}
      <div className="row" style={{ alignItems: "stretch", gap: 16, marginBottom: 16 }}>
        <div className="win grow" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 18 }}>
          <span className="en" style={{ fontSize: 11 }}>★ FILE 01</span>
          <span className="mono" style={{ fontSize: 14, color: "var(--mid)" }}>play-time 03:14:27:09</span>
          <span style={{ flex: 1 }} />
          <span className="en" style={{ fontSize: 8 }}>HP</span>
          <div style={{ width: 130 }}><StatBar label="" value={SM.hpNow} max={SM.hpMax} /></div>
          <span className="en" style={{ fontSize: 8 }}>MP</span>
          <div style={{ width: 130 }}><StatBar label="" value={SM.mpNow} max={SM.mpMax} /></div>
          <span className="en" style={{ fontSize: 8 }}>LV.{SM.lv}</span>
        </div>
        <BgmToggle />
        <button className="pbtn">⌗ NEW GAME</button>
      </div>

      {/* ─── BIG TRAINER CARD + BADGES ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "640px 1fr", gap: 16, marginBottom: 16 }}>

        {/* Trainer card */}
        <div className="win" style={{ padding: 0 }}>
          <div className="win-title">
            <span>◆ TRAINER CARD · 训练家手册</span>
            <span className="en" style={{ fontSize: 8 }}>ID No. 02547</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, padding: 16 }}>
            <ImgPh label="FULL-BODY PORTRAIT" ratio="3/4" />

            <div className="col gap-3">
              <div>
                <div className="en" style={{ fontSize: 26, lineHeight: 1.1 }}>
                  {heroTitle}<span className="caret">_</span>
                </div>
                <div className="mono" style={{ fontSize: 16, marginTop: 6 }}>{SM.class}</div>
                <div className="t-mono" style={{ marginTop: 8, color: "var(--mid)" }}>
                  {subDone ? "> " + SM.hp : heroSub}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", alignItems: "center" }}>
                <span className="en" style={{ fontSize: 8 }}>LV.</span>
                <span className="mono" style={{ fontSize: 16 }}>{SM.lv}</span>
                <span className="en" style={{ fontSize: 8 }}>EXP</span>
                <div className="seg" style={{ gridTemplateColumns: "repeat(20, 1fr)" }}>
                  {Array.from({length:20}).map((_,i)=>(<i key={i} className={i<SM.exp?"on":""} />))}
                </div>
                <span className="en" style={{ fontSize: 8 }}>GOLD</span>
                <span className="mono" style={{ fontSize: 16 }}>¥ 1,287</span>
                <span className="en" style={{ fontSize: 8 }}>HOME</span>
                <span className="mono" style={{ fontSize: 14 }}>{SM.now.place}</span>
              </div>

              <Dotted />

              <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                {SM.skills.map(s => <span key={s} className="chip invert-hover">{s}</span>)}
              </div>
            </div>
          </div>

          {/* dialogue box */}
          <div style={{ borderTop: "var(--b)", padding: "14px 18px", background: "var(--paper-2)" }}>
            <div className="t-mono" style={{ fontSize: 15 }}>
              ScarletMu：「你好，旅人。这里是我的存档。<br/>
              要从 <u>项目</u> · <u>痛车</u> · <u>人像</u> 哪一个房间开始？」
              <span className="arrow r" style={{ display: "inline-block", marginLeft: 8, verticalAlign: "middle" }} />
            </div>
          </div>
        </div>

        {/* BADGES (equipment, but visual as badges) */}
        <div className="win">
          <div className="win-title">
            <span>◆ BADGES · 装备 & 徽章</span>
            <span className="en" style={{ fontSize: 8 }}>06 / 08</span>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {SM.equipment.map((e, i) => (
                <div key={e.slot} className="invert-hover" style={{
                  border: "var(--b)", background: "var(--paper)",
                  boxShadow: "var(--drop-sm)", padding: 10,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6
                }}>
                  {/* pixel-badge */}
                  <div style={{
                    width: 56, height: 56,
                    background:
                      "repeating-linear-gradient(45deg, var(--ink) 0 4px, var(--mid) 4px 8px)",
                    border: "var(--b)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <div style={{
                      width: 24, height: 24, background: "var(--paper)", border: "2px solid var(--ink)"
                    }} />
                  </div>
                  <div className="en" style={{ fontSize: 8, color: "var(--mid)" }}>{e.slot}</div>
                  <div className="mono" style={{ fontSize: 14, textAlign: "center" }}>{e.name}</div>
                  <div className="en" style={{ fontSize: 8 }}>{e.lvl}</div>
                </div>
              ))}
            </div>

            <Dotted />

            <div className="col gap-2">
              <div className="en" style={{ fontSize: 9 }}>STATS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {SM.stats.map(s => (
                  <div key={s.k} className="row gap-2" style={{ alignItems: "center" }}>
                    <span className="en" style={{ fontSize: 9, width: 30 }}>{s.k}</span>
                    <span className="mono" style={{ fontSize: 14, width: 24 }}>{s.v}</span>
                    <div className="bar-track" style={{ flex: 1, height: 8 }}>
                      <div className="bar-fill" style={{ width: (s.v / 22 * 100) + "%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ITASHA GALLERY (horizontal strip) ─── */}
      <div className="win" style={{ marginBottom: 16 }}>
        <div className="win-title">
          <span>◆ ITASHA · 痛车扫街 · WORLD MAP</span>
          <span className="row gap-2"><span className="en" style={{ fontSize: 8 }}>‹ PREV</span><span className="en" style={{ fontSize: 8 }}>NEXT ›</span></span>
        </div>
        <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 10 }}>
          <div className="invert-hover" style={{ border: "var(--b)", background: "var(--paper)", padding: 6 }}>
            <ImgPh label="FEATURED · 2025.07 BIGSIGHT" ratio="16/10" />
            <div className="row" style={{ justifyContent: "space-between", padding: "8px 4px 2px" }}>
              <span className="mono" style={{ fontSize: 14 }}>{SM.itasha[0].car}</span>
              <span className="chip">FEATURED</span>
            </div>
          </div>
          {SM.itasha.slice(1).map((it, i) => (
            <div key={i} className="invert-hover" style={{ border: "var(--b)", background: "var(--paper)", padding: 6 }}>
              <ImgPh label={`itasha-${i+2}.png`} ratio="16/10" />
              <div className="col" style={{ padding: "8px 4px 2px" }}>
                <span className="mono" style={{ fontSize: 13 }}>{it.car}</span>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)", marginTop: 2 }}>{it.place} · {it.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BOTTOM: projects items + portraits + now ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 16 }}>

        {/* Projects as inventory items */}
        <div className="win">
          <div className="win-title">
            <span>◆ INVENTORY · 开源项目</span>
            <span className="en" style={{ fontSize: 8 }}>06 ITEMS</span>
          </div>
          <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {SM.projects.map((p, i) => (
              <div key={p.name} className="invert-hover" style={{
                display: "grid", gridTemplateColumns: "44px 1fr",
                gap: 10, padding: 8,
                border: "var(--b)", background: "var(--paper-2)"
              }}>
                <div style={{
                  background: "var(--paper)", border: "var(--b)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-en)", fontSize: 11
                }}>×{String(p.stars).slice(0,2)}</div>
                <div className="col" style={{ gap: 2 }}>
                  <div className="row gap-2" style={{ alignItems: "center" }}>
                    <span className="en" style={{ fontSize: 11 }}>{p.name}</span>
                    <span className="chip">{p.lang}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>{p.desc}</span>
                  <div className="row gap-3" style={{ marginTop: 2 }}>
                    <span className="mono" style={{ fontSize: 12 }}>★ {p.stars}</span>
                    <span className="mono" style={{ fontSize: 12 }}>⑂ {p.forks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portraits */}
        <div className="win">
          <div className="win-title">
            <span>◆ PORTRAIT · 人像</span>
            <span className="en" style={{ fontSize: 8 }}>SET 03</span>
          </div>
          <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {SM.portraits.map(p => (
              <div key={p.id} className="invert-hover" style={{ border: "var(--b)", background: "var(--paper)", padding: 6 }}>
                <ImgPh label={p.id} ratio="4/5" />
                <div className="col" style={{ paddingTop: 6 }}>
                  <span className="mono" style={{ fontSize: 13 }}>{p.t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Now */}
        <div className="win">
          <div className="win-title"><span>◆ NOW · 当前</span><span className="dots"><i/><i/><i/></span></div>
          <div className="col gap-2" style={{ padding: 12 }}>
            {[
              ["CODE", SM.now.code],
              ["♪",    SM.now.music],
              ["BOOK", SM.now.book],
              ["CAR",  SM.now.car],
            ].map(([k, v]) => (
              <div key={k} className="col" style={{ gap: 2 }}>
                <span className="en" style={{ fontSize: 8, color: "var(--mid)" }}>{k}</span>
                <span className="mono" style={{ fontSize: 14 }}>{v}</span>
              </div>
            ))}
            <Dotted />
            <div className="col gap-2">
              {SM.socials.map(s => (
                <div key={s.k} className="row gap-2 invert-hover" style={{
                  padding: "4px 6px", border: "2px solid transparent"
                }}>
                  <span className="en" style={{ fontSize: 9, width: 36 }}>{s.k}</span>
                  <span className="mono" style={{ fontSize: 13 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        position: "absolute", left: 24, right: 24, bottom: 22,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div className="row gap-3">
          <span className="chip">A · CONFIRM</span>
          <span className="chip">B · BACK</span>
          <span className="chip">START · MENU</span>
        </div>
        <div className="mono" style={{ fontSize: 13, color: "var(--mid)" }}>
          © {new Date().getFullYear()} ScarletMu  ·  press A to continue
        </div>
      </div>
    </div>
  );
}

window.VariantB = VariantB;
