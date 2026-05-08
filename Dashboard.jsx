import { useState, useEffect, useCallback } from "react";
import { L, fSans, fMono, fSerif, Icon, LogoMark } from "./constants.jsx";

// ── Design tokens ─────────────────────────────────────────────────────────────
var C = {
  bg:         "#F4F3F0",
  surface:    "#FFFFFF",
  surfaceAlt: "#FAFAF8",
  navy:       "#081120",
  navyItem:   "rgba(240,244,248,0.4)",
  navyActive: "#FFFFFF",
  accent:     "#149990",
  accentSoft: "rgba(20,153,144,0.07)",
  accentMid:  "rgba(20,153,144,0.14)",
  green:      "#1A9E6B",
  greenSoft:  "rgba(26,158,107,0.07)",
  red:        "#C94840",
  redSoft:    "rgba(201,72,64,0.06)",
  gold:       "#A07830",
  goldSoft:   "rgba(160,120,48,0.07)",
  blue:       "#3460C0",
  blueSoft:   "rgba(52,96,192,0.07)",
  ink:        "#0C1A2E",
  inkLight:   "#3A4A5E",
  muted:      "#7A8490",
  faint:      "#B0B8C0",
  border:     "#E6E4DF",
  borderLt:   "#EFEDE8",
};

var fUI = "'DM Sans', sans-serif";

// ── Supabase hook ─────────────────────────────────────────────────────────────
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
  function insert(p) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"insert", user_id:userId, payload:p }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  function update(id, p) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"update", id:id, user_id:userId, payload:p }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  function remove(id) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"delete", id:id, user_id:userId }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  return { rows:rows, loading:loading, error:error, refresh:fetch_, insert:insert, update:update, remove:remove };
}

// ── Mock data ─────────────────────────────────────────────────────────────────
var MOCK_CLIENTS = [
  { id:"1", name:"Studio Verde GmbH",  country:"DE", city:"Berlin",    avatar:"SV", color:"#5E8A6E", status:"active",   balance:8400,  paid:22400, invoices:14 },
  { id:"2", name:"Maison Fontaine",    country:"FR", city:"Paris",     avatar:"MF", color:"#8A6E5E", status:"overdue",  balance:3200,  paid:18600, invoices:9  },
  { id:"3", name:"Bianchi & Co.",      country:"IT", city:"Milan",     avatar:"BC", color:"#6E7A8A", status:"active",   balance:0,     paid:31200, invoices:18 },
  { id:"4", name:"Nord Digital AS",    country:"SE", city:"Stockholm", avatar:"ND", color:"#5E6A8A", status:"prospect", balance:0,     paid:0,     invoices:0  },
];

var MOCK_INVOICES = [
  { id:"1", client_id:"1", inv_number:"DE-2026-0437", due_date:"15 May", status:"sent",    amount_gross:4200 },
  { id:"2", client_id:"2", inv_number:"FR-2026-0021", due_date:"14 Jan", status:"overdue", amount_gross:3200 },
  { id:"3", client_id:"3", inv_number:"IT-2026-0019", due_date:"12 Apr", status:"paid",    amount_gross:8400 },
  { id:"4", client_id:"1", inv_number:"DE-2026-0436", due_date:"28 Mar", status:"paid",    amount_gross:2100 },
];

var MOCK_PROPOSALS = [
  { id:"1", client_id:"1", title:"Brand Identity — TechFlow",  status:"won",      value:8400,  view_count:4, days_since:23, last_viewed:"2d ago" },
  { id:"2", client_id:"4", title:"App UI Kit + Design System", status:"sent",     value:12000, view_count:2, days_since:3,  last_viewed:"3d ago" },
  { id:"3", client_id:"3", title:"Pitch Deck — Series A",      status:"viewed",   value:2800,  view_count:7, days_since:0,  last_viewed:"6h ago" },
  { id:"4", client_id:"2", title:"Website Redesign",           status:"declined", value:6500,  view_count:1, days_since:63, last_viewed:"8 Mar"  },
];

