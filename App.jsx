import { useState, useEffect, useRef } from "react";

// ── Palette ──────────────────────────────────────────────────────────────────
var L = {
  ink:        "#1A1F2E",
  paper:      "#F8F9FC",
  cream:      "#EEF1F8",
  sand:       "#E4E8F2",
  white:      "#FFFFFF",
  accent:     "#3B5BDB",
  accentLt:   "#748FFC",
  accentGlow: "rgba(59,91,219,0.08)",
  gold:       "#9A7820",
  goldGlow:   "rgba(154,120,32,0.1)",
  muted:      "#6B7280",
  faint:      "#9CA3AF",
  border:     "#E2E5EF",
  borderLt:   "#EEF0F6",
  green:      "#2A7A54",
  greenGlow:  "rgba(42,122,84,0.08)",
  blue:       "#3B5BDB",
  blueGlow:   "rgba(59,91,219,0.08)",
};

var fSans  = "'Inter',sans-serif";
var fMono  = "'DM Mono',monospace";
var fSerif = "'Playfair Display',serif";

var FONTS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');";

// ── Translations ──────────────────────────────────────────────────────────────
var TR = {
  en: {
    navStart:        "Start Free",
    navStartArrow:   "Start Free →",
    heroPill:        "For EU freelancers who invoice across borders",
    heroTitle1:      "Your clients are across Europe.",
    heroTitle2:      "Your invoices should be too.",
    heroSub:         "InvoiceAI writes your proposals and builds your invoices — with every EU rule applied automatically. One tool for every client, in every country.",
    heroCta:         "Get early access →",
    heroSecondary:   "See pricing",
    heroFine:        "No credit card · 14-day free trial · Cancel anytime",
    heroFeatures:    "Reverse charge auto-detect  ·  XRechnung XML export  ·  AI proposals in 6 languages",
    navHome:"Home", navGenerator:"Generator", navPricing:"Pricing", navDashboard:"Dashboard",
    footerProduct:"Product", footerCompany:"Company", footerLegal:"Legal",
    pillFeatures:"Features", pillCompliance:"EU-Native Compliance", pillReviews:"Reviews", pillPricing:"Pricing",
    heroSecondaryBtn:"See pricing", featSeeAll:"See all features",
    authSignIn:"Sign in", authSignUp:"Sign up", authMagic:"Magic link",
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
    heroPill:        "Für Freelancer, die grenzüberschreitend abrechnen",
    heroTitle1:      "Deine Kunden sind in ganz Europa.",
    heroTitle2:      "Deine Rechnungen auch.",
    heroSub:         "InvoiceAI schreibt deine Angebote und erstellt deine Rechnungen — mit jeder EU-Regel automatisch angewendet. Ein Tool für jeden Kunden, in jedem Land.",
    heroCta:         "Frühen Zugang erhalten →",
    heroSecondary:   "Preise ansehen",
    heroFine:        "Keine Kreditkarte · 14 Tage kostenlos · Jederzeit kündbar",
    heroFeatures:    "Reverse Charge automatisch  ·  XRechnung XML Export  ·  KI-Angebote in 6 Sprachen",
    navHome:"Startseite", navGenerator:"Generator", navPricing:"Preise", navDashboard:"Dashboard",
    footerProduct:"Produkt", footerCompany:"Unternehmen", footerLegal:"Rechtliches",
    pillFeatures:"Funktionen", pillCompliance:"EU-Konformität", pillReviews:"Bewertungen", pillPricing:"Preise",
    heroSecondaryBtn:"Preise ansehen", featSeeAll:"Alle Funktionen",
    authSignIn:"Anmelden", authSignUp:"Registrieren", authMagic:"Magic Link",
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
  fr: {
    navStart:        "Commencer gratuitement",
    navStartArrow:   "Commencer gratuitement →",
    heroPill:        "Pour les freelances qui facturent en Europe",
    heroTitle1:      "Vos clients sont partout en Europe.",
    heroTitle2:      "Vos factures aussi.",
    heroSub:         "InvoiceAI rédige vos propositions et génère vos factures — avec chaque règle UE appliquée automatiquement. Un outil pour chaque client, dans chaque pays.",
    heroCta:         "Accès anticipé →",
    heroSecondary:   "Voir les tarifs",
    heroFine:        "Sans carte bancaire · 14 jours gratuits · Résiliation à tout moment",
    heroFeatures:    "Autoliquidation automatique  ·  Export XML Factur-X  ·  Propositions IA en 6 langues",
    navHome:"Accueil", navGenerator:"Générateur", navPricing:"Tarifs", navDashboard:"Tableau de bord",
    footerProduct:"Produit", footerCompany:"Entreprise", footerLegal:"Mentions légales",
    pillFeatures:"Fonctionnalités", pillCompliance:"Conformité UE", pillReviews:"Avis", pillPricing:"Tarifs",
    heroSecondaryBtn:"Voir les tarifs", featSeeAll:"Toutes les fonctionnalités",
    authSignIn:"Se connecter", authSignUp:"S'inscrire", authMagic:"Lien magique",
    heroCounter:     "facturés ce mois par nos utilisateurs",
    featTitle:       "Conçu pour la façon dont vous travaillez vraiment",
    featSub:         "Les outils sont faits pour les comptables. Le nôtre est fait pour ceux qui font le travail.",
    euTitle:         "Conçu pour la facturation européenne.",
    euSub:           "Pas un module ajouté. Pas un add-on. Chaque exigence de conformité UE est intégrée au cœur.",
    reviewsTitle:    "Approuvé dans toute l'Europe",
    pricingTitle:    "Tarifs simples et honnêtes",
    pricingSub:      "14 jours gratuits. Sans carte bancaire.",
    pricingCta:      "Essai gratuit →",
    propTitle:       "Créer une proposition",
    propSub:         "Décrivez votre projet. L'IA rédige une proposition prête à envoyer en quelques secondes.",
    propGenerate:    "✦ Générer la proposition",
    propWriting:     "✦ Rédaction en cours…",
    propReady:       "✓ Proposition prête",
    modalTitle:      "Rejoindre la liste d'attente.",
    modalSub:        "Les membres fondateurs obtiennent Studio à 29 €/mois pour toujours — 50% sous le prix de lancement.",
    modalCta:        "Rejoindre la liste →",
    modalJoining:    "Inscription en cours…",
    modalDoneTitle:  "Vous êtes sur la liste.",
    modalExploreCta: "Explorer la démo →",
    footerWaitlist:  "Liste d'attente — Studio 29 €/mois à vie",
    footerWaitlistSub: "Tarif fondateur. Bloqué à l'inscription. Fin au lancement.",
    footerCta:       "Accès anticipé →",
  },
  es: {
    navStart:        "Empezar gratis",
    navStartArrow:   "Empezar gratis →",
    heroPill:        "Para freelances que facturan en toda Europa",
    heroTitle1:      "Tus clientes están en toda Europa.",
    heroTitle2:      "Tus facturas también.",
    heroSub:         "InvoiceAI redacta tus propuestas y genera tus facturas — con cada regla de la UE aplicada automáticamente. Una herramienta para cada cliente, en cada país.",
    heroCta:         "Acceso anticipado →",
    heroSecondary:   "Ver precios",
    heroFine:        "Sin tarjeta de crédito · 14 días gratis · Cancela cuando quieras",
    heroFeatures:    "Inversión del sujeto pasivo  ·  Export XML XRechnung  ·  Propuestas IA en 6 idiomas",
    navHome:"Inicio", navGenerator:"Generador", navPricing:"Precios", navDashboard:"Panel",
    footerProduct:"Producto", footerCompany:"Empresa", footerLegal:"Legal",
    pillFeatures:"Funciones", pillCompliance:"Cumplimiento UE", pillReviews:"Reseñas", pillPricing:"Precios",
    heroSecondaryBtn:"Ver precios", featSeeAll:"Ver todas las funciones",
    authSignIn:"Iniciar sesión", authSignUp:"Registrarse", authMagic:"Enlace mágico",
    heroCounter:     "facturados este mes por nuestros usuarios",
    featTitle:       "Construido para la forma en que realmente trabajas",
    featSub:         "Herramientas hechas para contables. La nuestra está hecha para quienes hacen el trabajo.",
    euTitle:         "Construido para la facturación europea.",
    euSub:           "No adaptado. No es un complemento. Cada requisito de cumplimiento de la UE está integrado en el núcleo.",
    reviewsTitle:    "De confianza en toda Europa",
    pricingTitle:    "Precios simples y honestos",
    pricingSub:      "14 días gratis. Sin tarjeta de crédito.",
    pricingCta:      "Prueba gratuita →",
    propTitle:       "Crear una propuesta",
    propSub:         "Describe tu proyecto. La IA redacta una propuesta lista para el cliente en segundos.",
    propGenerate:    "✦ Generar propuesta",
    propWriting:     "✦ Redactando tu propuesta…",
    propReady:       "✓ Propuesta lista",
    modalTitle:      "Únete a la lista de espera.",
    modalSub:        "Los miembros fundadores obtienen Studio a 29 €/mes para siempre — 50% bajo el precio de lanzamiento.",
    modalCta:        "Unirse a la lista →",
    modalJoining:    "Registrando…",
    modalDoneTitle:  "Estás en la lista.",
    modalExploreCta: "Explorar la demo →",
    footerWaitlist:  "Lista de espera — Studio 29 €/mes para siempre",
    footerWaitlistSub: "Precio fundador. Bloqueado al registrarse. Termina en el lanzamiento.",
    footerCta:       "Acceso anticipado →",
  },
  it: {
    navStart:        "Inizia gratis",
    navStartArrow:   "Inizia gratis →",
    heroPill:        "Per i freelance che fatturano in tutta Europa",
    heroTitle1:      "I tuoi clienti sono in tutta Europa.",
    heroTitle2:      "Le tue fatture anche.",
    heroSub:         "InvoiceAI scrive le tue proposte e genera le tue fatture — con ogni regola UE applicata automaticamente. Uno strumento per ogni cliente, in ogni paese.",
    heroCta:         "Accesso anticipato →",
    heroSecondary:   "Vedi i prezzi",
    heroFine:        "Senza carta di credito · 14 giorni gratis · Disdici quando vuoi",
    heroFeatures:    "Inversione contabile auto  ·  Export XML FatturaPA  ·  Proposte IA in 6 lingue",
    navHome:"Home", navGenerator:"Generatore", navPricing:"Prezzi", navDashboard:"Dashboard",
    footerProduct:"Prodotto", footerCompany:"Azienda", footerLegal:"Legale",
    pillFeatures:"Funzionalità", pillCompliance:"Conformità UE", pillReviews:"Recensioni", pillPricing:"Prezzi",
    heroSecondaryBtn:"Vedi i prezzi", featSeeAll:"Tutte le funzionalità",
    authSignIn:"Accedi", authSignUp:"Registrati", authMagic:"Link magico",
    heroCounter:     "fatturati questo mese dai nostri utenti",
    featTitle:       "Costruito per come lavori davvero",
    featSub:         "Strumenti fatti per i contabili. Il nostro è fatto per chi svolge il lavoro.",
    euTitle:         "Costruito per la fatturazione europea.",
    euSub:           "Non adattato. Non un add-on. Ogni requisito di conformità UE è integrato nel core.",
    reviewsTitle:    "Fiducia in tutta Europa",
    pricingTitle:    "Prezzi semplici e onesti",
    pricingSub:      "14 giorni gratis. Senza carta di credito.",
    pricingCta:      "Prova gratuita →",
    propTitle:       "Crea una proposta",
    propSub:         "Descrivi il tuo progetto. L'IA scrive una proposta pronta per il cliente in pochi secondi.",
    propGenerate:    "✦ Genera proposta",
    propWriting:     "✦ Scrittura in corso…",
    propReady:       "✓ Proposta pronta",
    modalTitle:      "Unisciti alla lista d'attesa.",
    modalSub:        "I membri fondatori ottengono Studio a €29/mese per sempre — 50% sotto il prezzo di lancio.",
    modalCta:        "Unisciti alla lista →",
    modalJoining:    "Registrazione in corso…",
    modalDoneTitle:  "Sei nella lista.",
    modalExploreCta: "Esplora la demo →",
    footerWaitlist:  "Lista d'attesa — Studio €29/mese per sempre",
    footerWaitlistSub: "Prezzo fondatore. Bloccato all'iscrizione. Termina al lancio.",
    footerCta:       "Accesso anticipato →",
  },
  hu: {
    navStart:        "Kezdd ingyen",
    navStartArrow:   "Kezdd ingyen →",
    heroPill:        "Határon átnyúló számlázáshoz Európában",
    heroTitle1:      "Az ügyfeleid egész Európában vannak.",
    heroTitle2:      "A számláid is legyenek.",
    heroSub:         "Az InvoiceAI megírja az ajánlataidat és elkészíti a számláidat — minden EU-szabályt automatikusan alkalmazva. Egy eszköz minden ügyfélhez, minden országban.",
    heroCta:         "Korai hozzáférés →",
    heroSecondary:   "Árak megtekintése",
    heroFine:        "Bankkártya nélkül · 14 napos ingyenes próba · Bármikor lemondható",
    heroFeatures:    "Fordított adózás automatikusan  ·  NAV XML export  ·  MI ajánlatok 6 nyelven",
    navHome:"Főoldal", navGenerator:"Generátor", navPricing:"Árak", navDashboard:"Irányítópult",
    footerProduct:"Termék", footerCompany:"Cég", footerLegal:"Jogi",
    pillFeatures:"Funkciók", pillCompliance:"EU-megfelelés", pillReviews:"Vélemények", pillPricing:"Árak",
    heroSecondaryBtn:"Árak megtekintése", featSeeAll:"Összes funkció",
    authSignIn:"Bejelentkezés", authSignUp:"Regisztráció", authMagic:"Varázslink",
    heroCounter:     "számlázva ezen a hónapon felhasználóink által",
    featTitle:       "Arra tervezve, ahogy valójában dolgozol",
    featSub:         "Más eszközök könyvelőknek készültek. A miénk azoknak, akik a munkát végzik.",
    euTitle:         "Az európai számlázásra tervezve.",
    euSub:           "Nem utólag hozzáadva. Nem egy bővítmény. Minden EU-megfelelési követelmény beépítve az alapokba.",
    reviewsTitle:    "Megbízható egész Európában",
    pricingTitle:    "Egyszerű, tisztességes árak",
    pricingSub:      "14 napos ingyenes próba. Bankkártya nélkül.",
    pricingCta:      "Ingyenes próba →",
    propTitle:       "Ajánlat készítése",
    propSub:         "Írd le a projektedet. Az MI másodpercek alatt ügyfélkész ajánlatot ír.",
    propGenerate:    "✦ Ajánlat generálása",
    propWriting:     "✦ Ajánlat írása folyamatban…",
    propReady:       "✓ Ajánlat kész",
    modalTitle:      "Csatlakozz a várólistához.",
    modalSub:        "Az alapító tagok örökre €29/hó áron kapják a Studiót — 50%-kal az indulási ár alatt.",
    modalCta:        "Csatlakozás a listához →",
    modalJoining:    "Csatlakozás folyamatban…",
    modalDoneTitle:  "Felkerültél a listára.",
    modalExploreCta: "Fedezd fel a demót →",
    footerWaitlist:  "Várólista — Studio €29/hó örökre",
    footerWaitlistSub: "Alapítói ár. Regisztrációkor rögzítve. Az induláskor véget ér.",
    footerCta:       "Korai hozzáférés →",
  },
};

function t(lang, key) {
  return (TR[lang] || TR.en)[key] || TR.en[key] || key;
}

// ── Logo Mark ─────────────────────────────────────────────────────────────────
function LogoMark(props) {
  var size = props.size || 32;
  var bg = props.bg || L.accent;
  var fg = props.fg || "#fff";
  var r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
      <rect width="48" height="48" rx={r} fill={bg} />
      <rect x="11" y="10" width="20" height="26" rx="2.5" fill="none" stroke={fg} strokeWidth="2" opacity="0.9"/>
      <line x1="15" y1="18" x2="27" y2="18" stroke={fg} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="15" y1="22" x2="27" y2="22" stroke={fg} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="15" y1="26" x2="22" y2="26" stroke={fg} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <circle cx="34" cy="15" r="7" fill={fg} opacity="0.15"/>
      <path d="M34 10 L35.3 13.7 L39 15 L35.3 16.3 L34 20 L32.7 16.3 L29 15 L32.7 13.7 Z" fill={fg}/>
    </svg>
  );
}



