import { useState, useEffect, useCallback } from "react";
import { L, fSans, fMono, fSerif, Icon, LogoMark } from "./constants.jsx";

// ── Design tokens ─────────────────────────────────────────────────────────────
var C = {
  bg:         "#F4F3F0",
  surface:    "#FFFFFF",
  surfaceAlt: "#FAFAF8",
  raised:     "#FDFDFC",
  navy:       "#081120",
  navyMid:    "#0E1F33",
  navyItem:   "rgba(240,244,248,0.45)",
  navyActive: "#FFFFFF",
  // Primary accent — slightly desaturated, more refined
  accent:     "#149990",
  accentSoft: "rgba(20,153,144,0.07)",
  accentMid:  "rgba(20,153,144,0.14)",
  // Semantic
  green:      "#1A9E6B",
  greenSoft:  "rgba(26,158,107,0.07)",
  red:        "#C94840",
  redSoft:    "rgba(201,72,64,0.06)",
  gold:       "#A07830",
  goldSoft:   "rgba(160,120,48,0.07)",
  blue:       "#3460C0",
  blueSoft:   "rgba(52,96,192,0.07)",
  // Text
  ink:        "#0C1A2E",
  inkLight:   "#2A3A4E",
  muted:      "#6B7480",
  faint:      "#A0A8B0",
  // Surfaces — no borders, just shadow separation
  border:     "#E6E4DF",
  borderLt:   "#EEEDE9",
};

var fUI = "'DM Sans', sans-serif";

// ── Supabase data hook ────────────────────────────────────────────────────────
export function useDB(table, userId) {
  var [rows, setRows] = useState([]);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var fetch_ = useCallback(function() {
    if (!userId) return;
    setLoading(true); setError(null);
    fetch("/api/db?table=" + encodeURIComponent(table) + "&user_id=" + encodeURIComponent(userId))
      .then(function(r) { return r.json(); })
      .then(function(data) { setRows(data || []); setLoading(false); })
      .catch(function(err) { setError(err.message); setLoading(false); });
  }, [table, userId]);
  useEffect(function() { fetch_(); }, [fetch_]);
  function insert(payload) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"insert", user_id:userId, payload:payload }) })
      .then(function(r) { return r.json(); }).then(function(d) { fetch_(); return d; });
  }
  function update(id, payload) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"update", id:id, user_id:userId, payload:payload }) })
      .then(function(r) { return r.json(); }).then(function(d) { fetch_(); return d; });
  }
  function remove(id) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"delete", id:id, user_id:userId }) })
      .then(function(r) { return r.json(); }).then(function(d) { fetch_(); return d; });
  }
  return { rows:rows, loading:loading, error:error, refresh:fetch_, insert:insert, update:update, remove:remove };
}

// ── Mock data ─────────────────────────────────────────────────────────────────
var MOCK_CLIENTS = [
  { id:"1", name:"Studio Verde GmbH",  email:"hello@studioverde.de",   country:"DE", city:"Berlin",    avatar:"SV", color:"#5E8A6E", status:"active",   balance:8400,  paid:22400, invoices:14 },
  { id:"2", name:"Maison Fontaine",    email:"contact@maison-f.fr",    country:"FR", city:"Paris",     avatar:"MF", color:"#8A6E5E", status:"overdue",  balance:3200,  paid:18600, invoices:9  },
  { id:"3", name:"Bianchi & Co.",      email:"m.bianchi@bianchico.it", country:"IT", city:"Milan",     avatar:"BC", color:"#6E7A8A", status:"active",   balance:0,     paid:31200, invoices:18 },
  { id:"4", name:"Nord Digital AS",    email:"hi@norddigital.se",      country:"SE", city:"Stockholm", avatar:"ND", color:"#5E6A8A", status:"prospect", balance:0,     paid:0,     invoices:0  },
];

var MOCK_INVOICES = [
  { id:"1", client_id:"1", inv_number:"DE-2026-0437", issue_date:"2026-04-30", due_date:"2026-05-15", status:"sent",    amount_gross:4200, currency:"EUR" },
  { id:"2", client_id:"2", inv_number:"FR-2026-0021", issue_date:"2025-12-01", due_date:"2026-01-14", status:"overdue", amount_gross:3200, currency:"EUR" },
  { id:"3", client_id:"3", inv_number:"IT-2026-0019", issue_date:"2026-03-15", due_date:"2026-04-12", status:"paid",    amount_gross:8400, currency:"EUR" },
  { id:"4", client_id:"1", inv_number:"DE-2026-0436", issue_date:"2026-03-01", due_date:"2026-03-28", status:"paid",    amount_gross:2100, currency:"EUR" },
];

