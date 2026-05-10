import { useState } from "react";
import { L, fSans, fMono, fSerif, EU_FEATURES, Icon, SubLayout, SH, SP, Pill, Tag, Stars, t } from "./constants.jsx";

export function PageAbout(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var team = [
    { name:"Daniel Speder", role:"Founder",           city:"Munich DE",    av:"DS", bio:"Freelancer turned founder. Built InvoiceAI after years of fighting with US-centric invoicing tools that didn't understand EU VAT." },
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
      <SP>InvoiceAI was born out of a specific frustration: being a European freelancer with clients in multiple countries and having absolutely no tool that handled it correctly. German clients needed XRechnung. French clients had different VAT rules. Dutch clients expected SEPA with a specific reference format. And none of the US-built tools - HoneyBook, Bonsai, FreshBooks - had any idea what reverse charge was.</SP>
      <SP>Every cross-border invoice was a manual research exercise. We spent more time checking EU VAT rules than doing the work clients were paying us for. So we built the tool we needed.</SP>
      <SH>What we believe</SH>
      <SLI>Creative professionals should spend their time creating, not accounting.</SLI>
      <SLI>EU compliance shouldnt require a consultant or a law degree.</SLI>
      <SLI>Beautiful software and legally correct software are not mutually exclusive.</SLI>
      <SLI>Data privacy is a right, not a feature. GDPR is our baseline, not a checkbox.</SLI>
      <SH>The team</SH>
      <div className="grid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, margin:"16px 0 32px" }}>
        {team.map(function(m) {
          return (
            <div key={m.name} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:12, padding:"18px 18px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"#8A7A6A22", border:"1.5px solid #8A7A6A30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:14, color:"#8A7A6A", fontWeight:500, flexShrink:0 }}>{m.av}</div>
                <div>
                  <div style={{ fontFamily:fSans, fontWeight:600, fontSize:15, color:L.ink }}>{m.name}</div>
                  <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.05em" }}>{m.role} . {m.city}</div>
                </div>
              </div>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, margin:0, fontWeight:300 }}>{m.bio}</p>
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
              <div style={{ fontFamily:fMono, fontSize:11, color:L.accent, letterSpacing:"0.08em", marginBottom:2 }}>{t.year}</div>
              <div style={{ fontFamily:fSans, fontSize:15, color:L.ink, fontWeight:300 }}>{t.event}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:12, padding:"24px 28px", textAlign:"center" }}>
        <h3 style={{ fontFamily:fSerif, fontSize:20, fontWeight:700, color:L.ink, marginBottom:8 }}>Try InvoiceAI free for 14 days</h3>
        <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>No credit card. No setup wizards.</p>
        <button onClick={function(){ openModal("about"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, boxShadow:"0 4px 14px rgba(23,169,158,0.25)" }}>Get early access </button>
      </div>
    </SubLayout>
  );
}

export function PageBlog(props) {
  var posts = [
    { tag:"EU Compliance", title:"Germany's XRechnung mandate: what every freelancer needs to know in 2026", date:"28 April 2026", read:"6 min", av:"AK", excerpt:"Germany is rolling out mandatory e-invoicing for B2B. Here's what it means for your studio and how InvoiceAI handles it automatically." },
    { tag:"Product",       title:"Introducing AI proposals in 7 European languages",                          date:"14 April 2026", read:"4 min", av:"SR", excerpt:"Your proposal generator now writes in German, French, Italian, Spanish, Dutch and Swedish - automatically matched to your client's country." },
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
        <p style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:14, fontWeight:300 }}>{posts[0].excerpt}</p>
        <span style={{ fontFamily:fMono, fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.06em" }}>{posts[0].date} . {posts[0].read} read</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {posts.slice(1).map(function(p) {
          var tc = tagColor[p.tag] || L.accent;
          return (
            <div key={p.title} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:13, padding:"18px 18px 14px", cursor:"pointer" }}>
              <Pill color={tc}>{p.tag}</Pill>
              <h3 style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, margin:"10px 0 8px", lineHeight:1.35 }}>{p.title}</h3>
              <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.55, marginBottom:12, fontWeight:300 }}>{p.excerpt}</p>
              <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.04em" }}>{p.date} . {p.read} read</span>
            </div>
          );
        })}
      </div>
    </SubLayout>
  );
}

