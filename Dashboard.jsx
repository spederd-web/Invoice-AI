import { useState } from "react";
import { L, fSans, fMono, fSerif, Icon, Tag, Stars, LogoMark } from "./constants.jsx";

export function Dashboard(props) {
  var setPage = props.setPage;
  var setConvertProposal = props.setConvertProposal;
  var [section, setSection] = useState("overview");
  var [client, setClient] = useState(null);
  var nav = [
    { id:"overview",  label:"Overview",  icon:"overview" },
    { id:"clients",   label:"Clients",   icon:"users" },
    { id:"payments",  label:"Payments",  icon:"card" },
    { id:"proposals", label:"Proposals", icon:"proposal" },
    { id:"brandkits", label:"Brand Kits",icon:"brand" },
  ];

  function handleConvert(proposal) {
    if (setConvertProposal) setConvertProposal(proposal);
    if (setPage) setPage("Generator");
  }

  return (
    <div className="dash-layout" style={{ display:"flex", minHeight:"calc(100vh - 56px)", background:"#F0EDE6" }}>
      <div className="dash-aside" style={{ width:220, background:L.navy, padding:"20px 0", flexShrink:0 }}>
        <div style={{ padding:"0 16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:"#FAF7F2", marginBottom:2 }}>InvoiceAI</div>
          <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(250,247,242,0.3)", letterSpacing:"0.08em" }}>for Europe</div>
        </div>
        <div style={{ padding:"16px 8px 0" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ setSection(item.id); setClient(null); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 12px", borderRadius:8, border:"none", background:active ? "rgba(23,169,158,0.1)" : "transparent", color:active ? L.accent : "rgba(250,247,242,0.45)", cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:active?500:400, marginBottom:2 }}>
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
        {section==="proposals" && <DProposals onConvert={handleConvert} />}
        {section==="brandkits" && <DBrandKits />}
      </div>
    </div>
  );
}

export function StatCard(props) {
  return (
    <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"16px 18px" }}>
      <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:6 }}>{props.label}</div>
      <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:700, color:props.color||L.ink, letterSpacing:"-0.02em" }}>{props.value}</div>
      {props.sub && <div style={{ fontFamily:fMono, fontSize:11, color:L.faint, marginTop:3 }}>{props.sub}</div>}
    </div>
  );
}

var DASH_META = {
  overview:  { title:"Overview",          sub:"Your studio at a glance." },
  clients:   { title:"Clients",           sub:"Manage your client relationships and invoices." },
  payments:  { title:"Payment Records",   sub:"Track sent, overdue and paid invoices." },
  proposals: { title:"Proposal Analytics",sub:"Track performance across all sent proposals." },
  brandkits: { title:"Brand Kits",        sub:"Create a kit per client. Applied automatically to invoices and proposals." },
};

function DashHeader(props) {
  var section = props.section;
  var action = props.action;
  var meta = DASH_META[section] || { title:section, sub:"" };
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:20, borderBottom:"1px solid "+L.border }}>
      <div>
        <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:800, color:L.ink, letterSpacing:"-0.02em", marginBottom:4 }}>{meta.title}</h2>
        <p className="d-dash-sub" style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300 }}>{meta.sub}</p>
      </div>
      {action}
    </div>
  );
}

function DashStatPill(props) {
  var label = props.label;
  var value = props.value;
  var color = props.color || L.ink;
  return (
    <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:8, padding:"8px 16px", display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</span>
      <span style={{ fontFamily:fSerif, fontSize:18, fontWeight:700, color:color }}>{value}</span>
    </div>
  );
}