var MOCK_PROPOSALS = [
  { id:"1", client_id:"1", title:"Brand Identity — TechFlow",   status:"won",      value:8400,  sent_at:"2026-04-12", view_count:4,  last_viewed:"2 days ago",  days_since:23 },
  { id:"2", client_id:"4", title:"App UI Kit + Design System",  status:"sent",     value:12000, sent_at:"2026-04-28", view_count:2,  last_viewed:"3 days ago",  days_since:3  },
  { id:"3", client_id:"3", title:"Pitch Deck — Series A",       status:"viewed",   value:2800,  sent_at:"2026-04-22", view_count:7,  last_viewed:"6 hours ago", days_since:0  },
  { id:"4", client_id:"2", title:"Website Redesign",            status:"declined", value:6500,  sent_at:"2026-03-05", view_count:1,  last_viewed:"8 Mar",       days_since:63 },
];

var MOCK_BRAND_KITS = [
  { id:"1", name:"Daniel Speder",  primary_color:"#C8502A", font:"Playfair Display",   logo_text:"DS" },
  { id:"2", name:"Nord Creative",  primary_color:"#2A5E9A", font:"DM Sans",            logo_text:"NC" },
  { id:"3", name:"Bianchi Studio", primary_color:"#2A7A54", font:"Cormorant Garamond", logo_text:"B"  },
];

var SPARK_REV  = [5200,6800,5900,7400,6200,8100,7800,9960];
var SPARK_PAID = [4800,6100,5200,6900,5800,7200,6900,8400];
var SPARK_FLAT = [3200,3100,3300,3200,3100,3200,3250,3200];

// ── Micro sparkline ───────────────────────────────────────────────────────────
function Spark(props) {
  var data = props.data || [];
  var color = props.color || C.accent;
  var w = props.w || 64;
  var h = props.h || 22;
  if (data.length < 2) return null;
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function(v, i) {
    return (i / (data.length - 1)) * w + "," + (h - ((v - min) / range) * (h - 4) - 2);
  });
  var fill = pts.join(" L") + " L" + w + "," + h + " L0," + h + " Z";
  return (
    <svg width={w} height={h} viewBox={"0 0 " + w + " " + h} fill="none" style={{ display:"block", opacity:0.85 }}>
      <defs>
        <linearGradient id={"g"+w+color.slice(1,4)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={"M" + fill} fill={"url(#g"+w+color.slice(1,4)+")"} />
      <path d={"M" + pts.join(" L")} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Chip(props) {
  var color = props.color || C.muted;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontFamily:fMono, fontSize:10, color:color, background:color+"12", borderRadius:4, padding:"3px 7px", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
      {props.dot && <span style={{ width:4, height:4, borderRadius:"50%", background:color, flexShrink:0 }} />}
      {props.children}
    </span>
  );
}

function Label(props) {
  return (
    <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint, marginBottom:props.mb !== undefined ? props.mb : 10 }}>
      {props.children}
    </div>
  );
}

// ── Stat card — borderless, shadow-only separation ────────────────────────────
export function StatCard(props) {
  return (
    <div style={{ background:C.surface, borderRadius:16, padding:"20px 20px 16px", boxShadow:"0 1px 4px rgba(10,22,40,0.06)", minWidth:0, overflow:"hidden" }}>
      <Label mb={12}>{props.label}</Label>
      <div style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:props.color || C.ink, letterSpacing:"-0.035em", lineHeight:1, marginBottom:10 }}>{props.value}</div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6 }}>
        {props.sub && <div style={{ fontFamily:fUI, fontSize:12, color:props.subColor || C.faint, lineHeight:1.4, flexShrink:1, minWidth:0 }}>{props.sub}</div>}
        {props.spark && <div style={{ flexShrink:0 }}><Spark data={props.spark} color={props.sparkColor || C.accent} w={56} h={22} /></div>}
      </div>
    </div>
  );
}

// ── Attention card ────────────────────────────────────────────────────────────
function AttentionCard(props) {
  var item = props.item;
  var onDismiss = props.onDismiss;
  var tc = {
    overdue:  { bg:C.redSoft,   color:C.red,   icon:"clock",    label:"Overdue"       },
    followup: { bg:C.goldSoft,  color:C.gold,  icon:"send",     label:"Follow up"     },
    viewed:   { bg:C.blueSoft,  color:C.blue,  icon:"eye",      label:"Signal"        },
    won:      { bg:C.greenSoft, color:C.green, icon:"check",    label:"Won"           },
    payment:  { bg:C.greenSoft, color:C.green, icon:"bank",     label:"Payment"       },
  };
  var t = tc[item.type] || tc.followup;
  return (
    <div style={{
      background:C.surface,
      borderRadius:18,
      padding:"22px 22px 20px",
      boxShadow:"0 2px 12px rgba(10,22,40,0.06)",
      transition:"transform 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={function(e){ e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,22,40,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={function(e){ e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,22,40,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={t.icon} size={15} color={t.color} />
          </div>
          <span style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:t.color }}>{t.label}</span>
        </div>
        <button onClick={onDismiss} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:16, lineHeight:1, padding:"2px 4px", marginTop:-2, opacity:0.6 }}>×</button>
      </div>
      <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, lineHeight:1.35, marginBottom:8 }}>{item.title}</div>
      <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, lineHeight:1.6, marginBottom:20 }}>{item.desc}</div>
      <button style={{
        background:t.color+"EE", color:"#fff", border:"none",
        padding:"10px 18px", borderRadius:9, cursor:"pointer",
        fontFamily:fUI, fontSize:13, fontWeight:500,
        width:"100%", letterSpacing:"-0.01em",
        boxShadow:"0 2px 8px " + t.color + "30",
      }}>{item.cta}</button>
    </div>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
