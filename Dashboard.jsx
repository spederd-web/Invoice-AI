import { useState, useEffect, useCallback } from "react";
import { L, fSans, fMono, fSerif, Icon, LogoMark } from "./constants.jsx";

// ── Supabase data hook ────────────────────────────────────────────────────────
// useDB(table, userId) — fetch, insert, update, delete with loading/error state
// Falls back to mock data when userId is null (demo mode)
export function useDB(table, userId) {
  var [rows, setRows] = useState([]);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);

  var fetch_ = useCallback(function() {
    if (!userId) return; // demo mode: caller provides mock data
    setLoading(true);
    setError(null);
    fetch("/api/db?table=" + encodeURIComponent(table) + "&user_id=" + encodeURIComponent(userId))
      .then(function(r) { return r.json(); })
      .then(function(data) { setRows(data || []); setLoading(false); })
      .catch(function(err) { setError(err.message); setLoading(false); });
  }, [table, userId]);

  useEffect(function() { fetch_(); }, [fetch_]);

  function insert(payload) {
    return fetch("/api/db", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ table:table, action:"insert", user_id:userId, payload:payload }),
    }).then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
  }

  function update(id, payload) {
    return fetch("/api/db", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ table:table, action:"update", id:id, user_id:userId, payload:payload }),
    }).then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
  }

  function remove(id) {
    return fetch("/api/db", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ table:table, action:"delete", id:id, user_id:userId }),
    }).then(function(r) { return r.json(); }).then(function(data) { fetch_(); return data; });
  }

  return { rows:rows, loading:loading, error:error, refresh:fetch_, insert:insert, update:update, remove:remove };
}

// ── Supabase schema reference (run once in Supabase SQL editor) ───────────────
/*
create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  email text,
  company text,
  country text default 'DE',
  city text,
  vat_number text,
  iban text,
  notes text,
  avatar text,
  color text,
  created_at timestamptz default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id uuid references clients(id),
  inv_number text not null,
  issue_date date,
  due_date date,
  status text default 'draft', -- draft | sent | paid | overdue
  amount_net numeric(12,2) default 0,
  amount_vat numeric(12,2) default 0,
  amount_gross numeric(12,2) default 0,
  currency text default 'EUR',
  data jsonb,
  created_at timestamptz default now()
);

create table proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id uuid references clients(id),
  title text not null,
  status text default 'draft', -- draft | sent | viewed | won | declined
  value numeric(12,2) default 0,
  sent_at timestamptz,
  view_count int default 0,
  last_viewed_at timestamptz,
  data jsonb,
  created_at timestamptz default now()
);

create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  primary_color text default '#17A99E',
  secondary_color text default '#081120',
  font text default 'DM Sans',
  logo_text text,
  logo_bg text,
  created_at timestamptz default now()
);

-- Row-level security (RLS) — enable for all tables
alter table clients    enable row level security;
alter table invoices   enable row level security;
alter table proposals  enable row level security;
alter table brand_kits enable row level security;

-- Policies (repeat for each table)
create policy "Users own their data" on clients    for all using (auth.uid() = user_id);
create policy "Users own their data" on invoices   for all using (auth.uid() = user_id);
create policy "Users own their data" on proposals  for all using (auth.uid() = user_id);
create policy "Users own their data" on brand_kits for all using (auth.uid() = user_id);
*/

// ── Mock data (demo mode — no auth) ──────────────────────────────────────────
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
  { id:"1", name:"Daniel Speder",  primary_color:"#C8502A", font:"Playfair Display",  logo_text:"DS" },
  { id:"2", name:"Nord Creative",  primary_color:"#2A5E9A", font:"DM Sans",           logo_text:"NC" },
  { id:"3", name:"Bianchi Studio", primary_color:"#2A7A54", font:"Cormorant Garamond",logo_text:"B"  },
];

// ── Small atoms ───────────────────────────────────────────────────────────────
function StatusPill(props) {
  var color = props.color || L.muted;
  return (
    <span style={{ fontFamily:fMono, fontSize:11, color:color, background:color+"18", borderRadius:5, padding:"3px 8px", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
      {props.children}
    </span>
  );
}

function SectionLabel(props) {
  return (
    <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:L.faint, marginBottom:props.mb || 12 }}>
      {props.children}
    </div>
  );
}

