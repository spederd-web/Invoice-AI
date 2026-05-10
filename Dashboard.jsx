import { useState, useEffect, useCallback } from "react";
import { L, fSans, fMono, fSerif, Icon, LogoMark } from "./constants.jsx";

// -- Design tokens -------------------------------------------------------------
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

// -- Supabase hook -------------------------------------------------------------
export function useDB(table, userId, refreshKey) {
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
  }, [table, userId, refreshKey]);
  useEffect(function() { fetch_(); }, [fetch_]);
  function insert(p) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"insert", user_id:userId, payload:p }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  function update(id, p) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"update", id:id, user_id:userId, payload:p }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  function remove(id) { return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ table:table, action:"delete", id:id, user_id:userId }) }).then(function(r){ return r.json(); }).then(function(d){ fetch_(); return d; }); }
  return { rows:rows, loading:loading, error:error, refresh:fetch_, insert:insert, update:update, remove:remove };
}

// -- useProfile - load/save user profile from Supabase ------------------------
export function useProfile(userId) {
  var [profile, setProfile] = useState(null);
  var [loading, setLoading] = useState(false);

  useEffect(function() {
    if (!userId) return;
    setLoading(true);
    fetch("/api/db?table=profiles&user_id=" + encodeURIComponent(userId))
      .then(function(r) { return r.json(); })
      .then(function(data) { setProfile(data || {}); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, [userId]);

  function save(payload) {
    return fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table:"profiles", action:"upsert", user_id:userId, payload:payload }),
    }).then(function(r) { return r.json(); }).then(function(data) {
      setProfile(data);
      return data;
    });
  }

  return { profile:profile, loading:loading, save:save };
}
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
  { id:"1", client_id:"1", title:"Brand Identity - TechFlow",  status:"won",      value:8400,  view_count:4, days_since:23, last_viewed:"2d ago" },
  { id:"2", client_id:"4", title:"App UI Kit + Design System", status:"sent",     value:12000, view_count:2, days_since:3,  last_viewed:"3d ago" },
  { id:"3", client_id:"3", title:"Pitch Deck - Series A",      status:"viewed",   value:2800,  view_count:7, days_since:0,  last_viewed:"6h ago" },
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

// -- Sparkline -----------------------------------------------------------------
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

// -- Atoms ---------------------------------------------------------------------
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

// -- Attention card - simplified, spacious -------------------------------------
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
        <button onClick={onDismiss} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:18, lineHeight:1, padding:"0 2px", opacity:0.5 }}>x</button>
      </div>
      {/* Title large, desc quieter */}
      <div style={{ fontFamily:fUI, fontSize:16, fontWeight:600, color:C.ink, lineHeight:1.3, marginBottom:10 }}>{item.title}</div>
      <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, lineHeight:1.65, marginBottom:22 }}>{item.desc}</div>
      <Btn variant={item.type === "overdue" ? "danger" : "ghost"}>{item.cta}</Btn>
    </div>
  );
}