export function PageCareers(props) {
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
      <SP>Were a 12-person team distributed across Berlin, Milan, Paris and remote. We work async-first - we write well, document decisions and trust each other. We do video calls when theyre genuinely useful, not as a default.</SP>
      <SH>Open positions</SH>
      <div style={{ display:"flex", flexDirection:"column", gap:12, margin:"16px 0 32px" }}>
        {jobs.map(function(j) {
          return (
            <div key={j.title} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:13, padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:6 }}>
                <h3 style={{ fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink }}>{j.title}</h3>
                <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"3px 9px", letterSpacing:"0.06em" }}>Full-time</span>
              </div>
              <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.06em", marginBottom:8 }}>{j.team} . {j.loc}</div>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, marginBottom:12, fontWeight:300 }}>{j.desc}</p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                {j.tags.map(function(t) { return <span key={t} style={{ fontFamily:fMono, fontSize:10, color:L.blue, background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em" }}>{t}</span>; })}
              </div>
              <button style={{ background:L.accent, color:"#fff", border:"none", padding:"7px 18px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>Apply </button>
            </div>
          );
        })}
      </div>
      <SH>Perks</SH>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, margin:"16px 0" }}>
        {perks.map(function(p) {
          return <div key={p} style={{ background:L.cream, borderRadius:8, padding:"10px 14px", fontFamily:fSans, fontSize:14, color:L.ink, display:"flex", alignItems:"center", gap:8 }}><Icon name="check" size={12} color={L.green} />{p}</div>;
        })}
      </div>
    </SubLayout>
  );
}

export function PagePrivacy() {
  return (
    <SubLayout pill="Legal" title="Privacy Policy" sub="Last updated: 1 May 2026. We process your data fairly, transparently and in accordance with GDPR.">
      <SH>1. Who we are</SH>
      <SP>Daniel Speder (Selbstaendiger) is the operator of invoice-ai.de and the data controller for personal data collected through this website and its services. Contact: privacy@invoice-ai.de . Arndstr. 2 . 80469 Muenchen . Germany</SP>
      <SH>2. Data we collect</SH>
      <SLI>Account data: name, email address, company name, country of residence</SLI>
      <SLI>Billing data: VAT number, payment method (processed by Stripe - we never store card numbers)</SLI>
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
      <SP>Account data retained for the duration of your subscription plus 3 months. Invoice and financial records retained for 10 years per German tax law (SS147 AO).</SP>
      <SH>6. Contact</SH>
      <SP>Daniel Speder . Arndstr. 2 . 80469 Muenchen . privacy@invoice-ai.de</SP>
    </SubLayout>
  );
}

