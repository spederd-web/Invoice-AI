import { useState, useEffect } from "react";

// ── Palette + Fonts ───────────────────────────────────────────────────────────
// ── Palette ──────────────────────────────────────────────────────────────────
export var L = {
  ink:        "#0A1628",
  paper:      "#F7F8FA",
  cream:      "#EEF1F5",
  sand:       "#E3E8EF",
  white:      "#FFFFFF",
  accent:     "#17A99E",
  accentDark: "#0F7A72",
  accentGlow: "rgba(23,169,158,0.10)",
  accentBlue: "#4B7BFF",
  navy:       "#081120",
  navyMid:    "#0E1F33",
  navySlate:  "#182B3E",
  gold:       "#A78BFA",
  goldGlow:   "rgba(245,197,66,0.12)",
  muted:      "#4A5568",
  faint:      "#8A95A8",
  border:     "#DDE3EA",
  borderLt:   "#EEF1F5",
  green:      "#1A9E6B",
  greenGlow:  "rgba(26,158,107,0.09)",
  blue:       "#4B7BFF",
  blueGlow:   "rgba(75,123,255,0.09)",
  red:        "#E5534B",
};

export var fSans  = "'DM Sans',sans-serif";
export var fMono  = "'DM Mono',monospace";
export var fSerif = "'DM Serif Display',serif";

export var PAGES = ["Home","Generator","EUCompliance","Pricing","Dashboard"];

export var FONTS = "@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');";