// ── EU Countries ──────────────────────────────────────────────────────────────
var EU = [
  // ── EU Member States (all 27) ───────────────────────────────────────────
  { code:"AT", name:"Austria",        vat:20, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"BE", name:"Belgium",        vat:21, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"BG", name:"Bulgaria",       vat:20, cur:"BGN", fmt:"DD.MM.YYYY", eu:true  },
  { code:"HR", name:"Croatia",        vat:25, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"CY", name:"Cyprus",         vat:19, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"CZ", name:"Czech Republic", vat:21, cur:"CZK", fmt:"DD.MM.YYYY", eu:true  },
  { code:"DK", name:"Denmark",        vat:25, cur:"DKK", fmt:"DD-MM-YYYY", eu:true  },
  { code:"EE", name:"Estonia",        vat:22, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"FI", name:"Finland",        vat:25.5, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"FR", name:"France",         vat:20, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"DE", name:"Germany",        vat:19, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"GR", name:"Greece",         vat:24, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"HU", name:"Hungary",        vat:27, cur:"HUF", fmt:"YYYY.MM.DD", eu:true  },
  { code:"IE", name:"Ireland",        vat:23, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"IT", name:"Italy",          vat:22, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"LV", name:"Latvia",         vat:21, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"LT", name:"Lithuania",      vat:21, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"LU", name:"Luxembourg",     vat:17, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"MT", name:"Malta",          vat:18, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"NL", name:"Netherlands",    vat:21, cur:"EUR", fmt:"DD-MM-YYYY", eu:true  },
  { code:"PL", name:"Poland",         vat:23, cur:"PLN", fmt:"DD.MM.YYYY", eu:true  },
  { code:"PT", name:"Portugal",       vat:23, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"RO", name:"Romania",        vat:19, cur:"RON", fmt:"DD.MM.YYYY", eu:true  },
  { code:"SK", name:"Slovakia",       vat:20, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"SI", name:"Slovenia",       vat:22, cur:"EUR", fmt:"DD.MM.YYYY", eu:true  },
  { code:"ES", name:"Spain",          vat:21, cur:"EUR", fmt:"DD/MM/YYYY", eu:true  },
  { code:"SE", name:"Sweden",         vat:25, cur:"SEK", fmt:"YYYY-MM-DD", eu:true  },
  // ── Non-EU (third countries — no reverse charge, export rules apply) ───
  { code:"GB", name:"UK (post-Brexit)",  vat:0,  cur:"GBP", fmt:"DD/MM/YYYY", eu:false },
  { code:"CH", name:"Switzerland",       vat:0,  cur:"CHF", fmt:"DD.MM.YYYY", eu:false },
  { code:"NO", name:"Norway",            vat:0,  cur:"NOK", fmt:"DD.MM.YYYY", eu:false },
  { code:"US", name:"United States",     vat:0,  cur:"USD", fmt:"MM/DD/YYYY", eu:false },
  { code:"GB", name:"Other non-EU",      vat:0,  cur:"EUR", fmt:"DD/MM/YYYY", eu:false },
];

var PLANS = [
  { name:"Solo",   price:19,   hi:false, features:["Up to 3 active clients","Unlimited invoices","AI proposal writer","PDF + XRechnung export","EU VAT auto-calc","SEPA payment block"] },
  { name:"Studio", price:59,  hi:true,  badge:"Most Popular", features:["Unlimited clients","Unlimited invoices + proposals","AI writer + country tone","Client portal + approvals","Payment tracking + reminders","Brand kits","Reverse charge + VIES check"] },
  { name:"Agency", price:149,  hi:false, features:["Everything in Studio","5 team seats","White-label client portal","API access","Priority support","DATEV export","XRechnung + ZUGFeRD XML"] },
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
    <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:999, border:"1.5px solid "+color, color:color, fontSize:13, fontFamily:fMono, letterSpacing:"0.08em", textTransform:"uppercase" }}>
      {props.children}
    </span>
  );
}

function Tag(props) {
  var c = props.c || L.green;
  return (
    <span style={{ padding:"2px 8px", borderRadius:4, background:c+"22", color:c, fontSize:12, fontFamily:fMono, letterSpacing:"0.06em" }}>
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
  var openAuth = props.openAuth;
  var user = props.user;
  var lang = props.lang || "en";
  var setLang = props.setLang;
  var [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:L.white, borderBottom:"1px solid "+L.border, flexShrink:0 }}>
      <div style={{ height:56, display:"flex", alignItems:"center", padding:"0 20px", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }} onClick={function(){ setPage("Home"); setMenuOpen(false); }}>
          <LogoMark size={32} />
          <div>
            <div style={{ fontFamily:fSerif, fontWeight:700, fontSize:17, color:L.ink, lineHeight:1.1, letterSpacing:"-0.02em" }}>InvoiceAI</div>
            <div style={{ fontFamily:fMono, fontSize:9, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase" }}>for Europe</div>
          </div>
        </div>
        <div style={{ flex:1 }} />
        <div className="nav-desktop" style={{ display:"flex", gap:2 }}>
          {PAGES.map(function(pg) {
            var pgLabel = pg === "Home" ? t(lang,"navHome") : pg === "Generator" ? t(lang,"navGenerator") : pg === "Pricing" ? t(lang,"navPricing") : pg === "Dashboard" ? t(lang,"navDashboard") : pg;
            return (
              <button key={pg} onClick={function(){ setPage(pg); }} style={{ background:page===pg ? L.accentGlow : "transparent", color:page===pg ? L.accent : L.muted, border:"none", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:page===pg ? 500 : 400 }}>
                {pgLabel}
              </button>
            );
          })}
        </div>
        {user ? (
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:L.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:"#fff", fontWeight:600 }}>
              {user.email ? user.email[0].toUpperCase() : "U"}
            </div>
            <button onClick={function(){ setPage("Dashboard"); }} style={{ background:L.accentGlow, color:L.accent, border:"1px solid "+L.accent+"44", padding:"7px 14px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>
              Dashboard
            </button>
          </div>
        ) : (
          <div className="nav-cta" style={{ display:"flex", gap:7, flexShrink:0 }}>
            <button onClick={openAuth} style={{ background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"8px 14px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15 }}>
              Log in
            </button>
            <button onClick={function(){ openModal("nav"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, boxShadow:"0 4px 14px rgba(59,91,219,0.25)" }}>
              {t(lang,"navStart")}
            </button>
          </div>
        )}
        <div style={{ position:"relative", flexShrink:0, marginLeft:4 }}>
          <select
            value={lang}
            onChange={function(e){ setLang(e.target.value); }}
            style={{ background:L.white, border:"1px solid "+L.border, borderRadius:7, padding:"5px 24px 5px 8px", cursor:"pointer", fontFamily:fMono, fontSize:13, color:L.ink, fontWeight:600, letterSpacing:"0.04em", outline:"none", appearance:"none", WebkitAppearance:"none" }}
          >
            {[["de","🇩🇪 DE"],["en","🇬🇧 EN"],["fr","🇫🇷 FR"],["es","🇪🇸 ES"],["it","🇮🇹 IT"],["hu","🇭🇺 HU"]].map(function(pair) {
              return <option key={pair[0]} value={pair[0]}>{pair[1]}</option>;
            })}
          </select>
          <div style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <svg width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke={L.muted} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
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
            var pgLabel = pg === "Home" ? t(lang,"navHome") : pg === "Generator" ? t(lang,"navGenerator") : pg === "Pricing" ? t(lang,"navPricing") : pg === "Dashboard" ? t(lang,"navDashboard") : pg;
            return (
              <button key={pg} onClick={function(){ setPage(pg); setMenuOpen(false); }} style={{ background:page===pg ? L.accentGlow : "transparent", color:page===pg ? L.accent : L.ink, border:"none", padding:"10px 14px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:page===pg ? 500 : 400, textAlign:"left" }}>
                {pgLabel}
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
    <section style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"96px 24px 80px", textAlign:"center" }}>
      <div className="desktop-hero" style={{ maxWidth:720, margin:"0 auto" }}>
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
{t(lang,"heroSecondaryBtn") || t(lang,"heroSecondary")}
          </button>
        </div>
        <p style={{ fontFamily:fMono, fontSize:13, color:L.faint, letterSpacing:"0.06em" }}>
{t(lang,"heroFine")}
        </p>
        <div className="desktop-feat-cards" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:28, maxWidth:520, margin:"28px auto 0" }}>
          {[
            { icon:"reverse", label: lang==="de" ? "Reverse Charge automatisch" : lang==="fr" ? "Autoliquidation auto" : lang==="it" ? "Inversione contabile" : lang==="es" ? "IVA invertido auto" : lang==="hu" ? "Fordított adózás" : "Reverse charge auto" },
            { icon:"document", label: lang==="de" ? "XRechnung XML" : lang==="fr" ? "Factur-X XML" : lang==="it" ? "FatturaPA XML" : lang==="hu" ? "NAV XML export" : "XRechnung XML" },
            { icon:"send", label: lang==="de" ? "KI-Angebote, 6 Sprachen" : lang==="fr" ? "Propositions IA × 6" : lang==="it" ? "Proposte IA × 6" : lang==="es" ? "Propuestas IA × 6" : lang==="hu" ? "AI ajánlatok × 6" : "AI proposals × 6 langs" },
          ].map(function(f) {
            return (
              <div key={f.label} style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:10, padding:"12px 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={f.icon} size={15} color={L.accent} />
                </div>
                <span style={{ fontFamily:fSans, fontSize:12, fontWeight:500, color:L.ink, textAlign:"center", lineHeight:1.35 }}>{f.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:28, display:"inline-flex", alignItems:"center", gap:10, background:L.cream, border:"1px solid "+L.border, borderRadius:99, padding:"8px 20px 8px 16px" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:L.green, flexShrink:0 }} />
          <span style={{ fontFamily:fSerif, fontSize:18, color:L.gold, fontWeight:700 }}>{"€"+count.toLocaleString("de-DE")}</span>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em", textTransform:"uppercase" }}>{t(lang,"heroCounter")}</span>
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
  var lang = props.lang || "en"; // lang already passed
  return (
    <section style={{ padding:"72px 24px", background:L.paper }}>
      <div className="desktop-section" style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <Pill color={L.gold}>{t(lang,"pillFeatures")||"Features"}</Pill>
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
                <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, lineHeight:1.6, fontWeight:300 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Field validators ──────────────────────────────────────────────────────────
function validateIBAN(raw) {
  if (!raw || !raw.trim()) return null; // empty = not validated
  var iban = raw.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return "Invalid IBAN format — should start with 2 letter country code";
  if (iban.length < 15 || iban.length > 34) return "IBAN length incorrect (" + iban.length + " chars)";
  // Mod-97 check
  var rearranged = iban.slice(4) + iban.slice(0, 4);
  var numeric = rearranged.split("").map(function(c) {
    var code = c.charCodeAt(0);
    return code >= 65 ? String(code - 55) : c;
  }).join("");
  var remainder = 0;
  for (var i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i])) % 97;
  }
  if (remainder !== 1) return "IBAN checksum invalid — please double-check";
  return "valid";
}

function validateBIC(raw) {
  if (!raw || !raw.trim()) return null;
  var bic = raw.replace(/\s/g, "").toUpperCase();
  // BIC is 8 or 11 chars: 4 bank + 2 country + 2 location + optional 3 branch
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)) {
    return "Invalid BIC/SWIFT — format: BANKDEFFXXX (4+2+2+optional 3)";
  }
  return "valid";
}

function validateEUVAT(raw) {
  if (!raw || !raw.trim()) return null;
  var vat = raw.replace(/\s/g, "").toUpperCase();
  // Must start with 2-letter country code
  if (!/^[A-Z]{2}/.test(vat) || vat.length < 6) return "VAT number must start with EU country code (e.g. DE, FR)";
  // Length checks per country
  var countryLengths = { DE:11, FR:13, IT:13, ES:11, NL:14, BE:12, PL:12, PT:11, AT:11, SE:14, DK:10, FI:10, IE:11, HU:10, CZ:12, SK:12, SI:10, HR:13, CY:11, LU:10, MT:10, EE:11, LV:13, LT:14, BG:11, RO:12 };
  var cc = vat.slice(0, 2);
  var expected = countryLengths[cc];
  if (expected && vat.length !== expected) return cc + " VAT number should be " + expected + " characters";
  return "valid";
}

function validateGermanTax(raw) {
  // Steuernummer: 10-13 digits, various formats per Bundesland
  if (!raw || !raw.trim()) return null;
  var clean = raw.replace(/[\s\/]/g, "");
  if (!/^\d{10,13}$/.test(clean)) return "Steuernummer should be 10-13 digits";
  return "valid";
}

function FieldError(props) {
  var result = props.result;
  var value = props.value;
  if (!value || !value.trim() || result === null) return null;
  if (result === "valid") return (
    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}>
      <span style={{ fontFamily:fMono, fontSize:11, color:L.green }}>✓ Valid</span>
    </div>
  );
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:5, marginTop:3 }}>
      <span style={{ fontFamily:fSans, fontSize:11, color:"#C0392B", lineHeight:1.4 }}>⚠ {result}</span>
    </div>
  );
}

var EU_FEATURES = [
  { icon:"hash",    title:"Sequential Numbering",        badge:"Art. 226 VAT Dir.",  desc:"Every invoice gets a unique unbroken number. InvoiceAI manages the sequence automatically — no gaps, no duplicates." },
  { icon:"reverse", title:"Reverse Charge (Art. 44)",    badge:"Auto-detected",      desc:"Invoicing a VAT-registered client in another EU country? RC is auto-detected, VAT set to 0%, legal text added." },
  { icon:"eu",      title:"VIES VAT Validation",         badge:"Live check",         desc:"Client VAT numbers are validated live against the EU VIES register. Catches invalid numbers before you send — protects your reverse charge." },
  { icon:"bank",    title:"SEPA Bank Transfer",          badge:"ISO 20022",          desc:"Professional SEPA block on every invoice with IBAN validation and payment reference for easy reconciliation." },
  { icon:"shield",  title:"GDPR Notice",                 badge:"Art. 6(1)(b)",       desc:"Auto-adds a legally compliant GDPR data processing notice to every invoice. Best practice for EU B2B." },
  { icon:"clock",   title:"Late Payment Interest",       badge:"EU Dir. 2011/7/EU",  desc:"Statutory interest at 8% above ECB base rate. Your legal right on overdue B2B invoices — added automatically." },
  { icon:"document","title":"Credit Notes",              badge:"Separate numbering", desc:"Legally distinct from invoices in the EU. InvoiceAI manages CN-YYYY-XXX sequences separately." },
  { icon:"send",    title:"E-Invoice XML",               badge:"Coming Q4 2026",     desc:"XRechnung (DE), Factur-X (FR, Sept 2026), KSeF (PL, April 2026), Peppol (BE, live now). Compliant with all current EU mandates." },
  { icon:"eu",      title:"OSS — One Stop Shop",         badge:"B2C digital €10k+",  desc:"Applies to B2C digital services only (not B2B). Once your cross-border B2C revenue exceeds €10,000/year across all EU countries, you must register for OSS instead of charging your home VAT rate. B2B cross-border invoicing uses reverse charge instead." },
  { icon:"hash",    title:"VAT Thresholds by Country",   badge:"10 countries",       desc:"DE €22k, FR €37.5k, NL €20k, PL ~€46k — InvoiceAI shows the small-business threshold for each country so you know when to register." },
  { icon:"reverse", title:"Non-EU Invoicing",            badge:"UK · CH · US",       desc:"Post-Brexit UK and Switzerland are third countries. InvoiceAI adds the correct exemption notice ('service not taxable') for non-EU clients automatically." },
  { icon:"archive", title:"10-Year Archive",             badge:"GoBD · LPF · CAF",   desc:"German GoBD (§147 AO), French LPF, Italian CAF all require 10-year invoice retention. InvoiceAI archives every invoice automatically." },
];

