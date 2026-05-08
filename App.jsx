import { useState, useEffect } from "react";
import { FONTS, PAGES, L } from "./constants.jsx";
import { Nav, PaymentStrip, Footer, SupportBot, SignupModal, AuthModal, CookieBanner } from "./Nav.jsx";
import { Landing, PricingSection } from "./Landing.jsx";
import { InvoiceGen, ClientPortal } from "./Generator.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { PageAbout, PageBlog, PageCareers, PagePrivacy, PageTerms, PageGDPR, PageEUCompliance, PageFAQ, PageCookies } from "./Pages.jsx";

// ── Global CSS ───────────────────────────────────────────────────────────────
var GLOBAL_CSS = "* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #F7F8FA; overflow-x: hidden; font-family: 'DM Sans', sans-serif; } @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } } @keyframes floatUp { 0% { opacity:0; transform:translateY(12px); } 100% { opacity:1; transform:translateY(0); } } @keyframes shimmer { 0% { opacity:0.5; } 50% { opacity:1; } 100% { opacity:0.5; } } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: #EEF1F5; } ::-webkit-scrollbar-thumb { background: #C8D0DC; border-radius: 2px; } @media (min-width: 769px) { .nav-burger { display: none !important; } } @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-cta { display: none !important; } .nav-burger { display: flex !important; flex-direction: column; } .nav-desktop-center { display: none !important; } .hero-btns { flex-direction: column !important; align-items: stretch !important; } .hero-cards { display: none !important; } .grid3 { grid-template-columns: 1fr !important; } .grid2 { grid-template-columns: 1fr !important; } .grid4 { grid-template-columns: 1fr 1fr !important; } .prop-grid { grid-template-columns: 1fr !important; } .inv-grid { grid-template-columns: 1fr !important; } .dash-main { padding: 20px 16px 100px !important; overflow-x: hidden !important; } .dash-overview-grid { grid-template-columns: 1fr !important; } .dash-kpi-grid { grid-template-columns: 1fr 1fr !important; } .dash-brandkit-grid { grid-template-columns: 1fr !important; } .footer-cols { grid-template-columns: 1fr 1fr !important; } .dash-pipeline-grid { grid-template-columns: 1fr 1fr !important; } .support-bot-wrap { bottom: 16px !important; right: 16px !important; } .support-bot-dashboard { bottom: 80px !important; } .bot-panel { width: calc(100vw - 32px) !important; right: 0 !important; } .stat-grid { grid-template-columns: 1fr 1fr !important; } .sub-grid { grid-template-columns: 1fr 1fr !important; } .pricing-scroll > div { flex: 0 0 calc(85vw) !important; min-width: calc(85vw) !important; } .reviews-desktop { display: none !important; } .reviews-mobile { display: block !important; } } @media (max-width: 480px) { .grid4 { grid-template-columns: 1fr !important; } .stat-grid { grid-template-columns: 1fr !important; } .sub-grid { grid-template-columns: 1fr !important; } } @media print { *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } body * { visibility: hidden; } #print-invoice, #print-invoice * { visibility: visible; } #print-invoice { position: fixed; top: 0; left: 0; width: 100%; padding: 32px 40px; margin: 0; border: none !important; border-radius: 0 !important; box-shadow: none !important; background: #fff !important; } #print-proposal, #print-proposal * { visibility: visible; } #print-proposal { position: fixed; top: 0; left: 0; width: 100%; max-height: none !important; overflow: visible !important; padding: 40px 56px; margin: 0; background: #fff !important; font-size: 14px !important; } .compliance-chips { display: flex !important; flex-direction: column !important; align-items: flex-start !important; } .hero-constellation-mobile { display: block !important; } } @media (min-width: 1024px) { .hero-constellation-mobile { display: none !important; } .compliance-chips { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; align-items: center !important; gap: 10px !important; } .compliance-svg { display: none !important; } .reviews-mobile { display: none !important; } .reviews-desktop { display: block !important; } .desktop-pricing { justify-content: center !important; overflow-x: visible !important; } .desktop-pricing > div { flex: 1 !important; min-width: 0 !important; max-width: 340px !important; } .desktop-hero { max-width: 1100px !important; } .desktop-feat-cards { max-width: 720px !important; } .desktop-section { max-width: 1100px !important; } .desktop-eu-grid { grid-template-columns: repeat(3, 1fr) !important; } .desktop-prop { max-width: 960px !important; grid-template-columns: 1fr 1fr !important; gap: 32px !important; padding: 32px 40px 64px !important; } .desktop-inv { max-width: 960px !important; grid-template-columns: 1fr 300px !important; gap: 24px !important; padding: 32px 40px 64px !important; } .desktop-strip { max-width: 700px !important; } .payment-badges { flex-wrap: nowrap !important; } .desktop-prose { max-width: 920px !important; padding: 64px 48px 100px !important; font-size: 16px !important; line-height: 1.85 !important; } .desktop-sub-header { max-width: 900px !important; } .footer-inner { display: flex !important; gap: 48px !important; align-items: flex-start !important; } .footer-brand { max-width: 280px !important; flex-shrink: 0 !important; margin-bottom: 0 !important; } .footer-cols { flex: 1 !important; margin-bottom: 0 !important; } .bot-panel { width: 400px !important; } .bot-trigger { width: 56px !important; height: 56px !important; } .cookie-banner { max-width: 380px !important; padding: 22px 22px 18px !important; font-size: 13px !important; } .hero-layout { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 80px !important; align-items: center !important; text-align: left !important; } .hero-cards { display: flex !important; align-items: center !important; justify-content: center !important; } .hero-pill { justify-content: flex-start !important; } .hero-headline { text-align: left !important; } .hero-sub { text-align: left !important; margin-left: 0 !important; } .hero-btns { justify-content: flex-start !important; } .hero-fine { text-align: left !important; } .hero-counter { justify-content: flex-start !important; } .d-body { font-size: 15px !important; line-height: 1.7 !important; } .d-body-lg { font-size: 18px !important; line-height: 1.7 !important; } .d-label { font-size: 15px !important; } .d-card-title { font-size: 17px !important; } .d-card-desc { font-size: 15px !important; line-height: 1.65 !important; } .d-section-sub { font-size: 17px !important; line-height: 1.65 !important; } .d-dash-body { font-size: 15px !important; } .d-dash-sub { font-size: 14px !important; } .d-review-text { font-size: 16px !important; line-height: 1.7 !important; } .d-pricing-feat { font-size: 15px !important; } .d-inv-body { font-size: 15px !important; } .d-inv-td { font-size: 15px !important; } .d-compliance-desc { font-size: 15px !important; line-height: 1.7 !important; } }";

