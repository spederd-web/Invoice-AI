import { useState, useEffect, useRef } from "react";
import { L, fSans, fMono, fSerif, t, EU, validateIBAN, validateBIC, validateEUVAT, validateGermanTax, fmtDate, useVIES, VIESBadge, Icon, Tag, FieldError, PROJ_TYPES, BUDGETS, TIMELINES, PROJ_TEMPLATES, COUNTRY_TONE, PORTAL_INVOICE } from "./constants.jsx";

export function InvoicePreviewPanel(props) {
  var s = props.state;
  var setView = props.setView;
  var sub = s.lines.reduce(function(acc, l) { return acc + (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0); }, 0);
  var discAmt = s.discount ? sub * (parseFloat(s.discount)/100) : 0;
  var subAfter = sub - discAmt;
  var vatRate = (s.rc || s.vatExempt) ? 0 : (s.country ? s.country.vat : 19);
  var vatAmt = subAfter * vatRate / 100;
  var total = subAfter + vatAmt;
  var sym = s.country && s.country.cur === "SEK" ? "kr" : "€";
  var yr = new Date().getFullYear();
  var invNum = s.invNum || ((s.country ? s.country.code : "DE") + "-" + yr + "-001");
  var cnNum = "CN-" + yr + "-001";
  var [xrLoading, setXrLoading] = useState(false);
  var [xrError, setXrError] = useState("");
  var [navLoading, setNavLoading] = useState(false);
  var [navError, setNavError] = useState("");
  var [numCopied, setNumCopied] = useState(false);

  function copyInvNum() {
    var num = s.creditNote ? cnNum : invNum;
    navigator.clipboard.writeText(num).then(function(){
      setNumCopied(true);
      setTimeout(function(){ setNumCopied(false); }, 2000);
    }).catch(function(){});
  }

  function exportXRechnung() {
    setXrLoading(true); setXrError("");
    var payload = {
      sellerName:    s.sName   || "Your Name / Studio",
      sellerStreet:  s.sStreet || "",
      sellerCity:    s.sCity   || "",
      sellerCountry: "DE",
      sellerVAT:     s.sVAT    || "",
      sellerIBAN:    s.sIBAN   || "",
      sellerBIC:     s.sBIC    || "",
      buyerName:     s.cName   || "",
      buyerStreet:   s.cStreet || "",
      buyerCity:     s.cCity   || "",
      buyerCountry:  s.country ? s.country.code : "DE",
      buyerVAT:      s.cVAT    || "",
      buyerReference: s.orderRef || "",
      invoiceNumber: invNum,
      issueDate:     new Date().toISOString().slice(0, 10),
      dueDate:       s.terms === "Net 14" ? new Date(Date.now() + 14*86400000).toISOString().slice(0,10)
                   : s.terms === "Net 30" ? new Date(Date.now() + 30*86400000).toISOString().slice(0,10)
                   : s.terms === "Net 60" ? new Date(Date.now() + 60*86400000).toISOString().slice(0,10)
                   : new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
      currency:      s.country && s.country.cur ? s.country.cur : "EUR",
      note:          s.note || "",
      reverseCharge: !!s.rc,
      kleinunternehmer: !!s.vatExempt,
      lines: s.lines.filter(function(l){ return l.desc && l.qty && l.rate; }).map(function(l) {
        var lineQty = parseFloat(l.qty) || 0;
        var lineRate = parseFloat(l.rate) || 0;
        return {
          desc:      l.desc,
          qty:       lineQty,
          unit:      "C62",
          unitPrice: lineRate,
          vatRate:   (s.rc || s.vatExempt) ? 0 : vatRate,
          lineTotal: lineQty * lineRate,
        };
      }),
      subtotal:  subAfter,
      vatAmount: vatAmt,
      total:     total,
    };

    fetch("/api/xrechnung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then(function(r) {
      if (!r.ok) return r.json().then(function(e) { throw new Error(e.error || "Export failed"); });
      return r.text();
    })
    .then(function(xml) {
      var blob = new Blob([xml], { type: "application/xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = invNum + "_XRechnung.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setXrLoading(false);
    })
    .catch(function(err) {
      setXrError(err.message);
      setXrLoading(false);
    });
  }

  function exportNAV() {
    setNavLoading(true); setNavError("");
    var isEU = s.country && s.country.eu;
    var payload = {
      sellerName:          s.sName || "Your Name / Studio",
      sellerTaxNumber:     s.sVAT || "",
      sellerStreet:        s.sStreet || "",
      sellerCity:          s.sCity || "",
      sellerBankAccount:   s.sIBAN || "",
      buyerName:           s.cName || "",
      buyerTaxNumber:      s.cVAT || "",
      buyerStreet:         s.cStreet || "",
      buyerCity:           s.cCity || "",
      buyerCountry:        s.country ? s.country.code : "HU",
      buyerIsEU:           isEU && s.country && s.country.code !== "HU",
      invoiceNumber:       invNum,
      issueDate:           new Date().toISOString().slice(0, 10),
      deliveryDate:        new Date().toISOString().slice(0, 10),
      dueDate:             new Date(Date.now() + 30*86400000).toISOString().slice(0, 10),
      currency:            s.country && s.country.cur ? s.country.cur : "HUF",
      reverseCharge:       !!s.rc,
      vatExempt:           !!s.vatExempt,
      note:                s.note || "",
      lines: s.lines.filter(function(l){ return l.desc && l.qty && l.rate; }).map(function(l) {
        var qty = parseFloat(l.qty) || 0;
        var rate = parseFloat(l.rate) || 0;
        var net = qty * rate;
        var vat = (s.rc || s.vatExempt) ? 0 : net * (vatRate / 100);
        return { desc:l.desc, qty:qty, unit:"db", unitPrice:rate, vatCode:s.rc?"EUT":s.vatExempt?"AAM":"27", vatRate:vatRate, lineNet:net, lineVat:vat, lineGross:net+vat };
      }),
      invoiceNetAmount:   subAfter,
      invoiceVatAmount:   vatAmt,
      invoiceGrossAmount: total,
    };
    fetch("/api/nav", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload),
    })
    .then(function(r) {
      if (!r.ok) return r.json().then(function(e){ throw new Error(e.error || "Export failed"); });
      return r.text();
    })
    .then(function(xml) {
      var blob = new Blob([xml], { type:"application/xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = invNum + "_NAV.xml";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setNavLoading(false);
    })
    .catch(function(err){ setNavError(err.message); setNavLoading(false); });
  }
  var [sharePhase, setSharePhase] = useState("idle");
  var [shareUrl, setShareUrl] = useState("");
  var [shareCopied, setShareCopied] = useState(false);
  var [savePhase, setSavePhase] = useState("idle"); // idle | saving | saved | error

  function saveToDashboard() {
    setSavePhase("saving");
    var user = null;
    try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
    if (!user || !user.id) { setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); return; }
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "invoices",
        action: "insert",
        user_id: user.id,
        payload: {
          inv_number:    invNum,
          issue_date:    new Date().toISOString().slice(0,10),
          due_date:      new Date(Date.now() + (parseInt(s.terms||30))*86400000).toISOString().slice(0,10),
          status:        "draft",
          amount_net:    Math.round(subAfter * 100) / 100,
          amount_vat:    Math.round(vatAmt * 100) / 100,
          amount_gross:  Math.round(total * 100) / 100,
          currency:      s.country && s.country.cur ? s.country.cur : "EUR",
          data: {
            seller: { name:s.sName, vat:s.sVAT, iban:s.sIBAN, bic:s.sBIC, street:s.sStreet, city:s.sCity },
            buyer:  { name:s.cName, vat:s.cVAT, street:s.cStreet, city:s.cCity },
            lines:  s.lines,
            rc:     s.rc, gdpr:s.gdpr, vatExempt:s.vatExempt, terms:s.terms,
          },
        },
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) { setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); return; }
      setSavePhase("saved");
      setTimeout(function(){ setSavePhase("idle"); }, 3000);
    })
    .catch(function() { setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); });
  }

  function shareInvoice() {
    setSharePhase("saving"); setShareUrl("");
    var payload = {
      inv_number:    invNum,
      seller_name:   s.sName || "Your Name / Studio",
      seller_street: s.sStreet || "",
      seller_city:   s.sCity || "",
      seller_vat:    s.sVAT || "",
      seller_iban:   s.sIBAN || "",
      seller_bic:    s.sBIC || "",
      seller_email:  s.sEmail || "",
      buyer_name:    s.cName || "",
      buyer_street:  s.cStreet || "",
      buyer_city:    s.cCity || "",
      buyer_vat:     s.cVAT || "",
      issue_date:    new Date().toISOString().slice(0, 10),
      due_date:      new Date(Date.now() + (parseInt(s.terms||30))*86400000).toISOString().slice(0,10),
      currency:      s.country && s.country.cur ? s.country.cur : "EUR",
      terms:         s.terms || "30",
      subtotal:      subAfter,
      vat_amount:    vatAmt,
      total:         total,
      vat_rate:      vatRate,
      reverse_charge: !!s.rc,
      vat_exempt:    !!s.vatExempt,
      late_payment:  !!s.latePayment,
      gdpr:          !!s.gdpr,
      credit_note:   !!s.creditNote,
      proj_ref:      s.projRef || "",
      lines:         s.lines.filter(function(l){ return l.desc || l.rate; }),
    };
    fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.id) {
        var url = window.location.origin + "/?portal=" + data.id;
        setShareUrl(url);
        navigator.clipboard.writeText(url).catch(function(){});
        setSharePhase("copied");
        setTimeout(function(){ setSharePhase("idle"); }, 3000);
      } else {
        setSharePhase("error");
        setTimeout(function(){ setSharePhase("idle"); }, 4000);
      }
    })
    .catch(function() {
      setSharePhase("error");
      setTimeout(function(){ setSharePhase("idle"); }, 4000);
    });
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(shareUrl).then(function(){
      setShareCopied(true);
      setTimeout(function(){ setShareCopied(false); }, 2000);
    }).catch(function(){});
  }

  return (
    <div className="inv-preview-wrap" style={{ padding:"0 20px 48px", maxWidth:960, margin:"0 auto" }}>

      {/* -- Action bar -- */}
      <div style={{ maxWidth:580, marginBottom:16 }}>

        {/* Primary - Share */}
        <button onClick={shareInvoice} disabled={sharePhase === "saving"} style={{
          width:"100%",
          background: sharePhase === "copied" ? L.green : sharePhase === "saving" ? L.border : L.accent,
          color: sharePhase === "saving" ? L.muted : "#fff",
          border:"none", padding:"12px 20px", borderRadius:10,
          cursor: sharePhase === "saving" ? "not-allowed" : "pointer",
          fontFamily:fSans, fontSize:14, fontWeight:500,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          marginBottom:8, transition:"background 0.2s",
          boxShadow: sharePhase === "saving" || sharePhase === "copied" ? "none" : "0 2px 10px rgba(20,153,144,0.2)",
        }}>
          <Icon name={sharePhase === "copied" ? "check" : "send"} size={13} color={sharePhase === "saving" ? L.muted : "#fff"} />
          {sharePhase === "saving" ? "Saving..." : sharePhase === "copied" ? "OK Link copied" : "Share with client"}
        </button>

        {/* Share URL strip */}
        {sharePhase === "copied" && shareUrl && (
          <div style={{ marginBottom:8, display:"flex", alignItems:"center", gap:8, background:L.greenGlow, border:"1px solid "+L.green+"33", borderRadius:8, padding:"8px 12px" }}>
            <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{shareUrl}</span>
            <button onClick={copyShareUrl} style={{ background:"transparent", border:"1px solid "+L.green+"44", borderRadius:5, padding:"3px 8px", cursor:"pointer", fontFamily:fMono, fontSize:11, color:L.green, flexShrink:0 }}>
              {shareCopied ? "OK" : "Copy"}
            </button>
          </div>
        )}
        {sharePhase === "error" && (
          <div style={{ marginBottom:8, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"8px 12px", fontFamily:fSans, fontSize:13, color:"#C0392B" }}>
            Share failed - check Supabase env vars in Vercel.
          </div>
        )}

        {/* Secondary row - scrollable on mobile */}
        <div style={{ display:"flex", alignItems:"center", gap:8, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:2 }}>
          <button onClick={function(){ window.print(); }} style={{
            background:"transparent", color:L.ink,
            border:"1px solid "+L.border, padding:"7px 14px",
            borderRadius:8, cursor:"pointer", fontFamily:fSans,
            fontSize:13, display:"flex", alignItems:"center", gap:5,
            whiteSpace:"nowrap",
          }}>
            <Icon name="download" size={12} color={L.muted} />
            Export PDF
          </button>
          <button onClick={exportXRechnung} disabled={xrLoading} style={{
            background:"transparent", color:L.ink,
            border:"1px solid "+L.border, padding:"7px 14px",
            borderRadius:8, cursor:xrLoading ? "not-allowed" : "pointer",
            fontFamily:fSans, fontSize:13,
            display:"flex", alignItems:"center", gap:5,
            whiteSpace:"nowrap", opacity:xrLoading ? 0.5 : 1,
          }}>
            <Icon name="document" size={12} color={L.muted} />
            {xrLoading ? "Generating..." : "XRechnung XML"}
          </button>
          {s.country && s.country.code === "HU" && (
            <button onClick={exportNAV} disabled={navLoading} style={{
              background:"transparent", color:L.ink,
              border:"1px solid "+L.border, padding:"7px 14px",
              borderRadius:8, cursor:navLoading ? "not-allowed" : "pointer",
              fontFamily:fSans, fontSize:13,
              display:"flex", alignItems:"center", gap:5,
              whiteSpace:"nowrap", opacity:navLoading ? 0.5 : 1,
            }}>
              <Icon name="document" size={12} color={L.muted} />
              {navLoading ? "Generating..." : "NAV XML"}
            </button>
          )}
          {/* Tertiary - save, inline with secondary */}
          <button onClick={saveToDashboard} disabled={savePhase === "saving"} style={{
            background:"none", border:"none", padding:"7px 4px",
            cursor:savePhase === "saving" ? "not-allowed" : "pointer",
            fontFamily:fSans, fontSize:13,
            color: savePhase === "saved" ? L.green : savePhase === "error" ? L.red : L.muted,
            display:"flex", alignItems:"center", gap:5,
            whiteSpace:"nowrap",
          }}>
            <Icon name={savePhase === "saved" ? "check" : "document"} size={11} color={savePhase === "saved" ? L.green : savePhase === "error" ? L.red : L.faint} />
            {savePhase === "saving" ? "Saving..." : savePhase === "saved" ? "Saved" : savePhase === "error" ? "Sign in to save" : "Save to dashboard"}
          </button>
        </div>

        {/* Error notes */}
        {xrError && <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:6 }}>XRechnung: {xrError}</p>}
        {navError && <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:6 }}>NAV: {navError}</p>}
      </div>
      <div id="print-invoice" style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, padding:"36px 40px", boxShadow:"0 8px 32px rgba(10,10,15,0.08)" }}>
        {s.creditNote && (
          <div style={{ background:L.goldGlow, border:"1.5px solid "+L.gold+"55", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="document" size={14} color={L.gold} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.gold, letterSpacing:"0.08em", textTransform:"uppercase" }}>Credit Note . {cnNum} . Ref: {invNum}</span>
          </div>
        )}
        {s.eInvoice && (
          <div style={{ background:L.blueGlow, border:"1.5px solid "+L.blue+"44", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="send" size={14} color={L.blue} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.blue, letterSpacing:"0.07em" }}>
              {s.country && s.country.code === "DE" ? "XRechnung 3.0" : s.country && s.country.code === "FR" ? "Factur-X 1.0" : s.country && s.country.code === "IT" ? "XML/SDI" : "EN16931"} . EU e-invoice
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div>
            <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:900, color:s.creditNote ? L.gold : L.ink, letterSpacing:"-0.02em" }}>{s.creditNote ? "CREDIT NOTE" : "INVOICE"}</div>
            <div onClick={copyInvNum} title="Click to copy" style={{ fontFamily:fMono, fontSize:12, color:numCopied ? L.green : L.muted, marginTop:2, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, userSelect:"none" }}>
              {numCopied ? "OK Copied" : "No. " + (s.creditNote ? cnNum : invNum)}
              {!numCopied && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="4" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="white"/></svg>}
            </div>
            {s.projRef && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:3, fontStyle:"italic" }}>Re: {s.projRef}</div>}
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink }}>{s.sName}</div>
            {s.sStreet && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted }}>{s.sStreet}</div>}
            {s.sCity && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted }}>{s.sCity}</div>}
            {s.vatExempt
              ? <div style={{ fontFamily:fMono, fontSize:11, color:L.gold }}>VAT-exempt . SS19 UStG</div>
              : <div style={{ fontFamily:fMono, fontSize:12, color:L.muted }}>VAT No: {s.sVAT}</div>
            }
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, marginBottom:18 }}>
          {[{l:"Date",v:fmtDate(s.country)},{l:"Due",v:fmtDate(s.country,parseInt(s.terms||30))},{l:"Terms",v:"Net "+s.terms+" days"}].map(function(x,i) {
            return (
              <div key={x.l} style={{ padding:"10px 12px", borderRight:i<2 ? "1px solid "+L.border : "none" }}>
                <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:L.muted, marginBottom:2 }}>{x.l}</div>
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500 }}>{x.v}</div>
              </div>
            );
          })}
        </div>
        {s.rc && (
          <div style={{ background:"rgba(42,94,154,0.06)", border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="reverse" size={11} color={L.blue} />
            <p style={{ fontFamily:fSans, fontSize:13, color:L.blue, margin:0 }}>Reverse charge - VAT liability transfers to the recipient (Art. 44 EU VAT Dir. 2006/112/EC)</p>
          </div>
        )}
        {s.rc && (
          <div style={{ background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginBottom:14 }}>
            <p style={{ fontFamily:fSans, fontSize:12, color:L.blue, margin:0 }}>
              <strong>ZM reminder:</strong> This RC transaction must be reported quarterly to your tax authority. Keep a record for your ZM/recapitulative statement filing.
            </p>
          </div>
        )}
        {s.country && s.country.eu === false && (
          <div style={{ background:L.goldGlow, border:"1px solid "+L.gold+"33", borderRadius:6, padding:"7px 10px", marginBottom:14 }}>
            <p style={{ fontFamily:fSans, fontSize:13, color:L.gold, margin:0 }}>
              <strong>Export / Third country:</strong> Service not subject to VAT per SS3a UStG. No VAT charged - exempt export. Include reference: "Leistungsort nicht im Inland."
            </p>
          </div>
        )}
        {s.vatExempt && (
          <div style={{ background:L.goldGlow, border:"1px solid "+L.gold+"33", borderRadius:6, padding:"7px 10px", marginBottom:14 }}>
            <p style={{ fontFamily:fSans, fontSize:13, color:L.gold, margin:0 }}>Kein Umsatzsteuerausweis gemaess SS19 UStG (Kleinunternehmerregelung)</p>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:4 }}>Bill To</div>
          <div className="d-dash-body" style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{s.cName}</div>
          {s.cStreet && <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{s.cStreet}</div>}
          {s.cCity && <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{s.cCity}</div>}
          {s.cVAT && <div style={{ fontFamily:fMono, fontSize:12, color:L.muted, marginTop:2 }}>VAT No: {s.cVAT}</div>}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
          <thead>
            <tr>
              {["Description","Qty","Rate","Total"].map(function(h) {
                return <th key={h} style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, padding:"5px 0", textAlign:h==="Description"?"left":"right", borderBottom:"2px solid "+L.ink }}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {s.lines.filter(function(l) { return l.desc || l.rate; }).map(function(l, i) {
              var lt = (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0);
              return (
                <tr key={i} style={{ borderBottom:"1px solid "+L.border }}>
                  <td className="d-inv-td" style={{ fontFamily:fSans, fontSize:14, color:L.ink, padding:"8px 0" }}>{l.desc}</td>
                  <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"8px 0" }}>{l.qty}</td>
                  <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"8px 0" }}>{sym+parseFloat(l.rate||0).toFixed(2)}</td>
                  <td style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500, textAlign:"right", padding:"8px 0" }}>{sym+lt.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <div style={{ minWidth:220 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.muted, padding:"2px 0" }}>
              <span>Subtotal</span><span style={{ fontFamily:fMono }}>{sym+sub.toFixed(2)}</span>
            </div>
            {discAmt > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.green, padding:"2px 0" }}>
                <span>Discount {s.discount}%</span><span style={{ fontFamily:fMono }}>{"-"+sym+discAmt.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.muted, padding:"2px 0" }}>
              <span>{s.vatExempt ? "VAT (exempt)" : "VAT "+vatRate+"%"+(s.rc?" (RC)":"")}</span>
              <span style={{ fontFamily:fMono }}>{s.vatExempt ? "-" : sym+vatAmt.toFixed(2)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, borderTop:"1.5px solid "+L.ink, paddingTop:6, marginTop:4 }}>
              <span>Total Due</span><span style={{ color:L.accent }}>{sym+total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div style={{ background:L.cream, borderRadius:7, padding:"10px 13px", marginTop:16, border:"1px solid "+L.border }}>
          <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:6 }}>SEPA Bank Transfer</div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>IBAN</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{s.sIBAN}</div></div>
            <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>BIC</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{s.sBIC}</div></div>
            <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>Payment Ref</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{s.creditNote ? cnNum : invNum}</div></div>
          </div>
        </div>
        {s.gdpr && <p style={{ marginTop:10, fontFamily:fSans, fontSize:11, color:L.muted, borderTop:"1px solid "+L.border, paddingTop:8 }}>Your personal data is processed for invoicing purposes in accordance with GDPR Art. 6(1)(b) - EU Regulation 2016/679.</p>}
        {s.latePayment && (
          <div style={{ background:"rgba(23,169,158,0.06)", border:"1px solid "+L.accent+"33", borderRadius:6, padding:"8px 12px", marginTop:10 }}>
            <p style={{ fontFamily:fSans, fontSize:11, color:L.accent, margin:0, lineHeight:1.55 }}>
              Late payment: statutory interest at 8% above ECB base rate applies on overdue amounts per EU Directive 2011/7/EU.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CheckRow(props) {
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
        <label onClick={function(){ if(!blocked) onChange(!checked); }} style={{ fontFamily:fSans, fontSize:14, color:L.ink, cursor:blocked ? "not-allowed" : "pointer", flex:1 }}>{label}</label>
        <span style={{ fontFamily:fMono, fontSize:10, color:badgeColor, background:badgeColor+"15", border:"1px solid "+badgeColor+"33", borderRadius:4, padding:"1px 6px", letterSpacing:"0.05em", flexShrink:0 }}>{badge}</span>
        <button onClick={onInfo} style={{ width:16, height:16, borderRadius:"50%", background:infoOpen ? L.accent : L.sand, border:"1px solid "+(infoOpen ? L.accent : L.border), color:infoOpen ? "#fff" : L.muted, fontFamily:fMono, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>?</button>
      </div>
      {blocked && <p style={{ fontFamily:fSans, fontSize:12, color:L.faint, margin:"2px 0 4px 22px" }}>{blockedReason}</p>}
      {warn && checked && <p style={{ fontFamily:fSans, fontSize:12, color:L.gold, margin:"2px 0 4px 22px" }}>(!) {warn}</p>}
      {infoOpen && (
        <div style={{ margin:"6px 0 6px", padding:"12px 14px", background:L.white, borderRadius:8, border:"1px solid "+L.borderLt }}>
          {[["What it is",infoWhat],["When to tick it",infoWhen],["What it adds",infoEffect]].map(function(row) {
            return (
              <div key={row[0]} style={{ display:"flex", gap:9, marginBottom:8 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  <Icon name="info" size={11} color={L.accent} />
                </div>
                <div>
                  <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:L.accent, marginBottom:2 }}>{row[0]}</div>
                  <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.55, fontWeight:300 }}>{row[1]}</div>
                </div>
              </div>
            );
          })}
          <div style={{ paddingTop:8, borderTop:"1px solid "+L.borderLt, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="eu" size={10} color={L.faint} />
            <span style={{ fontFamily:fMono, fontSize:10, color:L.faint, letterSpacing:"0.06em" }}>{infoLaw}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function InvoiceForm(props) {
  var s = props.state;
  var u = props.update;
  var setView = props.setView;
  var addLine = props.addLine;
  var updLine = props.updLine;
  var remLine = props.remLine;
  var [activeInfo, setActiveInfo] = useState(null);

  var sameCountry = s.cCo === (s.country ? s.country.code : "DE");
  var viesStatus = useVIES(s.cVAT);
  var sub = s.lines.reduce(function(acc, l) { return acc + (parseFloat(l.qty)||0) * (parseFloat(l.rate)||0); }, 0);
  var discAmt = s.discount ? sub * (parseFloat(s.discount)/100) : 0;
  var vatRate = (s.rc || s.vatExempt) ? 0 : (s.country ? s.country.vat : 19);
  var vatAmt = (sub - discAmt) * vatRate / 100;
  var total = (sub - discAmt) + vatAmt;
  var sym = s.country && s.country.cur === "SEK" ? "kr" : "€";

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1px solid "+L.border, borderRadius:8, padding:"9px 12px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none" };
  var monoStyle = { width:"100%", boxSizing:"border-box", border:"1px solid "+L.border, borderRadius:8, padding:"9px 12px", fontFamily:fMono, fontSize:13, color:L.ink, background:L.paper, outline:"none" };
  var lblStyle = { display:"block", marginBottom:5, fontFamily:fSans, fontSize:12, color:L.muted, fontWeight:400 };

  function cardWrap(title, badge, content) {
    return (
      <div style={{ background:L.white, borderRadius:14, marginBottom:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.06)" }}>
        <div style={{ padding:"14px 20px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink, letterSpacing:"-0.01em" }}>{title}</span>
          {badge}
        </div>
        <div style={{ padding:"0 20px 20px" }}>{content}</div>
      </div>
    );
  }

  return (
    <div className="inv-grid desktop-inv" style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 260px", gap:14, padding:"24px 20px 64px" }}>
      <div>
        <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:400, color:L.ink, marginBottom:5, letterSpacing:"-0.02em" }}>Invoice details</h2>
        <p className="d-section-sub" style={{ fontFamily:fSans, fontSize:14, color:L.muted, marginBottom:24, fontWeight:300, lineHeight:1.5 }}>Fill in your details. EU VAT, reverse charge and SEPA applied automatically.</p>
        {cardWrap("Your Business", <Tag c={L.accent}>Seller</Tag>, (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ gridColumn:"1/-1" }}><label style={lblStyle}>Business Name *</label><input value={s.sName} onChange={function(e){ u("sName",e.target.value); }} style={inpStyle} /></div>
            <div>
              <label style={lblStyle}>VAT Number *</label>
              <input value={s.sVAT} onChange={function(e){ u("sVAT",e.target.value); }} style={Object.assign({}, monoStyle, validateEUVAT(s.sVAT) === "valid" ? {borderColor:L.green} : validateEUVAT(s.sVAT) ? {borderColor:"#C0392B"} : {})} />
              <FieldError result={validateEUVAT(s.sVAT)} value={s.sVAT} />
            </div>
            <div>
              <label style={lblStyle}>IBAN *</label>
              <input value={s.sIBAN} onChange={function(e){ u("sIBAN",e.target.value.toUpperCase()); }} style={Object.assign({}, monoStyle, validateIBAN(s.sIBAN) === "valid" ? {borderColor:L.green} : validateIBAN(s.sIBAN) ? {borderColor:"#C0392B"} : {})} />
              <FieldError result={validateIBAN(s.sIBAN)} value={s.sIBAN} />
            </div>
            <div>
              <label style={lblStyle}>BIC/SWIFT</label>
              <input value={s.sBIC} onChange={function(e){ u("sBIC",e.target.value.toUpperCase()); }} style={Object.assign({}, monoStyle, validateBIC(s.sBIC) === "valid" ? {borderColor:L.green} : validateBIC(s.sBIC) ? {borderColor:"#C0392B"} : {})} />
              <FieldError result={validateBIC(s.sBIC)} value={s.sBIC} />
            </div>
            <div><label style={lblStyle}>Street</label><input value={s.sStreet} onChange={function(e){ u("sStreet",e.target.value); }} placeholder="e.g. Leopoldstr. 10" style={inpStyle} /></div>
            <div><label style={lblStyle}>City</label><input value={s.sCity} onChange={function(e){ u("sCity",e.target.value); }} placeholder="e.g. 80802 Muenchen" style={inpStyle} /></div>
          </div>
        ))}
        {cardWrap("Client", <Tag c={L.blue}>Bill To</Tag>, (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <div><label style={lblStyle}>Client Name *</label><input value={s.cName} onChange={function(e){ u("cName",e.target.value); }} style={inpStyle} /></div>
              <div>
                <label style={lblStyle}>Country</label>
                <select value={s.cCo} onChange={function(e){ u("cCo",e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                  <optgroup label="EU Member States">
                    {EU.filter(function(c){ return c.eu; }).map(function(c) { return <option key={c.code} value={c.code}>{c.name}</option>; })}
                  </optgroup>
                  <optgroup label="Non-EU / Third Countries">
                    {EU.filter(function(c){ return !c.eu; }).map(function(c) { return <option key={c.code+c.name} value={c.code+"-"+c.name}>{c.name}</option>; })}
                  </optgroup>
                </select>
              </div>
              <div><label style={lblStyle}>Street</label><input value={s.cStreet} onChange={function(e){ u("cStreet",e.target.value); }} placeholder="Rue de Rivoli 1" style={inpStyle} /></div>
              <div><label style={lblStyle}>City</label><input value={s.cCity} onChange={function(e){ u("cCity",e.target.value); }} placeholder="75001 Paris" style={inpStyle} /></div>
            </div>
            <label style={lblStyle}>Client VAT (triggers reverse charge if cross-border)</label>
            <div style={{ position:"relative" }}>
              <input value={s.cVAT} onChange={function(e){ u("cVAT",e.target.value.toUpperCase()); }} placeholder="e.g. FR12345678901" style={Object.assign({}, monoStyle, validateEUVAT(s.cVAT) === "valid" ? {borderColor:L.green} : validateEUVAT(s.cVAT) ? {borderColor:"#C0392B"} : {})} />
              <VIESBadge status={viesStatus} />
            </div>
            <FieldError result={validateEUVAT(s.cVAT)} value={s.cVAT} />
            {viesStatus === "invalid" && (
              <p style={{ fontFamily:fSans, fontSize:12, color:L.accent, margin:"3px 0 0" }}>(!) VAT number not found in EU VIES - reverse charge may not be valid. Verify before sending.</p>
            )}
            {s.rc && (
              <div style={{ background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="reverse" size={12} color={L.blue} />
                <p style={{ fontFamily:fSans, fontSize:13, color:L.blue, margin:0 }}>Reverse charge auto-detected - VAT 0%</p>
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
                return <span key={i} style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", color:L.muted, textAlign:i>1?"right":"left" }}>{h}</span>;
              })}
            </div>
            {s.lines.map(function(line) {
              var lt = (parseFloat(line.qty)||0) * (parseFloat(line.rate)||0);
              return (
                <div key={line.id} style={{ display:"grid", gridTemplateColumns:"1fr 50px 80px 70px 22px", gap:4, marginBottom:4, alignItems:"center" }}>
                  <input value={line.desc} onChange={function(e){ updLine(line.id,"desc",e.target.value); }} placeholder="Service" style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 7px", fontFamily:fSans, fontSize:13, color:L.ink, background:L.white, outline:"none", width:"100%" }} />
                  <input type="number" value={line.qty} onChange={function(e){ updLine(line.id,"qty",e.target.value); }} style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 5px", fontFamily:fMono, fontSize:13, color:L.ink, background:L.white, outline:"none", textAlign:"right", width:"100%" }} />
                  <input type="number" value={line.rate} onChange={function(e){ updLine(line.id,"rate",e.target.value); }} style={{ border:"1.5px solid "+L.border, borderRadius:5, padding:"5px 5px", fontFamily:fMono, fontSize:13, color:L.ink, background:L.white, outline:"none", textAlign:"right", width:"100%" }} />
                  <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, textAlign:"right", fontWeight:500 }}>{sym+lt.toFixed(2)}</div>
                  <button onClick={function(){ remLine(line.id); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontSize:14, padding:0 }}>x</button>
                </div>
              );
            })}
            <button onClick={addLine} style={{ background:"none", border:"1.5px dashed "+L.border, borderRadius:6, padding:"5px 0", width:"100%", cursor:"pointer", color:L.muted, fontFamily:fSans, fontSize:13, marginTop:2 }}>+ Add line</button>
            <div style={{ marginTop:9, borderTop:"1px solid "+L.border, paddingTop:7, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSans, fontSize:13, color:L.muted }}>
                <span>Subtotal</span><span style={{ fontFamily:fMono }}>{sym+sub.toFixed(2)}</span>
              </div>
              {discAmt > 0 && (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:220 }}>
                  <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>Discount {s.discount}%</span>
                  <span style={{ fontFamily:fMono, fontSize:13, color:L.green }}>{"-"+sym+discAmt.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:220, gap:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>Discount %</span>
                  <input type="number" value={s.discount} onChange={function(e){ u("discount",e.target.value); }} placeholder="0" min="0" max="100" style={{ width:36, border:"1px solid "+L.border, borderRadius:4, padding:"2px 5px", fontFamily:fMono, fontSize:12, color:L.ink, background:L.white, outline:"none", textAlign:"right" }} />
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSans, fontSize:13, color:L.muted }}>
                <span>{s.vatExempt ? "VAT Exempt" : s.rc ? "VAT 0% (RC)" : "VAT "+vatRate+"%"}</span>
                <span style={{ fontFamily:fMono }}>{s.vatExempt ? "-" : sym+vatAmt.toFixed(2)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", width:220, fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, borderTop:"1.5px solid "+L.ink, paddingTop:5, marginTop:2 }}>
                <span>Total Due</span><span style={{ color:L.accent }}>{sym+total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
        {cardWrap("Invoice Settings", null, (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={lblStyle}>Invoice Number *</label>
              <input value={s.invNum} onChange={function(e){ u("invNum",e.target.value); }} placeholder="DE-2026-001" style={Object.assign({}, monoStyle, { fontWeight:500 })} />
            </div>
            <div>
              <label style={lblStyle}>Your Country</label>
              <select value={s.country ? s.country.code : "DE"} onChange={function(e){ var c=EU.find(function(x){return x.code===e.target.value;}); u("country",c); }} style={{ ...inpStyle, cursor:"pointer" }}>
                <optgroup label="EU Member States">
                {EU.filter(function(c){ return c.eu; }).map(function(c) { return <option key={c.code} value={c.code}>{c.name+" ("+c.vat+"%)"}</option>; })}
              </optgroup>
              <optgroup label="Non-EU">
                {EU.filter(function(c){ return !c.eu; }).map(function(c) { return <option key={c.code+c.name} value={c.code}>{c.name+" (0% - export)"}</option>; })}
              </optgroup>
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
        <div style={{ background:L.white, borderRadius:14, marginBottom:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.06)" }}>
          <div style={{ padding:"14px 20px 10px" }}>
            <span style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink }}>EU Compliance</span>
          </div>
          <div style={{ padding:"0 20px 16px", display:"flex", flexDirection:"column", gap:4 }}>
            <CheckRow checked={s.rc} onChange={function(v){ u("rc",v); }} label="Reverse Charge" badge="Art.44" badgeColor={L.blue} blocked={(sameCountry && !s.cVAT) || s.vatExempt} blockedReason={s.vatExempt ? "Kleinunternehmer cannot apply reverse charge - no VAT number issued under SS19 UStG" : "Same country - RC only applies cross-border EU B2B"} warn={viesStatus === "invalid" ? "VIES could not verify this VAT number - confirm B2B status before applying reverse charge" : null} infoOpen={activeInfo==="rc"} onInfo={function(){ setActiveInfo(activeInfo==="rc"?null:"rc"); }} infoWhat="Reverse charge means your client pays the VAT to their tax authority instead of you collecting it." infoWhen="Tick when invoicing a VAT-registered business in a DIFFERENT EU country (B2B cross-border). Auto-detected when you enter client VAT number." infoEffect="Sets VAT to 0% and adds required legal text (Art. 44 EU VAT Directive)." infoLaw="Art. 44 EU VAT Directive 2006/112/EC" />
            <CheckRow checked={s.gdpr} onChange={function(v){ u("gdpr",v); }} label="GDPR Notice" badge="GDPR" badgeColor={L.green} blocked={false} blockedReason="" warn={null} infoOpen={activeInfo==="gdpr"} onInfo={function(){ setActiveInfo(activeInfo==="gdpr"?null:"gdpr"); }} infoWhat="A short legal notice that you process your client's personal data for invoicing purposes." infoWhen="Recommended for all EU B2B invoices - it shows you take data protection seriously." infoEffect="Adds one sentence to the bottom of your invoice referencing GDPR Art. 6(1)(b)." infoLaw="GDPR Art. 6(1)(b) - EU Regulation 2016/679" />
            <CheckRow checked={s.latePayment} onChange={function(v){ u("latePayment",v); }} label="Late Payment Interest" badge="EU 2011/7" badgeColor={L.accent} blocked={s.creditNote} blockedReason="Cannot charge interest on a credit note" warn={null} infoOpen={activeInfo==="lp"} onInfo={function(){ setActiveInfo(activeInfo==="lp"?null:"lp"); }} infoWhat="EU law gives you the right to charge statutory interest if a B2B client pays late." infoWhen="Tick for B2B invoices where you want to signal late payment will incur interest." infoEffect="Adds a notice: 8% above ECB base rate applies on overdue amounts from due date." infoLaw="EU Directive 2011/7/EU on combating late payment" />
            <CheckRow checked={s.creditNote} onChange={function(v){ u("creditNote",v); }} label="Credit Note" badge={"CN-"+new Date().getFullYear()+"-001"} badgeColor={L.gold} blocked={s.latePayment} blockedReason="Disable late payment interest first" warn={null} infoOpen={activeInfo==="cn"} onInfo={function(){ setActiveInfo(activeInfo==="cn"?null:"cn"); }} infoWhat="A credit note cancels or corrects a previous invoice, or issues a credit/refund." infoWhen="Use when correcting a sent invoice, issuing a refund, or applying a retroactive discount." infoEffect="Changes document type to CREDIT NOTE with a separate sequential number (CN-YYYY-XXX)." infoLaw="Art. 226 EU VAT Directive - separate number sequence required" />
            <CheckRow checked={s.vatExempt} onChange={function(v){ u("vatExempt",v); }} label="VAT Exempt" badge="SS19 UStG" badgeColor={L.gold} blocked={s.rc} blockedReason="Disable reverse charge first" warn={null} infoOpen={activeInfo==="ve"} onInfo={function(){ setActiveInfo(activeInfo==="ve"?null:"ve"); }} infoWhat="If your revenue is below a threshold you may not need to charge VAT at all." infoWhen="Only tick if registered under a small business exemption AND below the revenue threshold. Verify with your accountant." infoEffect="Removes VAT line entirely and adds the legally required exemption notice." infoLaw="SS19 UStG (Germany) . Art. 293B CGI (France) . varies by country" />
            <CheckRow checked={s.eInvoice} onChange={function(v){ u("eInvoice",v); }} label="E-Invoice XML" badge={s.country && s.country.code==="DE" ? "XRechnung" : s.country && s.country.code==="FR" ? "Factur-X" : s.country && s.country.code==="IT" ? "XML/SDI" : "EN16931"} badgeColor={L.blue} blocked={false} blockedReason="" warn={s.creditNote ? "Credit notes use a different XML schema (type 381 vs 380)" : null} infoOpen={activeInfo==="ei"} onInfo={function(){ setActiveInfo(activeInfo==="ei"?null:"ei"); }} infoWhat="Structured XML invoices readable by accounting software. Mandatory in Italy, upcoming in Germany and France." infoWhen="Use if your client is a public authority (required) or their accounting software supports XML import." infoEffect="Marks your invoice as e-invoice compliant. Full XML export coming Q4 2026." infoLaw="EU Directive 2014/55/EU . EN16931 . XRechnung 3.0" />
          </div>
        </div>
        <div style={{ marginBottom:8 }}>
        {(function() {
            var errs = [];
            if (!s.sName || !s.sName.trim()) errs.push("Business name required");
            if (s.sIBAN && validateIBAN(s.sIBAN) !== "valid") errs.push("IBAN invalid");
            if (s.sBIC && validateBIC(s.sBIC) !== "valid") errs.push("BIC/SWIFT invalid");
            if (s.sVAT && validateEUVAT(s.sVAT) !== "valid") errs.push("Your VAT number format invalid");
            if (s.cVAT && validateEUVAT(s.cVAT) !== "valid") errs.push("Client VAT format invalid");
            if (s.lines.every(function(l){ return !l.desc || !l.rate; })) errs.push("At least one invoice line required");
            if (errs.length > 0) return (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"10px 14px", marginBottom:8 }}>
                <div style={{ fontFamily:fSans, fontSize:12, fontWeight:600, color:"#C0392B", marginBottom:4 }}>Please fix before previewing:</div>
                {errs.map(function(e) { return <div key={e} style={{ fontFamily:fSans, fontSize:12, color:"#C0392B" }}>. {e}</div>; })}
              </div>
            );
            return null;
          })()}
        </div>
        {(function() {
            var errs = [];
            if (!s.sName || !s.sName.trim()) errs.push(true);
            if (s.sIBAN && validateIBAN(s.sIBAN) !== "valid") errs.push(true);
            if (s.sBIC && validateBIC(s.sBIC) !== "valid") errs.push(true);
            if (s.sVAT && validateEUVAT(s.sVAT) !== "valid") errs.push(true);
            if (s.cVAT && validateEUVAT(s.cVAT) !== "valid") errs.push(true);
            if (s.lines.every(function(l){ return !l.desc || !l.rate; })) errs.push(true);
            var blocked = errs.length > 0;
            return (
              <button onClick={function(){ if(!blocked){ setView("preview"); window.scrollTo({ top:0, behavior:"smooth" }); } }} disabled={blocked} style={{ width:"100%", background:blocked ? L.border : L.ink, color:blocked ? L.muted : "#fff", border:"none", padding:"15px", borderRadius:10, cursor:blocked ? "not-allowed" : "pointer", fontFamily:fSerif, fontSize:16, fontWeight:400, boxShadow:blocked ? "none" : "0 2px 12px rgba(10,22,40,0.15)", letterSpacing:"-0.01em" }}>
                {blocked ? "Complete form to preview" : "Preview invoice ->"}
              </button>
            );
          })()}
      </div>
      <div style={{ position:"sticky", top:72, alignSelf:"start" }}>
        <div style={{ background:L.white, borderRadius:14, marginBottom:16, boxShadow:"0 1px 4px rgba(10,22,40,0.06)", padding:"12px 14px" }}>
          <p style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:8 }}>EU Compliance</p>
          {[
            { i:"eu",       l:"Country",        sub:(s.country?s.country.name:"Germany")+" . VAT "+(s.country?s.country.vat:19)+"%", ok:true },
            { i:"bank",     l:"SEPA / IBAN",    sub: !s.sIBAN ? "(!) Missing" : validateIBAN(s.sIBAN) === "valid" ? "OK Valid IBAN" : "x Invalid IBAN", ok: !!s.sIBAN && validateIBAN(s.sIBAN) === "valid" },
            { i:"send",     l:"BIC / SWIFT",    sub: !s.sBIC ? "Not entered" : validateBIC(s.sBIC) === "valid" ? "OK Valid BIC" : "x Invalid BIC", ok: !s.sBIC || validateBIC(s.sBIC) === "valid" },
            { i:"shield",   l:"Your VAT",       sub: !s.sVAT ? "Not entered" : validateEUVAT(s.sVAT) === "valid" ? "OK Valid" : "x Invalid format", ok: !s.sVAT || validateEUVAT(s.sVAT) === "valid" },
            { i:"users",    l:"Client VAT",     sub: !s.cVAT ? "Not entered" : validateEUVAT(s.cVAT) === "valid" ? "OK Valid" : "x Invalid format", ok: !s.cVAT || validateEUVAT(s.cVAT) === "valid" },
            { i:"reverse",  l:"Reverse Charge", sub:s.rc ? "Active (0%)" : sameCountry ? "N/A same country" : "Standard", ok:s.rc },
            { i:"shield",   l:"GDPR Notice",    sub:s.gdpr ? "Included" : "Off",                   ok:s.gdpr },
            { i:"hash",     l:"Invoice No.",    sub:s.creditNote ? "CN-"+new Date().getFullYear()+"-001" : (s.invNum || (s.country?s.country.code:"DE")+"-"+new Date().getFullYear()+"-001"), ok:true },
            { i:"clock",    l:"Late Payment",   sub:s.latePayment ? "8% ECB+rate" : "Off",         ok:s.latePayment },
            { i:"document", l:"Document Type",  sub:s.creditNote ? "Credit Note" : s.vatExempt ? "VAT-Exempt" : "Standard Invoice", ok:true },
            { i:"send",     l:"E-Invoice",      sub:s.eInvoice ? "Active" : "PDF only",            ok:s.eInvoice },
          ].map(function(r) {
            var isErr = r.ok === false;
            return (
              <div key={r.l} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <Icon name={r.i} size={13} color={L.muted} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:13, color:L.ink, fontWeight:500 }}>{r.l}</div>
                  <div style={{ fontFamily:fMono, fontSize:10, color: isErr ? "#C0392B" : r.ok ? L.green : L.muted }}>{r.sub}</div>
                </div>
                <span style={{ color: isErr ? "#C0392B" : r.ok ? L.green : L.faint, fontSize:12 }}>{isErr ? "x" : r.ok ? "OK" : "-"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ProposalForm(props) {
  var onFirstGenerate = props.onFirstGenerate;
  var lang = props.lang || "en";
  var onConvertToInvoice = props.onConvertToInvoice;
  var [clientName, setClientName] = useState("");
  var [clientCo, setClientCo] = useState("");
  var [clientCountry, setClientCountry] = useState("DE");
  var [projType, setProjType] = useState("");
  var [projDesc, setProjDesc] = useState("");
  var [budget, setBudget] = useState("");
  var [timeline, setTimeline] = useState("");
  var [tone, setTone] = useState("direct");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState("");
  var [hasGen, setHasGen] = useState(false);
  var [history, setHistory] = useState([]);
  var [convertToInvoice, setConvertToInvoice] = useState(false);

  useEffect(function() {
    if (convertToInvoice && onConvertToInvoice) {
      onConvertToInvoice({ client: clientCo || clientName, title: projType || "Project", value: 0 });
      setConvertToInvoice(false);
    }
  }, [convertToInvoice]);

  var [savePhase, setSavePhase] = useState("idle");

  function saveProposalToDashboard() {
    setSavePhase("saving");
    var user = null;
    try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
    if (!user || !user.id) { setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); return; }
    var budgetNum = parseInt((budget||"").replace(/[^0-9]/g,"")) || 0;
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "proposals",
        action: "insert",
        user_id: user.id,
        payload: {
          title: (projType || "Project") + (clientCo ? " - " + clientCo : clientName ? " - " + clientName : ""),
          status: "draft",
          value: budgetNum,
          sent_at: null,
          view_count: 0,
          data: { client: clientCo || clientName, country: clientCountry, type: projType, brief: projDesc, budget: budget, timeline: timeline, tone: tone, content: result },
        },
      }),
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.error) { setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); return; }
      setSavePhase("saved"); setTimeout(function(){ setSavePhase("idle"); }, 3000);
    })
    .catch(function(){ setSavePhase("error"); setTimeout(function(){ setSavePhase("idle"); }, 3000); });
  }

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1px solid "+L.border, borderRadius:8, padding:"9px 12px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none" };
  var lblStyle = { display:"block", marginBottom:5, fontFamily:fSans, fontSize:12, color:L.muted, fontWeight:400 };

  function generate() {
    if (!projDesc.trim()) return;
    setLoading(true); setResult(""); setHistory([]);

    var toneGuide = tone === "direct" ? "Direct and confident. Short sentences. No corporate filler." : tone === "warm" ? "Warm and personal. Show genuine interest. Still professional." : "Formal and precise. Appropriate for larger organisations.";
    var countryGuide = COUNTRY_TONE[clientCountry] || COUNTRY_TONE["default"];
    var template = PROJ_TEMPLATES[projType];
    var templateGuide = template
      ? "This is a " + projType + " project. Structure your proposal around these sections: " + template.sections.join(", ") + ". Important: " + template.note
      : "Structure with: opening, what we'll create, how it works, investment, close.";

    var rules = [
      "You are an expert creative professional writing a project proposal.",
      "Tone style: " + toneGuide,
      "Cultural context for this client: " + countryGuide,
      "Proposal structure: " + templateGuide,
      "Start with the client first name only if known, otherwise start directly with the opening line. No 'Dear', no 'Hello'.",
      "One short opening paragraph (2-3 sentences). Reference something specific about their situation or project.",
      "Keep sections tight. No padding. Each section should earn its place.",
      "Investment section: be specific. If budget given, work within it. If not, estimate based on scope and market rate.",
      "One confident closing line with a clear next step. No 'Best regards' or 'Sincerely'.",
      "Use --- before the closing line.",
      "200-320 words total.",
    ].join(" ");

    var msgs = [
      clientName ? "Client first name: " + clientName : null,
      clientCo ? "Client company: " + clientCo : null,
      "Client country: " + clientCountry,
      "Project type: " + (projType || "creative project"),
      "Brief: " + projDesc,
      budget && budget !== "Not specified" ? "Budget: " + budget : null,
      timeline && timeline !== "Not specified" ? "Timeline: " + timeline : null,
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
      .catch(function() { setResult("Connection error - please try again."); setLoading(false); });
  }

  function refine(instruction) {
    if (!result || loading) return;
    setLoading(true);
    var newHistory = history.concat([{ role:"user", content:instruction }]);
    fetch("/api/claude", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:"You are refining a project proposal. Apply the requested change and return the full revised proposal only - no commentary.", messages:newHistory }),
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
      <div style={{ fontFamily:fSans }}>
        {text.split("\n").map(function(line, i) {
          if (line === "---") return <hr key={i} style={{ border:"none", borderTop:"1px solid "+L.border, margin:"16px 0" }} />;
          if (line.startsWith("## ")) return <h3 key={i} style={{ fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, margin:"20px 0 8px" }}>{line.slice(3)}</h3>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontFamily:fSans, fontWeight:600, color:L.ink, fontSize:14, margin:"8px 0 4px" }}>{line.slice(2,-2)}</p>;
          if (line.startsWith("- ")) return <div key={i} style={{ display:"flex", gap:10, margin:"3px 0", paddingLeft:4, color:L.muted, fontSize:15, lineHeight:1.6 }}><span style={{ color:L.accent, flexShrink:0 }}>.</span><span>{line.slice(2)}</span></div>;
          if (line === "") return <div key={i} style={{ height:8 }} />;
          if (line.indexOf("**") >= 0) {
            var parts = line.split("**");
            return <p key={i} style={{ color:L.ink, fontSize:15, lineHeight:1.7, margin:"2px 0" }}>{parts.map(function(p,j){ return j%2===1 ? <strong key={j}>{p}</strong> : p; })}</p>;
          }
          return <p key={i} style={{ color:L.ink, fontSize:15, lineHeight:1.7, margin:"2px 0" }}>{line}</p>;
        })}
      </div>
    );
  }

  return (
    <div className="prop-grid desktop-prop" style={{ maxWidth:900, margin:"0 auto", padding:"24px 20px 56px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
      <div>
        <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:400, color:L.ink, marginBottom:5, letterSpacing:"-0.02em" }}>{t(lang,"propTitle")}</h2>
        <p className="d-section-sub" style={{ fontFamily:fSans, fontSize:14, color:L.muted, marginBottom:24, fontWeight:300, lineHeight:1.5 }}>{t(lang,"propSub")}</p>
        <div style={{ background:L.white, borderRadius:14, marginBottom:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(10,22,40,0.06)" }}>
          <div style={{ padding:"14px 20px 10px" }}><span style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.ink }}>Client</span></div>
          <div style={{ padding:"0 20px 20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:9 }}>
              <div><label style={lblStyle}>First name</label><input value={clientName} onChange={function(e){ setClientName(e.target.value); }} placeholder="Sarah" style={inpStyle} /></div>
              <div><label style={lblStyle}>Company</label><input value={clientCo} onChange={function(e){ setClientCo(e.target.value); }} placeholder="TechFlow GmbH" style={inpStyle} /></div>
            </div>
            <div>
              <label style={lblStyle}>Client country</label>
              <select value={clientCountry} onChange={function(e){ setClientCountry(e.target.value); }} style={{ ...inpStyle, cursor:"pointer" }}>
                <optgroup label="EU Member States">
                  {EU.filter(function(c){ return c.eu; }).map(function(c){ return <option key={c.code} value={c.code}>{c.name}</option>; })}
                </optgroup>
                <optgroup label="Non-EU">
                  {EU.filter(function(c){ return !c.eu; }).map(function(c){ return <option key={c.code+c.name} value={c.code}>{c.name}</option>; })}
                </optgroup>
              </select>
              {COUNTRY_TONE[clientCountry] && (
                <p style={{ fontFamily:fMono, fontSize:10, color:L.accent, marginTop:5, lineHeight:1.5, letterSpacing:"0.02em" }}>
                  {COUNTRY_TONE[clientCountry].split(".")[0] + "."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div style={{ background:L.white, borderRadius:14, marginBottom:16, boxShadow:"0 1px 4px rgba(10,22,40,0.06)", overflow:"hidden" }}>
          <div style={{ padding:"14px 20px 10px" }}><span style={{ fontFamily:fMono, fontSize:13, fontWeight:600, color:L.ink }}>Project</span></div>
          <div style={{ padding:"0 20px 20px" }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
              {PROJ_TYPES.slice(0,8).map(function(t) {
                return <button key={t} onClick={function(){ setProjType(t); }} style={{ background:projType===t ? L.accent : L.paper, color:projType===t ? "#fff" : L.muted, border:"1.5px solid "+(projType===t ? L.accent : L.border), borderRadius:99, padding:"4px 11px", cursor:"pointer", fontFamily:fSans, fontSize:13 }}>{t}</button>;
              })}
            </div>
            {projType && PROJ_TEMPLATES[projType] && (
              <div style={{ background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:7, padding:"8px 10px", marginBottom:10 }}>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Template: {projType}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.5 }}>
                  {PROJ_TEMPLATES[projType].sections.join(" -> ")}
                </div>
              </div>
            )}
            <label style={lblStyle}>Brief *</label>
            <textarea value={projDesc} onChange={function(e){ setProjDesc(e.target.value); }} placeholder="Describe the project and what the client needs. The more context, the better the proposal." rows={4} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"8px 10px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none", resize:"vertical", lineHeight:1.55 }} />
          </div>
        </div>
        <div style={{ background:L.white, borderRadius:14, marginBottom:16, boxShadow:"0 1px 4px rgba(10,22,40,0.06)", overflow:"hidden" }}>
          <div style={{ padding:"14px 20px 10px" }}><span style={{ fontFamily:fMono, fontSize:13, fontWeight:600, color:L.ink }}>Scope</span></div>
          <div style={{ padding:"0 20px 20px" }}>
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
          <div style={{ padding:"14px 20px 10px" }}><span style={{ fontFamily:fMono, fontSize:13, fontWeight:600, color:L.ink }}>Tone</span></div>
          <div style={{ padding:"0 20px 20px" }}>
            <div style={{ display:"flex", gap:6 }}>
              {[["direct","Direct & confident"],["warm","Warm & personal"],["formal","Formal & precise"]].map(function(pair) {
                var v = pair[0]; var lb = pair[1];
                return <button key={v} onClick={function(){ setTone(v); }} style={{ flex:1, background:tone===v ? L.ink : L.paper, color:tone===v ? L.paper : L.muted, border:"1.5px solid "+(tone===v ? L.ink : L.border), borderRadius:7, padding:"7px 6px", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:tone===v ? 500 : 400 }}>{lb}</button>;
              })}
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={loading || !projDesc.trim()} style={{ width:"100%", background:projDesc.trim() && !loading ? L.accent : L.border, color:projDesc.trim() && !loading ? "#fff" : L.muted, border:"none", padding:"13px", borderRadius:9, cursor:projDesc.trim() && !loading ? "pointer" : "not-allowed", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:projDesc.trim() && !loading ? "0 4px 16px rgba(23,169,158,0.25)" : "none" }}>
          {loading ? "* Writing your proposal..." : "* Generate Proposal"}
        </button>
      </div>
      <div style={{ position:"sticky", top:80 }}>
        {(loading || result) ? (
          <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:14, overflow:"hidden", boxShadow:"0 8px 32px rgba(44,36,22,0.1)" }}>
            <div style={{ padding:"11px 16px", borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between", background:L.cream }}>
              {loading ? (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {[0,1,2].map(function(i){ return <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:L.accent, animation:"pulse 1s "+i*0.2+"s infinite" }} />; })}
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, marginLeft:5 }}>Writing...</span>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.green, letterSpacing:"0.08em" }}>{t(lang,"propReady")}</span>
                  {result && (
                    <>
                      <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{result.split(/\s+/).filter(Boolean).length} words</span>
                      <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{Math.ceil(result.split(/\s+/).filter(Boolean).length / 200)} min read</span>
                    </>
                  )}
                </div>
              )}
              {result && !loading && (
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={function(){ setResult(""); }} style={{ background:"none", border:"1px solid "+L.border, color:L.muted, padding:"3px 9px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12 }}>Redo</button>
                  <button onClick={function(){ window.print(); }} style={{ background:L.ink, color:"#fff", border:"none", padding:"3px 11px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12 }}>PDF</button>
                  <button onClick={saveProposalToDashboard} style={{ background:savePhase==="saved" ? L.green : L.navy, color:"#fff", border:"none", padding:"3px 11px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>
                    {savePhase==="saving" ? "..." : savePhase==="saved" ? "Saved" : savePhase==="error" ? "Sign in" : "Save"}
                  </button>
                  <button onClick={function(){ setConvertToInvoice(true); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"3px 11px", borderRadius:5, cursor:"pointer", fontFamily:fSans, fontSize:12, fontWeight:500 }}>Invoice</button>
                </div>
              )}
            </div>
            <div id="print-proposal" style={{ padding:"22px 24px", maxHeight:"60vh", overflowY:"auto" }}>
              {result && !loading && renderProposal(result)}
            </div>
            {result && !loading && (
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+L.border, display:"flex", gap:6, flexWrap:"wrap", background:L.cream }}>
                <span style={{ fontFamily:fMono, fontSize:10, color:L.muted, alignSelf:"center" }}>Refine:</span>
                {[["Make it shorter","Cut this proposal to under 180 words. Keep the structure but be ruthless."],["More formal","Rewrite in a more formal, corporate tone suitable for a large enterprise client."],["Add case studies","Add a brief 'Why us' section mentioning 2 relevant past projects with outcomes."],["Stronger close","Rewrite the closing paragraph to be more confident and create a clear next step."]].map(function(pair) {
                  return (
                    <button key={pair[0]} onClick={function(){ refine(pair[1]); }} disabled={loading} style={{ background:L.white, border:"1px solid "+L.border, color:loading ? L.faint : L.muted, padding:"3px 9px", borderRadius:99, cursor:loading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:12 }}>
                      {pair[0]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Example proposal</p>
            <div style={{ background:L.white, border:"1px solid "+L.border, borderRadius:12, padding:"22px 24px", opacity:0.7 }}>
              {renderProposal("Sarah,\n\nWe've looked at TechFlow carefully - the fintech space in Berlin is crowded, and what you need isn't just a logo. You need a visual identity that signals credibility to investors while still feeling approachable.\n\n## What we'll create\n\n**Brand strategy foundation**\nA half-day positioning session to nail the brand DNA.\n\n**Visual identity system**\nPrimary logo + 2 variants . Colour palette . Typography . Iconography\n\n**Application files**\nFigma system . SVG/AI source files . Brand guidelines PDF\n\n## How it works\n\nWeeks 1-2 . Strategy and concepting\nWeeks 3-4 . Design development (2 review rounds)\nWeek 5 . Refinement and delivery\n\n## Investment\n\n**€8,400 total**\n€4,200 on kickoff . €4,200 on final delivery\n\n---\nReady when you are.")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function InvoiceGen(props) {
  var onFirstGenerate = props.onFirstGenerate;
  var setPage = props.setPage;
  var lang = props.lang || "en";
  var convertProposal = props.convertProposal;
  var onConvertDone = props.onConvertDone;
  // initialMode comes from the nav dropdown ("invoice" or "proposal")
  var initialMode = props.initialMode || "invoice";
  var [mode, setMode] = useState(convertProposal ? "invoice" : initialMode);
  var [view, setView] = useState("form");

  // Sync when user picks a different mode from the nav dropdown while Generator is already open
  useEffect(function() {
    if (!convertProposal) {
      setMode(initialMode);
      setView("form");
    }
  }, [initialMode]);
  var [convertBanner, setConvertBanner] = useState(!!convertProposal);

  var defaultInvState = {
    country:EU[0], terms:"30", rc:false, gdpr:true, latePayment:false, creditNote:false, vatExempt:false, eInvoice:false, discount:"", projRef:"",
    invNum:"DE-" + new Date().getFullYear() + "-001",
    sName:"Your Name / Studio", sVAT:"", sIBAN:"", sBIC:"", sStreet:"Your Street", sCity:"Your City",
    cName: convertProposal ? convertProposal.client : "Studio Verde GmbH",
    cVAT:"", cCo:"DE", cStreet:"", cCity:"",
    projRef: convertProposal ? convertProposal.title : "",
    lines: convertProposal
      ? [{ id:1, desc:convertProposal.title, qty:1, rate:convertProposal.value }]
      : [{ id:1, desc:"Brand Identity Workshop", qty:1, rate:1800 },{ id:2, desc:"Logo Design + 3 variations", qty:1, rate:2400 },{ id:3, desc:"Brand Guidelines PDF", qty:1, rate:1200 }],
  };

  // Load profile from Supabase to pre-fill seller fields
  var [invState, setInvState] = useState(defaultInvState);

  useEffect(function() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem("invoiceai_user")); } catch(e) {}
    if (!user || !user.id) return;
    fetch("/api/db?table=profiles&user_id=" + encodeURIComponent(user.id))
      .then(function(r) { return r.json(); })
      .then(function(profile) {
        if (!profile || !profile.biz_name) return;
        setInvState(function(s) {
          return Object.assign({}, s, {
            sName:   profile.biz_name    || s.sName,
            sVAT:    profile.vat_number  || s.sVAT,
            sIBAN:   profile.iban        || s.sIBAN,
            sBIC:    profile.bic         || s.sBIC,
            sStreet: profile.street      || s.sStreet,
            sCity:   profile.city        || s.sCity,
          });
        });
      })
      .catch(function(){});
  }, []);

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
    <div style={{ background:L.paper, minHeight:"calc(100vh - 56px)", paddingBottom:40 }}>
      {convertBanner && convertProposal && (
        <div style={{ background:L.greenGlow, borderBottom:"1px solid "+L.green+"44", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Icon name="check" size={14} color={L.green} />
            <span style={{ fontFamily:fSans, fontSize:14, color:L.green, fontWeight:500 }}>
              Converting "{convertProposal.title}" - client and amount pre-filled.
            </span>
          </div>
          <button onClick={function(){ setConvertBanner(false); if(onConvertDone) onConvertDone(); }} style={{ background:"none", border:"none", color:L.green, cursor:"pointer", fontFamily:fMono, fontSize:12, letterSpacing:"0.04em" }}>Dismiss x</button>
        </div>
      )}
      {/* -- Top navigation -- */}
      {view === "form" && (
        <div style={{ padding:"16px 20px 0", maxWidth:960, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
          <div style={{ display:"flex", alignItems:"center", gap:0 }}>
            {[["invoice","Invoice"],["proposal","Proposal"]].map(function(pair) {
              var active = mode === pair[0];
              return (
                <button key={pair[0]} onClick={function(){ setMode(pair[0]); setView("form"); }} style={{
                  background:"transparent", border:"none",
                  borderBottom:"2px solid " + (active ? L.ink : "transparent"),
                  padding:"10px 18px 10px 0", marginRight:20,
                  cursor:"pointer", fontFamily:fSerif, fontSize:20,
                  color:active ? L.ink : L.muted,
                  fontWeight:400, letterSpacing:"-0.02em",
                  transition:"color 0.15s, border-color 0.15s",
                }}>{pair[1]}</button>
              );
            })}
          </div>
          <div style={{ height:"1px", background:L.border }} />
        </div>
      )}
      {/* -- Preview back link - appears only in preview mode -- */}
      {view === "preview" && mode === "invoice" && (
        <div style={{ padding:"16px 20px 0", maxWidth:960, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
          <button onClick={function(){ setView("form"); }} style={{
            background:"none", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", gap:7,
            fontFamily:fSans, fontSize:14, color:L.muted,
            padding:0, marginBottom:16,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to editing
          </button>
        </div>
      )}
      {mode==="proposal" && <ProposalForm onFirstGenerate={onFirstGenerate} lang={lang} onConvertToInvoice={function(data){
        setConvertBanner(true);
        var newState = Object.assign({}, invState, {
          cName: data.client || invState.cName,
          projRef: data.title || "",
          lines: data.value > 0 ? [{ id:1, desc:data.title, qty:1, rate:data.value }] : invState.lines,
        });
        setInvState(newState);
        setMode("invoice");
        setView("form");
      }} />}
      {mode==="invoice" && view==="form" && (
        <InvoiceForm state={invState} update={updateInv} setView={setView} addLine={addLine} updLine={updLine} remLine={remLine} />
      )}
      {mode==="invoice" && view==="preview" && (
        <InvoicePreviewPanel state={invState} setView={setView} setPage={setPage} />
      )}
    </div>
  );
}

// -- Dashboard -----------------------------------------------------------------
var CLIENTS = [
  { id:1, name:"Studio Verde GmbH",  flag:"DE", city:"Berlin",    av:"SV", col:"#8A7A6A", status:"active",   balance:8400,  paid:22400, invoices:14 },
  { id:2, name:"Maison Fontaine",    flag:"FR", city:"Paris",     av:"MF", col:"#7A6A5A", status:"overdue",  balance:3200,  paid:18600, invoices:9 },
  { id:3, name:"Bianchi & Co.",      flag:"IT", city:"Milan",     av:"BC", col:"#9A8A7A", status:"active",   balance:0,     paid:31200, invoices:18 },
  { id:4, name:"Nord Digital AS",    flag:"SE", city:"Stockholm", av:"ND", col:"#6A5A4A", status:"prospect", balance:0,     paid:0,     invoices:0 },
];

export function ClientPortal(props) {
  var setPage = props.setPage;
  var [inv, setInv] = useState(null);
  var [loadError, setLoadError] = useState("");
  var [status, setStatus] = useState("pending");
  var [showPay, setShowPay] = useState(false);
  var [payMethod, setPayMethod] = useState("sepa");

  useEffect(function() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("portal");
    if (id) {
      fetch("/api/share?id=" + encodeURIComponent(id))
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data && data.inv_number) {
            setInv({
              num:   data.inv_number,
              date:  data.issue_date || "",
              due:   data.due_date || "",
              from: {
                name:   data.seller_name || "",
                street: data.seller_street || "",
                city:   data.seller_city || "",
                vat:    data.seller_vat || "",
                iban:   data.seller_iban || "",
                bic:    data.seller_bic || "",
                email:  data.seller_email || "",
              },
              to: {
                name:    data.buyer_name || "",
                street:  data.buyer_street || "",
                city:    data.buyer_city || "",
                vat:     data.buyer_vat || "",
                contact: data.buyer_name || "",
              },
              lines:    data.lines || [],
              sub:      data.subtotal || 0,
              vat:      data.vat_amount || 0,
              vatLabel: data.reverse_charge ? "VAT 0% - Reverse Charge (Art. 44 EU VAT Directive)" : data.vat_exempt ? "VAT Exempt - SS19 UStG" : "VAT " + (data.vat_rate || 0) + "%",
              total:    data.total || 0,
              ref:      data.proj_ref || "",
              terms:    "Net " + (data.terms || "30") + " days",
              note:     data.late_payment ? "Statutory interest at 8% above ECB base rate applies on overdue amounts per EU Dir. 2011/7/EU." : "",
              gdpr:     data.gdpr ? "Personal data processed for invoicing purposes under GDPR Art. 6(1)(b)." : "",
              currency: data.currency || "EUR",
            });
          } else {
            setLoadError("Invoice not found.");
          }
        })
        .catch(function() { setLoadError("Could not load invoice."); });
    } else {
      setInv(PORTAL_INVOICE);
    }
  }, []);

  var timeline = [
    { label:"Sent",     date:inv ? inv.date : "", done:true },
    { label:"Viewed",   date:inv ? inv.date : "", done:true },
    { label:"Approved", date:status==="approved"||status==="paid" ? "" : null, done:status==="approved"||status==="paid" },
    { label:"Paid",     date:status==="paid" ? "" : null, done:status==="paid" },
  ];

  return (
    <div style={{ background:"#F0EDE6", minHeight:"100vh" }}>
      <div style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={function(){ setPage("Home"); }}>
          <LogoMark size={26} />
          <span style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, letterSpacing:"-0.02em" }}>InvoiceAI</span>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}>. secure invoice portal</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:L.green }} />
            <span style={{ fontFamily:fMono, fontSize:12, color:L.green, letterSpacing:"0.06em" }}>SSL encrypted</span>
          </div>
          <button onClick={function(){ setPage("Generator"); }} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:7, padding:"5px 12px", cursor:"pointer", fontFamily:fSans, fontSize:14, color:L.muted }}>
            <- Back
          </button>
        </div>
      </div>
      {(!inv && !loadError) && (
        <div style={{ maxWidth:720, margin:"60px auto", padding:"0 20px", textAlign:"center" }}>
          <div style={{ fontFamily:fMono, fontSize:13, color:L.muted, letterSpacing:"0.08em" }}>Loading invoice...</div>
        </div>
      )}
      {loadError && (
        <div style={{ maxWidth:720, margin:"60px auto", padding:"0 20px", textAlign:"center" }}>
          <div style={{ fontFamily:fSans, fontSize:15, color:L.accent }}>{loadError}</div>
        </div>
      )}
      {inv && (
      <div style={{ maxWidth:720, margin:"0 auto", padding:"32px 20px 64px" }}>

        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, padding:"20px 24px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Invoice from</div>
            <div style={{ fontFamily:fSerif, fontSize:19, fontWeight:800, color:L.ink, letterSpacing:"-0.02em" }}>{inv.from ? inv.from.name : ""}</div>
            <div style={{ fontFamily:fSans, fontSize:14, color:L.muted, marginTop:2 }}>Invoice {inv.num} . Due {inv.due}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:30, fontWeight:900, color:L.accent, letterSpacing:"-0.02em" }}>{"€"+(parseFloat(inv.total)||0).toFixed(2)}</div>
            <div style={{ fontFamily:fMono, fontSize:11, color:status==="paid"?L.green:status==="approved"?L.blue:L.gold, background:(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"18", border:"1px solid "+(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"44", borderRadius:4, padding:"3px 10px", letterSpacing:"0.07em", display:"inline-block", marginTop:4 }}>
              {status==="paid" ? "OK PAID" : status==="approved" ? "APPROVED" : "AWAITING APPROVAL"}
            </div>
          </div>
        </div>

        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, marginBottom:16, overflow:"hidden" }}>
          <div style={{ padding:"14px 24px", background:L.cream, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Status timeline</span>
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
                      <div style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:t.done ? L.ink : L.muted, whiteSpace:"nowrap" }}>{t.label}</div>
                      {t.date && <div style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{t.date}</div>}
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
            <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>Invoice details</span>
          </div>
          <div style={{ padding:"22px 28px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>From</div>
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{inv.from ? inv.from.name : ""}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.from ? inv.from.street : ""}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.from ? inv.from.city : ""}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, marginTop:3 }}>VAT: {inv.from ? inv.from.vat : ""}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Billed to</div>
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{inv.to ? inv.to.name : ""}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.to ? inv.to.contact : ""}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.to ? inv.to.city : ""}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, marginTop:3 }}>VAT: {inv.to ? inv.to.vat : ""}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, marginBottom:16 }}>
              {[{l:"Invoice No.",v:inv.num},{l:"Issue Date",v:inv.date},{l:"Due Date",v:inv.due}].map(function(x, i) {
                return (
                  <div key={x.l} style={{ padding:"10px 12px", borderRight:i<2?"1px solid "+L.border:"none" }}>
                    <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{x.l}</div>
                    <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500 }}>{x.v}</div>
                  </div>
                );
              })}
            </div>
            {inv.ref && <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontStyle:"italic", marginBottom:14 }}>Re: {inv.ref}</div>}
            <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
              <thead>
                <tr>
                  {["Description","Qty","Rate","Total"].map(function(h) {
                    return <th key={h} style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, padding:"5px 0", textAlign:h==="Description"?"left":"right", borderBottom:"2px solid "+L.ink }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {(inv.lines || []).map(function(line, i) {
                  var qty = parseFloat(line.qty) || 0;
                  var rate = parseFloat(line.rate) || 0;
                  var lineTotal = parseFloat(line.total || line.lineTotal || (qty * rate)) || 0;
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid "+L.border }}>
                      <td style={{ fontFamily:fSans, fontSize:14, color:L.ink, padding:"9px 0" }}>{line.desc}</td>
                      <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"9px 0" }}>{qty}</td>
                      <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"9px 0" }}>{"€"+rate.toFixed(2)}</td>
                      <td style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500, textAlign:"right", padding:"9px 0" }}>{"€"+lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ minWidth:240 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.muted, padding:"2px 0" }}>
                  <span>Subtotal</span><span style={{ fontFamily:fMono }}>{"€"+(parseFloat(inv.sub) || 0).toFixed(2)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.blue, padding:"3px 0 6px", borderBottom:"1.5px solid "+L.ink }}>
                  <span>{inv.vatLabel || "VAT"}</span><span style={{ fontFamily:fMono }}>{"€"+(parseFloat(inv.vat) || 0).toFixed(2)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, paddingTop:6 }}>
                  <span>Total Due</span><span style={{ color:L.accent }}>{"€"+(parseFloat(inv.total) || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div style={{ background:L.cream, borderRadius:8, padding:"12px 14px", marginTop:16 }}>
              <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>SEPA Bank Transfer</div>
              <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
                <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>IBAN</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{inv.from ? inv.from.iban : ""}</div></div>
                <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>BIC</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{inv.from ? inv.from.bic : ""}</div></div>
                <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>Reference</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{inv.num}</div></div>
              </div>
            </div>
            {inv.note && <p style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:10, paddingTop:10, borderTop:"1px solid "+L.borderLt }}>{inv.note}</p>}
            <p style={{ fontFamily:fSans, fontSize:12, color:L.faint, marginTop:6 }}>{inv.gdpr}</p>
          </div>
        </div>

        {status !== "paid" && (
          <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:16, overflow:"hidden", marginBottom:16 }}>
            <div style={{ padding:"14px 24px", background:status==="approved" ? L.greenGlow : L.accentGlow, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", gap:8 }}>
              <Icon name={status==="approved" ? "check" : "card"} size={15} color={status==="approved" ? L.green : L.accent} />
              <span style={{ fontFamily:fMono, fontSize:11, color:status==="approved" ? L.green : L.accent, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                {status==="approved" ? "Approved - ready to pay" : "Action required"}
              </span>
            </div>
            <div style={{ padding:"20px 24px" }}>
              {status === "pending" && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    Please review the invoice above and approve it. Once approved, you can pay via SEPA transfer or card.
                  </p>
                  <button onClick={function(){ setStatus("approved"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(23,169,158,0.25)", marginRight:10 }}>
                    OK Approve Invoice
                  </button>
                  <button style={{ background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"13px 20px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:15 }}>
                    Request changes
                  </button>
                </div>
              )}
              {status === "approved" && !showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.green, fontWeight:500, marginBottom:14 }}>OK Invoice approved on 30 Apr 2026</p>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>Choose your payment method:</p>
                  <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                    {[["sepa","SEPA Transfer"],["card","Card"],["apple","Apple Pay"]].map(function(pair) {
                      return (
                        <button key={pair[0]} onClick={function(){ setPayMethod(pair[0]); }} style={{ background:payMethod===pair[0] ? L.ink : L.paper, color:payMethod===pair[0] ? "#fff" : L.ink, border:"1.5px solid "+(payMethod===pair[0] ? L.ink : L.border), borderRadius:8, padding:"9px 18px", cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:payMethod===pair[0] ? 500 : 400 }}>
                          {pair[1]}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={function(){ setShowPay(true); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(23,169,158,0.25)" }}>
                    Pay €5,400 ->
                  </button>
                </div>
              )}
              {status === "approved" && showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    {payMethod === "sepa" && "Transfer " + (inv.currency === "EUR" ? "€" : inv.currency + " ") + (parseFloat(inv.total)||0).toFixed(2) + " to the IBAN above with reference " + inv.num + ". Payment typically clears in 1 business day."}
                    {payMethod === "card" && "Card payments launching Q3 2026 via Stripe. Use SEPA transfer for now."}
                    {payMethod === "apple" && "Apple Pay launching Q3 2026. Use SEPA transfer for now."}
                  </p>
                  <button onClick={function(){ setStatus("paid"); setShowPay(false); }} style={{ background:L.green, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>
                    OK Mark as paid
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {status === "paid" && (
          <div style={{ background:L.greenGlow, border:"1.5px solid "+L.green+"44", borderRadius:16, padding:"24px 28px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.green, marginBottom:6 }}>OK Payment confirmed</div>
            <p style={{ fontFamily:fSans, fontSize:15, color:L.green, fontWeight:300 }}>Thank you. A receipt has been sent to {inv.to.contact} at {inv.to.name}.</p>
          </div>
        )}

        <div style={{ textAlign:"center", padding:"20px 0 4px" }}>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}>Secured &amp; delivered by </span>
          <span onClick={function(){ setPage("Home"); }} style={{ fontFamily:fSerif, fontSize:13, fontWeight:700, color:L.accent, cursor:"pointer", letterSpacing:"-0.01em" }}>InvoiceAI</span>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}> . EU-native invoicing</span>
        </div>
      </div>
      )}
    </div>
  );
}