var MOCK_BRAND_KITS = [
  { id:"1", name:"Daniel Speder",  primary_color:"#C8502A", font:"Playfair Display",   logo_text:"DS" },
  { id:"2", name:"Nord Creative",  primary_color:"#2A5E9A", font:"DM Sans",            logo_text:"NC" },
  { id:"3", name:"Bianchi Studio", primary_color:"#2A7A54", font:"Cormorant Garamond", logo_text:"B"  },
];

var SPARK_UP   = [52,68,59,74,62,81,78,99];
var SPARK_DOWN = [72,61,69,58,72,60,69,43];
var SPARK_FLAT = [50,48,52,49,51,50,52,50];

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Spark(props) {
  var data = props.data || [];
  var color = props.color || C.accent;
  var w = props.w || 56; var h = props.h || 20;
  if (data.length < 2) return null;
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var rng = max - min || 1;
  var pts = data.map(function(v, i) { return (i/(data.length-1))*w + "," + (h - ((v-min)/rng)*(h-4) - 2); });
  return (
    <svg width={w} height={h} viewBox={"0 0 "+w+" "+h} fill="none" style={{ display:"block", opacity:0.8 }}>
      <defs>
        <linearGradient id={"g"+color.slice(1,5)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={"M"+pts.join(" L")+" L"+w+","+h+" L0,"+h+" Z"} fill={"url(#g"+color.slice(1,5)+")"} />
      <path d={"M"+pts.join(" L")} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Dot(props) {
  var color = props.color || C.muted;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:fMono, fontSize:10, color:color, letterSpacing:"0.04em", whiteSpace:"nowrap" }}><span style={{ width:4, height:4, borderRadius:"50%", background:color, flexShrink:0 }} />{props.children}</span>;
}

function Btn(props) {
  var v = props.variant || "primary";
  var S = {
    primary:   { bg:C.accent,    color:"#fff", border:"none",              shadow:"0 2px 8px rgba(20,153,144,0.18)" },
    secondary: { bg:"transparent", color:C.muted, border:"1px solid "+C.border, shadow:"none" },
    danger:    { bg:C.red,       color:"#fff", border:"none",              shadow:"0 2px 6px rgba(201,72,64,0.15)" },
    ghost:     { bg:C.accentSoft, color:C.accent, border:"none",           shadow:"none" },
  };
  var s = S[v] || S.primary;
  return (
    <button onClick={props.onClick} style={{ background:s.bg, color:s.color, border:s.border, padding:props.sm ? "6px 12px" : "10px 20px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:props.sm ? 12 : 13, fontWeight:500, whiteSpace:"nowrap", boxShadow:s.shadow, letterSpacing:"-0.01em", transition:"opacity 0.1s" }}>
      {props.children}
    </button>
  );
}

export function StatCard(props) {
  return (
    <div style={{ background:C.surface, borderRadius:16, padding:"22px 20px 18px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)", minWidth:0, overflow:"hidden" }}>
      <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint, marginBottom:14 }}>{props.label}</div>
      <div style={{ fontFamily:fSerif, fontSize:30, fontWeight:400, color:props.color||C.ink, letterSpacing:"-0.04em", lineHeight:1 }}>{props.value}</div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, marginTop:12 }}>
        {props.sub && <div style={{ fontFamily:fUI, fontSize:11, color:props.subColor||C.faint, lineHeight:1.4, flexShrink:1, minWidth:0 }}>{props.sub}</div>}
        {props.spark && <div style={{ flexShrink:0 }}><Spark data={props.spark} color={props.sparkColor||C.accent} /></div>}
      </div>
    </div>
  );
}

