import { useState, useEffect, useRef } from "react";
import { L, fSans, fMono, fSerif, t, PAGES, EU_COUNTRIES_LIST, Icon, LogoMark } from "./constants.jsx";

// ── Generator dropdown ────────────────────────────────────────────────────────
var GEN_ITEMS = [
  { mode:"invoice",  label:"Invoice",  sub:"EU-compliant invoices", icon:"document" },
  { mode:"proposal", label:"Proposal", sub:"AI-written proposals",  icon:"proposal" },
];

function GeneratorDropdown(props) {
  var setPage = props.setPage;
  var setGenMode = props.setGenMode;
  var onClose = props.onClose;
  return (
    <div style={{
      position:"absolute", top:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
      background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      border:"1px solid "+L.border, borderRadius:10, padding:"4px",
      boxShadow:"0 8px 32px rgba(10,22,40,0.12), 0 1px 3px rgba(10,22,40,0.06)",
      minWidth:140, zIndex:300,
    }}>
      {GEN_ITEMS.map(function(item) {
        return (
          <button key={item.mode} onClick={function(){
            if (setGenMode) setGenMode(item.mode);
            setPage("Generator");
            onClose();
          }} style={{
            width:"100%", display:"block", padding:"9px 16px",
            border:"none", borderRadius:7, background:"transparent",
            cursor:"pointer", textAlign:"left",
            fontFamily:fSans, fontSize:14, fontWeight:400, color:L.ink,
          }}
          onMouseEnter={function(e){ e.currentTarget.style.background = L.cream; }}
          onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Nav(props) {
  var page = props.page;
  var setPage = props.setPage;
  var setGenMode = props.setGenMode;
  var openModal = props.openModal;
  var openAuth = props.openAuth;
  var user = props.user;
  var lang = props.lang || "en";
  var setLang = props.setLang;
  var [menuOpen, setMenuOpen] = useState(false);
  var [genOpen, setGenOpen] = useState(false);
  var [scrolled, setScrolled] = useState(false);
  var genRef = useRef(null);

  useEffect(function() {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive:true });
    return function(){ window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(function() {
    if (!genOpen) return;
    function handleOutside(e) {
      if (genRef.current && !genRef.current.contains(e.target)) setGenOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return function(){ document.removeEventListener("mousedown", handleOutside); };
  }, [genOpen]);

  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:scrolled ? "rgba(247,248,250,0.88)" : L.white, backdropFilter:scrolled ? "blur(20px)" : "none", WebkitBackdropFilter:scrolled ? "blur(20px)" : "none", borderBottom:"1px solid "+L.border, flexShrink:0, transition:"background 0.3s ease" }}>
      <div style={{ height:58, display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", padding:"0 24px", maxWidth:1200, margin:"0 auto", width:"100%" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={function(){ setPage("Home"); setMenuOpen(false); }}>
          <LogoMark size={30} />
          <span style={{ fontFamily:fSerif, fontWeight:400, fontSize:18, color:L.ink, letterSpacing:"-0.02em" }}>InvoiceAI</span>
        </div>

        {/* Center nav — desktop. Order: Home · Generator · Compliance · Pricing · Dashboard */}
        <div className="nav-desktop" style={{ display:"flex", gap:1, alignItems:"center" }}>
          {/* Home */}
          <button onClick={function(){ setPage("Home"); }} style={{ background:"transparent", color:page==="Home" ? L.ink : L.muted, border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:page==="Home" ? 500 : 400, letterSpacing:"-0.01em", transition:"color 0.15s" }}>
            {t(lang,"navHome") || "Home"}
          </button>

          {/* Generator dropdown — second */}
          <div ref={genRef} style={{ position:"relative" }}>
            <button onClick={function(){ setGenOpen(function(o){ return !o; }); }} style={{
              background:"transparent",
              color: genOpen ? L.accent : page === "Generator" ? L.ink : L.muted,
              border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer",
              fontFamily:fSans, fontSize:14, fontWeight:page === "Generator" ? 500 : 400,
              letterSpacing:"-0.01em", transition:"color 0.15s",
              display:"flex", alignItems:"center", gap:4,
            }}>
              {t(lang,"navGenerator") || "Generator"}
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" style={{ transition:"transform 0.15s", transform:genOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {genOpen && (
              <GeneratorDropdown setPage={setPage} setGenMode={setGenMode} onClose={function(){ setGenOpen(false); }} />
            )}
          </div>

          {/* Remaining pages: Compliance · Pricing */}
          {["EUCompliance","Pricing"].map(function(pg) {
            var pgLabel = pg === "Pricing" ? t(lang,"navPricing") : "Compliance";
            var active = page === pg;
            return (
              <button key={pg} onClick={function(){ setPage(pg); }} style={{ background:"transparent", color:active ? L.ink : L.muted, border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:active ? 500 : 400, letterSpacing:"-0.01em", transition:"color 0.15s" }}>
                {pgLabel}
              </button>
            );
          })}
        </div>

        {/* Mobile spacer */}
        <div className="nav-burger" style={{ display:"none" }} />

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
          <div className="nav-desktop" style={{ display:"flex", alignItems:"center", gap:6 }}>
            {user ? (
              <>
                <button onClick={function(){ props.onSignOut(); }} style={{ whiteSpace:"nowrap", background:"transparent", color:L.muted, border:"none", padding:"7px 10px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13 }}>Sign out</button>
                <button onClick={function(){ setPage("Dashboard"); }} style={{ display:"flex", alignItems:"center", gap:7, background:L.navy, border:"none", borderRadius:8, padding:"6px 14px 6px 8px", cursor:"pointer", whiteSpace:"nowrap" }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:L.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:L.navy, fontWeight:700, flexShrink:0 }}>
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <span style={{ fontFamily:fSans, fontSize:13, fontWeight:500, color:"#fff" }}>Dashboard</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={openAuth} style={{ whiteSpace:"nowrap", background:"transparent", color:L.muted, border:"none", padding:"7px 10px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14 }}>Log in</button>
                <button onClick={function(){ openModal("nav"); }} style={{ background:L.navy, color:"#fff", border:"none", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, whiteSpace:"nowrap", letterSpacing:"-0.01em" }}>Start free</button>
              </>
            )}
          </div>
          <div style={{ position:"relative", flexShrink:0 }} className="nav-desktop">
            <select value={lang} onChange={function(e){ setLang(e.target.value); }} style={{ background:"transparent", border:"1px solid "+L.border, borderRadius:6, padding:"5px 22px 5px 8px", cursor:"pointer", fontFamily:fMono, fontSize:12, color:L.muted, outline:"none", appearance:"none", WebkitAppearance:"none" }}>
              {[["de","DE"],["en","EN"],["fr","FR"],["es","ES"],["it","IT"],["hu","HU"]].map(function(pair) {
                return <option key={pair[0]} value={pair[0]}>{pair[1]}</option>;
              })}
            </select>
            <div style={{ position:"absolute", right:5, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <svg width="7" height="4" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke={L.faint} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          {!user && <button onClick={openAuth} className="nav-burger" style={{ display:"none", background:"transparent", color:L.muted, border:"none", padding:"6px 8px", cursor:"pointer", fontFamily:fSans, fontSize:13, whiteSpace:"nowrap", flexShrink:0 }}>Log in</button>}
          {!user && <button onClick={function(){ openModal("nav"); }} className="nav-burger" style={{ display:"none", background:L.navy, color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, whiteSpace:"nowrap", flexShrink:0 }}>Start free</button>}
          <button onClick={function(){ setMenuOpen(function(o){ return !o; }); }} className="nav-burger" style={{ display:"none", background:"none", border:"1px solid "+L.border, borderRadius:7, padding:"6px 8px", cursor:"pointer", flexShrink:0 }}>
            <div style={{ width:16, height:1.5, background:L.ink, marginBottom:4, borderRadius:1 }} />
            <div style={{ width:16, height:1.5, background:L.ink, marginBottom:4, borderRadius:1 }} />
            <div style={{ width:16, height:1.5, background:L.ink, borderRadius:1 }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:"absolute", top:58, left:0, right:0, zIndex:200, borderTop:"1px solid "+L.border, padding:"12px 20px 20px", display:"flex", flexDirection:"column", gap:3, background:L.white, boxShadow:"0 8px 24px rgba(10,22,40,0.1)" }}>
          {/* Main nav links in logical order */}
          {[
            ["Home", t(lang,"navHome")||"Home"],
            ["Generator", "Generator"],
            ["EUCompliance", "Compliance"],
            ["Pricing", t(lang,"navPricing")||"Pricing"],
          ].concat(user ? [["Dashboard", t(lang,"navDashboard")||"Dashboard"]] : []).map(function(pair) {
            return (
              <button key={pair[0]} onClick={function(){ setPage(pair[0]); setMenuOpen(false); }} style={{ background:"transparent", color:page===pair[0] ? L.ink : L.muted, border:"none", padding:"10px 8px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:page===pair[0] ? 500 : 400, textAlign:"left" }}>
                {pair[1]}
              </button>
            );
          })}
          {/* Sign out — only when logged in, at the bottom before languages */}
          {user && (
            <>
              <div style={{ height:1, background:L.border, margin:"8px 0" }} />
              <button onClick={function(){ props.onSignOut(); setMenuOpen(false); }} style={{ background:"transparent", color:L.muted, border:"none", padding:"10px 8px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, textAlign:"left" }}>Sign out</button>
            </>
          )}
          {/* Language switcher */}
          <div style={{ height:1, background:L.border, margin:"8px 0" }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", padding:"4px 8px" }}>
            {[["de","DE"],["en","EN"],["fr","FR"],["es","ES"],["it","IT"],["hu","HU"]].map(function(pair) {
              var active = lang === pair[0];
              return (
                <button key={pair[0]} onClick={function(){ setLang(pair[0]); setMenuOpen(false); }} style={{ background:active ? L.navy : "transparent", color:active ? "#fff" : L.muted, border:"1px solid "+(active ? L.navy : L.border), borderRadius:6, padding:"5px 10px", cursor:"pointer", fontFamily:fMono, fontSize:12, fontWeight:active ? 600 : 400 }}>
                  {pair[1]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}


export function PaymentStrip() {
  var badges = [
    { bg:"#635BFF", label:"Stripe",    color:"#fff", font:fSans, weight:600 },
    { bg:"#1C1C1E", label:"Apple Pay", color:"#fff", font:fSans, weight:500 },
    { bg:L.white,   label:"G Pay",     color:"#4285F4", font:fSans, weight:700, border:L.border },
    { bg:"#003087", label:"SEPA",      color:"#fff", font:fMono, weight:500 },
    { bg:"#1A1F71", label:"VISA",      color:"#fff", font:fMono, weight:700 },
    { bg:"#EB001B", label:"MC",        color:"#fff", font:fMono, weight:700 },
  ];
  return (
    <div style={{ background:L.cream, borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, padding:"20px 24px" }}>
      <div className="desktop-strip" style={{ maxWidth:480, margin:"0 auto", textAlign:"center" }}>
        <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:14 }}>Secure payments via</span>
        <div className="payment-badges" style={{ display:"flex", gap:8, marginBottom:12, justifyContent:"center", flexWrap:"wrap" }}>
          {badges.map(function(b) {
            return (
              <div key={b.label} style={{ background:b.bg, border:b.border ? "1px solid "+b.border : "none", borderRadius:7, height:32, padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:b.font, fontSize:14, fontWeight:b.weight, color:b.color, letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>{b.label}</span>
              </div>
            );
          })}
        </div>
        <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"2px 10px", letterSpacing:"0.06em" }}>Coming Q3 2026</span>
        <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontWeight:300, marginTop:10, lineHeight:1.6 }}>Apple Pay, Google Pay and card payments via Stripe — launching Q3 2026. SEPA bank transfer available now.</p>
      </div>
    </div>
  );
}


export function Footer(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  var yr = new Date().getFullYear();
  var cols = [
    { title:t(lang,"footerProduct")||"Product", links:[[t(lang,"navGenerator")||"Generator","Generator"],[t(lang,"navPricing")||"Pricing","Pricing"],[t(lang,"navDashboard")||"Dashboard","Dashboard"],["EU Compliance","EUCompliance"]] },
    { title:t(lang,"footerCompany")||"Company", links:[["About","About"],["Blog","Blog"],["Careers","Careers"]] },
    { title:t(lang,"footerLegal")||"Legal",   links:[["Privacy Policy","Privacy"],["Terms of Service","Terms"],["GDPR & Data","GDPR"],["Cookie Policy","Cookies"],["FAQ","FAQ"]] },
  ];
  return (
    <footer style={{ background:L.navy, borderTop:"1px solid rgba(255,255,255,0.06)", padding:"56px 24px 36px", overflowX:"hidden" }}>
      <div style={{ maxWidth:1060, margin:"0 auto" }}>
        <div className="footer-inner">
          <div className="footer-brand" style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <LogoMark size={26} />
              <span style={{ fontFamily:fSerif, fontWeight:400, fontSize:16, color:"rgba(240,244,248,0.9)", letterSpacing:"-0.02em" }}>InvoiceAI</span>
            </div>
            <p style={{ fontFamily:fSans, fontSize:13, color:"rgba(240,244,248,0.35)", lineHeight:1.65, maxWidth:260, fontWeight:300, marginBottom:16 }}>From proposal to payment in minutes — built for European freelancers who work across borders.</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["EU compliant","GDPR ready","SEPA"].map(function(b) {
                return <span key={b} style={{ fontFamily:fMono, fontSize:10, color:L.accent, border:"1px solid "+L.accent+"30", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em" }}>{b}</span>;
              })}
            </div>
          </div>
          <div className="footer-cols" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:40 }}>
            {cols.map(function(col) {
              return (
                <div key={col.title}>
                  <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(240,244,248,0.2)", marginBottom:14 }}>{col.title}</div>
                  {col.links.map(function(pair) {
                    var lb = pair[0]; var pg = pair[1];
                    return (
                      <div key={lb} onClick={pg ? function(){ setPage(pg); } : null} style={{ fontFamily:fSans, fontSize:13, color:"rgba(240,244,248,0.4)", marginBottom:9, cursor:pg?"pointer":"default", transition:"color 0.15s" }}>{lb}</div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background:"rgba(23,169,158,0.07)", border:"1px solid rgba(23,169,158,0.15)", borderRadius:12, padding:"20px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontFamily:fSans, fontSize:15, fontWeight:500, color:"rgba(240,244,248,0.9)", marginBottom:3 }}>{t(lang,"footerWaitlist")}</div>
            <div style={{ fontFamily:fSans, fontSize:13, color:"rgba(240,244,248,0.35)", fontWeight:300 }}>{t(lang,"footerWaitlistSub")}</div>
          </div>
          <button onClick={function(){ openModal("footer"); }} style={{ background:L.accent, color:L.navy, border:"none", padding:"10px 22px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:600 }}>{t(lang,"footerCta")}</button>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:fMono, fontSize:11, color:"rgba(240,244,248,0.2)" }}>© {yr} InvoiceAI. All rights reserved.</span>
          <div style={{ display:"flex", gap:14 }}>
            {[["eu","EU VAT"],["shield","GDPR"],["bank","SEPA"]].map(function(pair) {
              return <span key={pair[1]} style={{ display:"flex", alignItems:"center", gap:4, fontFamily:fMono, fontSize:10, color:"rgba(240,244,248,0.2)" }}><Icon name={pair[0]} size={10} color="rgba(240,244,248,0.2)" />{pair[1]}</span>;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}


var BOT_QA = [
  { q:["reverse charge","rc","cross-border","art 44"],      a:"Reverse charge applies when you invoice a VAT-registered business in another EU country. InvoiceAI detects this automatically when you enter the client's VAT number — sets VAT to 0% and adds the required legal text." },
  { q:["vat","tax rate","percent"],                         a:"InvoiceAI uses the correct VAT rate per country automatically: Germany 19%, France 20%, Italy 22%, Netherlands 21%, Sweden 25% and more. You can also mark invoices VAT-exempt (§19 UStG) if you're a small business." },
  { q:["sepa","iban","bank transfer","payment"],            a:"Every invoice includes a SEPA bank transfer block with your IBAN and BIC. Just enter them once in the invoice form and they appear on every invoice automatically." },
  { q:["gdpr","data","privacy","personal"],                 a:"InvoiceAI adds a GDPR-compliant notice to every invoice automatically. Your data is hosted on AWS Frankfurt (EU), never leaves the EU, and we never sell it to third parties." },
  { q:["proposal","ai","generate","write"],                 a:"Type a brief project description, choose a tone (direct, warm or formal), and the AI writes a full client-ready proposal in under 30 seconds. You can then refine it with one-click actions." },
  { q:["plan","price","cost","solo","studio","agency"],     a:"Solo is €19/mo (up to 3 clients), Studio is €59/mo (unlimited, most popular), Agency is €149/mo (5 team seats + white-label). All plans include a 14-day free trial — no credit card needed." },
  { q:["credit note","refund","correct","cancel"],          a:"Enable 'Credit Note' in the EU Compliance section. InvoiceAI automatically assigns a separate CN-YYYY-XXX number sequence as required by EU VAT law." },
  { q:["xml","xrechnung","factur-x","e-invoice"],           a:"E-invoice XML is coming Q4 2026. We're building XRechnung 3.0 for Germany, Factur-X for France, and XML/SDI for Italy. Toggle it on in the compliance section to mark invoices as compliant." },
  { q:["late payment","interest","overdue","directive"],    a:"EU Directive 2011/7/EU gives you the right to charge 8% above ECB base rate on overdue B2B invoices — no contract needed. Enable 'Late Payment Interest' in the compliance section." },
  { q:["cancel","refund","trial","free"],                   a:"You can cancel anytime from account settings. Your 14-day trial is completely free with no credit card required. If you upgrade and change your mind, we offer a full refund within 14 days." },
];

export function SupportBot() {
  var [open, setOpen] = useState(false);
  var [msgs, setMsgs] = useState([{ role:"bot", text:"Hi! I'm the InvoiceAI assistant. Ask me anything about proposals, invoices, EU compliance or pricing." }]);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var bottomRef = useRef(null);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior:"smooth" });
  }, [msgs]);

  function findLocalAnswer(q) {
    var lower = q.toLowerCase();
    for (var i = 0; i < BOT_QA.length; i++) {
      var qa = BOT_QA[i];
      for (var j = 0; j < qa.q.length; j++) {
        if (lower.indexOf(qa.q[j]) >= 0) return qa.a;
      }
    }
    return null;
  }

  function send() {
    var text = input.trim();
    if (!text || loading) return;
    setInput("");
    var newMsgs = msgs.concat([{ role:"user", text:text }]);
    setMsgs(newMsgs);
    setLoading(true);
    var local = findLocalAnswer(text);
    if (local) {
      setTimeout(function() { setMsgs(newMsgs.concat([{ role:"bot", text:local }])); setLoading(false); }, 420);
      return;
    }
    var history = newMsgs.map(function(m) { return { role: m.role === "bot" ? "assistant" : "user", content: m.text }; });
    fetch("/api/claude", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:300, system:"You are a helpful support assistant for InvoiceAI, an EU-native invoicing and proposal tool for creative professionals. Answer in 1-3 sentences. Key facts: Solo €19/mo, Studio €59/mo, Agency €149/mo. 14-day free trial. Supports EU VAT, reverse charge, SEPA, GDPR, XRechnung. 7 EU languages.", messages:history }) })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var reply = (data.content || []).map(function(b) { return b.text || ""; }).join("") || "I'm not sure — please email hello@invoice-ai.de";
        setMsgs(newMsgs.concat([{ role:"bot", text:reply }]));
        setLoading(false);
      })
      .catch(function() {
        setMsgs(newMsgs.concat([{ role:"bot", text:"Connection error — please try again or email hello@invoice-ai.de" }]));
        setLoading(false);
      });
  }

  var SUGGESTIONS = ["How does reverse charge work?","What's in the Studio plan?","How do I add my VAT number?","Can I issue a credit note?"];

  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999 }} className="support-bot-wrap">
      {open && (
        <div className="bot-panel" style={{ position:"absolute", bottom:60, right:0, width:320, background:L.white, border:"1.5px solid "+L.border, borderRadius:16, boxShadow:"0 16px 48px rgba(44,36,22,0.18)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ background:L.accent, padding:"16px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <LogoMark size={28} bg="rgba(255,255,255,0.2)" />
              <div>
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:"#fff" }}>InvoiceAI Support</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:"rgba(255,255,255,0.65)", letterSpacing:"0.06em" }}>Usually replies instantly</div>
              </div>
            </div>
            <button onClick={function(){ setOpen(false); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px" }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10, maxHeight:320 }}>
            {msgs.map(function(m, i) {
              var isBot = m.role === "bot";
              return (
                <div key={i} style={{ display:"flex", justifyContent:isBot ? "flex-start" : "flex-end" }}>
                  <div style={{ maxWidth:"82%", background:isBot ? L.cream : L.accent, color:isBot ? L.ink : "#fff", borderRadius:isBot ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding:"9px 12px", fontFamily:fSans, fontSize:14, lineHeight:1.55, fontWeight:300 }}>{m.text}</div>
                </div>
              );
            })}
            {loading && (
              <div style={{ display:"flex", gap:4, padding:"6px 2px" }}>
                {[0,1,2].map(function(i) { return <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:L.accent, animation:"pulse 1s "+(i*0.2)+"s infinite" }} />; })}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {msgs.length <= 1 && (
            <div style={{ padding:"0 14px 8px", display:"flex", flexDirection:"column", gap:5 }}>
              {SUGGESTIONS.map(function(s) {
                return <button key={s} onClick={function(){ setInput(s); }} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontFamily:fSans, fontSize:13, color:L.muted, textAlign:"left" }}>{s}</button>;
              })}
            </div>
          )}
          <div style={{ padding:"10px 12px", borderTop:"1px solid "+L.border, display:"flex", gap:8 }}>
            <input value={input} onChange={function(e){ setInput(e.target.value); }} onKeyDown={function(e){ if(e.key==="Enter") send(); }} placeholder="Ask anything…" style={{ flex:1, border:"1.5px solid "+L.border, borderRadius:8, padding:"7px 10px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none" }} />
            <button onClick={send} disabled={!input.trim() || loading} style={{ background:input.trim() && !loading ? L.accent : L.border, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", cursor:input.trim() && !loading ? "pointer" : "not-allowed" }}>
              <Icon name="send" size={13} color="#fff" />
            </button>
          </div>
        </div>
      )}
      <button onClick={function(){ setOpen(function(o){ return !o; }); }} className="bot-trigger" style={{ width:48, height:48, borderRadius:"50%", background:open ? L.ink : L.accent, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(23,169,158,0.2)", transition:"background 0.15s" }}>
        {open ? <Icon name="x" size={18} color="#fff" /> : <Icon name="bolt" size={20} color="#fff" />}
      </button>
    </div>
  );
}


export function PwField(props) {
  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid #DDE3EA", borderRadius:8, padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#0A1628", background:"#FFFFFF", outline:"none", marginBottom:0, paddingRight:44 };
  return (
    <div style={{ position:"relative", marginBottom:10 }}>
      <input type={props.show ? "text" : "password"} value={props.value} onChange={props.onChange} placeholder={props.placeholder} style={inp} />
      <button onClick={props.toggleShow} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6B7280", padding:4, fontSize:15, lineHeight:1 }}>
        {props.show ? "🙈" : "👁"}
      </button>
    </div>
  );
}


export function AuthModal(props) {
  var onClose = props.onClose;
  var onAuth  = props.onAuth;
  var lang = props.lang || "en";
  var [mode, setMode] = useState("signin");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [confirm, setConfirm] = useState("");
  var [showPw, setShowPw] = useState(false);
  var [showConfirm, setShowConfirm] = useState(false);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");

  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:8, padding:"10px 12px", fontFamily:fSans, fontSize:15, color:L.ink, background:L.white, outline:"none", marginBottom:10 };

  function submit() {
    if (!email.trim()) { setError("Email required."); return; }
    if (mode !== "magic" && !password.trim()) { setError("Password required."); return; }
    if (mode === "signup" && password !== confirm) { setError("Passwords don't match."); return; }
    if (mode === "signup" && password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setLoading(true);
    var action = mode === "signup" ? "signup" : mode === "magic" ? "magic" : "signin";
    fetch("/api/auth", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ action:action, email: email.trim(), password: password.trim() }) })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        setLoading(false);
        if (data.error) { setError(data.error); return; }
        if (mode === "magic") { setError("Check your email for the magic link."); return; }
        if (data.user && onAuth) onAuth(data.user, data.session);
        onClose();
      })
      .catch(function() { setLoading(false); setError("Connection error. Try again."); });
  }

  var tabStyle = function(active) {
    return { flex:1, background:"none", border:"none", padding:"8px 0", cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:active ? 500 : 400, color:active ? L.ink : L.muted, borderBottom:"2px solid "+(active ? L.ink : "transparent"), transition:"all 0.15s" };
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,22,40,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:L.white, borderRadius:18, width:"100%", maxWidth:400, overflow:"hidden", boxShadow:"0 24px 64px rgba(10,22,40,0.2)" }}>
        <div style={{ padding:"28px 28px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <LogoMark size={28} />
              <span style={{ fontFamily:fSerif, fontSize:17, color:L.ink }}>InvoiceAI</span>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:L.faint, fontSize:20, lineHeight:1, padding:"2px 4px" }}>×</button>
          </div>
          <div style={{ display:"flex", marginBottom:24, borderBottom:"1px solid "+L.border }}>
            {[["signin",t(lang,"authSignIn")||"Sign in"],["signup",t(lang,"authSignUp")||"Sign up"],["magic",t(lang,"authMagic")||"Magic link"]].map(function(pair) {
              return <button key={pair[0]} onClick={function(){ setMode(pair[0]); setError(""); }} style={tabStyle(mode===pair[0])}>{pair[1]}</button>;
            })}
          </div>
        </div>
        <div style={{ padding:"0 28px 28px" }}>
          <input type="email" value={email} onChange={function(e){ setEmail(e.target.value); }} placeholder="Email address" style={inp} />
          {mode !== "magic" && <PwField value={password} onChange={function(e){ setPassword(e.target.value); }} placeholder="Password" show={showPw} toggleShow={function(){ setShowPw(function(s){ return !s; }); }} />}
          {mode === "signup" && <PwField value={confirm} onChange={function(e){ setConfirm(e.target.value); }} placeholder="Confirm password" show={showConfirm} toggleShow={function(){ setShowConfirm(function(s){ return !s; }); }} />}
          {error && <p style={{ fontFamily:fSans, fontSize:14, color: error.indexOf("Check") >= 0 ? L.green : L.accent, margin:"0 0 12px" }}>{error}</p>}
          <button onClick={submit} disabled={loading} style={{ width:"100%", background:loading ? L.border : L.accent, color:"#fff", border:"none", padding:"12px", borderRadius:9, cursor:loading?"not-allowed":"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, marginTop:4, boxShadow:loading?"none":"0 4px 14px rgba(23,169,158,0.18)" }}>
            {loading ? "Working…" : mode === "signin" ? (t(lang,"authSignIn")||"Sign in") : mode === "signup" ? (t(lang,"authSignUp")||"Sign up") : "Send magic link"}
          </button>
          <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, textAlign:"center", marginTop:14, letterSpacing:"0.04em" }}>14-day free trial · No credit card · Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}


var ROLES = ["Freelancer","Agency owner","Designer","Developer","Consultant","Other"];

export function SignupModal(props) {
  var onClose = props.onClose;
  var lang = props.lang || "en";
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [role, setRole] = useState("");
  var [country, setCountry] = useState("Germany");
  var [loading, setLoading] = useState(false);
  var [done, setDone] = useState(false);
  var [error, setError] = useState("");

  function submit() {
    if (!name.trim() || !email.trim() || !role) { setError("Please fill in all required fields."); return; }
    if (email.indexOf("@") < 0) { setError("Please enter a valid email address."); return; }
    setError(""); setLoading(true);
    var parts = name.trim().split(" ");
    var firstName = parts[0];
    var lastName = parts.slice(1).join(" ");
    fetch("/api/loops", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email: email.trim(), firstName:firstName, lastName:lastName, country:country, userGroup:role, source:"waitlist" }) })
      .then(function(r) { return r.json(); })
      .then(function() { setLoading(false); setDone(true); })
      .catch(function() { setLoading(false); setDone(true); });
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:8, padding:"10px 12px", fontFamily:fSans, fontSize:15, color:L.ink, background:L.white, outline:"none" };
  var lbl = { display:"block", marginBottom:4, fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(44,36,22,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:L.white, borderRadius:20, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 24px 64px rgba(44,36,22,0.25)" }}>
        <div style={{ background:L.accent, padding:"24px 28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Early Access · invoice-ai.de</div>
              <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1 }}>{t(lang,"modalTitle")}</h2>
              <p style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.75)", marginTop:6, fontWeight:300, lineHeight:1.5 }}>{t(lang,"modalSub")}</p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}>×</button>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:14 }}>
            {["14-day free trial","No credit card","EU-hosted data"].map(function(badge) {
              return <div key={badge} style={{ fontFamily:fMono, fontSize:10, color:"rgba(255,255,255,0.65)", letterSpacing:"0.04em" }}>{badge}</div>;
            })}
          </div>
        </div>
        {!done ? (
          <div style={{ padding:"24px 28px 28px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><label style={lbl}>Full name *</label><input value={name} onChange={function(e){ setName(e.target.value); }} placeholder="e.g. Anna Müller" style={inp} /></div>
              <div><label style={lbl}>Work email *</label><input type="email" value={email} onChange={function(e){ setEmail(e.target.value); }} placeholder="alex@studio.de" style={inp} /></div>
              <div>
                <label style={lbl}>I am a *</label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ROLES.map(function(r) {
                    return <button key={r} onClick={function(){ setRole(r); }} style={{ background:role===r?L.ink:L.paper, color:role===r?"#fff":L.muted, border:"1.5px solid "+(role===r?L.ink:L.border), borderRadius:99, padding:"5px 12px", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:role===r?500:400 }}>{r}</button>;
                  })}
                </div>
              </div>
              <div>
                <label style={lbl}>Country *</label>
                <select value={country} onChange={function(e){ setCountry(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {EU_COUNTRIES_LIST.map(function(c){ return <option key={c} value={c}>{c}</option>; })}
                </select>
              </div>
              {error && <p style={{ fontFamily:fSans, fontSize:14, color:L.accent, margin:0 }}>{error}</p>}
              <button onClick={submit} disabled={loading} style={{ background:loading?L.border:L.accent, color:"#fff", border:"none", padding:"13px", borderRadius:9, cursor:loading?"not-allowed":"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:loading?"none":"0 4px 14px rgba(23,169,158,0.2)" }}>
                {loading ? t(lang,"modalJoining") : t(lang,"modalCta")}
              </button>
            </div>
            <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, textAlign:"center", marginTop:14, letterSpacing:"0.04em" }}>No spam. One email when we launch. Unsubscribe anytime.</p>
          </div>
        ) : (
          <div style={{ padding:"36px 28px 40px", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><Icon name="check" size={22} color={L.accent} /></div>
            <h3 style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.ink, marginBottom:8, letterSpacing:"-0.02em" }}>{t(lang,"modalDoneTitle")}</h3>
            <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, marginBottom:6, fontWeight:300 }}>We'll email you at <strong style={{ color:L.ink }}>{email}</strong> the moment early access opens.</p>
            <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, lineHeight:1.6, marginBottom:24, fontWeight:300 }}>Founding member rate: <strong style={{ color:L.accent }}>Studio €29/mo forever</strong> — locked in at signup.</p>
            <div style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <p style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>While you wait — try the demo</p>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300 }}>Generate a real proposal or invoice right now. No account needed.</p>
            </div>
            <button onClick={onClose} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500 }}>{t(lang,"modalExploreCta")}</button>
          </div>
        )}
      </div>
    </div>
  );
}


export function CookieBanner(props) {
  return (
    <div className="cookie-banner" style={{ position:"fixed", bottom:24, left:24, zIndex:998, maxWidth:320, background:L.white, border:"1.5px solid "+L.border, borderRadius:14, padding:"18px 18px 14px", boxShadow:"0 8px 32px rgba(44,36,22,0.15)" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="shield" size={16} color={L.accent} />
          <span style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>Cookie settings</span>
        </div>
      </div>
      <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.55, marginBottom:14, fontWeight:300 }}>We use only essential cookies to keep you logged in. No tracking, no advertising, no third-party cookies. Our analytics are cookieless via Plausible.</p>
      <div style={{ display:"flex", gap:7, marginBottom:10 }}>
        <button onClick={props.onAccept} style={{ flex:1, background:L.accent, color:"#fff", border:"none", padding:"9px 0", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>Accept</button>
        <button onClick={props.onDecline} style={{ flex:1, background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"9px 0", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14 }}>Decline</button>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <button onClick={function(){ props.setPage("Cookies"); props.onAccept(); }} style={{ background:"none", border:"none", fontFamily:fMono, fontSize:11, color:L.faint, cursor:"pointer", letterSpacing:"0.05em" }}>Cookie Policy</button>
      </div>
    </div>
  );
}