// ── Translations ──────────────────────────────────────────────────────────────
export var TR = {
  en: {
    navStart:        "Start Free",
    navStartArrow:   "Start Free →",
    heroPill:        "For EU freelancers who invoice across borders",
    heroTitle1:      "From proposal to payment",
    heroTitle2:      "in minutes — built for Europe.",
    heroSub:         "AI-powered proposals and EU-compliant invoices in one simple flow. Less admin, faster payments, zero VAT headaches.",
    heroCta:         "Get early access →",
    heroSecondary:   "See pricing",
    heroFine:        "No credit card · 14-day free trial · Cancel anytime",
    heroFeatures:    "Proposal to invoice in one click  ·  EU VAT handled automatically  ·  AI proposals in 6 languages",
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
    heroTitle1:      "Von Angebot bis Zahlung —",
    heroTitle2:      "in Minuten. Gebaut für Europa.",
    heroSub:         "KI-Angebote und EU-konforme Rechnungen in einem einfachen Ablauf. Weniger Verwaltung, schnellere Zahlungen, keine MwSt-Probleme.",
    heroCta:         "Frühen Zugang erhalten →",
    heroSecondary:   "Preise ansehen",
    heroFine:        "Keine Kreditkarte · 14 Tage kostenlos · Jederzeit kündbar",
    heroFeatures:    "Angebot zu Rechnung per Klick  ·  EU-Steuer automatisch  ·  KI-Angebote in 6 Sprachen",
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
    heroTitle1:      "De la proposition au paiement —",
    heroTitle2:      "en quelques minutes. Pour l'Europe.",
    heroSub:         "Propositions IA et factures conformes à l'UE dans un flux simple. Moins d'admin, paiements plus rapides, zéro prise de tête TVA.",
    heroCta:         "Accès anticipé →",
    heroSecondary:   "Voir les tarifs",
    heroFine:        "Sans carte bancaire · 14 jours gratuits · Résiliation à tout moment",
    heroFeatures:    "Proposition en facture en un clic  ·  TVA UE automatique  ·  Propositions IA en 6 langues",
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
    heroTitle1:      "De la propuesta al cobro —",
    heroTitle2:      "en minutos. Hecho para Europa.",
    heroSub:         "Propuestas con IA y facturas conformes a la UE en un flujo simple. Menos gestión, cobros más rápidos, sin problemas de IVA.",
    heroCta:         "Acceso anticipado →",
    heroSecondary:   "Ver precios",
    heroFine:        "Sin tarjeta de crédito · 14 días gratis · Cancela cuando quieras",
    heroFeatures:    "Propuesta a factura en un clic  ·  IVA UE automático  ·  Propuestas IA en 6 idiomas",
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
    heroTitle1:      "Dalla proposta al pagamento —",
    heroTitle2:      "in pochi minuti. Per l'Europa.",
    heroSub:         "Proposte IA e fatture conformi all'UE in un flusso semplice. Meno burocrazia, pagamenti più veloci, zero problemi IVA.",
    heroCta:         "Accesso anticipato →",
    heroSecondary:   "Vedi i prezzi",
    heroFine:        "Senza carta di credito · 14 giorni gratis · Disdici quando vuoi",
    heroFeatures:    "Proposta in fattura in un clic  ·  IVA UE automatica  ·  Proposte IA in 6 lingue",
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
    heroTitle1:      "Ajánlattól a kifizetésig —",
    heroTitle2:      "percek alatt. Európára tervezve.",
    heroSub:         "AI-ajánlatok és EU-kompatibilis számlák egyszerű folyamatban. Kevesebb adminisztráció, gyorsabb fizetés, nulla ÁFA-fejfájás.",
    heroCta:         "Korai hozzáférés →",
    heroSecondary:   "Árak megtekintése",
    heroFine:        "Bankkártya nélkül · 14 napos ingyenes próba · Bármikor lemondható",
    heroFeatures:    "Ajánlatból számla egy kattintással  ·  EU-ÁFA automatikusan  ·  AI ajánlatok 6 nyelven",
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

export function t(lang, key) {
  return (TR[lang] || TR.en)[key] || TR.en[key] || key;
}

// ── Logo Mark ─────────────────────────────────────────────────────────────────
export function LogoMark(props) {
  var size = props.size || 32;
  var bg = props.bg || L.navy;
  var fg = props.fg || L.accent;
  var r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
      <rect width="48" height="48" rx={r} fill={bg} />
      <rect x="11" y="10" width="20" height="26" rx="2.5" fill="none" stroke={fg} strokeWidth="1.8" opacity="0.8"/>
      <line x1="15" y1="18" x2="27" y2="18" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <line x1="15" y1="22" x2="27" y2="22" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <line x1="15" y1="26" x2="22" y2="26" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M34 10 L35.3 13.7 L39 15 L35.3 16.3 L34 20 L32.7 16.3 L29 15 L32.7 13.7 Z" fill={fg} opacity="0.9"/>
    </svg>
  );
}




// ── EU Countries ──────────────────────────────────────────────────────────────
export var EU = [
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

export var PLANS = [
  { name:"Solo",   price:19,   hi:false, features:["Up to 3 active clients","Unlimited invoices","AI proposal writer","PDF + XRechnung export","EU VAT auto-calc","SEPA payment block"] },
  { name:"Studio", price:59,  hi:true,  badge:"Most Popular", features:["Unlimited clients","Unlimited invoices + proposals","AI writer + country tone","Client portal + approvals","Payment tracking + reminders","Brand kits","Reverse charge + VIES check"] },
  { name:"Agency", price:149,  hi:false, features:["Everything in Studio","5 team seats","White-label client portal","API access","Priority support","DATEV export","XRechnung + ZUGFeRD XML"] },
];

export var REVIEWS = [
  { id:1, name:"Jonas Müller",    role:"Freelance Developer",    city:"Berlin",    av:"JM", col:"#8A7A6A", rating:5, text:"Reverse charge auto-detection alone saves me an hour per cross-border invoice. Finally a tool built for how EU freelancers actually work.", platform:"G2",       helpful:34 },
  { id:2, name:"Léa Fontaine",    role:"Agency Owner",           city:"Paris",     av:"LF", col:"#7A6A5A", rating:5, text:"Cut proposal time from 3 hours to 20 minutes. Win rate went up. The tone selector makes a real difference on larger clients.", platform:"Trustpilot", helpful:28 },
  { id:3, name:"Marco Bianchi",   role:"Art Director",           city:"Milan",     av:"MB", col:"#9A8A7A", rating:5, text:"Closed a €12k brand project with a proposal I built in 8 minutes. The AI nailed the tone — warm but authoritative.", platform:"G2",       helpful:41 },
  { id:4, name:"Sophie Richter",  role:"UX Designer",            city:"Munich",    av:"SR", col:"#8A7A6A", rating:5, text:"The sequential invoice numbering and credit note system is exactly right for German law. Other tools get this completely wrong.", platform:"Trustpilot", helpful:19 },
  { id:5, name:"Pieter van Dam",  role:"Motion Designer",        city:"Amsterdam", av:"PD", col:"#7A6A5A", rating:5, text:"SEPA block on every invoice is perfect. Clients pay within days now instead of weeks. Simple change, massive impact.", platform:"Capterra",  helpful:22 },
  { id:6, name:"Anna Kowalski",   role:"Translator",             city:"Warsaw",    av:"AK", col:"#9A8A7A", rating:5, text:"Seven languages, correct VAT rates, GDPR notice — it just handles everything. I invoice clients in four countries effortlessly.", platform:"Capterra",  helpful:17 },
];


export var FEATURES = [
  { icon:"proposal", title:"AI Proposal Writer", desc:"Describe your project in plain language. AI writes a polished, client-ready proposal in under 30 seconds — in 7 European languages." },
  { icon:"document", title:"EU-Native Invoicing", desc:"Sequential numbering, reverse charge, SEPA, GDPR notice, VAT per country. Legally correct in DE, FR, IT, ES, NL, BE, SE and more." },
  { icon:"users",    title:"Client Dashboard",   desc:"Full client history, payment status, proposal analytics, brand kits and e-signatures — everything in one place." },
  { icon:"send",     title:"E-Invoice XML",      desc:"XRechnung for Germany, Factur-X for France, XML/SDI for Italy. Compliant with current and upcoming EU e-invoicing mandates." },
  { icon:"card",     title:"SEPA Payments",      desc:"Every invoice includes a professional SEPA bank transfer block with validated IBAN/BIC and payment reference." },
  { icon:"shield",   title:"GDPR Built-in",      desc:"Auto-GDPR notice on invoices, EU-hosted data, Data Processing Agreement available, cookieless analytics." },
];

export var HOW_STEPS = {
  en: [
    { num:"01", icon:"proposal", title:"Describe the project",    desc:"Tell InvoiceAI who the client is, what you're building, and your rough budget. The AI writes a structured, client-ready proposal in under 30 seconds." },
    { num:"02", icon:"send",     title:"Send and track",          desc:"Share the proposal with your client. See when they open it, how many times they view it, and get notified the moment they respond." },
    { num:"03", icon:"document", title:"Convert to invoice",      desc:"Accepted? Turn the proposal into a fully EU-compliant invoice in one click. Client details, line items and amounts carry over automatically." },
    { num:"04", icon:"card",     title:"Get paid",                desc:"Send the invoice with a payment link. Automatic reminders handle the follow-up so you can focus on the next project." },
  ],
  de: [
    { num:"01", icon:"proposal", title:"Projekt beschreiben",     desc:"Gib an, wer der Kunde ist, was du baust und dein Budget. Die KI schreibt in unter 30 Sekunden ein strukturiertes, kundenfertiges Angebot." },
    { num:"02", icon:"send",     title:"Senden und verfolgen",    desc:"Teile das Angebot mit deinem Kunden. Sieh, wann es geöffnet wird, wie oft es angesehen wird, und werde benachrichtigt, sobald eine Antwort kommt." },
    { num:"03", icon:"document", title:"In Rechnung umwandeln",   desc:"Akzeptiert? Wandle das Angebot mit einem Klick in eine EU-konforme Rechnung um. Kundendaten und Positionen werden automatisch übernommen." },
    { num:"04", icon:"card",     title:"Bezahlt werden",          desc:"Sende die Rechnung mit Zahlungslink. Automatische Erinnerungen übernehmen das Nachfassen — du kannst dich aufs nächste Projekt konzentrieren." },
  ],
  fr: [
    { num:"01", icon:"proposal", title:"Décrire le projet",       desc:"Indiquez qui est le client, ce que vous créez et votre budget. L'IA rédige une proposition structurée et prête à envoyer en moins de 30 secondes." },
    { num:"02", icon:"send",     title:"Envoyer et suivre",       desc:"Partagez la proposition avec votre client. Voyez quand il l'ouvre, combien de fois il la consulte, et soyez notifié dès qu'il répond." },
    { num:"03", icon:"document", title:"Convertir en facture",    desc:"Acceptée ? Transformez la proposition en facture conforme UE en un clic. Les données client et les postes sont repris automatiquement." },
    { num:"04", icon:"card",     title:"Être payé",               desc:"Envoyez la facture avec un lien de paiement. Les relances automatiques gèrent le suivi — vous pouvez vous concentrer sur le prochain projet." },
  ],
  es: [
    { num:"01", icon:"proposal", title:"Describe el proyecto",    desc:"Di quién es el cliente, qué estás creando y tu presupuesto. La IA escribe una propuesta estructurada y lista para el cliente en menos de 30 segundos." },
    { num:"02", icon:"send",     title:"Envía y haz seguimiento", desc:"Comparte la propuesta con tu cliente. Ve cuándo la abre, cuántas veces la consulta y recibe una notificación en cuanto responda." },
    { num:"03", icon:"document", title:"Convierte en factura",    desc:"¿Aceptada? Convierte la propuesta en una factura conforme a la UE con un clic. Los datos del cliente y las líneas se copian automáticamente." },
    { num:"04", icon:"card",     title:"Cobra",                   desc:"Envía la factura con enlace de pago. Los recordatorios automáticos se encargan del seguimiento — tú céntrate en el siguiente proyecto." },
  ],
  it: [
    { num:"01", icon:"proposal", title:"Descrivi il progetto",    desc:"Indica chi è il cliente, cosa stai creando e il tuo budget. L'IA scrive una proposta strutturata e pronta per il cliente in meno di 30 secondi." },
    { num:"02", icon:"send",     title:"Invia e monitora",        desc:"Condividi la proposta con il tuo cliente. Vedi quando la apre, quante volte la consulta e ricevi una notifica non appena risponde." },
    { num:"03", icon:"document", title:"Converti in fattura",     desc:"Accettata? Trasforma la proposta in una fattura conforme all'UE con un clic. I dati cliente e le voci vengono copiati automaticamente." },
    { num:"04", icon:"card",     title:"Incassa",                 desc:"Invia la fattura con link di pagamento. I promemoria automatici gestiscono il follow-up — tu concentrati sul prossimo progetto." },
  ],
  hu: [
    { num:"01", icon:"proposal", title:"Írd le a projektet",      desc:"Mondd meg, ki az ügyfél, mit építesz és a hozzávetőleges büdzsét. Az AI 30 másodperc alatt strukturált, ügyfélkész ajánlatot ír." },
    { num:"02", icon:"send",     title:"Küld el és kövesd",       desc:"Oszd meg az ajánlatot az ügyféllel. Látod, mikor nyitja meg, hányszor nézi meg, és azonnal értesítést kapsz, ha válaszol." },
    { num:"03", icon:"document", title:"Alakítsd számlává",       desc:"Elfogadta? Alakítsd az ajánlatot EU-kompatibilis számlává egy kattintással. Az ügyfél adatai és tételek automatikusan átkerülnek." },
    { num:"04", icon:"card",     title:"Kapd meg a pénzt",        desc:"Küldd el a számlát fizetési linkkel. Az automatikus emlékeztetők kezelik az utánkövetést — te a következő projektre koncentrálhatsz." },
  ],
};


// ── EU Features ─────────────────────────────────────────────────────────────
export var EU_FEATURES = [
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


// ── Generator data ───────────────────────────────────────────────────────────
// ── Generator ─────────────────────────────────────────────────────────────────
export var PROJ_TYPES = ["Brand Identity","Logo Design","UX/UI Design","Web Development","App Design","Software Consulting","Motion Design","Copywriting","Translation","Photography","Strategy","Pitch Deck","Other"];
export var BUDGETS = ["Not specified","€1,500–3,000","€3,000–6,000","€6,000–12,000","€12,000–25,000","€25,000+"];
export var TIMELINES = ["Not specified","1–2 weeks","3–4 weeks","5–8 weeks","2–3 months","Ongoing retainer"];

// Industry-specific proposal structures — what sections matter per project type
export var PROJ_TEMPLATES = {
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
export var COUNTRY_TONE = {
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
export function fmtDate(country, daysOffset) {
  var d = new Date();
  if (daysOffset) d.setDate(d.getDate() + daysOffset);
  var dd = String(d.getDate()).padStart(2,"0");
  var mm = String(d.getMonth()+1).padStart(2,"0");
  var yyyy = d.getFullYear();
  var fmt = (country && country.fmt) || "DD.MM.YYYY";
  return fmt.replace("DD",dd).replace("MM",mm).replace("YYYY",yyyy);
}


// ── Portal demo data ─────────────────────────────────────────────────────────
export var PORTAL_INVOICE = {
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


// ── EU Countries list ────────────────────────────────────────────────────────
export var EU_COUNTRIES_LIST = ["Germany","France","Italy","Netherlands","Spain","Belgium","Austria","Sweden","Poland","Portugal","Denmark","Finland","Ireland","Czech Republic","Romania","Hungary","Greece","Other EU","Outside EU"];


// ── Validators ───────────────────────────────────────────────────────────────
// ── Field validators ──────────────────────────────────────────────────────────
export function validateIBAN(raw) {
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

export function validateBIC(raw) {
  if (!raw || !raw.trim()) return null;
  var bic = raw.replace(/\s/g, "").toUpperCase();
  // BIC is 8 or 11 chars: 4 bank + 2 country + 2 location + optional 3 branch
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)) {
    return "Invalid BIC/SWIFT — format: BANKDEFFXXX (4+2+2+optional 3)";
  }
  return "valid";
}

export function validateEUVAT(raw) {
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

export function validateGermanTax(raw) {
  // Steuernummer: 10-13 digits, various formats per Bundesland
  if (!raw || !raw.trim()) return null;
  var clean = raw.replace(/[\s\/]/g, "");
  if (!/^\d{10,13}$/.test(clean)) return "Steuernummer should be 10-13 digits";
  return "valid";
}


// ── Field error atom ─────────────────────────────────────────────────────────
export function FieldError(props) {
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


// ── VIES ─────────────────────────────────────────────────────────────────────
export function useVIES(vatNumber) {
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

export function VIESBadge(props) {
  var status = props.status;
  if (!status) return null;
  if (status === "checking") return <span style={{ fontFamily:fMono, fontSize:10, color:L.gold, background:L.goldGlow, border:"1px solid "+L.gold+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>checking…</span>;
  if (status === "valid")    return <span style={{ fontFamily:fMono, fontSize:10, color:L.green, background:L.greenGlow, border:"1px solid "+L.green+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>✓ VIES valid</span>;
  if (status === "invalid")  return <span style={{ fontFamily:fMono, fontSize:10, color:L.accent, background:L.accentGlow, border:"1px solid "+L.accent+"44", borderRadius:4, padding:"2px 7px", marginLeft:6, letterSpacing:"0.05em" }}>⚠ not found in VIES</span>;
  return null;
}



// ── Icon system ──────────────────────────────────────────────────────────────
// ── SVG Icon system ─────────────────────────────────────────────────────────
export function Icon(props) {
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

// ── Atoms ────────────────────────────────────────────────────────────────────
export function LogoMark(props) {
  var size = props.size || 32;
  var bg = props.bg || L.navy;
  var fg = props.fg || L.accent;
  var r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
      <rect width="48" height="48" rx={r} fill={bg} />
      <rect x="11" y="10" width="20" height="26" rx="2.5" fill="none" stroke={fg} strokeWidth="1.8" opacity="0.8"/>
      <line x1="15" y1="18" x2="27" y2="18" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <line x1="15" y1="22" x2="27" y2="22" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <line x1="15" y1="26" x2="22" y2="26" stroke={fg} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M34 10 L35.3 13.7 L39 15 L35.3 16.3 L34 20 L32.7 16.3 L29 15 L32.7 13.7 Z" fill={fg} opacity="0.9"/>
    </svg>
  );
}



// ── EU Countries ──────────────────────────────────────────────────────────────
export var EU = [
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

export var PLANS = [
  { name:"Solo",   price:19,   hi:false, features:["Up to 3 active clients","Unlimited invoices","AI proposal writer","PDF + XRechnung export","EU VAT auto-calc","SEPA payment block"] },
  { name:"Studio", price:59,  hi:true,  badge:"Most Popular", features:["Unlimited clients","Unlimited invoices + proposals","AI writer + country tone","Client portal + approvals","Payment tracking + reminders","Brand kits","Reverse charge + VIES check"] },
  { name:"Agency", price:149,  hi:false, features:["Everything in Studio","5 team seats","White-label client portal","API access","Priority support","DATEV export","XRechnung + ZUGFeRD XML"] },
];

export var REVIEWS = [
  { id:1, name:"Jonas Müller",    role:"Freelance Developer",    city:"Berlin",    av:"JM", col:"#8A7A6A", rating:5, text:"Reverse charge auto-detection alone saves me an hour per cross-border invoice. Finally a tool built for how EU freelancers actually work.", platform:"G2",       helpful:34 },
  { id:2, name:"Léa Fontaine",    role:"Agency Owner",           city:"Paris",     av:"LF", col:"#7A6A5A", rating:5, text:"Cut proposal time from 3 hours to 20 minutes. Win rate went up. The tone selector makes a real difference on larger clients.", platform:"Trustpilot", helpful:28 },
  { id:3, name:"Marco Bianchi",   role:"Art Director",           city:"Milan",     av:"MB", col:"#9A8A7A", rating:5, text:"Closed a €12k brand project with a proposal I built in 8 minutes. The AI nailed the tone — warm but authoritative.", platform:"G2",       helpful:41 },
  { id:4, name:"Sophie Richter",  role:"UX Designer",            city:"Munich",    av:"SR", col:"#8A7A6A", rating:5, text:"The sequential invoice numbering and credit note system is exactly right for German law. Other tools get this completely wrong.", platform:"Trustpilot", helpful:19 },
  { id:5, name:"Pieter van Dam",  role:"Motion Designer",        city:"Amsterdam", av:"PD", col:"#7A6A5A", rating:5, text:"SEPA block on every invoice is perfect. Clients pay within days now instead of weeks. Simple change, massive impact.", platform:"Capterra",  helpful:22 },
  { id:6, name:"Anna Kowalski",   role:"Translator",             city:"Warsaw",    av:"AK", col:"#9A8A7A", rating:5, text:"Seven languages, correct VAT rates, GDPR notice — it just handles everything. I invoice clients in four countries effortlessly.", platform:"Capterra",  helpful:17 },
];

export function Pill(props) {
  var color = props.color || L.accent;
  return (
    <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:999, border:"1.5px solid "+color, color:color, fontSize:13, fontFamily:fMono, letterSpacing:"0.08em", textTransform:"uppercase" }}>
      {props.children}
    </span>
  );
}

export function Tag(props) {
  var c = props.c || L.green;
  return (
    <span style={{ padding:"2px 8px", borderRadius:4, background:c+"22", color:c, fontSize:12, fontFamily:fMono, letterSpacing:"0.06em" }}>
      {props.children}
    </span>
  );
}

export function Stars(props) {
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


// ── SubLayout ────────────────────────────────────────────────────────────────
export function SubLayout(props) {
  var pill = props.pill; var title = props.title; var sub = props.sub; var accent = props.accent;
  return (
    <div style={{ background:L.paper, minHeight:"calc(100vh - 56px)" }}>
      <div style={{ background:accent ? L.navy : L.white, borderBottom:"1px solid "+(accent ? "rgba(255,255,255,0.08)" : L.border), padding:"64px 24px 52px", textAlign:"center" }}>
        <div className="desktop-sub-header" style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:16 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:accent ? L.accent : L.muted }} />
            <span style={{ fontFamily:fMono, fontSize:11, color:accent ? L.accent : L.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>{pill}</span>
          </div>
          <h1 style={{ fontFamily:fSerif, fontSize:"clamp(28px,5vw,52px)", fontWeight:400, color:accent ? "#F0F4F8" : L.ink, margin:"0 0 14px", letterSpacing:"-0.025em", lineHeight:1.1 }}>{title}</h1>
          <p style={{ fontFamily:fSans, fontSize:15, color:accent ? "rgba(240,244,248,0.5)" : L.muted, fontWeight:300, lineHeight:1.65, maxWidth:520, margin:"0 auto" }}>{sub}</p>
        </div>
      </div>
      <div className="desktop-prose d-body" style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px", fontFamily:fSans, fontSize:14, color:L.ink, lineHeight:1.8 }}>
        {props.children}
      </div>
    </div>
  );
}

export function SH(props) { return <h2 style={{ fontFamily:fSerif, fontSize:22, fontWeight:800, color:L.ink, margin:"36px 0 10px", letterSpacing:"-0.02em" }}>{props.children}</h2>; }
export function SP(props) { return <p style={{ marginBottom:14, fontWeight:300, color:L.muted }}>{props.children}</p>; }
function SLI(props) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:8 }}>
      <Icon name="check" size={14} color={L.green} style={{ flexShrink:0, marginTop:3 }} />
      <span style={{ fontWeight:300, color:L.muted }}>{props.children}</span>
    </div>
  );
}