export function PageTerms() {
  return (
    <SubLayout pill="Legal" title="Terms of Service" sub="Last updated: 1 May 2026. Please read these terms carefully before using InvoiceAI. By using the service you agree to be bound by them.">

      <SH>1. Who we are and what InvoiceAI is</SH>
      <SP>InvoiceAI is operated by Daniel Speder (Selbstaendiger), Arndstr. 2, 80469 Muenchen, Germany (InvoiceAI, we, us). InvoiceAI is a software tool that helps freelancers and small businesses create invoices, proposals and related business documents. It is not a tax advisory service, accounting service, legal service or financial service of any kind.</SP>
      <SP>By creating an account or using any part of InvoiceAI, you accept these Terms of Service in full. If you do not agree, do not use the service.</SP>

      <SH>2. Nature of the service - important</SH>
      <SP>InvoiceAI provides document creation tools and AI-assisted writing features. The following applies at all times:</SP>
      <SLI>InvoiceAI is not a tax advisor, accountant, auditor or legal advisor. Nothing in the service constitutes tax advice, legal advice or financial advice.</SLI>
      <SLI>You are solely responsible for ensuring that all invoices, proposals and documents you create comply with applicable laws, tax regulations and accounting requirements in your jurisdiction and in the jurisdictions of your clients.</SLI>
      <SLI>VAT rates, compliance rules and legal requirements displayed in InvoiceAI are provided for reference only and may not reflect the most current regulations. Always verify with a qualified tax advisor before sending invoices.</SLI>
      <SLI>AI-generated proposals and text are provided as drafts for your review and editing. You are responsible for the accuracy and appropriateness of all content you send to clients.</SLI>
      <SLI>XRechnung, NAV XML and other structured e-invoice exports are provided as a convenience tool. You are responsible for validating them before submission to any tax authority or client system.</SLI>

      <SH>3. Subscription and billing</SH>
      <SLI>Subscription fees are charged monthly or annually in advance. Fees are shown excluding VAT. Applicable VAT will be added based on your billing country.</SLI>
      <SLI>You may cancel at any time from account settings. Access continues until the end of the current billing period. No partial refunds are issued for unused periods except where required by law.</SLI>
      <SLI>EU consumers have a 14-day right of withdrawal from the date of initial purchase. To exercise this right, email legal@invoice-ai.de within 14 days of signing up.</SLI>
      <SLI>We reserve the right to change pricing with 30 days written notice. Price changes take effect at your next renewal cycle. If you do not accept the new price, you may cancel before the renewal date.</SLI>
      <SLI>If payment fails, we will notify you and provide a 7-day grace period. After this period we may suspend access until payment is received.</SLI>
      <SLI>Pursuant to the EU Data Act, you may switch to another provider with two months notice. You can export all your data in JSON or CSV format at any time from account settings, free of charge.</SLI>

      <SH>4. Limitation of liability</SH>
      <SP>To the fullest extent permitted by applicable law:</SP>
      <SLI>InvoiceAIs total aggregate liability to you for any claim arising from or related to these terms or the service - whether in contract, tort (including negligence), breach of statutory duty or otherwise - shall not exceed the total fees paid by you to InvoiceAI in the 12 months immediately preceding the event giving rise to the claim.</SLI>
      <SLI>InvoiceAI is not liable for any indirect, consequential, special, incidental or punitive damages, including but not limited to: loss of profit, loss of revenue, loss of contracts, loss of anticipated savings, loss of data, fines or penalties imposed by any tax authority, or damage to goodwill or reputation.</SLI>
      <SLI>InvoiceAI is not liable for any loss or damage arising from: your reliance on VAT calculations, compliance suggestions or tax information provided by the service; errors in AI-generated content; failure of third-party services (including Stripe, Anthropic, Supabase or AWS); or interruptions to service availability.</SLI>
      <SLI>Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited under applicable law.</SLI>

      <SH>5. Service availability</SH>
      <SP>We aim to maintain high availability but do not guarantee uninterrupted access. Planned maintenance will be notified in advance where reasonably possible. We are not liable for any losses arising from service unavailability, including missed tax filing deadlines or rejected invoices. Critical submissions to tax authorities should not be left to the last moment and should not depend solely on the availability of InvoiceAI.</SP>

      <SH>6. Acceptable use</SH>
      <SP>You agree not to use InvoiceAI to:</SP>
      <SLI>Create fraudulent, misleading or fictitious invoices or documents.</SLI>
      <SLI>Misrepresent your identity, business registration, VAT status or legal entity.</SLI>
      <SLI>Violate any applicable law, tax regulation or professional standard.</SLI>
      <SLI>Attempt to gain unauthorised access to the service or another users data.</SLI>
      <SLI>Reverse engineer, copy, redistribute or resell the service or its underlying technology.</SLI>
      <SLI>Use the service in any way that could expose InvoiceAI or other users to legal liability.</SLI>
      <SP>We reserve the right to suspend or terminate accounts that breach these provisions without notice and without refund.</SP>

      <SH>7. Your content and data</SH>
      <SLI>You retain all intellectual property rights to the content you create using InvoiceAI - invoices, proposals, client data and business information remain yours.</SLI>
      <SLI>You grant InvoiceAI a limited licence to process and store your content solely to provide the service to you.</SLI>
      <SLI>We do not sell your data, share it with third parties for commercial purposes, or use it to train AI models without your explicit consent.</SLI>
      <SLI>You are responsible for maintaining appropriate backups of your data. While we implement robust backup procedures, we cannot guarantee against data loss in all circumstances.</SLI>

      <SH>8. AI features - specific terms</SH>
      <SP>InvoiceAI uses Claude (Anthropic PBC) to power the proposal writer and support assistant. By using these features:</SP>
      <SLI>Your input (project descriptions, client names, brief content) is transmitted to Anthropics API for processing. See Anthropics privacy policy at anthropic.com for details of how they handle this data.</SLI>
      <SLI>AI-generated outputs are probabilistic and may contain errors, inaccuracies or inappropriate content. Always review AI-generated proposals before sending them to clients.</SLI>
      <SLI>Do not enter sensitive personal data, confidential client information, trade secrets or privileged information into AI input fields.</SLI>
      <SLI>We are not liable for any loss or damage arising from reliance on AI-generated content.</SLI>

      <SH>9. Third-party services</SH>
      <SP>InvoiceAI integrates with third-party services including Stripe (payments), Supabase (authentication), AWS (hosting), Anthropic (AI), Plausible (analytics) and Loops (email). Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the actions, availability or data practices of these third parties.</SP>

      <SH>10. Intellectual property</SH>
      <SP>All software, design, trademarks and content of InvoiceAI (excluding user-generated content) are the exclusive property of Daniel Speder / InvoiceAI. You may not copy, reproduce, distribute or create derivative works without prior written permission.</SP>

      <SH>11. Termination</SH>
      <SP>Either party may terminate the service relationship at any time. Upon termination you may export your data for 90 days. After 90 days, your data will be permanently deleted, except where retention is required by law (invoices are retained for 10 years per GoBD SS147 AO). We reserve the right to terminate access immediately if you breach these terms.</SP>

      <SH>12. Changes to these terms</SH>
      <SP>We may update these terms from time to time. Material changes will be notified by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance. If you do not accept changes, you may terminate your subscription before the effective date.</SP>

      <SH>13. Governing law and dispute resolution</SH>
      <SP>These terms are governed by the laws of the Federal Republic of Germany. The UN Convention on Contracts for the International Sale of Goods (CISG) is excluded. Disputes will be referred to the competent courts of Muenchen, Germany, unless mandatory consumer protection law in your country of residence requires otherwise. EU consumers may also use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr. We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.</SP>

      <SH>14. Contact</SH>
      <SP>Daniel Speder . Arndstr. 2 . 80469 Muenchen . Germany . legal@invoice-ai.de</SP>
    </SubLayout>
  );
}

