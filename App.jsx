import { useState, useEffect, useRef } from "react";

// ── Palette ──────────────────────────────────────────────────────────────────
var L = {
  ink:        "#2C2416",
  paper:      "#F5F0E8",
  cream:      "#EDE8DC",
  sand:       "#E4DDCF",
  white:      "#FAF7F2",
  accent:     "#C8502A",
  accentLt:   "#E8896A",
  accentGlow: "rgba(200,80,42,0.08)",
  gold:       "#9A7820",
  goldGlow:   "rgba(154,120,32,0.1)",
  muted:      "#7A6F62",
  faint:      "#B0A898",
  border:     "#D8D0C4",
  borderLt:   "#EAE4DA",
  green:      "#2A7A54",
  greenGlow:  "rgba(42,122,84,0.1)",
  blue:       "#2A5E9A",
  blueGlow:   "rgba(42,94,154,0.08)",
};

var fSans  = "'DM Sans',sans-serif";
var fMono  = "'DM Mono',monospace";
var fSerif = "'Playfair Display',serif";

var FONTS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');";

// ── Translations ──────────────────────────────────────────────────────────────
var TR = {
  en: {
    navStart:        "Start Free",
    navStartArrow:   "Start Free →",
    heroPill:        "Built for European Freelancers · 1,400+ professionals",
    heroTitle1:      "Made for the way",
    heroTitle2:      "freelancers work.",
    heroSub:         "AI proposals, EU-compliant invoices, client dashboard — one tool built for designers, developers, consultants and agencies across Europe.",
    heroCta:         "Get early access →",
    heroSecondary:   "See pricing",
    heroFine:        "No credit card · 14-day free trial · Cancel anytime",
    heroCounter:     "invoiced this month by our users",
    featTitle:       "Built around how you actually work",
    featSub:         "Tools built for accountants. Ours is built for the people who do the work.",
    euTitle:         "Built for how Europe invoices.",
    euSub:           "Not retrofitted. Not an add-on. Every EU compliance requirement is built into the core.",
    reviewsTitle:    "Trusted across Europe",
    pricingTitle:    "Simple, honest pricing",
    pricingSub:      "14-day free trial. No credit card.",
    pricingCta:      "Start free trial →",
    propTitle:       "Generate a Proposal",
    propSub:         "Describe your project. AI writes a client-ready proposal in seconds.",
    propGenerate:    "✦ Generate Proposal",
    propWriting:     "✦ Writing your proposal…",
    propReady:       "✓ Proposal ready",
    modalTitle:      "Join the waitlist.",
    modalSub:        "Founding members lock in Studio at €29/mo forever — 50% off the launch price.",
    modalCta:        "Join the waitlist →",
    modalJoining:    "Joining…",
    modalDoneTitle:  "You're on the list.",
    modalExploreCta: "Explore the demo →",
    footerWaitlist:  "Join the waitlist — Studio €29/mo forever",
    footerWaitlistSub: "Founding member rate. Locked in at signup. Ends at launch.",
    footerCta:       "Get early access →",
  },
  de: {
    navStart:        "Kostenlos starten",
    navStartArrow:   "Kostenlos starten →",
    heroPill:        "Für europäische Freelancer · 1.400+ Profis",
    heroTitle1:      "Gemacht für die Art,",
    heroTitle2:      "wie Freelancer arbeiten.",
    heroSub:         "KI-Angebote, EU-konforme Rechnungen, Kunden-Dashboard — ein Tool für Designer, Entwickler, Berater und Agenturen in ganz Europa.",
    heroCta:         "Frühen Zugang erhalten →",
    heroSecondary:   "Preise ansehen",
    heroFine:        "Keine Kreditkarte · 14 Tage kostenlos · Jederzeit kündbar",
    heroCounter:     "diesen Monat von unseren Nutzern abgerechnet",
    featTitle:       "Gebaut für die Art, wie du wirklich arbeitest",
    featSub:         "Tools für Buchhalter. Unseres ist für die Menschen gebaut, die die Arbeit machen.",
    euTitle:         "Gebaut für die europäische Rechnungsstellung.",
    euSub:           "Nicht nachgerüstet. Kein Add-on. Jede EU-Compliance-Anforderung ist im Kern integriert.",
    reviewsTitle:    "In ganz Europa vertraut",
    pricingTitle:    "Einfache, ehrliche Preise",
    pricingSub:      "14 Tage kostenlos. Keine Kreditkarte.",
    pricingCta:      "Kostenlos testen →",
    propTitle:       "Angebot erstellen",
    propSub:         "Beschreibe dein Projekt. KI schreibt in Sekunden ein kundenfertiges Angebot.",
    propGenerate:    "✦ Angebot erstellen",
    propWriting:     "✦ Angebot wird geschrieben…",
    propReady:       "✓ Angebot fertig",
    modalTitle:      "Auf die Warteliste.",
    modalSub:        "Gründungsmitglieder sichern sich Studio für immer zu €29/Monat — 50% unter dem Startpreis.",
    modalCta:        "Auf die Warteliste →",
    modalJoining:    "Wird eingetragen…",
    modalDoneTitle:  "Du stehst auf der Liste.",
    modalExploreCta: "Demo erkunden →",
    footerWaitlist:  "Warteliste — Studio €29/Monat für immer",
    footerWaitlistSub: "Gründerpreis. Beim Anmelden gesichert. Endet beim Start.",
    footerCta:       "Frühen Zugang erhalten →",
  },
};

function t(lang, key) {
  return (TR[lang] || TR.en)[key] || TR.en[key] || key;
}


// ── EU Countries ──────────────────────────────────────────────────────────────
var EU = [
  { code:"DE", name:"Germany",     vat:19, cur:"EUR", lang:"de", fmt:"DD.MM.YYYY" },
  { code:"FR", name:"France",      vat:20, cur:"EUR", lang:"fr", fmt:"DD/MM/YYYY" },
  { code:"IT", name:"Italy",       vat:22, cur:"EUR", lang:"it", fmt:"DD/MM/YYYY" },
  { code:"ES", name:"Spain",       vat:21, cur:"EUR", lang:"es", fmt:"DD/MM/YYYY" },
  { code:"NL", name:"Netherlands", vat:21, cur:"EUR", lang:"nl", fmt:"DD-MM-YYYY" },
  { code:"BE", name:"Belgium",     vat:21, cur:"EUR", lang:"fr", fmt:"DD/MM/YYYY" },
  { code:"SE", name:"Sweden",      vat:25, cur:"SEK", lang:"sv", fmt:"YYYY-MM-DD" },
  { code:"AT", name:"Austria",     vat:20, cur:"EUR", lang:"de", fmt:"DD.MM.YYYY" },
  { code:"PL", name:"Poland",      vat:23, cur:"PLN", lang:"pl", fmt:"DD.MM.YYYY" },
  { code:"PT", name:"Portugal",    vat:23, cur:"EUR", lang:"pt", fmt:"DD/MM/YYYY" },
];

var PLANS = [
  { name:"Solo",   price:19,  hi:false, features:["50 invoices / month","20 proposals","AI writer","PDF export","SEPA payment block","EU VAT auto-calc"] },
  { name:"Studio", price:59,  hi:true,  badge:"Most Popular", features:["Unlimited invoices","Unlimited proposals","AI writer + tone","Client dashboard","Payment tracking","Brand kits","E-signatures","Reverse charge"] },
  { name:"Agency", price:149, hi:false, features:["Everything in Studio","5 team seats","White-label","API access","Priority support","DATEV export","XRechnung XML"] },
];

var REVIEWS = [
  { id:1, name:"Jonas Müller",    role:"Freelance Developer",    city:"Berlin",    av:"JM", col:"#8A7A6A", rating:5, text:"Reverse charge auto-detection alone saves me an hour per cross-border invoice. Finally a tool built for how EU freelancers actually work.", platform:"G2",       helpful:34 },
  { id:2, name:"Léa Fontaine",    role:"Agency Owner",           city:"Paris",     av:"LF", col:"#7A6A5A", rating:5, text:"Cut proposal time from 3 hours to 20 minutes. Win rate went up. The tone selector makes a real difference on larger clients.", platform:"Trustpilot", helpful:28 },
  { id:3, name:"Marco Bianchi",   role:"Art Director",           city:"Milan",     av:"MB", col:"#9A8A7A", rating:5, text:"Closed a €12k brand project with a proposal I built in 8 minutes. The AI nailed the tone — warm but authoritative.", platform:"G2",       helpful:41 },
  { id:4, name:"Sophie Richter",  role:"UX Designer",            city:"Munich",    av:"SR", col:"#8A7A6A", rating:5, text:"The sequential invoice numbering and credit note system is exactly right for German law. Other tools get this completely wrong.", platform:"Trustpilot", helpful:19 },
  { id:5, name:"Pieter van Dam",  role:"Motion Designer",        city:"Amsterdam", av:"PD", col:"#7A6A5A", rating:5, text:"SEPA block on every invoice is perfect. Clients pay within days now instead of weeks. Simple change, massive impact.", platform:"Capterra",  helpful:22 },
  { id:6, name:"Anna Kowalski",   role:"Translator",             city:"Warsaw",    av:"AK", col:"#9A8A7A", rating:5, text:"Seven languages, correct VAT rates, GDPR notice — it just handles everything. I invoice clients in four countries effortlessly.", platform:"Capterra",  helpful:17 },
];

// ── SVG Icon system ─────────────────────────────────────────────────────────
function Icon(props) {
  var name = props.name;
  var size = props.size || 18;
  var color = props.color || L.ink;
  var xStyle = props.style || {};
  var s = { width:size, height:size, display:"inline-block", flexShrink:0, verticalAlign:"middle" };
  Object.assign(s, xStyle);
  var p = { fill:"none", stroke:color, strokeWidth:1.5, strokeLinecap:"round", strokeLinejoin:"round" };
  if (name === "bank")       return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M3 21h18M3 10h18M5 10V21M9 10V21M15 10V21M19 10V21M12 3L3 10h18L12 3z"/></svg>;
  if (name === "shield")     return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z"/><path {...p} d="M9 12l2 2 4-4"/></svg>;
  if (name === "eu")         return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
  if (name === "hash")       return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg>;
  if (name === "clock")      return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 7v5l3 3"/></svg>;
  if (name === "document")   return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline {...p} points="14 3 14 9 20 9"/><line {...p} x1="8" y1="13" x2="16" y2="13"/><line {...p} x1="8" y1="17" x2="12" y2="17"/></svg>;
  if (name === "send")       return <svg viewBox="0 0 24 24" style={s}><line {...p} x1="22" y1="2" x2="11" y2="13"/><polygon {...p} points="22 2 15 22 11 13 2 9 22 2"/></svg>;
  if (name === "reverse")    return <svg viewBox="0 0 24 24" style={s}><polyline {...p} points="17 1 21 5 17 9"/><path {...p} d="M3 11V9a4 4 0 014-4h14"/><polyline {...p} points="7 23 3 19 7 15"/><path {...p} d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
  if (name === "users")      return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M23 21v-2a4 4 0 00-3-3.9"/><path {...p} d="M16 3.1a4 4 0 010 7.8"/></svg>;
  if (name === "card")       return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="1" y="4" width="22" height="16" rx="2"/><line {...p} x1="1" y1="10" x2="23" y2="10"/></svg>;
  if (name === "bolt")       return <svg viewBox="0 0 24 24" style={s}><polygon {...p} points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  if (name === "check")      return <svg viewBox="0 0 24 24" style={s}><polyline {...p} points="20 6 9 17 4 12"/></svg>;
  if (name === "star")       return <svg viewBox="0 0 24 24" style={s}><polygon fill={color} stroke="none" points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/></svg>;
  if (name === "proposal")   return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 20h9"/><path {...p} d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
  if (name === "overview")   return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="3" y="3" width="7" height="7" rx="1"/><rect {...p} x="14" y="3" width="7" height="7" rx="1"/><rect {...p} x="3" y="14" width="7" height="7" rx="1"/><rect {...p} x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (name === "download")   return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline {...p} points="7 10 12 15 17 10"/><line {...p} x1="12" y1="15" x2="12" y2="3"/></svg>;
  if (name === "archive")    return <svg viewBox="0 0 24 24" style={s}><polyline {...p} points="21 8 21 21 3 21 3 8"/><rect {...p} x="1" y="3" width="22" height="5" rx="1"/><line {...p} x1="10" y1="12" x2="14" y2="12"/></svg>;
  if (name === "brand")      return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="13.5" cy="6.5" r="1.5"/><circle {...p} cx="17.5" cy="10.5" r="1.5"/><circle {...p} cx="8.5" cy="7.5" r="1.5"/><circle {...p} cx="6.5" cy="12.5" r="1.5"/><path {...p} d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.9.7-1.5 1.5-1.5H16c2.8 0 5-2.2 5-5C21 6 17 2 12 2z"/></svg>;
  if (name === "info")       return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="10"/><line {...p} x1="12" y1="8" x2="12" y2="8"/><line {...p} x1="12" y1="12" x2="12" y2="16"/></svg>;
  if (name === "x")          return <svg viewBox="0 0 24 24" style={s}><line {...p} x1="18" y1="6" x2="6" y2="18"/><line {...p} x1="6" y1="6" x2="18" y2="18"/></svg>;
  return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="10"/></svg>;
}

// ── Atom components ───────────────────────────────────────────────────────────
function Pill(props) {
  var color = props.color || L.accent;
  return (
    <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:999, border:"1.5px solid "+color, color:color, fontSize:11, fontFamily:fMono, letterSpacing:"0.08em", textTransform:"uppercase" }}>
      {props.children}
    </span>
  );
}

function Tag(props) {
  var c = props.c || L.green;
  return (
    <span style={{ padding:"2px 8px", borderRadius:4, background:c+"22", color:c, fontSize:10, fontFamily:fMono, letterSpacing:"0.06em" }}>
      {props.children}
    </span>
  );
}

function Stars(props) {
  var n = props.n || 5;
  var size = props.size || 12;
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(function(i) {
        return <Icon key={i} name="star" size={size} color={i <= n ? L.gold : L.borderLt} />;
      })}
    </span>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
var PAGES = ["Home","Generator","Pricing","Dashboard"];

