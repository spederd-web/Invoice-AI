import { useState, useEffect, useCallback } from "react";
import { L, fSans, fMono, fSerif, Icon, LogoMark } from "./constants.jsx";

// ── Design tokens ─────────────────────────────────────────────────────────────
var C = {
  bg:       "#F5F4F1",   // warm off-white content area
  surface:  "#FFFFFF",
  surfaceAlt: "#FAFAF8",
  navy:     "#081120",
  navyMid:  "#0E1F33",
  navyItem: "rgba(240,244,248,0.55)",
  navyItemActive: "#FFFFFF",
  accent:   "#17A99E",
  accentSoft: "rgba(23,169,158,0.08)",
  green:    "#1A9E6B",
  greenSoft:"rgba(26,158,107,0.08)",
  red:      "#D94F45",
  redSoft:  "rgba(217,79,69,0.07)",
  gold:     "#B58A3A",
  goldSoft: "rgba(181,138,58,0.08)",
  blue:     "#3B6FD4",
  blueSoft: "rgba(59,111,212,0.08)",
  ink:      "#0A1628",
  muted:    "#6B7280",
  faint:    "#9CA3AF",
  border:   "#E8E6E1",
  borderLt: "#F0EEE9",
};

var fUI = "'DM Sans', sans-serif";

// ── Supabase data hook ────────────────────────────────────────────────────────
export function useDB(table, userId) {
  var [rows, setRows] = useState([]);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);

  var fetch_ = useCallback(function() {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetch("/api/db?table=" + encodeURIComponent(table) + "&user_id=" + encodeURIComponent(userId))
      .then(function(r) { return r.json(); })
      .then(function(data) { setRows(data || []); setLoading(false); })
      .catch(function(err) { setError(err.message); setLoading(false); });
  }, [table, userId]);

  useEffect(function() { fetch_(); }, [fetch_]);

  function insert(payload) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"insert", user_id:userId, payload:payload }) })
      .then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
  }
  function update(id, payload) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"update", id:id, user_id:userId, payload:payload }) })
      .then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
  }
  function remove(id) {
    return fetch("/api/db", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ table:table, action:"delete", id:id, user_id:userId }) })
      .then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
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
  { id:"1", client_id:"1", title:"Brand Identity — TechFlow",    status:"won",      value:8400,  sent_at:"2026-04-12", view_count:4, last_viewed:"2 days ago" },
  { id:"2", client_id:"4", title:"App UI Kit + Design System",   status:"sent",     value:12000, sent_at:"2026-04-28", view_count:2, last_viewed:"3 days ago" },
  { id:"3", client_id:"3", title:"Pitch Deck — Series A",        status:"viewed",   value:2800,  sent_at:"2026-04-22", view_count:7, last_viewed:"6 hours ago" },
  { id:"4", client_id:"2", title:"Website Redesign",             status:"declined", value:6500,  sent_at:"2026-03-05", view_count:1, last_viewed:"8 Mar" },
];

var MOCK_BRAND_KITS = [
  { id:"1", name:"Daniel Speder",  primary_color:"#C8502A", font:"Playfair Display",   logo_text:"DS" },
  { id:"2", name:"Nord Creative",  primary_color:"#2A5E9A", font:"DM Sans",            logo_text:"NC" },
  { id:"3", name:"Bianchi Studio", primary_color:"#2A7A54", font:"Cormorant Garamond", logo_text:"B"  },
];

// Sparkline data (revenue last 8 weeks)
var SPARK_REV  = [5200,6800,5900,7400,6200,8100,7800,9960];
var SPARK_PAID = [4800,6100,5200,6900,5800,7200,6900,8400];

// ── Micro sparkline SVG ───────────────────────────────────────────────────────
function Spark(props) {
  var data = props.data || [];
  var color = props.color || C.accent;
  var w = props.w || 80;
  var h = props.h || 28;
  if (data.length < 2) return null;
  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var pts = data.map(function(v, i) {
    var x = (i / (data.length - 1)) * w;
    var y = h - ((v - min) / range) * (h - 4) - 2;
    return x + "," + y;
  });
  var path = "M" + pts.join(" L");
  var fill = pts.join(" L") + " L" + w + "," + h + " L0," + h + " Z";
  return (
    <svg width={w} height={h} viewBox={"0 0 " + w + " " + h} fill="none" style={{ display:"block" }}>
      <defs>
        <linearGradient id={"sg" + color.replace("#","")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={"M" + fill} fill={"url(#sg" + color.replace("#","") + ")"} />
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Chip(props) {
  var color = props.color || C.muted;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontFamily:fMono, fontSize:11, color:color, background:color+"14", borderRadius:5, padding:"3px 8px", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
      {props.dot && <span style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }} />}
      {props.children}
    </span>
  );
}