export function PageGDPR() {
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
              <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink, marginBottom:4 }}>{c.title}</div>
              <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.5, fontWeight:300 }}>{c.desc}</div>
            </div>
          );
        })}
      </div>
      <SH>Data Processing Agreement</SH>
      <SP>If you process your clients personal data through InvoiceAI, you may need a DPA with us under GDPR Art. 28. We provide a standard pre-signed DPA to all customers - email privacy@invoiceai.eu to request it.</SP>
      <SH>Cookie-less analytics</SH>
      <SP>We use Plausible Analytics - a privacy-first, cookieless tool hosted in the EU. No personal data collected. No cookies set. IP addresses never stored. You are not tracked across websites.</SP>
      <SH>Sub-processors</SH>
      <div style={{ background:L.cream, borderRadius:10, overflow:"hidden", border:"1px solid "+L.border, margin:"16px 0" }}>
        {[["Stripe Inc.","Payment processing","USA (SCCs)"],["Amazon Web Services","Cloud hosting (Frankfurt)","EU"],["Anthropic PBC","AI features","USA (SCCs)"],["Plausible Analytics","Cookieless analytics","EU"]].map(function(row, i) {
          return (
            <div key={row[0]} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr", padding:"10px 16px", borderBottom:i<3?"1px solid "+L.border:"none" }}>
              <span style={{ fontFamily:fSans, fontSize:14, fontWeight:500, color:L.ink }}>{row[0]}</span>
              <span style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{row[1]}</span>
              <span style={{ fontFamily:fMono, fontSize:11, color:L.faint }}>{row[2]}</span>
            </div>
          );
        })}
      </div>
    </SubLayout>
  );
}