// -- Shell ---------------------------------------------------------------------
export function Dashboard(props) {
  var setPage = props.setPage;
  var setConvertProposal = props.setConvertProposal;
  var user = props.user;

  // userId as state so useDB re-fetches when it becomes available
  var [userId, setUserId] = useState(function() {
    if (user && user.id) return user.id;
    try {
      var stored = JSON.parse(localStorage.getItem("invoiceai_user"));
      return stored && stored.id ? stored.id : null;
    } catch(e) { return null; }
  });

  // If user prop updates after mount, sync userId
  useEffect(function() {
    if (user && user.id && user.id !== userId) {
      setUserId(user.id);
    }
  }, [user]);
  var [section, setSection] = useState("overview");
  var [clientId, setClientId] = useState(null);
  var [selectedClient, setSelectedClient] = useState(null);

  function selectClient(client) {
    setClientId(client ? client.id : null);
    setSelectedClient(client);
  }
  var [refreshKey, setRefreshKey] = useState(0);
  var [settingsTab, setSettingsTab] = useState("profile");

  function forceRefresh() { setRefreshKey(function(k){ return k + 1; }); }

  // -- Real data from Supabase (falls back to mock when userId is null) ------
  var profileHook  = useProfile(userId);
  var profile      = profileHook.profile;
  var invoicesDB   = useDB("invoices",   userId, refreshKey);
  var proposalsDB  = useDB("proposals",  userId, refreshKey);
  var clientsDB    = useDB("clients",    userId, refreshKey);

  // Plan enforcement: free users get 3 invoices, unlimited on paid plans
  var planStatus   = profile ? (profile.plan_status || "free") : "free";
  var planName     = profile ? (profile.plan || "free") : "free";
  var isPaidPlan   = planStatus === "active" && planName !== "free";
  var invoiceCount = invoicesDB.rows.length;

  var brandKitsDB  = useDB("brand_kits", userId, refreshKey);
  // Only fall back to mock data when there is no userId (demo/logged-out mode)
  var invoices  = userId ? invoicesDB.rows  : MOCK_INVOICES;
  var proposals = userId ? proposalsDB.rows : MOCK_PROPOSALS;
  var clients   = userId ? clientsDB.rows   : MOCK_CLIENTS;
  var nav = [
    { id:"overview",  label:"Overview",  icon:"overview"  },
    { id:"clients",   label:"Clients",   icon:"users"     },
    { id:"invoices",  label:"Invoices",  icon:"document"  },
    { id:"proposals", label:"Proposals", icon:"proposal"  },
    { id:"brandkits", label:"Brand Kits",icon:"brand"     },
  ];
  var navBottom = [
    { id:"reports",      label:"Reports",      icon:"chart"    },
    { id:"settings",     label:"Settings",     icon:"settings" },
    { id:"integrations", label:"Integrations", icon:"eu"       },
  ];
  function handleConvert(p) { if (setConvertProposal) setConvertProposal(p); if (setPage) setPage("Generator"); }
  function goSection(id) { setSection(id); selectClient(null); }

  // Safety: don't render until hooks are initialized
  if (!invoicesDB || !clientsDB || !proposalsDB) return null;

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 58px)", background:C.bg }}>

      {/* Sidebar - desktop only */}
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
          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"12px 0" }} />
          {navBottom.map(function(item) {
            var active = section === item.id || (item.id === "integrations" && section === "settings" && settingsTab === "integrations");
            return (
              <button key={item.id} onClick={function(){
                if (item.id === "integrations") { goSection("settings"); setSettingsTab("integrations"); }
                else if (item.id === "reports") { goSection("overview"); }
                else goSection(item.id);
              }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", marginBottom:1, cursor:"pointer", background:"transparent", color:C.navyItem, fontFamily:fUI, fontSize:13, fontWeight:400, transition:"all 0.14s", textAlign:"left", opacity:0.7 }}
                onMouseEnter={function(e){ e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.7"; }}
              >
                <Icon name={item.icon} size={13} color="rgba(240,244,248,0.22)" />
                {item.label}
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
        {section==="overview"  && <DOverview setSection={goSection} setPage={setPage} user={user} profile={profile} invoices={invoices} proposals={proposals} clients={clients} isPaidPlan={isPaidPlan} invoiceCount={invoiceCount} dataLoading={invoicesDB.loading || clientsDB.loading} />}
        {section==="clients"   && !clientId && <DClients key={refreshKey} setClientId={selectClient} setPage={setPage} clients={clients} db={clientsDB} userId={userId} onRefresh={forceRefresh} />}
        {section==="clients"   && clientId && selectedClient && <DClientDetail client={selectedClient} setClientId={function(){ selectClient(null); }} invoices={invoices} proposals={proposals} userId={userId} />}
        {section==="invoices"  && <DInvoices invoices={invoices} clients={clients} db={invoicesDB} userId={userId} />}
        {section==="proposals" && <DProposals proposals={proposals} clients={clients} db={proposalsDB} userId={userId} onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits userId={userId} db={brandKitsDB} />}
        {section==="settings"  && <DSettings user={user} profile={profile} profileHook={profileHook} tab={settingsTab} setTab={setSettingsTab} setPage={setPage} setSection={goSection} />}
      </div>

      {/* Mobile bottom nav - lighter, shorter */}
      <div className="nav-burger" style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:"rgba(8,17,32,0.96)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderTop:"1px solid rgba(255,255,255,0.04)", padding:"8px 0 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {[
            { id:"overview",  label:"Overview",  icon:"overview"  },
            { id:"clients",   label:"Clients",   icon:"users"     },
            { id:"invoices",  label:"Invoices",  icon:"document"  },
            { id:"proposals", label:"Proposals", icon:"proposal"  },
            { id:"settings",  label:"Settings",  icon:"settings"  },
          ].map(function(item) {
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

// -- Section header ------------------------------------------------------------
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

// -- Chart data ----------------------------------------------------------------
var ACTIVITY_LABELS = ["1 May","8 May","15 May","22 May","31 May"];
var ACTIVITY_REV  = [4200, 6800, 8100, 11200, 14280];
var ACTIVITY_PAID = [3800, 5900, 7200,  9800, 12100];
var ACTIVITY_OUT  = [1200, 2100, 2800,  3600,  4320];

var CASHFLOW_LABELS = ["1","8","15","22","31"];
var CASHFLOW_IN  = [4200, 3100, 5800, 6200, 0];
var CASHFLOW_OUT = [0,    0,    1200, 0,    2800];

var TOP_CLIENTS = [
  { name:"Bianchi & Co.",   revenue:31200, color:C.accent },
  { name:"Studio Verde",    revenue:22400, color:C.accent },
  { name:"Maison Fontaine", revenue:18600, color:C.accent },
  { name:"Nord Digital",    revenue:4200,  color:C.accent },
];

// -- Line chart (Activity Overview) -------------------------------------------
function LineChart(props) {
  var series = props.series || [];
  var labels = props.labels || [];
  var w = props.w || 500;
  var h = props.h || 160;
  var pad = { t:8, r:8, b:28, l:44 };
  var cw = w - pad.l - pad.r;
  var ch = h - pad.t - pad.b;
  var allVals = [];
  series.forEach(function(s){ s.data.forEach(function(v){ allVals.push(v); }); });
  var min = 0;
  var max = Math.max.apply(null, allVals) * 1.1 || 1;

  function xp(i) { return pad.l + (i / (labels.length - 1)) * cw; }
  function yp(v) { return pad.t + ch - ((v - min) / (max - min)) * ch; }

  function fmtY(v) {
    if (v >= 1000) return "€" + Math.round(v/1000) + "K";
    return "€" + v;
  }

  var yTicks = [0, Math.round(max/3), Math.round(max*2/3), Math.round(max)];

  return (
    <svg width="100%" viewBox={"0 0 " + w + " " + h} preserveAspectRatio="none" style={{ display:"block", overflow:"visible" }}>
      <defs>
        {series.map(function(s) {
          return (
            <linearGradient key={s.key} id={"lc"+s.key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          );
        })}
      </defs>
      {/* Grid lines */}
      {yTicks.map(function(v) {
        var y = yp(v);
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke={C.borderLt} strokeWidth="1" />
            <text x={pad.l - 6} y={y + 4} fontFamily={fUI} fontSize="9" fill={C.faint} textAnchor="end">{fmtY(v)}</text>
          </g>
        );
      })}
      {/* X labels */}
      {labels.map(function(lb, i) {
        return <text key={i} x={xp(i)} y={h - 4} fontFamily={fUI} fontSize="9" fill={C.faint} textAnchor="middle">{lb}</text>;
      })}
      {/* Series */}
      {series.map(function(s) {
        var pts = s.data.map(function(v, i){ return xp(i) + "," + yp(v); });
        var areaPath = "M" + pts.join(" L") + " L" + xp(s.data.length-1) + "," + (pad.t+ch) + " L" + pad.l + "," + (pad.t+ch) + " Z";
        return (
          <g key={s.key}>
            <path d={areaPath} fill={"url(#lc"+s.key+")"} />
            <path d={"M"+pts.join(" L")} fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map(function(v, i) {
              return <circle key={i} cx={xp(i)} cy={yp(v)} r="2.5" fill={s.color} opacity="0.9" />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

// -- Bar chart (Cash Flow) -----------------------------------------------------
function BarChart(props) {
  var inData  = props.inData  || [];
  var outData = props.outData || [];
  var labels  = props.labels  || [];
  var w = props.w || 320;
  var h = props.h || 140;
  var pad = { t:8, r:8, b:28, l:44 };
  var cw = w - pad.l - pad.r;
  var ch = h - pad.t - pad.b;
  var allVals = inData.concat(outData);
  var maxV = Math.max.apply(null, allVals) * 1.2 || 1;
  var barW = Math.floor(cw / labels.length * 0.3);
  var slot = cw / labels.length;

  function yp(v) { return pad.t + ch - (v / maxV) * ch; }
  function yh(v) { return (v / maxV) * ch; }

  return (
    <svg width="100%" viewBox={"0 0 " + w + " " + h} preserveAspectRatio="none" style={{ display:"block", overflow:"visible" }}>
      {/* Grid */}
      {[0, Math.round(maxV/2), Math.round(maxV)].map(function(v) {
        var y = yp(v);
        return (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke={C.borderLt} strokeWidth="1" />
            <text x={pad.l - 6} y={y+4} fontFamily={fUI} fontSize="8" fill={C.faint} textAnchor="end">{v >= 1000 ? "€"+(v/1000)+"K" : "€"+v}</text>
          </g>
        );
      })}
      {labels.map(function(lb, i) {
        var cx = pad.l + i * slot + slot / 2;
        var inV  = inData[i]  || 0;
        var outV = outData[i] || 0;
        return (
          <g key={i}>
            {inV > 0 && <rect x={cx - barW - 1} y={yp(inV)} width={barW} height={yh(inV)} rx="2" fill={C.accent} opacity="0.8" />}
            {outV > 0 && <rect x={cx + 1}        y={yp(outV)} width={barW} height={yh(outV)} rx="2" fill={C.red} opacity="0.7" />}
            <text x={cx} y={h-4} fontFamily={fUI} fontSize="8" fill={C.faint} textAnchor="middle">{lb}</text>
          </g>
        );
      })}
    </svg>
  );
}

// -- Overview ------------------------------------------------------------------
// -- Onboarding ----------------------------------------------------------------
function Onboarding(props) {
  var setPage = props.setPage;
  var setSection = props.setSection;
  var steps = [
    { num:1, title:"Add your business details", sub:"Your name, VAT number and IBAN - used on every invoice.", cta:"Open Settings", action:function(){ setSection("settings"); } },
    { num:2, title:"Add your first client", sub:"Takes 30 seconds. Name and city is enough to start.", cta:"Add client", action:function(){ setSection("clients"); } },
    { num:3, title:"Create your first invoice", sub:"Pre-filled from your settings. EU-compliant automatically.", cta:"Create invoice", action:function(){ setPage("Generator"); } },
  ];
  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,3vw,38px)", fontWeight:400, color:C.ink, letterSpacing:"-0.03em", marginBottom:8 }}>Welcome to InvoiceAI.</h1>
        <p style={{ fontFamily:fUI, fontSize:14, color:C.muted, fontWeight:300, lineHeight:1.6 }}>Three steps to your first invoice. Takes about 5 minutes.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {steps.map(function(step) {
          return (
            <div key={step.num} style={{ background:C.surface, borderRadius:16, padding:"22px 24px", boxShadow:"0 1px 6px rgba(10,22,40,0.05)", display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:fSerif, fontSize:16, color:"rgba(240,244,248,0.9)", fontWeight:400 }}>{step.num}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, marginBottom:3 }}>{step.title}</div>
                <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300 }}>{step.sub}</div>
              </div>
              <button onClick={step.action} style={{ background:C.accentSoft, color:C.accent, border:"none", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>{step.cta}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Overview ------------------------------------------------------------------
function DOverview(props) {
  var setSection = props.setSection;
  var setPage = props.setPage;
  var user = props.user;
  var clients = props.clients || [];
  var invoices = props.invoices || [];
  var proposals = props.proposals || [];
  var isPaidPlan = props.isPaidPlan;
  var dataLoading = props.dataLoading;
  var invoiceCount = props.invoiceCount || 0;
  var FREE_INVOICE_LIMIT = 3;
  var hitLimit = user && !isPaidPlan && invoiceCount >= FREE_INVOICE_LIMIT;

  // Only show onboarding after data has finished loading and is genuinely empty
  var isNewUser = user && !dataLoading && clients.length === 0 && invoices.length === 0 && proposals.length === 0;
  if (isNewUser) {
    return <Onboarding setPage={setPage} setSection={setSection} />;
  }

  // Compute real KPIs from live data
  var now2 = new Date();
  var thisMonth = now2.getMonth();
  var thisYear = now2.getFullYear();

  function isThisMonth(dateStr) {
    if (!dateStr) return false;
    var d = new Date(dateStr);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }

  var revenue = invoices
    .filter(function(i){ return (i.status === "paid") && isThisMonth(i.issue_date || i.created_at); })
    .reduce(function(s, i){ return s + (i.amount_gross || 0); }, 0);

  var outstanding = invoices
    .filter(function(i){ return i.status === "sent" || i.status === "overdue"; })
    .reduce(function(s, i){ return s + (i.amount_gross || 0); }, 0);

  var overdueCount = invoices.filter(function(i){ return i.status === "overdue"; }).length;

  var collected = invoices
    .filter(function(i){ return i.status === "paid" && isThisMonth(i.issue_date || i.created_at); })
    .reduce(function(s, i){ return s + (i.amount_gross || 0); }, 0);

  var openProposals = proposals.filter(function(p){ return p.status === "sent" || p.status === "viewed"; }).length;
  var awaitingReply = proposals.filter(function(p){ return p.status === "sent"; }).length;

  function fmtEur(n) { return "EUR " + Math.round(n).toLocaleString(); }

  // Use mock data for demo mode (no real invoices yet)
  var usingMock = user && !user.id && invoices.length === 0 && proposals.length === 0;
  var kpiRevenue    = usingMock ? "EUR 14,280" : fmtEur(revenue);
  var kpiOutstanding = usingMock ? "EUR 4,320"  : fmtEur(outstanding);
  var kpiCollected  = usingMock ? "EUR 9,960"   : fmtEur(collected);
  var kpiOpenProps  = usingMock ? "6"            : String(openProposals);
  var kpiOverdueSub = usingMock ? "4 overdue"   : (overdueCount > 0 ? overdueCount + " overdue" : "all current");
  var kpiAwaitSub   = usingMock ? "2 awaiting reply" : (awaitingReply + " awaiting reply");
  var hour = now2.getHours();
  var greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  var firstName = user && user.email ? user.email.split("@")[0].split(".")[0] : null;
  var greetingFull = firstName ? greeting + ", " + firstName[0].toUpperCase() + firstName.slice(1) + "." : greeting + ".";
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateStr = days[now2.getDay()] + ", " + now2.getDate() + " " + months[now2.getMonth()] + " " + now2.getFullYear();

  var [dismissed, setDismissed] = useState([]);
  var allAttention = [
    { id:0, type:"followup", title:"App UI Kit proposal",     sub:"No reply in 3 days",   cta:"Follow up" },
    { id:1, type:"overdue",  title:"Invoice FR-2026-0021",    sub:"Overdue by 5 days",     cta:"Send reminder" },
    { id:2, type:"viewed",   title:"Pitch Deck - Series A",   sub:"Proposal viewed 7 times", cta:"View" },
  ];
  var attention = allAttention.filter(function(a){ return dismissed.indexOf(a.id) < 0; });

  var attnColor = { followup:C.gold, overdue:C.red, viewed:C.blue };

  // Build activity feed from real data
  var activity = (function() {
    var events = [];
    invoices.forEach(function(inv) {
      var clientName = (function() {
        var c = clients.find(function(c){ return c.id === inv.client_id; });
        return c ? c.name : inv.client_name || "Unknown";
      })();
      var amt = inv.amount_gross ? " . EUR " + Math.round(inv.amount_gross).toLocaleString() : "";
      if (inv.status === "paid") events.push({ icon:"check", color:C.green, label:"Invoice paid", sub:clientName + amt, time:inv.updated_at || inv.created_at, _ts: new Date(inv.updated_at || inv.created_at).getTime() });
      else if (inv.status === "overdue") events.push({ icon:"clock", color:C.red, label:"Invoice overdue", sub:clientName + amt, time:inv.due_date || inv.created_at, _ts: new Date(inv.due_date || inv.created_at).getTime() });
      else if (inv.status === "sent") events.push({ icon:"document", color:C.blue, label:"Invoice sent", sub:clientName + amt, time:inv.created_at, _ts: new Date(inv.created_at).getTime() });
    });
    proposals.forEach(function(p) {
      var clientName = (function() {
        var c = clients.find(function(c){ return c.id === p.client_id; });
        return c ? c.name : "Unknown";
      })();
      if (p.status === "won") events.push({ icon:"check", color:C.green, label:"Proposal accepted", sub:p.title || clientName, time:p.updated_at || p.created_at, _ts: new Date(p.updated_at || p.created_at).getTime() });
      else if (p.status === "viewed") events.push({ icon:"eye", color:C.blue, label:"Proposal viewed", sub:p.title || clientName, time:p.last_viewed_at || p.created_at, _ts: new Date(p.last_viewed_at || p.created_at).getTime() });
      else if (p.status === "sent") events.push({ icon:"proposal", color:C.accent, label:"Proposal sent", sub:p.title || clientName, time:p.sent_at || p.created_at, _ts: new Date(p.sent_at || p.created_at).getTime() });
    });
    // Sort newest first, take top 5
    events.sort(function(a, b){ return b._ts - a._ts; });
    events = events.slice(0, 5);
    // Format time
    var now3 = Date.now();
    events.forEach(function(e) {
      var diff = Math.floor((now3 - e._ts) / 1000);
      if (diff < 3600) e.time = Math.floor(diff/60) + "m ago";
      else if (diff < 86400) e.time = Math.floor(diff/3600) + "h ago";
      else if (diff < 172800) e.time = "Yesterday";
      else e.time = Math.floor(diff/86400) + "d ago";
    });
    // Fallback to mock if no real events
    if (events.length === 0 && (!user || (invoices.length === 0 && proposals.length === 0))) {
      return [
        { icon:"eye",      color:C.blue,  label:"Proposal viewed",  sub:"Brand Redesign",   time:"2h ago"    },
        { icon:"check",    color:C.green, label:"Invoice paid",      sub:"FR-2026-0018",     time:"Yesterday" },
        { icon:"clock",    color:C.red,   label:"Invoice overdue",   sub:"FR-2026-0021",     time:"5d ago"    },
      ];
    }
    return events;
  })();

  // Build real chart data - weekly buckets for this month
  var chartData = (function() {
    if (!invoices.length) return null;
    var now4 = new Date();
    var yr4 = now4.getFullYear();
    var mo4 = now4.getMonth();
    var weeks = ["1","8","15","22","31"];
    var revBuckets  = [0, 0, 0, 0, 0];
    var paidBuckets = [0, 0, 0, 0, 0];
    var outBuckets  = [0, 0, 0, 0, 0];
    var cfIn  = [0, 0, 0, 0, 0];
    var cfOut = [0, 0, 0, 0, 0];
    invoices.forEach(function(inv) {
      var d = new Date(inv.created_at || inv.issue_date);
      if (d.getFullYear() !== yr4 || d.getMonth() !== mo4) return;
      var day = d.getDate();
      var bucket = day < 8 ? 0 : day < 15 ? 1 : day < 22 ? 2 : day < 28 ? 3 : 4;
      var amt = inv.amount_gross || 0;
      revBuckets[bucket]  += amt;
      if (inv.status === "paid") { paidBuckets[bucket] += amt; cfIn[bucket] += amt; }
      if (inv.status === "sent" || inv.status === "overdue") outBuckets[bucket] += amt;
      if (inv.status === "overdue") cfOut[bucket] += amt;
    });
    // Running totals for line chart
    for (var i = 1; i < 5; i++) {
      revBuckets[i]  += revBuckets[i-1];
      paidBuckets[i] += paidBuckets[i-1];
      outBuckets[i]  += outBuckets[i-1];
    }
    return { weeks:weeks, rev:revBuckets, paid:paidBuckets, out:outBuckets, cfIn:cfIn, cfOut:cfOut };
  })();

  var chartLabels = chartData ? chartData.weeks.map(function(w){ return w + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][now2.getMonth()]; }) : ACTIVITY_LABELS;
  var chartRev  = chartData ? chartData.rev  : ACTIVITY_REV;
  var chartPaid = chartData ? chartData.paid : ACTIVITY_PAID;
  var chartOut  = chartData ? chartData.out  : ACTIVITY_OUT;
  var cfIn  = chartData ? chartData.cfIn  : CASHFLOW_IN;
  var cfOut = chartData ? chartData.cfOut : CASHFLOW_OUT;

  // Top clients from real data
  var topClients = (function() {
    if (!invoices.length || !clients.length) return TOP_CLIENTS;
    var byClient = {};
    invoices.forEach(function(inv) {
      if (!inv.client_id) return;
      byClient[inv.client_id] = (byClient[inv.client_id] || 0) + (inv.amount_gross || 0);
    });
    return Object.keys(byClient).map(function(cid) {
      var c = clients.find(function(x){ return x.id === cid; }) || {};
      return { name: c.name || "Unknown", revenue: byClient[cid], color: C.accent };
    }).sort(function(a, b){ return b.revenue - a.revenue; }).slice(0, 5);
  })();
  var maxRev = Math.max.apply(null, topClients.map(function(c){ return c.revenue; })) || 1;

  return (
    <div style={{ width:"100%", minWidth:0 }}>

      {/* Plan limit banner */}
      {hitLimit && (
        <div style={{ background:"#FEF3C7", border:"1px solid #F59E0B", borderRadius:12, padding:"14px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
          <div>
            <div style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:"#92400E", marginBottom:2 }}>Free plan limit reached</div>
            <div style={{ fontFamily:fUI, fontSize:13, color:"#B45309", fontWeight:300 }}>You have created {invoiceCount} invoices. Upgrade to create unlimited invoices and proposals.</div>
          </div>
          <Btn onClick={function(){ setSection("settings"); setSettingsTab("billing"); }}>Upgrade</Btn>
        </div>
      )}

      {/* Header row with greeting + search + new button */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32, gap:16 }}>
        <div>
          <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,3vw,38px)", fontWeight:400, color:C.ink, letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:8 }}>{greetingFull}</h1>
          <p style={{ fontFamily:fMono, fontSize:11, color:C.faint, letterSpacing:"0.04em" }}>{dateStr} . {clients.length} clients . {overdueCount} overdue</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }} className="nav-desktop">
          <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface, borderRadius:9, padding:"8px 14px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
            <Icon name="users" size={13} color={C.faint} />
            <span style={{ fontFamily:fUI, fontSize:13, color:C.faint }}>Search...</span>
            <span style={{ fontFamily:fMono, fontSize:10, color:C.faint, background:C.bg, borderRadius:4, padding:"1px 5px", marginLeft:12 }}>CmdK</span>
          </div>
          <div style={{ width:32, height:32, borderRadius:8, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 4px rgba(10,22,40,0.05)", cursor:"pointer" }}>
            <Icon name="clock" size={14} color={C.faint} />
          </div>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:C.ink, color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:500 }}>
            + New <span style={{ opacity:0.5, fontSize:11 }}>v</span>
          </button>
        </div>
      </div>

      {/* 4-col KPI row - desktop only */}
      <div className="nav-desktop" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:24 }}>
        <StatCard label="Revenue (May)" value="€14,280" sub="+18% vs April" subColor={C.green} spark={SPARK_UP} sparkColor={C.accent} />
        <StatCard label="Outstanding"   value="€4,320"  sub="4 overdue"    subColor={C.red}   spark={SPARK_DOWN} sparkColor={C.red} />
        <StatCard label="Paid (May)"    value="€9,960"  sub="+24% vs April" subColor={C.green} spark={SPARK_UP} sparkColor={C.green} />
        <StatCard label="Open proposals" value="6"      sub="2 awaiting reply" subColor={C.gold} spark={SPARK_FLAT} sparkColor={C.gold} />
      </div>

      {/* Mobile KPI - 2-col */}
      <div className="dash-kpi-grid" style={{ display:"none", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <StatCard label="Revenue" value="€14,280" sub="+18%" subColor={C.green} spark={SPARK_UP} sparkColor={C.accent} />
        <StatCard label="Outstanding" value="€4,320" sub="4 overdue" subColor={C.red} spark={SPARK_DOWN} sparkColor={C.red} />
      </div>

      {/* Main body - 3-col on desktop */}
      <div className="dash-overview-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 300px", gap:18 }}>

        {/* Activity Overview chart */}
        <div style={{ background:C.surface, borderRadius:16, padding:"20px 22px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink }}>Activity overview</span>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {[["Revenue",C.accent],["Paid",C.green],["Outstanding",C.red]].map(function(pair) {
                return (
                  <div key={pair[0]} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:pair[1] }} />
                    <span style={{ fontFamily:fUI, fontSize:11, color:C.muted }}>{pair[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <LineChart
            series={[
              { key:"rev",  color:C.accent, data:chartRev  },
              { key:"paid", color:C.green,  data:chartPaid },
              { key:"out",  color:C.red,    data:chartOut  },
            ]}
            labels={chartLabels}
            w={480} h={170}
          />
        </div>

        {/* Bottom-left: Recent activity + Cash flow stacked */}
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* Recent activity */}
          <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.04)", flex:1 }}>
            <div style={{ padding:"18px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink }}>Recent activity</span>
              <button onClick={function(){ setSection("invoices"); }} style={{ background:"none", border:"none", fontFamily:fUI, fontSize:11, color:C.accent, cursor:"pointer" }}>View all activity</button>
            </div>
            {activity.map(function(a, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", borderTop:"1px solid "+C.borderLt }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:a.color+"12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={a.icon} size={12} color={a.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:13, fontWeight:500, color:C.ink }}>{a.label}</div>
                    <div style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{a.sub}</div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:10, color:C.faint, flexShrink:0 }}>{a.time}</span>
                  <span style={{ fontFamily:fUI, fontSize:11, color:C.accent, cursor:"pointer", flexShrink:0 }}>Go</span>
                </div>
              );
            })}
          </div>

          {/* Cash flow */}
          <div style={{ background:C.surface, borderRadius:16, padding:"18px 20px", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink }}>Cash flow</span>
            </div>
            <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:400, color:C.ink, letterSpacing:"-0.03em", marginBottom:2 }}>{kpiRevenue}</div>
            <div style={{ fontFamily:fUI, fontSize:11, color:C.faint, marginBottom:14 }}>Total cash flow</div>
            <BarChart inData={cfIn} outData={cfOut} labels={chartData ? chartData.weeks : CASHFLOW_LABELS} w={300} h={110} />
          </div>
        </div>

        {/* Right column - dark attention panel + top clients */}
        <div style={{ display:"flex", flexDirection:"column", gap:18, minWidth:0 }}>

          {/* What needs attention - dark card */}
          <div style={{ background:C.navy, borderRadius:16, padding:"20px", boxShadow:"0 4px 16px rgba(10,22,40,0.14)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontFamily:fUI, fontSize:13, fontWeight:600, color:"rgba(240,244,248,0.9)" }}>What needs attention</span>
              {attention.length > 0 && <span style={{ fontFamily:fMono, fontSize:10, color:C.red, background:"rgba(201,72,64,0.15)", borderRadius:4, padding:"2px 6px" }}>{attention.length}</span>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {attention.map(function(item) {
                var ac = attnColor[item.type] || C.gold;
                return (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:ac+"20", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={item.type==="overdue" ? "clock" : item.type==="viewed" ? "eye" : "send"} size={12} color={ac} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:fUI, fontSize:12, fontWeight:500, color:"rgba(240,244,248,0.85)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                      <div style={{ fontFamily:fUI, fontSize:11, color:"rgba(240,244,248,0.35)", marginTop:1 }}>{item.sub}</div>
                    </div>
                    <button onClick={function(){ setDismissed(function(d){ return d.concat([item.id]); }); }} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(240,244,248,0.7)", borderRadius:6, padding:"4px 9px", cursor:"pointer", fontFamily:fUI, fontSize:11, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>
                      {item.cta}
                    </button>
                  </div>
                );
              })}
              {attention.length === 0 && (
                <div style={{ textAlign:"center", padding:"16px 0", fontFamily:fUI, fontSize:13, color:"rgba(240,244,248,0.3)" }}>All clear OK</div>
              )}
            </div>
          </div>

          {/* Top clients by revenue */}
          <div style={{ background:C.surface, borderRadius:16, padding:"18px 20px", boxShadow:"0 1px 4px rgba(10,22,40,0.04)", flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontFamily:fUI, fontSize:13, fontWeight:600, color:C.ink }}>Top clients by revenue</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {topClients.map(function(c) {
                var pct = Math.round(c.revenue / maxRev * 100);
                return (
                  <div key={c.name}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontFamily:fUI, fontSize:13, color:C.ink }}>{c.name}</span>
                      <span style={{ fontFamily:fMono, fontSize:12, color:C.ink }}>{"€"+c.revenue.toLocaleString()}</span>
                    </div>
                    <div style={{ height:3, background:C.borderLt, borderRadius:2 }}>
                      <div style={{ height:"100%", width:pct+"%", background:C.accent, borderRadius:2, transition:"width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={function(){ setSection("clients"); }} style={{ background:"none", border:"none", fontFamily:fUI, fontSize:11, color:C.accent, cursor:"pointer", marginTop:16, padding:0 }}>View all clients</button>
          </div>
        </div>

      </div>

      {/* Mobile fallback - simple activity feed */}
      <div className="nav-burger" style={{ display:"none", marginTop:16 }}>
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
          {activity.slice(0,3).map(function(a, i) {
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:i<2 ? "1px solid "+C.borderLt : "none" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:fUI, fontSize:13, fontWeight:500, color:C.ink }}>{a.label}</div>
                  <div style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{a.sub}</div>
                </div>
                <span style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -- Clients -------------------------------------------------------------------
function DClients(props) {
  var setClientId = props.setClientId;
  var setPage = props.setPage;
  var userId = props.userId;

  var [clients, setClients] = useState([]);
  var [loading, setLoading] = useState(false);
  var [search, setSearch] = useState("");
  var [adding, setAdding] = useState(false);
  var [newName, setNewName] = useState("");
  var [newEmail, setNewEmail] = useState("");
  var [newCity, setNewCity] = useState("");
  var [saving, setSaving] = useState(false);
  var [addError, setAddError] = useState("");

  function loadClients() {
    if (!userId) return;
    setLoading(true);
    fetch("/api/db?table=clients&user_id=" + encodeURIComponent(userId))
      .then(function(r) { return r.json(); })
      .then(function(data) { setClients(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(function() { setLoading(false); });
  }

  useEffect(function() { loadClients(); }, [userId]);

  var stColor = { active:C.green, overdue:C.red, prospect:C.blue };
  var filtered = clients.filter(function(c){
    return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  });

  function addClient() {
    if (!newName.trim()) return;
    setAddError("");
    if (!userId) { setAddError("Sign in to save clients."); return; }
    setSaving(true);
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "clients",
        action: "insert",
        user_id: userId,
        payload: {
          name: newName.trim(),
          email: newEmail.trim() || null,
          city: newCity.trim() || null,
          avatar: newName.trim().slice(0,2).toUpperCase(),
          color: "#6E7A8A",
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) { setAddError(data.error); setSaving(false); return; }
      setSaving(false);
      setAdding(false);
      setNewName(""); setNewEmail(""); setNewCity("");
      loadClients();
    })
    .catch(function(err) {
      setSaving(false);
      setAddError("Failed: " + err.message);
    });
  }

  return (
    <div>
      <SectionHeader title="Clients" action={
        <Btn onClick={function(){ setAdding(function(a){ return !a; }); }}>
          {adding ? "Cancel" : "+ Add client"}
        </Btn>
      } />

      {adding && (
        <div style={{ background:C.surface, borderRadius:14, padding:"20px 22px", marginBottom:16, boxShadow:"0 1px 6px rgba(10,22,40,0.07)" }}>
          <div style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, marginBottom:14 }}>New client</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={{ display:"block", marginBottom:4, fontFamily:fUI, fontSize:12, color:C.muted }}>Name *</label>
              <input value={newName} onChange={function(e){ setNewName(e.target.value); }} placeholder="Studio Verde GmbH" style={{ width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:8, padding:"9px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" }} />
            </div>
            <div>
              <label style={{ display:"block", marginBottom:4, fontFamily:fUI, fontSize:12, color:C.muted }}>Email</label>
              <input value={newEmail} onChange={function(e){ setNewEmail(e.target.value); }} placeholder="hello@studio.de" style={{ width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:8, padding:"9px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" }} />
            </div>
            <div>
              <label style={{ display:"block", marginBottom:4, fontFamily:fUI, fontSize:12, color:C.muted }}>City</label>
              <input value={newCity} onChange={function(e){ setNewCity(e.target.value); }} placeholder="Berlin" style={{ width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:8, padding:"9px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" }} />
            </div>
          </div>
          <Btn onClick={addClient}>{saving ? "Saving..." : "Add client"}</Btn>
          {addError && <div style={{ fontFamily:fUI, fontSize:13, color:C.red, marginTop:10 }}>{addError}</div>}
        </div>
      )}

      <div style={{ position:"relative", marginBottom:20 }}>
        <input value={search} onChange={function(e){ setSearch(e.target.value); }} placeholder="Search..." style={{ width:"100%", boxSizing:"border-box", border:"none", borderRadius:12, padding:"11px 14px 11px 38px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.surface, outline:"none", boxShadow:"0 1px 4px rgba(10,22,40,0.05)" }} />
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}><Icon name="users" size={14} color={C.faint} /></div>
      </div>

      <div style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
        {loading && (
          <div style={{ padding:"32px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint }}>Loading...</div>
        )}
        {!loading && filtered.map(function(c, i) {
          var col = c.color || "#6E7A8A";
          var av  = c.avatar || (c.name||"?").slice(0,2).toUpperCase();
          return (
            <div key={c.id} onClick={function(){ setClientId(c); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"20px 22px", borderBottom:i<filtered.length-1 ? "1px solid "+C.borderLt : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = C.bg; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width:40, height:40, borderRadius:12, background:col+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:col, fontWeight:700, flexShrink:0 }}>{av}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:600, color:C.ink, marginBottom:3 }}>{c.name}</div>
                <div style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{c.city}{c.email ? " . "+c.email : ""}</div>
              </div>
              {(c.balance||0) > 0
                ? <div style={{ fontFamily:fMono, fontSize:13, color:C.red, fontWeight:500, flexShrink:0 }}>{"€"+(c.balance||0).toLocaleString()}</div>
                : <Dot color={stColor[c.status]||C.muted}>{c.status||"active"}</Dot>
              }
            </div>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div style={{ padding:"48px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>
            {search ? "No clients match \""+search+"\"" : userId ? "No clients yet. Add your first one above." : "Sign in to see your clients."}
          </div>
        )}
      </div>
    </div>
  );
}
function DClientDetail(props) {
  var c = props.client;
  var setClientId = props.setClientId;
  var userId = props.userId;
  var clientInvoices = (props.invoices||[]).filter(function(i){ return i.client_id===c.id; });
  var clientProposals = (props.proposals||[]).filter(function(p){ return p.client_id===c.id; });
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red };
  var pColors = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };

  var [editing, setEditing] = useState(false);
  var [editName, setEditName] = useState(c.name || "");
  var [editEmail, setEditEmail] = useState(c.email || "");
  var [editCity, setEditCity] = useState(c.city || "");
  var [saving, setSaving] = useState(false);
  var [deleting, setDeleting] = useState(false);

  function saveEdit() {
    if (!editName.trim()) return;
    setSaving(true);
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table:"clients", action:"update", id:c.id, user_id:userId, payload:{ name:editName.trim(), email:editEmail.trim()||null, city:editCity.trim()||null } }),
    })
    .then(function(r){ return r.json(); })
    .then(function(){ setSaving(false); setEditing(false); setClientId(null); })
    .catch(function(){ setSaving(false); });
  }

  var [confirmDelete, setConfirmDelete] = useState(false);

  function deleteClient() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table:"clients", action:"delete", id:c.id, user_id:userId }),
    })
    .then(function(){ setClientId(null); })
    .catch(function(){ setDeleting(false); setConfirmDelete(false); });
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:8, padding:"9px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
  var lbl = { display:"block", marginBottom:4, fontFamily:fUI, fontSize:12, color:C.muted };

  return (
    <div style={{ maxWidth:640 }}>
      <button onClick={function(){ setClientId(null); }} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontFamily:fUI, fontSize:13, marginBottom:28, padding:0 }}>Back</button>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:(c.color||"#6E7A8A")+"16", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:16, color:c.color||"#6E7A8A", fontWeight:700 }}>{c.avatar||(c.name||"?").slice(0,2).toUpperCase()}</div>
          <div>
            <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:400, color:C.ink, letterSpacing:"-0.025em", marginBottom:2 }}>{c.name}</h2>
            <p style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{c.city}{c.email ? " . "+c.email : ""}</p>
          </div>
        </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <Btn variant="secondary" sm={true} onClick={function(){ setEditing(function(e){ return !e; }); }}>{editing ? "Cancel" : "Edit"}</Btn>
            {confirmDelete
              ? (
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontFamily:fUI, fontSize:12, color:C.red }}>Sure?</span>
                  <Btn variant="danger" sm={true} onClick={deleteClient}>{deleting ? "..." : "Yes, delete"}</Btn>
                  <Btn variant="secondary" sm={true} onClick={function(){ setConfirmDelete(false); }}>No</Btn>
                </div>
              )
              : <Btn variant="secondary" sm={true} onClick={deleteClient}>Delete</Btn>
            }
          </div>
      </div>

      {editing && (
        <div style={{ background:C.surface, borderRadius:14, padding:"20px 22px", marginBottom:20, boxShadow:"0 1px 6px rgba(10,22,40,0.06)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
            <div><label style={lbl}>Name *</label><input value={editName} onChange={function(e){ setEditName(e.target.value); }} style={inp} /></div>
            <div><label style={lbl}>Email</label><input value={editEmail} onChange={function(e){ setEditEmail(e.target.value); }} style={inp} /></div>
            <div><label style={lbl}>City</label><input value={editCity} onChange={function(e){ setEditCity(e.target.value); }} style={inp} /></div>
          </div>
          <Btn onClick={saveEdit}>{saving ? "Saving..." : "Save changes"}</Btn>
        </div>
      )}

      <div className="dash-kpi-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <StatCard label="Total billed" value={"€"+(c.paid||0).toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+(c.balance||0).toLocaleString()} color={(c.balance||0)>0?C.red:C.green} />
      </div>

      {clientInvoices.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", marginBottom:14, boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
          <div style={{ padding:"14px 20px 10px", fontFamily:fUI, fontSize:13, fontWeight:600, color:C.ink }}>Invoices</div>
          {clientInvoices.map(function(inv, i) {
            return (
              <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px", borderTop:"1px solid "+C.borderLt }}>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.ink, flex:1 }}>{inv.inv_number}</div>
                <div style={{ fontFamily:fMono, fontSize:13, fontWeight:500, color:C.ink }}>{"€"+(inv.amount_gross||0).toLocaleString()}</div>
                <Dot color={stColor[inv.status]||C.muted}>{inv.status}</Dot>
              </div>
            );
          })}
        </div>
      )}
      {clientProposals.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
          <div style={{ padding:"14px 20px 10px", fontFamily:fUI, fontSize:13, fontWeight:600, color:C.ink }}>Proposals</div>
          {clientProposals.map(function(p, i) {
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px", borderTop:"1px solid "+C.borderLt }}>
                <div style={{ flex:1, fontFamily:fUI, fontSize:13, color:C.ink }}>{p.title}</div>
                <div style={{ fontFamily:fMono, fontSize:13, fontWeight:500, color:C.ink }}>{"€"+(p.value||0).toLocaleString()}</div>
                <Dot color={pColors[p.status]||C.muted}>{p.status}</Dot>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -- Invoices - calm overview, not admin table ---------------------------------
function DInvoices(props) {
  var invoices = props.invoices || MOCK_INVOICES;
  var clients  = props.clients  || MOCK_CLIENTS;
  var db = props.db;
  var userId = props.userId;
  var [filter, setFilter] = useState("all");
  var [updating, setUpdating] = useState({});
  var [localStatus, setLocalStatus] = useState({});
  var [emailSent, setEmailSent] = useState({});
  var clientMap = {};
  clients.forEach(function(c){ clientMap[c.id] = c; });

  var [emailErrors, setEmailErrors] = useState({});

  function sendReminder(inv) {
    var client = clientMap[inv.client_id] || {};
    if (!client.email) {
      setEmailErrors(function(s){ return Object.assign({}, s, { [inv.id]: "No email for this client" }); });
      setTimeout(function(){ setEmailErrors(function(s){ var n=Object.assign({},s); delete n[inv.id]; return n; }); }, 4000);
      return;
    }
    setEmailSent(function(s){ return Object.assign({}, s, { [inv.id]: "sending" }); });
    var user = null;
    try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reminder",
        to: client.email,
        toName: client.name || "",
        fromName: (user && user.email) ? user.email : "",
        senderEmail: (user && user.email) ? user.email : "",
        invoiceNum: inv.inv_number || "",
        amount: inv.amount_gross ? "EUR " + inv.amount_gross.toLocaleString() : "",
        dueDate: inv.due_date || "",
        portalUrl: "",
      }),
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      setEmailSent(function(s){ return Object.assign({}, s, { [inv.id]: data.sent ? "sent" : "queued" }); });
      setTimeout(function(){ setEmailSent(function(s){ var n=Object.assign({},s); delete n[inv.id]; return n; }); }, 4000);
    })
    .catch(function(){
      setEmailSent(function(s){ return Object.assign({}, s, { [inv.id]: "error" }); });
      setTimeout(function(){ setEmailSent(function(s){ var n=Object.assign({},s); delete n[inv.id]; return n; }); }, 4000);
    });
  }

  function getStatus(inv) { return localStatus[inv.id] || inv.status || "draft"; }

  function updateStatus(inv, newStatus) {
    // Optimistic update immediately
    setLocalStatus(function(s){ return Object.assign({}, s, { [inv.id]: newStatus }); });
    setUpdating(function(s){ return Object.assign({}, s, { [inv.id]: true }); });
    if (!db || !userId) {
      // Demo mode - just update locally
      setUpdating(function(s){ return Object.assign({}, s, { [inv.id]: false }); });
      return;
    }
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table:"invoices", action:"update", id:inv.id, user_id:userId, payload:{ status:newStatus } }),
    })
    .then(function(r){ return r.json(); })
    .then(function(){ setUpdating(function(s){ return Object.assign({}, s, { [inv.id]: false }); }); })
    .catch(function(){ setUpdating(function(s){ return Object.assign({}, s, { [inv.id]: false }); }); });
  }

  var enriched = invoices.map(function(inv){ return Object.assign({}, inv, { _status: getStatus(inv) }); });
  var filtered = enriched.filter(function(inv){
    if (filter==="outstanding") return inv._status==="sent" || inv._status==="overdue";
    if (filter==="paid") return inv._status==="paid";
    if (filter==="draft") return inv._status==="draft";
    return true;
  });
  var outstanding = enriched.filter(function(i){ return i._status==="sent"||i._status==="overdue"; }).reduce(function(s,i){ return s+(i.amount_gross||0); }, 0);
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red, draft:C.muted };

  return (
    <div>
      <SectionHeader title="Invoices" action={
        outstanding > 0
          ? <div style={{ display:"flex", alignItems:"center", gap:6, background:C.redSoft, borderRadius:9, padding:"7px 13px" }}>
              <span style={{ fontFamily:fMono, fontSize:11, color:C.red }}>{"€"+outstanding.toLocaleString()+" due"}</span>
            </div>
          : null
      } />
      <div style={{ display:"flex", gap:2, marginBottom:24 }}>
        {[["all","All"],["draft","Draft"],["outstanding","Pending"],["paid","Paid"]].map(function(pair) {
          var active = filter===pair[0];
          return (
            <button key={pair[0]} onClick={function(){ setFilter(pair[0]); }} style={{ background:active ? C.ink : "transparent", color:active ? "#fff" : C.muted, border:"none", padding:"7px 14px", borderRadius:99, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:active?500:400, transition:"all 0.12s" }}>
              {pair[1]}
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.length === 0 && (
          <div style={{ background:C.surface, borderRadius:16, padding:"48px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>
            {filter==="all" ? "No invoices yet. Create one in the Generator." : "No "+filter+" invoices."}
          </div>
        )}
        {filtered.map(function(inv) {
          var st = inv._status;
          var isOverdue = st==="overdue";
          var isDraft = st==="draft";
          var isSent = st==="sent";
          var isPaid = st==="paid";
          var client = clientMap[inv.client_id] || {};
          var clientName = (typeof client === "object" ? client.name : client) || inv.client_name || "Unknown";
          var busy = updating[inv.id];
          var eSent = emailSent[inv.id];
          return (
            <div key={inv.id} style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:isOverdue ? "0 0 0 1.5px "+C.red+"30, 0 2px 8px rgba(10,22,40,0.04)" : "0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 20px" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, marginBottom:3 }}>{clientName}</div>
                  <div style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>
                    {inv.inv_number || "-"}{inv.due_date ? " . due "+inv.due_date : ""}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:fMono, fontSize:16, fontWeight:600, color:isOverdue?C.red:isPaid?C.green:C.ink, marginBottom:4 }}>
                    {"€"+((inv.amount_gross||0)).toLocaleString()}
                  </div>
                  <Dot color={stColor[st]||C.muted}>{st}</Dot>
                </div>
              </div>
              {/* Status action row */}
              {!isPaid && (
                <div style={{ padding:"0 20px 16px", display:"flex", gap:8, flexWrap:"wrap" }}>
                  {isDraft && (
                    <Btn variant="ghost" sm={true} onClick={function(){ updateStatus(inv, "sent"); }}>
                      {busy ? "..." : "Mark as sent"}
                    </Btn>
                  )}
                  {(isSent || isOverdue) && (
                    <Btn variant="ghost" sm={true} onClick={function(){ updateStatus(inv, "paid"); }}>
                      {busy ? "..." : "Mark as paid"}
                    </Btn>
                  )}
                  {isSent && (
                    <Btn variant="secondary" sm={true} onClick={function(){ updateStatus(inv, "overdue"); }}>
                      {busy ? "..." : "Mark overdue"}
                    </Btn>
                  )}
                  {isOverdue && (
                    <div>
                      <Btn variant="danger" sm={true} onClick={function(){ sendReminder(inv); }}>
                        {eSent === "sending" ? "Sending..." : eSent === "sent" ? "Sent!" : eSent === "queued" ? "Queued" : "Send reminder"}
                      </Btn>
                      {emailErrors[inv.id] && <div style={{ fontFamily:fUI, fontSize:12, color:C.red, marginTop:4 }}>{emailErrors[inv.id]}</div>}
                    </div>
                  )}
                </div>
              )}
              {isPaid && (
                <div style={{ padding:"0 20px 14px", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:fUI, fontSize:13, color:C.green }}>Settled</span>
                  {acted[inv.id] === "confirm-delete"
                    ? (
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <span style={{ fontFamily:fUI, fontSize:12, color:C.red }}>Delete?</span>
                        <Btn variant="danger" sm={true} onClick={function(){
                          if (db) db.remove(inv.id);
                          act(inv.id, "deleted");
                        }}>Yes</Btn>
                        <Btn variant="secondary" sm={true} onClick={function(){ act(inv.id, null); }}>No</Btn>
                      </div>
                    )
                    : <Btn variant="secondary" sm={true} onClick={function(){ act(inv.id, "confirm-delete"); }}>Delete</Btn>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Proposals - intelligence layer, simplified --------------------------------
export function DProposals(props) {
  var onConvert = props.onConvert;
  var proposals = props.proposals || MOCK_PROPOSALS;
  var clients   = props.clients   || MOCK_CLIENTS;
  var db = props.db;
  var userId = props.userId;
  var [followUpSent, setFollowUpSent] = useState({});
  var [sharePhase, setSharePhase] = useState({});
  var clientMap = {};
  clients.forEach(function(c){ clientMap[c.id] = c; });

  function shareProposal(p) {
    setSharePhase(function(s){ return Object.assign({}, s, { [p.id]: "saving" }); });
    fetch("/api/share-proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal_id: p.id, title: p.title, value: p.value, user_id: userId }),
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.id) {
        var url = window.location.origin + "/?proposal=" + data.id;
        navigator.clipboard.writeText(url).catch(function(){});
        setSharePhase(function(s){ return Object.assign({}, s, { [p.id]: "copied" }); });
        setTimeout(function(){ setSharePhase(function(s){ return Object.assign({}, s, { [p.id]: "idle" }); }); }, 3000);
      } else {
        setSharePhase(function(s){ return Object.assign({}, s, { [p.id]: "idle" }); });
      }
    })
    .catch(function(){ setSharePhase(function(s){ return Object.assign({}, s, { [p.id]: "idle" }); }); });
  }

  var [deletingId, setDeletingId] = useState(null);
  var [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function deleteProposal(p) {
    if (confirmDeleteId !== p.id) { setConfirmDeleteId(p.id); return; }
    setDeletingId(p.id); setConfirmDeleteId(null);
    if (db && userId) {
      db.remove(p.id).then(function(){ setDeletingId(null); }).catch(function(){ setDeletingId(null); });
    }
  }

  var [followUpErrors, setFollowUpErrors] = useState({});

  function sendFollowUp(p) {
    var client = clientMap[p.client_id] || {};
    var clientEmail = typeof client === "object" ? client.email : null;
    if (!clientEmail) {
      setFollowUpErrors(function(s){ return Object.assign({}, s, { [p.id]: "No email for this client" }); });
      setTimeout(function(){ setFollowUpErrors(function(s){ var n=Object.assign({},s); delete n[p.id]; return n; }); }, 4000);
      return;
    }
    setFollowUpSent(function(s){ return Object.assign({}, s, { [p.id]: "sending" }); });
    var user = null;
    try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
    fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "followup",
        to: clientEmail,
        toName: (typeof client === "object" ? client.name : "") || "",
        fromName: (user && user.email) ? user.email : "",
        senderEmail: (user && user.email) ? user.email : "",
        proposalTitle: p.title || "",
        portalUrl: "",
      }),
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      setFollowUpSent(function(s){ return Object.assign({}, s, { [p.id]: data.sent ? "sent" : "queued" }); });
      setTimeout(function(){ setFollowUpSent(function(s){ var n=Object.assign({},s); delete n[p.id]; return n; }); }, 4000);
    })
    .catch(function(){
      setFollowUpSent(function(s){ return Object.assign({}, s, { [p.id]: "error" }); });
      setTimeout(function(){ setFollowUpSent(function(s){ var n=Object.assign({},s); delete n[p.id]; return n; }); }, 4000);
    });
  }
  var won = proposals.filter(function(p){ return p.status==="won"; }).length;
  var total = proposals.filter(function(p){ return p.status!=="draft"; }).length;
  var winRate = total > 0 ? Math.round(won/total*100) : 0;
  var stColor = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };

  function signal(p) {
    if (p.status==="viewed" && p.view_count >= 5) return { msg:"Viewed "+p.view_count+"x - strong signal.", cta:"Follow up", urgent:true };
    if ((p.status==="sent"||p.status==="viewed") && p.days_since >= 3) return { msg:"No reply in "+p.days_since+" days.", cta:"Follow up", urgent:false };
    return null;
  }

  return (
    <div>
      <SectionHeader title="Proposals" sub={"Win rate " + winRate + "% . " + proposals.length + " total"} />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {proposals.length === 0 && (
          <div style={{ background:C.surface, borderRadius:16, padding:"48px 32px", textAlign:"center", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
            <div style={{ fontFamily:fSerif, fontSize:20, fontWeight:400, color:C.ink, marginBottom:8 }}>No proposals yet.</div>
            <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, marginBottom:20, lineHeight:1.6 }}>Write your first AI proposal in under 60 seconds.</div>
            <Btn onClick={function(){ if (onConvert) onConvert(null); }}>Create proposal</Btn>
          </div>
        )}
        {proposals.map(function(p) {
          var sig = signal(p);
          var sc = stColor[p.status]||C.muted;
          return (
            <div key={p.id} style={{ background:C.surface, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 6px rgba(10,22,40,0.05)" }}>
              <div style={{ padding:"22px 22px 18px" }}>
                {/* Title + amount - the two most important things */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
                  <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink, lineHeight:1.3, flex:1 }}>{p.title}</div>
                  <div style={{ fontFamily:fMono, fontSize:15, fontWeight:600, color:C.ink, flexShrink:0 }}>{"€"+p.value.toLocaleString()}</div>
                </div>
                {/* Client + status - quieter */}
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{clientMap[p.client_id]||""}</span>
                  <Dot color={sc}>{p.status}</Dot>
                  {p.view_count > 0 && <span style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{p.view_count} views</span>}
                </div>
              </div>
              {/* Signal strip - only when relevant */}
              {sig && (
                <div style={{ margin:"0 14px 14px", padding:"12px 16px", background:sig.urgent ? C.goldSoft : C.accentSoft, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                  <span style={{ fontFamily:fUI, fontSize:13, color:C.inkLight }}>{sig.msg}</span>
                  <div>
                    <Btn variant="ghost" sm={true} onClick={function(){ sendFollowUp(p); }}>
                      {followUpSent[p.id] === "sending" ? "Sending..." : followUpSent[p.id] === "sent" ? "Sent!" : followUpSent[p.id] === "queued" ? "Queued" : sig.cta}
                    </Btn>
                    {followUpErrors[p.id] && <div style={{ fontFamily:fUI, fontSize:12, color:C.red, marginTop:4 }}>{followUpErrors[p.id]}</div>}
                  </div>
                </div>
              )}
              {/* Actions row */}
              <div style={{ padding:"0 22px 18px", display:"flex", gap:8, flexWrap:"wrap" }}>
                {p.status==="won" && (
                  <Btn variant="ghost" sm={true} onClick={function(){ if(onConvert) onConvert(p); }}>To invoice</Btn>
                )}
                <Btn variant="secondary" sm={true} onClick={function(){ shareProposal(p); }}>
                  {sharePhase[p.id] === "saving" ? "..." : sharePhase[p.id] === "copied" ? "Link copied!" : "Share link"}
                </Btn>
                {confirmDeleteId === p.id
                  ? (
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <span style={{ fontFamily:fUI, fontSize:12, color:C.red }}>Sure?</span>
                      <Btn variant="danger" sm={true} onClick={function(){ deleteProposal(p); }}>{deletingId === p.id ? "..." : "Delete"}</Btn>
                      <Btn variant="secondary" sm={true} onClick={function(){ setConfirmDeleteId(null); }}>No</Btn>
                    </div>
                  )
                  : <Btn variant="secondary" sm={true} onClick={function(){ deleteProposal(p); }}>Delete</Btn>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Brand Kits ----------------------------------------------------------------
export function DBrandKits(props) {
  var userId = props.userId;
  var db = props.db;

  // Load real kits from DB, fall back to mock for demo
  var dbKits = db ? db.rows : [];
  var kits = userId && dbKits.length > 0 ? dbKits : (userId && db && !db.loading ? [] : MOCK_BRAND_KITS);

  var [selId, setSelId] = useState(null);
  var sel = kits.find(function(k){ return k.id===selId; }) || kits[0] || null;

  var [editName,  setEditName]  = useState("");
  var [editColor, setEditColor] = useState("#17A99E");
  var [editFont,  setEditFont]  = useState("DM Sans");
  var [saved,     setSaved]     = useState(false);
  var [saving,    setSaving]    = useState(false);

  // Sync edit fields when selection changes
  useEffect(function() {
    var k = kits.find(function(k){ return k.id===selId; }) || kits[0] || null;
    if (k) { setEditName(k.name||""); setEditColor(k.primary_color||"#17A99E"); setEditFont(k.font||"DM Sans"); }
  }, [selId, kits.length]);

  function save() {
    if (!sel) return;
    setSaving(true);
    var payload = { name:editName, primary_color:editColor, font:editFont };
    if (userId && db) {
      // Real kit from DB - update it
      if (sel.user_id) {
        db.update(sel.id, payload).then(function(){ setSaving(false); setSaved(true); setTimeout(function(){ setSaved(false); }, 2000); });
      } else {
        // Mock kit - insert as new real kit
        db.insert(Object.assign({ logo_text: editName.slice(0,2).toUpperCase() }, payload))
          .then(function(){ setSaving(false); setSaved(true); setTimeout(function(){ setSaved(false); }, 2000); });
      }
    } else {
      setSaving(false); setSaved(true); setTimeout(function(){ setSaved(false); }, 2000);
    }
  }

  function addKit() {
    if (userId && db) {
      db.insert({ name:"New Kit", primary_color:C.accent, font:"DM Sans", logo_text:"NK" })
        .then(function(data){ if (data && data.id) setSelId(data.id); });
    } else {
      // Demo mode - local only
      var id = "local-" + Date.now();
      setSelId(id);
    }
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"none", borderRadius:9, padding:"10px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
  var lbl = { display:"block", marginBottom:5, fontFamily:fMono, fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.faint };

  return (
    <div>
      <SectionHeader title="Brand Kits" />
      <div className="dash-brandkit-grid" style={{ display:"grid", gridTemplateColumns:"170px 1fr", gap:18 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {kits.map(function(kit) {
            var active = sel && sel.id === kit.id;
            return (
              <div key={kit.id} onClick={function(){ setSelId(kit.id); }} style={{ background:active?C.surface:"transparent", borderRadius:12, padding:"10px 12px", cursor:"pointer", transition:"all 0.12s", boxShadow:active?"0 1px 6px rgba(10,22,40,0.07)":"none", outline:active?"1.5px solid "+C.accent+"35":"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:6, background:kit.primary_color||"#17A99E", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:10, color:"#fff", fontWeight:700, flexShrink:0 }}>{kit.logo_text||(kit.name||"?").slice(0,2).toUpperCase()}</div>
                  <div style={{ fontFamily:fUI, fontSize:13, fontWeight:active?500:400, color:active?C.ink:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button onClick={addKit} style={{ background:"none", border:"1.5px dashed "+C.border, borderRadius:12, padding:"10px 12px", cursor:"pointer", color:C.faint, fontFamily:fUI, fontSize:13, textAlign:"left" }}>+ New</button>
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
              <Btn onClick={save} variant={saved?"secondary":"primary"}>{saving ? "Saving..." : saved ? "Saved" : "Save kit"}</Btn>
            </div>
            {/* Preview */}
            <div style={{ background:C.bg, borderRadius:16, padding:"20px", boxShadow:"0 1px 4px rgba(10,22,40,0.04)" }}>
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 22px", boxShadow:"0 2px 16px rgba(10,22,40,0.08)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:editColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:11, color:"#fff", fontWeight:700 }}>{(sel&&sel.logo_text)||editName.slice(0,2).toUpperCase()||"B"}</div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:fMono, fontSize:9, color:C.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice</div>
                    <div style={{ fontFamily:fMono, fontSize:12, color:C.ink, fontWeight:500, marginTop:1 }}>DE-2026-001</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'"+editFont+"', sans-serif", fontSize:15, fontWeight:700, color:C.ink, marginBottom:14 }}>{editName}</div>
                <div style={{ borderTop:"2px solid "+editColor, paddingTop:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted, marginBottom:6 }}><span>Brand Identity</span><span style={{ color:C.ink, fontWeight:500 }}>EUR 1,800</span></div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:13, fontWeight:700, color:C.ink, marginTop:10, paddingTop:10, borderTop:"1px solid "+C.borderLt }}><span>Total</span><span style={{ color:editColor }}>EUR 4,998</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -- Settings helper styles (module-level so they don't cause re-renders) ------
var S_inp = { width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:9, padding:"10px 13px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
var S_lbl = { display:"block", marginBottom:5, fontFamily:fUI, fontSize:12, color:C.muted, fontWeight:400 };

function SToggle(props) {
  return (
    <div onClick={function(){ props.onChange(!props.value); }} style={{ width:40, height:22, borderRadius:99, background:props.value ? C.accent : C.border, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:props.value ? 21 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
    </div>
  );
}

function SSaveBtn(props) {
  var done = props.saved === props.section;
  var isSaving = props.saving && !done;
  return (
    <button onClick={function(){ props.onSave(props.section); }} disabled={props.saving} style={{ background:done ? C.green : C.accent, color:"#fff", border:"none", padding:"10px 22px", borderRadius:9, cursor:props.saving?"not-allowed":"pointer", fontFamily:fUI, fontSize:14, fontWeight:500, transition:"background 0.15s", boxShadow:done?"none":"0 2px 8px rgba(20,153,144,0.18)", opacity:isSaving?0.7:1 }}>
      {done ? "OK Saved" : isSaving ? "Saving..." : "Save changes"}
    </button>
  );
}

function SCard(props) {
  return (
    <div style={{ background:C.surface, borderRadius:16, padding:"24px 26px", boxShadow:"0 1px 4px rgba(10,22,40,0.05)", marginBottom:16 }}>
      {props.title && (
        <div style={{ marginBottom:20, paddingBottom:14, borderBottom:"1px solid "+C.borderLt }}>
          <div style={{ fontFamily:fUI, fontSize:15, fontWeight:600, color:C.ink }}>{props.title}</div>
          {props.sub && <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, marginTop:3, fontWeight:300 }}>{props.sub}</div>}
        </div>
      )}
      {props.children}
    </div>
  );
}

function SRow2(props) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>{props.children}</div>;
}

function SField(props) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={S_lbl}>{props.label}{props.required && <span style={{ color:C.red }}> *</span>}</label>
      {props.type === "textarea"
        ? <textarea value={props.value} onChange={function(e){ props.onChange(e.target.value); }} rows={3} placeholder={props.placeholder||""} style={{ ...S_inp, resize:"vertical", lineHeight:1.5 }} />
        : <input type={props.type||"text"} value={props.value} onChange={function(e){ props.onChange(e.target.value); }} placeholder={props.placeholder||""} style={S_inp} />
      }
    </div>
  );
}

// -- Settings ------------------------------------------------------------------
function DSettings(props) {
  var user = props.user;
  var profile = props.profile || {};
  var profileHook = props.profileHook;
  var tab = props.tab || "profile";
  var setTab = props.setTab || function() {};
  var setPage = props.setPage || function() {};
  var setSection = props.setSection || function() {};

  // Profile state - pre-filled from Supabase profile
  var [firstName, setFirstName]   = useState(profile.first_name || "");
  var [lastName, setLastName]     = useState(profile.last_name  || "");
  var [email, setEmail]           = useState(profile.email      || (user && user.email ? user.email : ""));
  var [phone, setPhone]           = useState(profile.phone      || "");
  var [website, setWebsite]       = useState(profile.website    || "");
  var [bio, setBio]               = useState(profile.bio        || "");

  // Business state
  var [bizName, setBizName]   = useState(profile.biz_name    || "");
  var [vatNum, setVatNum]     = useState(profile.vat_number  || "");
  var [iban, setIban]         = useState(profile.iban         || "");
  var [bic, setBic]           = useState(profile.bic          || "");
  var [street, setStreet]     = useState(profile.street       || "");
  var [city, setCity]         = useState(profile.city         || "");
  var [country, setCountry]   = useState(profile.country      || "DE");

  // Notifications state - must be before useEffect that references setters
  var [notifProposal, setNotifProposal] = useState(profile.notif_proposal !== false);
  var [notifInvoice, setNotifInvoice]   = useState(profile.notif_invoice   !== false);
  var [notifOverdue, setNotifOverdue]   = useState(profile.notif_overdue   !== false);
  var [notifDigest, setNotifDigest]     = useState(!!profile.notif_digest);

  // Sync when profile loads from Supabase
  useEffect(function() {
    if (!profile || !profile.first_name) return;
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name   || "");
    setEmail(profile.email          || (user && user.email ? user.email : ""));
    setPhone(profile.phone          || "");
    setWebsite(profile.website      || "");
    setBio(profile.bio              || "");
    setBizName(profile.biz_name     || "");
    setVatNum(profile.vat_number    || "");
    setIban(profile.iban            || "");
    setBic(profile.bic              || "");
    setStreet(profile.street        || "");
    setCity(profile.city            || "");
    setCountry(profile.country      || "DE");
    setNotifProposal(profile.notif_proposal !== false);
    setNotifInvoice(profile.notif_invoice   !== false);
    setNotifOverdue(profile.notif_overdue   !== false);
    setNotifDigest(!!profile.notif_digest);
  }, [profile]);

  // Password state
  var [pwCurrent, setPwCurrent]   = useState("");
  var [pwNew, setPwNew]           = useState("");
  var [pwConfirm, setPwConfirm]   = useState("");

  var [saved, setSaved] = useState("");
  var [saving, setSaving] = useState(false);

  function save(section) {
    setSaving(true);
    var payload = {};
    if (section === "profile") {
      payload = { first_name:firstName, last_name:lastName, email:email, phone:phone, website:website, bio:bio };
    } else if (section === "business-info") {
      payload = { biz_name:bizName, vat_number:vatNum, country:country, street:street, city:city };
    } else if (section === "business-payment") {
      payload = { iban:iban, bic:bic };
    } else if (section === "notifications") {
      payload = { notif_proposal:notifProposal, notif_invoice:notifInvoice, notif_overdue:notifOverdue, notif_digest:notifDigest };
    } else if (section === "password") {
      if (!pwNew || pwNew !== pwConfirm) { setSaving(false); setSaved(""); return; }
      var user = null;
      try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
      if (!user || !user.id) { setSaving(false); return; }
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action:"updatepassword", user_id:user.id, new_password:pwNew }),
      })
      .then(function(r){ return r.json(); })
      .then(function(d){
        setSaving(false);
        if (d.updated) { setSaved("password"); setPwCurrent(""); setPwNew(""); setPwConfirm(""); setTimeout(function(){ setSaved(""); }, 2500); }
        else { setSaved(""); }
      })
      .catch(function(){ setSaving(false); });
      return;
    }
    if (profileHook && profileHook.save && Object.keys(payload).length > 0) {
      profileHook.save(payload).then(function() {
        setSaving(false); setSaved(section);
        setTimeout(function(){ setSaved(""); }, 2500);
      }).catch(function() { setSaving(false); });
    } else {
      // Demo mode - no userId
      setSaving(false); setSaved(section);
      setTimeout(function(){ setSaved(""); }, 2500);
    }
  }

  var tabs = [
    { id:"profile",       label:"Profile"        },
    { id:"business",      label:"Business"       },
    { id:"notifications", label:"Notifications"  },
    { id:"billing",       label:"Plan & Billing" },
    { id:"integrations",  label:"Integrations"   },
    { id:"security",      label:"Security"       },
  ];

  return (
    <div style={{ maxWidth:720 }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:C.ink, letterSpacing:"-0.03em", marginBottom:5 }}>Settings</h2>
        <p style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300 }}>Manage your account, business details and preferences.</p>
      </div>

      {/* Tab bar - scrollable on mobile */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid "+C.border, marginBottom:28, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {tabs.map(function(t) {
          var active = tab === t.id;
          return (
            <button key={t.id} onClick={function(){ setTab(t.id); }} style={{ background:"none", border:"none", borderBottom:"2px solid "+(active ? C.accent : "transparent"), padding:"10px 14px 11px", cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:active ? 500 : 400, color:active ? C.ink : C.muted, transition:"all 0.15s", marginBottom:-1, whiteSpace:"nowrap", flexShrink:0 }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* -- Profile -- */}
      {tab === "profile" && (
        <div>
          <SCard title="Personal information" sub="This is how your name appears on invoices and proposals.">
            {/* Avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:C.accentMid, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:22, color:C.accent, fontWeight:700, flexShrink:0 }}>
                {firstName ? firstName[0].toUpperCase() : "D"}
              </div>
              <div>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink, marginBottom:3 }}>{firstName} {lastName}</div>
                <div style={{ fontFamily:fUI, fontSize:12, color:C.faint }}>{email}</div>
              </div>
            </div>
            <SRow2>
              <SField label="First name" required={true} value={firstName} onChange={setFirstName} placeholder="Daniel" />
              <SField label="Last name" value={lastName} onChange={setLastName} placeholder="Speder" />
            </SRow2>
            <SField label="Email address" required={true} type="email" value={email} onChange={setEmail} placeholder="daniel@studio.de" />
            <SRow2>
              <SField label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+49 171 000 0000" />
              <SField label="Website" type="url" value={website} onChange={setWebsite} placeholder="https://studio.de" />
            </SRow2>
            <SField label="Short bio" type="textarea" value={bio} onChange={setBio} placeholder="Freelance brand designer based in Berlin. Working with clients across Europe." />
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <SSaveBtn onSave={save} saved={saved} saving={saving} section="profile" />
            </div>
          </SCard>
        </div>
      )}

      {/* -- Business -- */}
      {tab === "business" && (
        <div>
          <SCard title="Business details" sub="Used on all invoices, proposals and EU compliance documents.">
            <SField label="Business / Studio name" required={true} value={bizName} onChange={setBizName} placeholder="Studio Speder GbR" />
            <SRow2>
              <SField label="VAT number" value={vatNum} onChange={setVatNum} placeholder="DE123456789" />
              <SField label="Country" value={country} onChange={setCountry} placeholder="DE" />
            </SRow2>
            <SRow2>
              <SField label="Street address" value={street} onChange={setStreet} placeholder="Leopoldstr. 10" />
              <SField label="City & postal code" value={city} onChange={setCity} placeholder="80802 Munchen" />
            </SRow2>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <SSaveBtn onSave={save} saved={saved} saving={saving} section="business-info" />
            </div>
          </SCard>
          <SCard title="Payment details" sub="Shown in the SEPA payment block on every invoice.">
            <SField label="IBAN" value={iban} onChange={setIban} placeholder="DE89 3704 0044 0532 0130 00" />
            <SField label="BIC / SWIFT" value={bic} onChange={setBic} placeholder="COBADEFFXXX" />
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <SSaveBtn onSave={save} saved={saved} saving={saving} section="business-payment" />
            </div>
          </SCard>
        </div>
      )}

      {/* -- Notifications -- */}
      {tab === "notifications" && (
        <div>
          <SCard title="Email notifications" sub="Choose what you want to be notified about.">
            {[
              { label:"Proposal viewed",       sub:"When a client opens your proposal",              val:notifProposal, set:setNotifProposal },
              { label:"Invoice activity",      sub:"When an invoice is paid, overdue or opened",     val:notifInvoice,  set:setNotifInvoice  },
              { label:"Overdue reminders",     sub:"Daily digest of overdue invoices",               val:notifOverdue,  set:setNotifOverdue  },
              { label:"Weekly digest",         sub:"Summary of revenue, proposals and activity",     val:notifDigest,   set:setNotifDigest   },
            ].map(function(item, i, arr) {
              return (
                <div key={item.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom:i < arr.length-1 ? "1px solid "+C.borderLt : "none" }}>
                  <div>
                    <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>{item.label}</div>
                    <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, marginTop:2 }}>{item.sub}</div>
                  </div>
                  <SToggle value={item.val} onChange={item.set} />
                </div>
              );
            })}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20 }}>
              <SSaveBtn onSave={save} saved={saved} saving={saving} section="notifications" />
            </div>
          </SCard>
        </div>
      )}

      {/* -- Billing -- */}
      {tab === "billing" && (
        <div>
          <SCard title="Current plan">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontFamily:fSerif, fontSize:22, fontWeight:400, color:C.ink }}>Studio</span>
                  <span style={{ fontFamily:fMono, fontSize:10, color:C.accent, background:C.accentSoft, borderRadius:5, padding:"3px 8px", letterSpacing:"0.06em" }}>ACTIVE</span>
                </div>
                <div style={{ fontFamily:fUI, fontSize:13, color:C.muted }}>EUR 59/month . Renews 7 June 2026</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:C.ink, letterSpacing:"-0.03em" }}>EUR 59</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>per month</div>
              </div>
            </div>
            <div style={{ background:C.bg, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ fontFamily:fUI, fontSize:12, fontWeight:600, color:C.ink, marginBottom:8 }}>Plan includes</div>
              {["Unlimited clients","Unlimited invoices + proposals","AI proposal writer","Brand kits","Client portal + approvals","VIES VAT validation","XRechnung & Factur-X"].map(function(f) {
                return <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontFamily:fUI, fontSize:13, color:C.muted, marginBottom:5 }}><span style={{ color:C.green }}>OK</span>{f}</div>;
              })}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={function(){
                var user = null;
                try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
                fetch("/api/stripe-portal", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: user && user.email ? user.email : "" }),
                })
                .then(function(r){ return r.json(); })
                .then(function(d){ if (d.url) window.open(d.url, "_blank"); })
                .catch(function(){ window.open("https://billing.stripe.com", "_blank"); });
              }} style={{ background:C.accent, color:"#fff", border:"none", padding:"10px 20px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:500 }}>Manage via Stripe</button>
              <button onClick={function(){
                var user = null;
                try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
                fetch("/api/stripe-portal", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: user && user.email ? user.email : "" }),
                })
                .then(function(r){ return r.json(); })
                .then(function(d){ if (d.url) window.open(d.url, "_blank"); })
                .catch(function(){ window.open("https://billing.stripe.com", "_blank"); });
              }} style={{ background:"transparent", color:C.red, border:"1px solid "+C.red+"44", padding:"10px 20px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:13 }}>Cancel plan</button>
            </div>
          </SCard>
          <SCard title="Billing history" sub="Your last 3 payments.">
            {[
              { date:"7 May 2026",  amount:"EUR 59.00", status:"Paid" },
              { date:"7 Apr 2026",  amount:"EUR 59.00", status:"Paid" },
              { date:"7 Mar 2026",  amount:"EUR 59.00", status:"Paid" },
            ].map(function(inv, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:i<2 ? "1px solid "+C.borderLt : "none" }}>
                  <div style={{ fontFamily:fUI, fontSize:13, color:C.ink }}>{inv.date}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ fontFamily:fMono, fontSize:13, color:C.ink, fontWeight:500 }}>{inv.amount}</span>
                    <span style={{ fontFamily:fMono, fontSize:10, color:C.green, background:C.greenSoft, borderRadius:4, padding:"2px 7px" }}>{inv.status}</span>
                    <button style={{ background:"none", border:"none", fontFamily:fUI, fontSize:12, color:C.accent, cursor:"pointer", padding:0 }}>PDF</button>
                  </div>
                </div>
              );
            })}
          </SCard>
        </div>
      )}

      {/* -- Integrations -- */}
      {tab === "integrations" && (
        <div>
          <SCard title="Connected services" sub="Sync your invoicing data with third-party tools.">
            {[
              { name:"Lexoffice", desc:"Sync invoices and clients automatically.", status:"coming", color:"#FF6B35" },
              { name:"Stripe",    desc:"Payment processing and subscription billing.", status:"active", color:"#635BFF" },
              { name:"Loops",     desc:"Transactional email for reminders and follow-ups.", status:"active", color:"#06B6D4" },
              { name:"Peppol",    desc:"E-invoicing network for B2G and public sector.", status:"coming", color:"#10B981" },
              { name:"DATEV",     desc:"German accounting software integration.", status:"coming", color:"#003087" },
            ].map(function(svc, i, arr) {
              return (
                <div key={svc.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:i<arr.length-1 ? "1px solid "+C.borderLt : "none" }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:svc.color+"15", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:svc.color }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink, marginBottom:2 }}>{svc.name}</div>
                    <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, fontWeight:300 }}>{svc.desc}</div>
                  </div>
                  {svc.status === "active"
                    ? <span style={{ fontFamily:fMono, fontSize:10, color:C.green, background:C.greenSoft, borderRadius:5, padding:"3px 8px", flexShrink:0 }}>Active</span>
                    : <span style={{ fontFamily:fMono, fontSize:10, color:C.faint, background:C.bg, borderRadius:5, padding:"3px 8px", flexShrink:0 }}>Soon</span>
                  }
                </div>
              );
            })}
          </SCard>
          <SCard title="API access" sub="Build custom integrations with the InvoiceAI API.">
            <div style={{ background:C.bg, borderRadius:9, padding:"12px 14px", fontFamily:fMono, fontSize:12, color:C.muted, marginBottom:14 }}>
              API keys available on Agency plan
            </div>
            <Btn variant="secondary" onClick={function(){ setTab("billing"); }}>Upgrade plan</Btn>
          </SCard>
        </div>
      )}

      {/* -- Security -- */}
      {tab === "security" && (
        <div>
          <SCard title="Change password" sub="Use a strong password of at least 8 characters.">
            <SField label="Current password" type="password" value={pwCurrent} onChange={setPwCurrent} placeholder="Password" />
            <SField label="New password" type="password" value={pwNew} onChange={setPwNew} placeholder="Password" />
            <SField label="Confirm new password" type="password" value={pwConfirm} onChange={setPwConfirm} placeholder="Password" />
            {pwNew && pwConfirm && pwNew !== pwConfirm && (
              <div style={{ fontFamily:fUI, fontSize:13, color:C.red, marginBottom:12 }}>{"Passwords do not match."}</div>
            )}
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <SSaveBtn onSave={save} saved={saved} saving={saving} section="password" />
            </div>
          </SCard>
          <SCard title="Sessions" sub="You are currently logged in on this device.">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0" }}>
              <div>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>This device</div>
                <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, marginTop:2 }}>Safari . iPhone . Active now</div>
              </div>
              <span style={{ fontFamily:fMono, fontSize:10, color:C.green, background:C.greenSoft, borderRadius:4, padding:"2px 7px" }}>Active</span>
            </div>
          </SCard>
          <SCard title="Danger zone">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>Delete account</div>
                <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, marginTop:2 }}>Permanently delete your account and all data. This cannot be undone.</div>
              </div>
              <button style={{ background:"transparent", color:C.red, border:"1px solid "+C.red+"44", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:500, flexShrink:0, marginLeft:20 }}>Delete account</button>
            </div>
          </SCard>
        </div>
      )}
    </div>
  );
}