function EUComplianceSection(props) {
  var lang = props.lang || "en";
  var [open, setOpen] = useState(-1);
  return (
    <section style={{ background:L.white, borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, padding:"72px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Pill color={L.blue}>{t(lang,"pillCompliance")||"EU-Native Compliance"}</Pill>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:L.ink, margin:"14px 0 10px", letterSpacing:"-0.025em" }}>
{t(lang,"euTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300, maxWidth:480, margin:"0 auto" }}>
            {t(lang,"euSub")}
          </p>
        </div>
        <div className="desktop-eu-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {EU_FEATURES.map(function(f, i) {
            var isOpen = open === i;
            return (
              <div key={f.title} onClick={function(){ setOpen(isOpen ? -1 : i); }}
                style={{ background:isOpen ? L.cream : L.white, border:"1.5px solid "+(isOpen ? L.accent+"44" : L.border), borderRadius:10, padding:"14px 16px", cursor:"pointer", transition:"background 0.1s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:isOpen ? 8 : 0 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={f.icon} size={13} color={L.accent} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="eu-title" style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink, lineHeight:1.3 }}>{f.title}</div>
                    <div className="eu-badge" style={{ fontFamily:fMono, fontSize:10, color:L.accent, letterSpacing:"0.05em", marginTop:1 }}>{f.badge}</div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, flexShrink:0 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && <p className="eu-desc" style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, margin:0, fontWeight:300, paddingTop:8, borderTop:"1px solid "+L.borderLt }}>{f.desc}</p>}
              </div>
            );
          })}
        </div>
        <div style={{ background:L.ink, borderRadius:14, padding:"22px 28px", marginTop:20, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <Icon name="archive" size={24} color={L.accentLt} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fSerif, fontSize:16, fontWeight:700, color:L.paper, marginBottom:3 }}>10-Year Invoice Archive</div>
            <div style={{ fontFamily:fSans, fontSize:14, color:"rgba(245,240,232,0.5)", fontWeight:300 }}>
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
  var [showAll, setShowAll] = useState(false);
  var featured = REVIEWS.slice(0, 3);
  var extra = REVIEWS.slice(3);
  return (
    <section style={{ background:L.cream, borderBottom:"1px solid "+L.border, padding:"88px 0 72px" }}>
      <div style={{ textAlign:"center", marginBottom:32, padding:"0 24px" }}>
        <Pill color={L.gold}>{t(lang,"pillReviews")||"Reviews"}</Pill>
        <h2 style={{ fontFamily:fSerif, fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, color:L.ink, margin:"14px 0 8px", letterSpacing:"-0.025em" }}>
{t(lang,"reviewsTitle")}
        </h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:4 }}>
          <Stars n={5} size={14} />
          <span style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>4.9</span>
          <span style={{ fontFamily:fMono, fontSize:12, color:L.muted }}>from 340+ reviews</span>
        </div>
      </div>

      {/* Desktop: 3-col grid */}
      <div className="reviews-desktop" style={{ display:"none", maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
          {featured.map(function(r) {
            return (
              <div key={r.id} style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:14, padding:"20px 20px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:r.col+"22", border:"1.5px solid "+r.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:r.col, fontWeight:500, flexShrink:0 }}>{r.av}</div>
                    <div>
                      <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{r.name}</div>
                      <div style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{r.role} · {r.city}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.platform}</span>
                </div>
                <Stars n={r.rating} size={12} />
                <p style={{ fontFamily:fSans, fontSize:15, color:L.ink, lineHeight:1.65, margin:0, fontStyle:"italic", flex:1 }}>"{r.text}"</p>
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid "+L.borderLt }}>
                  <span style={{ fontFamily:fMono, fontSize:10, color:L.green }}>✓ Verified</span>
                  <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.helpful} helpful</span>
                </div>
              </div>
            );
          })}
        </div>
        {showAll && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
            {extra.map(function(r) {
              return (
                <div key={r.id} style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:14, padding:"20px 20px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:r.col+"22", border:"1.5px solid "+r.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:r.col, fontWeight:500, flexShrink:0 }}>{r.av}</div>
                      <div>
                        <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{r.name}</div>
                        <div style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{r.role} · {r.city}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.platform}</span>
                  </div>
                  <Stars n={r.rating} size={12} />
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.ink, lineHeight:1.65, margin:0, fontStyle:"italic", flex:1 }}>"{r.text}"</p>
                  <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid "+L.borderLt }}>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.green }}>✓ Verified</span>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.helpful} helpful</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ textAlign:"center" }}>
          <button onClick={function(){ setShowAll(function(s){ return !s; }); }} style={{ background:"transparent", border:"1.5px solid "+L.border, borderRadius:8, padding:"9px 24px", cursor:"pointer", fontFamily:fSans, fontSize:15, color:L.muted }}>
            {showAll ? "Show less ▲" : "Show all " + REVIEWS.length + " reviews ▼"}
          </button>
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="reviews-mobile" style={{ overflowX:"hidden" }}>
        <div style={{ overflowX:"auto", paddingBottom:8, WebkitOverflowScrolling:"touch", marginRight:"-1px" }}>
          <div style={{ display:"flex", gap:12, padding:"4px 16px 8px", width:"max-content" }}>
            {REVIEWS.map(function(r, i) {
              var isFeat = i < 3;
              return (
                <div key={r.id} style={{ background:L.white, border:"1.5px solid "+(isFeat ? L.accent+"33" : L.border), borderRadius:14, padding:"18px 18px 14px", width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:r.col+"22", border:"1.5px solid "+r.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:13, color:r.col, fontWeight:500, flexShrink:0 }}>{r.av}</div>
                      <div>
                        <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{r.name}</div>
                        <div style={{ fontFamily:fMono, fontSize:11, color:L.muted }}>{r.role} · {r.city}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.platform}</span>
                  </div>
                  <Stars n={r.rating} size={11} />
                  <p style={{ fontFamily:fSans, fontSize:14, color:L.ink, lineHeight:1.6, margin:0, fontStyle:"italic", flex:1 }}>"{r.text}"</p>
                  <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid "+L.borderLt }}>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.green }}>✓ Verified</span>
                    <span style={{ fontFamily:fMono, fontSize:10, color:L.faint }}>{r.helpful} helpful</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:12 }}>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}>← scroll for more →</span>
        </div>
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
  var [checkoutLoading, setCheckoutLoading] = useState(null);

  function startCheckout(planName) {
    setCheckoutLoading(planName);
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planName.toLowerCase() }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      setCheckoutLoading(null);
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not set up yet — fall back to waitlist modal
        openModal("pricing-" + planName.toLowerCase());
      }
    })
    .catch(function() {
      setCheckoutLoading(null);
      openModal("pricing-" + planName.toLowerCase());
    });
  }
  return (
    <section style={{ background:embedded ? L.paper : L.white, padding:"72px 24px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <Pill color={L.gold}>{t(lang,"pillPricing")||"Pricing"}</Pill>
          <h2 style={{ fontFamily:fSerif, fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:L.ink, margin:"14px 0 10px", letterSpacing:"-0.025em" }}>
{t(lang,"pricingTitle")}
          </h2>
          <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300 }}>{t(lang,"pricingSub")}</p>
        </div>
        <div className="pricing-scroll desktop-pricing" style={{ display:"flex", gap:12, overflowX:"auto", overflowY:"visible", WebkitOverflowScrolling:"touch", paddingBottom:16, paddingTop:20, paddingLeft:4, paddingRight:4 }}>
          {PLANS.map(function(plan) {
            return (
              <div key={plan.name} style={{ background:plan.hi ? L.accent : L.white, border:plan.hi ? "2px solid "+L.accent : "1.5px solid "+L.border, borderRadius:16, padding:"26px 22px", flex:"0 0 280px", minWidth:280, position:"relative", boxShadow:plan.hi ? "0 12px 36px rgba(200,80,42,0.25)" : "none" }}>
                {plan.badge && (
                  <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:L.gold, color:"#fff", padding:"4px 16px", borderRadius:99, fontFamily:fMono, fontSize:11, letterSpacing:"0.08em", whiteSpace:"nowrap", boxShadow:"0 2px 8px rgba(154,120,32,0.3)" }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontFamily:fMono, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", color:plan.hi ? "rgba(255,255,255,0.7)" : L.muted, marginBottom:12 }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:3, marginBottom:22 }}>
                  <span style={{ fontFamily:fSerif, fontSize:40, fontWeight:900, color:plan.hi ? "#fff" : L.ink, lineHeight:1 }}>{"€"+plan.price}</span>
                  <span style={{ fontFamily:fSans, fontSize:15, color:plan.hi ? "rgba(255,255,255,0.55)" : L.muted }}>/mo</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                  {plan.features.map(function(f) {
                    return (
                      <div key={f} style={{ display:"flex", gap:8, fontFamily:fSans, fontSize:14, color:plan.hi ? "rgba(255,255,255,0.8)" : L.ink, lineHeight:1.4 }}>
                        <Icon name="check" size={13} color={plan.hi ? "rgba(255,255,255,0.7)" : L.green} />
                        {f}
                      </div>
                    );
                  })}
                </div>
                <button onClick={function(){ startCheckout(plan.name); }} disabled={checkoutLoading === plan.name.toLowerCase()} style={{ width:"100%", background:plan.hi ? "rgba(255,255,255,0.15)" : L.accent, color:"#fff", border:plan.hi ? "1.5px solid rgba(255,255,255,0.3)" : "none", padding:"12px 0", borderRadius:9, cursor:checkoutLoading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:15, fontWeight:500, opacity:checkoutLoading === plan.name.toLowerCase() ? 0.7 : 1 }}>
                  {checkoutLoading === plan.name.toLowerCase() ? "Loading…" : t(lang,"pricingCta")}
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

// Industry-specific proposal structures — what sections matter per project type
var PROJ_TEMPLATES = {
  "Brand Identity":      { sections:["Brand discovery & strategy","Visual identity system","Deliverables (logo, palette, typography, guidelines)","Revision rounds","File formats & handoff"], note:"Mention brand workshops and mood board phase. Emphasise longevity and consistency across touchpoints." },
  "Logo Design":         { sections:["Discovery brief","Concept directions (x3)","Refinement rounds","Final files (SVG, PNG, dark/light variants)"], note:"Emphasise uniqueness and trademark readiness. Mention what is NOT included (full brand identity) unless scoped." },
  "UX/UI Design":        { sections:["User research & personas","Information architecture","Wireframes","High-fidelity designs","Handoff to development (Figma)"], note:"Mention accessibility compliance (WCAG 2.1). Stress collaboration with dev team." },
  "Web Development":     { sections:["Technical scoping","Design integration","Development sprints","Testing & QA","Launch & handover"], note:"Specify tech stack. Include maintenance terms. Mention GDPR compliance for EU clients." },
  "App Design":          { sections:["Product discovery","User flows","Prototype","UI design system","Developer handoff"], note:"Mention platform (iOS/Android/cross-platform). Include number of screens in scope." },
  "Software Consulting": { sections:["Current state assessment","Recommendations report","Implementation roadmap","Stakeholder workshops"], note:"Position as strategic advisor. Emphasise ROI and risk reduction. Formal tone recommended." },
  "Motion Design":       { sections:["Concept & storyboard","Style frames","Animation production","Revisions","Final export formats"], note:"Specify frame rate, duration and delivery format (MP4, GIF, Lottie). Mention music/sound licensing." },
  "Copywriting":         { sections:["Brand voice alignment","Research & interviews","Draft delivery","Revision rounds","Final copy files"], note:"Specify word count and number of pages/assets. Mention SEO if relevant." },
  "Strategy":            { sections:["Stakeholder interviews","Market & competitor analysis","Strategic framework","Presentation & workshop","Written report"], note:"Position as executive-level work. Justify price with business impact framing." },
  "Pitch Deck":          { sections:["Narrative structure","Slide design","Data visualisation","Investor-ready polish","Source files"], note:"Mention number of slides. Emphasise storytelling. Formal tone strongly recommended for investor audiences." },
};

// Country-aware communication norms
var COUNTRY_TONE = {
  "DE": "German business communication is direct and structured. Use Sie (formal address). Be precise and factual. Avoid enthusiasm or hyperbole. Credentials and process matter. Do not start with small talk.",
  "AT": "Austrian business communication is similar to German but slightly warmer. Use Sie. Be formal but not cold. Quality and craft are valued over speed.",
  "CH": "Swiss business communication values precision, neutrality and understatement. Use Sie. Be concise. Avoid overpromising. Multilingual context — keep language simple.",
  "FR": "French business communication values sophistication and logic. A formal but elegant tone works well. Demonstrate cultural awareness. Avoid being too direct about price — frame investment value first.",
  "IT": "Italian business culture values relationships and aesthetics. A warm but professional tone. Show appreciation for design quality. Personal connection before business.",
  "ES": "Spanish business communication is warm and relationship-oriented. Show enthusiasm for the project. Be personable while remaining professional.",
  "NL": "Dutch business communication is direct, practical and egalitarian. Get to the point. Avoid corporate filler. Honesty and transparency are valued over politeness.",
  "BE": "Belgian business communication varies by region. Generally formal and process-oriented. Bilingual context (FR/NL) — keep language clear and neutral.",
  "PL": "Polish business communication is formal and hierarchical. Use titles where known. Be thorough and detailed. Demonstrate reliability and experience.",
  "HU": "Hungarian business communication is formal and structured. Respect hierarchy. Be precise about deliverables and timelines. Quality over speed.",
  "SE": "Swedish business culture is egalitarian, informal and consensus-driven. First names are standard even in business. Be collaborative, not hierarchical.",
  "DK": "Danish business communication is direct, informal and trust-based. Short sentences, no fluff. Sustainability and ethics resonate.",
  "default": "Professional, clear and client-focused. Adapt to the client's apparent communication style."
};

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
  var yr = new Date().getFullYear();
  var invNum = s.invNum || ((s.country ? s.country.code : "DE") + "-" + yr + "-001");
  var cnNum = "CN-" + yr + "-001";
  var [xrLoading, setXrLoading] = useState(false);
  var [xrError, setXrError] = useState("");
  var [navLoading, setNavLoading] = useState(false);
  var [navError, setNavError] = useState("");

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
  var [shareLoading, setShareLoading] = useState(false);
  var [shareUrl, setShareUrl] = useState("");
  var [shareCopied, setShareCopied] = useState(false);

  function shareInvoice() {
    setShareLoading(true); setShareUrl(""); setShareCopied(false);
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
        var url = "https://invoice-ai.de/portal?id=" + data.id;
        setShareUrl(url);
        navigator.clipboard.writeText(url).then(function(){ setShareCopied(true); }).catch(function(){});
      } else {
        setShareUrl("error");
      }
      setShareLoading(false);
    })
    .catch(function() { setShareUrl("error"); setShareLoading(false); });
  }

  return (
    <div style={{ padding:"0 24px 48px", maxWidth:960, margin:"0 auto" }}>
      <button onClick={function(){ setView("form"); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontFamily:fMono, fontSize:11, letterSpacing:"0.06em", marginBottom:14, padding:0 }}>
        ← Back to form
      </button>
      <div style={{ display:"flex", gap:8, marginBottom:8, maxWidth:580 }}>
        <button onClick={function(){ window.print(); }} style={{ flex:1, background:L.ink, color:"#fff", border:"none", padding:"9px 12px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon name="download" size={13} color="#fff" />
          Export PDF
        </button>
        <button onClick={exportXRechnung} disabled={xrLoading} style={{ flex:1, background:xrLoading ? L.border : "#1A3A5C", color:"#fff", border:"none", padding:"9px 12px", borderRadius:7, cursor:xrLoading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon name="document" size={13} color="#fff" />
          {xrLoading ? "…" : "XRechnung XML"}
        </button>
        <button onClick={shareInvoice} disabled={shareLoading} style={{ flex:1, background:shareLoading ? L.border : L.accent, color:shareLoading ? L.muted : "#fff", border:"none", padding:"9px 12px", borderRadius:7, cursor:shareLoading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon name="send" size={13} color={shareLoading ? L.muted : "#fff"} />
          {shareLoading ? "…" : "Share"}
        </button>
      </div>
      {shareUrl && shareUrl !== "error" && (
        <div style={{ background:L.greenGlow, border:"1px solid "+L.green+"44", borderRadius:8, padding:"10px 14px", marginBottom:8, maxWidth:580, display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="check" size={13} color={L.green} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fMono, fontSize:11, color:L.green, letterSpacing:"0.06em", marginBottom:2 }}>{shareCopied ? "✓ Link copied to clipboard" : "Link ready"}</div>
            <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, wordBreak:"break-all" }}>{shareUrl}</div>
          </div>
          <button onClick={function(){ navigator.clipboard.writeText(shareUrl).then(function(){ setShareCopied(true); }); }} style={{ background:"transparent", border:"1px solid "+L.green+"55", borderRadius:5, padding:"4px 9px", cursor:"pointer", fontFamily:fMono, fontSize:11, color:L.green, flexShrink:0 }}>
            Copy
          </button>
        </div>
      )}
      {shareUrl === "error" && (
        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"9px 14px", marginBottom:8, maxWidth:580, fontFamily:fSans, fontSize:13, color:"#C0392B" }}>
          Share failed — check that Supabase is configured in Vercel env vars.
        </div>
      )}
      {s.country && s.country.code === "HU" && (
        <div style={{ marginBottom:8 }}>
          <button onClick={exportNAV} disabled={navLoading} style={{ width:"100%", background:navLoading ? L.border : "#2A5E3A", color:"#fff", border:"none", padding:"10px 12px", borderRadius:7, cursor:navLoading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:13, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icon name="document" size={13} color="#fff" />
            {navLoading ? "Generating…" : "NAV XML — Hungarian tax reporting"}
          </button>
          {navError && <p style={{ fontFamily:fSans, fontSize:13, color:L.accent, marginTop:4 }}>{navError}</p>}
          <p style={{ fontFamily:fMono, fontSize:11, color:L.muted, marginTop:5, letterSpacing:"0.04em" }}>
            Upload to onlineszamla.nav.gov.hu after issuing. Required for domestic HU invoices.
          </p>
        </div>
      )}
      {xrError && <p style={{ fontFamily:fSans, fontSize:13, color:L.accent, marginBottom:10 }}>XRechnung error: {xrError}</p>}
      <div id="print-invoice" style={{ background:L.white, border:"1px solid "+L.border, borderRadius:14, padding:"36px 40px", boxShadow:"0 8px 32px rgba(10,10,15,0.08)" }}>
        {s.creditNote && (
          <div style={{ background:L.goldGlow, border:"1.5px solid "+L.gold+"55", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="document" size={14} color={L.gold} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.gold, letterSpacing:"0.08em", textTransform:"uppercase" }}>Credit Note · {cnNum} · Ref: {invNum}</span>
          </div>
        )}
        {s.eInvoice && (
          <div style={{ background:L.blueGlow, border:"1.5px solid "+L.blue+"44", borderRadius:7, padding:"6px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="send" size={14} color={L.blue} />
            <span style={{ fontFamily:fMono, fontSize:11, color:L.blue, letterSpacing:"0.07em" }}>
              {s.country && s.country.code === "DE" ? "XRechnung 3.0" : s.country && s.country.code === "FR" ? "Factur-X 1.0" : s.country && s.country.code === "IT" ? "XML/SDI" : "EN16931"} · EU e-invoice
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div>
            <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:900, color:s.creditNote ? L.gold : L.ink, letterSpacing:"-0.02em" }}>{s.creditNote ? "CREDIT NOTE" : "INVOICE"}</div>
            <div style={{ fontFamily:fMono, fontSize:12, color:L.muted, marginTop:2 }}>No. {s.creditNote ? cnNum : invNum}</div>
            {s.projRef && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted, marginTop:3, fontStyle:"italic" }}>Re: {s.projRef}</div>}
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink }}>{s.sName}</div>
            {s.sStreet && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted }}>{s.sStreet}</div>}
            {s.sCity && <div style={{ fontFamily:fSans, fontSize:12, color:L.muted }}>{s.sCity}</div>}
            {s.vatExempt
              ? <div style={{ fontFamily:fMono, fontSize:11, color:L.gold }}>VAT-exempt · §19 UStG</div>
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
            <p style={{ fontFamily:fSans, fontSize:13, color:L.blue, margin:0 }}>Reverse charge — VAT liability transfers to the recipient (Art. 44 EU VAT Dir. 2006/112/EC)</p>
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
              <strong>Export / Third country:</strong> Service not subject to VAT per §3a UStG. No VAT charged — exempt export. Include reference: "Leistungsort nicht im Inland."
            </p>
          </div>
        )}
        {s.vatExempt && (
          <div style={{ background:L.goldGlow, border:"1px solid "+L.gold+"33", borderRadius:6, padding:"7px 10px", marginBottom:14 }}>
            <p style={{ fontFamily:fSans, fontSize:13, color:L.gold, margin:0 }}>Kein Umsatzsteuerausweis gemäß §19 UStG (Kleinunternehmerregelung)</p>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:4 }}>Bill To</div>
          <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{s.cName}</div>
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
                  <td style={{ fontFamily:fSans, fontSize:14, color:L.ink, padding:"8px 0" }}>{l.desc}</td>
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
                <span>Discount {s.discount}%</span><span style={{ fontFamily:fMono }}>{"−"+sym+discAmt.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.muted, padding:"2px 0" }}>
              <span>{s.vatExempt ? "VAT (exempt)" : "VAT "+vatRate+"%"+(s.rc?" (RC)":"")}</span>
              <span style={{ fontFamily:fMono }}>{s.vatExempt ? "—" : sym+vatAmt.toFixed(2)}</span>
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
        {s.gdpr && <p style={{ marginTop:10, fontFamily:fSans, fontSize:11, color:L.muted, borderTop:"1px solid "+L.border, paddingTop:8 }}>Your personal data is processed for invoicing purposes in accordance with GDPR Art. 6(1)(b) — EU Regulation 2016/679.</p>}
        {s.latePayment && (
          <div style={{ background:"rgba(200,80,42,0.06)", border:"1px solid "+L.accent+"33", borderRadius:6, padding:"8px 12px", marginTop:10 }}>
            <p style={{ fontFamily:fSans, fontSize:11, color:L.accent, margin:0, lineHeight:1.55 }}>
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
        <label onClick={function(){ if(!blocked) onChange(!checked); }} style={{ fontFamily:fSans, fontSize:14, color:L.ink, cursor:blocked ? "not-allowed" : "pointer", flex:1 }}>{label}</label>
        <span style={{ fontFamily:fMono, fontSize:10, color:badgeColor, background:badgeColor+"15", border:"1px solid "+badgeColor+"33", borderRadius:4, padding:"1px 6px", letterSpacing:"0.05em", flexShrink:0 }}>{badge}</span>
        <button onClick={onInfo} style={{ width:16, height:16, borderRadius:"50%", background:infoOpen ? L.accent : L.sand, border:"1px solid "+(infoOpen ? L.accent : L.border), color:infoOpen ? "#fff" : L.muted, fontFamily:fMono, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>?</button>
      </div>
      {blocked && <p style={{ fontFamily:fSans, fontSize:12, color:L.faint, margin:"2px 0 4px 22px" }}>{blockedReason}</p>}
      {warn && checked && <p style={{ fontFamily:fSans, fontSize:12, color:L.gold, margin:"2px 0 4px 22px" }}>⚠ {warn}</p>}
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

function InvoiceForm(props) {
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

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"6px 9px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.white, outline:"none" };
  var monoStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"6px 9px", fontFamily:fMono, fontSize:13, color:L.ink, background:L.white, outline:"none" };
  var lblStyle = { display:"block", marginBottom:3, fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  function cardWrap(title, badge, content) {
    return (
      <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:12, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>{title}</span>
          {badge}
        </div>
        <div style={{ padding:"16px 16px" }}>{content}</div>
      </div>
    );
  }

  return (
    <div className="inv-grid desktop-inv" style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 260px", gap:14, padding:"22px 24px 48px" }}>
      <div>
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
            <div><label style={lblStyle}>City</label><input value={s.sCity} onChange={function(e){ u("sCity",e.target.value); }} placeholder="e.g. 80802 München" style={inpStyle} /></div>
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
              <p style={{ fontFamily:fSans, fontSize:12, color:L.accent, margin:"3px 0 0" }}>⚠ VAT number not found in EU VIES — reverse charge may not be valid. Verify before sending.</p>
            )}
            {s.rc && (
              <div style={{ background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:6, padding:"7px 10px", marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="reverse" size={12} color={L.blue} />
                <p style={{ fontFamily:fSans, fontSize:13, color:L.blue, margin:0 }}>Reverse charge auto-detected — VAT 0%</p>
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
                  <button onClick={function(){ remLine(line.id); }} style={{ background:"none", border:"none", color:L.muted, cursor:"pointer", fontSize:14, padding:0 }}>×</button>
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
                  <span style={{ fontFamily:fMono, fontSize:13, color:L.green }}>{"−"+sym+discAmt.toFixed(2)}</span>
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
                {EU.filter(function(c){ return !c.eu; }).map(function(c) { return <option key={c.code+c.name} value={c.code}>{c.name+" (0% — export)"}</option>; })}
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
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:12, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}>
            <span style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>EU Compliance</span>
          </div>
          <div style={{ padding:"16px 16px", display:"flex", flexDirection:"column", gap:4 }}>
            <CheckRow checked={s.rc} onChange={function(v){ u("rc",v); }} label="Reverse Charge" badge="Art.44" badgeColor={L.blue} blocked={(sameCountry && !s.cVAT) || s.vatExempt} blockedReason={s.vatExempt ? "Kleinunternehmer cannot apply reverse charge — no VAT number issued under §19 UStG" : "Same country — RC only applies cross-border EU B2B"} warn={viesStatus === "invalid" ? "VIES could not verify this VAT number — confirm B2B status before applying reverse charge" : null} infoOpen={activeInfo==="rc"} onInfo={function(){ setActiveInfo(activeInfo==="rc"?null:"rc"); }} infoWhat="Reverse charge means your client pays the VAT to their tax authority instead of you collecting it." infoWhen="Tick when invoicing a VAT-registered business in a DIFFERENT EU country (B2B cross-border). Auto-detected when you enter client VAT number." infoEffect="Sets VAT to 0% and adds required legal text (Art. 44 EU VAT Directive)." infoLaw="Art. 44 EU VAT Directive 2006/112/EC" />
            <CheckRow checked={s.gdpr} onChange={function(v){ u("gdpr",v); }} label="GDPR Notice" badge="GDPR" badgeColor={L.green} blocked={false} blockedReason="" warn={null} infoOpen={activeInfo==="gdpr"} onInfo={function(){ setActiveInfo(activeInfo==="gdpr"?null:"gdpr"); }} infoWhat="A short legal notice that you process your client's personal data for invoicing purposes." infoWhen="Recommended for all EU B2B invoices — it shows you take data protection seriously." infoEffect="Adds one sentence to the bottom of your invoice referencing GDPR Art. 6(1)(b)." infoLaw="GDPR Art. 6(1)(b) — EU Regulation 2016/679" />
            <CheckRow checked={s.latePayment} onChange={function(v){ u("latePayment",v); }} label="Late Payment Interest" badge="EU 2011/7" badgeColor={L.accent} blocked={s.creditNote} blockedReason="Cannot charge interest on a credit note" warn={null} infoOpen={activeInfo==="lp"} onInfo={function(){ setActiveInfo(activeInfo==="lp"?null:"lp"); }} infoWhat="EU law gives you the right to charge statutory interest if a B2B client pays late." infoWhen="Tick for B2B invoices where you want to signal late payment will incur interest." infoEffect="Adds a notice: 8% above ECB base rate applies on overdue amounts from due date." infoLaw="EU Directive 2011/7/EU on combating late payment" />
            <CheckRow checked={s.creditNote} onChange={function(v){ u("creditNote",v); }} label="Credit Note" badge={"CN-"+new Date().getFullYear()+"-001"} badgeColor={L.gold} blocked={s.latePayment} blockedReason="Disable late payment interest first" warn={null} infoOpen={activeInfo==="cn"} onInfo={function(){ setActiveInfo(activeInfo==="cn"?null:"cn"); }} infoWhat="A credit note cancels or corrects a previous invoice, or issues a credit/refund." infoWhen="Use when correcting a sent invoice, issuing a refund, or applying a retroactive discount." infoEffect="Changes document type to CREDIT NOTE with a separate sequential number (CN-YYYY-XXX)." infoLaw="Art. 226 EU VAT Directive — separate number sequence required" />
            <CheckRow checked={s.vatExempt} onChange={function(v){ u("vatExempt",v); }} label="VAT Exempt" badge="§19 UStG" badgeColor={L.gold} blocked={s.rc} blockedReason="Disable reverse charge first" warn={null} infoOpen={activeInfo==="ve"} onInfo={function(){ setActiveInfo(activeInfo==="ve"?null:"ve"); }} infoWhat="If your revenue is below a threshold you may not need to charge VAT at all." infoWhen="Only tick if registered under a small business exemption AND below the revenue threshold. Verify with your accountant." infoEffect="Removes VAT line entirely and adds the legally required exemption notice." infoLaw="§19 UStG (Germany) · Art. 293B CGI (France) · varies by country" />
            <CheckRow checked={s.eInvoice} onChange={function(v){ u("eInvoice",v); }} label="E-Invoice XML" badge={s.country && s.country.code==="DE" ? "XRechnung" : s.country && s.country.code==="FR" ? "Factur-X" : s.country && s.country.code==="IT" ? "XML/SDI" : "EN16931"} badgeColor={L.blue} blocked={false} blockedReason="" warn={s.creditNote ? "Credit notes use a different XML schema (type 381 vs 380)" : null} infoOpen={activeInfo==="ei"} onInfo={function(){ setActiveInfo(activeInfo==="ei"?null:"ei"); }} infoWhat="Structured XML invoices readable by accounting software. Mandatory in Italy, upcoming in Germany and France." infoWhen="Use if your client is a public authority (required) or their accounting software supports XML import." infoEffect="Marks your invoice as e-invoice compliant. Full XML export coming Q4 2026." infoLaw="EU Directive 2014/55/EU · EN16931 · XRechnung 3.0" />
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
                {errs.map(function(e) { return <div key={e} style={{ fontFamily:fSans, fontSize:12, color:"#C0392B" }}>· {e}</div>; })}
              </div>
            );
            return null;
          })()}
        </div>
        <button onClick={function(){ setView("preview"); }} style={{ width:"100%", background:L.accent, color:"#fff", border:"none", padding:"12px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 16px rgba(200,80,42,0.25)" }}>
          Preview Invoice →
        </button>
      </div>
      <div style={{ position:"sticky", top:72, alignSelf:"start" }}>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, padding:"12px 14px" }}>
          <p style={{ fontFamily:fMono, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:8 }}>EU Compliance</p>
          {[
            { i:"eu",       l:"Country",        sub:(s.country?s.country.name:"Germany")+" · VAT "+(s.country?s.country.vat:19)+"%", ok:true },
            { i:"bank",     l:"SEPA",           sub:s.sIBAN ? "IBAN provided" : "⚠ Missing",      ok:!!s.sIBAN },
            { i:"reverse",  l:"Reverse Charge", sub:s.rc ? "Active (0%)" : sameCountry ? "N/A same country" : "Standard", ok:s.rc },
            { i:"shield",   l:"GDPR Notice",    sub:s.gdpr ? "Included" : "Off",                   ok:s.gdpr },
            { i:"hash",     l:"Invoice No.",    sub:s.creditNote ? "CN-"+new Date().getFullYear()+"-001" : (s.invNum || (s.country?s.country.code:"DE")+"-"+new Date().getFullYear()+"-001"), ok:true },
            { i:"clock",    l:"Late Payment",   sub:s.latePayment ? "8% ECB+rate" : "Off",         ok:s.latePayment },
            { i:"document", l:"Document Type",  sub:s.creditNote ? "Credit Note" : s.vatExempt ? "VAT-Exempt" : "Standard Invoice", ok:true },
            { i:"send",     l:"E-Invoice",      sub:s.eInvoice ? "Active" : "PDF only",            ok:s.eInvoice },
          ].map(function(r) {
            return (
              <div key={r.l} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <Icon name={r.i} size={13} color={L.muted} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:13, color:L.ink, fontWeight:500 }}>{r.l}</div>
                  <div style={{ fontFamily:fMono, fontSize:10, color:r.ok ? L.green : L.muted }}>{r.sub}</div>
                </div>
                <span style={{ color:r.ok ? L.green : L.faint, fontSize:12 }}>{r.ok ? "✓" : "—"}</span>
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

  var inpStyle = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"7px 10px", fontFamily:"'Inter',sans-serif", fontSize:15, color:L.ink, background:L.white, outline:"none" };
  var lblStyle = { display:"block", marginBottom:4, fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

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
      <div style={{ fontFamily:"'Inter',sans-serif" }}>
        {text.split("\n").map(function(line, i) {
          if (line === "---") return <hr key={i} style={{ border:"none", borderTop:"1px solid "+L.border, margin:"16px 0" }} />;
          if (line.startsWith("## ")) return <h3 key={i} style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:L.ink, margin:"20px 0 8px" }}>{line.slice(3)}</h3>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, color:L.ink, fontSize:14, margin:"8px 0 4px" }}>{line.slice(2,-2)}</p>;
          if (line.startsWith("- ")) return <div key={i} style={{ display:"flex", gap:10, margin:"3px 0", paddingLeft:4, color:L.muted, fontSize:15, lineHeight:1.6 }}><span style={{ color:L.accent, flexShrink:0 }}>·</span><span>{line.slice(2)}</span></div>;
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
    <div className="prop-grid desktop-prop" style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px 56px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
      <div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:L.ink, marginBottom:4 }}>{t(lang,"propTitle")}</h2>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15, color:L.muted, marginBottom:20, fontWeight:300 }}>{t(lang,"propSub")}</p>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Client</span></div>
          <div style={{ padding:"16px 16px" }}>
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
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:L.accent, marginTop:5, lineHeight:1.5, letterSpacing:"0.02em" }}>
                  {COUNTRY_TONE[clientCountry].split(".")[0] + "."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Project</span></div>
          <div style={{ padding:"16px 16px" }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
              {PROJ_TYPES.slice(0,8).map(function(t) {
                return <button key={t} onClick={function(){ setProjType(t); }} style={{ background:projType===t ? L.accent : L.paper, color:projType===t ? "#fff" : L.muted, border:"1.5px solid "+(projType===t ? L.accent : L.border), borderRadius:99, padding:"4px 11px", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13 }}>{t}</button>;
              })}
            </div>
            {projType && PROJ_TEMPLATES[projType] && (
              <div style={{ background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:7, padding:"8px 10px", marginBottom:10 }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:L.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Template: {projType}</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:L.muted, lineHeight:1.5 }}>
                  {PROJ_TEMPLATES[projType].sections.join(" → ")}
                </div>
              </div>
            )}
            <label style={lblStyle}>Brief *</label>
            <textarea value={projDesc} onChange={function(e){ setProjDesc(e.target.value); }} placeholder="Describe the project and what the client needs. The more context, the better the proposal." rows={4} style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:6, padding:"8px 10px", fontFamily:"'Inter',sans-serif", fontSize:15, color:L.ink, background:L.white, outline:"none", resize:"vertical", lineHeight:1.55 }} />
          </div>
        </div>
        <div style={{ background:L.white, border:"1.5px solid "+L.border, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Scope</span></div>
          <div style={{ padding:"16px 16px" }}>
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
          <div style={{ padding:"12px 16px", background:L.cream, borderBottom:"1px solid "+L.border }}><span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted }}>Tone</span></div>
          <div style={{ padding:"16px 16px" }}>
            <div style={{ display:"flex", gap:6 }}>
              {[["direct","Direct & confident"],["warm","Warm & personal"],["formal","Formal & precise"]].map(function(pair) {
                var v = pair[0]; var lb = pair[1];
                return <button key={v} onClick={function(){ setTone(v); }} style={{ flex:1, background:tone===v ? L.ink : L.paper, color:tone===v ? L.paper : L.muted, border:"1.5px solid "+(tone===v ? L.ink : L.border), borderRadius:7, padding:"7px 6px", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:tone===v ? 500 : 400 }}>{lb}</button>;
              })}
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={loading || !projDesc.trim()} style={{ width:"100%", background:projDesc.trim() && !loading ? L.accent : L.border, color:projDesc.trim() && !loading ? "#fff" : L.muted, border:"none", padding:"13px", borderRadius:9, cursor:projDesc.trim() && !loading ? "pointer" : "not-allowed", fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, boxShadow:projDesc.trim() && !loading ? "0 4px 16px rgba(200,80,42,0.25)" : "none" }}>
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
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:L.muted, marginLeft:5 }}>Writing…</span>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:L.green, letterSpacing:"0.08em" }}>{t(lang,"propReady")}</span>
                  {result && (
                    <>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:L.faint }}>{result.split(/\s+/).filter(Boolean).length} words</span>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:L.faint }}>{Math.ceil(result.split(/\s+/).filter(Boolean).length / 200)} min read</span>
                    </>
                  )}
                </div>
              )}
              {result && !loading && (
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={function(){ setResult(""); }} style={{ background:"none", border:"1px solid "+L.border, color:L.muted, padding:"3px 9px", borderRadius:5, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12 }}>↺ Redo</button>
                  <button onClick={function(){ window.print(); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"3px 11px", borderRadius:5, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:12 }}>Export PDF ↓</button>
                </div>
              )}
            </div>
            <div id="print-proposal" style={{ padding:"22px 24px", maxHeight:"60vh", overflowY:"auto" }}>
              {result && !loading && renderProposal(result)}
            </div>
            {result && !loading && (
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+L.border, display:"flex", gap:6, flexWrap:"wrap", background:L.cream }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:L.muted, alignSelf:"center" }}>Refine:</span>
                {[["Make it shorter","Cut this proposal to under 180 words. Keep the structure but be ruthless."],["More formal","Rewrite in a more formal, corporate tone suitable for a large enterprise client."],["Add case studies","Add a brief 'Why us' section mentioning 2 relevant past projects with outcomes."],["Stronger close","Rewrite the closing paragraph to be more confident and create a clear next step."]].map(function(pair) {
                  return (
                    <button key={pair[0]} onClick={function(){ refine(pair[1]); }} disabled={loading} style={{ background:L.white, border:"1px solid "+L.border, color:loading ? L.faint : L.muted, padding:"3px 9px", borderRadius:99, cursor:loading ? "not-allowed" : "pointer", fontFamily:"'Inter',sans-serif", fontSize:12 }}>
                      {pair[0]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:L.faint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Example proposal</p>
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
  var [mode, setMode] = useState("invoice");
  var [view, setView] = useState("form");

  var defaultInvState = {
    country:EU[0], terms:"30", rc:false, gdpr:true, latePayment:false, creditNote:false, vatExempt:false, eInvoice:false, discount:"", projRef:"",
    invNum:"DE-" + new Date().getFullYear() + "-001",
    sName:"Your Name / Studio", sVAT:"", sIBAN:"", sBIC:"", sStreet:"Your Street", sCity:"Your City",
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
      <div style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ display:"inline-flex", gap:4, background:L.cream, borderRadius:10, padding:"4px", border:"1px solid "+L.border }}>
          {[["invoice","Create an Invoice"],["proposal","Write a Proposal"]].map(function(pair) {
            var m = pair[0]; var lb = pair[1];
            return (
              <button key={m} onClick={function(){ setMode(m); setView("form"); }} style={{ background:mode===m ? L.white : "transparent", color:mode===m ? L.ink : L.muted, border:"none", borderRadius:7, padding:"8px 22px", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:mode===m ? 500 : 400, whiteSpace:"nowrap", boxShadow:mode===m ? "0 1px 4px rgba(26,31,46,0.1)" : "none", transition:"all 0.12s" }}>
                {lb}
              </button>
            );
          })}
        </div>
      </div>
      {mode==="invoice" && (
        <div style={{ background:L.white, borderBottom:"1px solid "+L.border, padding:"0 20px", display:"flex", gap:4, height:38, alignItems:"center" }}>
          {[["form","Form"],["preview","Preview"]].map(function(pair) {
            var v = pair[0]; var lb = pair[1];
            return <button key={v} onClick={function(){ setView(v); }} style={{ background:view===v ? L.ink : "transparent", color:view===v ? "#fff" : L.muted, border:"none", padding:"4px 14px", borderRadius:6, cursor:"pointer", fontFamily:fMono, fontSize:12, fontWeight:view===v ? 600 : 400 }}>{lb}</button>;
          })}
        </div>
      )}
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
      <div className="dash-aside" style={{ width:220, background:"#1A1F2E", padding:"20px 0", flexShrink:0 }}>
        <div style={{ padding:"0 16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:"#FAF7F2", marginBottom:2 }}>InvoiceAI</div>
          <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(250,247,242,0.3)", letterSpacing:"0.08em" }}>for Europe</div>
        </div>
        <div style={{ padding:"16px 8px 0" }}>
          {nav.map(function(item) {
            var active = section === item.id;
            return (
              <button key={item.id} onClick={function(){ setSection(item.id); setClient(null); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 12px", borderRadius:8, border:"none", background:active ? "rgba(200,80,42,0.15)" : "transparent", color:active ? "#E8896A" : "rgba(250,247,242,0.45)", cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:active?500:400, marginBottom:2 }}>
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
      <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted, marginBottom:6 }}>{props.label}</div>
      <div style={{ fontFamily:fSerif, fontSize:26, fontWeight:700, color:props.color||L.ink, letterSpacing:"-0.02em" }}>{props.value}</div>
      {props.sub && <div style={{ fontFamily:fMono, fontSize:11, color:L.faint, marginTop:3 }}>{props.sub}</div>}
    </div>
  );
}

function DOverview() {
  return (
    <div>
      <h1 style={{ fontFamily:fSerif, fontSize:26, fontWeight:800, color:L.ink, marginBottom:4, letterSpacing:"-0.025em" }}>Good morning, Alex.</h1>
      <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:24 }}>Wednesday, 29 April 2026 · 4 clients · 1 overdue</p>
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

function DClients(props) {
  var setClient = props.setClient;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink }}>Clients</h2>
        <button style={{ background:L.accent, color:"#fff", border:"none", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>+ New Invoice</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CLIENTS.map(function(c) {
          var stColor = c.status==="active" ? L.green : c.status==="overdue" ? L.accent : L.gold;
          return (
            <div key={c.id} onClick={function(){ setClient(c); }} style={{ background:"#FAF7F2", border:"1.5px solid #D8D0C4", borderRadius:12, padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:c.col+"22", border:"1.5px solid "+c.col+"30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:15, color:c.col, fontWeight:500, flexShrink:0 }}>{c.av}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:fSans, fontSize:14, fontWeight:600, color:L.ink }}>{c.name}</div>
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
            <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, letterSpacing:"0.06em" }}>1 overdue · €3,200</span>
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
                <div style={{ fontFamily:fMono, fontSize:13, color:L.ink, width:130, flexShrink:0 }}>{r.inv}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:fSans, fontSize:15, color:L.ink }}>{r.client}</div>
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
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:500, color:L.ink }}>{r.title}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{r.client} · {r.views} views · sent {r.sent}</div>
              </div>
              <div style={{ fontFamily:fMono, fontSize:15, color:L.ink, fontWeight:500 }}>{"€"+r.value.toLocaleString()}</div>
              <div style={{ fontFamily:fMono, fontSize:11, color:stColor[r.status]||L.muted, background:(stColor[r.status]||L.muted)+"15", borderRadius:4, padding:"3px 8px", letterSpacing:"0.06em" }}>{r.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DBrandKits() {
  var kits = [
    { name:"Daniel Speder",  primary:"#C8502A", font:"Playfair Display",   logo:"A" },
    { name:"Nord Creative",     primary:"#2A5E9A", font:"DM Sans",             logo:"NC" },
    { name:"Bianchi Studio",    primary:"#2A7A54", font:"Cormorant Garamond",  logo:"B" },
  ];
  var [sel, setSel] = useState(kits[0]);
  return (
    <div>
      <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:700, color:L.ink, marginBottom:4 }}>Brand Kits</h2>
      <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:20, fontWeight:300 }}>Create a kit per client. Applied automatically to invoices and proposals.</p>
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

// ── Footer ────────────────────────────────────────────────────────────────────
function PaymentStrip() {
  var badges = [
    { bg:"#635BFF", label:"Stripe",    color:"#fff", font:fSans, weight:600 },
    { bg:"#1C1C1E", label:"Apple Pay", color:"#fff", font:fSans, weight:500 },
    { bg:L.white,   label:"G Pay",     color:"#4285F4", font:fSans, weight:700, border:L.border },
    { bg:"#003087", label:"SEPA",      color:"#fff", font:fMono, weight:500 },
    { bg:"#1A1F71", label:"VISA",      color:"#fff", font:fMono, weight:700 },
    { bg:"#EB001B", label:"MC",        color:"#fff", font:fMono, weight:700 },
  ];
  return (
    <div style={{ background:L.cream, borderTop:"1px solid "+L.border, borderBottom:"1px solid "+L.border, padding:"20px 24px" }}>
      <div className="desktop-strip" style={{ maxWidth:480, margin:"0 auto", textAlign:"center" }}>
        <span style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:14 }}>Secure payments via</span>
        <div className="payment-badges" style={{ display:"flex", gap:8, marginBottom:12, justifyContent:"center", flexWrap:"wrap" }}>
          {badges.map(function(b) {
            return (
              <div key={b.label} style={{ background:b.bg, border:b.border ? "1px solid "+b.border : "none", borderRadius:7, height:32, padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:b.font, fontSize:14, fontWeight:b.weight, color:b.color, letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>{b.label}</span>
              </div>
            );
          })}
        </div>
        <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"2px 10px", letterSpacing:"0.06em" }}>Coming Q3 2026</span>
        <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, fontWeight:300, marginTop:10, lineHeight:1.6 }}>Apple Pay, Google Pay and card payments via Stripe — launching Q3 2026. SEPA bank transfer available now.</p>
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
    { title:t(lang,"footerProduct")||"Product", links:[[t(lang,"navGenerator")||"Generator","Generator"],[t(lang,"navPricing")||"Pricing","Pricing"],[t(lang,"navDashboard")||"Dashboard","Dashboard"]] },
    { title:t(lang,"footerCompany")||"Company", links:[["About","About"],["Blog","Blog"],["Careers","Careers"]] },
    { title:t(lang,"footerLegal")||"Legal",   links:[["Privacy Policy","Privacy"],["Terms of Service","Terms"],["GDPR & Data","GDPR"],["Cookie Policy","Cookies"],["FAQ","FAQ"]] },
  ];
  return (
    <footer style={{ background:"#1A1F2E", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"48px 24px 32px", overflowX:"hidden" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div className="footer-inner">
        {/* Logo + tagline — full width on mobile, first col on desktop */}
        <div className="footer-brand" style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <LogoMark size={28} />
            <div>
              <div style={{ fontFamily:fSerif, fontWeight:700, fontSize:15, color:L.paper, lineHeight:1.1 }}>InvoiceAI</div>
              <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(245,240,232,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>for Europe</div>
            </div>
          </div>
          <p style={{ fontFamily:fSans, fontSize:14, color:"rgba(245,240,232,0.4)", lineHeight:1.6, maxWidth:280, fontWeight:300, marginBottom:12 }}>The only invoicing tool built for EU freelancers who work across borders.</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["EU VAT compliant","GDPR compliant","SEPA ready"].map(function(b) {
              return <span key={b} style={{ fontFamily:fMono, fontSize:11, color:L.gold, border:"1px solid "+L.gold+"55", borderRadius:4, padding:"3px 8px", letterSpacing:"0.07em" }}>{b}</span>;
            })}
          </div>
        </div>
        {/* 3 link columns — always in one row */}
        <div className="footer-cols" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:40 }}>
          {cols.map(function(col) {
            return (
              <div key={col.title}>
                <div style={{ fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(245,240,232,0.25)", marginBottom:12 }}>{col.title}</div>
                {col.links.map(function(pair) {
                  var lb = pair[0]; var pg = pair[1];
                  return (
                    <div key={lb} onClick={pg ? function(){ setPage(pg); } : null} style={{ fontFamily:fSans, fontSize:14, color:"rgba(245,240,232,0.45)", marginBottom:8, cursor:pg?"pointer":"default" }}>{lb}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
        <div style={{ background:"rgba(200,80,42,0.1)", border:"1px solid rgba(200,80,42,0.2)", borderRadius:12, padding:"20px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ fontFamily:fSerif, fontSize:16, fontWeight:700, color:L.paper, marginBottom:3 }}>{t(lang,"footerWaitlist")}</div>
            <div style={{ fontFamily:fSans, fontSize:14, color:"rgba(245,240,232,0.5)", fontWeight:300 }}>{t(lang,"footerWaitlistSub")}</div>
          </div>
          <button onClick={function(){ openModal("footer"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"10px 22px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.3)" }}>
            {t(lang,"footerCta")}
          </button>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:fMono, fontSize:12, color:"rgba(245,240,232,0.25)" }}>© {yr} InvoiceAI. All rights reserved.</span>
          <div style={{ display:"flex", gap:14 }}>
            {[["eu","EU VAT"],["shield","GDPR"],["bank","SEPA"]].map(function(pair) {
              return <span key={pair[1]} style={{ display:"flex", alignItems:"center", gap:4, fontFamily:fMono, fontSize:11, color:"rgba(245,240,232,0.2)" }}><Icon name={pair[0]} size={10} color="rgba(245,240,232,0.25)" />{pair[1]}</span>;
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
        <div className="desktop-sub-header" style={{ maxWidth:700, margin:"0 auto" }}>
          <Pill color={accent ? "rgba(255,255,255,0.85)" : L.gold}>{pill}</Pill>
          <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,5vw,52px)", fontWeight:900, color:accent ? "#fff" : L.ink, margin:"16px 0 12px", letterSpacing:"-0.025em", lineHeight:1.1 }}>{title}</h1>
          <p style={{ fontFamily:fSans, fontSize:15, color:accent ? "rgba(255,255,255,0.75)" : L.muted, fontWeight:300, lineHeight:1.65, maxWidth:520, margin:"0 auto" }}>{sub}</p>
        </div>
      </div>
      <div className="desktop-prose" style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px", fontFamily:fSans, fontSize:14, color:L.ink, lineHeight:1.8 }}>
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
      <SP>InvoiceAI was born out of a specific frustration: being a European freelancer with clients in multiple countries and having absolutely no tool that handled it correctly. German clients needed XRechnung. French clients had different VAT rules. Dutch clients expected SEPA with a specific reference format. And none of the US-built tools — HoneyBook, Bonsai, FreshBooks — had any idea what reverse charge was.</SP>
      <SP>Every cross-border invoice was a manual research exercise. We spent more time checking EU VAT rules than doing the work clients were paying us for. So we built the tool we needed.</SP>
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
                <div style={{ width:38, height:38, borderRadius:"50%", background:"#8A7A6A22", border:"1.5px solid #8A7A6A30", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fMono, fontSize:14, color:"#8A7A6A", fontWeight:500, flexShrink:0 }}>{m.av}</div>
                <div>
                  <div style={{ fontFamily:fSans, fontWeight:600, fontSize:15, color:L.ink }}>{m.name}</div>
                  <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.05em" }}>{m.role} · {m.city}</div>
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
        <button onClick={function(){ openModal("about"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)" }}>Get early access →</button>
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
        <p style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:14, fontWeight:300 }}>{posts[0].excerpt}</p>
        <span style={{ fontFamily:fMono, fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.06em" }}>{posts[0].date} · {posts[0].read} read</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {posts.slice(1).map(function(p) {
          var tc = tagColor[p.tag] || L.accent;
          return (
            <div key={p.title} style={{ background:L.white, border:"1px solid "+L.border, borderRadius:13, padding:"18px 18px 14px", cursor:"pointer" }}>
              <Pill color={tc}>{p.tag}</Pill>
              <h3 style={{ fontFamily:fSerif, fontSize:15, fontWeight:700, color:L.ink, margin:"10px 0 8px", lineHeight:1.35 }}>{p.title}</h3>
              <p style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.55, marginBottom:12, fontWeight:300 }}>{p.excerpt}</p>
              <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.04em" }}>{p.date} · {p.read} read</span>
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
                <span style={{ fontFamily:fMono, fontSize:11, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"33", borderRadius:4, padding:"3px 9px", letterSpacing:"0.06em" }}>Full-time</span>
              </div>
              <div style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.06em", marginBottom:8 }}>{j.team} · {j.loc}</div>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, marginBottom:12, fontWeight:300 }}>{j.desc}</p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                {j.tags.map(function(t) { return <span key={t} style={{ fontFamily:fMono, fontSize:10, color:L.blue, background:L.blueGlow, border:"1px solid "+L.blue+"33", borderRadius:4, padding:"2px 7px", letterSpacing:"0.05em" }}>{t}</span>; })}
              </div>
              <button style={{ background:L.accent, color:"#fff", border:"none", padding:"7px 18px", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>Apply →</button>
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

function PagePrivacy() {
  return (
    <SubLayout pill="Legal" title="Privacy Policy" sub="Last updated: 1 May 2026. We process your data fairly, transparently and in accordance with GDPR.">
      <SH>1. Who we are</SH>
      <SP>Daniel Speder (Selbständiger) is the operator of invoice-ai.de and the data controller for personal data collected through this website and its services. Contact: privacy@invoice-ai.de · Arndstr. 2 · 80469 München · Germany</SP>
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
      <SP>Daniel Speder · Arndstr. 2 · 80469 München · privacy@invoice-ai.de</SP>
    </SubLayout>
  );
}

function PageTerms() {
  return (
    <SubLayout pill="Legal" title="Terms of Service" sub="Last updated: 1 May 2026. Please read these terms carefully before using InvoiceAI. By using the service you agree to be bound by them.">

      <SH>1. Who we are and what InvoiceAI is</SH>
      <SP>InvoiceAI is operated by Daniel Speder (Selbständiger), Arndstr. 2, 80469 München, Germany ("InvoiceAI", "we", "us"). InvoiceAI is a software tool that helps freelancers and small businesses create invoices, proposals and related business documents. It is not a tax advisory service, accounting service, legal service or financial service of any kind.</SP>
      <SP>By creating an account or using any part of InvoiceAI, you accept these Terms of Service in full. If you do not agree, do not use the service.</SP>

      <SH>2. Nature of the service — important</SH>
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
      <SLI>We reserve the right to change pricing with 30 days' written notice. Price changes take effect at your next renewal cycle. If you do not accept the new price, you may cancel before the renewal date.</SLI>
      <SLI>If payment fails, we will notify you and provide a 7-day grace period. After this period we may suspend access until payment is received.</SLI>
      <SLI>Pursuant to the EU Data Act, you may switch to another provider with two months' notice. You can export all your data in JSON or CSV format at any time from account settings, free of charge.</SLI>

      <SH>4. Limitation of liability</SH>
      <SP>To the fullest extent permitted by applicable law:</SP>
      <SLI>InvoiceAI's total aggregate liability to you for any claim arising from or related to these terms or the service — whether in contract, tort (including negligence), breach of statutory duty or otherwise — shall not exceed the total fees paid by you to InvoiceAI in the 12 months immediately preceding the event giving rise to the claim.</SLI>
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
      <SLI>Attempt to gain unauthorised access to the service or another user's data.</SLI>
      <SLI>Reverse engineer, copy, redistribute or resell the service or its underlying technology.</SLI>
      <SLI>Use the service in any way that could expose InvoiceAI or other users to legal liability.</SLI>
      <SP>We reserve the right to suspend or terminate accounts that breach these provisions without notice and without refund.</SP>

      <SH>7. Your content and data</SH>
      <SLI>You retain all intellectual property rights to the content you create using InvoiceAI — invoices, proposals, client data and business information remain yours.</SLI>
      <SLI>You grant InvoiceAI a limited licence to process and store your content solely to provide the service to you.</SLI>
      <SLI>We do not sell your data, share it with third parties for commercial purposes, or use it to train AI models without your explicit consent.</SLI>
      <SLI>You are responsible for maintaining appropriate backups of your data. While we implement robust backup procedures, we cannot guarantee against data loss in all circumstances.</SLI>

      <SH>8. AI features — specific terms</SH>
      <SP>InvoiceAI uses Claude (Anthropic PBC) to power the proposal writer and support assistant. By using these features:</SP>
      <SLI>Your input (project descriptions, client names, brief content) is transmitted to Anthropic's API for processing. See Anthropic's privacy policy at anthropic.com for details of how they handle this data.</SLI>
      <SLI>AI-generated outputs are probabilistic and may contain errors, inaccuracies or inappropriate content. Always review AI-generated proposals before sending them to clients.</SLI>
      <SLI>Do not enter sensitive personal data, confidential client information, trade secrets or privileged information into AI input fields.</SLI>
      <SLI>We are not liable for any loss or damage arising from reliance on AI-generated content.</SLI>

      <SH>9. Third-party services</SH>
      <SP>InvoiceAI integrates with third-party services including Stripe (payments), Supabase (authentication), AWS (hosting), Anthropic (AI), Plausible (analytics) and Loops (email). Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the actions, availability or data practices of these third parties.</SP>

      <SH>10. Intellectual property</SH>
      <SP>All software, design, trademarks and content of InvoiceAI (excluding user-generated content) are the exclusive property of Daniel Speder / InvoiceAI. You may not copy, reproduce, distribute or create derivative works without prior written permission.</SP>

      <SH>11. Termination</SH>
      <SP>Either party may terminate the service relationship at any time. Upon termination you may export your data for 90 days. After 90 days, your data will be permanently deleted, except where retention is required by law (invoices are retained for 10 years per GoBD §147 AO). We reserve the right to terminate access immediately if you breach these terms.</SP>

      <SH>12. Changes to these terms</SH>
      <SP>We may update these terms from time to time. Material changes will be notified by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance. If you do not accept changes, you may terminate your subscription before the effective date.</SP>

      <SH>13. Governing law and dispute resolution</SH>
      <SP>These terms are governed by the laws of the Federal Republic of Germany. The UN Convention on Contracts for the International Sale of Goods (CISG) is excluded. Disputes will be referred to the competent courts of München, Germany, unless mandatory consumer protection law in your country of residence requires otherwise. EU consumers may also use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr. We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.</SP>

      <SH>14. Contact</SH>
      <SP>Daniel Speder · Arndstr. 2 · 80469 München · Germany · legal@invoice-ai.de</SP>
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
              <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink, marginBottom:4 }}>{c.title}</div>
              <div style={{ fontFamily:fSans, fontSize:13, color:L.muted, lineHeight:1.5, fontWeight:300 }}>{c.desc}</div>
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

function PageFAQ(props) {
  var setPage = props.setPage;
  var openModal = props.openModal;
  var [open, setOpen] = useState(null);

  var categories = [
    {
      title: "Pricing & Plans",
      items: [
        { q:"How much does InvoiceAI cost?", a:"Solo is €19/mo (up to 3 active clients), Studio is €59/mo (unlimited clients, our most popular plan), Agency is €149/mo (5 team seats, white-label portal). All plans include a 14-day free trial with no credit card required." },
        { q:"What counts as an 'active client'?", a:"A client you've created an invoice or proposal for in the current billing month. Archived or inactive clients don't count. Most freelancers with 1–3 regular clients stay on the Solo plan indefinitely." },
        { q:"Can I change plans later?", a:"Yes — upgrade or downgrade at any time from your account settings. If you upgrade, you're charged the difference pro-rated for the remainder of the month. If you downgrade, the change takes effect at the next billing cycle." },
        { q:"Is there a free trial?", a:"Yes. 14 days free on any plan, no credit card needed. You get the full feature set during the trial, not a limited version." },
        { q:"What is the founding member discount?", a:"The first users who join via the waitlist lock in Studio at €29/mo forever — 50% off the regular price. This offer ends when we officially launch. Once locked in, your price never increases." },
      ],
    },
    {
      title: "EU Compliance & VAT",
      items: [
        { q:"What is reverse charge and when does it apply?", a:"Reverse charge means your client pays the VAT to their own tax authority instead of you collecting it. It applies when you invoice a VAT-registered business in a different EU country (B2B cross-border). InvoiceAI detects this automatically when you enter a valid client VAT number." },
        { q:"I'm a Kleinunternehmer (§19 UStG) — can I use reverse charge?", a:"No. Kleinunternehmer status means you have no VAT number, so reverse charge cannot apply. InvoiceAI blocks this combination automatically. Your invoices should carry the §19 UStG exemption notice instead." },
        { q:"What is the Zusammenfassende Meldung (ZM)?", a:"The ZM is a quarterly report you must file with the German Finanzamt listing all cross-border B2B invoices where reverse charge applied. InvoiceAI reminds you of this on every reverse charge invoice and keeps a record you can use for filing." },
        { q:"What is XRechnung and do I need it?", a:"XRechnung is Germany's mandatory structured e-invoice format. For invoices to German government bodies (B2G), it has been required since 2020. For B2B, the mandate phases in from 2025–2028. InvoiceAI generates fully compliant XRechnung 3.0 XML from your invoice form with one click." },
        { q:"What is OSS and do I need to register?", a:"OSS (One Stop Shop) applies only to B2C digital services. If you sell digital services directly to consumers (not businesses) across multiple EU countries and your total B2C cross-border revenue exceeds €10,000/year, you should register for OSS. Most InvoiceAI users invoice B2B and are not affected." },
        { q:"Does InvoiceAI validate VAT numbers?", a:"Yes — InvoiceAI calls the EU VIES register in real time as you type the client's VAT number. A green badge confirms the number is valid. If VIES returns invalid, reverse charge is blocked and you're asked to verify manually before proceeding." },
      ],
    },
    {
      title: "Proposals",
      items: [
        { q:"How does the AI proposal writer work?", a:"You fill in the client name, company, country, project type and a short brief. InvoiceAI uses this to generate a structured proposal adapted to the project type and your client's country communication norms. German clients get precise, formal proposals. Dutch clients get direct, no-filler ones. French clients get proposals that lead with value before price." },
        { q:"Can I edit the proposal after it's generated?", a:"Yes — the generated text is fully editable. You can also use the refine chips (Make it shorter, More formal, Add case studies, Stronger close) to iterate with one tap. Each refinement builds on the previous version." },
        { q:"Is the proposal output private?", a:"Yes. Your proposal content is sent to the AI for generation and then returned to you. We do not store, share or use it to train any model." },
      ],
    },
    {
      title: "Invoicing",
      items: [
        { q:"What invoice formats can I export?", a:"PDF (print-quality, via browser) and XRechnung 3.0 XML (machine-readable, EN 16931 compliant). ZUGFeRD (hybrid PDF+XML) and Factur-X (France) are coming Q4 2026." },
        { q:"Can I invoice in currencies other than EUR?", a:"Yes — the invoice form uses the correct currency automatically based on the client's country. Hungarian clients get HUF, Swedish clients get SEK, Polish clients get PLN, UK clients get GBP." },
        { q:"How do I handle invoices to UK clients after Brexit?", a:"UK clients are treated as third-country (non-EU) customers. InvoiceAI adds the correct exemption notice ('service not taxable in Germany / §3a UStG') and sets VAT to 0%. No reverse charge — that only applies within the EU." },
        { q:"Can I issue a credit note?", a:"Yes — enable the Credit Note option in the EU compliance section. InvoiceAI assigns a separate CN-YYYY-XXX number sequence as required by EU VAT law and adds the reference to the original invoice." },
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        { q:"Where is my data stored?", a:"All data is stored on AWS Frankfurt (eu-central-1). It never leaves the EU. We comply fully with GDPR and the German GoBD requirements for 10-year invoice archiving." },
        { q:"Do you sell my data?", a:"Never. We do not sell, rent or share your data with any third party for any purpose. Our analytics are cookieless (Plausible). See our Privacy Policy for the full picture." },
        { q:"Can I export all my data?", a:"Yes — export all clients, invoices and proposals as JSON or CSV at any time from your account settings. You own your data completely." },
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
                        <span style={{ fontFamily:fMono, fontSize:13, color:L.muted, flexShrink:0 }}>{isOpen ? "▲" : "▼"}</span>
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
          Get early access →
        </button>
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

// ── Client Portal ─────────────────────────────────────────────────────────────
var PORTAL_INVOICE = {
  num:        "DE-2026-0437",
  date:       "29 April 2026",
  due:        "29 May 2026",
  from: {
    name:     "Studio Nordlicht GmbH",
    street:   "Leopoldstr. 10",
    city:     "80802 München, Germany",
    vat:      "",
    iban:     "",
    bic:      "",
    email:    "hello@nordlicht.de",
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
  var [inv, setInv] = useState(null);
  var [loadError, setLoadError] = useState("");
  var [status, setStatus] = useState("pending");
  var [showPay, setShowPay] = useState(false);
  var [payMethod, setPayMethod] = useState("sepa");

  useEffect(function() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
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
              vatLabel: data.reverse_charge ? "VAT 0% — Reverse Charge (Art. 44 EU VAT Directive)" : data.vat_exempt ? "VAT Exempt — §19 UStG" : "VAT " + (data.vat_rate || 0) + "%",
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
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}>· secure invoice portal</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:L.green }} />
            <span style={{ fontFamily:fMono, fontSize:12, color:L.green, letterSpacing:"0.06em" }}>SSL encrypted</span>
          </div>
          <button onClick={function(){ setPage("Generator"); }} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:7, padding:"5px 12px", cursor:"pointer", fontFamily:fSans, fontSize:14, color:L.muted }}>
            ← Back
          </button>
        </div>
      </div>
      {(!inv && !loadError) && (
        <div style={{ maxWidth:720, margin:"60px auto", padding:"0 20px", textAlign:"center" }}>
          <div style={{ fontFamily:fMono, fontSize:13, color:L.muted, letterSpacing:"0.08em" }}>Loading invoice…</div>
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
            <div style={{ fontFamily:fSerif, fontSize:19, fontWeight:800, color:L.ink, letterSpacing:"-0.02em" }}>{inv.from.name}</div>
            <div style={{ fontFamily:fSans, fontSize:14, color:L.muted, marginTop:2 }}>Invoice {inv.num} · Due {inv.due}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:fSerif, fontSize:30, fontWeight:900, color:L.accent, letterSpacing:"-0.02em" }}>{"€"+inv.total.toLocaleString()}</div>
            <div style={{ fontFamily:fMono, fontSize:11, color:status==="paid"?L.green:status==="approved"?L.blue:L.gold, background:(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"18", border:"1px solid "+(status==="paid"?L.green:status==="approved"?L.blue:L.gold)+"44", borderRadius:4, padding:"3px 10px", letterSpacing:"0.07em", display:"inline-block", marginTop:4 }}>
              {status==="paid" ? "✓ PAID" : status==="approved" ? "APPROVED" : "AWAITING APPROVAL"}
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
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{inv.from.name}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.from.street}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.from.city}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, marginTop:3 }}>VAT: {inv.from.vat}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Billed to</div>
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>{inv.to.name}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.to.contact}</div>
                <div style={{ fontFamily:fSans, fontSize:13, color:L.muted }}>{inv.to.city}</div>
                <div style={{ fontFamily:fMono, fontSize:12, color:L.faint, marginTop:3 }}>VAT: {inv.to.vat}</div>
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
                {inv.lines.map(function(line, i) {
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid "+L.border }}>
                      <td style={{ fontFamily:fSans, fontSize:14, color:L.ink, padding:"9px 0" }}>{line.desc}</td>
                      <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"9px 0" }}>{line.qty}</td>
                      <td style={{ fontFamily:fMono, fontSize:13, color:L.muted, textAlign:"right", padding:"9px 0" }}>{"€"+line.rate.toLocaleString()}</td>
                      <td style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500, textAlign:"right", padding:"9px 0" }}>{"€"+line.total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ minWidth:240 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.muted, padding:"2px 0" }}>
                  <span>Subtotal</span><span style={{ fontFamily:fMono }}>{"€"+inv.sub.toLocaleString()}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSans, fontSize:13, color:L.blue, padding:"3px 0 6px", borderBottom:"1.5px solid "+L.ink }}>
                  <span>{inv.vatLabel}</span><span style={{ fontFamily:fMono }}>€0.00</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontFamily:fSerif, fontSize:17, fontWeight:700, color:L.ink, paddingTop:6 }}>
                  <span>Total Due</span><span style={{ color:L.accent }}>{"€"+inv.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ background:L.cream, borderRadius:8, padding:"12px 14px", marginTop:16 }}>
              <div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>SEPA Bank Transfer</div>
              <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
                <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>IBAN</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{inv.from.iban}</div></div>
                <div><div style={{ fontFamily:fMono, fontSize:10, color:L.muted, textTransform:"uppercase" }}>BIC</div><div style={{ fontFamily:fMono, fontSize:14, color:L.ink, fontWeight:500 }}>{inv.from.bic}</div></div>
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
                {status==="approved" ? "Approved — ready to pay" : "Action required"}
              </span>
            </div>
            <div style={{ padding:"20px 24px" }}>
              {status === "pending" && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    Please review the invoice above and approve it. Once approved, you can pay via SEPA transfer or card.
                  </p>
                  <button onClick={function(){ setStatus("approved"); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)", marginRight:10 }}>
                    ✓ Approve Invoice
                  </button>
                  <button style={{ background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"13px 20px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:15 }}>
                    Request changes
                  </button>
                </div>
              )}
              {status === "approved" && !showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.green, fontWeight:500, marginBottom:14 }}>✓ Invoice approved on 30 Apr 2026</p>
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
                  <button onClick={function(){ setShowPay(true); }} style={{ background:L.accent, color:"#fff", border:"none", padding:"13px 32px", borderRadius:9, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:"0 4px 14px rgba(200,80,42,0.25)" }}>
                    Pay €5,400 →
                  </button>
                </div>
              )}
              {status === "approved" && showPay && (
                <div>
                  <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, marginBottom:16, fontWeight:300 }}>
                    {payMethod === "sepa" && "Transfer " + (inv.currency === "EUR" ? "€" : inv.currency + " ") + inv.total.toLocaleString() + " to the IBAN above with reference " + inv.num + ". Payment typically clears in 1 business day."}
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
            <p style={{ fontFamily:fSans, fontSize:15, color:L.green, fontWeight:300 }}>Thank you. A receipt has been sent to {inv.to.contact} at {inv.to.name}.</p>
          </div>
        )}

        <div style={{ textAlign:"center", padding:"20px 0 4px" }}>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}>Secured &amp; delivered by </span>
          <span onClick={function(){ setPage("Home"); }} style={{ fontFamily:fSerif, fontSize:13, fontWeight:700, color:L.accent, cursor:"pointer", letterSpacing:"-0.01em" }}>InvoiceAI</span>
          <span style={{ fontFamily:fMono, fontSize:11, color:L.faint, letterSpacing:"0.08em" }}> · EU-native invoicing</span>
        </div>
      </div>
      )}
    </div>
  );
}


var BOT_QA = [
  { q:["reverse charge","rc","cross-border","art 44"],      a:"Reverse charge applies when you invoice a VAT-registered business in another EU country. InvoiceAI detects this automatically when you enter the client's VAT number — sets VAT to 0% and adds the required legal text." },
  { q:["vat","tax rate","percent"],                         a:"InvoiceAI uses the correct VAT rate per country automatically: Germany 19%, France 20%, Italy 22%, Netherlands 21%, Sweden 25% and more. You can also mark invoices VAT-exempt (§19 UStG) if you're a small business." },
  { q:["sepa","iban","bank transfer","payment"],            a:"Every invoice includes a SEPA bank transfer block with your IBAN and BIC. Just enter them once in the invoice form and they appear on every invoice automatically." },
  { q:["gdpr","data","privacy","personal"],                 a:"InvoiceAI adds a GDPR-compliant notice to every invoice automatically. Your data is hosted on AWS Frankfurt (EU), never leaves the EU, and we never sell it to third parties." },
  { q:["proposal","ai","generate","write"],                 a:"Type a brief project description, choose a tone (direct, warm or formal), and the AI writes a full client-ready proposal in under 30 seconds. You can then refine it with one-click actions." },
  { q:["plan","price","cost","solo","studio","agency"],     a:"Solo is €19/mo (up to 3 clients), Studio is €59/mo (unlimited, most popular), Agency is €149/mo (5 team seats + white-label). All plans include a 14-day free trial — no credit card needed." },
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
          <div style={{ background:L.accent, padding:"16px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <LogoMark size={28} bg="rgba(255,255,255,0.2)" />
              <div>
                <div style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:"#fff" }}>InvoiceAI Support</div>
                <div style={{ fontFamily:fMono, fontSize:10, color:"rgba(255,255,255,0.65)", letterSpacing:"0.06em" }}>Usually replies instantly</div>
              </div>
            </div>
            <button onClick={function(){ setOpen(false); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px" }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10, maxHeight:320 }}>
            {msgs.map(function(m, i) {
              var isBot = m.role === "bot";
              return (
                <div key={i} style={{ display:"flex", justifyContent:isBot ? "flex-start" : "flex-end" }}>
                  <div style={{ maxWidth:"82%", background:isBot ? L.cream : L.accent, color:isBot ? L.ink : "#fff", borderRadius:isBot ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding:"9px 12px", fontFamily:fSans, fontSize:14, lineHeight:1.55, fontWeight:300 }}>
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
                  <button key={s} onClick={function(){ setInput(s); }} style={{ background:L.paper, border:"1px solid "+L.border, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontFamily:fSans, fontSize:13, color:L.muted, textAlign:"left" }}>
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
              style={{ flex:1, border:"1.5px solid "+L.border, borderRadius:8, padding:"7px 10px", fontFamily:fSans, fontSize:14, color:L.ink, background:L.paper, outline:"none" }}
            />
            <button onClick={send} disabled={!input.trim() || loading} style={{ background:input.trim() && !loading ? L.accent : L.border, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", cursor:input.trim() && !loading ? "pointer" : "not-allowed" }}>
              <Icon name="send" size={13} color="#fff" />
            </button>
          </div>
        </div>
      )}
      <button onClick={function(){ setOpen(function(o){ return !o; }); }} className="bot-trigger" style={{ width:48, height:48, borderRadius:"50%", background:open ? L.ink : L.accent, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(200,80,42,0.35)", transition:"background 0.15s" }}>
        {open
          ? <Icon name="x" size={18} color="#fff" />
          : <Icon name="bolt" size={20} color="#fff" />
        }
      </button>
    </div>
  );
}


// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal(props) {
  var onClose = props.onClose;
  var onAuth  = props.onAuth;
  var [mode, setMode] = useState("signin"); // signin | signup | magic | done
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");

  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:8, padding:"10px 12px", fontFamily:fSans, fontSize:15, color:L.ink, background:L.white, outline:"none", marginBottom:10 };

  function submit() {
    if (!email.trim()) { setError("Email required."); return; }
    if (mode !== "magic" && !password.trim()) { setError("Password required."); return; }
    setError(""); setLoading(true);

    var action = mode === "signup" ? "signup" : mode === "magic" ? "magic" : "signin";

    fetch("/api/auth", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ action, email: email.trim(), password: password.trim() }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      setLoading(false);
      if (data.error) {
        // If Supabase not configured yet, allow demo access
        if (data.error.includes("not configured") || data.error.includes("API key")) {
          onAuth({ email: email.trim() }, null);
          onClose();
          return;
        }
        setError(data.error); return;
      }
      if (action === "magic") { setMode("done"); return; }
      if (data.session || data.user) { onAuth(data.user || { email: email.trim() }, data.session); onClose(); }
    })
    .catch(function() {
      setLoading(false);
      // Network error or API not deployed — allow demo access
      onAuth({ email: email.trim() }, null);
      onClose();
    });
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,31,46,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:L.white, borderRadius:20, width:"100%", maxWidth:400, overflow:"hidden", boxShadow:"0 24px 64px rgba(26,31,46,0.2)" }}>
        <div style={{ background:L.accent, padding:"22px 28px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(255,255,255,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>invoice-ai.de</div>
            <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>
              {mode==="signup" ? "Create account" : mode==="magic" ? "Magic link" : "Welcome back"}
            </h2>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        {mode === "done" ? (
          <div style={{ padding:"36px 28px 40px", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><Icon name="send" size={22} color={L.accent} /></div>
            <h3 style={{ fontFamily:fSerif, fontSize:20, fontWeight:800, color:L.ink, marginBottom:8 }}>Check your email</h3>
            <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, fontWeight:300, lineHeight:1.6 }}>We sent a magic link to <strong style={{ color:L.ink }}>{email}</strong>. Click it to sign in — no password needed.</p>
          </div>
        ) : (
          <div style={{ padding:"24px 28px 28px" }}>
            <div style={{ display:"flex", gap:6, marginBottom:20 }}>
              {[["signin",t(lang,"authSignIn")||"Sign in"],["signup",t(lang,"authSignUp")||"Sign up"],["magic",t(lang,"authMagic")||"Magic link"]].map(function(pair) {
                return (
                  <button key={pair[0]} onClick={function(){ setMode(pair[0]); setError(""); }} style={{ flex:1, background:mode===pair[0] ? L.ink : L.paper, color:mode===pair[0] ? "#fff" : L.muted, border:"1.5px solid "+(mode===pair[0] ? L.ink : L.border), borderRadius:7, padding:"7px 0", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:mode===pair[0] ? 500 : 400 }}>
                    {pair[1]}
                  </button>
                );
              })}
            </div>

            <input
              type="email"
              value={email}
              onChange={function(e){ setEmail(e.target.value); }}
              placeholder="you@studio.de"
              style={inp}
            />
            {mode !== "magic" && (
              <input
                type="password"
                value={password}
                onChange={function(e){ setPassword(e.target.value); }}
                placeholder={mode==="signup" ? "Create a password" : "Password"}
                style={inp}
              />
            )}

            {error && <p style={{ fontFamily:fSans, fontSize:14, color:L.accent, marginBottom:10 }}>{error}</p>}

            <button onClick={submit} disabled={loading} style={{ width:"100%", background:loading ? L.border : L.accent, color:"#fff", border:"none", padding:"12px", borderRadius:9, cursor:loading ? "not-allowed" : "pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:loading ? "none" : "0 4px 14px rgba(59,91,219,0.3)" }}>
              {loading ? "Loading…" : mode==="signup" ? "Create account →" : mode==="magic" ? "Send magic link →" : "Sign in →"}
            </button>

            <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, textAlign:"center", marginTop:14, letterSpacing:"0.04em" }}>
              {mode==="signup" ? "By signing up you agree to our Terms of Service." : "Forgot your password? Use the Magic link tab."}
            </p>
          </div>
        )}
      </div>
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

    fetch("/api/loops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:     email.trim(),
        firstName: name.trim().split(" ")[0],
        lastName:  name.trim().split(" ").slice(1).join(" "),
        country:   country,
        userGroup: role,
        source:    "waitlist-" + source,
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function() { setLoading(false); setDone(true); })
    .catch(function() {
      // Still show success — don't block signup on API errors
      setLoading(false); setDone(true);
    });
  }

  var inp = { width:"100%", boxSizing:"border-box", border:"1.5px solid "+L.border, borderRadius:8, padding:"10px 12px", fontFamily:fSans, fontSize:15, color:L.ink, background:L.white, outline:"none" };
  var lbl = { display:"block", marginBottom:4, fontFamily:fMono, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:L.muted };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(44,36,22,0.55)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:L.white, borderRadius:20, width:"100%", maxWidth:440, overflow:"hidden", boxShadow:"0 24px 64px rgba(44,36,22,0.25)" }}>
        <div style={{ background:L.accent, padding:"24px 28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:fMono, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Early Access · invoice-ai.de</div>
              <h2 style={{ fontFamily:fSerif, fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1 }}>{t(lang,"modalTitle")}</h2>
              <p style={{ fontFamily:fSans, fontSize:15, color:"rgba(255,255,255,0.75)", marginTop:6, fontWeight:300, lineHeight:1.5 }}>{t(lang,"modalSub")}</p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}>×</button>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:14 }}>
            {["14-day free trial","No credit card","EU-hosted data"].map(function(t) {
              return <div key={t} style={{ fontFamily:fMono, fontSize:10, color:"rgba(255,255,255,0.65)", letterSpacing:"0.04em" }}>{t}</div>;
            })}
          </div>
        </div>
        {!done ? (
          <div style={{ padding:"24px 28px 28px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><label style={lbl}>Full name *</label><input value={name} onChange={function(e){ setName(e.target.value); }} placeholder="e.g. Anna Müller" style={inp} /></div>
              <div><label style={lbl}>Work email *</label><input type="email" value={email} onChange={function(e){ setEmail(e.target.value); }} placeholder="alex@studio.de" style={inp} /></div>
              <div>
                <label style={lbl}>I am a *</label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ROLES.map(function(r) {
                    return <button key={r} onClick={function(){ setRole(r); }} style={{ background:role===r?L.ink:L.paper, color:role===r?"#fff":L.muted, border:"1.5px solid "+(role===r?L.ink:L.border), borderRadius:99, padding:"5px 12px", cursor:"pointer", fontFamily:fSans, fontSize:13, fontWeight:role===r?500:400 }}>{r}</button>;
                  })}
                </div>
              </div>
              <div>
                <label style={lbl}>Country *</label>
                <select value={country} onChange={function(e){ setCountry(e.target.value); }} style={{ ...inp, cursor:"pointer" }}>
                  {EU_COUNTRIES_LIST.map(function(c){ return <option key={c} value={c}>{c}</option>; })}
                </select>
              </div>
              {error && <p style={{ fontFamily:fSans, fontSize:14, color:L.accent, margin:0 }}>{error}</p>}
              <button onClick={submit} disabled={loading} style={{ background:loading?L.border:L.accent, color:"#fff", border:"none", padding:"13px", borderRadius:9, cursor:loading?"not-allowed":"pointer", fontFamily:fSans, fontSize:14, fontWeight:500, boxShadow:loading?"none":"0 4px 14px rgba(200,80,42,0.3)" }}>
{loading ? t(lang,"modalJoining") : t(lang,"modalCta")}
              </button>
            </div>
            <p style={{ fontFamily:fMono, fontSize:11, color:L.faint, textAlign:"center", marginTop:14, letterSpacing:"0.04em" }}>No spam. One email when we launch. Unsubscribe anytime.</p>
          </div>
        ) : (
          <div style={{ padding:"36px 28px 40px", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:L.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><Icon name="check" size={22} color={L.accent} /></div>
            <h3 style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.ink, marginBottom:8, letterSpacing:"-0.02em" }}>{t(lang,"modalDoneTitle")}</h3>
            <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.6, marginBottom:6, fontWeight:300 }}>We'll email you at <strong style={{ color:L.ink }}>{email}</strong> the moment early access opens.</p>
            <p style={{ fontFamily:fSans, fontSize:15, color:L.muted, lineHeight:1.6, marginBottom:24, fontWeight:300 }}>Founding member rate: <strong style={{ color:L.accent }}>Studio €29/mo forever</strong> — locked in at signup.</p>
            <div style={{ background:L.cream, border:"1px solid "+L.border, borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <p style={{ fontFamily:fMono, fontSize:11, color:L.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>While you wait — try the demo</p>
              <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, fontWeight:300 }}>Generate a real proposal or invoice right now. No account needed.</p>
            </div>
            <button onClick={onClose} style={{ background:L.accent, color:"#fff", border:"none", padding:"11px 28px", borderRadius:8, cursor:"pointer", fontFamily:fSans, fontSize:15, fontWeight:500 }}>{t(lang,"modalExploreCta")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cookie Banner ─────────────────────────────────────────────────────────────
function CookieBanner(props) {
  var onAccept = props.onAccept;
  var onDecline = props.onDecline;
  var setPage = props.setPage;
  return (
    <div className="cookie-banner" style={{ position:"fixed", bottom:24, left:24, zIndex:998, maxWidth:320, background:L.white, border:"1.5px solid "+L.border, borderRadius:14, padding:"18px 18px 14px", boxShadow:"0 8px 32px rgba(44,36,22,0.15)" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="shield" size={16} color={L.accent} />
          <span style={{ fontFamily:fSans, fontSize:15, fontWeight:600, color:L.ink }}>Cookie settings</span>
        </div>
      </div>
      <p style={{ fontFamily:fSans, fontSize:14, color:L.muted, lineHeight:1.55, marginBottom:14, fontWeight:300 }}>
        We use only essential cookies to keep you logged in. No tracking, no advertising, no third-party cookies. Our analytics are cookieless via Plausible.
      </p>
      <div style={{ display:"flex", gap:7, marginBottom:10 }}>
        <button onClick={onAccept} style={{ flex:1, background:L.accent, color:"#fff", border:"none", padding:"9px 0", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14, fontWeight:500 }}>
          Accept
        </button>
        <button onClick={onDecline} style={{ flex:1, background:"transparent", color:L.muted, border:"1px solid "+L.border, padding:"9px 0", borderRadius:7, cursor:"pointer", fontFamily:fSans, fontSize:14 }}>
          Decline
        </button>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <button onClick={function(){ setPage("Cookies"); onAccept(); }} style={{ background:"none", border:"none", fontFamily:fMono, fontSize:11, color:L.faint, cursor:"pointer", letterSpacing:"0.05em" }}>
          Cookie Policy
        </button>
      </div>
    </div>
  );
}

// ── VIES VAT Validator ────────────────────────────────────────────────────────
// Uses the EU VIES SOAP API proxied through a public JSON wrapper
// Falls back gracefully if API is unavailable
function useVIES(vatNumber) {
  var [status, setStatus] = useState(null);
  useEffect(function() {
    if (!vatNumber || vatNumber.length < 8) { setStatus(null); return; }
    var clean = vatNumber.replace(/\s/g, "").toUpperCase();
    if (clean.length < 8) { setStatus(null); return; }
    var countryCode = clean.slice(0, 2);
    var number = clean.slice(2);
    if (!/^[A-Z]{2}/.test(countryCode)) { setStatus(null); return; }
    setStatus("checking");
    fetch("https://ec.europa.eu/taxation_customs/vies/rest-api/ms/" + countryCode + "/vat/" + number)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.isValid === true) setStatus("valid");
        else if (data.isValid === false) setStatus("invalid");
        else setStatus(null);
      })
      .catch(function() { setStatus(null); });
  }, [vatNumber]);
  return status;
}

function VIESBadge(props) {
  var status = props.status;
  if (!status) return null;
  if (status === "checking") return <span style={{ fontFamily:fMono, fontSize:10, color:L.gold, background:L.goldGlow, border:"1px solid "+L.gold+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>checking…</span>;
  if (status === "valid")    return <span style={{ fontFamily:fMono, fontSize:10, color:L.green, background:L.greenGlow, border:"1px solid "+L.green+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>✓ VIES valid</span>;
  if (status === "invalid")  return <span style={{ fontFamily:fMono, fontSize:10, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>⚠ not found in VIES</span>;
  return null;
}


export default function App() {
  var [page, setPage] = useState("Home");
  var [modal, setModal] = useState(null);
  var [lang, setLang] = useState("de");
  var [cookieDismissed, setCookieDismissed] = useState(false);
  var [authOpen, setAuthOpen] = useState(false);
  var [user, setUser] = useState(null);

  function openModal(source) { setModal(source); }
  function closeModal() { setModal(null); }
  function handleAuth(u, session) { setUser(u); setPage("Dashboard"); }

  useEffect(function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  var showFooter = ["Home","Pricing","About","Blog","Careers","Privacy","Terms","GDPR","Cookies","FAQ"].indexOf(page) >= 0;
  return (
    <>
      <style>{FONTS}</style>
      <style>{"* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #F8F9FC; overflow-x: hidden; } @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: #EDE8DC; } ::-webkit-scrollbar-thumb { background: #D8D0C4; border-radius: 2px; } @media (min-width: 769px) { .nav-burger { display: none !important; } } @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-cta { display: none !important; } .nav-burger { display: flex !important; flex-direction: column; } .hero-btns { flex-direction: column !important; align-items: stretch !important; } .grid3 { grid-template-columns: 1fr !important; } .grid2 { grid-template-columns: 1fr !important; } .grid4 { grid-template-columns: 1fr 1fr !important; } .prop-grid { grid-template-columns: 1fr !important; } .inv-grid { grid-template-columns: 1fr !important; } .dash-layout { flex-direction: column !important; } .dash-aside { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; padding: 10px 8px !important; display: flex !important; gap: 4px; } .bot-panel { width: calc(100vw - 32px) !important; right: 0 !important; } .stat-grid { grid-template-columns: 1fr 1fr !important; } .sub-grid { grid-template-columns: 1fr 1fr !important; } .pricing-scroll > div { flex: 0 0 calc(85vw) !important; min-width: calc(85vw) !important; } .reviews-desktop { display: none !important; } .reviews-mobile { display: block !important; } }  @media (max-width: 480px) { .grid4 { grid-template-columns: 1fr !important; } .stat-grid { grid-template-columns: 1fr !important; } .sub-grid { grid-template-columns: 1fr !important; } } @media print { *, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } body * { visibility: hidden; } #print-invoice, #print-invoice * { visibility: visible; } #print-invoice { position: fixed; top: 0; left: 0; width: 100%; padding: 32px 40px; margin: 0; border: none !important; border-radius: 0 !important; box-shadow: none !important; background: #fff !important; } #print-proposal, #print-proposal * { visibility: visible; } #print-proposal { position: fixed; top: 0; left: 0; width: 100%; max-height: none !important; overflow: visible !important; padding: 40px 56px; margin: 0; background: #fff !important; font-size: 14px !important; } } @media (min-width: 1024px) { .reviews-mobile { display: none !important; } .reviews-desktop { display: block !important; } .desktop-pricing { justify-content: center !important; overflow-x: visible !important; } .desktop-pricing > div { flex: 1 !important; min-width: 0 !important; max-width: 340px !important; } .desktop-hero { max-width: 900px !important; } .desktop-feat-cards { max-width: 720px !important; } .desktop-section { max-width: 1100px !important; } .desktop-eu-grid { grid-template-columns: repeat(3, 1fr) !important; } .desktop-eu-grid > div { padding: 16px 18px !important; } .desktop-eu-grid .eu-title { font-size: 14px !important; } .desktop-eu-grid .eu-badge { font-size: 9px !important; } .desktop-eu-grid .eu-desc { font-size: 13px !important; } .desktop-prop { max-width: 960px !important; grid-template-columns: 1fr 1fr !important; gap: 32px !important; padding: 32px 40px 64px !important; } .desktop-inv { max-width: 960px !important; grid-template-columns: 1fr 300px !important; gap: 24px !important; padding: 32px 40px 64px !important; } .desktop-strip { max-width: 700px !important; } .payment-badges { flex-wrap: nowrap !important; } .desktop-prose { max-width: 920px !important; padding: 64px 48px 100px !important; font-size: 15px !important; } .desktop-sub-header { max-width: 900px !important; } .footer-inner { display: flex !important; gap: 48px !important; align-items: flex-start !important; } .footer-brand { max-width: 260px !important; flex-shrink: 0 !important; margin-bottom: 0 !important; } .footer-cols { flex: 1 !important; margin-bottom: 0 !important; } .bot-panel { width: 400px !important; } .bot-trigger { width: 56px !important; height: 56px !important; } .cookie-banner { max-width: 380px !important; padding: 22px 22px 18px !important; font-size: 13px !important; } }"}</style>
      {page !== "ClientPortal" && <Nav page={page} setPage={setPage} openModal={openModal} lang={lang} setLang={setLang} openAuth={function(){ setAuthOpen(true); }} user={user} />}
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
      {page==="FAQ"          && <PageFAQ setPage={setPage} openModal={openModal} />}
      {showFooter && <Footer setPage={setPage} openModal={openModal} lang={lang} />}
      {page !== "ClientPortal" && <SupportBot />}
      {modal && <SignupModal source={modal} onClose={closeModal} lang={lang} />}
      {authOpen && <AuthModal onClose={function(){ setAuthOpen(false); }} onAuth={handleAuth} />}
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