export default function App() {
  var [page, setPage] = useState(function() {
    var params = new URLSearchParams(window.location.search);
    return params.get("portal") ? "ClientPortal" : "Home";
  });
  var [modal, setModal] = useState(null);
  var [lang, setLang] = useState("de");
  var [cookieDismissed, setCookieDismissed] = useState(false);
  var [authOpen, setAuthOpen] = useState(false);
  var [user, setUser] = useState(function() {
    try {
      var stored = localStorage.getItem("invoiceai_user");
      return stored ? JSON.parse(stored) : null;
    } catch(e) { return null; }
  });
  var [convertProposal, setConvertProposal] = useState(null);
  // genMode controls which tab InvoiceGen opens on when navigating from the nav dropdown
  var [genMode, setGenMode] = useState("invoice");

  function openModal(source) { setModal(source); }
  function closeModal() { setModal(null); }
  function handleAuth(u, session) {
    setUser(u);
    try { localStorage.setItem("invoiceai_user", JSON.stringify(u)); } catch(e) {}
    setPage("Dashboard");
  }
  function handleSignOut() {
    setUser(null);
    try { localStorage.removeItem("invoiceai_user"); } catch(e) {}
    setPage("Home");
  }

  useEffect(function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  var showFooter = ["Home","Pricing","About","Blog","Careers","Privacy","Terms","GDPR","Cookies","FAQ","EUCompliance"].indexOf(page) >= 0;

  return (
    <>
      <style>{FONTS}</style>
      <style>{GLOBAL_CSS}</style>
      {page !== "ClientPortal" && (
        <Nav
          page={page}
          setPage={setPage}
          setGenMode={setGenMode}
          openModal={openModal}
          lang={lang}
          setLang={setLang}
          openAuth={function(){ setAuthOpen(true); }}
          user={user}
          onSignOut={handleSignOut}
        />
      )}
      {page==="Home"         && <><Landing setPage={setPage} openModal={openModal} lang={lang} /><PaymentStrip /></>}
      {page==="Generator"    && <InvoiceGen onFirstGenerate={null} setPage={setPage} lang={lang} initialMode={genMode} convertProposal={convertProposal} onConvertDone={function(){ setConvertProposal(null); }} />}
      {page==="Pricing"      && <><PricingSection setPage={setPage} openModal={openModal} lang={lang} /><PaymentStrip /></>}
      {page==="Dashboard"    && <Dashboard setPage={setPage} setConvertProposal={setConvertProposal} user={user} />}
      {page==="ClientPortal" && <ClientPortal setPage={setPage} />}
      {page==="About"        && <PageAbout setPage={setPage} openModal={openModal} />}
      {page==="Blog"         && <PageBlog />}
      {page==="Careers"      && <PageCareers />}
      {page==="Privacy"      && <PagePrivacy />}
      {page==="Terms"        && <PageTerms />}
      {page==="GDPR"         && <PageGDPR />}
      {page==="Cookies"      && <PageCookies />}
      {page==="EUCompliance" && <PageEUCompliance setPage={setPage} openModal={openModal} />}
      {page==="FAQ"          && <PageFAQ setPage={setPage} openModal={openModal} />}
      {showFooter && <Footer setPage={setPage} openModal={openModal} lang={lang} />}
      {page !== "ClientPortal" && <SupportBot isDashboard={page === "Dashboard"} />}
      {modal && <SignupModal source={modal} onClose={closeModal} lang={lang} />}
      {authOpen && <AuthModal onClose={function(){ setAuthOpen(false); }} onAuth={handleAuth} lang={lang} />}
      {!cookieDismissed && page !== "ClientPortal" && (
        <CookieBanner
          onAccept={function(){ setCookieDismissed(true); }}
          onDecline={function(){ setCookieDismissed(true); }}
          setPage={setPage}
        />
      )}
    </>
  );
}