export function Dashboard(props) {
  var setPage = props.setPage;
  var setConvertProposal = props.setConvertProposal;
  var user = props.user;
  var userId = user ? user.id : null;
  var [section, setSection] = useState("overview");
  var [clientId, setClientId] = useState(null);

  var nav = [
    { id:"overview",  label:"Overview",  icon:"overview"  },
    { id:"clients",   label:"Clients",   icon:"users"     },
    { id:"invoices",  label:"Invoices",  icon:"document"  },
    { id:"proposals", label:"Proposals", icon:"proposal"  },
    { id:"brandkits", label:"Brand Kits",icon:"brand"     },
  ];

  function handleConvert(proposal) {
    if (setConvertProposal) setConvertProposal(proposal);
    if (setPage) setPage("Generator");
  }

  var selectedClient = MOCK_CLIENTS.find(function(c){ return c.id === clientId; }) || null;

  function goSection(id) { setSection(id); setClientId(null); }

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 58px)", background:C.bg }}>

      {/* ── Sidebar ── */}
      <div className="nav-desktop" style={{ width:216, background:C.navy, flexShrink:0, display:"flex", flexDirection:"column", position:"sticky", top:58, height:"calc(100vh - 58px)" }}>
        <div style={{ padding:"32px 16px 24px" }}>
          <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(240,244,248,0.18)", marginBottom:24, paddingLeft:12 }}>Workspace</div>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 12px",
                borderRadius:10, border:"none", marginBottom:1, cursor:"pointer",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                color: active ? C.navyActive : C.navyItem,
                fontFamily:fUI, fontSize:14, fontWeight:active ? 500 : 400,
                transition:"all 0.14s", textAlign:"left",
              }}
              onMouseEnter={function(e){ if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={function(e){ if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon name={item.icon} size={14} color={active ? C.accent : "rgba(240,244,248,0.25)"} />
                {item.label}
                {active && <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:C.accent, flexShrink:0 }} />}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1 }} />
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(20,153,144,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:C.accent, fontWeight:700, flexShrink:0 }}>
              {user && user.email ? user.email[0].toUpperCase() : "D"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:fUI, fontSize:12, color:"rgba(240,244,248,0.5)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user && user.email ? user.email : "demo@invoice-ai.de"}
              </div>
              <div style={{ fontFamily:fMono, fontSize:9, color:"rgba(240,244,248,0.18)", letterSpacing:"0.06em", marginTop:2 }}>Studio plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"44px 48px", minWidth:0 }} className="dash-main">
        {section==="overview"  && <DOverview setSection={goSection} user={user} />}
        {section==="clients"   && !clientId && <DClients setClientId={setClientId} setPage={setPage} />}
        {section==="clients"   && clientId && selectedClient && <DClientDetail client={selectedClient} setClientId={setClientId} invoices={MOCK_INVOICES} proposals={MOCK_PROPOSALS} />}
        {section==="invoices"  && <DInvoices />}
        {section==="proposals" && <DProposals onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits />}
      </div>

      {/* ── Mobile bottom nav ── */}
      <div className="nav-burger" style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:C.navy, borderTop:"1px solid rgba(255,255,255,0.05)", padding:"10px 0 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"4px 10px", cursor:"pointer" }}>
                <Icon name={item.icon} size={19} color={active ? C.accent : "rgba(240,244,248,0.25)"} />
                <span style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.06em", color:active ? C.accent : "rgba(240,244,248,0.25)", textTransform:"uppercase" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function DOverview(props) {
  var setSection = props.setSection;
  var user = props.user;
  var now = new Date();
  var hour = now.getHours();
  var greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  var firstName = user && user.email ? user.email.split("@")[0].split(".")[0] : null;
  var greetingFull = firstName ? greeting + ", " + firstName[0].toUpperCase() + firstName.slice(1) + "." : greeting + ".";
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateStr = days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear();

  var [dismissed, setDismissed] = useState([]);
  var allAttention = [
    { id:0, type:"viewed",   title:"Pitch Deck viewed 7 times",        desc:"Bianchi & Co. opened your proposal 7 times with no reply. This is a strong buying signal — a short follow-up now doubles close rates.", cta:"Send follow-up" },
    { id:1, type:"overdue",  title:"Invoice overdue · FR-2026-0021",   desc:"Maison Fontaine · €3,200 · Due 14 Jan. EU late payment interest applies from day one — you're entitled to 8% above ECB rate.",          cta:"Send reminder"  },
    { id:2, type:"followup", title:"App UI Kit — no reply in 3 days",  desc:"Nord Digital AS opened your proposal twice. A brief check-in typically increases reply rates by over 40%.",                             cta:"Follow up now"  },
  ];
  var attention = allAttention.filter(function(a){ return dismissed.indexOf(a.id) < 0; });

  var activity = [
    { icon:"document", color:C.blue,  label:"Invoice sent",      client:"Studio Verde GmbH", detail:"DE-2026-0437 · €4,200",   time:"2h ago"    },
    { icon:"check",    color:C.green, label:"Proposal accepted", client:"Maison Fontaine",   detail:"Brand Identity · €8,400",  time:"Yesterday" },
    { icon:"clock",    color:C.red,   label:"Invoice overdue",   client:"Bianchi & Co.",     detail:"IT-2026-007 · €3,200",     time:"16d ago"   },
    { icon:"eye",      color:C.gold,  label:"Proposal viewed",   client:"Nord Digital AS",   detail:"App Design · 2 views",     time:"3d ago"    },
  ];

  return (
    <div style={{ width:"100%", minWidth:0 }}>
      {/* Greeting */}
      <div style={{ marginBottom:44 }}>
        <h1 style={{ fontFamily:fSerif, fontSize:"clamp(30px,3.5vw,42px)", fontWeight:400, color:C.ink, letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:10 }}>{greetingFull}</h1>
        <p style={{ fontFamily:fMono, fontSize:11, color:C.faint, letterSpacing:"0.05em" }}>{dateStr} · 4 clients · 1 overdue</p>
      </div>

      {/* Main grid */}
      <div className="dash-overview-grid" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:24, marginBottom:0 }}>

        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>

          {/* KPI — 2x2 borderless cards */}
          <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <StatCard label="Revenue · May" value="€14,280" sub="↑ +18% vs April" subColor={C.green} spark={SPARK_REV} sparkColor={C.accent} />
            <StatCard label="Outstanding" value="€4,320" sub="4 overdue invoices" subColor={C.red} spark={SPARK_FLAT} sparkColor={C.red} />
          </div>
          <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <StatCard label="Collected · May" value="€9,960" sub="↑ +24% vs April" subColor={C.green} spark={SPARK_PAID} sparkColor={C.green} />
            <StatCard label="Open proposals" value="6" sub="2 awaiting reply" subColor={C.gold} />
          </div>

          {/* Activity feed — no border, shadow only */}
          <div style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
            <div style={{ padding:"22px 24px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, letterSpacing:"-0.01em" }}>Recent activity</span>
              <button onClick={function(){ setSection("invoices"); }} style={{ background:"none", border:"none", fontFamily:fMono, fontSize:10, color:C.accent, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>All →</button>
            </div>
            {activity.map(function(a, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 24px", background:i%2===1 ? C.surfaceAlt : "transparent" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:a.color+"10", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={a.icon} size={13} color={a.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:13, fontWeight:500, color:C.ink }}>{a.label}</div>
                    <div style={{ fontFamily:fUI, fontSize:12, color:C.muted, fontWeight:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.client} · {a.detail}</div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:10, color:C.faint, flexShrink:0 }}>{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — attention */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, letterSpacing:"-0.01em" }}>Needs attention</span>
            {attention.length > 0 && (
              <span style={{ fontFamily:fMono, fontSize:10, color:C.red, background:C.redSoft, borderRadius:4, padding:"2px 7px", letterSpacing:"0.04em" }}>{attention.length}</span>
            )}
          </div>
          {attention.map(function(item) {
            return (
              <AttentionCard key={item.id} item={item} onDismiss={function(){
                setDismissed(function(d){ return d.concat([item.id]); });
              }} />
            );
          })}
          {attention.length === 0 && (
            <div style={{ background:C.surface, borderRadius:18, padding:"36px 24px", textAlign:"center", boxShadow:"0 1px 6px rgba(10,22,40,0.04)" }}>
              <div style={{ fontSize:24, marginBottom:10 }}>✓</div>
              <div style={{ fontFamily:fUI, fontSize:15, color:C.ink, fontWeight:500, marginBottom:5 }}>All clear.</div>
              <div style={{ fontFamily:fUI, fontSize:13, color:C.faint, fontWeight:300 }}>Nothing needs your attention right now.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader(props) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32, gap:14, flexWrap:"wrap" }}>
      <div style={{ minWidth:0 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:C.ink, letterSpacing:"-0.03em", marginBottom:6 }}>{props.title}</h2>
        {props.sub && <p style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, lineHeight:1.5 }}>{props.sub}</p>}
      </div>
      {props.action && <div style={{ flexShrink:0 }}>{props.action}</div>}
    </div>
  );
}

// ── Soft CTA button ───────────────────────────────────────────────────────────
function Btn(props) {
  var variant = props.variant || "primary";
  var styles = {
    primary:   { background:C.accent, color:"#fff",  border:"none",                       shadow:"0 2px 10px rgba(20,153,144,0.2)" },
    secondary: { background:"transparent", color:C.muted, border:"1px solid "+C.border,   shadow:"none" },
    danger:    { background:C.red,    color:"#fff",  border:"none",                        shadow:"0 2px 8px rgba(201,72,64,0.18)" },
    ghost:     { background:C.accentSoft, color:C.accent, border:"none",                  shadow:"none" },
  };
  var s = styles[variant] || styles.primary;
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{
      background:s.background, color:s.color, border:s.border,
      padding: props.sm ? "6px 12px" : "9px 18px",
      borderRadius:8, cursor:"pointer",
      fontFamily:fUI, fontSize: props.sm ? 12 : 13, fontWeight:500,
      whiteSpace:"nowrap", boxShadow:s.shadow,
      transition:"opacity 0.12s",
      opacity: props.disabled ? 0.5 : 1,
      letterSpacing:"-0.01em",
    }}>{props.children}</button>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function DClients(props) {
  var setClientId = props.setClientId;
  var setPage = props.setPage;
  var [search, setSearch] = useState("");
  var stColor = { active:C.green, overdue:C.red, prospect:C.blue };
  var flags = { DE:"🇩🇪", FR:"🇫🇷", IT:"🇮🇹", SE:"🇸🇪" };
  var filtered = MOCK_CLIENTS.filter(function(c){
    return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 || (c.city && c.city.toLowerCase().indexOf(search.toLowerCase()) >= 0);
  });

  return (
    <div>
      <SectionHeader title="Clients" sub="Your active client relationships." action={
        <Btn onClick={function(){ if (setPage) setPage("Generator"); }}>+ New invoice</Btn>
      } />
      <div style={{ position:"relative", marginBottom:24 }}>
        <input value={search} onChange={function(e){ setSearch(e.target.value); }} placeholder="Search clients…" style={{ width:"100%", boxSizing:"border-box", border:"none", borderRadius:12, padding:"11px 14px 11px 40px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.surface, outline:"none", boxShadow:"0 1px 4px rgba(10,22,40,0.06)" }} />
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="users" size={14} color={C.faint} /></div>
      </div>
      <div style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
        {filtered.map(function(c, i) {
          var sc = stColor[c.status] || C.muted;
          return (
            <div key={c.id} onClick={function(){ setClientId(c.id); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", borderBottom:i<filtered.length-1 ? "1px solid "+C.borderLt : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = C.bg; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width:40, height:40, borderRadius:12, background:c.color+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:c.color, fontWeight:700, flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, marginBottom:2 }}>{c.name}</div>
                <div style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{flags[c.country]||""} {c.city} · {c.invoices} invoice{c.invoices!==1?"s":""}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginRight:8 }}>
                {c.balance > 0 && <div style={{ fontFamily:fMono, fontSize:12, color:C.red, fontWeight:500 }}>{"€"+c.balance.toLocaleString()}</div>}
                <div style={{ fontFamily:fMono, fontSize:11, color:C.faint, marginTop:2 }}>{"€"+c.paid.toLocaleString()+" paid"}</div>
              </div>
              <Chip color={sc} dot={true}>{c.status}</Chip>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:"48px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>No clients match "{search}"</div>
        )}
      </div>
    </div>
  );
}

function DClientDetail(props) {
  var c = props.client;
  var setClientId = props.setClientId;
  var clientInvoices = (props.invoices || []).filter(function(i){ return i.client_id === c.id; });
  var clientProposals = (props.proposals || []).filter(function(p){ return p.client_id === c.id; });
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red, draft:C.muted };
  var pColors = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };
  return (
    <div>
      <button onClick={function(){ setClientId(null); }} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontFamily:fMono, fontSize:11, letterSpacing:"0.06em", marginBottom:28, padding:0, display:"flex", alignItems:"center", gap:6 }}>← All clients</button>
      <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:36 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:c.color+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:17, color:c.color, fontWeight:700 }}>{c.avatar}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:26, fontWeight:400, color:C.ink, letterSpacing:"-0.025em", marginBottom:3 }}>{c.name}</h2>
          <p style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{c.country} · {c.city}</p>
        </div>
      </div>
      <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
        <StatCard label="Total Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance > 0 ? C.red : C.green} />
        <StatCard label="Invoices" value={String(c.invoices)} />
      </div>
      {clientInvoices.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", marginBottom:16, boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
          <div style={{ padding:"18px 22px 14px" }}><Label mb={0}>Invoices</Label></div>
          {clientInvoices.map(function(inv, i) {
            return (
              <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 22px", borderTop:"1px solid "+C.borderLt }}>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.ink, flex:1 }}>{inv.inv_number}</div>
                <div style={{ fontFamily:fMono, fontSize:14, color:C.ink, fontWeight:500 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <Chip color={stColor[inv.status]||C.muted} dot={true}>{inv.status}</Chip>
              </div>
            );
          })}
        </div>
      )}
      {clientProposals.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
          <div style={{ padding:"18px 22px 14px" }}><Label mb={0}>Proposals</Label></div>
          {clientProposals.map(function(p, i) {
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 22px", borderTop:"1px solid "+C.borderLt }}>
                <div style={{ flex:1, fontFamily:fUI, fontSize:13, color:C.ink }}>{p.title}</div>
                <div style={{ fontFamily:fMono, fontSize:13, color:C.ink, fontWeight:500 }}>{"€"+p.value.toLocaleString()}</div>
                <Chip color={pColors[p.status]||C.muted} dot={true}>{p.status}</Chip>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Invoices ──────────────────────────────────────────────────────────────────
function DInvoices() {
  var [filter, setFilter] = useState("all");
  var [toasts, setToasts] = useState({});
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red, draft:C.muted };
  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });
  var filtered = MOCK_INVOICES.filter(function(inv){
    if (filter === "outstanding") return inv.status === "sent" || inv.status === "overdue";
    if (filter === "paid") return inv.status === "paid";
    return true;
  });
  var outstanding = MOCK_INVOICES.filter(function(i){ return i.status==="sent"||i.status==="overdue"; }).reduce(function(s,i){ return s+i.amount_gross; },0);

  function act(invId, type) {
    setToasts(function(s){ return Object.assign({}, s, { [invId]: type }); });
    setTimeout(function(){ setToasts(function(s){ var n=Object.assign({},s); delete n[invId]; return n; }); }, 3000);
  }

  return (
    <div>
      <SectionHeader title="Invoices" sub="A calm view of what's sent, pending, and settled." action={
        outstanding > 0 ? (
          <div style={{ background:C.redSoft, borderRadius:10, padding:"9px 14px", display:"flex", alignItems:"center", gap:7 }}>
            <Icon name="clock" size={12} color={C.red} />
            <span style={{ fontFamily:fMono, fontSize:11, color:C.red, letterSpacing:"0.04em" }}>{"€"+outstanding.toLocaleString()+" outstanding"}</span>
          </div>
        ) : null
      } />

      {/* Filter tabs — borderless pill style */}
      <div style={{ display:"flex", gap:2, background:C.surface, borderRadius:11, padding:"3px", width:"fit-content", marginBottom:28, boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
        {[["all","All"],["outstanding","Outstanding"],["paid","Paid"]].map(function(pair) {
          var active = filter === pair[0];
          return (
            <button key={pair[0]} onClick={function(){ setFilter(pair[0]); }} style={{ background:active ? C.bg : "transparent", color:active ? C.ink : C.muted, border:"none", padding:"7px 18px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:active ? 500 : 400, transition:"all 0.12s" }}>
              {pair[1]}
            </button>
          );
        })}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {filtered.map(function(inv) {
          var isOverdue = inv.status === "overdue";
          var sc = stColor[inv.status] || C.muted;
          var toast = toasts[inv.id];
          var clientName = clientMap[inv.client_id] || "Unknown";
          return (
            <div key={inv.id} style={{ background:C.surface, borderRadius:14, overflow:"hidden", boxShadow:isOverdue ? "0 0 0 1px "+C.red+"18, 0 2px 8px rgba(10,22,40,0.04)" : "0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", flexWrap:"wrap", background:isOverdue ? C.redSoft : "transparent" }}>
                {/* Invoice number */}
                <div style={{ fontFamily:fMono, fontSize:12, color:isOverdue ? C.red : C.inkLight, letterSpacing:"0.02em", flexShrink:0, width:130 }}>{inv.inv_number}</div>
                {/* Client + status */}
                <div style={{ flex:1, minWidth:120 }}>
                  <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>{clientName}</div>
                  {isOverdue && <div style={{ fontFamily:fMono, fontSize:10, color:C.red, marginTop:2, letterSpacing:"0.04em" }}>{"Due "+inv.due_date}</div>}
                </div>
                {/* Amount + chip + actions */}
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:fMono, fontSize:14, color:C.ink, fontWeight:600 }}>{"€"+inv.amount_gross.toLocaleString()}</span>
                  <Chip color={sc} dot={true}>{inv.status}</Chip>
                  {isOverdue && <Btn variant="danger" sm={true} onClick={function(){ act(inv.id, "reminder"); }}>Remind</Btn>}
                  {inv.status === "sent" && <Btn variant="ghost" sm={true} onClick={function(){ act(inv.id, "followup"); }}>Follow up</Btn>}
                  {inv.status === "paid" && <span style={{ fontFamily:fMono, fontSize:11, color:C.green }}>✓ Settled</span>}
                </div>
              </div>
              {toast && (
                <div style={{ padding:"10px 20px 12px", background:toast==="reminder" ? C.redSoft : C.accentSoft }}>
                  <div style={{ fontFamily:fUI, fontSize:13, color:C.ink, fontWeight:500 }}>
                    {toast==="reminder" ? "Reminder sent to " + clientName : "Follow-up sent"}
                  </div>
                  <div style={{ fontFamily:fMono, fontSize:10, color:C.muted, marginTop:3, letterSpacing:"0.03em" }}>
                    {toast==="reminder" ? "EU Dir. 2011/7/EU · late payment interest referenced" : "Friendly check-in for "+inv.inv_number}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ background:C.surface, borderRadius:14, padding:"52px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>Nothing here.</div>
        )}
      </div>
    </div>
  );
}

// ── Proposals — operational intelligence layer ────────────────────────────────
export function DProposals(props) {
  var onConvert = props.onConvert;
  var [view, setView] = useState("list");
  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });
  var stColor = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };

  var won = MOCK_PROPOSALS.filter(function(p){ return p.status==="won"; }).length;
  var sent = MOCK_PROPOSALS.filter(function(p){ return p.status!=="draft"; }).length;
  var winRate = sent > 0 ? Math.round(won/sent*100) : 0;
  var pipeline = [
    { status:"sent",     label:"Sent",     color:C.blue  },
    { status:"viewed",   label:"Viewed",   color:C.gold  },
    { status:"won",      label:"Won",      color:C.green },
    { status:"declined", label:"Declined", color:C.muted },
  ];

  function signal(p) {
    if (p.status === "viewed" && p.view_count >= 5) return { msg:"Viewed "+p.view_count+" times — strong buying signal.", urgent:true };
    if ((p.status === "sent" || p.status === "viewed") && p.days_since >= 3) return { msg:"No reply in "+p.days_since+" days. A short follow-up now.", urgent:false };
    return null;
  }

  return (
    <div>
      <SectionHeader title="Proposals" sub="Workflow intelligence — know when to act." action={
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ background:C.greenSoft, borderRadius:9, padding:"8px 14px" }}>
            <span style={{ fontFamily:fMono, fontSize:11, color:C.green, letterSpacing:"0.04em" }}>Win rate {winRate}%</span>
          </div>
          <div style={{ display:"flex", gap:1, background:C.surface, borderRadius:9, padding:"3px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
            {[["list","List"],["pipeline","Pipeline"]].map(function(pair) {
              var active = view === pair[0];
              return <button key={pair[0]} onClick={function(){ setView(pair[0]); }} style={{ background:active ? C.bg : "transparent", color:active ? C.ink : C.muted, border:"none", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontFamily:fMono, fontSize:11, fontWeight:active ? 500 : 400, transition:"all 0.12s" }}>{pair[1]}</button>;
            })}
          </div>
        </div>
      } />

      {view === "list" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {MOCK_PROPOSALS.map(function(p) {
            var sc = stColor[p.status] || C.muted;
            var sig = signal(p);
            var isWon = p.status === "won";
            return (
              <div key={p.id} style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"20px 22px", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, marginBottom:5, lineHeight:1.3 }}>{p.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:fUI, fontSize:12, color:C.muted }}>{clientMap[p.client_id]||"Unknown"}</span>
                      <span style={{ color:C.borderLt }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{p.view_count} views</span>
                      <span style={{ color:C.borderLt }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>seen {p.last_viewed}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", flexShrink:0, paddingTop:2 }}>
                    <span style={{ fontFamily:fMono, fontSize:14, color:C.ink, fontWeight:600 }}>{"€"+p.value.toLocaleString()}</span>
                    <Chip color={sc} dot={true}>{p.status}</Chip>
                    <Btn variant="secondary" sm={true}>Duplicate</Btn>
                    {isWon && <Btn variant="ghost" sm={true} onClick={function(){ if(onConvert) onConvert(p); }}>→ Invoice</Btn>}
                  </div>
                </div>
                {sig && (
                  <div style={{ margin:"0 16px 16px", padding:"13px 16px", background:sig.urgent ? C.goldSoft : C.accentSoft, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
                      <Icon name={sig.urgent ? "eye" : "send"} size={13} color={sig.urgent ? C.gold : C.accent} />
                      <span style={{ fontFamily:fUI, fontSize:13, color:C.inkLight, lineHeight:1.4 }}>{sig.msg}</span>
                    </div>
                    <Btn variant={sig.urgent ? "secondary" : "ghost"} sm={true}>Follow up</Btn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "pipeline" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14 }}>
          {pipeline.map(function(col) {
            var items = MOCK_PROPOSALS.filter(function(p){ return p.status===col.status; });
            var total = items.reduce(function(s,p){ return s+p.value; },0);
            return (
              <div key={col.status}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:col.color }} />
                    <span style={{ fontFamily:fMono, fontSize:10, color:C.muted, letterSpacing:"0.07em", textTransform:"uppercase" }}>{col.label}</span>
                  </div>
                  {total > 0 && <span style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{"€"+total.toLocaleString()}</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {items.map(function(p) {
                    return (
                      <div key={p.id} style={{ background:C.surface, borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
                        <div style={{ fontFamily:fUI, fontSize:13, fontWeight:500, color:C.ink, marginBottom:4, lineHeight:1.3 }}>{p.title}</div>
                        <div style={{ fontFamily:fUI, fontSize:12, color:C.muted, marginBottom:10 }}>{clientMap[p.client_id]||""}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontFamily:fMono, fontSize:12, color:col.color, fontWeight:500 }}>{"€"+p.value.toLocaleString()}</span>
                          <span style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{p.view_count}v</span>
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && (
                    <div style={{ background:C.surfaceAlt, borderRadius:12, padding:"22px 16px", textAlign:"center", fontFamily:fUI, fontSize:13, color:C.faint, fontWeight:300 }}>—</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Brand Kits ────────────────────────────────────────────────────────────────
export function DBrandKits() {
  var [kits, setKits] = useState(MOCK_BRAND_KITS);
  var [selId, setSelId] = useState(kits[0] ? kits[0].id : null);
  var sel = kits.find(function(k){ return k.id===selId; }) || null;
  var [editName, setEditName] = useState(sel ? sel.name : "");
  var [editColor, setEditColor] = useState(sel ? sel.primary_color : "#17A99E");
  var [editFont, setEditFont] = useState(sel ? sel.font : "DM Sans");
  var [saved, setSaved] = useState(false);

  useEffect(function() {
    if (sel) { setEditName(sel.name); setEditColor(sel.primary_color); setEditFont(sel.font||"DM Sans"); }
  }, [selId]);

  function save() {
    setKits(function(prev){ return prev.map(function(k){ return k.id===selId ? Object.assign({},k,{ name:editName, primary_color:editColor, font:editFont }) : k; }); });
    setSaved(true);
    setTimeout(function(){ setSaved(false); }, 2000);
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"none", borderRadius:9, padding:"10px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
  var lbl = { display:"block", marginBottom:5, fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint };

  return (
    <div>
      <SectionHeader title="Brand Kits" sub="One kit per client — applied automatically to every invoice and proposal." />
      <div className="dash-brandkit-grid" style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:20 }}>
        {/* Kit list */}
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {kits.map(function(kit) {
            var active = selId === kit.id;
            return (
              <div key={kit.id} onClick={function(){ setSelId(kit.id); }} style={{ background:active ? C.surface : "transparent", borderRadius:12, padding:"11px 13px", cursor:"pointer", transition:"all 0.12s", boxShadow:active ? "0 1px 6px rgba(10,22,40,0.08)" : "none", outline:active ? "1.5px solid "+C.accent+"40" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:kit.primary_color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:"#fff", fontWeight:700, flexShrink:0 }}>{kit.logo_text}</div>
                  <div style={{ fontFamily:fUI, fontSize:13, fontWeight:active?500:400, color:active?C.ink:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button onClick={function(){
            var id = String(Date.now());
            setKits(function(prev){ return prev.concat([{ id:id, name:"New Kit", primary_color:C.accent, font:"DM Sans", logo_text:"NK" }]); });
            setSelId(id);
          }} style={{ background:"none", border:"1.5px dashed "+C.border, borderRadius:12, padding:"11px 13px", cursor:"pointer", color:C.faint, fontFamily:fUI, fontSize:13, textAlign:"left" }}>+ New Kit</button>
        </div>

        {sel && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:C.surface, borderRadius:16, padding:"24px 26px", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
              <Label>Editing — {sel.name}</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                <div><label style={lbl}>Brand name</label><input value={editName} onChange={function(e){ setEditName(e.target.value); }} style={inp} /></div>
                <div>
                  <label style={lbl}>Primary color</label>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <input type="color" value={editColor} onChange={function(e){ setEditColor(e.target.value); }} style={{ width:38, height:36, border:"none", borderRadius:7, cursor:"pointer", padding:2, background:"none" }} />
                    <span style={{ fontFamily:fMono, fontSize:12, color:C.muted }}>{editColor}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={lbl}>Font</label>
                <select value={editFont} onChange={function(e){ setEditFont(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {["DM Sans","DM Serif Display","DM Mono","Playfair Display","Cormorant Garamond","Inter"].map(function(f){ return <option key={f} value={f}>{f}</option>; })}
                </select>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={save} variant={saved ? "secondary" : "primary"}>{saved ? "✓ Saved" : "Save kit"}</Btn>
                <Btn variant="secondary">Apply to all invoices</Btn>
              </div>
            </div>

            {/* Live preview — no border */}
            <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
              <div style={{ padding:"16px 22px 12px" }}><Label mb={0}>Preview</Label></div>
              <div style={{ padding:"20px 24px 24px", background:C.bg }}>
                <div style={{ background:"#fff", borderRadius:14, padding:"22px 24px", maxWidth:340, boxShadow:"0 2px 16px rgba(10,22,40,0.08)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:editColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:12, color:"#fff", fontWeight:700 }}>{sel.logo_text||editName[0]||"B"}</div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:fMono, fontSize:9, color:C.faint, letterSpacing:"0.12em", textTransform:"uppercase" }}>Invoice</div>
                      <div style={{ fontFamily:fMono, fontSize:13, color:C.ink, fontWeight:500, marginTop:2 }}>DE-2026-001</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'"+editFont+"', sans-serif", fontSize:16, fontWeight:700, color:C.ink, marginBottom:2 }}>{editName}</div>
                  <div style={{ fontFamily:fUI, fontSize:11, color:C.faint, marginBottom:18 }}>yourname@studio.com</div>
                  <div style={{ borderTop:"2px solid "+editColor, paddingTop:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted, marginBottom:7 }}><span>Brand Identity</span><span style={{ color:C.ink, fontWeight:500 }}>€1,800</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted }}><span>Logo Design</span><span style={{ color:C.ink, fontWeight:500 }}>€2,400</span></div>
                    <div style={{ borderTop:"1px solid "+C.borderLt, marginTop:12, paddingTop:12, display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:13, fontWeight:700, color:C.ink }}><span>Total</span><span style={{ color:editColor }}>€4,998</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