export function DOverview() {
  var nudges = [
    { icon:"clock",    color:L.accent, msg:"App UI Kit proposal hasn't had a reply in 3 days.", action:"Send follow-up" },
    { icon:"document", color:L.accent, msg:"Invoice FR-2026-0021 is overdue by 108 days.", action:"Send reminder" },
    { icon:"send",     color:L.gold,   msg:"Pitch Deck proposal was viewed 7 times — no reply yet.", action:"Follow up now" },
  ];
  var [dismissed, setDismissed] = useState([]);
  var visible = nudges.filter(function(n, i){ return dismissed.indexOf(i) < 0; });
  return (
    <div>
      <h1 style={{ fontFamily:fSerif, fontSize:26, fontWeight:800, color:L.ink, marginBottom:4, letterSpacing:"-0.025em" }}>Good morning, Alex.</h1>
      <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:24 }}>Wednesday, 29 April 2026 · 4 clients · 1 overdue</p>
      {visible.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
          {visible.map(function(n, i) {
            var realIdx = nudges.indexOf(n);
            return (
              <div key={i} style={{ background:L.white, border:"1px solid "+n.color+"33", borderRadius:10, padding:"11px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:n.color+"12", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={n.icon} size={13} color={n.color} />
                </div>
                <span style={{ flex:1, fontFamily:fSans, fontSize:14, color:L.ink }}>{n.msg}</span>
                <button style={{ background:n.color, color:"#fff", border:"none", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, whiteSpace:"nowrap" }}>{n.action}</button>
                <button onClick={function(){ setDismissed(function(d){ return d.concat([realIdx]); }); }} style={{ background:"none", border:"none", color:L.faint, cursor:"pointer", fontSize:16, padding:"0 2px", lineHeight:1 }}>×</button>
              </div>
            );
          })}
        </div>
      )}
      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard label="Total Billed" value="€84,200" sub="↑ +23% vs last month" color={L.ink} />
        <StatCard label="Collected" value="€71,400" sub="84.8% collection rate" color={L.green} />
        <StatCard label="Outstanding" value="€12,800" sub="1 overdue" color={L.accent} />
        <StatCard label="Win Rate" value="68%" sub="↑ +5pp this quarter" color={L.blue} />
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:14 }}>Recent Activity</div>
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
                <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>{h.client}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{h.desc}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fMono, fontSize:10, color:stColor, background:stColor+"15", borderRadius:4, padding:"2px 7px", letterSpacing:"0.06em", marginBottom:2 }}>{h.status}</div>
                <div style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>{h.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DClients(props) {
  var setClient = props.setClient;
  return (
    <div>
      <DashHeader section="clients" action={
        <button style={{ background:L.accent, color:"#fff", border:"none", padding:"9px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, whiteSpace:"nowrap" }}>+ New Invoice</button>
      } />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CLIENTS.map(function(c) {
          var stColor = c.status==="active" ? L.green : c.status==="overdue" ? L.accent : L.gold;
          return (
            <div key={c.id} onClick={function(){ setClient(c); }} style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:c.col+"22", border:"1.5px solid "+c.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:15, color:c.col, fontWeight:500, flexShrink:0 }}>{c.av}</div>
              <div style={{ flex:1 }}>
                <div className="d-dash-body" style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{c.name}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.muted }}>{c.flag} · {c.city} · {c.invoices} invoices</div>
              </div>
              <div style={{ textAlign:"right" }}>
                {c.balance > 0 && <div style={{ fontFamily:fMono, fontSize:15, color:L.accent, fontWeight:500 }}>{"€"+c.balance.toLocaleString()+" outstanding"}</div>}
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint }}>{"€"+c.paid.toLocaleString()+" total paid"}</div>
              </div>
              <div style={{ fontFamily:fMono, fontSize:11, color:stColor, background:stColor+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em" }}>{c.status}</div>
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
      <button onClick={function(){ setClient(null); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontFamily:fMono, fontSize:12, letterSpacing:"0.06em", marginBottom:16, padding:0 }}>← All clients</button>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:c.col+"22", border:"1.5px solid "+c.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:16, color:c.col, fontWeight:500 }}>{c.av}</div>
        <div>
          <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>{c.name}</h2>
          <p style={{ fontFamily:fMono, fontSize:13, color:L.muted }}>{c.flag} · {c.city}</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
        <StatCard label="Total Billed" value={"€"+c.paid.toLocaleString()} />
        <StatCard label="Outstanding" value={"€"+c.balance.toLocaleString()} color={c.balance>0?L.accent:L.green} />
        <StatCard label="Invoices" value={c.invoices} />
      </div>
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:12 }}>Full History</div>
        <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300 }}>Invoice and proposal history will appear here once connected to your account.</p>
      </div>
    </div>
  );
}