export function StatCard(props) {
  return (
    <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:12, padding:"18px 20px" }}>
      <SectionLabel mb={8}>{props.label}</SectionLabel>
      <div style={{ fontFamily:fSerif, fontSize:28, fontWeight:700, color:props.color||L.ink, letterSpacing:"-0.02em", lineHeight:1 }}>{props.value}</div>
      {props.sub && <div style={{ fontFamily:fMono, fontSize:11, color:L.faint, marginTop:6, letterSpacing:"0.02em" }}>{props.sub}</div>}
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
    { id:"overview",  label:"Overview",   icon:"overview" },
    { id:"clients",   label:"Clients",    icon:"users" },
    { id:"invoices",  label:"Invoices",   icon:"document" },
    { id:"proposals", label:"Proposals",  icon:"proposal" },
    { id:"brandkits", label:"Brand Kits", icon:"brand" },
  ];

  function handleConvert(proposal) {
    if (setConvertProposal) setConvertProposal(proposal);
    if (setPage) setPage("Generator");
  }

  var selectedClient = MOCK_CLIENTS.find(function(c){ return c.id === clientId; }) || null;

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 58px)", background:L.paper }}>
      {/* Sidebar */}
      <div className="dash-aside" style={{ width:224, background:L.navy, flexShrink:0, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"24px 16px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LogoMark size={26} />
            <div>
              <div style={{ fontFamily:fSerif, fontSize:14, color:"rgba(240,244,248,0.9)", lineHeight:1.2 }}>InvoiceAI</div>
              <div style={{ fontFamily:fMono, fontSize:10, color:"rgba(240,244,248,0.25)", letterSpacing:"0.08em" }}>Studio</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"12px 8px", flex:1 }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ setSection(item.id); setClientId(null); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderRadius:8, border:"none", marginBottom:2, cursor:"pointer",
                background: active ? "rgba(23,169,158,0.12)" : "transparent",
                color: active ? "#fff" : "rgba(240,244,248,0.4)",
                fontFamily:fSans, fontSize:14, fontWeight:active ? 500 : 400,
                transition:"background 0.12s, color 0.12s",
              }}>
                <Icon name={item.icon} size={15} color={active ? L.accent : "rgba(240,244,248,0.3)"} />
                {item.label}
                {active && <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:L.accent }} />}
              </button>
            );
          })}
        </div>
        {/* Bottom user strip */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:L.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:L.navy, fontWeight:700, flexShrink:0 }}>
              {user && user.email ? user.email[0].toUpperCase() : "A"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:fSans, fontSize:13, color:"rgba(240,244,248,0.7)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user && user.email ? user.email : "Demo mode"}
              </div>
              <div style={{ fontFamily:fMono, fontSize:10, color:"rgba(240,244,248,0.25)", letterSpacing:"0.05em" }}>Studio plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>
        {section==="overview" && <DOverview userId={userId} setSection={setSection} />}
        {section==="clients" && !clientId && <DClients userId={userId} setClientId={setClientId} setPage={setPage} />}
        {section==="clients" && clientId && selectedClient && <DClientDetail client={selectedClient} setClientId={setClientId} invoices={MOCK_INVOICES} proposals={MOCK_PROPOSALS} />}
        {section==="invoices" && <DInvoices userId={userId} />}
        {section==="proposals" && <DProposals userId={userId} onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits userId={userId} />}
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader(props) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
      <div>
        <h2 style={{ fontFamily:fSerif, fontSize:26, fontWeight:700, color:L.ink, letterSpacing:"-0.025em", marginBottom:4 }}>{props.title}</h2>
        {props.sub && <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300 }}>{props.sub}</p>}
      </div>
      {props.action && <div>{props.action}</div>}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function DOverview(props) {
  var setSection = props.setSection;

  var [dismissed, setDismissed] = useState([]);
  var nudges = [
    { icon:"clock",    color:L.gold,   msg:"App UI Kit proposal hasn't had a reply in 3 days.", cta:"Follow up" },
    { icon:"document", color:L.accent, msg:"Invoice FR-2026-0021 is overdue by 108 days.", cta:"Send reminder" },
    { icon:"send",     color:L.blue,   msg:"Pitch Deck viewed 7 times — no reply yet.", cta:"Follow up now" },
  ];
  var visible = nudges.filter(function(n, i){ return dismissed.indexOf(i) < 0; });

  var now = new Date();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateStr = days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear();

  var activity = [
    { type:"invoice",  client:"Studio Verde GmbH", desc:"Invoice DE-2026-0437 sent · €4,200",        time:"2h ago",   status:"sent",    sc:L.blue  },
    { type:"proposal", client:"Maison Fontaine",   desc:"Proposal accepted · Brand Identity €8,400",  time:"Yesterday",status:"won",     sc:L.green },
    { type:"invoice",  client:"Bianchi & Co.",     desc:"Invoice IT-2026-007 overdue since 15 Jan",   time:"16d ago",  status:"overdue", sc:L.accent },
    { type:"proposal", client:"Nord Digital AS",   desc:"Proposal viewed · App Design €6,500",        time:"3d ago",   status:"viewed",  sc:L.gold  },
  ];

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:fSerif, fontSize:28, fontWeight:700, color:L.ink, letterSpacing:"-0.025em", marginBottom:4 }}>Good morning.</h1>
        <p style={{ fontFamily:fMono, fontSize:12, color:L.faint, letterSpacing:"0.04em" }}>{dateStr} · 4 clients · 1 overdue</p>
      </div>

      {/* Nudges */}
      {visible.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
          {visible.map(function(n, i) {
            var realIdx = nudges.indexOf(n);
            return (
              <div key={i} style={{ background:L.white, border:"1px solid "+n.color+"28", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:n.color+"12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={n.icon} size={14} color={n.color} />
                </div>
                <span style={{ flex:1, fontFamily:fSans, fontSize:14, color:L.ink, fontWeight:300 }}>{n.msg}</span>
                <button style={{ background:n.color+"18", color:n.color, border:"1px solid "+n.color+"30", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, whiteSpace:"nowrap" }}>{n.cta}</button>
                <button onClick={function(){ setDismissed(function(d){ return d.concat([realIdx]); }); }} style={{ background:"none", border:"none", color:L.faint, cursor:"pointer", fontSize:16, padding:"0 2px", lineHeight:1 }}>×</button>
              </div>
            );
          })}
        </div>
      )}

      {/* KPI stats */}
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        <StatCard label="Total Billed" value="€84,200" sub="↑ +23% vs last month" />
        <StatCard label="Collected" value="€71,400" sub="84.8% collection rate" color={L.green} />
        <StatCard label="Outstanding" value="€12,800" sub="1 overdue · €3,200" color={L.accent} />
        <StatCard label="Win Rate" value="68%" sub="↑ +5pp this quarter" color={L.blue} />
      </div>

      {/* Activity feed */}
      <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid "+L.borderLt, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <SectionLabel mb={0}>Recent activity</SectionLabel>
          <button onClick={function(){ setSection("invoices"); }} style={{ background:"none", border:"none", fontFamily:fMono, fontSize:11, color:L.accent, cursor:"pointer", letterSpacing:"0.04em" }}>View all →</button>
        </div>
        {activity.map(function(h, i) {
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 20px", borderBottom:i<activity.length-1 ? "1px solid "+L.borderLt : "none" }}>
              <div style={{ width:34, height:34, borderRadius:8, background:h.sc+"12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon name={h.type==="invoice" ? "document" : "proposal"} size={15} color={h.sc} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>{h.client}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontWeight:300 }}>{h.desc}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <StatusPill color={h.sc}>{h.status}</StatusPill>
                <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>{h.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function DClients(props) {
  var setClientId = props.setClientId;
  var setPage = props.setPage;
  var [search, setSearch] = useState("");
  var [sent, setSent] = useState({});

  var stColor = { active:L.green, overdue:L.accent, prospect:L.blue };
  var filtered = MOCK_CLIENTS.filter(function(c){
    return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 || (c.city && c.city.toLowerCase().indexOf(search.toLowerCase()) >= 0);
  });

  var countryFlag = { DE:"🇩🇪", FR:"🇫🇷", IT:"🇮🇹", SE:"🇸🇪" };

  function quickInvoice(clientId) {
    setSent(function(s){ return Object.assign({}, s, { [clientId]: true }); });
    setTimeout(function(){ setSent(function(s){ var n = Object.assign({}, s); delete n[clientId]; return n; }); }, 2000);
    if (setPage) setPage("Generator");
  }

  return (
    <div>
      <SectionHeader title="Clients" sub="Your active client relationships." action={
        <button onClick={function(){ if (setPage) setPage("Generator"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"9px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>+ New Invoice</button>
      } />

      {/* Search */}
      <div style={{ position:"relative", marginBottom:20 }}>
        <input
          value={search}
          onChange={function(e){ setSearch(e.target.value); }}
          placeholder="Search clients…"
          style={{ width:"100%", boxSizing:"border-box", border:"1px solid "+L.border, borderRadius:9, padding:"9px 12px 9px 36px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.white, outline:"none" }}
        />
        <Icon name="users" size={14} color={L.faint} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }} />
      </div>

      <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
        {filtered.map(function(c, i) {
          var sc = stColor[c.status] || L.muted;
          return (
            <div key={c.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"15px 20px", borderBottom:i<filtered.length-1 ? "1px solid "+L.borderLt : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = L.paper; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}
            >
              <div onClick={function(){ setClientId(c.id); }} style={{ display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:c.color+"22", border:"1.5px solid "+c.color+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:c.color, fontWeight:600, flexShrink:0 }}>{c.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{c.name}</div>
                  <div style={{ fontFamily:fMono, fontSize:12, color:L.faint }}>{countryFlag[c.country] || ""} {c.city} · {c.invoices} invoice{c.invoices !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  {c.balance > 0 && <div style={{ fontFamily:fMono, fontSize:14, color:L.accent, fontWeight:500 }}>{"€"+c.balance.toLocaleString()+" due"}</div>}
                  <div style={{ fontFamily:fMono, fontSize:12, color:L.faint }}>{"€"+c.paid.toLocaleString()+" paid"}</div>
                </div>
                <StatusPill color={sc}>{c.status}</StatusPill>
              </div>
              <button onClick={function(e){ e.stopPropagation(); quickInvoice(c.id); }} style={{ background:sent[c.id] ? L.greenGlow : L.paper, color:sent[c.id] ? L.green : L.muted, border:"1px solid "+(sent[c.id] ? L.green+"44" : L.border), padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, flexShrink:0, whiteSpace:"nowrap", transition:"all 0.15s" }}>
                {sent[c.id] ? "✓ Opening…" : "New invoice"}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:"40px 20px", textAlign:"center", fontFamily:fSans, fontSize:14, color:L.faint, fontWeight:300 }}>No clients match "{search}"</div>
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
  var stColor = { sent:L.blue, paid:L.green, overdue:L.accent, draft:L.muted };

  return (
    <div>
      <button onClick={function(){ setClientId(null); }} style={{ background:"none", border:"none", color:L.faint, cursor:"pointer", fontFamily:fMono, fontSize:12, letterSpacing:"0.06em", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:6 }}>
        <Icon name="reverse" size={12} color={L.faint} /> All clients
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
        <div style={{ width:54, height:54, borderRadius:14, background:c.color+"22", border:"1.5px solid "+c.color+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:18, color:c.color, fontWeight:600 }}>{c.avatar}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:700, color:L.ink, letterSpacing:"-0.02em" }}>{c.name}</h2>
          <p style={{ fontFamily:fMono, fontSize:13, color:L.faint }}>{c.country} · {c.city}</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
        <StatCard label="Total Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance > 0 ? L.accent : L.green} />
        <StatCard label="Invoices" value={String(c.invoices)} />
      </div>
      {clientInvoices.length > 0 && (
        <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden", marginBottom:16 }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid "+L.borderLt }}><SectionLabel mb={0}>Invoices</SectionLabel></div>
          {clientInvoices.map(function(inv, i) {
            var sc = stColor[inv.status] || L.muted;
            return (
              <div key={inv.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:i<clientInvoices.length-1?"1px solid "+L.borderLt:"none" }}>
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, flex:1 }}>{inv.inv_number}</div>
                <div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, width:100, textAlign:"right" }}>{inv.due_date}</div>
                <StatusPill color={sc}>{inv.status}</StatusPill>
              </div>
            );
          })}
        </div>
      )}
      {clientProposals.length > 0 && (
        <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid "+L.borderLt }}><SectionLabel mb={0}>Proposals</SectionLabel></div>
          {clientProposals.map(function(p, i) {
            var pColors = { won:L.green, sent:L.blue, viewed:L.gold, declined:L.muted };
            var sc = pColors[p.status] || L.muted;
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:i<clientProposals.length-1?"1px solid "+L.borderLt:"none" }}>
                <div style={{ flex:1, fontFamily:fSans, fontSize:14, color:L.ink }}>{p.title}</div>
                <div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{"€"+p.value.toLocaleString()}</div>
                <StatusPill color={sc}>{p.status}</StatusPill>
              </div>
            );
          })}
        </div>
      )}
      {clientInvoices.length === 0 && clientProposals.length === 0 && (
        <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, padding:"32px 20px", textAlign:"center", fontFamily:fSans, fontSize:14, color:L.faint, fontWeight:300 }}>
          No invoices or proposals yet for this client.
        </div>
      )}
    </div>
  );
}

// ── Invoices ──────────────────────────────────────────────────────────────────
function DInvoices(props) {
  var [filter, setFilter] = useState("all");
  var [sent, setSent] = useState({});
  var stColor = { sent:L.blue, paid:L.green, overdue:L.accent, draft:L.muted };

  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });

  var filtered = MOCK_INVOICES.filter(function(inv){
    if (filter === "outstanding") return inv.status === "sent" || inv.status === "overdue";
    if (filter === "paid") return inv.status === "paid";
    return true;
  });

  function handleAction(invId, action) {
    setSent(function(s){ return Object.assign({}, s, { [invId]: action }); });
    setTimeout(function(){ setSent(function(s){ var n = Object.assign({}, s); delete n[invId]; return n; }); }, 3000);
  }

  var totalOutstanding = MOCK_INVOICES.filter(function(inv){ return inv.status === "sent" || inv.status === "overdue"; }).reduce(function(sum, inv){ return sum + inv.amount_gross; }, 0);

  return (
    <div>
      <SectionHeader title="Invoices" sub="Track sent, overdue and paid invoices." action={
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {totalOutstanding > 0 && (
            <div style={{ background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:8, padding:"8px 14px", display:"flex", alignItems:"center", gap:7 }}>
              <Icon name="clock" size={13} color={L.accent} />
              <span style={{ fontFamily:fMono, fontSize:12, color:L.accent, letterSpacing:"0.04em" }}>{"€"+totalOutstanding.toLocaleString()+" outstanding"}</span>
            </div>
          )}
        </div>
      } />

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:2, background:L.cream, borderRadius:9, padding:"3px", border:"1px solid "+L.border, width:"fit-content", marginBottom:20 }}>
        {[["all","All"],["outstanding","Outstanding"],["paid","Paid"]].map(function(pair) {
          var active = filter === pair[0];
          return (
            <button key={pair[0]} onClick={function(){ setFilter(pair[0]); }} style={{ background:active ? L.white : "transparent", color:active ? L.ink : L.muted, border:"none", padding:"6px 16px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:active ? 500 : 400, boxShadow:active ? "0 1px 3px rgba(10,22,40,0.08)" : "none" }}>
              {pair[1]}
            </button>
          );
        })}
      </div>

      <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
        {filtered.map(function(inv, i) {
          var isOverdue = inv.status === "overdue";
          var isSent = inv.status === "sent";
          var sc = stColor[inv.status] || L.muted;
          var toast = sent[inv.id];
          return (
            <div key={inv.id} style={{ borderBottom:i<filtered.length-1 ? "1px solid "+L.borderLt : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", background:isOverdue ? L.accent+"05" : "transparent" }}>
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, width:130, flexShrink:0 }}>{inv.inv_number}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:fSans, fontSize:14, color:L.ink }}>{clientMap[inv.client_id] || "Unknown"}</div>
                  {isOverdue && <div style={{ fontFamily:fMono, fontSize:11, color:L.accent, marginTop:2 }}>Overdue · due {inv.due_date}</div>}
                </div>
                <div style={{ fontFamily:fMono, fontSize:15, color:L.ink, fontWeight:500, flexShrink:0 }}>{"€"+inv.amount_gross.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, width:90, textAlign:"right", flexShrink:0 }}>{inv.due_date}</div>
                <StatusPill color={sc}>{inv.status}</StatusPill>
                {isOverdue && (
                  <button onClick={function(){ handleAction(inv.id, "reminder"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>Send reminder</button>
                )}
                {isSent && (
                  <button onClick={function(){ handleAction(inv.id, "followup"); }} style={{ background:"transparent", color:L.blue, border:"1px solid "+L.blue+"44", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, flexShrink:0, whiteSpace:"nowrap" }}>Follow up</button>
                )}
                {inv.status === "paid" && (
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.green, flexShrink:0 }}>✓ Paid</span>
                )}
              </div>
              {toast && (
                <div style={{ margin:"0 20px 12px", padding:"10px 14px", background:toast==="reminder" ? L.accentGlow : L.blueGlow, border:"1px solid "+(toast==="reminder" ? L.accent : L.blue)+"33", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
                  <Icon name="send" size={13} color={toast==="reminder" ? L.accent : L.blue} />
                  <div>
                    <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>
                      {toast==="reminder" ? "Reminder sent to "+clientMap[inv.client_id] : "Follow-up sent to "+clientMap[inv.client_id]}
                    </div>
                    <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, marginTop:1 }}>
                      {toast==="reminder" ? "Late payment notice with statutory interest reference — EU Dir. 2011/7/EU" : "Friendly payment reminder for invoice "+inv.inv_number}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding:"40px 20px", textAlign:"center", fontFamily:fSans, fontSize:14, color:L.faint, fontWeight:300 }}>No invoices in this view.</div>
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
  var stColor = { won:L.green, sent:L.blue, viewed:L.gold, declined:L.muted };

  var clientMap = {};
  MOCK_CLIENTS.forEach(function(c){ clientMap[c.id] = c.name; });

  var winCount = MOCK_PROPOSALS.filter(function(p){ return p.status === "won"; }).length;
  var winRate = Math.round(winCount / MOCK_PROPOSALS.filter(function(p){ return p.status !== "draft"; }).length * 100);
  var avgViews = Math.round(MOCK_PROPOSALS.reduce(function(sum, p){ return sum + (p.view_count || 0); }, 0) / MOCK_PROPOSALS.length * 10) / 10;

  function duplicate(id) {
    setCopied(id);
    setTimeout(function(){ setCopied(null); }, 2000);
  }

  // Pipeline view — group by status
  var pipeline = [
    { status:"sent",     label:"Sent",     color:L.blue },
    { status:"viewed",   label:"Viewed",   color:L.gold },
    { status:"won",      label:"Won",      color:L.green },
    { status:"declined", label:"Declined", color:L.muted },
  ];

  return (
    <div>
      <SectionHeader title="Proposals" sub="Track performance across all sent proposals." action={
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ background:L.greenGlow, border:"1px solid "+L.green+"33", borderRadius:8, padding:"7px 14px" }}>
            <span style={{ fontFamily:fMono, fontSize:12, color:L.green, letterSpacing:"0.04em" }}>Win rate {winRate}%</span>
          </div>
          <div style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:8, padding:"7px 14px" }}>
            <span style={{ fontFamily:fMono, fontSize:12, color:L.muted, letterSpacing:"0.04em" }}>Avg {avgViews} views</span>
          </div>
          {/* View toggle */}
          <div style={{ display:"flex", gap:2, background:L.cream, borderRadius:8, padding:"3px", border:"1px solid "+L.border }}>
            {[["list","List"],["pipeline","Pipeline"]].map(function(pair) {
              var active = view === pair[0];
              return <button key={pair[0]} onClick={function(){ setView(pair[0]); }} style={{ background:active ? L.white : "transparent", color:active ? L.ink : L.muted, border:"none", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:fMono, fontSize:12, fontWeight:active ? 500 : 400, boxShadow:active ? "0 1px 3px rgba(10,22,40,0.08)" : "none" }}>{pair[1]}</button>;
            })}
          </div>
        </div>
      } />

      {view === "list" && (
        <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
          {MOCK_PROPOSALS.map(function(p, i) {
            var sc = stColor[p.status] || L.muted;
            var isWon = p.status === "won";
            var noReply = p.status === "sent" || p.status === "viewed";
            return (
              <div key={p.id} style={{ borderBottom:i<MOCK_PROPOSALS.length-1 ? "1px solid "+L.borderLt : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink, marginBottom:3 }}>{p.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{clientMap[p.client_id] || "Unknown"}</span>
                      <span style={{ color:L.faint }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{p.view_count} views</span>
                      <span style={{ color:L.faint }}>·</span>
                      <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>last seen {p.last_viewed}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily:fMono, fontSize:15, color:L.ink, fontWeight:500, flexShrink:0 }}>{"€"+p.value.toLocaleString()}</div>
                  <StatusPill color={sc}>{p.status}</StatusPill>
                  <button onClick={function(){ duplicate(p.id); }} style={{ background:"transparent", border:"1px solid "+L.border, color:L.muted, padding:"5px 10px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:12, flexShrink:0, whiteSpace:"nowrap" }}>
                    {copied === p.id ? "✓ Copied" : "Duplicate"}
                  </button>
                  {isWon && (
                    <button onClick={function(){ if (onConvert) onConvert(p); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"5px 10px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>→ Invoice</button>
                  )}
                </div>
                {noReply && p.view_count >= 2 && (
                  <div style={{ margin:"0 20px 12px", padding:"9px 14px", background:L.gold+"0F", border:"1px solid "+L.gold+"28", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                    <span style={{ fontFamily:fSans, fontSize:13, color:L.gold, fontWeight:300 }}>
                      {p.view_count >= 5 ? "Viewed "+p.view_count+" times — strong buying signal." : "No reply yet — last seen "+p.last_viewed+"."}
                    </span>
                    <button style={{ background:L.gold, color:"#fff", border:"none", padding:"4px 10px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>Follow up</button>
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
            var colProposals = MOCK_PROPOSALS.filter(function(p){ return p.status === col.status; });
            var colTotal = colProposals.reduce(function(sum, p){ return sum + p.value; }, 0);
            return (
              <div key={col.status}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:col.color }} />
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>{col.label}</span>
                  </div>
                  {colTotal > 0 && <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>{"€"+colTotal.toLocaleString()}</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {colProposals.map(function(p) {
                    return (
                      <div key={p.id} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:10, padding:"12px 14px" }}>
                        <div style={{ fontFamily:fSans, fontSize:13, fontWeight:500, color:L.ink, marginBottom:4 }}>{p.title}</div>
                        <div style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginBottom:6 }}>{clientMap[p.client_id] || ""}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontFamily:fMono, fontSize:12, color:col.color }}>{"€"+p.value.toLocaleString()}</span>
                          <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{p.view_count} views</span>
                        </div>
                      </div>
                    );
                  })}
                  {colProposals.length === 0 && (
                    <div style={{ background:L.paper, border:"1px dashed "+L.border, borderRadius:10, padding:"20px 14px", textAlign:"center", fontFamily:fSans, fontSize:13, color:L.faint, fontWeight:300 }}>None</div>
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
    var newKit = { id:newId, name:"New Kit", primary_color:L.accent, font:"DM Sans", logo_text:"NK" };
    setKits(function(prev){ return prev.concat([newKit]); });
    setSelId(newId);
  }

  return (
    <div>
      <SectionHeader title="Brand Kits" sub="One kit per client. Applied automatically to invoices and proposals." />
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20 }}>
        {/* Kit list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {kits.map(function(kit) {
            var active = selId === kit.id;
            return (
              <div key={kit.id} onClick={function(){ setSelId(kit.id); }} style={{ background:active ? L.white : "transparent", border:"1.5px solid "+(active ? L.accent : L.border), borderRadius:10, padding:"10px 12px", cursor:"pointer", transition:"all 0.12s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:kit.primary_color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:11, color:"#fff", fontWeight:700, flexShrink:0 }}>{kit.logo_text}</div>
                  <div style={{ fontFamily:fSans, fontSize:14, fontWeight:active ? 500 : 400, color:active ? L.ink : L.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button onClick={addKit} style={{ background:"none", border:"1.5px dashed "+L.border, borderRadius:10, padding:"10px 12px", cursor:"pointer", color:L.faint, fontFamily:fSans, fontSize:14, textAlign:"left", transition:"border-color 0.12s" }}>+ New Kit</button>
        </div>

        {sel && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Editor */}
            <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, padding:"22px 24px" }}>
              <SectionLabel>Editing — {sel.name}</SectionLabel>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <div>
                  <label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Brand name</label>
                  <input value={editName} onChange={function(e){ setEditName(e.target.value); }} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:7, padding:"8px 10px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none" }} />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Primary color</label>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <input type="color" value={editColor} onChange={function(e){ setEditColor(e.target.value); }} style={{ width:38, height:34, border:"1.5px solid "+L.border, borderRadius:7, cursor:"pointer", padding:2 }} />
                    <span style={{ fontFamily:fMono, fontSize:13, color:L.muted }}>{editColor}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Font</label>
                <select value={editFont} onChange={function(e){ setEditFont(e.target.value); }} style={{ border:"1.5px solid "+L.border, borderRadius:7, padding:"8px 10px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none", cursor:"pointer" }}>
                  {["DM Sans","DM Serif Display","DM Mono","Playfair Display","Cormorant Garamond","Inter"].map(function(f) {
                    return <option key={f} value={f}>{f}</option>;
                  })}
                </select>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={save} style={{ background:saved ? L.green : L.accent, color:"#fff", border:"none", padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, transition:"background 0.15s" }}>
                  {saved ? "✓ Saved" : "Save kit"}
                </button>
                <button style={{ background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14 }}>Apply to all invoices</button>
              </div>
            </div>

            {/* Live preview */}
            <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, overflow:"hidden" }}>
              <div style={{ padding:"12px 20px", borderBottom:"1px solid "+L.borderLt }}><SectionLabel mb={0}>Preview</SectionLabel></div>
              <div style={{ padding:"24px", background:"#FAFAFA" }}>
                <div style={{ background:"#fff", border:"1px solid "+L.border, borderRadius:10, padding:"20px 24px", maxWidth:380 }}>
                  {/* Mini invoice preview */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:editColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:12, color:"#fff", fontWeight:700 }}>
                      {sel.logo_text || editName[0] || "B"}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:fMono, fontSize:10, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice</div>
                      <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500 }}>DE-2026-001</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'"+editFont+"', sans-serif", fontSize:17, fontWeight:700, color:L.ink, marginBottom:2 }}>{editName}</div>
                  <div style={{ fontFamily:fSans, fontSize:12, color:L.faint, marginBottom:16 }}>yourname@studio.com</div>
                  <div style={{ borderTop:"2px solid "+editColor, paddingTop:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:12, color:L.muted, marginBottom:6 }}>
                      <span>Brand Identity Workshop</span><span style={{ color:L.ink, fontWeight:500 }}>€1,800</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:12, color:L.muted }}>
                      <span>Logo Design</span><span style={{ color:L.ink, fontWeight:500 }}>€2,400</span>
                    </div>
                    <div style={{ borderTop:"1px solid "+L.border, marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink }}>
                      <span>Total</span><span style={{ color:editColor }}>€4,998</span>
                    </div>
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
