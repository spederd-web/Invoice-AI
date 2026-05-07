import { useState, useEffect, useRef } from "react";
import { L, fSans, fMono, fSerif, t, EU_FEATURES, FEATURES, PLANS, REVIEWS, HOW_STEPS, Icon, LogoMark, Stars, Pill, Tag } from "./constants.jsx";

export function Landing(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  return (
    <div style={{ background:L.white }}>
      <HeroSection setPage={setPage} openModal={openModal} lang={lang} />
      <FlowSection lang={lang} setPage={setPage} />
      <WhyItWorksSection lang={lang} openModal={openModal} />
      <EUComplianceSection lang={lang} setPage={setPage} />
      <ReviewsSection lang={lang} />
      <PricingSection setPage={setPage} openModal={openModal} lang={lang} embedded={true} />
    </div>
  );
}

export function HeroSection(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  var [step, setStep] = useState(0);

  useEffect(function() {
    var t = setInterval(function(){ setStep(function(s){ return (s + 1) % 4; }); }, 2400);
    return function(){ clearInterval(t); };
  }, []);

  return (
    <section style={{ background:L.navy, minHeight:"100vh", display:"flex", alignItems:"center", padding:"80px 24px 72px", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"25%", left:"3%",  width:600, height:600, borderRadius:"50%", background:"rgba(23,169,158,0.025)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"5%", width:400, height:400, borderRadius:"50%", background:"rgba(75,123,255,0.03)", filter:"blur(80px)" }} />
      </div>

      <div className="desktop-hero hero-layout" style={{ maxWidth:1100, margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>

        {/* Left — headline + CTA */}
        <div>
          <div className="hero-pill" style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(23,169,158,0.08)", border:"1px solid rgba(23,169,158,0.18)", borderRadius:999, padding:"6px 16px 6px 12px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#17A99E", display:"inline-block", flexShrink:0 }} />
              <span style={{ fontFamily:fMono, fontSize:11, color:"#17A99E", letterSpacing:"0.1em", textTransform:"uppercase" }}>Built for European freelancers</span>
            </span>
          </div>
          <h1 className="hero-headline" style={{ fontFamily:fSerif, fontSize:"clamp(44px,7vw,84px)", fontWeight:400, color:"#EEF2F7", margin:"0 0 28px", letterSpacing:"-0.035em", lineHeight:0.98, textAlign:"center" }}>
            {lang==="de" ? <>Von Angebot<br/>zu Zahlung.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Erledigt.</span></> :
             lang==="fr" ? <>De la proposition<br/>au paiement.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Géré.</span></> :
             lang==="es" ? <>De la propuesta<br/>al cobro.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Listo.</span></> :
             lang==="it" ? <>Dalla proposta<br/>al pagamento.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Fatto.</span></> :
             lang==="hu" ? <>Az ajánlattól<br/>a kifizetésig.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Kész.</span></> :
             <>From proposal<br/>to payment.<br/><span style={{ color:"#17A99E", fontStyle:"italic" }}>Handled.</span></>}
          </h1>
          <p className="hero-sub" style={{ fontFamily:fSans, fontSize:15, color:"rgba(238,242,247,0.55)", lineHeight:1.75, maxWidth:360, margin:"0 auto 36px", fontWeight:300, textAlign:"center", letterSpacing:"0.01em" }}>
            {lang==="de" ? "Angebote, Rechnungen, Zahlungen und EU-Compliance in einem ruhigen Workflow." :
             lang==="fr" ? "Propositions, factures, paiements et conformité UE dans un flux simple." :
             "Proposals, invoices, payments and EU compliance — one seamless workflow."}
          </p>

          {/* Mobile constellation — hidden on desktop */}
          <div className="hero-constellation-mobile" style={{ margin:"0 auto 36px", position:"relative", width:"100%", maxWidth:320, height:200 }}>
            <svg style={{ width:"100%", height:"100%", overflow:"visible" }} viewBox="0 0 320 200">
              <defs>
                <radialGradient id="nodeGlow0" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#17A99E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#17A99E" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4B7BFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4B7BFF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow3" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1A9E6B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1A9E6B" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Connecting lines */}
              <line x1="60" y1="40" x2="160" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="160" y1="80" x2="240" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="240" y1="120" x2="140" y2="165" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              {/* Glow halos */}
              <circle cx="60" cy="40" r="28" fill="url(#nodeGlow0)" />
              <circle cx="160" cy="80" r="24" fill="url(#nodeGlow1)" />
              <circle cx="240" cy="120" r="24" fill="url(#nodeGlow2)" />
              <circle cx="140" cy="165" r="28" fill="url(#nodeGlow3)" />
              {/* Nodes */}
              <circle cx="60" cy="40" r="4" fill="#17A99E" opacity="0.9" />
              <circle cx="160" cy="80" r="4" fill="#A78BFA" opacity="0.9" />
              <circle cx="240" cy="120" r="4" fill="#4B7BFF" opacity="0.9" />
              <circle cx="140" cy="165" r="5" fill="#1A9E6B" opacity="0.9" />
              {/* Distant dim nodes for depth */}
              <circle cx="100" cy="155" r="2" fill="rgba(255,255,255,0.15)" />
              <circle cx="200" cy="40" r="1.5" fill="rgba(255,255,255,0.1)" />
              <circle cx="290" cy="70" r="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="30" cy="120" r="1.5" fill="rgba(255,255,255,0.1)" />
              {/* Labels */}
              <text x="76" y="44" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="rgba(238,242,247,0.45)" fontWeight="400">Proposal sent</text>
              <text x="174" y="84" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="rgba(238,242,247,0.45)" fontWeight="400">Viewed 7×</text>
              <text x="206" y="116" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="rgba(238,242,247,0.45)" fontWeight="400" textAnchor="end">Invoice created</text>
              <text x="150" y="162" fontFamily="'DM Sans',sans-serif" fontSize="10" fill="rgba(238,242,247,0.6)" fontWeight="500">Payment received</text>
            </svg>
          </div>

          <div className="hero-btns" style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:28 }}>
            <button onClick={function(){ openModal("hero"); }} style={{ background:"#17A99E", color:L.navy, border:"none", padding:"14px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:600, letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>
              {lang==="de" ? "Kostenlos starten" : lang==="fr" ? "Commencer gratuitement" : "Start free"}
            </button>
            <button onClick={function(){ setPage("Generator"); }} style={{ background:"rgba(255,255,255,0.05)", color:"rgba(238,242,247,0.6)", border:"1px solid rgba(255,255,255,0.09)", padding:"14px 24px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:15, whiteSpace:"nowrap" }}>
              {lang==="de" ? "Demo ansehen" : lang==="fr" ? "Voir la démo" : "View demo"}
            </button>
          </div>
          <p style={{ fontFamily:fMono, fontSize:10, color:"rgba(238,242,247,0.18)", letterSpacing:"0.09em", textAlign:"center" }}>
            {t(lang,"heroFine")}
          </p>
        </div>

        {/* Right — Constellation flow composition */}
        <div className="hero-cards" style={{ display:"none", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ position:"relative", width:"100%", maxWidth:420, height:480 }}>
            <svg style={{ width:"100%", height:"100%", overflow:"visible" }} viewBox="0 0 420 480">
              <defs>
                <radialGradient id="cg0" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#17A99E" stopOpacity="0.25"/><stop offset="100%" stopColor="#17A99E" stopOpacity="0"/></radialGradient>
                <radialGradient id="cg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#A78BFA" stopOpacity="0.22"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0"/></radialGradient>
                <radialGradient id="cg2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4B7BFF" stopOpacity="0.22"/><stop offset="100%" stopColor="#4B7BFF" stopOpacity="0"/></radialGradient>
                <radialGradient id="cg3" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1A9E6B" stopOpacity="0.28"/><stop offset="100%" stopColor="#1A9E6B" stopOpacity="0"/></radialGradient>
              </defs>
              {/* Background ambient dots */}
              {[[80,60],[340,90],[60,200],[380,240],[150,380],[310,400],[200,130],[90,320]].map(function(pt, i) {
                return <circle key={i} cx={pt[0]} cy={pt[1]} r={i%3===0?2:1.5} fill="rgba(255,255,255,0.08)" />;
              })}
              {/* Connecting lines between main nodes */}
              <line x1="90" y1="110" x2="220" y2="195" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
              <line x1="220" y1="195" x2="330" y2="290" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
              <line x1="330" y1="290" x2="185" y2="385" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
              {/* Glow halos */}
              <circle cx="90" cy="110" r="40" fill="url(#cg0)"/>
              <circle cx="220" cy="195" r="36" fill="url(#cg1)"/>
              <circle cx="330" cy="290" r="36" fill="url(#cg2)"/>
              <circle cx="185" cy="385" r="44" fill="url(#cg3)"/>
              {/* Main nodes */}
              <circle cx="90" cy="110" r={step===0?7:5} fill="#17A99E" opacity={step===0?1:0.6} style={{transition:"all 0.4s"}}/>
              <circle cx="220" cy="195" r={step===1?7:5} fill="#A78BFA" opacity={step===1?1:0.6} style={{transition:"all 0.4s"}}/>
              <circle cx="330" cy="290" r={step===2?7:5} fill="#4B7BFF" opacity={step===2?1:0.6} style={{transition:"all 0.4s"}}/>
              <circle cx="185" cy="385" r={step===3?8:5} fill="#1A9E6B" opacity={step===3?1:0.6} style={{transition:"all 0.4s"}}/>
              {/* Pulse ring on active node */}
              {step===0 && <circle cx="90" cy="110" r="18" fill="none" stroke="#17A99E" strokeWidth="1" opacity="0.3"/>}
              {step===1 && <circle cx="220" cy="195" r="18" fill="none" stroke="#A78BFA" strokeWidth="1" opacity="0.3"/>}
              {step===2 && <circle cx="330" cy="290" r="18" fill="none" stroke="#4B7BFF" strokeWidth="1" opacity="0.3"/>}
              {step===3 && <circle cx="185" cy="385" r="20" fill="none" stroke="#1A9E6B" strokeWidth="1" opacity="0.3"/>}
              {/* Labels */}
              <text x="108" y="105" fontFamily="'DM Sans',sans-serif" fontSize="13" fill={step===0?"rgba(238,242,247,0.9)":"rgba(238,242,247,0.4)"} fontWeight={step===0?"500":"400"} style={{transition:"fill 0.4s"}}>Proposal sent</text>
              <text x="108" y="120" fontFamily="'DM Mono',monospace" fontSize="10" fill="rgba(238,242,247,0.22)">Brand Identity · Studio Verde</text>
              <text x="238" y="190" fontFamily="'DM Sans',sans-serif" fontSize="13" fill={step===1?"rgba(238,242,247,0.9)":"rgba(238,242,247,0.4)"} fontWeight={step===1?"500":"400"} style={{transition:"fill 0.4s"}}>Viewed 7 times</text>
              <text x="238" y="205" fontFamily="'DM Mono',monospace" fontSize="10" fill="rgba(238,242,247,0.22)">3 hours ago · still open</text>
              <text x="200" y="285" fontFamily="'DM Sans',sans-serif" fontSize="13" fill={step===2?"rgba(238,242,247,0.9)":"rgba(238,242,247,0.4)"} fontWeight={step===2?"500":"400"} textAnchor="end" style={{transition:"fill 0.4s"}}>Invoice created</text>
              <text x="200" y="300" fontFamily="'DM Mono',monospace" fontSize="10" fill="rgba(238,242,247,0.22)" textAnchor="end">One click · EU-compliant</text>
              <text x="205" y="378" fontFamily="'DM Sans',sans-serif" fontSize="13" fill={step===3?"rgba(238,242,247,0.9)":"rgba(238,242,247,0.4)"} fontWeight={step===3?"500":"400"} style={{transition:"fill 0.4s"}}>Payment received</text>
              <text x="205" y="393" fontFamily="'DM Mono',monospace" fontSize="10" fill="rgba(238,242,247,0.22)">€8,400 · SEPA confirmed</text>
              {/* Amount badge appears on payment step */}
              {step===3 && <rect x="205" y="400" width="80" height="22" rx="5" fill="#1A9E6B" fillOpacity="0.15" stroke="#1A9E6B" strokeOpacity="0.3" strokeWidth="1"/>}
              {step===3 && <text x="245" y="415" fontFamily="'DM Mono',monospace" fontSize="11" fill="#1A9E6B" fontWeight="600" textAnchor="middle">€8,400</text>}
              {/* Bottom footer */}
              <text x="210" y="455" fontFamily="'DM Mono',monospace" fontSize="10" fill="rgba(238,242,247,0.18)" letterSpacing="3" textAnchor="middle">EU · SEPA · XRECHNUNG · GDPR</text>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}

export function HowItWorksSection(props) {
  var lang = props.lang || "en";
  var setPage = props.setPage;
  var openModal = props.openModal;
  var steps = HOW_STEPS[lang] || HOW_STEPS.en;
  return (
    <section style={{ background:L.navy, padding:"88px 24px" }}>
      <div className="desktop-section" style={{ maxWidth:1060, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:L.accent }} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, letterSpacing:"0.12em", textTransform:"uppercase" }}>How it flows</span>
          </div>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(26px,4vw,44px)", fontWeight:400, color:"#F0F4F8", margin:"0 0 12px", letterSpacing:"-0.025em", lineHeight:1.1, fontStyle:"italic" }}>
            {lang==="de" ? "Von der Idee zur Zahlung" : lang==="fr" ? "De l'idée au paiement" : lang==="es" ? "De la idea al cobro" : lang==="it" ? "Dall'idea al pagamento" : lang==="hu" ? "Az ötlettől a kifizetésig" : "From idea to payment"}
          </h2>
          <p className="d-section-sub" style={{ fontFamily:fSans, fontSize:14, color:"rgba(240,244,248,0.45)", fontWeight:300, maxWidth:400, margin:"0 auto" }}>
            {lang==="de" ? "Vier Schritte. Ein Tool. Kein Wechsel zwischen Apps." : lang==="fr" ? "Quatre étapes. Un outil." : lang==="es" ? "Cuatro pasos. Una herramienta." : lang==="it" ? "Quattro passi. Un solo strumento." : lang==="hu" ? "Négy lépés. Egy eszköz." : "Four steps. One tool. No switching."}
          </p>
        </div>
        <div className="grid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {steps.map(function(step, i) {
            return (
              <div key={step.num} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"28px 26px", position:"relative", overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:L.accent+"1A", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={step.icon} size={18} color={L.accent} />
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:32, fontWeight:500, color:"rgba(255,255,255,0.06)", lineHeight:1 }}>{step.num}</span>
                </div>
                <h3 style={{ fontFamily:fSans, fontSize:16, fontWeight:500, color:"rgba(240,244,248,0.9)", marginBottom:8, letterSpacing:"-0.01em" }}>{step.title}</h3>
                <p style={{ fontFamily:fSans, fontSize:13, color:"rgba(240,244,248,0.4)", lineHeight:1.65, margin:0, fontWeight:300 }}>{step.desc}</p>
                {i === 2 && (
                  <div style={{ marginTop:14, display:"inline-flex", alignItems:"center", gap:5, background:L.accent+"18", borderRadius:5, padding:"3px 9px" }}>
                    <Icon name="check" size={10} color={L.accent} />
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.accent, letterSpacing:"0.04em" }}>
                      {lang==="de" ? "Kein doppeltes Eingeben" : "No re-entering data"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:"center", marginTop:44 }}>
          <button onClick={function(){ setPage("Generator"); }} style={{ background:L.accent, color:L.navy, border:"none", padding:"13px 30px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:600, letterSpacing:"-0.01em" }}>
            {lang==="de" ? "Jetzt ausprobieren →" : lang==="fr" ? "Essayer maintenant →" : lang==="es" ? "Probarlo ahora →" : lang==="it" ? "Provalo adesso →" : lang==="hu" ? "Próbáld ki most →" : "Try it now →"}
          </button>
        </div>
      </div>
    </section>
  );
}

export function FlowSection(props) {
  var lang = props.lang || "en";
  var setPage = props.setPage;
  var steps = [
    { num:"01", label: lang==="de" ? "Angebot erstellen" : lang==="fr" ? "Créer la proposition" : "Write the proposal",    detail: lang==="de" ? "KI schreibt in 30 Sekunden" : lang==="fr" ? "L'IA rédige en 30 secondes" : "AI writes it in 30 seconds" },
    { num:"02", label: lang==="de" ? "Senden & verfolgen" : lang==="fr" ? "Envoyer & suivre" : "Send and track",           detail: lang==="de" ? "Sieh wann & wie oft geöffnet" : lang==="fr" ? "Vu quand et combien de fois" : "See when and how often viewed" },
    { num:"03", label: lang==="de" ? "In Rechnung umwandeln" : lang==="fr" ? "Convertir en facture" : "Convert to invoice", detail: lang==="de" ? "Ein Klick, EU-konform" : lang==="fr" ? "Un clic, conforme UE" : "One click, EU-compliant" },
    { num:"04", label: lang==="de" ? "Bezahlt werden" : lang==="fr" ? "Être payé" : "Get paid",                            detail: lang==="de" ? "SEPA + automatische Erinnerungen" : lang==="fr" ? "SEPA + relances automatiques" : "SEPA + automatic reminders" },
  ];

  var containerRef = useRef(null);
  var [visible, setVisible] = useState([false, false, false, false]);

  useEffect(function() {
    var container = containerRef.current;
    if (!container) return;
    var items = container.querySelectorAll(".flow-step");
    var observers = [];
    items.forEach(function(el, idx) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            setTimeout(function() {
              setVisible(function(prev) {
                var next = prev.slice();
                next[idx] = true;
                return next;
              });
            }, idx * 160);
            obs.disconnect();
          }
        });
      }, { threshold: 0.2 });
      obs.observe(el);
      observers.push(obs);
    });
    return function() {
      observers.forEach(function(o) { o.disconnect(); });
    };
  }, []);

  return (
    <section style={{ background:L.paper, padding:"100px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(28px,4.5vw,52px)", fontWeight:400, color:L.ink, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:16, fontStyle:"italic" }}>
            {lang==="de" ? "Wie es fließt." : lang==="fr" ? "Comment ça s'enchaîne." : "How it flows."}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300, maxWidth:360, margin:"0 auto" }}>
            {lang==="de" ? "Vier Schritte. Ein Tool." : lang==="fr" ? "Quatre étapes. Un outil." : "Four steps. One tool. Nothing duplicated."}
          </p>
        </div>

        <div ref={containerRef} style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {steps.map(function(s, i) {
            var last = i === steps.length - 1;
            var shown = visible[i];
            var isLast = i === steps.length - 1;
            return (
              <div
                key={i}
                className="flow-step"
                style={{
                  display:"flex", gap:32, alignItems:"flex-start",
                  paddingBottom: last ? 0 : 64,
                  position:"relative",
                  opacity: shown ? 1 : 0,
                  transform: shown ? "translateY(0)" : "translateY(28px)",
                  transition: "opacity 0.55s ease, transform 0.55s ease",
                }}
              >
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:56 }}>
                  <span style={{
                    fontFamily:fSerif, fontSize:52, fontWeight:400, lineHeight:1,
                    letterSpacing:"-0.04em", userSelect:"none",
                    color: isLast ? L.accent : L.ink,
                  }}>
                    {i + 1}
                  </span>
                  {!last && (
                    <div style={{
                      width:1, flex:1, marginTop:10, minHeight:40,
                      background:"linear-gradient(to bottom, "+L.border+", transparent)",
                    }} />
                  )}
                </div>
                <div style={{ paddingTop:10 }}>
                  <div style={{ fontFamily:fSerif, fontSize:"clamp(22px,3vw,30px)", fontWeight:400, color:L.ink, marginBottom:8, letterSpacing:"-0.02em", lineHeight:1.1 }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily:fMono, fontSize:12, color:L.muted, letterSpacing:"0.04em" }}>
                    {s.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop:72, textAlign:"center" }}>
          <button onClick={function(){ setPage("Generator"); }} style={{ background:L.navy, color:"#EEF2F7", border:"none", padding:"13px 28px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, letterSpacing:"-0.01em" }}>
            {lang==="de" ? "Jetzt ausprobieren →" : lang==="fr" ? "Essayer maintenant →" : "Try it now →"}
          </button>
        </div>
      </div>
    </section>
  );
}

