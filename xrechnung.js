// api/xrechnung.js — Generates a valid XRechnung 3.0 UBL XML invoice
// POST with invoice data, returns XML string
// Spec: EN 16931 / XRechnung 3.0 (CIUS DE)
// Reference: urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_3.0

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    // Seller (BG-4)
    sellerName, sellerStreet, sellerCity, sellerCountry, sellerVAT, sellerTaxId,
    sellerIBAN, sellerBIC, sellerEmail,
    // Buyer (BG-7)
    buyerName, buyerStreet, buyerCity, buyerCountry, buyerVAT, buyerEmail,
    buyerReference,   // BT-10 Leitweg-ID (required for B2G, optional B2B)
    // Invoice header
    invoiceNumber,    // BT-1
    issueDate,        // BT-2  YYYY-MM-DD
    dueDate,          // BT-9  YYYY-MM-DD
    serviceDate,      // BT-73 YYYY-MM-DD (Leistungsdatum)
    currency,         // BT-5  e.g. EUR
    reference,        // BT-10 buyer reference / order number
    note,             // BT-22 invoice note
    // Lines (array of { desc, qty, unit, unitPrice, vatRate, lineTotal })
    lines,
    // Totals
    subtotal, vatAmount, total,
    // Flags
    reverseCharge,    // boolean
    kleinunternehmer, // boolean — §19 UStG
  } = req.body;

  // Validate required fields
  const missing = [];
  if (!sellerName)    missing.push("sellerName");
  if (!sellerVAT && !sellerTaxId) missing.push("sellerVAT or sellerTaxId");
  if (!buyerName)     missing.push("buyerName");
  if (!invoiceNumber) missing.push("invoiceNumber");
  if (!issueDate)     missing.push("issueDate");
  if (!lines || !lines.length) missing.push("lines");
  if (missing.length) return res.status(400).json({ error: "Missing required fields", missing });

  const cur = currency || "EUR";
  const vatCode = reverseCharge ? "AE" : kleinunternehmer ? "E" : "S";
  const vatExemptReason = reverseCharge
    ? "Reverse charge — VAT liability transfers to recipient (Art. 44 EU VAT Dir. 2006/112/EC)"
    : kleinunternehmer
    ? "Steuerfreie Leistung gemäß §19 UStG (Kleinunternehmerregelung)"
    : "";

  const esc = (s) => String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const fmt2 = (n) => Number(n || 0).toFixed(2);

  const linesXML = (lines || []).map((line, i) => `
    <cac:InvoiceLine>
      <cbc:ID>${i + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="${esc(line.unit || "C62")}">${Number(line.qty || 1).toFixed(4)}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="${cur}">${fmt2(line.lineTotal)}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Description>${esc(line.desc)}</cbc:Description>
        <cbc:Name>${esc(line.desc)}</cbc:Name>
        <cac:ClassifiedTaxCategory>
          <cbc:ID>${vatCode}</cbc:ID>
          <cbc:Percent>${Number(line.vatRate || 0).toFixed(2)}</cbc:Percent>
          <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="${cur}">${fmt2(line.unitPrice)}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">

  <!-- BT-24: Specification identifier — XRechnung 3.0 -->
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_3.0</cbc:CustomizationID>

  <!-- BT-23: Profile identifier -->
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>

  <!-- BT-1: Invoice number -->
  <cbc:ID>${esc(invoiceNumber)}</cbc:ID>

  <!-- BT-2: Issue date -->
  <cbc:IssueDate>${esc(issueDate)}</cbc:IssueDate>

  ${dueDate ? `<!-- BT-9: Due date -->
  <cbc:DueDate>${esc(dueDate)}</cbc:DueDate>` : ""}

  <!-- BT-3: Invoice type code — 380 = Commercial invoice -->
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>

  ${note ? `<!-- BT-22: Note -->
  <cbc:Note>${esc(note)}</cbc:Note>` : ""}

  ${serviceDate ? `<!-- BT-73: Delivery/service date -->
  <cac:Delivery>
    <cbc:ActualDeliveryDate>${esc(serviceDate)}</cbc:ActualDeliveryDate>
  </cac:Delivery>` : ""}

  <!-- BT-5: Document currency -->
  <cbc:DocumentCurrencyCode>${esc(cur)}</cbc:DocumentCurrencyCode>

  ${buyerReference || reference ? `<!-- BT-10: Buyer reference (Bestellreferenz / Leitweg-ID) -->
  <cbc:BuyerReference>${esc(buyerReference || reference)}</cbc:BuyerReference>` : ""}

  <!-- BG-4: Seller -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      ${sellerEmail ? `<!-- BT-34: Seller electronic address -->
      <cbc:EndpointID schemeID="EM">${esc(sellerEmail)}</cbc:EndpointID>` : ""}
      <cac:PartyName>
        <cbc:Name>${esc(sellerName)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        ${sellerStreet ? `<cbc:StreetName>${esc(sellerStreet)}</cbc:StreetName>` : ""}
        ${sellerCity ? `<cbc:CityName>${esc(sellerCity)}</cbc:CityName>` : ""}
        <cbc:CountrySubentity></cbc:CountrySubentity>
        <cac:Country>
          <cbc:IdentificationCode>${esc(sellerCountry || "DE")}</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        ${sellerVAT ? `<cbc:CompanyID>${esc(sellerVAT)}</cbc:CompanyID>` : `<cbc:CompanyID>${esc(sellerTaxId)}</cbc:CompanyID>`}
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${esc(sellerName)}</cbc:RegistrationName>
        ${sellerVAT ? `<cbc:CompanyID>${esc(sellerVAT)}</cbc:CompanyID>` : ""}
      </cac:PartyLegalEntity>
      ${sellerEmail ? `<cac:Contact><cbc:ElectronicMail>${esc(sellerEmail)}</cbc:ElectronicMail></cac:Contact>` : ""}
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- BG-7: Buyer -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      ${buyerEmail ? `<cbc:EndpointID schemeID="EM">${esc(buyerEmail)}</cbc:EndpointID>` : ""}
      <cac:PartyName>
        <cbc:Name>${esc(buyerName)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        ${buyerStreet ? `<cbc:StreetName>${esc(buyerStreet)}</cbc:StreetName>` : ""}
        ${buyerCity ? `<cbc:CityName>${esc(buyerCity)}</cbc:CityName>` : ""}
        <cac:Country>
          <cbc:IdentificationCode>${esc(buyerCountry || "DE")}</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      ${buyerVAT ? `<cac:PartyTaxScheme>
        <cbc:CompanyID>${esc(buyerVAT)}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>` : ""}
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${esc(buyerName)}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
      ${buyerEmail ? `<cac:Contact><cbc:ElectronicMail>${esc(buyerEmail)}</cbc:ElectronicMail></cac:Contact>` : ""}
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- BG-16: Payment means — SEPA credit transfer (code 58) -->
  ${sellerIBAN ? `<cac:PaymentMeans>
    <cbc:PaymentMeansCode>58</cbc:PaymentMeansCode>
    ${dueDate ? `<cbc:PaymentDueDate>${esc(dueDate)}</cbc:PaymentDueDate>` : ""}
    <cac:PayeeFinancialAccount>
      <cbc:ID>${esc(sellerIBAN.replace(/\s/g, ""))}</cbc:ID>
      ${sellerBIC ? `<cac:FinancialInstitutionBranch><cbc:ID>${esc(sellerBIC)}</cbc:ID></cac:FinancialInstitutionBranch>` : ""}
    </cac:PayeeFinancialAccount>
  </cac:PaymentMeans>` : ""}

  <!-- BG-23: VAT breakdown -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${cur}">${fmt2(vatAmount || 0)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="${cur}">${fmt2(subtotal)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="${cur}">${fmt2(vatAmount || 0)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>${vatCode}</cbc:ID>
        <cbc:Percent>${fmt2(lines && lines[0] ? lines[0].vatRate : 0)}</cbc:Percent>
        ${vatExemptReason ? `<cbc:TaxExemptionReason>${esc(vatExemptReason)}</cbc:TaxExemptionReason>` : ""}
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>

  <!-- BG-22: Document totals -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${cur}">${fmt2(subtotal)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${cur}">${fmt2(subtotal)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${cur}">${fmt2(total)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="${cur}">${fmt2(total)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- Invoice lines -->
  ${linesXML}

</ubl:Invoice>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, "_")}_XRechnung.xml"`);
  return res.status(200).send(xml.trim());
}