function Label(props) {
  return (
    <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:C.faint, marginBottom:props.mb || 10 }}>
      {props.children}
    </div>
  );
}

export function StatCard(props) {
  return (
    <div style={{ background:C.surface, borderRadius:14, padding:"20px 22px", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
      <Label mb={10}>{props.label}</Label>
      <div style={{ fontFamily:fSerif, fontSize:30, fontWeight:400, color:props.color || C.ink, letterSpacing:"-0.03em", lineHeight:1, marginBottom:6 }}>{props.value}</div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        {props.sub && <div style={{ fontFamily:fUI, fontSize:12, color:props.subColor || C.faint }}>{props.sub}</div>}
        {props.spark && <Spark data={props.spark} color={props.sparkColor || C.accent} />}
      </div>
    </div>
  );
}

// ── Attention card — core differentiator ─────────────────────────────────────
function AttentionCard(props) {
  var item = props.item;
  var onDismiss = props.onDismiss;
  var typeColors = {
    overdue:  { bg:C.redSoft,  border:C.red+"22",  color:C.red,   icon:"clock"    },
    followup: { bg:C.goldSoft, border:C.gold+"22", color:C.gold,  icon:"send"     },
    viewed:   { bg:C.blueSoft, border:C.blue+"22", color:C.blue,  icon:"eye"      },
    won:      { bg:C.greenSoft,border:C.green+"22",color:C.green, icon:"check"    },
    payment:  { bg:C.greenSoft,border:C.green+"22",color:C.green, icon:"bank"     },
  };
  var t = typeColors[item.type] || typeColors.followup;
  return (
    <div style={{
      background:C.surface, borderRadius:16,
      border:"1px solid " + t.border,
      padding:"20px 22px",
      boxShadow:"0 2px 8px rgba(10,22,40,0.04)",
      transition:"box-shadow 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon name={t.icon} size={17} color={t.color} />
        </div>
        <button onClick={onDismiss} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontSize:18, lineHeight:1, padding:"0 2px", marginTop:-2 }}>×</button>
      </div>
      <div style={{ fontFamily:fUI, fontSize:15, fontWeight:500, color:C.ink, lineHeight:1.4, marginBottom:6 }}>{item.title}</div>
      <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, lineHeight:1.5, marginBottom:16 }}>{item.desc}</div>
      <button style={{
        background:t.color, color:"#fff", border:"none",
        padding:"9px 18px", borderRadius:8, cursor:"pointer",
        fontFamily:fUI, fontSize:13, fontWeight:500,
        width:"100%",
      }}>
        {item.cta}
      </button>
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
  var [mobileSection, setMobileSection] = useState(false);

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

  function goSection(id) {
    setSection(id);
    setClientId(null);
    setMobileSection(false);
  }

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 58px)", background:C.bg }}>

      {/* ── Sidebar (desktop) ── */}
      <div className="dash-aside" style={{ width:220, background:C.navy, flexShrink:0, display:"flex", flexDirection:"column", position:"sticky", top:58, height:"calc(100vh - 58px)" }}>
        <div style={{ padding:"28px 20px 20px" }}>
          <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(240,244,248,0.2)", marginBottom:20 }}>Workspace</div>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:11, padding:"10px 12px",
                borderRadius:9, border:"none", marginBottom:2, cursor:"pointer",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                color: active ? C.navyItemActive : C.navyItem,
                fontFamily:fUI, fontSize:14, fontWeight:active ? 500 : 400,
                transition:"all 0.12s", textAlign:"left",
              }}
              onMouseEnter={function(e){ if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={function(e){ if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon name={item.icon} size={15} color={active ? C.accent : "rgba(240,244,248,0.3)"} />
                {item.label}
                {active && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:C.accent, flexShrink:0 }} />}
              </button>
            );
          })}
        </div>

        <div style={{ flex:1 }} />

        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:C.navy, fontWeight:700, flexShrink:0 }}>
              {user && user.email ? user.email[0].toUpperCase() : "D"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:fUI, fontSize:13, color:"rgba(240,244,248,0.65)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user && user.email ? user.email : "demo@invoice-ai.de"}
              </div>
              <div style={{ fontFamily:fMono, fontSize:10, color:"rgba(240,244,248,0.2)", letterSpacing:"0.05em", marginTop:1 }}>Studio plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"40px 44px" }}>
        {section==="overview"  && <DOverview userId={userId} setSection={goSection} user={user} onConvert={handleConvert} />}
        {section==="clients"   && !clientId && <DClients userId={userId} setClientId={setClientId} setPage={setPage} />}
        {section==="clients"   && clientId && selectedClient && <DClientDetail client={selectedClient} setClientId={setClientId} invoices={MOCK_INVOICES} proposals={MOCK_PROPOSALS} />}
        {section==="invoices"  && <DInvoices userId={userId} />}
        {section==="proposals" && <DProposals userId={userId} onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits userId={userId} />}
      </div>

      {/* ── Mobile bottom nav ── */}
      <div className="nav-burger" style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:C.navy, borderTop:"1px solid rgba(255,255,255,0.07)", padding:"8px 0 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ goSection(item.id); }} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 12px", cursor:"pointer" }}>
                <Icon name={item.icon} size={20} color={active ? C.accent : "rgba(240,244,248,0.3)"} />
                <span style={{ fontFamily:fMono, fontSize:9, letterSpacing:"0.06em", color:active ? C.accent : "rgba(240,244,248,0.3)", textTransform:"uppercase" }}>{item.label}</span>
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
  var onConvert = props.onConvert;

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
    { id:0, type:"viewed",   title:"Pitch Deck viewed 7 times",         desc:"Bianchi & Co. opened your proposal 7 times. No reply yet — strong buying signal.",               cta:"Send follow-up" },
    { id:1, type:"overdue",  title:"Invoice FR-2026-0021 overdue",       desc:"Maison Fontaine · €3,200 · Due 14 Jan 2026. EU late payment interest applies.",                  cta:"Send reminder" },
    { id:2, type:"followup", title:"App UI Kit — no reply in 3 days",    desc:"Nord Digital AS opened your proposal twice. A short follow-up often doubles reply rates.",       cta:"Follow up now" },
  ];
  var attention = allAttention.filter(function(a){ return dismissed.indexOf(a.id) < 0; });

  var activity = [
    { icon:"document", color:C.blue,  label:"Invoice sent",       detail:"DE-2026-0437 · Studio Verde · €4,200",   time:"2h ago"    },
    { icon:"check",    color:C.green, label:"Proposal accepted",   detail:"Brand Identity · Maison Fontaine · €8,400", time:"Yesterday" },
    { icon:"clock",    color:C.red,   label:"Invoice overdue",     detail:"IT-2026-007 · Bianchi & Co.",             time:"16d ago"   },
    { icon:"eye",      color:C.gold,  label:"Proposal viewed",     detail:"App Design · Nord Digital AS",            time:"3d ago"    },
  ];

  return (
    <div>
      {/* ── Greeting ── */}
      <div style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,3.5vw,40px)", fontWeight:400, color:C.ink, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:8 }}>{greetingFull}</h1>
        <p style={{ fontFamily:fMono, fontSize:12, color:C.faint, letterSpacing:"0.04em" }}>{dateStr} · 4 clients · 1 overdue</p>
      </div>

      {/* ── Main 2-col grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:28, marginBottom:28 }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* KPI row — 2 wide cards with sparklines */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <StatCard label="Revenue · May" value="€14,280" sub="↑ +18% vs April" subColor={C.green} spark={SPARK_REV} sparkColor={C.accent} />
            <StatCard label="Outstanding" value="€4,320" sub="4 overdue invoices" subColor={C.red} spark={SPARK_PAID} sparkColor={C.red} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <StatCard label="Collected · May" value="€9,960" sub="↑ +24% vs April" subColor={C.green} spark={SPARK_PAID} sparkColor={C.green} />
            <StatCard label="Open proposals" value="6" sub="2 awaiting reply" subColor={C.gold} />
          </div>

          {/* Recent activity */}
          <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
            <div style={{ padding:"18px 22px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:fUI, fontSize:15, fontWeight:500, color:C.ink }}>Recent activity</span>
              <button onClick={function(){ setSection("invoices"); }} style={{ background:"none", border:"none", fontFamily:fMono, fontSize:11, color:C.accent, cursor:"pointer", letterSpacing:"0.04em" }}>View all →</button>
            </div>
            {activity.map(function(a, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 22px", borderTop:"1px solid "+C.borderLt }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:a.color+"12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={a.icon} size={14} color={a.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>{a.label}</div>
                    <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, fontWeight:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.detail}</div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:11, color:C.faint, flexShrink:0 }}>{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column — attention cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}>
            <span style={{ fontFamily:fUI, fontSize:15, fontWeight:500, color:C.ink }}>Needs attention</span>
            {attention.length > 0 && (
              <span style={{ fontFamily:fMono, fontSize:11, color:C.red, background:C.redSoft, borderRadius:5, padding:"2px 8px" }}>{attention.length}</span>
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
            <div style={{ background:C.surface, borderRadius:16, padding:"28px 22px", textAlign:"center", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
              <div style={{ fontFamily:fUI, fontSize:15, color:C.ink, fontWeight:500, marginBottom:6 }}>All clear.</div>
              <div style={{ fontFamily:fUI, fontSize:13, color:C.faint, fontWeight:300 }}>No action needed right now.</div>
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
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
      <div>
        <h2 style={{ fontFamily:fSerif, fontSize:28, fontWeight:400, color:C.ink, letterSpacing:"-0.025em", marginBottom:5 }}>{props.title}</h2>
        {props.sub && <p style={{ fontFamily:fUI, fontSize:14, color:C.muted, fontWeight:300 }}>{props.sub}</p>}
      </div>
      {props.action && <div style={{ marginTop:4 }}>{props.action}</div>}
    </div>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function DClients(props) {
  var setClientId = props.setClientId;
  var setPage = props.setPage;
  var [search, setSearch] = useState("");
  var stColor = { active:C.green, overdue:C.red, prospect:C.blue };
  var countryFlag = { DE:"🇩🇪", FR:"🇫🇷", IT:"🇮🇹", SE:"🇸🇪" };
  var filtered = MOCK_CLIENTS.filter(function(c){
    return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 || (c.city && c.city.toLowerCase().indexOf(search.toLowerCase()) >= 0);
  });

  return (
    <div>
      <SectionHeader title="Clients" sub="Your active client relationships." action={
        <button onClick={function(){ if (setPage) setPage("Generator"); }} style={{ background:C.accent, color:"#fff", border:"none", padding:"10px 20px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:14, fontWeight:500 }}>+ New invoice</button>
      } />
      <div style={{ position:"relative", marginBottom:20 }}>
        <input value={search} onChange={function(e){ setSearch(e.target.value); }} placeholder="Search clients…" style={{ width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:10, padding:"10px 14px 10px 38px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.surface, outline:"none" }} />
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><Icon name="users" size={14} color={C.faint} /></div>
      </div>
      <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
        {filtered.map(function(c, i) {
          var sc = stColor[c.status] || C.muted;
          return (
            <div key={c.id} onClick={function(){ setClientId(c.id); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 22px", borderBottom:i<filtered.length-1 ? "1px solid "+C.borderLt : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = C.bg; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width:42, height:42, borderRadius:12, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:c.color, fontWeight:600, flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fUI, fontSize:15, fontWeight:500, color:C.ink, marginBottom:2 }}>{c.name}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.faint }}>{countryFlag[c.country] || ""} {c.city} · {c.invoices} invoice{c.invoices !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                {c.balance > 0 && <div style={{ fontFamily:fMono, fontSize:13, color:C.red, fontWeight:500 }}>{"€"+c.balance.toLocaleString()+" due"}</div>}
                <div style={{ fontFamily:fMono, fontSize:12, color:C.faint, marginTop:2 }}>{"€"+c.paid.toLocaleString()+" paid"}</div>
              </div>
              <Chip color={sc} dot={true}>{c.status}</Chip>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:"40px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>No clients match "{search}"</div>
        )}
      </div>
    </div>
  );
}

function DClientDetail(props) {
  var c = props.client;
  var setClientId = props.setClientId;
  var clientInvoices = (props.invoices || []).filter(function(inv){ return inv.client_id === c.id; });
  var clientProposals = (props.proposals || []).filter(function(p){ return p.client_id === c.id; });
  var stColor = { sent:C.blue, paid:C.green, overdue:C.red, draft:C.muted };
  var pColors = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };

  return (
    <div>
      <button onClick={function(){ setClientId(null); }} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", fontFamily:fMono, fontSize:12, letterSpacing:"0.06em", marginBottom:24, padding:0, display:"flex", alignItems:"center", gap:6 }}>
        ← All clients
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:32 }}>
        <div style={{ width:54, height:54, borderRadius:14, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:18, color:c.color, fontWeight:600 }}>{c.avatar}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:26, fontWeight:400, color:C.ink, letterSpacing:"-0.02em", marginBottom:3 }}>{c.name}</h2>
          <p style={{ fontFamily:fMono, fontSize:12, color:C.faint }}>{c.country} · {c.city}</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
        <StatCard label="Total Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance > 0 ? C.red : C.green} />
        <StatCard label="Invoices" value={String(c.invoices)} />
      </div>
      {clientInvoices.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", marginBottom:16, boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
          <div style={{ padding:"16px 22px", borderBottom:"1px solid "+C.borderLt }}><Label mb={0}>Invoices</Label></div>
          {clientInvoices.map(function(inv, i) {
            return (
              <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 22px", borderBottom:i<clientInvoices.length-1?"1px solid "+C.borderLt:"none" }}>
                <div style={{ fontFamily:fMono, fontSize:13, color:C.ink, flex:1 }}>{inv.inv_number}</div>
                <div style={{ fontFamily:fMono, fontSize:14, color:C.ink, fontWeight:500 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.faint, width:100, textAlign:"right" }}>{inv.due_date}</div>
                <Chip color={stColor[inv.status] || C.muted} dot={true}>{inv.status}</Chip>
              </div>
            );
          })}
        </div>
      )}
      {clientProposals.length > 0 && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
          <div style={{ padding:"16px 22px", borderBottom:"1px solid "+C.borderLt }}><Label mb={0}>Proposals</Label></div>
          {clientProposals.map(function(p, i) {
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 22px", borderBottom:i<clientProposals.length-1?"1px solid "+C.borderLt:"none" }}>
                <div style={{ flex:1, fontFamily:fUI, fontSize:14, color:C.ink }}>{p.title}</div>
                <div style={{ fontFamily:fMono, fontSize:14, color:C.ink, fontWeight:500 }}>{"€"+p.value.toLocaleString()}</div>
                <Chip color={pColors[p.status] || C.muted} dot={true}>{p.status}</Chip>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Invoices ──────────────────────────────────────────────────────────────────
function DInvoices(props) {
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
  var totalOutstanding = MOCK_INVOICES.filter(function(inv){ return inv.status === "sent" || inv.status === "overdue"; }).reduce(function(sum, inv){ return sum + inv.amount_gross; }, 0);

  function handleAction(invId, action) {
    setToasts(function(s){ return Object.assign({}, s, { [invId]: action }); });
    setTimeout(function(){ setToasts(function(s){ var n = Object.assign({}, s); delete n[invId]; return n; }); }, 3000);
  }

  return (
    <div>
      <SectionHeader title="Invoices" sub="Track sent, overdue and paid invoices." action={
        totalOutstanding > 0 ? (
          <div style={{ background:C.redSoft, border:"1px solid "+C.red+"22", borderRadius:9, padding:"9px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="clock" size={13} color={C.red} />
            <span style={{ fontFamily:fMono, fontSize:12, color:C.red, letterSpacing:"0.04em" }}>{"€"+totalOutstanding.toLocaleString()+" outstanding"}</span>
          </div>
        ) : null
      } />
      <div style={{ display:"flex", gap:2, background:C.borderLt, borderRadius:10, padding:"3px", width:"fit-content", marginBottom:24 }}>
        {[["all","All"],["outstanding","Outstanding"],["paid","Paid"]].map(function(pair) {
          var active = filter === pair[0];
          return (
            <button key={pair[0]} onClick={function(){ setFilter(pair[0]); }} style={{ background:active ? C.surface : "transparent", color:active ? C.ink : C.muted, border:"none", padding:"7px 18px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:active ? 500 : 400, boxShadow:active ? "0 1px 3px rgba(10,22,40,0.07)" : "none" }}>
              {pair[1]}
            </button>
          );
        })}
      </div>
      <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
        {filtered.map(function(inv, i) {
          var isOverdue = inv.status === "overdue";
          var sc = stColor[inv.status] || C.muted;
          var toast = toasts[inv.id];
          return (
            <div key={inv.id} style={{ borderBottom:i<filtered.length-1 ? "1px solid "+C.borderLt : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 22px", background:isOverdue ? C.redSoft : "transparent" }}>
                <div style={{ fontFamily:fMono, fontSize:13, color:C.ink, width:140, flexShrink:0 }}>{inv.inv_number}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink }}>{clientMap[inv.client_id] || "Unknown"}</div>
                  {isOverdue && <div style={{ fontFamily:fMono, fontSize:11, color:C.red, marginTop:2 }}>Overdue · due {inv.due_date}</div>}
                </div>
                <div style={{ fontFamily:fMono, fontSize:15, color:C.ink, fontWeight:500, flexShrink:0 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:C.faint, flexShrink:0 }}>{inv.due_date}</div>
                <Chip color={sc} dot={true}>{inv.status}</Chip>
                {isOverdue && <button onClick={function(){ handleAction(inv.id, "reminder"); }} style={{ background:C.red, color:"#fff", border:"none", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:13, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>Send reminder</button>}
                {inv.status === "sent" && <button onClick={function(){ handleAction(inv.id, "followup"); }} style={{ background:"transparent", color:C.blue, border:"1px solid "+C.blue+"44", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontFamily:fUI, fontSize:13, flexShrink:0, whiteSpace:"nowrap" }}>Follow up</button>}
                {inv.status === "paid" && <span style={{ fontFamily:fMono, fontSize:12, color:C.green, flexShrink:0 }}>✓ Paid</span>}
              </div>
              {toast && (
                <div style={{ margin:"0 22px 14px", padding:"11px 16px", background:toast==="reminder" ? C.redSoft : C.blueSoft, border:"1px solid "+(toast==="reminder" ? C.red : C.blue)+"22", borderRadius:9 }}>
                  <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink, marginBottom:2 }}>
                    {toast==="reminder" ? "Reminder sent to " + clientMap[inv.client_id] : "Follow-up sent"}
                  </div>
                  <div style={{ fontFamily:fMono, fontSize:11, color:C.muted }}>{toast==="reminder" ? "Late payment notice · EU Dir. 2011/7/EU" : "Friendly reminder for invoice "+inv.inv_number}</div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:"48px", textAlign:"center", fontFamily:fUI, fontSize:14, color:C.faint, fontWeight:300 }}>No invoices in this view.</div>
        )}
      </div>
    </div>
  );
}

// ── Proposals ─────────────────────────────────────────────────────────────────
export function DProposals(props) {
  var onConvert = props.onConvert;
  var [view, setView] = useState("list");
  var [copied, setCopied] = useState(null);
  var stColor = { won:C.green, sent:C.blue, viewed:C.gold, declined:C.muted };
  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });
  var winCount = MOCK_PROPOSALS.filter(function(p){ return p.status === "won"; }).length;
  var sentCount = MOCK_PROPOSALS.filter(function(p){ return p.status !== "draft"; }).length;
  var winRate = sentCount > 0 ? Math.round(winCount / sentCount * 100) : 0;

  function duplicate(id) {
    setCopied(id);
    setTimeout(function(){ setCopied(null); }, 2000);
  }

  var pipeline = [
    { status:"sent",     label:"Sent",     color:C.blue  },
    { status:"viewed",   label:"Viewed",   color:C.gold  },
    { status:"won",      label:"Won",      color:C.green },
    { status:"declined", label:"Declined", color:C.muted },
  ];

  return (
    <div>
      <SectionHeader title="Proposals" sub="Track performance across all sent proposals." action={
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ background:C.greenSoft, border:"1px solid "+C.green+"22", borderRadius:9, padding:"8px 16px" }}>
            <span style={{ fontFamily:fMono, fontSize:12, color:C.green, letterSpacing:"0.04em" }}>Win rate {winRate}%</span>
          </div>
          <div style={{ display:"flex", gap:1, background:C.borderLt, borderRadius:9, padding:"3px" }}>
            {[["list","List"],["pipeline","Pipeline"]].map(function(pair) {
              var active = view === pair[0];
              return <button key={pair[0]} onClick={function(){ setView(pair[0]); }} style={{ background:active ? C.surface : "transparent", color:active ? C.ink : C.muted, border:"none", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontFamily:fMono, fontSize:12, fontWeight:active ? 500 : 400, boxShadow:active ? "0 1px 3px rgba(10,22,40,0.07)" : "none" }}>{pair[1]}</button>;
            })}
          </div>
        </div>
      } />

      {view === "list" && (
        <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
          {MOCK_PROPOSALS.map(function(p, i) {
            var sc = stColor[p.status] || C.muted;
            var isWon = p.status === "won";
            var noReply = (p.status === "sent" || p.status === "viewed") && p.view_count >= 2;
            return (
              <div key={p.id} style={{ borderBottom:i<MOCK_PROPOSALS.length-1 ? "1px solid "+C.borderLt : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 22px" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fUI, fontSize:15, fontWeight:500, color:C.ink, marginBottom:3 }}>{p.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:fUI, fontSize:13, color:C.muted }}>{clientMap[p.client_id] || "Unknown"}</span>
                      <span style={{ color:C.faint }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:C.muted }}>{p.view_count} views</span>
                      <span style={{ color:C.faint }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>last seen {p.last_viewed}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily:fMono, fontSize:15, color:C.ink, fontWeight:500, flexShrink:0 }}>{"€"+p.value.toLocaleString()}</div>
                  <Chip color={sc} dot={true}>{p.status}</Chip>
                  <button onClick={function(){ duplicate(p.id); }} style={{ background:"transparent", border:"1px solid "+C.border, color:C.muted, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fUI, fontSize:12, flexShrink:0, whiteSpace:"nowrap" }}>
                    {copied === p.id ? "✓ Copied" : "Duplicate"}
                  </button>
                  {isWon && <button onClick={function(){ if (onConvert) onConvert(p); }} style={{ background:C.accent, color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fUI, fontSize:12, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>→ Invoice</button>}
                </div>
                {noReply && (
                  <div style={{ margin:"0 22px 14px", padding:"11px 16px", background:C.goldSoft, border:"1px solid "+C.gold+"22", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <span style={{ fontFamily:fUI, fontSize:13, color:C.gold, fontWeight:300 }}>
                      {p.view_count >= 5 ? "Viewed "+p.view_count+" times — strong buying signal." : "No reply yet — last seen "+p.last_viewed+"."}
                    </span>
                    <button style={{ background:C.gold, color:"#fff", border:"none", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:fUI, fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>Follow up</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "pipeline" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>
          {pipeline.map(function(col) {
            var colItems = MOCK_PROPOSALS.filter(function(p){ return p.status === col.status; });
            var colTotal = colItems.reduce(function(sum, p){ return sum + p.value; }, 0);
            return (
              <div key={col.status}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:col.color }} />
                    <span style={{ fontFamily:fMono, fontSize:11, color:C.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>{col.label}</span>
                  </div>
                  {colTotal > 0 && <span style={{ fontFamily:fMono, fontSize:11, color:C.faint }}>{"€"+colTotal.toLocaleString()}</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {colItems.map(function(p) {
                    return (
                      <div key={p.id} style={{ background:C.surface, border:"1px solid "+C.border, borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 3px rgba(10,22,40,0.04)" }}>
                        <div style={{ fontFamily:fUI, fontSize:14, fontWeight:500, color:C.ink, marginBottom:4 }}>{p.title}</div>
                        <div style={{ fontFamily:fUI, fontSize:13, color:C.muted, marginBottom:8 }}>{clientMap[p.client_id] || ""}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontFamily:fMono, fontSize:13, color:col.color, fontWeight:500 }}>{"€"+p.value.toLocaleString()}</span>
                          <span style={{ fontFamily:fMono, fontSize:10, color:C.faint }}>{p.view_count} views</span>
                        </div>
                      </div>
                    );
                  })}
                  {colItems.length === 0 && (
                    <div style={{ background:C.borderLt, border:"1px dashed "+C.border, borderRadius:12, padding:"22px 16px", textAlign:"center", fontFamily:fUI, fontSize:13, color:C.faint, fontWeight:300 }}>None</div>
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
export function DBrandKits(props) {
  var [kits, setKits] = useState(MOCK_BRAND_KITS);
  var [selId, setSelId] = useState(kits[0] ? kits[0].id : null);
  var sel = kits.find(function(k){ return k.id === selId; }) || null;
  var [editName, setEditName] = useState(sel ? sel.name : "");
  var [editColor, setEditColor] = useState(sel ? sel.primary_color : "#17A99E");
  var [editFont, setEditFont] = useState(sel ? sel.font : "DM Sans");
  var [saved, setSaved] = useState(false);

  useEffect(function() {
    if (sel) { setEditName(sel.name); setEditColor(sel.primary_color); setEditFont(sel.font || "DM Sans"); }
  }, [selId]);

  function save() {
    setKits(function(prev){ return prev.map(function(k){ return k.id === selId ? Object.assign({}, k, { name:editName, primary_color:editColor, font:editFont }) : k; }); });
    setSaved(true);
    setTimeout(function(){ setSaved(false); }, 2000);
  }

  function addKit() {
    var newId = String(Date.now());
    setKits(function(prev){ return prev.concat([{ id:newId, name:"New Kit", primary_color:C.accent, font:"DM Sans", logo_text:"NK" }]); });
    setSelId(newId);
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"1px solid "+C.border, borderRadius:9, padding:"9px 12px", fontFamily:fUI, fontSize:14, color:C.ink, background:C.bg, outline:"none" };
  var lbl = { display:"block", marginBottom:5, fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:C.faint };

  return (
    <div>
      <SectionHeader title="Brand Kits" sub="One kit per client. Applied automatically to invoices and proposals." />
      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {kits.map(function(kit) {
            var active = selId === kit.id;
            return (
              <div key={kit.id} onClick={function(){ setSelId(kit.id); }} style={{ background:active ? C.surface : "transparent", border:"1.5px solid "+(active ? C.accent : C.border), borderRadius:11, padding:"11px 13px", cursor:"pointer", transition:"all 0.12s", boxShadow:active ? "0 1px 4px rgba(10,22,40,0.07)" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:kit.primary_color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:"#fff", fontWeight:700, flexShrink:0 }}>{kit.logo_text}</div>
                  <div style={{ fontFamily:fUI, fontSize:14, fontWeight:active ? 500 : 400, color:active ? C.ink : C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button onClick={addKit} style={{ background:"none", border:"1.5px dashed "+C.border, borderRadius:11, padding:"11px 13px", cursor:"pointer", color:C.faint, fontFamily:fUI, fontSize:14, textAlign:"left" }}>+ New Kit</button>
        </div>

        {sel && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:C.surface, borderRadius:16, padding:"24px 26px", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
              <Label>Editing — {sel.name}</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                <div><label style={lbl}>Brand name</label><input value={editName} onChange={function(e){ setEditName(e.target.value); }} style={inp} /></div>
                <div>
                  <label style={lbl}>Primary color</label>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <input type="color" value={editColor} onChange={function(e){ setEditColor(e.target.value); }} style={{ width:38, height:36, border:"1px solid "+C.border, borderRadius:7, cursor:"pointer", padding:2 }} />
                    <span style={{ fontFamily:fMono, fontSize:13, color:C.muted }}>{editColor}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={lbl}>Font</label>
                <select value={editFont} onChange={function(e){ setEditFont(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {["DM Sans","DM Serif Display","DM Mono","Playfair Display","Cormorant Garamond","Inter"].map(function(f) { return <option key={f} value={f}>{f}</option>; })}
                </select>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={save} style={{ background:saved ? C.green : C.accent, color:"#fff", border:"none", padding:"10px 22px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:14, fontWeight:500, transition:"background 0.15s" }}>{saved ? "✓ Saved" : "Save kit"}</button>
                <button style={{ background:"transparent", color:C.muted, border:"1px solid "+C.border, padding:"10px 22px", borderRadius:9, cursor:"pointer", fontFamily:fUI, fontSize:14 }}>Apply to all invoices</button>
              </div>
            </div>

            <div style={{ background:C.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(10,22,40,0.05)" }}>
              <div style={{ padding:"14px 22px", borderBottom:"1px solid "+C.borderLt }}><Label mb={0}>Preview</Label></div>
              <div style={{ padding:"24px", background:C.bg }}>
                <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:12, padding:"22px 26px", maxWidth:360 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:editColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:12, color:"#fff", fontWeight:700 }}>{sel.logo_text || editName[0] || "B"}</div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:fMono, fontSize:10, color:C.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice</div>
                      <div style={{ fontFamily:fMono, fontSize:13, color:C.ink, fontWeight:500 }}>DE-2026-001</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'"+editFont+"', sans-serif", fontSize:17, fontWeight:700, color:C.ink, marginBottom:2 }}>{editName}</div>
                  <div style={{ fontFamily:fUI, fontSize:12, color:C.faint, marginBottom:18 }}>yourname@studio.com</div>
                  <div style={{ borderTop:"2px solid "+editColor, paddingTop:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted, marginBottom:7 }}><span>Brand Identity</span><span style={{ color:C.ink, fontWeight:500 }}>€1,800</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:12, color:C.muted }}><span>Logo Design</span><span style={{ color:C.ink, fontWeight:500 }}>€2,400</span></div>
                    <div style={{ borderTop:"1px solid "+C.borderLt, marginTop:12, paddingTop:12, display:"flex", justifyContent:"space-between", fontFamily:fUI, fontSize:13, fontWeight:600, color:C.ink }}><span>Total</span><span style={{ color:editColor }}>€4,998</span></div>
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