function Nav(props) {
  var page = props.page;
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  var setLang = props.setLang;
  var [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:L.white, borderBottom:"1px solid "+L.border, flexShrink:0 }}>
      <div style={{ height:56, display:"flex", alignItems:"center", padding:"0 20px", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }} onClick={function(){ setPage("Home"); setMenuOpen(false); }}>
          <div style={{ width:28, height:28, background:L.accent, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontFamily:fSerif, fontSize:15, fontWeight:900 }}>I</span>
          </div>
          <div>
            <div style={{ fontFamily:fSerif, fontWeight:700, fontSize:17, color:L.ink, lineHeight:1.1, letterSpacing:"-0.02em" }}>InvoiceAI</div>
            <div style={{ fontFamily:fMono, fontSize:7, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>for Europe</div>
          </div>
        </div>
        <div style={{ flex:1 }} />
        <div className="nav-desktop" style={{ display:"flex", gap:2 }}>
          {PAGES.map(function(pg) {
            return (
              <button key={pg} onClick={function(){ setPage(pg); }} style={{ background:page===pg ? L.accentGlow : "transparent", color:page===pg ? L.accent : L.muted, border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:page===pg ? 500 : 400 }}>
                {pg}
              </button>
            );
          })}
        </div>
        <button onClick={function(){ openModal("nav"); }} className="nav-cta" style={{ background:L.accent, color:"#fff", border:"none", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)", flexShrink:0 }}>
          {t(lang,"navStart")}
        </button>
        <div style={{ display:"flex", gap:2, flexShrink:0, marginLeft:4 }}>
          {["de","en"].map(function(l) {
            return (
              <button key={l} onClick={function(){ setLang(l); }} style={{ background:lang===l ? L.ink : "transparent", color:lang===l ? "#fff" : L.muted, border:"1px solid "+(lang===l ? L.ink : L.border), borderRadius:5, padding:"4px 8px", cursor:"pointer", fontFamily:fMono, fontSize:10, fontWeight:lang===l ? 600 : 400, letterSpacing:"0.04em" }}>
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
        <button onClick={function(){ setMenuOpen(function(o){ return !o; }); }} className="nav-burger" style={{ display:"none", background:"none", border:"1px solid "+L.border, borderRadius:7, padding:"6px 8px", cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:18, height:2, background:L.ink, marginBottom:4, borderRadius:1 }} />
          <div style={{ width:18, height:2, background:L.ink, marginBottom:4, borderRadius:1 }} />
          <div style={{ width:18, height:2, background:L.ink, borderRadius:1 }} />
        </button>
      </div>
      {menuOpen && (
        <div style={{ borderTop:"1px solid "+L.border, padding:"12px 16px 16px", display:"flex", flexDirection:"column", gap:4, background:L.white }}>
          {PAGES.map(function(pg) {
            return (
              <button key={pg} onClick={function(){ setPage(pg); setMenuOpen(false); }} style={{ background:page===pg ? L.accentGlow : "transparent", color:page===pg ? L.accent : L.ink, border:"none", padding:"10px 14px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:page===pg ? 500 : 400, textAlign:"left" }}>
                {pg}
              </button>
            );
          })}
          <button onClick={function(){ openModal("nav-mobile"); setMenuOpen(false); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"12px 14px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, marginTop:4 }}>
            {t(lang,"navStartArrow")}
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  return (
    <div style={{ background:L.paper }}>
      <HeroSection setPage={setPage} openModal={openModal} lang={lang} />
      <FeaturesSection lang={lang} />
      <EUComplianceSection lang={lang} />
      <ReviewsSection lang={lang} />
      <PricingSection setPage={setPage} openModal={openModal} lang={lang} embedded={true} />
    </div>
  );
}

function HeroSection(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  var [count, setCount] = useState(0);
  useEffect(function() {
    var target = 10247;
    var step = Math.ceil(target / 60);
    var t = setInterval(function() {
      setCount(function(c) {
        if (c + step >= target) { clearInterval(t); return target; }
        return c + step;
      });
    }, 16);
    return function() { clearInterval(t); };
  }, []);
  return (
    <section style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"72px 24px 64px", textAlign:"center" }}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <Pill>Built for European Freelancers · 1,400+ professionals</Pill>
        <h1 style={{ fontFamily:fSerif, fontSize:"clamp(36px,6vw,68px)", fontWeight:900, color:L.ink, margin:"20px 0 16px", letterSpacing:"-0.03em", lineHeight:1.05 }}>
          {t(lang,"heroTitle1")}<br />
          <span style={{ color:L.accent }}>{t(lang,"heroTitle2")}</span>
        </h1>
        <p style={{ fontFamily:fSans, fontSize:17, color:L.muted, lineHeight:1.65, maxWidth:500, margin:"0 auto 36px", fontWeight:300 }}>
{t(lang,"heroSub")}
        </p>
        <div className="hero-btns" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
          <button onClick={function(){ openModal("hero"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"14px 32px", borderRadius:10, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, boxShadow:"0 8px 28px rgba(200,80,42,0.3)" }}>
{t(lang,"heroCta")}
          </button>
          <button onClick={function(){ setPage("Pricing"); }} style={{ background:"transparent", color:L.ink, border:"1.5px solid "+L.border, padding:"14px 24px", borderRadius:10, cursor:"pointer", fontFamily:fSans, fontSize:15 }}>
{t(lang,"heroSecondary")}
          </button>
        </div>
        <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.06em" }}>
{t(lang,"heroFine")}
        </p>
        <div style={{ marginTop:32, display:"inline-block", background:L.cream, border:"1px solid "+L.border, borderRadius:12, padding:"14px 28px" }}>
          <div style={{ fontFamily:fSerif, fontSize:28, color:L.gold, fontWeight:700 }}>
            {"€"+count.toLocaleString("de-DE")}
          </div>
          <div style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>
{t(lang,"heroCounter")}
          </div>
        </div>
      </div>
    </section>
  );
}

var FEATURES = [
  { icon:"proposal", title:"AI Proposal Writer", desc:"Describe your project in plain language. AI writes a polished, client-ready proposal in under 30 seconds — in 7 European languages." },
  { icon:"document", title:"EU-Native Invoicing", desc:"Sequential numbering, reverse charge, SEPA, GDPR notice, VAT per country. Legally correct in DE, FR, IT, ES, NL, BE, SE and more." },
  { icon:"users",    title:"Client Dashboard",   desc:"Full client history, payment status, proposal analytics, brand kits and e-signatures — everything in one place." },
  { icon:"send",     title:"E-Invoice XML",      desc:"XRechnung for Germany, Factur-X for France, XML/SDI for Italy. Compliant with current and upcoming EU e-invoicing mandates." },
  { icon:"card",     title:"SEPA Payments",      desc:"Every invoice includes a professional SEPA bank transfer block with validated IBAN/BIC and payment reference." },
  { icon:"shield",   title:"GDPR Built-in",      desc:"Auto-GDPR notice on invoices, EU-hosted data, Data Processing Agreement available, cookieless analytics." },
];

function FeaturesSection(props) {
  var lang = props.lang || "en";
  return (
    <section style={{ padding:"72px 24px", background:L.paper }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <Pill color={L.gold}>Features</Pill>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:L.ink, margin:"14px 0 10px", letterSpacing:"-0.025em" }}>
{t(lang,"featTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300 }}>
            {t(lang,"featSub")}
          </p>
        </div>
        <div className="grid3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {FEATURES.map(function(f) {
            return (
              <div key={f.title} style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:14, padding:"24px 22px" }}>
                <div style={{ width:36, height:36, background:L.accentGlow, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon name={f.icon} size={18} color={L.accent} />
                </div>
                <h3 style={{ fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.6, fontWeight:300 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

var EU_FEATURES = [
  { icon:"hash",    title:"Sequential Numbering",        badge:"Art. 226 VAT Dir.",  desc:"Every invoice gets a unique unbroken number. InvoiceAI manages the sequence automatically — no gaps, no duplicates." },
  { icon:"reverse", title:"Reverse Charge (Art. 44)",    badge:"Auto-detected",      desc:"Invoicing a VAT-registered client in another EU country? RC is auto-detected, VAT set to 0%, legal text added." },
  { icon:"eu",      title:"VAT per Country",             badge:"15 countries",       desc:"Germany 19%, France 20%, Italy 22%, Netherlands 21%, Sweden 25% — correct rates, formats and legal text per country." },
  { icon:"bank",    title:"SEPA Bank Transfer",          badge:"ISO 20022",          desc:"Professional SEPA block on every invoice with IBAN validation and payment reference for easy reconciliation." },
  { icon:"shield",  title:"GDPR Notice",                 badge:"Art. 6(1)(b)",       desc:"Auto-adds a legally compliant GDPR data processing notice to every invoice. Best practice for EU B2B." },
  { icon:"clock",   title:"Late Payment Interest",       badge:"EU Dir. 2011/7/EU",  desc:"Statutory interest at 8% above ECB base rate. Your legal right on overdue B2B invoices — added automatically." },
  { icon:"document","title":"Credit Notes",             badge:"Separate numbering",  desc:"Legally distinct from invoices in the EU. InvoiceAI manages CN-YYYY-XXX sequences separately." },
  { icon:"send",    title:"E-Invoice XML",               badge:"Coming Q4 2026",     desc:"XRechnung (DE), Factur-X (FR), XML/SDI (IT). Compliant with current and upcoming EU mandates." },
];

function EUComplianceSection(props) {
  var lang = props.lang || "en";
  var [open, setOpen] = useState(-1);
  return (
    <section style={{ background:L.white, borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, padding:"72px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Pill color={L.blue}>EU-Native Compliance</Pill>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:L.ink, margin:"14px 0 10px", letterSpacing:"-0.025em" }}>
{t(lang,"euTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300, maxWidth:480, margin:"0 auto" }}>
            {t(lang,"euSub")}
          </p>
        </div>
        <div className="grid4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {EU_FEATURES.map(function(f, i) {
            var isOpen = open === i;
            return (
              <div key={f.title} onClick={function(){ setOpen(isOpen ? -1 : i); }}
                style={{ background:isOpen ? L.cream : L.paper, border:"1.5px solid "+(isOpen ? L.accent+"44" : L.border), borderRadius:12, padding:"16px 16px 14px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <Icon name={f.icon} size={16} color={L.ink} />
                  <span style={{ fontFamily:fMono, fontSize:7, color:L.accent, background:L.accentGlow, borderRadius:4, padding:"2px 6px", letterSpacing:"0.06em" }}>{f.badge}</span>
                </div>
                <div style={{ fontFamily:fSans, fontSize:12, fontWeight:600, color:L.ink, marginBottom:4 }}>{f.title}</div>
                {isOpen && <p style={{ fontFamily:fSans, fontSize:11, color:L.muted, lineHeight:1.55, margin:0, fontWeight:300 }}>{f.desc}</p>}
              </div>
            );
          })}
        </div>
        <div style={{ background:L.ink, borderRadius:14, padding:"22px 28px", marginTop:20, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <Icon name="archive" size={24} color={L.accentLt} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fSerif, fontSize:16, fontWeight:700, color:L.paper, marginBottom:3 }}>10-Year Invoice Archive</div>
            <div style={{ fontFamily:fSans, fontSize:12, color:"rgba(245,240,232,0.5)", fontWeight:300 }}>
              German GoBD (§147 AO), French LPF, Italian CAF — EU tax law requires 10-year retention. InvoiceAI archives every invoice automatically.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection(props) {
  var lang = props.lang || "en";
  var [active, setActive] = useState(0);
  var featured = [REVIEWS[0], REVIEWS[1], REVIEWS[2]];
  var rest = [REVIEWS[3], REVIEWS[4], REVIEWS[5]];
  return (
    <section style={{ background:L.cream, borderBottom:"1px solid "+L.border, padding:"72px 0 56px" }}>
      <div style={{ textAlign:"center", marginBottom:32, padding:"0 24px" }}>
        <Pill color={L.gold}>Reviews</Pill>
        <h2 style={{ fontFamily:fSerif, fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, color:L.ink, margin:"14px 0 8px", letterSpacing:"-0.025em" }}>
{t(lang,"reviewsTitle")}
        </h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:4 }}>
          <Stars n={5} size={14} />
          <span style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>4.9</span>
          <span style={{ fontFamily:fMono, fontSize:10, color:L.muted }}>from 340+ reviews</span>
        </div>
      </div>
      <div style={{ overflowX:"auto", paddingBottom:8, WebkitOverflowScrolling:"touch" }}>
        <div style={{ display:"flex", gap:14, padding:"4px 24px 8px", width:"max-content" }}>
          {REVIEWS.map(function(r, i) {
            var isFeat = i < 3;
            return (
              <div key={r.id} style={{ background:L.white, border:"1.5px solid "+(isFeat ? L.accent+"33" : L.border), borderRadius:14, padding:"18px 18px 14px", width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:10, boxShadow:isFeat ? "0 4px 16px rgba(200,80,42,0.07)" : "0 2px 8px rgba(44,36,22,0.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:r.col+"22", border:"1.5px solid "+r.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:r.col, fontWeight:500, flexShrink:0 }}>{r.av}</div>
                    <div>
                      <div style={{ fontFamily:fSans, fontSize:12, fontWeight:600, color:L.ink }}>{r.name}</div>
                      <div style={{ fontFamily:fMono, fontSize:9, color:L.muted }}>{r.role} · {r.city}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:8, color:L.faint }}>{r.platform}</span>
                </div>
                <Stars n={r.rating} size={11} />
                <p style={{ fontFamily:fSans, fontSize:12, color:L.ink, lineHeight:1.6, margin:0, fontStyle:"italic", flex:1 }}>"{r.text}"</p>
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid "+L.borderLt }}>
                  <span style={{ fontFamily:fMono, fontSize:8, color:L.green }}>✓ Verified</span>
                  <span style={{ fontFamily:fMono, fontSize:8, color:L.faint }}>👍 {r.helpful}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ textAlign:"center", marginTop:16 }}>
        <span style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.08em" }}>← scroll for more →</span>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function PricingSection(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var embedded = props.embedded;
  var lang = props.lang || "en";
  return (
    <section style={{ background:embedded ? L.paper : L.white, padding:"72px 24px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Pill color={L.gold}>Pricing</Pill>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:L.ink, margin:"14px 0 10px", letterSpacing:"-0.025em" }}>
{t(lang,"pricingTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300 }}>{t(lang,"pricingSub")}</p>
        </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:8 }}>
          {PLANS.map(function(plan) {
            return (
              <div key={plan.name} style={{ background:plan.hi ? L.accent : L.white, border:plan.hi ? "2px solid "+L.accent : "1.5px solid "+L.border, borderRadius:16, padding:"26px 22px", flex:"0 0 230px", minWidth:230, position:"relative", boxShadow:plan.hi ? "0 12px 36px rgba(200,80,42,0.25)" : "none" }}>
                {plan.badge && (
                  <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:L.gold, color:"#fff", padding:"3px 14px", borderRadius:99, fontFamily:fMono, fontSize:9, letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:plan.hi ? "rgba(255,255,255,0.7)" : L.muted, marginBottom:12 }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:3, marginBottom:22 }}>
                  <span style={{ fontFamily:fSerif, fontSize:40, fontWeight:900, color:plan.hi ? "#fff" : L.ink, lineHeight:1 }}>{"€"+plan.price}</span>
                  <span style={{ fontFamily:fSans, fontSize:13, color:plan.hi ? "rgba(255,255,255,0.55)" : L.muted }}>/mo</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                  {plan.features.map(function(f) {
                    return (
                      <div key={f} style={{ display:"flex", gap:8, fontFamily:fSans, fontSize:12, color:plan.hi ? "rgba(255,255,255,0.8)" : L.ink, lineHeight:1.4 }}>
                        <Icon name="check" size={13} color={plan.hi ? "rgba(255,255,255,0.7)" : L.green} />
                        {f}
                      </div>
                    );
                  })}
                </div>
                <button onClick={function(){ openModal("pricing-"+plan.name.toLowerCase()); }} style={{ width:"100%", background:plan.hi ? "rgba(255,255,255,0.15)" : L.accent, color:"#fff", border:plan.hi ? "1.5px solid rgba(255,255,255,0.3)" : "none", padding:"12px 0", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500 }}>
{t(lang,"pricingCta")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Generator ─────────────────────────────────────────────────────────────────
var PROJ_TYPES = ["Brand Identity","Logo Design","UX/UI Design","Web Development","App Design","Software Consulting","Motion Design","Copywriting","Translation","Photography","Strategy","Pitch Deck","Other"];
var BUDGETS = ["Not specified","€1,500–3,000","€3,000–6,000","€6,000–12,000","€12,000–25,000","€25,000+"];
var TIMELINES = ["Not specified","1–2 weeks","3–4 weeks","5–8 weeks","2–3 months","Ongoing retainer"];

// EU invoice logic helpers
function fmtDate(country, daysOffset) {
  var d = new Date();
  if (daysOffset) d.setDate(d.getDate() + daysOffset);
  var dd = String(d.getDate()).padStart(2,"0");
  var mm = String(d.getMonth()+1).padStart(2,"0");
  var yyyy = d.getFullYear();
  var fmt = (country && country.fmt) || "DD.MM.YYYY";
  return fmt.replace("DD",dd).replace("MM",mm).replace("YYYY",yyyy);
}

function InvoicePreviewPanel(props) {
  var s = props.state;
  var setView = props.setView;
  var sub = s.lines.reduce(function(acc, l) { return acc + (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0); }, 0);
  var discAmt = s.discount ? sub * (parseFloat(s.discount)/100) : 0;
  var subAfter = sub - discAmt;
  var vatRate = (s.rc || s.vatExempt) ? 0 : (s.country ? s.country.vat : 19);
  var vatAmt = subAfter * vatRate / 100;
  var total = subAfter + vatAmt;
  var sym = s.country && s.country.cur === "SEK" ? "kr" : "€";
  var num = s.country ? s.country.code : "DE";
  var yr = new Date().getFullYear();
  var invNum = num + "-" + yr + "-437";
  var cnNum = "CN-" + yr + "-001";
  return (
    <div style={{ padding:"0 24px 48px" }}>
      <button onClick={function(){ setView("form"); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontFamily:fMono, fontSize:9, letterSpacing:"0.06em", marginBottom:14, padding:0 }}>
        ← Back to form
      </button>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button style={{ background:L.ink, color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
          <Icon name="download" size={13} color="#fff" />
          Export PDF
        </button>
        <button onClick={function(){ if(props.setPage) props.setPage("ClientPortal"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
          <Icon name="send" size={13} color="#fff" />
          Share with client →
        </button>
      </div>
      <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, padding:"36px 40px", boxShadow:"0 8px 32px rgba(10,10,15,0.08)" }}>
        {s.creditNote && (
          <div style={{ background:L.goldGlow, border:"1.5px solid "+L.gold+"55", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="document" size={14} color={L.gold} />
            <span style={{ fontFamily:fMono, fontSize:9, color:L.gold, letterSpacing:"0.08em", textTransform:"uppercase" }}>Credit Note · {cnNum} · Ref: {invNum}</span>
          </div>
        )}
        {s.eInvoice && (
          <div style={{ background:L.blueGlow, border:"1.5px solid "+L.blue+"44", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="send" size={14} color={L.blue} />
            <span style={{ fontFamily:fMono, fontSize:9, color:L.blue, letterSpacing:"0.07em" }}>
              {s.country && s.country.code === "DE" ? "XRechnung 3.0" : s.country && s.country.code === "FR" ? "Factur-X 1.0" : s.country && s.country.code === "IT" ? "XML/SDI" : "EN16931"} · EU e-invoice
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div>
            <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:900, color:s.creditNote ? L.gold : L.ink, letterSpacing:"-0.02em" }}>{s.creditNote ? "CREDIT NOTE" : "INVOICE"}</div>
            <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, marginTop:2 }}>No. {s.creditNote ? cnNum : invNum}</div>
            {s.projRef && <div style={{ fontFamily:fSans, fontSize:10, color:L.muted, marginTop:3, fontStyle:"italic" }}>Re: {s.projRef}</div>}
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink }}>{s.sName}</div>
            {s.sStreet && <div style={{ fontFamily:fSans, fontSize:10, color:L.muted }}>{s.sStreet}</div>}
            {s.sCity && <div style={{ fontFamily:fSans, fontSize:10, color:L.muted }}>{s.sCity}</div>}
            {s.vatExempt
              ? <div style={{ fontFamily:fMono, fontSize:9, color:L.gold }}>VAT-exempt · §19 UStG</div>
              : <div style={{ fontFamily:fMono, fontSize:10, color:L.muted }}>VAT No: {s.sVAT}</div>
            }
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, marginBottom:18 }}>
          {[{l:"Date",v:fmtDate(s.country)},{l:"Due",v:fmtDate(s.country,parseInt(s.terms||30))},{l:"Terms",v:"Net "+s.terms+" days"}].map(function(x,i) {
            return (
              <div key={x.l} style={{ padding:"10px 12px", borderRight:i<2 ? "1px solid "+L.border : "none" }}>
                <div style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.08em", textTransform:"uppercase", color:L.muted, marginBottom:2 }}>{x.l}</div>
                <div style={{ fontFamily:fMono, fontSize:11, color:L.ink, fontWeight:500 }}>{x.v}</div>
              </div>
            );
          })}
        </div>
        {s.rc && (
          <div style={{ background:"rgba(42,94,154,0.06)", border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="reverse" size={11} color={L.blue} />
            <p style={{ fontFamily:fSans, fontSize:11, color:L.blue, margin:0 }}>Reverse charge — VAT liability transfers to the recipient (Art. 44 EU VAT Dir. 2006/112/EC)</p>
          </div>
        )}
        {s.vatExempt && (
          <div style={{ background:L.goldGlow, border:"1px solid "+L.gold+"33", borderRadius:6, padding:"7px 10px", marginBottom:14 }}>
            <p style={{ fontFamily:fSans, fontSize:11, color:L.gold, margin:0 }}>Kein Umsatzsteuerausweis gemäß §19 UStG (Kleinunternehmerregelung)</p>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:4 }}>Bill To</div>
          <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{s.cName}</div>
          {s.cStreet && <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{s.cStreet}</div>}
          {s.cCity && <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{s.cCity}</div>}
          {s.cVAT && <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, marginTop:2 }}>VAT No: {s.cVAT}</div>}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
          <thead>
            <tr>
              {["Description","Qty","Rate","Total"].map(function(h) {
                return <th key={h} style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, padding:"5px 0", textAlign:h==="Description"?"left":"right", borderBottom:"2px solid "+L.ink }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {s.lines.filter(function(l) { return l.desc || l.rate; }).map(function(l, i) {
              var lt = (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0);
              return (
                <tr key={i} style={{ borderBottom:"1px solid "+L.border }}>
                  <td style={{ fontFamily:fSans, fontSize:12, color:L.ink, padding:"8px 0" }}>{l.desc}</td>
                  <td style={{ fontFamily:fMono, fontSize:11, color:L.muted, textAlign:"right", padding:"8px 0" }}>{l.qty}</td>
                  <td style={{ fontFamily:fMono, fontSize:11, color:L.muted, textAlign:"right", padding:"8px 0" }}>{sym+parseFloat(l.rate||0).toFixed(2)}</td>
                  <td style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500, textAlign:"right", padding:"8px 0" }}>{sym+lt.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <div style={{ minWidth:220 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:11, color:L.muted, padding:"2px 0" }}>
              <span>Subtotal</span><span style={{ fontFamily:fMono }}>{sym+sub.toFixed(2)}</span>
            </div>
            {discAmt > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:11, color:L.green, padding:"2px 0" }}>
                <span>Discount {s.discount}%</span><span style={{ fontFamily:fMono }}>{"−"+sym+discAmt.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:11, color:L.muted, padding:"2px 0" }}>
              <span>{s.vatExempt ? "VAT (exempt)" : "VAT "+vatRate+"%"+(s.rc?" (RC)":"")}</span>
              <span style={{ fontFamily:fMono }}>{s.vatExempt ? "—" : sym+vatAmt.toFixed(2)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, borderTop:"1.5px solid "+L.ink, paddingTop:6, marginTop:4 }}>
              <span>Total Due</span><span style={{ color:L.accent }}>{sym+total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div style={{ background:L.cream, borderRadius:7, padding:"10px 13px", marginTop:16, border:"1px solid "+L.border }}>
          <div style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:6 }}>SEPA Bank Transfer</div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>IBAN</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{s.sIBAN}</div></div>
            <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>BIC</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{s.sBIC}</div></div>
            <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>Payment Ref</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{s.creditNote ? cnNum : invNum}</div></div>
          </div>
        </div>
        {s.gdpr && <p style={{ marginTop:10, fontFamily:fSans, fontSize:9, color:L.muted, borderTop:"1px solid "+L.border, paddingTop:8 }}>Your personal data is processed for invoicing purposes in accordance with GDPR Art. 6(1)(b) — EU Regulation 2016/679.</p>}
        {s.latePayment && (
          <div style={{ background:"rgba(200,80,42,0.06)", border:"1px solid "+L.accent+"33", borderRadius:6, padding:"8px 12px", marginTop:10 }}>
            <p style={{ fontFamily:fSans, fontSize:9, color:L.accent, margin:0, lineHeight:1.55 }}>
              Late payment: statutory interest at 8% above ECB base rate applies on overdue amounts per EU Directive 2011/7/EU.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckRow(props) {
  var checked = props.checked;
  var onChange = props.onChange;
  var label = props.label;
  var badge = props.badge;
  var badgeColor = props.badgeColor || L.accent;
  var blocked = props.blocked;
  var blockedReason = props.blockedReason;
  var warn = props.warn;
  var infoOpen = props.infoOpen;
  var onInfo = props.onInfo;
  var infoWhat = props.infoWhat;
  var infoWhen = props.infoWhen;
  var infoEffect = props.infoEffect;
  var infoLaw = props.infoLaw;
  return (
    <div style={{ borderRadius:8, border:infoOpen ? "1.5px solid "+L.border : "1.5px solid transparent", background:infoOpen ? L.cream : "transparent", padding:infoOpen ? "8px 10px 4px" : "2px 4px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, opacity:blocked ? 0.4 : 1 }}>
        <input type="checkbox" checked={checked} disabled={blocked} onChange={function(e){ if(!blocked) onChange(e.target.checked); }} style={{ cursor:blocked ? "not-allowed" : "pointer", flexShrink:0 }} />
        <label onClick={function(){ if(!blocked) onChange(!checked); }} style={{ fontFamily:fSans, fontSize:12, color:L.ink, cursor:blocked ? "not-allowed" : "pointer", flex:1 }}>{label}</label>
        <span style={{ fontFamily:fMono, fontSize:8, color:badgeColor, background:badgeColor+"15", border:"1px solid "+badgeColor+"33", borderRadius:4, padding:"1px 6px", letterSpacing:"0.05em", flexShrink:0 }}>{badge}</span>
        <button onClick={onInfo} style={{ width:16, height:16, borderRadius:"50%", background:infoOpen ? L.accent : L.sand, border:"1px solid "+(infoOpen ? L.accent : L.border), color:infoOpen ? "#fff" : L.muted, fontFamily:fMono, fontSize:9, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>?</button>
      </div>
      {blocked && <p style={{ fontFamily:fSans, fontSize:10, color:L.faint, margin:"2px 0 4px 22px" }}>{blockedReason}</p>}
      {warn && checked && <p style={{ fontFamily:fSans, fontSize:10, color:L.gold, margin:"2px 0 4px 22px" }}>⚠ {warn}</p>}
      {infoOpen && (
        <div style={{ margin:"6px 0 6px", padding:"12px 14px", background:L.white, borderRadius:8, border:"1px solid "+L.borderLt }}>
          {[["What it is",infoWhat],["When to tick it",infoWhen],["What it adds",infoEffect]].map(function(row) {
            return (
              <div key={row[0]} style={{ display:"flex", gap:9, marginBottom:8 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <Icon name="info" size={11} color={L.accent} />
                </div>
                <div>
                  <div style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.08em", textTransform:"uppercase", color:L.accent, marginBottom:2 }}>{row[0]}</div>
                  <div style={{ fontFamily:fSans, fontSize:11, color:L.muted, lineHeight:1.55, fontWeight:300 }}>{row[1]}</div>
                </div>
              </div>
            );
          })}
          <div style={{ paddingTop:8, borderTop:"1px solid "+L.borderLt, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="eu" size={10} color={L.faint} />
            <span style={{ fontFamily:fMono, fontSize:8, color:L.faint, letterSpacing:"0.06em" }}>{infoLaw}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceForm(props) {
  var s = props.state;
  var u = props.update;
  var setView = props.setView;
  var addLine = props.addLine;
  var updLine = props.updLine;
  var remLine = props.remLine;
  var [activeInfo, setActiveInfo] = useState(null);

  var sameCountry = s.cCo === (s.country ? s.country.code : "DE");
  var sub = s.lines.reduce(function(acc, l) { return acc + (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0); }, 0);
  var discAmt = s.discount ? sub * (parseFloat(s.discount)/100) : 0;
  var vatRate = (s.rc || s.vatExempt) ? 0 : (s.country ? s.country.vat : 19);
  var vatAmt = (sub - discAmt) * vatRate / 100;
  var total = (sub - discAmt) + vatAmt;
  var sym = s.country && s.country.cur === "SEK" ? "kr" : "€";

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"6px 9px", fontFamily:fSans, fontSize:12, color:L.ink, background:L.white, outline:"none" };
  var monoStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"6px 9px", fontFamily:fMono, fontSize:11, color:L.ink, background:L.white, outline:"none" };
  var lblStyle = { display:"block", marginBottom:3, fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  function cardWrap(title, badge, content) {
    return (
      <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:12, overflow:"hidden" }}>
        <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>{title}</span>
          {badge}
        </div>
        <div style={{ padding:"13px 16px" }}>{content}</div>
      </div>
    );
  }

  return (
    <div className="inv-grid" style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:14, padding:"22px 24px 48px" }}>
      <div>
        {cardWrap("Your Business", <Tag c={L.accent}>Seller</Tag>, (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ gridColumn:"1/-1" }}><label style={lblStyle}>Business Name *</label><input value={s.sName} onChange={function(e){ u("sName",e.target.value); }} style={inpStyle} /></div>
            <div><label style={lblStyle}>VAT Number *</label><input value={s.sVAT} onChange={function(e){ u("sVAT",e.target.value); }} style={monoStyle} /></div>
            <div><label style={lblStyle}>IBAN *</label><input value={s.sIBAN} onChange={function(e){ u("sIBAN",e.target.value); }} style={monoStyle} /></div>
            <div><label style={lblStyle}>BIC/SWIFT</label><input value={s.sBIC} onChange={function(e){ u("sBIC",e.target.value); }} style={monoStyle} /></div>
            <div><label style={lblStyle}>Street</label><input value={s.sStreet} onChange={function(e){ u("sStreet",e.target.value); }} placeholder="Unter den Linden 1" style={inpStyle} /></div>
            <div><label style={lblStyle}>City</label><input value={s.sCity} onChange={function(e){ u("sCity",e.target.value); }} placeholder="10117 Berlin" style={inpStyle} /></div>
          </div>
        ))}
        {cardWrap("Client", <Tag c={L.blue}>Bill To</Tag>, (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <div><label style={lblStyle}>Client Name *</label><input value={s.cName} onChange={function(e){ u("cName",e.target.value); }} style={inpStyle} /></div>
              <div>
                <label style={lblStyle}>Country</label>
                <select value={s.cCo} onChange={function(e){ u("cCo",e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                  {EU.map(function(c) { return <option key={c.code} value={c.code}>{c.name}</option>; })}
                </select>
              </div>
              <div><label style={lblStyle}>Street</label><input value={s.cStreet} onChange={function(e){ u("cStreet",e.target.value); }} placeholder="Rue de Rivoli 1" style={inpStyle} /></div>
              <div><label style={lblStyle}>City</label><input value={s.cCity} onChange={function(e){ u("cCity",e.target.value); }} placeholder="75001 Paris" style={inpStyle} /></div>
            </div>
            <label style={lblStyle}>Client VAT (triggers reverse charge if cross-border)</label>
            <input value={s.cVAT} onChange={function(e){ u("cVAT",e.target.value); }} placeholder="e.g. FR12345678901" style={monoStyle} />
            {s.rc && (
              <div style={{ background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="reverse" size={12} color={L.blue} />
                <p style={{ fontFamily:fSans, fontSize:11, color:L.blue, margin:0 }}>Reverse charge auto-detected — VAT 0%</p>
              </div>
            )}
          </div>
        ))}
        {cardWrap("Invoice Lines", <Tag c={L.accent}>Live preview</Tag>, (
          <div>
            <div style={{ marginBottom:10 }}>
              <label style={lblStyle}>Project Reference (optional)</label>
              <input value={s.projRef} onChange={function(e){ u("projRef",e.target.value); }} placeholder="e.g. Brand Identity Project Q1 2026" style={inpStyle} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 50px 80px 70px 22px", gap:4, marginBottom:4 }}>
              {["Description","Qty","Rate","Total",""].map(function(h,i) {
                return <span key={i} style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.08em", textTransform:"uppercase", color:L.muted, textAlign:i>1?"right":"left" }}>{h}</span>;
              })}
            </div>
            {s.lines.map(function(line) {
              var lt = (parseFloat(line.qty)||0) * (parseFloat(line.rate)||0);
              return (
                <div key={line.id} style={{ display:"grid", gridTemplateColumns:"1fr 50px 80px 70px 22px", gap:4, marginBottom:4, alignItems:"center" }}>
                  <input value={line.desc} onChange={function(e){ updLine(line.id,"desc",e.target.value); }} placeholder="Service" style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 7px", fontFamily:fSans, fontSize:11, color:L.ink, background:L.white, outline:"none", width:"100%" }} />
                  <input type="number" value={line.qty} onChange={function(e){ updLine(line.id,"qty",e.target.value); }} style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 5px", fontFamily:fMono, fontSize:11, color:L.ink, background:L.white, outline:"none", textAlign:"right", width:"100%" }} />
                  <input type="number" value={line.rate} onChange={function(e){ updLine(line.id,"rate",e.target.value); }} style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 5px", fontFamily:fMono, fontSize:11, color:L.ink, background:L.white, outline:"none", textAlign:"right", width:"100%" }} />
                  <div style={{ fontFamily:fMono, fontSize:11, color:L.ink, textAlign:"right", fontWeight:500 }}>{sym+lt.toFixed(2)}</div>
                  <button onClick={function(){ remLine(line.id); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontSize:14, padding:0 }}>×</button>
                </div>
              );
            })}
            <button onClick={addLine} style={{ background:"none", border:"1.5px dashed "+L.border, borderRadius:6, padding:"5px 0", width:"100%", cursor:"pointer", color:L.muted, fontFamily:fSans, fontSize:11, marginTop:2 }}>+ Add line</button>
            <div style={{ marginTop:9, borderTop:"1px solid "+L.border, paddingTop:7, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSans, fontSize:11, color:L.muted }}>
                <span>Subtotal</span><span style={{ fontFamily:fMono }}>{sym+sub.toFixed(2)}</span>
              </div>
              {discAmt > 0 && (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:220 }}>
                  <span style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>Discount {s.discount}%</span>
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.green }}>{"−"+sym+discAmt.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:220, gap:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>Discount %</span>
                  <input type="number" value={s.discount} onChange={function(e){ u("discount",e.target.value); }} placeholder="0" min="0" max="100" style={{ width:36, border:"1px solid "+L.border, borderRadius:4, padding:"2px 5px", fontFamily:fMono, fontSize:10, color:L.ink, background:L.white, outline:"none", textAlign:"right" }} />
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSans, fontSize:11, color:L.muted }}>
                <span>{s.vatExempt ? "VAT Exempt" : s.rc ? "VAT 0% (RC)" : "VAT "+vatRate+"%"}</span>
                <span style={{ fontFamily:fMono }}>{s.vatExempt ? "—" : sym+vatAmt.toFixed(2)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, borderTop:"1.5px solid "+L.ink, paddingTop:5, marginTop:2 }}>
                <span>Total Due</span><span style={{ color:L.accent }}>{sym+total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
        {cardWrap("Invoice Settings", null, (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label style={lblStyle}>Your Country</label>
              <select value={s.country ? s.country.code : "DE"} onChange={function(e){ var c=EU.find(function(x){return x.code===e.target.value;}); u("country",c); }} style={{ ...inpStyle, cursor:"pointer" }}>
                {EU.map(function(c) { return <option key={c.code} value={c.code}>{c.name+" ("+c.vat+"%)"}</option>; })}
              </select>
            </div>
            <div>
              <label style={lblStyle}>Payment Terms</label>
              <select value={s.terms} onChange={function(e){ u("terms",e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                <option value="14">Net 14 days</option>
                <option value="30">Net 30 days</option>
                <option value="45">Net 45 days</option>
                <option value="60">Net 60 days</option>
              </select>
            </div>
          </div>
        ))}
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:12, overflow:"hidden" }}>
          <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}>
            <span style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>EU Compliance</span>
          </div>
          <div style={{ padding:"13px 16px", display:"flex", flexDirection:"column", gap:4 }}>
            <CheckRow checked={s.rc} onChange={function(v){ u("rc",v); }} label="Reverse Charge" badge="Art.44" badgeColor={L.blue} blocked={sameCountry && !s.cVAT} blockedReason="Same country — RC only applies cross-border EU B2B" warn={null} infoOpen={activeInfo==="rc"} onInfo={function(){ setActiveInfo(activeInfo==="rc"?null:"rc"); }} infoWhat="Reverse charge means your client pays the VAT to their tax authority instead of you collecting it." infoWhen="Tick when invoicing a VAT-registered business in a DIFFERENT EU country (B2B cross-border). Auto-detected when you enter client VAT number." infoEffect="Sets VAT to 0% and adds required legal text (Art. 44 EU VAT Directive)." infoLaw="Art. 44 EU VAT Directive 2006/112/EC" />
            <CheckRow checked={s.gdpr} onChange={function(v){ u("gdpr",v); }} label="GDPR Notice" badge="GDPR" badgeColor={L.green} blocked={false} blockedReason="" warn={null} infoOpen={activeInfo==="gdpr"} onInfo={function(){ setActiveInfo(activeInfo==="gdpr"?null:"gdpr"); }} infoWhat="A short legal notice that you process your client's personal data for invoicing purposes." infoWhen="Recommended for all EU B2B invoices — it shows you take data protection seriously." infoEffect="Adds one sentence to the bottom of your invoice referencing GDPR Art. 6(1)(b)." infoLaw="GDPR Art. 6(1)(b) — EU Regulation 2016/679" />
            <CheckRow checked={s.latePayment} onChange={function(v){ u("latePayment",v); }} label="Late Payment Interest" badge="EU 2011/7" badgeColor={L.accent} blocked={s.creditNote} blockedReason="Cannot charge interest on a credit note" warn={null} infoOpen={activeInfo==="lp"} onInfo={function(){ setActiveInfo(activeInfo==="lp"?null:"lp"); }} infoWhat="EU law gives you the right to charge statutory interest if a B2B client pays late." infoWhen="Tick for B2B invoices where you want to signal late payment will incur interest." infoEffect="Adds a notice: 8% above ECB base rate applies on overdue amounts from due date." infoLaw="EU Directive 2011/7/EU on combating late payment" />
            <CheckRow checked={s.creditNote} onChange={function(v){ u("creditNote",v); }} label="Credit Note" badge={"CN-"+new Date().getFullYear()+"-001"} badgeColor={L.gold} blocked={s.latePayment} blockedReason="Disable late payment interest first" warn={null} infoOpen={activeInfo==="cn"} onInfo={function(){ setActiveInfo(activeInfo==="cn"?null:"cn"); }} infoWhat="A credit note cancels or corrects a previous invoice, or issues a credit/refund." infoWhen="Use when correcting a sent invoice, issuing a refund, or applying a retroactive discount." infoEffect="Changes document type to CREDIT NOTE with a separate sequential number (CN-YYYY-XXX)." infoLaw="Art. 226 EU VAT Directive — separate number sequence required" />
            <CheckRow checked={s.vatExempt} onChange={function(v){ u("vatExempt",v); }} label="VAT Exempt" badge="§19 UStG" badgeColor={L.gold} blocked={s.rc} blockedReason="Disable reverse charge first" warn={null} infoOpen={activeInfo==="ve"} onInfo={function(){ setActiveInfo(activeInfo==="ve"?null:"ve"); }} infoWhat="If your revenue is below a threshold you may not need to charge VAT at all." infoWhen="Only tick if registered under a small business exemption AND below the revenue threshold. Verify with your accountant." infoEffect="Removes VAT line entirely and adds the legally required exemption notice." infoLaw="§19 UStG (Germany) · Art. 293B CGI (France) · varies by country" />
            <CheckRow checked={s.eInvoice} onChange={function(v){ u("eInvoice",v); }} label="E-Invoice XML" badge={s.country && s.country.code==="DE" ? "XRechnung" : s.country && s.country.code==="FR" ? "Factur-X" : s.country && s.country.code==="IT" ? "XML/SDI" : "EN16931"} badgeColor={L.blue} blocked={false} blockedReason="" warn={s.creditNote ? "Credit notes use a different XML schema (type 381 vs 380)" : null} infoOpen={activeInfo==="ei"} onInfo={function(){ setActiveInfo(activeInfo==="ei"?null:"ei"); }} infoWhat="Structured XML invoices readable by accounting software. Mandatory in Italy, upcoming in Germany and France." infoWhen="Use if your client is a public authority (required) or their accounting software supports XML import." infoEffect="Marks your invoice as e-invoice compliant. Full XML export coming Q4 2026." infoLaw="EU Directive 2014/55/EU · EN16931 · XRechnung 3.0" />
          </div>
        </div>
        <button onClick={function(){ setView("preview"); }} style={{ width:"100%", background:L.accent, color:"#fff", border:"none", padding:"12px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 16px rgba(200,80,42,0.25)" }}>
          Preview Invoice →
        </button>
      </div>
      <div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, padding:"12px 14px" }}>
          <p style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:8 }}>EU Compliance</p>
          {[
            { i:"eu",       l:"Country",        sub:(s.country?s.country.name:"Germany")+" · VAT "+(s.country?s.country.vat:19)+"%", ok:true },
            { i:"bank",     l:"SEPA",           sub:s.sIBAN ? "IBAN provided" : "⚠ Missing",      ok:!!s.sIBAN },
            { i:"reverse",  l:"Reverse Charge", sub:s.rc ? "Active (0%)" : sameCountry ? "N/A same country" : "Standard", ok:s.rc },
            { i:"shield",   l:"GDPR Notice",    sub:s.gdpr ? "Included" : "Off",                   ok:s.gdpr },
            { i:"hash",     l:"Invoice No.",    sub:s.creditNote ? "CN-"+new Date().getFullYear()+"-001" : (s.country?s.country.code:"DE")+"-"+new Date().getFullYear()+"-437", ok:true },
            { i:"clock",    l:"Late Payment",   sub:s.latePayment ? "8% ECB+rate" : "Off",         ok:s.latePayment },
            { i:"document", l:"Document Type",  sub:s.creditNote ? "Credit Note" : s.vatExempt ? "VAT-Exempt" : "Standard Invoice", ok:true },
            { i:"send",     l:"E-Invoice",      sub:s.eInvoice ? "Active" : "PDF only",            ok:s.eInvoice },
          ].map(function(r) {
            return (
              <div key={r.l} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <Icon name={r.i} size={13} color={L.muted} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:11, color:L.ink, fontWeight:500 }}>{r.l}</div>
                  <div style={{ fontFamily:fMono, fontSize:8, color:r.ok ? L.green : L.muted }}>{r.sub}</div>
                </div>
                <span style={{ color:r.ok ? L.green : L.faint, fontSize:10 }}>{r.ok ? "✓" : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProposalForm(props) {
  var onFirstGenerate = props.onFirstGenerate;
  var lang = props.lang || "en";
  var [clientName, setClientName] = useState("");
  var [clientCo, setClientCo] = useState("");
  var [projType, setProjType] = useState("");
  var [projDesc, setProjDesc] = useState("");
  var [budget, setBudget] = useState("");
  var [timeline, setTimeline] = useState("");
  var [tone, setTone] = useState("direct");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState("");
  var [hasGen, setHasGen] = useState(false);
  var [history, setHistory] = useState([]);

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"7px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:L.ink, background:L.white, outline:"none" };
  var lblStyle = { display:"block", marginBottom:4, fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  function generate() {
    if (!projDesc.trim()) return;
    setLoading(true); setResult(""); setHistory([]);
    var toneGuide = tone === "direct" ? "Direct and confident. Short sentences. No corporate filler." : tone === "warm" ? "Warm and personal. Show genuine interest. Still professional." : "Formal and precise. Appropriate for larger organisations.";
    var rules = [
      "You are an expert creative professional writing a project proposal.",
      "Write in English.",
      "Tone: " + toneGuide,
      "Start with the client first name only (no Dear, no Hello). Just their name followed by a comma.",
      "One short opening paragraph (2-3 sentences). Reference something specific about their situation.",
      "Section: What we will create — specific deliverables for the project type.",
      "Section: How it works — simple week-by-week timeline.",
      "Section: Investment — price and payment terms. Estimate if no budget given.",
      "One confident closing line. No Best regards or Sincerely.",
      "Use --- before the closing line.",
      "200-300 words max.",
    ].join(" ");
    var msgs = [
      clientName ? "Client: " + clientName : null,
      clientCo ? "Company: " + clientCo : null,
      "Project type: " + (projType || "creative project"),
      "Brief: " + projDesc,
      budget ? "Budget: " + budget : null,
      timeline ? "Timeline: " + timeline : null,
    ].filter(Boolean).join("\n");
    fetch("/api/claude", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:rules, messages:[{ role:"user", content:msgs }] }),
    }).then(function(r){ return r.json(); })
      .then(function(data) {
        var text = (data.content || []).map(function(b){ return b.text || ""; }).join("") || "Generation failed.";
        setResult(text);
        setHistory([{ role:"user", content:msgs }, { role:"assistant", content:text }]);
        setLoading(false);
        if (!hasGen) { setHasGen(true); setTimeout(function(){ if(onFirstGenerate) onFirstGenerate(); }, 1800); }
      })
      .catch(function() { setResult("Connection error — please try again."); setLoading(false); });
  }

  function refine(instruction) {
    if (!result || loading) return;
    setLoading(true);
    var newHistory = history.concat([{ role:"user", content:instruction }]);
    fetch("/api/claude", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:"You are refining a project proposal. Apply the requested change and return the full revised proposal only — no commentary.", messages:newHistory }),
    }).then(function(r){ return r.json(); })
      .then(function(data) {
        var text = (data.content || []).map(function(b){ return b.text || ""; }).join("") || result;
        setResult(text);
        setHistory(newHistory.concat([{ role:"assistant", content:text }]));
        setLoading(false);
      })
      .catch(function() { setLoading(false); });
  }

  function renderProposal(text) {
    return (
      <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
        {text.split("\n").map(function(line, i) {
          if (line === "---") return <hr key={i} style={{ border:"none", borderTop:"1px solid "+L.border, margin:"16px 0" }} />;
          if (line.startsWith("## ")) return <h3 key={i} style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:L.ink, margin:"20px 0 8px" }}>{line.slice(3)}</h3>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, color:L.ink, fontSize:14, margin:"8px 0 4px" }}>{line.slice(2,-2)}</p>;
          if (line.startsWith("- ")) return <div key={i} style={{ display:"flex", gap:10, margin:"3px 0", paddingLeft:4, color:L.muted, fontSize:13, lineHeight:1.6 }}><span style={{ color:L.accent, flexShrink:0 }}>·</span><span>{line.slice(2)}</span></div>;
          if (line === "") return <div key={i} style={{ height:8 }} />;
          if (line.indexOf("**") >= 0) {
            var parts = line.split("**");
            return <p key={i} style={{ color:L.ink, fontSize:13, lineHeight:1.7, margin:"2px 0" }}>{parts.map(function(p,j){ return j%2===1 ? <strong key={j}>{p}</strong> : p; })}</p>;
          }
          return <p key={i} style={{ color:L.ink, fontSize:13, lineHeight:1.7, margin:"2px 0" }}>{line}</p>;
        })}
      </div>
    );
  }

  return (
    <div className="prop-grid" style={{ maxWidth:860, margin:"0 auto", padding:"28px 24px 56px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
      <div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:L.ink, marginBottom:4 }}>{t(lang,"propTitle")}</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:L.muted, marginBottom:20, fontWeight:300 }}>{t(lang,"propSub")}</p>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Client</span></div>
          <div style={{ padding:"13px 16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              <div><label style={lblStyle}>First name</label><input value={clientName} onChange={function(e){ setClientName(e.target.value); }} placeholder="Sarah" style={inpStyle} /></div>
              <div><label style={lblStyle}>Company</label><input value={clientCo} onChange={function(e){ setClientCo(e.target.value); }} placeholder="TechFlow GmbH" style={inpStyle} /></div>
            </div>
          </div>
        </div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Project</span></div>
          <div style={{ padding:"13px 16px" }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
              {PROJ_TYPES.slice(0,8).map(function(t) {
                return <button key={t} onClick={function(){ setProjType(t); }} style={{ background:projType===t ? L.accent : L.paper, color:projType===t ? "#fff" : L.muted, border:"1.5px solid "+(projType===t ? L.accent : L.border), borderRadius:99, padding:"4px 11px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:11 }}>{t}</button>;
              })}
            </div>
            <label style={lblStyle}>Brief *</label>
            <textarea value={projDesc} onChange={function(e){ setProjDesc(e.target.value); }} placeholder="Describe the project and what the client needs. The more context, the better the proposal." rows={4} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"8px 10px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:L.ink, background:L.white, outline:"none", resize:"vertical", lineHeight:1.55 }} />
          </div>
        </div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Scope</span></div>
          <div style={{ padding:"13px 16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              <div>
                <label style={lblStyle}>Budget range</label>
                <select value={budget} onChange={function(e){ setBudget(e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                  {BUDGETS.map(function(b){ return <option key={b} value={b}>{b}</option>; })}
                </select>
              </div>
              <div>
                <label style={lblStyle}>Timeline</label>
                <select value={timeline} onChange={function(e){ setTimeline(e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                  {TIMELINES.map(function(t){ return <option key={t} value={t}>{t}</option>; })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:14, overflow:"hidden" }}>
          <div style={{ padding:"9px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Tone</span></div>
          <div style={{ padding:"13px 16px" }}>
            <div style={{ display:"flex", gap:6 }}>
              {[["direct","Direct & confident"],["warm","Warm & personal"],["formal","Formal & precise"]].map(function(pair) {
                var v = pair[0]; var lb = pair[1];
                return <button key={v} onClick={function(){ setTone(v); }} style={{ flex:1, background:tone===v ? L.ink : L.paper, color:tone===v ? L.paper : L.muted, border:"1.5px solid "+(tone===v ? L.ink : L.border), borderRadius:7, padding:"7px 6px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:tone===v ? 500 : 400 }}>{lb}</button>;
              })}
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={loading || !projDesc.trim()} style={{ width:"100%", background:projDesc.trim() && !loading ? L.accent : L.border, color:projDesc.trim() && !loading ? "#fff" : L.muted, border:"none", padding:"13px", borderRadius:9, cursor:projDesc.trim() && !loading ? "pointer" : "not-allowed", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, boxShadow:projDesc.trim() && !loading ? "0 4px 16px rgba(200,80,42,0.25)" : "none" }}>
          {loading ? "✦ Writing your proposal…" : "✦ Generate Proposal"}
        </button>
      </div>
      <div style={{ position:"sticky", top:80 }}>
        {(loading || result) ? (
          <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:14, overflow:"hidden", boxShadow:"0 8px 32px rgba(44,36,22,0.1)" }}>
            <div style={{ padding:"11px 16px", borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between", background:L.cream }}>
              {loading ? (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {[0,1,2].map(function(i){ return <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:L.accent, animation:"pulse 1s "+i*0.2+"s infinite" }} />; })}
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:L.muted, marginLeft:5 }}>Writing…</span>
                </div>
              ) : (
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:L.green, letterSpacing:"0.08em" }}>{t(lang,"propReady")}</span>
              )}
              {result && !loading && (
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={function(){ setResult(""); }} style={{ background:"none", border:"1px solid "+L.border, color:L.muted, padding:"3px 9px", borderRadius:5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>↺ Redo</button>
                  <button style={{ background:L.accent, color:"#fff", border:"none", padding:"3px 11px", borderRadius:5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>Export PDF ↓</button>
                </div>
              )}
            </div>
            <div style={{ padding:"22px 24px", maxHeight:"60vh", overflowY:"auto" }}>
              {result && !loading && renderProposal(result)}
            </div>
            {result && !loading && (
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+L.border, display:"flex", gap:6, flexWrap:"wrap", background:L.cream }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:L.muted, alignSelf:"center" }}>Refine:</span>
                {[["Make it shorter","Cut this proposal to under 180 words. Keep the structure but be ruthless."],["More formal","Rewrite in a more formal, corporate tone suitable for a large enterprise client."],["Add case studies","Add a brief 'Why us' section mentioning 2 relevant past projects with outcomes."],["Stronger close","Rewrite the closing paragraph to be more confident and create a clear next step."]].map(function(pair) {
                  return (
                    <button key={pair[0]} onClick={function(){ refine(pair[1]); }} disabled={loading} style={{ background:L.white, border:"1px solid "+L.border, color:loading ? L.faint : L.muted, padding:"3px 9px", borderRadius:99, cursor:loading ? "not-allowed" : "pointer", fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>
                      {pair[0]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Example proposal</p>
            <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:12, padding:"22px 24px", opacity:0.7 }}>
              {renderProposal("Sarah,\n\nWe've looked at TechFlow carefully — the fintech space in Berlin is crowded, and what you need isn't just a logo. You need a visual identity that signals credibility to investors while still feeling approachable.\n\n## What we'll create\n\n**Brand strategy foundation**\nA half-day positioning session to nail the brand DNA.\n\n**Visual identity system**\nPrimary logo + 2 variants · Colour palette · Typography · Iconography\n\n**Application files**\nFigma system · SVG/AI source files · Brand guidelines PDF\n\n## How it works\n\nWeeks 1–2 · Strategy and concepting\nWeeks 3–4 · Design development (2 review rounds)\nWeek 5 · Refinement and delivery\n\n## Investment\n\n**€8,400 total**\n€4,200 on kickoff · €4,200 on final delivery\n\n---\nReady when you are.")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceGen(props) {
  var onFirstGenerate = props.onFirstGenerate;
  var setPage = props.setPage;
  var lang = props.lang || "en";
  var [mode, setMode] = useState("proposal");
  var [view, setView] = useState("form");

  var defaultInvState = {
    country:EU[0], terms:"30", rc:false, gdpr:true, latePayment:false, creditNote:false, vatExempt:false, eInvoice:false, discount:"", projRef:"",
    sName:"Acme Studio GmbH", sVAT:"DE123456789", sIBAN:"DE89 3704 0044 0532 0130 00", sBIC:"COBADEFFXXX", sStreet:"Unter den Linden 1", sCity:"10117 Berlin",
    cName:"Studio Verde GmbH", cVAT:"", cCo:"DE", cStreet:"", cCity:"",
    lines:[{ id:1, desc:"Brand Identity Workshop", qty:1, rate:1800 },{ id:2, desc:"Logo Design + 3 variations", qty:1, rate:2400 },{ id:3, desc:"Brand Guidelines PDF", qty:1, rate:1200 }],
  };

  var [invState, setInvState] = useState(defaultInvState);

  function updateInv(key, val) {
    setInvState(function(s) {
      var n = Object.assign({}, s); n[key] = val;
      if (key === "cVAT" || key === "cCo" || key === "country") {
        var co = key === "country" ? val : n.country;
        var cco = key === "cCo" ? val : n.cCo;
        var cvat = key === "cVAT" ? val : n.cVAT;
        if (cvat && co && cco !== co.code) n.rc = true;
        else n.rc = false;
      }
      return n;
    });
  }

  function addLine() {
    setInvState(function(s) {
      var newId = s.lines.reduce(function(mx, l){ return Math.max(mx, l.id); }, 0) + 1;
      return Object.assign({}, s, { lines:s.lines.concat([{ id:newId, desc:"", qty:1, rate:0 }]) });
    });
  }
  function updLine(id, key, val) {
    setInvState(function(s) {
      return Object.assign({}, s, { lines:s.lines.map(function(l){ return l.id===id ? Object.assign({},l,{[key]:val}) : l; }) });
    });
  }
  function remLine(id) {
    setInvState(function(s) {
      return Object.assign({}, s, { lines:s.lines.filter(function(l){ return l.id!==id; }) });
    });
  }

  return (
    <div style={{ background:L.paper, minHeight:"calc(100vh - 56px)" }}>
      <div style={{ background:L.cream, borderBottom:"1px solid "+L.border, padding:"0 28px", display:"flex", alignItems:"center", gap:4, height:46 }}>
        {[["proposal","AI Proposal"],["invoice","EU Invoice"]].map(function(pair) {
          var m = pair[0]; var lb = pair[1];
          return <button key={m} onClick={function(){ setMode(m); setView("form"); }} style={{ background:mode===m ? L.accent : "transparent", color:mode===m ? "#fff" : L.muted, border:"none", padding:"5px 14px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>{lb}</button>;
        })}
        <div style={{ flex:1 }} />
        {mode==="invoice" && (
          <div style={{ display:"flex", gap:6 }}>
            {[["form","Form"],["preview","Preview"]].map(function(pair) {
              var v = pair[0]; var lb = pair[1];
              return <button key={v} onClick={function(){ setView(v); }} style={{ background:view===v ? L.ink : "transparent", color:view===v ? L.paper : L.muted, border:"none", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:fMono, fontSize:10 }}>{lb}</button>;
            })}
          </div>
        )}
      </div>
      {mode==="proposal" && <ProposalForm onFirstGenerate={onFirstGenerate} lang={lang} />}
      {mode==="invoice" && view==="form" && (
        <InvoiceForm state={invState} update={updateInv} setView={setView} addLine={addLine} updLine={updLine} remLine={remLine} />
      )}
      {mode==="invoice" && view==="preview" && (
        <InvoicePreviewPanel state={invState} setView={setView} setPage={setPage} />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
var CLIENTS = [
  { id:1, name:"Studio Verde GmbH",  flag:"DE", city:"Berlin",    av:"SV", col:"#8A7A6A", status:"active",   balance:8400,  paid:22400, invoices:14 },
  { id:2, name:"Maison Fontaine",    flag:"FR", city:"Paris",     av:"MF", col:"#7A6A5A", status:"overdue",  balance:3200,  paid:18600, invoices:9 },
  { id:3, name:"Bianchi & Co.",      flag:"IT", city:"Milan",     av:"BC", col:"#9A8A7A", status:"active",   balance:0,     paid:31200, invoices:18 },
  { id:4, name:"Nord Digital AS",    flag:"SE", city:"Stockholm", av:"ND", col:"#6A5A4A", status:"prospect", balance:0,     paid:0,     invoices:0 },
];

function Dashboard(props) {
  var [section, setSection] = useState("overview");
  var [client, setClient] = useState(null);
  var nav = [
    { id:"overview",  label:"Overview",  icon:"overview" },
    { id:"clients",   label:"Clients",   icon:"users" },
    { id:"payments",  label:"Payments",  icon:"card" },
    { id:"proposals", label:"Proposals", icon:"proposal" },
    { id:"brandkits", label:"Brand Kits",icon:"brand" },
  ];
  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 56px)", background:"#F0EDE6" }}>
      <div className="dash-aside" style={{ width:220, background:"#2C2416", padding:"20px 0", flexShrink:0 }}>
        <div style={{ padding:"0 16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:"#FAF7F2", marginBottom:2 }}>InvoiceAI</div>
          <div style={{ fontFamily:fMono, fontSize:9, color:"rgba(250,247,242,0.3)", letterSpacing:"0.08em" }}>for Europe</div>
        </div>
        <div style={{ padding:"16px 8px 0" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ setSection(item.id); setClient(null); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 12px", borderRadius:8, border:"none", background:active ? "rgba(200,80,42,0.15)" : "transparent", color:active ? "#E8896A" : "rgba(250,247,242,0.45)", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:active?500:400, marginBottom:2 }}>
                <Icon name={item.icon} size={14} color={active ? "#E8896A" : "rgba(250,247,242,0.4)"} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ flex:1, padding:"28px 32px", overflowY:"auto" }}>
        {section==="overview" && <DOverview />}
        {section==="clients" && !client && <DClients setClient={setClient} />}
        {section==="clients" && client && <DClientDetail client={client} setClient={setClient} />}
        {section==="payments" && <DPayments />}
        {section==="proposals" && <DProposals />}
        {section==="brandkits" && <DBrandKits />}
      </div>
    </div>
  );
}

function StatCard(props) {
  return (
    <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"16px 18px" }}>
      <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:6 }}>{props.label}</div>
      <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:700, color:props.color||L.ink, letterSpacing:"-0.02em" }}>{props.value}</div>
      {props.sub && <div style={{ fontFamily:fMono, fontSize:9, color:L.faint, marginTop:3 }}>{props.sub}</div>}
    </div>
  );
}

function DOverview() {
  return (
    <div>
      <h1 style={{ fontFamily:fSerif, fontSize:26, fontWeight:800, color:L.ink, marginBottom:4, letterSpacing:"-0.025em" }}>Good morning, Alex.</h1>
      <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:24 }}>Wednesday, 29 April 2026 · 4 clients · 1 overdue</p>
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard label="Total Billed" value="€84,200" sub="↑ +23% vs last month" color={L.ink} />
        <StatCard label="Collected" value="€71,400" sub="84.8% collection rate" color={L.green} />
        <StatCard label="Outstanding" value="€12,800" sub="1 overdue" color={L.accent} />
        <StatCard label="Win Rate" value="68%" sub="↑ +5pp this quarter" color={L.blue} />
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:14 }}>Recent Activity</div>
        {[
          { type:"invoice",  client:"Studio Verde GmbH", desc:"Invoice DE-2026-0437 sent · €4,200",       time:"2h ago",   status:"sent" },
          { type:"proposal", client:"Maison Fontaine",   desc:"Proposal accepted · Brand Identity €8,400", time:"Yesterday",status:"won" },
          { type:"invoice",  client:"Bianchi & Co.",     desc:"Invoice IT-2026-007 overdue since 15 Jan",  time:"16d ago",  status:"overdue" },
          { type:"proposal", client:"Nord Digital AS",   desc:"Proposal viewed · App Design €6,500",       time:"3d ago",   status:"viewed" },
        ].map(function(h, i) {
          var stColor = h.status==="won" ? L.green : h.status==="overdue" ? L.accent : h.status==="sent" ? L.blue : L.gold;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<3?"1px solid "+L.borderLt:"none" }}>
              <div style={{ width:32, height:32, borderRadius:6, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name={h.type==="invoice"?"document":"proposal"} size={14} color={L.accent} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:fSans, fontSize:12, fontWeight:500, color:L.ink }}>{h.client}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{h.desc}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fMono, fontSize:8, color:stColor, background:stColor+"15", borderRadius:4, padding:"2px 7px", letterSpacing:"0.06em", marginBottom:2 }}>{h.status}</div>
                <div style={{ fontFamily:fMono, fontSize:9, color:L.faint }}>{h.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DClients(props) {
  var setClient = props.setClient;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>Clients</h2>
        <button style={{ background:L.accent, color:"#fff", border:"none", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>+ New Invoice</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CLIENTS.map(function(c) {
          var stColor = c.status==="active" ? L.green : c.status==="overdue" ? L.accent : L.gold;
          return (
            <div key={c.id} onClick={function(){ setClient(c); }} style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:c.col+"22", border:"1.5px solid "+c.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:c.col, fontWeight:500, flexShrink:0 }}>{c.av}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{c.name}</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.muted }}>{c.flag} · {c.city} · {c.invoices} invoices</div>
              </div>
              <div style={{ textAlign:"right" }}>
                {c.balance > 0 && <div style={{ fontFamily:fMono, fontSize:13, color:L.accent, fontWeight:500 }}>{"€"+c.balance.toLocaleString()+" outstanding"}</div>}
                <div style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{"€"+c.paid.toLocaleString()+" total paid"}</div>
              </div>
              <div style={{ fontFamily:fMono, fontSize:9, color:stColor, background:stColor+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em" }}>{c.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DClientDetail(props) {
  var c = props.client;
  var setClient = props.setClient;
  return (
    <div>
      <button onClick={function(){ setClient(null); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontFamily:fMono, fontSize:10, letterSpacing:"0.06em", marginBottom:16, padding:0 }}>← All clients</button>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:c.col+"22", border:"1.5px solid "+c.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:16, color:c.col, fontWeight:500 }}>{c.av}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>{c.name}</h2>
          <p style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{c.flag} · {c.city}</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
        <StatCard label="Total Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance>0?L.accent:L.green} />
        <StatCard label="Invoices" value={c.invoices} />
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:12 }}>Full History</div>
        <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontWeight:300 }}>Invoice and proposal history will appear here once connected to your account.</p>
      </div>
    </div>
  );
}

function DPayments() {
  var rows = [
    { inv:"DE-2026-0437", client:"Studio Verde GmbH", amount:4200, status:"sent",   due:"15 May 2026",  daysUntil:13 },
    { inv:"FR-2026-0021", client:"Maison Fontaine",   amount:3200, status:"overdue",due:"14 Jan 2026",  daysOver:108 },
    { inv:"IT-2026-0019", client:"Bianchi & Co.",     amount:8400, status:"paid",   due:"Paid 12 Apr",  daysOver:0 },
    { inv:"DE-2026-0436", client:"Studio Verde GmbH", amount:2100, status:"paid",   due:"Paid 28 Mar",  daysOver:0 },
  ];
  var stColor = { sent:L.blue, overdue:L.accent, paid:L.green };
  var [sent, setSent] = useState({});

  function handleAction(inv, action) {
    setSent(function(s) { return Object.assign({}, s, { [inv]: action }); });
    setTimeout(function() {
      setSent(function(s) { var n = Object.assign({}, s); delete n[inv]; return n; });
    }, 3000);
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>Payment Records</h2>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:8, padding:"7px 12px", display:"flex", alignItems:"center", gap:7 }}>
            <Icon name="clock" size={13} color={L.accent} />
            <span style={{ fontFamily:fMono, fontSize:9, color:L.accent, letterSpacing:"0.06em" }}>1 overdue · €3,200</span>
          </div>
        </div>
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, overflow:"hidden" }}>
        {rows.map(function(r, i) {
          var isOverdue = r.status === "overdue";
          var isSent = r.status === "sent";
          var toast = sent[r.inv];
          return (
            <div key={r.inv} style={{ borderBottom:i<rows.length-1?"1px solid "+L.borderLt:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", background:isOverdue ? "rgba(200,80,42,0.03)" : "transparent" }}>
                <div style={{ fontFamily:fMono, fontSize:11, color:L.ink, width:130, flexShrink:0 }}>{r.inv}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:13, color:L.ink }}>{r.client}</div>
                  {isOverdue && <div style={{ fontFamily:fMono, fontSize:9, color:L.accent, marginTop:2 }}>{"Overdue "+r.daysOver+" days"}</div>}
                </div>
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500, flexShrink:0 }}>{"€"+r.amount.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, width:90, textAlign:"right", flexShrink:0 }}>{r.due}</div>
                <div style={{ fontFamily:fMono, fontSize:9, color:stColor[r.status]||L.muted, background:(stColor[r.status]||L.muted)+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em", flexShrink:0 }}>{r.status}</div>
                {isOverdue && (
                  <button onClick={function(){ handleAction(r.inv, "reminder"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:11, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>
                    Send Reminder
                  </button>
                )}
                {isSent && (
                  <button onClick={function(){ handleAction(r.inv, "followup"); }} style={{ background:"transparent", color:L.blue, border:"1px solid "+L.blue+"44", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:11, flexShrink:0, whiteSpace:"nowrap" }}>
                    Follow Up
                  </button>
                )}
                {r.status === "paid" && (
                  <span style={{ fontFamily:fMono, fontSize:9, color:L.green, flexShrink:0 }}>✓ All clear</span>
                )}
              </div>
              {toast && (
                <div style={{ margin:"0 20px 12px", padding:"10px 14px", background:toast==="reminder" ? L.accentGlow : L.blueGlow, border:"1px solid "+(toast==="reminder" ? L.accent : L.blue)+"33", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
                  <Icon name="send" size={13} color={toast==="reminder" ? L.accent : L.blue} />
                  <div>
                    <div style={{ fontFamily:fSans, fontSize:12, fontWeight:500, color:L.ink }}>
                      {toast==="reminder" ? "Reminder sent to "+r.client : "Follow-up sent to "+r.client}
                    </div>
                    <div style={{ fontFamily:fMono, fontSize:9, color:L.muted, marginTop:1 }}>
                      {toast==="reminder"
                        ? "Late payment notice with statutory interest reference — EU Dir. 2011/7/EU"
                        : "Friendly payment reminder for invoice "+r.inv}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DProposals() {
  var rows = [
    { title:"Brand Identity — TechFlow",    client:"Studio Verde GmbH", value:8400,  status:"won",      sent:"12 Apr", views:4 },
    { title:"App UI Kit + Design System",   client:"Nord Digital AS",   value:12000, status:"sent",     sent:"28 Apr", views:2 },
    { title:"Pitch Deck — Series A",        client:"Bianchi & Co.",     value:2800,  status:"viewed",   sent:"22 Apr", views:7 },
    { title:"Website Redesign",             client:"Maison Fontaine",   value:6500,  status:"declined", sent:"5 Mar",  views:1 },
  ];
  var stColor = { won:L.green, sent:L.blue, viewed:L.gold, declined:L.accent };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>Proposal Analytics</h2>
        <div style={{ display:"flex", gap:12 }}>
          <StatCard label="Win rate" value="68%" color={L.green} />
          <StatCard label="Avg views" value="3.5" />
        </div>
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, overflow:"hidden" }}>
        {rows.map(function(r, i) {
          return (
            <div key={r.title} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderBottom:i<rows.length-1?"1px solid "+L.borderLt:"none" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:fSans, fontSize:13, fontWeight:500, color:L.ink }}>{r.title}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{r.client} · {r.views} views · sent {r.sent}</div>
              </div>
              <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500 }}>{"€"+r.value.toLocaleString()}</div>
              <div style={{ fontFamily:fMono, fontSize:9, color:stColor[r.status]||L.muted, background:(stColor[r.status]||L.muted)+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em" }}>{r.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DBrandKits() {
  var kits = [
    { name:"Acme Studio GmbH",  primary:"#C8502A", font:"Playfair Display",   logo:"A" },
    { name:"Nord Creative",     primary:"#2A5E9A", font:"DM Sans",             logo:"NC" },
    { name:"Bianchi Studio",    primary:"#2A7A54", font:"Cormorant Garamond",  logo:"B" },
  ];
  var [sel, setSel] = useState(kits[0]);
  return (
    <div>
      <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink, marginBottom:4 }}>Brand Kits</h2>
      <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:20, fontWeight:300 }}>Create a kit per client. Applied automatically to invoices and proposals.</p>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {kits.map(function(kit) {
            var active = sel && sel.name===kit.name;
            return (
              <div key={kit.name} onClick={function(){ setSel(kit); }} style={{ background:active?"#FAF7F2":"transparent", border:"1.5px solid "+(active?L.accent:L.border), borderRadius:10, padding:"10px 12px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:kit.primary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:10, color:"#fff", fontWeight:700 }}>{kit.logo}</div>
                  <div style={{ fontFamily:fSans, fontSize:12, fontWeight:500, color:L.ink }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button style={{ background:"none", border:"1.5px dashed "+L.border, borderRadius:10, padding:"10px 12px", cursor:"pointer", color:L.muted, fontFamily:fSans, fontSize:12 }}>+ New Kit</button>
        </div>
        {sel && (
          <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"20px 24px" }}>
            <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:14 }}>Editing: {sel.name}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Brand Name</label><input defaultValue={sel.name} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"7px 10px", fontFamily:fSans, fontSize:13, color:L.ink, background:L.white, outline:"none" }} /></div>
              <div><label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Primary Color</label><input type="color" defaultValue={sel.primary} style={{ width:"100%", height:34, border:"1.5px solid "+L.border, borderRadius:6, cursor:"pointer" }} /></div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ background:L.accent, color:"#fff", border:"none", padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>Save Kit</button>
              <button style={{ background:"transparent", color:L.ink, border:"1.5px solid "+L.border, padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:12 }}>Apply to All Invoices</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function PaymentStrip() {
  return (
    <div style={{ background:L.cream, borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, padding:"16px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
        <span style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Secure payments via</span>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ background:"#635BFF", borderRadius:6, padding:"4px 10px" }}><span style={{ fontFamily:fSans, fontSize:11, fontWeight:600, color:"#fff", letterSpacing:"-0.01em" }}>stripe</span></div>
          <div style={{ background:L.ink, borderRadius:6, padding:"4px 10px", display:"flex", alignItems:"center", gap:3, opacity:0.75 }}><span style={{ fontSize:10 }}>🍎</span><span style={{ fontFamily:fSans, fontSize:10, fontWeight:500, color:"#fff" }}>Pay</span></div>
          <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:6, padding:"4px 10px", display:"flex", alignItems:"center", gap:3, opacity:0.75 }}><span style={{ fontFamily:fSans, fontSize:11, fontWeight:700, color:"#4285F4" }}>G</span><span style={{ fontFamily:fSans, fontSize:10, fontWeight:500, color:L.ink }}>Pay</span></div>
          <div style={{ background:"#003399", borderRadius:6, padding:"4px 10px" }}><span style={{ fontFamily:fMono, fontSize:9, color:"#fff", letterSpacing:"0.04em" }}>SEPA</span></div>
          <div style={{ background:"#1A1F71", borderRadius:5, padding:"3px 8px" }}><span style={{ fontFamily:fMono, fontSize:8, color:"#fff", letterSpacing:"0.04em", fontWeight:700 }}>VISA</span></div>
          <div style={{ background:"#EB001B", borderRadius:5, padding:"3px 8px" }}><span style={{ fontFamily:fMono, fontSize:8, color:"#fff", letterSpacing:"0.04em", fontWeight:700 }}>MC</span></div>
        </div>
        <span style={{ fontFamily:fMono, fontSize:9, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"2px 8px", letterSpacing:"0.06em" }}>Coming Q3 2026</span>
        <span style={{ fontFamily:fSans, fontSize:11, color:L.muted, fontWeight:300, flex:"1 1 100%", textAlign:"center" }}>Apple Pay, Google Pay and card payments via Stripe — launching Q3 2026. SEPA bank transfer available now.</span>
      </div>
    </div>
  );
}


function Footer(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var lang = props.lang || "en";
  var yr = new Date().getFullYear();
  var cols = [
    { title:"Product", links:[["Generator","Generator"],["Pricing","Pricing"],["Dashboard","Dashboard"]] },
    { title:"Company", links:[["About","About"],["Blog","Blog"],["Careers","Careers"]] },
    { title:"Legal",   links:[["Privacy Policy","Privacy"],["Terms of Service","Terms"],["GDPR & Data","GDPR"],["Cookie Policy","Cookies"]] },
  ];
  return (
    <footer style={{ background:L.ink, borderTop:"1px solid rgba(255,255,255,0.06)", padding:"48px 24px 32px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:26, height:26, background:L.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontFamily:fSerif, fontSize:13, fontWeight:900 }}>I</span>
              </div>
              <div>
                <div style={{ fontFamily:fSerif, fontWeight:700, fontSize:15, color:L.paper, lineHeight:1.1 }}>InvoiceAI</div>
                <div style={{ fontFamily:fMono, fontSize:7, color:"rgba(245,240,232,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>for Europe</div>
              </div>
            </div>
            <p style={{ fontFamily:fSans, fontSize:12, color:"rgba(245,240,232,0.4)", lineHeight:1.6, maxWidth:220, fontWeight:300, marginBottom:14 }}>Built for European creatives and digital professionals.</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["EU VAT compliant","GDPR compliant","SEPA ready"].map(function(b) {
                return <span key={b} style={{ fontFamily:fMono, fontSize:8, color:L.gold, border:"1px solid "+L.gold+"55", borderRadius:4, padding:"2px 7px", letterSpacing:"0.07em" }}>{b}</span>;
              })}
            </div>
          </div>
          {cols.map(function(col) {
            return (
              <div key={col.title}>
                <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(245,240,232,0.25)", marginBottom:12 }}>{col.title}</div>
                {col.links.map(function(pair) {
                  var lb = pair[0]; var pg = pair[1];
                  return (
                    <div key={lb} onClick={pg ? function(){ setPage(pg); } : null} style={{ fontFamily:fSans, fontSize:12, color:"rgba(245,240,232,0.45)", marginBottom:8, cursor:pg?"pointer":"default" }}>{lb}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ background:"rgba(200,80,42,0.1)", border:"1px solid rgba(200,80,42,0.2)", borderRadius:12, padding:"20px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontFamily:fSerif, fontSize:16, fontWeight:700, color:L.paper, marginBottom:3 }}>{t(lang,"footerWaitlist")}</div>
            <div style={{ fontFamily:fSans, fontSize:12, color:"rgba(245,240,232,0.5)", fontWeight:300 }}>{t(lang,"footerWaitlistSub")}</div>
          </div>
          <button onClick={function(){ openModal("footer"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"10px 22px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, flexShrink:0, boxShadow:"0 4px 14px rgba(200,80,42,0.3)" }}>
            {t(lang,"footerCta")}
          </button>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:fMono, fontSize:10, color:"rgba(245,240,232,0.25)" }}>© {yr} InvoiceAI. All rights reserved.</span>
          <div style={{ display:"flex", gap:14 }}>
            {[["eu","EU VAT"],["shield","GDPR"],["bank","SEPA"]].map(function(pair) {
              return <span key={pair[1]} style={{ display:"flex", alignItems:"center", gap:4, fontFamily:fMono, fontSize:9, color:"rgba(245,240,232,0.2)" }}><Icon name={pair[0]} size={10} color="rgba(245,240,232,0.25)" />{pair[1]}</span>;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Sub-pages ─────────────────────────────────────────────────────────────────
function SubLayout(props) {
  var pill = props.pill; var title = props.title; var sub = props.sub; var accent = props.accent;
  return (
    <div style={{ background:L.paper, minHeight:"calc(100vh - 56px)" }}>
      <div style={{ background:accent ? L.accent : L.white, borderBottom:"1px solid "+(accent ? "rgba(255,255,255,0.15)" : L.border), padding:"56px 24px 44px", textAlign:"center" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <Pill color={accent ? "rgba(255,255,255,0.85)" : L.gold}>{pill}</Pill>
          <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,5vw,52px)", fontWeight:900, color:accent ? "#fff" : L.ink, margin:"16px 0 12px", letterSpacing:"-0.025em", lineHeight:1.1 }}>{title}</h1>
          <p style={{ fontFamily:fSans, fontSize:15, color:accent ? "rgba(255,255,255,0.75)" : L.muted, fontWeight:300, lineHeight:1.65, maxWidth:520, margin:"0 auto" }}>{sub}</p>
        </div>
      </div>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px", fontFamily:fSans, fontSize:14, color:L.ink, lineHeight:1.8 }}>
        {props.children}
      </div>
    </div>
  );
}

function SH(props) { return <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.ink, margin:"36px 0 10px", letterSpacing:"-0.02em" }}>{props.children}</h2>; }
function SP(props) { return <p style={{ marginBottom:14, fontWeight:300, color:L.muted }}>{props.children}</p>; }
function SLI(props) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:8 }}>
      <Icon name="check" size={14} color={L.green} style={{ flexShrink:0, marginTop:3 }} />
      <span style={{ fontWeight:300, color:L.muted }}>{props.children}</span>
    </div>
  );
}

function PageAbout(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var team = [
    { name:"Alex Krause",  role:"CEO & Co-founder",  city:"Berlin DE",    av:"AK", bio:"Former Head of Product at a Berlin fintech. Built and sold two SaaS companies. Obsessed with making EU compliance simple." },
    { name:"Marta Conti",  role:"CTO & Co-founder",  city:"Milan IT",     av:"MC", bio:"Ex-engineer at Stripe Europe. Deep expertise in EU payment infrastructure, VAT systems and XRechnung/Factur-X." },
    { name:"Sophie Richter",role:"Head of Design",   city:"Munich DE",    av:"SR", bio:"Lead designer at a top Berlin agency for 8 years. Created brand identities for clients across DE, AT and CH." },
    { name:"Pierre Morel", role:"Head of Growth",    city:"Paris FR",     av:"PM", bio:"Grew two B2B SaaS products from 0 to €1M ARR. Specialist in European market entry and community-led growth." },
  ];
  var timeline = [
    { year:"2024",    event:"Founded in Berlin with a €450k pre-seed round." },
    { year:"Q1 2025", event:"First 100 paying customers across DE, FR and IT." },
    { year:"Q2 2025", event:"Launched AI proposal writer with tone selector." },
    { year:"Q3 2025", event:"Expanded to 7 European languages." },
    { year:"Q4 2025", event:"1,000 active studios and freelancers." },
    { year:"Q1 2026", event:"€500k seed round. Team of 12." },
  ];
  return (
    <SubLayout pill="About" title="Built by Europeans, for Europeans." sub="We started InvoiceAI because we were freelancers who spent too much time invoicing and not enough time on the work we loved." accent>
      <SH>Our story</SH>
      <SP>InvoiceAI was born in 2024 out of genuine frustration. Our founders had been running creative studios in Berlin and Milan and were spending hours every week fighting with US-centric invoicing tools that had no idea what reverse charge was, couldn't format a German Rechnung correctly, and generated GDPR notices that were legally questionable at best.</SP>
      <SP>We looked at the market and found the same thing every time: tools built for American businesses, bolted onto European markets as an afterthought. We decided to build what we actually wanted to use.</SP>
      <SH>What we believe</SH>
      <SLI>Creative professionals should spend their time creating, not accounting.</SLI>
      <SLI>EU compliance shouldn't require a consultant or a law degree.</SLI>
      <SLI>Beautiful software and legally correct software are not mutually exclusive.</SLI>
      <SLI>Data privacy is a right, not a feature. GDPR is our baseline, not a checkbox.</SLI>
      <SH>The team</SH>
      <div className="grid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, margin:"16px 0 32px" }}>
        {team.map(function(m) {
          return (
            <div key={m.name} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:12, padding:"18px 18px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"#8A7A6A22", border:"1.5px solid #8A7A6A30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:"#8A7A6A", fontWeight:500, flexShrink:0 }}>{m.av}</div>
                <div>
                  <div style={{ fontFamily:fSans, fontWeight:600, fontSize:13, color:L.ink }}>{m.name}</div>
                  <div style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.05em" }}>{m.role} · {m.city}</div>
                </div>
              </div>
              <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, lineHeight:1.6, margin:0, fontWeight:300 }}>{m.bio}</p>
            </div>
          );
        })}
      </div>
      <SH>Timeline</SH>
      <div style={{ borderLeft:"2px solid "+L.border, paddingLeft:20, margin:"16px 0 32px" }}>
        {timeline.map(function(t) {
          return (
            <div key={t.year} style={{ position:"relative", marginBottom:16 }}>
              <div style={{ position:"absolute", left:-25, top:5, width:8, height:8, borderRadius:"50%", background:L.accent }} />
              <div style={{ fontFamily:fMono, fontSize:9, color:L.accent, letterSpacing:"0.08em", marginBottom:2 }}>{t.year}</div>
              <div style={{ fontFamily:fSans, fontSize:13, color:L.ink, fontWeight:300 }}>{t.event}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:12, padding:"24px 28px", textAlign:"center" }}>
        <h3 style={{ fontFamily:fSerif, fontSize:20, fontWeight:700, color:L.ink, marginBottom:8 }}>Try InvoiceAI free for 14 days</h3>
        <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:16, fontWeight:300 }}>No credit card. No setup wizards.</p>
        <button onClick={function(){ openModal("about"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)" }}>Get early access →</button>
      </div>
    </SubLayout>
  );
}

function PageBlog(props) {
  var posts = [
    { tag:"EU Compliance", title:"Germany's XRechnung mandate: what every freelancer needs to know in 2026", date:"28 April 2026", read:"6 min", av:"AK", excerpt:"Germany is rolling out mandatory e-invoicing for B2B. Here's what it means for your studio and how InvoiceAI handles it automatically." },
    { tag:"Product",       title:"Introducing AI proposals in 7 European languages",                          date:"14 April 2026", read:"4 min", av:"SR", excerpt:"Your proposal generator now writes in German, French, Italian, Spanish, Dutch and Swedish — automatically matched to your client's country." },
    { tag:"EU Compliance", title:"Reverse charge VAT explained: a practical guide for EU creatives",           date:"30 March 2026", read:"8 min", av:"MC", excerpt:"Cross-border B2B invoicing in the EU is confusing. We break down exactly when reverse charge applies and how to apply it correctly." },
    { tag:"Business",      title:"Late payment in the EU: your legal rights and how to enforce them",         date:"18 March 2026", read:"5 min", av:"PM", excerpt:"EU Directive 2011/7/EU gives you the right to statutory interest on overdue invoices. Most freelancers don't know this exists." },
    { tag:"Product",       title:"The InvoiceAI brand kit: how top studios use it to win more clients",       date:"5 March 2026",  read:"4 min", av:"SR", excerpt:"Consistent branding on every invoice and proposal builds trust. Set up your brand kit in 5 minutes." },
  ];
  var tagColor = { "EU Compliance":L.blue, "Product":L.green, "Business":L.gold };
  return (
    <SubLayout pill="Blog" title="Insights for European creatives." sub="Practical guides on EU compliance, product updates and running a creative business in Europe.">
      <div style={{ background:L.accent, borderRadius:16, padding:"32px 32px 28px", marginBottom:28, cursor:"pointer" }}>
        <Pill color="rgba(255,255,255,0.85)">{posts[0].tag}</Pill>
        <h2 style={{ fontFamily:fSerif, fontSize:"clamp(18px,3vw,26px)", fontWeight:800, color:"#fff", margin:"10px 0 10px", letterSpacing:"-0.02em", lineHeight:1.2 }}>{posts[0].title}</h2>
        <p style={{ fontFamily:fSans, fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:14, fontWeight:300 }}>{posts[0].excerpt}</p>
        <span style={{ fontFamily:fMono, fontSize:9, color:"rgba(255,255,255,0.5)", letterSpacing:"0.06em" }}>{posts[0].date} · {posts[0].read} read</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {posts.slice(1).map(function(p) {
          var tc = tagColor[p.tag] || L.accent;
          return (
            <div key={p.title} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:13, padding:"18px 18px 14px", cursor:"pointer" }}>
              <Pill color={tc}>{p.tag}</Pill>
              <h3 style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, margin:"10px 0 8px", lineHeight:1.35 }}>{p.title}</h3>
              <p style={{ fontFamily:fSans, fontSize:11, color:L.muted, lineHeight:1.55, marginBottom:12, fontWeight:300 }}>{p.excerpt}</p>
              <span style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.04em" }}>{p.date} · {p.read} read</span>
            </div>
          );
        })}
      </div>
    </SubLayout>
  );
}

function PageCareers(props) {
  var jobs = [
    { title:"Senior Full-Stack Engineer", team:"Engineering", loc:"Berlin / Remote EU", tags:["React","Node.js","PostgreSQL","Stripe"], desc:"Own the invoicing engine and help us build EU e-invoicing formats. Work directly with the CTO on architecture decisions." },
    { title:"EU Compliance Specialist",   team:"Legal",        loc:"Berlin / Remote EU", tags:["EU VAT","GDPR","eIDAS","XRechnung"],    desc:"Keep our VAT calculations, GDPR notices and e-invoicing formats accurate across 15+ European jurisdictions." },
    { title:"Product Designer",           team:"Design",       loc:"Berlin / Remote",    tags:["Figma","Design Systems","B2B SaaS"],    desc:"Own the end-to-end design of InvoiceAI from generator flows to the dashboard." },
    { title:"Growth Marketing Manager",   team:"Growth",       loc:"Remote EU",          tags:["B2B SaaS","SEO","Community"],           desc:"Own our European go-to-market across DE, FR, IT and ES. Build channels and community to get InvoiceAI to 10,000 studios." },
  ];
  var perks = ["Remote-first, async culture","€50/month learning budget","Team retreats in European cities","Top-spec hardware setup","Equity for all employees","30 days holiday","InvoiceAI Studio plan free","Health & wellbeing budget"];
  return (
    <SubLayout pill="Careers" title="Help us build the standard for European creative businesses." sub="A small, remote-first team building something we genuinely care about. We're looking for people who share that.">
      <SH>How we work</SH>
      <SP>We're a 12-person team distributed across Berlin, Milan, Paris and remote. We work async-first — we write well, document decisions and trust each other. We do video calls when they're genuinely useful, not as a default.</SP>
      <SH>Open positions</SH>
      <div style={{ display:"flex", flexDirection:"column", gap:12, margin:"16px 0 32px" }}>
        {jobs.map(function(j) {
          return (
            <div key={j.title} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:13, padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:6 }}>
                <h3 style={{ fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink }}>{j.title}</h3>
                <span style={{ fontFamily:fMono, fontSize:9, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"3px 9px", letterSpacing:"0.06em" }}>Full-time</span>
              </div>
              <div style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.06em", marginBottom:8 }}>{j.team} · {j.loc}</div>
              <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, lineHeight:1.6, marginBottom:12, fontWeight:300 }}>{j.desc}</p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                {j.tags.map(function(t) { return <span key={t} style={{ fontFamily:fMono, fontSize:8, color:L.blue, background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em" }}>{t}</span>; })}
              </div>
              <button style={{ background:L.accent, color:"#fff", border:"none", padding:"7px 18px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>Apply →</button>
            </div>
          );
        })}
      </div>
      <SH>Perks</SH>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, margin:"16px 0" }}>
        {perks.map(function(p) {
          return <div key={p} style={{ background:L.cream, borderRadius:8, padding:"10px 14px", fontFamily:fSans, fontSize:12, color:L.ink, display:"flex", alignItems:"center", gap:8 }}><Icon name="check" size={12} color={L.green} />{p}</div>;
        })}
      </div>
    </SubLayout>
  );
}

function PagePrivacy() {
  return (
    <SubLayout pill="Legal" title="Privacy Policy" sub="Last updated: 1 May 2026. We process your data fairly, transparently and in accordance with GDPR.">
      <SH>1. Who we are</SH>
      <SP>InvoiceAI GmbH is registered in Berlin, Germany. We are the data controller for personal data collected through invoiceai.eu and our software services. Data Protection Officer: privacy@invoiceai.eu</SP>
      <SH>2. Data we collect</SH>
      <SLI>Account data: name, email address, company name, country of residence</SLI>
      <SLI>Billing data: VAT number, payment method (processed by Stripe — we never store card numbers)</SLI>
      <SLI>Usage data: features used, pages visited, session duration (anonymised)</SLI>
      <SLI>Invoice data: the invoice and proposal content you create using our platform</SLI>
      <SH>3. Legal basis for processing (GDPR Art. 6)</SH>
      <SLI>Performance of a contract (Art. 6(1)(b)): processing your account and delivering the service</SLI>
      <SLI>Legitimate interests (Art. 6(1)(f)): improving the product, security monitoring, fraud prevention</SLI>
      <SLI>Legal obligation (Art. 6(1)(c)): tax records, compliance with EU e-invoicing regulations</SLI>
      <SLI>Consent (Art. 6(1)(a)): marketing communications (withdraw at any time)</SLI>
      <SH>4. Your rights under GDPR</SH>
      <SLI>Right of access (Art. 15): request a copy of all data we hold about you</SLI>
      <SLI>Right to rectification (Art. 16): correct inaccurate data</SLI>
      <SLI>Right to erasure (Art. 17): request deletion of your data</SLI>
      <SLI>Right to data portability (Art. 20): receive your data in a structured, machine-readable format</SLI>
      <SLI>Right to object (Art. 21): object to processing based on legitimate interests</SLI>
      <SH>5. Data retention</SH>
      <SP>Account data retained for the duration of your subscription plus 3 months. Invoice and financial records retained for 10 years per German tax law (§147 AO).</SP>
      <SH>6. Contact</SH>
      <SP>InvoiceAI GmbH · Unter den Linden 1 · 10117 Berlin · privacy@invoiceai.eu</SP>
    </SubLayout>
  );
}

function PageTerms() {
  return (
    <SubLayout pill="Legal" title="Terms of Service" sub="Last updated: 1 May 2026. These terms govern your use of InvoiceAI.">
      <SH>1. Acceptance</SH>
      <SP>By creating an account or using InvoiceAI, you agree to these Terms of Service and our Privacy Policy.</SP>
      <SH>2. Subscription and billing</SH>
      <SLI>Subscription fees are charged monthly or annually in advance.</SLI>
      <SLI>All prices are exclusive of VAT. Applicable VAT will be added based on your billing country.</SLI>
      <SLI>You may cancel at any time; access continues until the end of the billing period.</SLI>
      <SLI>Refunds are available within 14 days of initial purchase per EU consumer rights law.</SLI>
      <SH>3. Acceptable use</SH>
      <SP>You agree not to use InvoiceAI to create fraudulent invoices, misrepresent your identity, violate any applicable law, or attempt to gain unauthorised access to our systems.</SP>
      <SH>4. Your data</SH>
      <SP>You retain all rights to the content you create using InvoiceAI. We do not sell your data or use it to train AI models without your explicit consent.</SP>
      <SH>5. EU consumer rights</SH>
      <SP>EU consumers have a 14-day right of withdrawal. Our services are intended primarily for business use.</SP>
      <SH>6. Governing law</SH>
      <SP>These terms are governed by German law. Disputes will be referred to the courts of Berlin, Germany, unless mandatory consumer law requires otherwise. EU ODR platform: ec.europa.eu/consumers/odr</SP>
      <SH>7. Contact</SH>
      <SP>InvoiceAI GmbH · Unter den Linden 1 · 10117 Berlin · legal@invoiceai.eu</SP>
    </SubLayout>
  );
}

function PageGDPR() {
  var cards = [
    { icon:"eu",       title:"EU-hosted data",        desc:"All customer data stored on AWS Frankfurt (eu-central-1). Never leaves the EU." },
    { icon:"shield",   title:"Encryption",            desc:"AES-256 at rest. TLS 1.3 in transit. Keys managed via AWS KMS." },
    { icon:"document", title:"DPA available",         desc:"We provide a signed Data Processing Agreement to all customers on request." },
    { icon:"archive",  title:"Right to erasure",      desc:"Delete your account and all data via Settings in 72 hours." },
    { icon:"download", title:"Data portability",      desc:"Export all data (clients, invoices, proposals) as JSON or CSV at any time." },
    { icon:"x",        title:"No data selling",       desc:"We do not sell, rent or share your data with third parties. Ever." },
  ];
  return (
    <SubLayout pill="EU Compliance" title="GDPR and Data Processing" sub="We take data protection seriously. Here's exactly how we comply with the General Data Protection Regulation." accent>
      <div className="sub-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, margin:"0 0 36px" }}>
        {cards.map(function(c) {
          return (
            <div key={c.title} style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:10, padding:"16px 16px 14px" }}>
              <div style={{ marginBottom:8 }}><Icon name={c.icon} size={18} color={L.accent} /></div>
              <div style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink, marginBottom:4 }}>{c.title}</div>
              <div style={{ fontFamily:fSans, fontSize:11, color:L.muted, lineHeight:1.5, fontWeight:300 }}>{c.desc}</div>
            </div>
          );
        })}
      </div>
      <SH>Data Processing Agreement</SH>
      <SP>If you process your clients' personal data through InvoiceAI, you may need a DPA with us under GDPR Art. 28. We provide a standard pre-signed DPA to all customers — email privacy@invoiceai.eu to request it.</SP>
      <SH>Cookie-less analytics</SH>
      <SP>We use Plausible Analytics — a privacy-first, cookieless tool hosted in the EU. No personal data collected. No cookies set. IP addresses never stored. You are not tracked across websites.</SP>
      <SH>Sub-processors</SH>
      <div style={{ background:L.cream, borderRadius:10, overflow:"hidden", border:"1px solid "+L.border, margin:"16px 0" }}>
        {[["Stripe Inc.","Payment processing","USA (SCCs)"],["Amazon Web Services","Cloud hosting (Frankfurt)","EU"],["Anthropic PBC","AI features","USA (SCCs)"],["Plausible Analytics","Cookieless analytics","EU"]].map(function(row, i) {
          return (
            <div key={row[0]} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr", padding:"10px 16px", borderBottom:i<3?"1px solid "+L.border:"none" }}>
              <span style={{ fontFamily:fSans, fontSize:12, fontWeight:500, color:L.ink }}>{row[0]}</span>
              <span style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{row[1]}</span>
              <span style={{ fontFamily:fMono, fontSize:9, color:L.faint }}>{row[2]}</span>
            </div>
          );
        })}
      </div>
    </SubLayout>
  );
}

function PageCookies() {
  var cookies = [
    { name:"invoiceai_session", type:"Strictly necessary", dur:"Session",  desc:"Keeps you logged in during your browser session." },
    { name:"invoiceai_auth",    type:"Strictly necessary", dur:"30 days",  desc:"Remembers your login across sessions if you choose Stay logged in." },
    { name:"invoiceai_lang",    type:"Functional",         dur:"1 year",   desc:"Remembers your chosen language preference." },
    { name:"_plausible",        type:"Analytics",          dur:"None",     desc:"Plausible: no personal data, no cookie set. Session counted via hash." },
    { name:"__stripe_mid",      type:"Payment",            dur:"1 year",   desc:"Stripe fraud prevention. Only set on checkout pages." },
  ];
  var typeColor = { "Strictly necessary":L.green, "Functional":L.blue, "Analytics":L.gold, "Payment":L.accent };
  return (
    <SubLayout pill="Legal" title="Cookie Policy" sub="Last updated: 1 May 2026. We use as few cookies as possible — only what's needed to run the service.">
      <SH>Our approach</SH>
      <SP>We deliberately minimise cookie usage. No advertising cookies, no third-party tracking, no social media pixels. Our analytics are cookieless (Plausible) and our only strictly necessary cookies are for authentication.</SP>
      <SH>Cookies we use</SH>
      <div style={{ background:L.cream, borderRadius:10, overflow:"hidden", border:"1px solid "+L.border, margin:"16px 0 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.2fr 0.8fr 2fr", padding:"10px 16px", borderBottom:"1px solid "+L.border, background:L.sand }}>
          {["Cookie","Type","Duration","Purpose"].map(function(h) {
            return <span key={h} style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", color:L.muted }}>{h}</span>;
          })}
        </div>
        {cookies.map(function(c, i) {
          var tc = typeColor[c.type] || L.muted;
          return (
            <div key={c.name} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.2fr 0.8fr 2fr", padding:"12px 16px", borderBottom:i<cookies.length-1?"1px solid "+L.border:"none", alignItems:"start" }}>
              <span style={{ fontFamily:fMono, fontSize:10, color:L.ink }}>{c.name}</span>
              <span style={{ fontFamily:fMono, fontSize:8, color:tc, background:tc+"15", border:"1px solid "+tc+"33", borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em", display:"inline-block" }}>{c.type}</span>
              <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{c.dur}</span>
              <span style={{ fontFamily:fSans, fontSize:11, color:L.muted, lineHeight:1.5, fontWeight:300 }}>{c.desc}</span>
            </div>
          );
        })}
      </div>
      <SH>Contact</SH>
      <SP>Questions about cookies? Email privacy@invoiceai.eu</SP>
    </SubLayout>
  );
}

// ── Client Portal ─────────────────────────────────────────────────────────────
var PORTAL_INVOICE = {
  num:        "DE-2026-0437",
  date:       "29 April 2026",
  due:        "29 May 2026",
  from: {
    name:     "Acme Studio GmbH",
    street:   "Unter den Linden 1",
    city:     "10117 Berlin, Germany",
    vat:      "DE123456789",
    iban:     "DE89 3704 0044 0532 0130 00",
    bic:      "COBADEFFXXX",
    email:    "hello@acmestudio.de",
  },
  to: {
    name:     "Studio Verde GmbH",
    street:   "Corso Buenos Aires 12",
    city:     "20124 Milan, Italy",
    vat:      "IT08643510963",
    contact:  "Marco Bianchi",
  },
  lines: [
    { desc:"Brand Identity Workshop",      qty:1, rate:1800, total:1800 },
    { desc:"Logo Design + 3 variations",   qty:1, rate:2400, total:2400 },
    { desc:"Brand Guidelines PDF",         qty:1, rate:1200, total:1200 },
  ],
  sub:        5400,
  vat:        0,
  vatLabel:   "VAT 0% — Reverse Charge (Art. 44 EU VAT Directive)",
  total:      5400,
  ref:        "Brand Identity Project Q1 2026",
  terms:      "Net 30 days",
  note:       "Statutory interest at 8% above ECB base rate applies on overdue amounts per EU Dir. 2011/7/EU.",
  gdpr:       "Personal data processed for invoicing purposes under GDPR Art. 6(1)(b).",
};

function ClientPortal(props) {
  var setPage = props.setPage;
  var inv = PORTAL_INVOICE;
  var [status, setStatus] = useState("pending");
  var [showPay, setShowPay] = useState(false);
  var [payMethod, setPayMethod] = useState("sepa");

  var timeline = [
    { label:"Sent",     date:"29 Apr 2026", done:true },
    { label:"Viewed",   date:"29 Apr 2026", done:true },
    { label:"Approved", date:status==="approved"||status==="paid" ? "30 Apr 2026" : null, done:status==="approved"||status==="paid" },
    { label:"Paid",     date:status==="paid" ? "02 May 2026" : null, done:status==="paid" },
  ];

  return (
    <div style={{ background:"#F0EDE6", minHeight:"100vh" }}>
      <div style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, background:L.accent, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontFamily:fSerif, fontSize:13, fontWeight:900 }}>I</span>
          </div>
          <span style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, letterSpacing:"-0.02em" }}>InvoiceAI</span>
          <span style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.08em" }}>· secure invoice portal</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:L.green }} />
          <span style={{ fontFamily:fMono, fontSize:10, color:L.green, letterSpacing:"0.06em" }}>SSL encrypted</span>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"32px 20px 64px" }}>

        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, padding:"20px 24px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Invoice from</div>
            <div style={{ fontFamily:fSerif, fontSize:19, fontWeight:800, color:L.ink, letterSpacing:"-0.02em" }}>{inv.from.name}</div>
            <div style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:2 }}>Invoice {inv.num} · Due {inv.due}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:30, fontWeight:900, color:L.accent, letterSpacing:"-0.02em" }}>{"€"+inv.total.toLocaleString()}</div>
            <div style={{ fontFamily:fMono, fontSize:9, color:status==="paid"?L.green:status==="approved"?L.blue:L.gold, background:(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"18", border:"1px solid "+(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"44", borderRadius:4, padding:"3px 10px", letterSpacing:"0.07em", display:"inline-block", marginTop:4 }}>
              {status==="paid" ? "✓ PAID" : status==="approved" ? "APPROVED" : "AWAITING APPROVAL"}
            </div>
          </div>
        </div>

        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, marginBottom:16, overflow:"hidden" }}>
          <div style={{ padding:"14px 24px", background:L.cream, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Status timeline</span>
          </div>
          <div style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:0 }}>
            {timeline.map(function(t, i) {
              return (
                <div key={t.label} style={{ display:"flex", alignItems:"center", flex:i < timeline.length-1 ? 1 : "none" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:t.done ? L.green : L.borderLt, border:"2px solid "+(t.done ? L.green : L.border), display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {t.done
                        ? <Icon name="check" size={13} color="#fff" />
                        : <div style={{ width:7, height:7, borderRadius:"50%", background:L.border }} />
                      }
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:fSans, fontSize:11, fontWeight:600, color:t.done ? L.ink : L.muted, whiteSpace:"nowrap" }}>{t.label}</div>
                      {t.date && <div style={{ fontFamily:fMono, fontSize:8, color:L.faint }}>{t.date}</div>}
                    </div>
                  </div>
                  {i < timeline.length-1 && (
                    <div style={{ flex:1, height:2, background:t.done ? L.green : L.borderLt, margin:"0 4px", marginBottom:24 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, marginBottom:16, overflow:"hidden" }}>
          <div style={{ padding:"14px 24px", background:L.cream, borderBottom:"1px solid "+L.border }}>
            <span style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice details</span>
          </div>
          <div style={{ padding:"22px 28px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>From</div>
                <div style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink }}>{inv.from.name}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{inv.from.street}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{inv.from.city}</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.faint, marginTop:3 }}>VAT: {inv.from.vat}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Billed to</div>
                <div style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink }}>{inv.to.name}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{inv.to.contact}</div>
                <div style={{ fontFamily:fSans, fontSize:11, color:L.muted }}>{inv.to.city}</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.faint, marginTop:3 }}>VAT: {inv.to.vat}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, marginBottom:16 }}>
              {[{l:"Invoice No.",v:inv.num},{l:"Issue Date",v:inv.date},{l:"Due Date",v:inv.due}].map(function(x, i) {
                return (
                  <div key={x.l} style={{ padding:"10px 12px", borderRight:i<2?"1px solid "+L.border:"none" }}>
                    <div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{x.l}</div>
                    <div style={{ fontFamily:fMono, fontSize:11, color:L.ink, fontWeight:500 }}>{x.v}</div>
                  </div>
                );
              })}
            </div>
            {inv.ref && <div style={{ fontFamily:fSans, fontSize:11, color:L.muted, fontStyle:"italic", marginBottom:14 }}>Re: {inv.ref}</div>}
            <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
              <thead>
                <tr>
                  {["Description","Qty","Rate","Total"].map(function(h) {
                    return <th key={h} style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, padding:"5px 0", textAlign:h==="Description"?"left":"right", borderBottom:"2px solid "+L.ink }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {inv.lines.map(function(line, i) {
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid "+L.border }}>
                      <td style={{ fontFamily:fSans, fontSize:12, color:L.ink, padding:"9px 0" }}>{line.desc}</td>
                      <td style={{ fontFamily:fMono, fontSize:11, color:L.muted, textAlign:"right", padding:"9px 0" }}>{line.qty}</td>
                      <td style={{ fontFamily:fMono, fontSize:11, color:L.muted, textAlign:"right", padding:"9px 0" }}>{"€"+line.rate.toLocaleString()}</td>
                      <td style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500, textAlign:"right", padding:"9px 0" }}>{"€"+line.total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ minWidth:240 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:11, color:L.muted, padding:"2px 0" }}>
                  <span>Subtotal</span><span style={{ fontFamily:fMono }}>{"€"+inv.sub.toLocaleString()}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:11, color:L.blue, padding:"3px 0 6px", borderBottom:"1.5px solid "+L.ink }}>
                  <span>{inv.vatLabel}</span><span style={{ fontFamily:fMono }}>€0.00</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, paddingTop:6 }}>
                  <span>Total Due</span><span style={{ color:L.accent }}>{"€"+inv.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ background:L.cream, borderRadius:8, padding:"12px 14px", marginTop:16 }}>
              <div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>SEPA Bank Transfer</div>
              <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
                <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>IBAN</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{inv.from.iban}</div></div>
                <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>BIC</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{inv.from.bic}</div></div>
                <div><div style={{ fontFamily:fMono, fontSize:8, color:L.muted, textTransform:"uppercase" }}>Reference</div><div style={{ fontFamily:fMono, fontSize:12, color:L.ink, fontWeight:500 }}>{inv.num}</div></div>
              </div>
            </div>
            {inv.note && <p style={{ fontFamily:fSans, fontSize:10, color:L.muted, marginTop:10, paddingTop:10, borderTop:"1px solid "+L.borderLt }}>{inv.note}</p>}
            <p style={{ fontFamily:fSans, fontSize:10, color:L.faint, marginTop:6 }}>{inv.gdpr}</p>
          </div>
        </div>

        {status !== "paid" && (
          <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, overflow:"hidden", marginBottom:16 }}>
            <div style={{ padding:"14px 24px", background:status==="approved" ? L.greenGlow : L.accentGlow, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", gap:8 }}>
              <Icon name={status==="approved" ? "check" : "card"} size={15} color={status==="approved" ? L.green : L.accent} />
              <span style={{ fontFamily:fMono, fontSize:9, color:status==="approved" ? L.green : L.accent, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                {status==="approved" ? "Approved — ready to pay" : "Action required"}
              </span>
            </div>
            <div style={{ padding:"20px 24px" }}>
              {status === "pending" && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    Please review the invoice above and approve it. Once approved, you can pay via SEPA transfer or card.
                  </p>
                  <button onClick={function(){ setStatus("approved"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)", marginRight:10 }}>
                    ✓ Approve Invoice
                  </button>
                  <button style={{ background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"13px 20px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:13 }}>
                    Request changes
                  </button>
                </div>
              )}
              {status === "approved" && !showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:13, color:L.green, fontWeight:500, marginBottom:14 }}>✓ Invoice approved on 30 Apr 2026</p>
                  <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:16, fontWeight:300 }}>Choose your payment method:</p>
                  <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                    {[["sepa","🏦 SEPA Transfer"],["card","💳 Card"],["apple","🍎 Apple Pay"]].map(function(pair) {
                      return (
                        <button key={pair[0]} onClick={function(){ setPayMethod(pair[0]); }} style={{ background:payMethod===pair[0] ? L.ink : L.paper, color:payMethod===pair[0] ? "#fff" : L.ink, border:"1.5px solid "+(payMethod===pair[0] ? L.ink : L.border), borderRadius:8, padding:"9px 18px", cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:payMethod===pair[0] ? 500 : 400 }}>
                          {pair[1]}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={function(){ setShowPay(true); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)" }}>
                    Pay €5,400 →
                  </button>
                </div>
              )}
              {status === "approved" && showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    {payMethod === "sepa" && "Transfer €5,400 to the IBAN above with reference DE-2026-0437. Payment typically clears in 1 business day."}
                    {payMethod === "card" && "Card payments launching Q3 2026 via Stripe. Use SEPA transfer for now."}
                    {payMethod === "apple" && "Apple Pay launching Q3 2026. Use SEPA transfer for now."}
                  </p>
                  <button onClick={function(){ setStatus("paid"); setShowPay(false); }} style={{ background:L.green, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>
                    ✓ Mark as paid
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {status === "paid" && (
          <div style={{ background:L.greenGlow, border:"1.5px solid "+L.green+"44", borderRadius:16, padding:"24px 28px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.green, marginBottom:6 }}>✓ Payment confirmed</div>
            <p style={{ fontFamily:fSans, fontSize:13, color:L.green, fontWeight:300 }}>Thank you. A receipt has been sent to {inv.to.contact} at Studio Verde GmbH.</p>
          </div>
        )}

        <div style={{ textAlign:"center", padding:"20px 0 4px" }}>
          <span style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.08em" }}>Secured &amp; delivered by </span>
          <span onClick={function(){ setPage("Home"); }} style={{ fontFamily:fSerif, fontSize:11, fontWeight:700, color:L.accent, cursor:"pointer", letterSpacing:"-0.01em" }}>InvoiceAI</span>
          <span style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.08em" }}> · EU-native invoicing</span>
        </div>
      </div>
    </div>
  );
}


var BOT_QA = [
  { q:["reverse charge","rc","cross-border","art 44"],      a:"Reverse charge applies when you invoice a VAT-registered business in another EU country. InvoiceAI detects this automatically when you enter the client's VAT number — sets VAT to 0% and adds the required legal text." },
  { q:["vat","tax rate","percent"],                         a:"InvoiceAI uses the correct VAT rate per country automatically: Germany 19%, France 20%, Italy 22%, Netherlands 21%, Sweden 25% and more. You can also mark invoices VAT-exempt (§19 UStG) if you're a small business." },
  { q:["sepa","iban","bank transfer","payment"],            a:"Every invoice includes a SEPA bank transfer block with your IBAN and BIC. Just enter them once in the invoice form and they appear on every invoice automatically." },
  { q:["gdpr","data","privacy","personal"],                 a:"InvoiceAI adds a GDPR-compliant notice to every invoice automatically. Your data is hosted on AWS Frankfurt (EU), never leaves the EU, and we never sell it to third parties." },
  { q:["proposal","ai","generate","write"],                 a:"Type a brief project description, choose a tone (direct, warm or formal), and the AI writes a full client-ready proposal in under 30 seconds. You can then refine it with one-click actions." },
  { q:["plan","price","cost","solo","studio","agency"],     a:"Solo is €19/mo (50 invoices), Studio is €59/mo (unlimited, most popular), Agency is €149/mo (5 team seats + white-label). All plans include a 14-day free trial — no credit card needed." },
  { q:["credit note","refund","correct","cancel"],          a:"Enable 'Credit Note' in the EU Compliance section. InvoiceAI automatically assigns a separate CN-YYYY-XXX number sequence as required by EU VAT law." },
  { q:["xml","xrechnung","factur-x","e-invoice"],           a:"E-invoice XML is coming Q4 2026. We're building XRechnung 3.0 for Germany, Factur-X for France, and XML/SDI for Italy. Toggle it on in the compliance section to mark invoices as compliant." },
  { q:["late payment","interest","overdue","directive"],    a:"EU Directive 2011/7/EU gives you the right to charge 8% above ECB base rate on overdue B2B invoices — no contract needed. Enable 'Late Payment Interest' in the compliance section." },
  { q:["cancel","refund","trial","free"],                   a:"You can cancel anytime from account settings. Your 14-day trial is completely free with no credit card required. If you upgrade and change your mind, we offer a full refund within 14 days." },
];

function SupportBot() {
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
      setTimeout(function() {
        setMsgs(newMsgs.concat([{ role:"bot", text:local }]));
        setLoading(false);
      }, 420);
      return;
    }

    var history = newMsgs.map(function(m) { return { role: m.role === "bot" ? "assistant" : "user", content: m.text }; });
    fetch("/api/claude", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:300,
        system:"You are a helpful support assistant for InvoiceAI, an EU-native invoicing and proposal tool for creative professionals. Answer in 1-3 sentences. Key facts: Solo €19/mo, Studio €59/mo, Agency €149/mo. 14-day free trial. Supports EU VAT, reverse charge, SEPA, GDPR, XRechnung, Factur-X. 7 EU languages.",
        messages:history,
      }),
    }).then(function(r) { return r.json(); })
      .then(function(data) {
        var reply = (data.content || []).map(function(b) { return b.text || ""; }).join("") || "I'm not sure — please email hello@invoiceai.eu";
        setMsgs(newMsgs.concat([{ role:"bot", text:reply }]));
        setLoading(false);
      })
      .catch(function() {
        setMsgs(newMsgs.concat([{ role:"bot", text:"Connection error — please try again or email hello@invoiceai.eu" }]));
        setLoading(false);
      });
  }

  var SUGGESTIONS = ["How does reverse charge work?","What's in the Studio plan?","How do I add my VAT number?","Can I issue a credit note?"];

  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999 }}>
      {open && (
        <div className="bot-panel" style={{ position:"absolute", bottom:60, right:0, width:320, background:L.white, border:"1.5px solid "+L.border, borderRadius:16, boxShadow:"0 16px 48px rgba(44,36,22,0.18)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ background:L.accent, padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="bolt" size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:"#fff" }}>InvoiceAI Support</div>
                <div style={{ fontFamily:fMono, fontSize:8, color:"rgba(255,255,255,0.65)", letterSpacing:"0.06em" }}>Usually replies instantly</div>
              </div>
            </div>
            <button onClick={function(){ setOpen(false); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px" }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10, maxHeight:320 }}>
            {msgs.map(function(m, i) {
              var isBot = m.role === "bot";
              return (
                <div key={i} style={{ display:"flex", justifyContent:isBot ? "flex-start" : "flex-end" }}>
                  <div style={{ maxWidth:"82%", background:isBot ? L.cream : L.accent, color:isBot ? L.ink : "#fff", borderRadius:isBot ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding:"9px 12px", fontFamily:fSans, fontSize:12, lineHeight:1.55, fontWeight:300 }}>
                    {m.text}
                  </div>
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
                return (
                  <button key={s} onClick={function(){ setInput(s); }} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontFamily:fSans, fontSize:11, color:L.muted, textAlign:"left" }}>
                    {s}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ padding:"10px 12px", borderTop:"1px solid "+L.border, display:"flex", gap:8 }}>
            <input
              value={input}
              onChange={function(e){ setInput(e.target.value); }}
              onKeyDown={function(e){ if(e.key==="Enter") send(); }}
              placeholder="Ask anything…"
              style={{ flex:1, border:"1.5px solid "+L.border, borderRadius:8, padding:"7px 10px", fontFamily:fSans, fontSize:12, color:L.ink, background:L.paper, outline:"none" }}
            />
            <button onClick={send} disabled={!input.trim() || loading} style={{ background:input.trim() && !loading ? L.accent : L.border, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", cursor:input.trim() && !loading ? "pointer" : "not-allowed" }}>
              <Icon name="send" size={13} color="#fff" />
            </button>
          </div>
        </div>
      )}
      <button onClick={function(){ setOpen(function(o){ return !o; }); }} style={{ width:48, height:48, borderRadius:"50%", background:open ? L.ink : L.accent, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(200,80,42,0.35)", transition:"background 0.15s" }}>
        {open
          ? <Icon name="x" size={18} color="#fff" />
          : <Icon name="bolt" size={20} color="#fff" />
        }
      </button>
    </div>
  );
}


// ── Signup Modal ──────────────────────────────────────────────────────────────
var EU_COUNTRIES_LIST = ["Germany","France","Italy","Netherlands","Spain","Belgium","Austria","Sweden","Poland","Portugal","Denmark","Finland","Ireland","Czech Republic","Romania","Hungary","Greece","Other EU","Outside EU"];

function SignupModal(props) {
  var onClose = props.onClose;
  var source = props.source || "nav";
  var lang = props.lang || "en";
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [country, setCountry] = useState("Germany");
  var [role, setRole] = useState("");
  var [loading, setLoading] = useState(false);
  var [done, setDone] = useState(false);
  var [error, setError] = useState("");
  var ROLES = ["Freelance Designer","Freelance Developer","Creative Agency","UX/UI Consultant","Copywriter / Translator","Photographer / Videographer","Other"];

  function submit() {
    if (!name.trim() || !email.trim() || !role) { setError("Please fill in all fields."); return; }
    if (email.indexOf("@") < 0) { setError("Please enter a valid email."); return; }
    setError(""); setLoading(true);
    // Replace this with your real Loops/Mailchimp endpoint:
    // fetch("https://app.loops.so/api/v1/contacts/create", {
    //   method:"POST", headers:{"Content-Type":"application/json","Authorization":"Bearer YOUR_KEY"},
    //   body: JSON.stringify({ email:email.trim(), firstName:name.trim().split(" ")[0], country:country, userGroup:role, source:"waitlist-"+source })
    // })
    setTimeout(function() { setLoading(false); setDone(true); }, 900);
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:8, padding:"10px 12px", fontFamily:fSans, fontSize:13, color:L.ink, background:L.white, outline:"none" };
  var lbl = { display:"block", marginBottom:4, fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(44,36,22,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:L.white, borderRadius:20, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 24px 64px rgba(44,36,22,0.25)" }}>
        <div style={{ background:L.accent, padding:"24px 28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:fMono, fontSize:9, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Early Access · invoice-ai.de</div>
              <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1 }}>{t(lang,"modalTitle")}</h2>
              <p style={{ fontFamily:fSans, fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:6, fontWeight:300, lineHeight:1.5 }}>{t(lang,"modalSub")}</p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}>×</button>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:14 }}>
            {["🎯 14-day free trial","🔒 No credit card","📍 EU-hosted data"].map(function(t) {
              return <div key={t} style={{ fontFamily:fMono, fontSize:8, color:"rgba(255,255,255,0.65)", letterSpacing:"0.04em" }}>{t}</div>;
            })}
          </div>
        </div>
        {!done ? (
          <div style={{ padding:"24px 28px 28px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><label style={lbl}>Full name *</label><input value={name} onChange={function(e){ setName(e.target.value); }} placeholder="Alex Krause" style={inp} /></div>
              <div><label style={lbl}>Work email *</label><input type="email" value={email} onChange={function(e){ setEmail(e.target.value); }} placeholder="alex@studio.de" style={inp} /></div>
              <div>
                <label style={lbl}>I am a *</label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ROLES.map(function(r) {
                    return <button key={r} onClick={function(){ setRole(r); }} style={{ background:role===r?L.ink:L.paper, color:role===r?"#fff":L.muted, border:"1.5px solid "+(role===r?L.ink:L.border), borderRadius:99, padding:"5px 12px", cursor:"pointer", fontFamily:fSans, fontSize:11, fontWeight:role===r?500:400 }}>{r}</button>;
                  })}
                </div>
              </div>
              <div>
                <label style={lbl}>Country *</label>
                <select value={country} onChange={function(e){ setCountry(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {EU_COUNTRIES_LIST.map(function(c){ return <option key={c} value={c}>{c}</option>; })}
                </select>
              </div>
              {error && <p style={{ fontFamily:fSans, fontSize:12, color:L.accent, margin:0 }}>{error}</p>}
              <button onClick={submit} disabled={loading} style={{ background:loading?L.border:L.accent, color:"#fff", border:"none", padding:"13px", borderRadius:9, cursor:loading?"not-allowed":"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:loading?"none":"0 4px 14px rgba(200,80,42,0.3)" }}>
{loading ? t(lang,"modalJoining") : t(lang,"modalCta")}
              </button>
            </div>
            <p style={{ fontFamily:fMono, fontSize:9, color:L.faint, textAlign:"center", marginTop:14, letterSpacing:"0.04em" }}>No spam. One email when we launch. Unsubscribe anytime.</p>
          </div>
        ) : (
          <div style={{ padding:"36px 28px 40px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:14 }}>🎉</div>
            <h3 style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.ink, marginBottom:8, letterSpacing:"-0.02em" }}>{t(lang,"modalDoneTitle")}</h3>
            <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, marginBottom:6, fontWeight:300 }}>We'll email you at <strong style={{ color:L.ink }}>{email}</strong> the moment early access opens.</p>
            <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.6, marginBottom:24, fontWeight:300 }}>Founding member rate: <strong style={{ color:L.accent }}>Studio €29/mo forever</strong> — locked in at signup.</p>
            <div style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <p style={{ fontFamily:fMono, fontSize:9, color:L.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>While you wait — try the demo</p>
              <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, fontWeight:300 }}>Generate a real proposal or invoice right now. No account needed.</p>
            </div>
            <button onClick={onClose} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500 }}>{t(lang,"modalExploreCta")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  var [page, setPage] = useState("Home");
  var [modal, setModal] = useState(null);
  var [lang, setLang] = useState("de");

  function openModal(source) { setModal(source); }
  function closeModal() { setModal(null); }

  var showFooter = ["Home","Pricing","About","Blog","Careers","Privacy","Terms","GDPR","Cookies"].indexOf(page) >= 0;
  return (
    <>
      <style>{FONTS}</style>
      <style>{"* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #F5F0E8; } @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: #EDE8DC; } ::-webkit-scrollbar-thumb { background: #D8D0C4; border-radius: 2px; } @media (min-width: 769px) { .nav-burger { display: none !important; } } @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-cta { display: none !important; } .nav-burger { display: flex !important; flex-direction: column; } .hero-btns { flex-direction: column !important; align-items: stretch !important; } .grid3 { grid-template-columns: 1fr !important; } .grid2 { grid-template-columns: 1fr !important; } .grid4 { grid-template-columns: 1fr 1fr !important; } .prop-grid { grid-template-columns: 1fr !important; } .inv-grid { grid-template-columns: 1fr !important; } .dash-layout { flex-direction: column !important; } .dash-aside { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; padding: 10px 8px !important; display: flex !important; gap: 4px; } .bot-panel { width: calc(100vw - 32px) !important; right: 0 !important; } .stat-grid { grid-template-columns: 1fr 1fr !important; } .sub-grid { grid-template-columns: 1fr 1fr !important; } } @media (max-width: 480px) { .grid4 { grid-template-columns: 1fr !important; } .stat-grid { grid-template-columns: 1fr !important; } .sub-grid { grid-template-columns: 1fr !important; } }"}</style>
      {page !== "ClientPortal" && <Nav page={page} setPage={setPage} openModal={openModal} lang={lang} setLang={setLang} />}
      {page==="Home"         && <><Landing setPage={setPage} openModal={openModal} lang={lang} /><PaymentStrip /></>}
      {page==="Generator"    && <InvoiceGen onFirstGenerate={null} setPage={setPage} lang={lang} />}
      {page==="Pricing"      && <><PricingSection setPage={setPage} openModal={openModal} lang={lang} /><PaymentStrip /></>}
      {page==="Dashboard"    && <Dashboard />}
      {page==="ClientPortal" && <ClientPortal setPage={setPage} />}
      {page==="About"        && <PageAbout setPage={setPage} openModal={openModal} />}
      {page==="Blog"         && <PageBlog />}
      {page==="Careers"      && <PageCareers />}
      {page==="Privacy"      && <PagePrivacy />}
      {page==="Terms"        && <PageTerms />}
      {page==="GDPR"         && <PageGDPR />}
      {page==="Cookies"      && <PageCookies />}
      {showFooter && <Footer setPage={setPage} openModal={openModal} lang={lang} />}
      {page !== "ClientPortal" && <SupportBot />}
      {modal && <SignupModal source={modal} onClose={closeModal} lang={lang} />}
    </>
  );
}