export function WhyItWorksSection(props) {
  var lang = props.lang || "en";
  var openModal = props.openModal;
  var statements = lang==="de" ? [
    { headline:"Weniger Zeit mit Nachverfolgen.", sub:"Sieh sofort, wenn ein Angebot geöffnet wird — und folge im richtigen Moment nach." },
    { headline:"Für ganz Europa gebaut.", sub:"VAT, Reverse Charge, XRechnung, SEPA. Automatisch. Richtig." },
    { headline:"Immer wissen, was als nächstes kommt.", sub:"Dein Dashboard zeigt genau, was Aufmerksamkeit braucht." },
  ] : lang==="fr" ? [
    { headline:"Moins de temps à relancer.", sub:"Voyez quand une proposition est ouverte. Relancez au bon moment." },
    { headline:"Conçu pour toute l'Europe.", sub:"TVA, autoliquidation, Factur-X, SEPA. Automatiquement. Correctement." },
    { headline:"Sachez toujours quoi faire ensuite.", sub:"Votre tableau de bord vous montre exactement ce qui demande attention." },
  ] : [
    { headline:"Spend less time chasing.", sub:"See the moment a proposal is opened. Follow up at exactly the right time." },
    { headline:"Built for working across Europe.", sub:"VAT, reverse charge, XRechnung, SEPA. Handled correctly. Automatically." },
    { headline:"Always know what's next.", sub:"Your dashboard shows exactly what needs attention — nothing more." },
  ];
  return (
    <section style={{ background:L.navy, padding:"100px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"20%", right:"10%", width:400, height:400, borderRadius:"50%", background:"rgba(23,169,158,0.04)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"15%", left:"5%", width:300, height:300, borderRadius:"50%", background:"rgba(75,123,255,0.04)", filter:"blur(60px)" }} />
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:60 }}>
          <div style={{ width:4, height:4, borderRadius:"50%", background:L.accent }} />
          <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.7 }}>
            {lang==="de" ? "Warum es funktioniert" : lang==="fr" ? "Pourquoi ça marche" : "Why it works"}
          </span>
        </div>
        {statements.map(function(s, i) {
          return (
            <div key={i} style={{ marginBottom: i < statements.length - 1 ? 72 : 0, paddingBottom: i < statements.length - 1 ? 72 : 0, borderBottom: i < statements.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <h3 style={{ fontFamily:fSerif, fontSize:"clamp(26px,3.5vw,44px)", fontWeight:400, color:"#EEF2F7", letterSpacing:"-0.03em", lineHeight:1.12, marginBottom:16, fontStyle: i === 0 ? "italic" : "normal" }}>
                {s.headline}
              </h3>
              <p style={{ fontFamily:fSans, fontSize:15, color:"rgba(238,242,247,0.45)", fontWeight:300, lineHeight:1.8, maxWidth:520, letterSpacing:"0.01em" }}>
                {s.sub}
              </p>
            </div>
          );
        })}
        <div style={{ marginTop:72, paddingTop:56, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={function(){ openModal("why"); }} style={{ background:"#17A99E", color:L.navy, border:"none", padding:"13px 28px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:600, letterSpacing:"-0.01em" }}>
            {lang==="de" ? "Frühen Zugang erhalten →" : lang==="fr" ? "Accès anticipé →" : "Get early access →"}
          </button>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection(props) {
  var lang = props.lang || "en";
  return (
    <section style={{ padding:"80px 24px", background:L.white }}>
      <div className="desktop-section" style={{ maxWidth:1060, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:L.accent }} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>{t(lang,"pillFeatures")||"Features"}</span>
          </div>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(26px,4vw,42px)", fontWeight:400, color:L.ink, margin:"0 0 12px", letterSpacing:"-0.025em", lineHeight:1.15 }}>
            {t(lang,"featTitle")}
          </h2>
          <p className="d-section-sub" style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300, maxWidth:440, margin:"0 auto" }}>
            {t(lang,"featSub")}
          </p>
        </div>
        <div className="grid3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {FEATURES.map(function(f) {
            return (
              <div key={f.title} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:12, padding:"24px 22px" }}>
                <div style={{ width:34, height:34, background:L.navy+"0D", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon name={f.icon} size={16} color={L.navyMid} />
                </div>
                <h3 className="d-card-title" style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink, marginBottom:7, letterSpacing:"-0.01em" }}>{f.title}</h3>
                <p className="d-card-desc" style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, fontWeight:300 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function EUComplianceSection(props) {
  var lang = props.lang || "en";
  var setPage = props.setPage;
  var chips = [
    { icon:"reverse", label:"Reverse charge automatic" },
    { icon:"document", label:"XRechnung & Factur-X ready" },
    { icon:"hash",    label:"Sequential numbering" },
    { icon:"shield",  label:"VIES VAT validation" },
    { icon:"eu",      label:"GDPR notice included" },
    { icon:"bank",    label:"SEPA payment block" },
    { icon:"archive", label:"10-year archive" },
    { icon:"clock",   label:"Late payment directive" },
  ];
  return (
    <section style={{ background:L.paper, padding:"80px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:48, flexWrap:"wrap", gap:20 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:L.accent }} />
              <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>{t(lang,"pillCompliance")||"Compliance"}</span>
            </div>
            <h2 style={{ fontFamily:fSerif, fontSize:"clamp(24px,4vw,40px)", fontWeight:400, color:L.ink, letterSpacing:"-0.025em", lineHeight:1.1, maxWidth:480 }}>
              {t(lang,"euTitle")}
            </h2>
          </div>
          <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300, maxWidth:320, lineHeight:1.65 }}>
            VAT, reverse charge, XRechnung and SEPA handled quietly in the background — so you just invoice.
          </p>
        </div>
        <div className="compliance-chips" style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:36 }}>
          {chips.map(function(c, i) {
            return (
              <div key={c.label} style={{ display:"flex", alignItems:"center", gap:8, background:L.white, border:"1px solid "+L.border, borderRadius:999, padding:"10px 16px 10px 12px", justifyContent:"center" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:L.navy+"08", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={c.icon} size={11} color={L.navyMid} />
                </div>
                <span style={{ fontFamily:fSans, fontSize:14, color:L.ink, fontWeight:400 }}>{c.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:L.navy, borderRadius:14, padding:"22px 28px", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontFamily:fSans, fontSize:15, fontWeight:500, color:"rgba(240,244,248,0.9)", marginBottom:4 }}>
              12 compliance rules. Built in. Not bolted on.
            </div>
            <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(240,244,248,0.35)", letterSpacing:"0.04em" }}>
              Always current with EU directives · Updated as mandates change
            </div>
          </div>
          <button onClick={function(){ if(setPage) setPage("EUCompliance"); }} style={{ background:"transparent", color:"rgba(240,244,248,0.8)", border:"1px solid rgba(255,255,255,0.15)", padding:"10px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:400, whiteSpace:"nowrap" }}>
            Full compliance guide →
          </button>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection(props) {
  var lang = props.lang || "en";
  var picks = [REVIEWS[0], REVIEWS[2]]; // Jonas (reverse charge) + Marco (closed €12k)
  return (
    <section style={{ background:L.paper, borderTop:"1px solid "+L.border, padding:"100px 24px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:64 }}>
          <Stars n={5} size={13} />
          <span style={{ fontFamily:fMono, fontSize:12, color:L.muted, letterSpacing:"0.06em" }}>4.9 · 340+ reviews</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:64 }}>
          {picks.map(function(r) {
            return (
              <div key={r.id}>
                <p style={{ fontFamily:fSerif, fontSize:"clamp(18px,2.8vw,28px)", fontWeight:400, color:L.ink, lineHeight:1.4, letterSpacing:"-0.02em", marginBottom:20, fontStyle:"italic" }}>
                  "{r.text}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:r.col+"22", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:r.col, fontWeight:500, flexShrink:0 }}>{r.av}</div>
                  <div>
                    <span style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>{r.name}</span>
                    <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}> · {r.role}, {r.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
export function PricingSection(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var embedded = props.embedded;
  var lang = props.lang || "en";
  var [checkoutLoading, setCheckoutLoading] = useState(null);

  function startCheckout(planName) {
    setCheckoutLoading(planName);
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planName.toLowerCase() }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      setCheckoutLoading(null);
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not set up yet — fall back to waitlist modal
        openModal("pricing-" + planName.toLowerCase());
      }
    })
    .catch(function() {
      setCheckoutLoading(null);
      openModal("pricing-" + planName.toLowerCase());
    });
  }
  return (
    <section style={{ background:embedded ? L.paper : L.white, padding:"100px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ marginBottom:60 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:L.accent }} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>{t(lang,"pillPricing")||"Pricing"}</span>
          </div>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(28px,4vw,48px)", fontWeight:400, color:L.ink, margin:"0 0 12px", letterSpacing:"-0.03em", lineHeight:1.1 }}>
            {t(lang,"pricingTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300, lineHeight:1.7 }}>{t(lang,"pricingSub")}</p>
        </div>
        <div className="pricing-scroll desktop-pricing" style={{ display:"flex", gap:16, overflowX:"auto", overflowY:"visible", WebkitOverflowScrolling:"touch", paddingBottom:16, paddingTop:16, paddingLeft:2, paddingRight:2 }}>
          {PLANS.map(function(plan) {
            return (
              <div key={plan.name} style={{ background:plan.hi ? L.navy : "transparent", border: plan.hi ? "1px solid rgba(23,169,158,0.15)" : "none", borderRadius:16, padding:"40px 32px", flex:"0 0 300px", minWidth:300, position:"relative" }}>
                {plan.badge && (
                  <div style={{ position:"absolute", top:-11, left:28, background:L.accent, color:L.navy, padding:"3px 12px", borderRadius:99, fontFamily:fMono, fontSize:10, letterSpacing:"0.08em", whiteSpace:"nowrap", fontWeight:600 }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:plan.hi ? "rgba(240,244,248,0.35)" : L.faint, marginBottom:20 }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8 }}>
                  <span style={{ fontFamily:fSerif, fontSize:48, fontWeight:400, color:plan.hi ? "#F0F4F8" : L.ink, lineHeight:1, letterSpacing:"-0.03em" }}>{"€"+plan.price}</span>
                  <span style={{ fontFamily:fSans, fontSize:13, color:plan.hi ? "rgba(240,244,248,0.3)" : L.faint }}>/mo</span>
                </div>
                <div style={{ height:1, background:plan.hi ? "rgba(255,255,255,0.07)" : L.border, margin:"20px 0 20px" }} />
                <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:28 }}>
                  {plan.features.map(function(f) {
                    return (
                      <div key={f} style={{ display:"flex", gap:10, fontFamily:fSans, fontSize:14, color:plan.hi ? "rgba(240,244,248,0.6)" : L.muted, lineHeight:1.4, fontWeight:300 }}>
                        <Icon name="check" size={13} color={plan.hi ? L.accent : L.green} style={{ flexShrink:0, marginTop:1 }} />
                        {f}
                      </div>
                    );
                  })}
                </div>
                <button onClick={function(){ startCheckout(plan.name); }} disabled={checkoutLoading === plan.name.toLowerCase()} style={{ width:"100%", background:plan.hi ? L.accent : L.navy, color:plan.hi ? L.navy : "#fff", border:"none", padding:"13px 0", borderRadius:9, cursor:checkoutLoading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:14, fontWeight:600, letterSpacing:"-0.01em", opacity:checkoutLoading === plan.name.toLowerCase() ? 0.7 : 1 }}>
                  {checkoutLoading === plan.name.toLowerCase() ? "Loading…" : t(lang,"pricingCta")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