// ── Attention card — simplified, spacious ─────────────────────────────────────
function AttentionCard(props) {
  var item = props.item;
  var onDismiss = props.onDismiss;
  var tc = {
    overdue:  { color:C.red,   bg:C.redSoft,   icon:"clock", label:"Action needed" },
    followup: { color:C.gold,  bg:C.goldSoft,  icon:"send",  label:"Follow up"     },
    viewed:   { color:C.blue,  bg:C.blueSoft,  icon:"eye",   label:"Signal"        },
  };
  var t = tc[item.type] || tc.followup;
  return (
    <div style={{ background:C.surface, borderRadius:20, padding:"26px 24px 24px", boxShadow:"0 2px 16px rgba(10,22,40,0.07)", transition:"transform 0.15s" }}
      onMouseEnter={function(e){ e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={function(e){ e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={t.icon} size={14} color={t.color} />
          </div>
          <span style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:t.color }}>{t.label}</span>
        </div>
        <button onClick={onDismiss} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:18, lineHeight:1, padding:"0 2px", opacity:0.5 }}>×</button>
      </div>
      {/* Title large, desc quieter */}
      <div style={{ fontFamily:fUI, fontSize:16, fontWeight:600, color:C.ink, lineHeight:1.3, marginBottom:10 }}>{item.title}</div>
      <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, lineHeight:1.65, marginBottom:22 }}>{item.desc}</div>
      <Btn variant={item.type === "overdue" ? "danger" : "ghost"}>{item.cta}</Btn>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export function Dashboard(props) {
  var setPage = props.setPage;
  var setConvertProposal = props.setConvertProposal;
  var user = props.user;
  var [section, setSection] = useState("overview");
  var [clientId, setClientId] = useState(null);
  var nav = [
    { id:"overview",  label:"Overview",  icon:"overview"  },
    { id:"clients",   label:"Clients",   icon:"users"     },
    { id:"invoices",  label:"Invoices",  icon:"document"  },
    { id:"proposals", label:"Proposals", icon:"proposal"  },
    { id:"brandkits", label:"Kits",      icon:"brand"     },
  ];
  function handleConvert(p) { if (setConvertProposal) setConvertProposal(p); if (setPage) setPage("Generator"); }
  var selectedClient = MOCK_CLIENTS.find(function(c){ return c.id === clientId; }) || null;
  function goSection(id) { setSection(id); setClientId(null); }

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 58px)", background:C.bg }}>

      {/* Sidebar — desktop only */}
      <div className="nav-desktop" style={{ width:210, background:C.navy, flexShrink:0, display:"flex", flexDirection:"column", position:"sticky", top:58, height:"calc(100vh - 58px)" }}>
        <div style={{ padding:"32px 14px 24px" }}>
          <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(240,244,248,0.16)", marginBottom:22, paddingLeft:12 }}>Workspace</div>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 12px", borderRadius:10, border:"none", marginBottom:1, cursor:"pointer", background:active ? "rgba(255,255,255,0.08)" : "transparent", color:active ? C.navyActive : C.navyItem, fontFamily:fUI, fontSize:14, fontWeight:active ? 500 : 400, transition:"all 0.14s", textAlign:"left" }}
                onMouseEnter={function(e){ if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={function(e){ if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon name={item.icon} size={14} color={active ? C.accent : "rgba(240,244,248,0.22)"} />
                {item.label}
                {active && <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:C.accent, flexShrink:0 }} />}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1 }} />
        <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(20,153,144,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:10, color:C.accent, fontWeight:700, flexShrink:0 }}>
              {user && user.email ? user.email[0].toUpperCase() : "D"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:fUI, fontSize:11, color:"rgba(240,244,248,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user && user.email ? user.email : "demo@invoice-ai.de"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dash-main" style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"44px 48px", minWidth:0 }}>
        {section==="overview"  && <DOverview setSection={goSection} user={user} />}
        {section==="clients"   && !clientId && <DClients setClientId={setClientId} setPage={setPage} />}
        {section==="clients"   && clientId && selectedClient && <DClientDetail client={selectedClient} setClientId={setClientId} invoices={MOCK_INVOICES} proposals={MOCK_PROPOSALS} />}
        {section==="invoices"  && <DInvoices />}
        {section==="proposals" && <DProposals onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits />}
      </div>

      {/* Mobile bottom nav — lighter, shorter */}
      <div className="nav-burger" style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:"rgba(8,17,32,0.96)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderTop:"1px solid rgba(255,255,255,0.04)", padding:"8px 0 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"4px 8px", cursor:"pointer", minWidth:52 }}>
                <Icon name={item.icon} size={20} color={active ? C.accent : "rgba(240,244,248,0.22)"} />
                <span style={{ fontFamily:fMono, fontSize:8, letterSpacing:"0.05em", color:active ? C.accent : "rgba(240,244,248,0.22)", textTransform:"uppercase" }}>{item.label}</span>
              </button>
            );
          })}
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
        <h2 style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:C.ink, letterSpacing:"-0.03em", marginBottom:props.sub ? 5 : 0 }}>{props.title}</h2>
        {props.sub && <p style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300 }}>{props.sub}</p>}
      </div>
      {props.action && <div style={{ flexShrink:0 }}>{props.action}</div>}
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
  var dateStr = days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()];

  var [dismissed, setDismissed] = useState([]);
  var allAttention = [
    { id:0, type:"viewed",   title:"Pitch Deck viewed 7 times",       desc:"Bianchi & Co. has opened this 7 times. Strong buying signal — follow up now.",                    cta:"Send follow-up" },
    { id:1, type:"overdue",  title:"Invoice overdue · €3,200",        desc:"Maison Fontaine · FR-2026-0021 · Due 14 Jan. EU late payment interest applies.",                  cta:"Send reminder"  },
    { id:2, type:"followup", title:"App UI Kit — no reply in 3 days", desc:"Nord Digital opened your proposal twice. A short message typically doubles the reply rate.",       cta:"Follow up"      },
  ];
  var attention = allAttention.filter(function(a){ return dismissed.indexOf(a.id) < 0; });

  // Activity: only 3 items, stripped to essentials
  var activity = [
    { color:C.blue,  label:"Invoice sent",      meta:"Studio Verde · €4,200",  time:"2h ago"    },
    { color:C.green, label:"Proposal accepted",  meta:"Maison Fontaine · €8,400", time:"Yesterday" },
    { color:C.red,   label:"Invoice overdue",    meta:"Bianchi & Co. · €3,200", time:"16d ago"   },
  ];

  return (
    <div style={{ width:"100%", minWidth:0 }}>
      {/* Greeting — generous space */}
      <div style={{ marginBottom:48 }}>
        <h1 style={{ fontFamily:fSerif, fontSize:"clamp(32px,3.5vw,44px)", fontWeight:400, color:C.ink, letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:10 }}>{greetingFull}</h1>
        <p style={{ fontFamily:fUI, fontSize:13, color:C.faint }}>{dateStr} · 1 overdue</p>
      </div>

      {/* Two-col grid on desktop, single col on mobile */}
      <div className="dash-overview-grid" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24 }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, minWidth:0 }}>

          {/* Featured metric — large, dominant */}
          <div style={{ background:C.surface, borderRadius:20, padding:"28px 24px 22px", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
            <div style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint, marginBottom:16 }}>Revenue · May 2026</div>
            <div style={{ fontFamily:fSerif, fontSize:44, fontWeight:400, color:C.ink, letterSpacing:"-0.045em", lineHeight:1, marginBottom:12 }}>€14,280</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontFamily:fUI, fontSize:12, color:C.green }}>↑ +18% vs April</span>
              <Spark data={SPARK_UP} color={C.accent} w={80} h={24} />
            </div>
          </div>

          {/* Secondary metrics — smaller 2-col */}
          <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <StatCard label="Outstanding" value="€4,320" sub="4 overdue" subColor={C.red} spark={SPARK_DOWN} sparkColor={C.red} />
            <StatCard label="Collected" value="€9,960" sub="↑ +24%" subColor={C.green} spark={SPARK_UP} sparkColor={C.green} />
          </div>

          {/* Activity — 3 rows max, stripped */}
          <div style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
            <div style={{ padding:"20px 22px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink }}>Activity</span>
              <button onClick={function(){ setSection("invoices"); }} style={{ background:"none", border:"none", fontFamily:fUI, fontSize:12, color:C.accent, cursor:"pointer" }}>All →</button>
            </div>
            {activity.map(function(a, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 22px", borderTop:"1px solid "+C.borderLt }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:13, fontWeight:500, color:C.ink }}>{a.label}</div>
                    <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, marginTop:2 }}>{a.meta}</div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:10, color:C.faint, flexShrink:0 }}>{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — attention cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink }}>Needs attention</span>
            {attention.length > 0 && <span style={{ fontFamily:fMono, fontSize:10, color:C.red, background:C.redSoft, borderRadius:4, padding:"2px 6px" }}>{attention.length}</span>}
          </div>
          {attention.map(function(item) {
            return <AttentionCard key={item.id} item={item} onDismiss={function(){ setDismissed(function(d){ return d.concat([item.id]); }); }} />;
          })}
          {attention.length === 0 && (
            <div style={{ background:C.surface, borderRadius:18, padding:"40px 24px", textAlign:"center", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ fontFamily:fUI, fontSize:14, color:C.ink, fontWeight:500, marginBottom:4 }}>All clear.</div>
              <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, fontWeight:300 }}>Nothing needs attention.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function DClients(props) {
  var setClientId = props.setClientId;
  var setPage = props.setPage;
  var [search, setSearch] = useState("");
  var stColor = { active:C.green, overdue:C.red, prospect:C.blue };
  var filtered = MOCK_CLIENTS.filter(function(c){
    return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  });

  return (
    <div>
      <SectionHeader title="Clients" action={<Btn onClick={function(){ if(setPage) setPage("Generator"); }}>+ Invoice</Btn>} />
      <div style={{ position:"relative", marginBottom:20 }}>
        <input value={search} onChange={function(e){ setSearch(e.target.value); }} placeholder="Search…" style={{ width:"100%", boxSizing:"border-box", border:"none", borderRadius:12, padding:"11px 14px 11px 38px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.surface, outline:"none", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }} />
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="users" size={14} color={C.faint} /></div>
      </div>
      <div style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
        {filtered.map(function(c, i) {
          return (
            <div key={c.id} onClick={function(){ setClientId(c.id); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 22px", borderBottom:i<filtered.length-1 ? "1px solid "+C.borderLt : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = C.bg; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width:40, height:40, borderRadius:12, background:c.color+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:c.color, fontWeight:700, flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, marginBottom:3 }}>{c.name}</div>
                {/* City only — no count, no country */}
                <div style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{c.city}</div>
              </div>
              {/* Balance only if nonzero */}
              {c.balance > 0
                ? <div style={{ fontFamily:fMono, fontSize:13, color:C.red, fontWeight:500, flexShrink:0 }}>{"€"+c.balance.toLocaleString()}</div>
                : <Dot color={stColor[c.status]||C.muted}>{c.status}</Dot>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DClientDetail(props) {
  var c = props.client;
  var setClientId = props.setClientId;
  var clientInvoices = (props.invoices||[]).filter(function(i){ return i.client_id===c.id; });
  var clientProposals = (props.proposals||[]).filter(function(p){ return p.client_id===c.id; });
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red };
  var pColors = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };
  return (
    <div>
      <button onClick={function(){ setClientId(null); }} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontFamily:fUI, fontSize:13, marginBottom:28, padding:0 }}>← Clients</button>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:36 }}>
        <div style={{ width:48, height:48, borderRadius:14, background:c.color+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:16, color:c.color, fontWeight:700 }}>{c.avatar}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:400, color:C.ink, letterSpacing:"-0.025em", marginBottom:2 }}>{c.name}</h2>
          <p style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{c.city}</p>
        </div>
      </div>
      <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        <StatCard label="Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance>0?C.red:C.green} />
      </div>
      {clientInvoices.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", marginBottom:14, boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
          {clientInvoices.map(function(inv, i) {
            return (
              <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"15px 20px", borderBottom:i<clientInvoices.length-1?"1px solid "+C.borderLt:"none" }}>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.ink, flex:1 }}>{inv.inv_number}</div>
                <div style={{ fontFamily:fMono, fontSize:13, fontWeight:500, color:C.ink }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <Dot color={stColor[inv.status]||C.muted}>{inv.status}</Dot>
              </div>
            );
          })}
        </div>
      )}
      {clientProposals.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
          {clientProposals.map(function(p, i) {
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"15px 20px", borderBottom:i<clientProposals.length-1?"1px solid "+C.borderLt:"none" }}>
                <div style={{ flex:1, fontFamily:fUI, fontSize:13, color:C.ink }}>{p.title}</div>
                <div style={{ fontFamily:fMono, fontSize:13, fontWeight:500, color:C.ink }}>{"€"+p.value.toLocaleString()}</div>
                <Dot color={pColors[p.status]||C.muted}>{p.status}</Dot>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Invoices — calm overview, not admin table ─────────────────────────────────
function DInvoices() {
  var [filter, setFilter] = useState("all");
  var [acted, setActed] = useState({});
  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });
  var filtered = MOCK_INVOICES.filter(function(inv){
    if (filter==="outstanding") return inv.status==="sent"||inv.status==="overdue";
    if (filter==="paid") return inv.status==="paid";
    return true;
  });
  var outstanding = MOCK_INVOICES.filter(function(i){ return i.status==="sent"||i.status==="overdue"; }).reduce(function(s,i){ return s+i.amount_gross; },0);

  function act(id, type) {
    setActed(function(s){ return Object.assign({},s,{ [id]:type }); });
    setTimeout(function(){ setActed(function(s){ var n=Object.assign({},s); delete n[id]; return n; }); },3000);
  }

  var stColor = { sent:C.blue, paid:C.green, overdue:C.red, draft:C.muted };

  return (
    <div>
      <SectionHeader title="Invoices" action={
        outstanding > 0
          ? <div style={{ display:"flex", alignItems:"center", gap:6, background:C.redSoft, borderRadius:9, padding:"7px 13px" }}><span style={{ fontFamily:fMono, fontSize:11, color:C.red }}>{"€"+outstanding.toLocaleString()+" due"}</span></div>
          : null
      } />
      {/* Filter — minimal pill */}
      <div style={{ display:"flex", gap:2, marginBottom:24 }}>
        {[["all","All"],["outstanding","Pending"],["paid","Paid"]].map(function(pair) {
          var active = filter===pair[0];
          return <button key={pair[0]} onClick={function(){ setFilter(pair[0]); }} style={{ background:active ? C.ink : "transparent", color:active ? "#fff" : C.muted, border:"none", padding:"7px 16px", borderRadius:99, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:active?500:400, transition:"all 0.12s" }}>{pair[1]}</button>;
        })}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(function(inv) {
          var isOverdue = inv.status==="overdue";
          var clientName = clientMap[inv.client_id]||"Unknown";
          var toast = acted[inv.id];
          return (
            <div key={inv.id} style={{ background:C.surface, borderRadius:16, boxShadow:isOverdue ? "0 0 0 1.5px "+C.red+"30, 0 2px 8px rgba(10,22,40,0.04)" : "0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 20px" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  {/* Client name dominant */}
                  <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, marginBottom:3 }}>{clientName}</div>
                  {/* Number quiet */}
                  <div style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{inv.inv_number} · {isOverdue ? "due "+inv.due_date : inv.due_date}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:fMono, fontSize:16, fontWeight:600, color:isOverdue?C.red:C.ink, marginBottom:4 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                  <Dot color={stColor[inv.status]||C.muted}>{inv.status}</Dot>
                </div>
              </div>
              {isOverdue && !toast && (
                <div style={{ padding:"0 20px 16px" }}>
                  <Btn variant="danger" onClick={function(){ act(inv.id,"reminder"); }}>Send reminder</Btn>
                </div>
              )}
              {inv.status==="sent" && !toast && (
                <div style={{ padding:"0 20px 16px" }}>
                  <Btn variant="ghost" onClick={function(){ act(inv.id,"followup"); }}>Follow up</Btn>
                </div>
              )}
              {toast && (
                <div style={{ padding:"10px 20px 14px" }}>
                  <div style={{ fontFamily:fUI, fontSize:13, color:C.accent }}>✓ {toast==="reminder" ? "Reminder sent" : "Follow-up sent"}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Proposals — intelligence layer, simplified ────────────────────────────────
export function DProposals(props) {
  var onConvert = props.onConvert;
  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });
  var won = MOCK_PROPOSALS.filter(function(p){ return p.status==="won"; }).length;
  var total = MOCK_PROPOSALS.filter(function(p){ return p.status!=="draft"; }).length;
  var winRate = total > 0 ? Math.round(won/total*100) : 0;
  var stColor = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };

  function signal(p) {
    if (p.status==="viewed" && p.view_count >= 5) return { msg:"Viewed "+p.view_count+"× — strong signal.", cta:"Follow up", urgent:true };
    if ((p.status==="sent"||p.status==="viewed") && p.days_since >= 3) return { msg:"No reply in "+p.days_since+" days.", cta:"Follow up", urgent:false };
    return null;
  }

  return (
    <div>
      <SectionHeader title="Proposals" sub={"Win rate " + winRate + "% · " + MOCK_PROPOSALS.length + " total"} />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {MOCK_PROPOSALS.map(function(p) {
          var sig = signal(p);
          var sc = stColor[p.status]||C.muted;
          return (
            <div key={p.id} style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
              <div style={{ padding:"22px 22px 18px" }}>
                {/* Title + amount — the two most important things */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
                  <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, lineHeight:1.3, flex:1 }}>{p.title}</div>
                  <div style={{ fontFamily:fMono, fontSize:15, fontWeight:600, color:C.ink, flexShrink:0 }}>{"€"+p.value.toLocaleString()}</div>
                </div>
                {/* Client + status — quieter */}
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{clientMap[p.client_id]||""}</span>
                  <Dot color={sc}>{p.status}</Dot>
                  {p.view_count > 0 && <span style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{p.view_count} views</span>}
                </div>
              </div>
              {/* Signal strip — only when relevant */}
              {sig && (
                <div style={{ margin:"0 14px 14px", padding:"12px 16px", background:sig.urgent ? C.goldSoft : C.accentSoft, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                  <span style={{ fontFamily:fUI, fontSize:13, color:C.inkLight }}>{sig.msg}</span>
                  <Btn variant="ghost" sm={true}>{sig.cta}</Btn>
                </div>
              )}
              {/* Convert to invoice — only for won */}
              {p.status==="won" && (
                <div style={{ padding:"0 22px 18px" }}>
                  <Btn variant="ghost" sm={true} onClick={function(){ if(onConvert) onConvert(p); }}>Convert to invoice →</Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Brand Kits ────────────────────────────────────────────────────────────────
export function DBrandKits() {
  var [kits, setKits] = useState(MOCK_BRAND_KITS);
  var [selId, setSelId] = useState(kits[0]?kits[0].id:null);
  var sel = kits.find(function(k){ return k.id===selId; })||null;
  var [editName, setEditName] = useState(sel?sel.name:"");
  var [editColor, setEditColor] = useState(sel?sel.primary_color:"#17A99E");
  var [editFont, setEditFont] = useState(sel?sel.font:"DM Sans");
  var [saved, setSaved] = useState(false);

  useEffect(function() {
    if (sel) { setEditName(sel.name); setEditColor(sel.primary_color); setEditFont(sel.font||"DM Sans"); }
  }, [selId]);

  function save() {
    setKits(function(prev){ return prev.map(function(k){ return k.id===selId?Object.assign({},k,{name:editName,primary_color:editColor,font:editFont}):k; }); });
    setSaved(true); setTimeout(function(){ setSaved(false); },2000);
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"none", borderRadius:9, padding:"10px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
  var lbl = { display:"block", marginBottom:5, fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint };

  return (
    <div>
      <SectionHeader title="Brand Kits" />
      <div className="dash-brandkit-grid" style={{ display:"grid", gridTemplateColumns:"170px 1fr", gap:18 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {kits.map(function(kit) {
            var active = selId===kit.id;
            return (
              <div key={kit.id} onClick={function(){ setSelId(kit.id); }} style={{ background:active?C.surface:"transparent", borderRadius:12, padding:"10px 12px", cursor:"pointer", transition:"all 0.12s", boxShadow:active?"0 1px 6px rgba(10,22,40,0.07)":"none", outline:active?"1.5px solid "+C.accent+"35":"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:6, background:kit.primary_color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:10, color:"#fff", fontWeight:700, flexShrink:0 }}>{kit.logo_text}</div>
                  <div style={{ fontFamily:fUI, fontSize:13, fontWeight:active?500:400, color:active?C.ink:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button onClick={function(){ var id=String(Date.now()); setKits(function(p){ return p.concat([{id:id,name:"New Kit",primary_color:C.accent,font:"DM Sans",logo_text:"NK"}]); }); setSelId(id); }} style={{ background:"none", border:"1.5px dashed "+C.border, borderRadius:12, padding:"10px 12px", cursor:"pointer", color:C.faint, fontFamily:fUI, fontSize:13, textAlign:"left" }}>+ New</button>
        </div>
        {sel && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:C.surface, borderRadius:16, padding:"22px 24px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                <div><label style={lbl}>Name</label><input value={editName} onChange={function(e){ setEditName(e.target.value); }} style={inp} /></div>
                <div><label style={lbl}>Color</label>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <input type="color" value={editColor} onChange={function(e){ setEditColor(e.target.value); }} style={{ width:36, height:34, border:"none", borderRadius:7, cursor:"pointer", padding:2, background:"none" }} />
                    <span style={{ fontFamily:fMono, fontSize:11, color:C.muted }}>{editColor}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:18 }}><label style={lbl}>Font</label>
                <select value={editFont} onChange={function(e){ setEditFont(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {["DM Sans","DM Serif Display","Playfair Display","Cormorant Garamond","Inter"].map(function(f){ return <option key={f} value={f}>{f}</option>; })}
                </select>
              </div>
              <Btn onClick={save} variant={saved?"secondary":"primary"}>{saved?"✓ Saved":"Save kit"}</Btn>
            </div>
            {/* Preview */}
            <div style={{ background:C.bg, borderRadius:16, padding:"20px", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 22px", boxShadow:"0 2px 16px rgba(10,22,40,0.08)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:editColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:11, color:"#fff", fontWeight:700 }}>{sel.logo_text||editName[0]||"B"}</div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:fMono, fontSize:9, color:C.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice</div>
                    <div style={{ fontFamily:fMono, fontSize:12, color:C.ink, fontWeight:500, marginTop:1 }}>DE-2026-001</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'"+editFont+"', sans-serif", fontSize:15, fontWeight:700, color:C.ink, marginBottom:14 }}>{editName}</div>
                <div style={{ borderTop:"2px solid "+editColor, paddingTop:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted, marginBottom:6 }}><span>Brand Identity</span><span style={{ color:C.ink, fontWeight:500 }}>€1,800</span></div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:13, fontWeight:700, color:C.ink, marginTop:10, paddingTop:10, borderTop:"1px solid "+C.borderLt }}><span>Total</span><span style={{ color:editColor }}>€4,998</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