export function PageEUCompliance(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var [open, setOpen] = useState(-1);

  var VAT_TABLE = [
    { country:"Germany",     code:"DE", rate:"19%", threshold:"€22,000",  format:"DD.MM.YYYY", note:"XRechnung mandatory B2G, phasing B2B 2025-2028" },
    { country:"France",      code:"FR", rate:"20%", threshold:"€37,500",  format:"DD/MM/YYYY", note:"Factur-X mandatory from Sept 2026" },
    { country:"Italy",       code:"IT", rate:"22%", threshold:"€85,000",  format:"DD/MM/YYYY", note:"FatturaPA via SDI mandatory since 2019" },
    { country:"Netherlands", code:"NL", rate:"21%", threshold:"€20,000",  format:"DD-MM-YYYY", note:"Peppol BIS widely used" },
    { country:"Spain",       code:"ES", rate:"21%", threshold:"€85,000",  format:"DD/MM/YYYY", note:"Facturae for public sector" },
    { country:"Belgium",     code:"BE", rate:"21%", threshold:"€25,000",  format:"DD/MM/YYYY", note:"Peppol live for B2G" },
    { country:"Austria",     code:"AT", rate:"20%", threshold:"€35,000",  format:"DD.MM.YYYY", note:"ebInterface for public sector" },
    { country:"Sweden",      code:"SE", rate:"25%", threshold:"SEK 80,000", format:"YYYY-MM-DD", note:"Peppol mandatory B2G" },
    { country:"Poland",      code:"PL", rate:"23%", threshold:"PLN 200,000", format:"DD.MM.YYYY", note:"KSeF mandatory April 2026" },
    { country:"Hungary",     code:"HU", rate:"27%", threshold:"HUF 12M",  format:"YYYY.MM.DD", note:"NAV Online Szamla real-time reporting" },
  ];

  return (
    <SubLayout pill="EU Compliance" title="How InvoiceAI handles EU compliance." sub="Every rule, explained plainly. Built into the product so you don't have to think about it.">

      <SH>The 12 rules built into every invoice</SH>
      <SP>EU invoicing law is a patchwork of directives, national implementations, and special cases. Heres everything InvoiceAI handles automatically.</SP>

      <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"20px 0 36px" }}>
        {EU_FEATURES.map(function(f, i) {
          var isOpen = open === i;
          return (
            <div key={f.title} style={{ background:isOpen ? L.cream : L.white, border:"1.5px solid "+(isOpen ? L.accent+"33" : L.border), borderRadius:10, overflow:"hidden" }}>
              <button onClick={function(){ setOpen(isOpen ? -1 : i); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ width:32, height:32, borderRadius:8, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={f.icon} size={14} color={L.accent} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{f.title}</div>
                  <div style={{ fontFamily:fMono, fontSize:10, color:L.accent, letterSpacing:"0.05em", marginTop:2 }}>{f.badge}</div>
                </div>
                <span style={{ fontFamily:fMono, fontSize:12, color:L.faint, flexShrink:0 }}>{isOpen ? "^" : "v"}</span>
              </button>
              {isOpen && (
                <div style={{ padding:"0 16px 16px 60px", borderTop:"1px solid "+L.borderLt }}>
                  <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.7, margin:"12px 0 0", fontWeight:300 }}>{f.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SH>VAT rates and thresholds by country</SH>
      <SP>Small-business VAT exemptions vary significantly across the EU. InvoiceAI shows the correct threshold for each client country and flags when you may need to register.</SP>

      <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, overflow:"hidden", margin:"16px 0 36px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 60px 100px 1fr", gap:0, padding:"10px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}>
          {["Country","Code","VAT","Threshold","Notes"].map(function(h) {
            return <span key={h} style={{ fontFamily:fMono, fontSize:10, color:L.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{h}</span>;
          })}
        </div>
        {VAT_TABLE.map(function(row, i) {
          return (
            <div key={row.code} style={{ display:"grid", gridTemplateColumns:"1fr 60px 60px 100px 1fr", gap:0, padding:"11px 16px", borderBottom:i<VAT_TABLE.length-1?"1px solid "+L.borderLt:"none", background:i%2===0 ? "transparent" : L.paper }}>
              <span style={{ fontFamily:fSans, fontSize:14, color:L.ink, fontWeight:500 }}>{row.country}</span>
              <span style={{ fontFamily:fMono, fontSize:13, color:L.muted }}>{row.code}</span>
              <span style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:600 }}>{row.rate}</span>
              <span style={{ fontFamily:fMono, fontSize:12, color:L.green }}>{row.threshold}</span>
              <span style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontWeight:300 }}>{row.note}</span>
            </div>
          );
        })}
      </div>

      <SH>Reverse charge - when it applies</SH>
      <SP>Reverse charge (Art. 44 EU VAT Directive) applies when all three conditions are met: you are VAT-registered, your client is VAT-registered, and you are invoicing a business in a different EU member state. InvoiceAI detects this automatically when you enter a valid client VAT number and the client country differs from yours.</SP>
      <SP>When reverse charge applies: VAT is set to 0%, the required legal text is added (Steuerschuldnerschaft des Leistungsempfaengers / Autoliquidation), and you are reminded to include the transaction in your quarterly ZM (recapitulative statement).</SP>
      <SP>Reverse charge does not apply to B2C invoices, to clients in the same country, or to Kleinunternehmer (SS19 UStG) - InvoiceAI blocks the combination automatically.</SP>

      <SH>XRechnung and e-invoice mandates</SH>
      <SP>Germany requires XRechnung (EN 16931 / XRechnung 3.0) for all invoices to public authorities (B2G) since 2020, with B2B phasing in from 2025 to 2028. InvoiceAI generates fully compliant XRechnung 3.0 XML from your invoice form with one click.</SP>
      <SP>Frances Factur-X mandate takes effect September 2026. Italys FatturaPA via SDI has been mandatory for all invoices since 2019. Polands KSeF system launched April 2026. InvoiceAI adds these as they become available.</SP>

      <SH>What we dont do (and why)</SH>
      <SP>InvoiceAI is not a tax filing system, accounting software, or registered tax advisor. We handle invoice generation and compliance formatting - VAT calculations, required legal text, and e-invoice XML. You remain responsible for filing your VAT returns, ZM statements, and OSS registrations. We recommend working with a local Steuerberater or accountant for those obligations.</SP>

      <div style={{ background:L.accent, borderRadius:14, padding:"24px 28px", marginTop:36, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <div>
          <div style={{ fontFamily:fSerif, fontSize:18, fontWeight:700, color:"#fff", marginBottom:4 }}>Questions about your specific situation?</div>
          <div style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.7)", fontWeight:300 }}>The support bot knows EU compliance well. Or email us at hello@invoice-ai.de</div>
        </div>
        <button onClick={function(){ if(openModal) openModal("eu-compliance"); }} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.3)", padding:"10px 22px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, whiteSpace:"nowrap" }}>
          Get early access ->
        </button>
      </div>
    </SubLayout>
  );
}

export function PageFAQ(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var [open, setOpen] = useState(null);

  var categories = [
    {
      title: "Pricing & Plans",
      items: [
        { q:"How much does InvoiceAI cost?", a:"Solo is €19/mo (up to 3 active clients), Studio is €59/mo (unlimited clients, our most popular plan), Agency is €149/mo (5 team seats, white-label portal). All plans include a 14-day free trial with no credit card required." },
        { q:"What counts as an 'active client'?", a:"A client you've created an invoice or proposal for in the current billing month. Archived or inactive clients don't count. Most freelancers with 1-3 regular clients stay on the Solo plan indefinitely." },
        { q:"Can I change plans later?", a:"Yes - upgrade or downgrade at any time from your account settings. If you upgrade, you're charged the difference pro-rated for the remainder of the month. If you downgrade, the change takes effect at the next billing cycle." },
        { q:"Is there a free trial?", a:"Yes. 14 days free on any plan, no credit card needed. You get the full feature set during the trial, not a limited version." },
        { q:"What is the founding member discount?", a:"The first users who join via the waitlist lock in Studio at €29/mo forever - 50% off the regular price. This offer ends when we officially launch. Once locked in, your price never increases." },
      ],
    },
    {
      title: "EU Compliance & VAT",
      items: [
        { q:"What is reverse charge and when does it apply?", a:"Reverse charge means your client pays the VAT to their own tax authority instead of you collecting it. It applies when you invoice a VAT-registered business in a different EU country (B2B cross-border). InvoiceAI detects this automatically when you enter a valid client VAT number." },
        { q:"I'm a Kleinunternehmer (SS19 UStG) - can I use reverse charge?", a:"No. Kleinunternehmer status means you have no VAT number, so reverse charge cannot apply. InvoiceAI blocks this combination automatically. Your invoices should carry the SS19 UStG exemption notice instead." },
        { q:"What is the Zusammenfassende Meldung (ZM)?", a:"The ZM is a quarterly report you must file with the German Finanzamt listing all cross-border B2B invoices where reverse charge applied. InvoiceAI reminds you of this on every reverse charge invoice and keeps a record you can use for filing." },
        { q:"What is XRechnung and do I need it?", a:"XRechnung is Germany's mandatory structured e-invoice format. For invoices to German government bodies (B2G), it has been required since 2020. For B2B, the mandate phases in from 2025-2028. InvoiceAI generates fully compliant XRechnung 3.0 XML from your invoice form with one click." },
        { q:"What is OSS and do I need to register?", a:"OSS (One Stop Shop) applies only to B2C digital services. If you sell digital services directly to consumers (not businesses) across multiple EU countries and your total B2C cross-border revenue exceeds €10,000/year, you should register for OSS. Most InvoiceAI users invoice B2B and are not affected." },
        { q:"Does InvoiceAI validate VAT numbers?", a:"Yes - InvoiceAI calls the EU VIES register in real time as you type the client's VAT number. A green badge confirms the number is valid. If VIES returns invalid, reverse charge is blocked and you're asked to verify manually before proceeding." },
      ],
    },
    {
      title: "Proposals",
      items: [
        { q:"How does the AI proposal writer work?", a:"You fill in the client name, company, country, project type and a short brief. InvoiceAI uses this to generate a structured proposal adapted to the project type and your client's country communication norms. German clients get precise, formal proposals. Dutch clients get direct, no-filler ones. French clients get proposals that lead with value before price." },
        { q:"Can I edit the proposal after it's generated?", a:"Yes - the generated text is fully editable. You can also use the refine chips (Make it shorter, More formal, Add case studies, Stronger close) to iterate with one tap. Each refinement builds on the previous version." },
        { q:"Is the proposal output private?", a:"Yes. Your proposal content is sent to the AI for generation and then returned to you. We do not store, share or use it to train any model." },
      ],
    },
    {
      title: "Invoicing",
      items: [
        { q:"What invoice formats can I export?", a:"PDF (print-quality, via browser) and XRechnung 3.0 XML (machine-readable, EN 16931 compliant). ZUGFeRD (hybrid PDF+XML) and Factur-X (France) are coming Q4 2026." },
        { q:"Can I invoice in currencies other than EUR?", a:"Yes - the invoice form uses the correct currency automatically based on the client's country. Hungarian clients get HUF, Swedish clients get SEK, Polish clients get PLN, UK clients get GBP." },
        { q:"How do I handle invoices to UK clients after Brexit?", a:"UK clients are treated as third-country (non-EU) customers. InvoiceAI adds the correct exemption notice ('service not taxable in Germany / SS3a UStG') and sets VAT to 0%. No reverse charge - that only applies within the EU." },
        { q:"Can I issue a credit note?", a:"Yes - enable the Credit Note option in the EU compliance section. InvoiceAI assigns a separate CN-YYYY-XXX number sequence as required by EU VAT law and adds the reference to the original invoice." },
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        { q:"Where is my data stored?", a:"All data is stored on AWS Frankfurt (eu-central-1). It never leaves the EU. We comply fully with GDPR and the German GoBD requirements for 10-year invoice archiving." },
        { q:"Do you sell my data?", a:"Never. We do not sell, rent or share your data with any third party for any purpose. Our analytics are cookieless (Plausible). See our Privacy Policy for the full picture." },
        { q:"Can I export all my data?", a:"Yes - export all clients, invoices and proposals as JSON or CSV at any time from your account settings. You own your data completely." },
        { q:"What happens if I cancel?", a:"You keep access until the end of your billing period. After that you can still log in and export your data for 90 days before the account is archived. Invoice records are retained for 10 years per GoBD." },
      ],
    },
  ];

  return (
    <SubLayout pill="Help" title="Frequently asked questions." sub="Everything you need to know about InvoiceAI. Can't find your answer? The chat widget bottom-right connects you directly.">
      <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
        {categories.map(function(cat) {
          return (
            <div key={cat.title}>
              <h3 style={{ fontFamily:fSans, fontSize:13, fontWeight:600, color:L.accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>{cat.title}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {cat.items.map(function(item, i) {
                  var key = cat.title + i;
                  var isOpen = open === key;
                  return (
                    <div key={key} style={{ background:isOpen ? L.cream : L.white, border:"1.5px solid "+(isOpen ? L.accent+"33" : L.border), borderRadius:10, overflow:"hidden" }}>
                      <button onClick={function(){ setOpen(isOpen ? null : key); }} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", gap:12 }}>
                        <span style={{ fontFamily:fSans, fontSize:15, fontWeight:500, color:L.ink, flex:1 }}>{item.q}</span>
                        <span style={{ fontFamily:fMono, fontSize:13, color:L.muted, flexShrink:0 }}>{isOpen ? "^" : "v"}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding:"0 16px 14px", borderTop:"1px solid "+L.borderLt }}>
                          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, lineHeight:1.65, margin:0, fontWeight:300, paddingTop:12 }}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background:L.accent, borderRadius:14, padding:"24px 28px", marginTop:36, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
        <div>
          <div style={{ fontFamily:fSerif, fontSize:18, fontWeight:700, color:"#fff", marginBottom:4 }}>Still have a question?</div>
          <div style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.7)", fontWeight:300 }}>Chat with us or email hello@invoice-ai.de</div>
        </div>
        <button onClick={function(){ openModal("faq"); }} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.3)", padding:"10px 22px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500 }}>
          Get early access ->
        </button>
      </div>
    </SubLayout>
  );
}

export function PageCookies() {
  var cookies = [
    { name:"invoiceai_session", type:"Strictly necessary", dur:"Session",  desc:"Keeps you logged in during your browser session." },
    { name:"invoiceai_auth",    type:"Strictly necessary", dur:"30 days",  desc:"Remembers your login across sessions if you choose Stay logged in." },
    { name:"invoiceai_lang",    type:"Functional",         dur:"1 year",   desc:"Remembers your chosen language preference." },
    { name:"_plausible",        type:"Analytics",          dur:"None",     desc:"Plausible: no personal data, no cookie set. Session counted via hash." },
    { name:"__stripe_mid",      type:"Payment",            dur:"1 year",   desc:"Stripe fraud prevention. Only set on checkout pages." },
  ];
  var typeColor = { "Strictly necessary":L.green, "Functional":L.blue, "Analytics":L.gold, "Payment":L.accent };
  return (
    <SubLayout pill="Legal" title="Cookie Policy" sub="Last updated: 1 May 2026. We use as few cookies as possible - only what's needed to run the service.">
      <SH>Our approach</SH>
      <SP>We deliberately minimise cookie usage. No advertising cookies, no third-party tracking, no social media pixels. Our analytics are cookieless (Plausible) and our only strictly necessary cookies are for authentication.</SP>
      <SH>Cookies we use</SH>
      <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"16px 0 28px" }}>
        {cookies.map(function(c, i) {
          var tc = typeColor[c.type] || L.muted;
          return (
            <div key={c.name} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                <span style={{ fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:500 }}>{c.name}</span>
                <span style={{ fontFamily:fMono, fontSize:10, color:tc, background:tc+"15", border:"1px solid "+tc+"33", borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em" }}>{c.type}</span>
                <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, marginLeft:"auto" }}>{c.dur}</span>
              </div>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.5, margin:0, fontWeight:300 }}>{c.desc}</p>
            </div>
          );
        })}
      </div>
      <SH>Contact</SH>
      <SP>Questions about cookies? Email privacy@invoiceai.eu</SP>
    </SubLayout>
  );
}

// -- Client Portal -------------------------------------------------------------