export function DPayments() {
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
      <DashHeader section="payments" action={
        <div style={{ background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:8, padding:"9px 14px", display:"flex", alignItems:"center", gap:7 }}>
          <Icon name="clock" size={13} color={L.accent} />
          <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, letterSpacing:"0.06em" }}>1 overdue · €3,200</span>
        </div>
      } />
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, overflow:"hidden" }}>
        {rows.map(function(r, i) {
          var isOverdue = r.status === "overdue";
          var isSent = r.status === "sent";
          var toast = sent[r.inv];
          return (
            <div key={r.inv} style={{ borderBottom:i<rows.length-1?"1px solid "+L.borderLt:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", background:isOverdue ? "rgba(23,169,158,0.04)" : "transparent" }}>
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, width:130, flexShrink:0 }}>{r.inv}</div>
                <div style={{ flex:1 }}>
                  <div className="d-dash-body" style={{ fontFamily:fSans, fontSize:15, color:L.ink }}>{r.client}</div>
                  {isOverdue && <div style={{ fontFamily:fMono, fontSize:11, color:L.accent, marginTop:2 }}>{"Overdue "+r.daysOver+" days"}</div>}
                </div>
                <div style={{ fontFamily:fMono, fontSize:15, color:L.ink, fontWeight:500, flexShrink:0 }}>{"€"+r.amount.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.muted, width:90, textAlign:"right", flexShrink:0 }}>{r.due}</div>
                <div style={{ fontFamily:fMono, fontSize:11, color:stColor[r.status]||L.muted, background:(stColor[r.status]||L.muted)+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em", flexShrink:0 }}>{r.status}</div>
                {isOverdue && (
                  <button onClick={function(){ handleAction(r.inv, "reminder"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>
                    Send Reminder
                  </button>
                )}
                {isSent && (
                  <button onClick={function(){ handleAction(r.inv, "followup"); }} style={{ background:"transparent", color:L.blue, border:"1px solid "+L.blue+"44", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:13, flexShrink:0, whiteSpace:"nowrap" }}>
                    Follow Up
                  </button>
                )}
                {r.status === "paid" && (
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.green, flexShrink:0 }}>✓ All clear</span>
                )}
              </div>
              {toast && (
                <div style={{ margin:"0 20px 12px", padding:"10px 14px", background:toast==="reminder" ? L.accentGlow : L.blueGlow, border:"1px solid "+(toast==="reminder" ? L.accent : L.blue)+"33", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
                  <Icon name="send" size={13} color={toast==="reminder" ? L.accent : L.blue} />
                  <div>
                    <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>
                      {toast==="reminder" ? "Reminder sent to "+r.client : "Follow-up sent to "+r.client}
                    </div>
                    <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, marginTop:1 }}>
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

export function DProposals(props) {
  var onConvert = props.onConvert;
  var rows = [
    { title:"Brand Identity — TechFlow",    client:"Studio Verde GmbH", value:8400,  status:"won",      sent:"12 Apr", views:4, lastViewed:"2 days ago" },
    { title:"App UI Kit + Design System",   client:"Nord Digital AS",   value:12000, status:"sent",     sent:"28 Apr", views:2, lastViewed:"3 days ago" },
    { title:"Pitch Deck — Series A",        client:"Bianchi & Co.",     value:2800,  status:"viewed",   sent:"22 Apr", views:7, lastViewed:"6 hours ago" },
    { title:"Website Redesign",             client:"Maison Fontaine",   value:6500,  status:"declined", sent:"5 Mar",  views:1, lastViewed:"8 Mar" },
  ];
  var stColor = { won:L.green, sent:L.blue, viewed:L.gold, declined:L.muted };
  var stLabel = { won:"Won", sent:"Sent", viewed:"Viewed", declined:"Declined" };
  var [copied, setCopied] = useState(null);

  function duplicate(title) {
    setCopied(title);
    setTimeout(function(){ setCopied(null); }, 2000);
  }

  return (
    <div>
      <DashHeader section="proposals" action={
        <div style={{ display:"flex", gap:8 }}>
          <DashStatPill label="Win rate" value="68%" color={L.green} />
          <DashStatPill label="Avg views" value="3.5" />
        </div>
      } />
      <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, overflow:"hidden" }}>
        {rows.map(function(r, i) {
          var sc = stColor[r.status] || L.muted;
          var isWon = r.status === "won";
          var noReply = r.status === "sent" || r.status === "viewed";
          return (
            <div key={r.title} style={{ borderBottom:i<rows.length-1?"1px solid "+L.borderLt:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="d-dash-body" style={{ fontFamily:fSans, fontSize:15, fontWeight:500, color:L.ink, marginBottom:3 }}>{r.title}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{r.client}</span>
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>·</span>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Icon name="overview" size={11} color={L.faint} />
                      <span style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{r.views} views</span>
                    </div>
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>·</span>
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>last seen {r.lastViewed}</span>
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>·</span>
                    <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>sent {r.sent}</span>
                  </div>
                </div>
                <div style={{ fontFamily:fMono, fontSize:15, color:L.ink, fontWeight:500, flexShrink:0 }}>{"€"+r.value.toLocaleString()}</div>
                <div style={{ fontFamily:fMono, fontSize:11, color:sc, background:sc+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em", flexShrink:0 }}>{stLabel[r.status]}</div>
                <button onClick={function(){ duplicate(r.title); }} style={{ background:"transparent", border:"1px solid "+L.border, color:L.muted, padding:"5px 10px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:12, flexShrink:0, whiteSpace:"nowrap" }}>
                  {copied === r.title ? "✓ Duplicated" : "Duplicate"}
                </button>
                {isWon && (
                  <button onClick={function(){ if(onConvert) onConvert(r); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"5px 10px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, flexShrink:0, whiteSpace:"nowrap" }}>
                    → Invoice
                  </button>
                )}
              </div>
              {noReply && r.views >= 2 && (
                <div style={{ margin:"0 20px 10px", padding:"8px 12px", background:L.goldGlow, border:"1px solid "+L.gold+"33", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                  <span style={{ fontFamily:fSans, fontSize:13, color:L.gold }}>
                    {r.views >= 5 ? "Viewed " + r.views + " times with no reply — strong interest signal." : "No reply yet — last viewed " + r.lastViewed + "."}
                  </span>
                  <button style={{ background:L.gold, color:"#fff", border:"none", padding:"4px 10px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>Follow up</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DBrandKits() {
  var kits = [
    { name:"Daniel Speder",  primary:"#C8502A", font:"Playfair Display",   logo:"A" },
    { name:"Nord Creative",     primary:"#2A5E9A", font:"DM Sans",             logo:"NC" },
    { name:"Bianchi Studio",    primary:"#2A7A54", font:"Cormorant Garamond",  logo:"B" },
  ];
  var [sel, setSel] = useState(kits[0]);
  return (
    <div>
      <DashHeader section="brandkits" />
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {kits.map(function(kit) {
            var active = sel && sel.name===kit.name;
            return (
              <div key={kit.name} onClick={function(){ setSel(kit); }} style={{ background:active?"#FAF7F2":"transparent", border:"1.5px solid "+(active?L.accent:L.border), borderRadius:10, padding:"10px 12px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:kit.primary, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:12, color:"#fff", fontWeight:700 }}>{kit.logo}</div>
                  <div style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>{kit.name}</div>
                </div>
              </div>
            );
          })}
          <button style={{ background:"none", border:"1.5px dashed "+L.border, borderRadius:10, padding:"10px 12px", cursor:"pointer", color:L.muted, fontFamily:fSans, fontSize:14 }}>+ New Kit</button>
        </div>
        {sel && (
          <div style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"20px 24px" }}>
            <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:14 }}>Editing: {sel.name}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Brand Name</label><input defaultValue={sel.name} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"7px 10px", fontFamily:fSans, fontSize:15, color:L.ink, background:L.white, outline:"none" }} /></div>
              <div><label style={{ display:"block", marginBottom:4, fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Primary Color</label><input type="color" defaultValue={sel.primary} style={{ width:"100%", height:34, border:"1.5px solid "+L.border, borderRadius:6, cursor:"pointer" }} /></div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ background:L.accent, color:"#fff", border:"none", padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>Save Kit</button>
              <button style={{ background:"transparent", color:L.ink, border:"1.5px solid "+L.border, padding:"9px 20px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14 }}>Apply to All Invoices</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

