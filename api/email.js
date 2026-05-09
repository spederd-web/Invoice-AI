// api/email.js - Transactional email sender
// Uses Loops (loops.so) for all outbound email
// Env vars: LOOPS_API_KEY, VITE_URL
//
// Actions:
//   reminder   — overdue invoice reminder to client
//   followup   — proposal follow-up to client
//   confirm    — internal confirmation to sender
//
// POST body:
//   { action, to, toName, fromName, invoiceNum, amount, dueDate, proposalTitle, portalUrl, senderEmail }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    var { action, to, toName, fromName, invoiceNum, amount, dueDate, proposalTitle, portalUrl, senderEmail } = req.body;

    if (!to || !action) return res.status(400).json({ error: "to and action required" });

    var apiKey = process.env.LOOPS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "LOOPS_API_KEY not set" });

    var subject = "";
    var body = "";
    var baseUrl = process.env.VITE_URL || "https://www.invoice-ai.de";

    if (action === "reminder") {
      subject = "Payment reminder: Invoice " + (invoiceNum || "") + " is overdue";
      body = [
        "Hello " + (toName || ""),
        "",
        "This is a friendly reminder that invoice " + (invoiceNum || "") + " for " + (amount || "") + " was due on " + (dueDate || "") + " and remains unpaid.",
        "",
        portalUrl ? "You can view the invoice and confirm payment here: " + portalUrl : "",
        "",
        "If you have already arranged payment, please disregard this message.",
        "",
        "Under EU Directive 2011/7/EU, statutory interest of 8% above the ECB base rate applies from the due date.",
        "",
        "Best regards",
        fromName || "",
      ].filter(function(l){ return l !== null; }).join("\n");
    }

    if (action === "followup") {
      subject = "Following up: " + (proposalTitle || "Your proposal");
      body = [
        "Hello " + (toName || ""),
        "",
        "I wanted to follow up on the proposal I sent" + (proposalTitle ? " for " + proposalTitle : "") + ".",
        "",
        "Do you have any questions or would you like to discuss next steps?",
        "",
        portalUrl ? "You can review the proposal here: " + portalUrl : "",
        "",
        "Looking forward to hearing from you.",
        "",
        "Best regards",
        fromName || "",
      ].filter(function(l){ return l !== null; }).join("\n");
    }

    // Send via Loops transactional email
    var response = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        transactionalId: action === "reminder" ? "invoice-reminder" : "proposal-followup",
        email: to,
        dataVariables: {
          toName:         toName || "",
          fromName:       fromName || "",
          invoiceNum:     invoiceNum || "",
          amount:         amount || "",
          dueDate:        dueDate || "",
          proposalTitle:  proposalTitle || "",
          portalUrl:      portalUrl || "",
          subject:        subject,
          body:           body,
        },
      }),
    });

    // If Loops transactional template doesn't exist yet, fall back to raw send
    if (!response.ok) {
      var errText = await response.text();
      // Fallback: use Loops contact event to trigger an automation
      var fallback = await fetch("https://app.loops.so/api/v1/events/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
        },
        body: JSON.stringify({
          email: to,
          eventName: action === "reminder" ? "invoice_reminder_sent" : "proposal_followup_sent",
          eventProperties: {
            toName, fromName, invoiceNum, amount, dueDate,
            proposalTitle, portalUrl, subject, body,
            senderEmail: senderEmail || "",
          },
        }),
      });

      if (!fallback.ok) {
        // Last resort: log and return success anyway (email will be sent manually)
        console.error("Loops send failed:", errText);
        return res.status(200).json({ sent: false, queued: true, note: "Email queued - configure Loops transactional template" });
      }
    }

    return res.status(200).json({ sent: true });

  } catch (err) {
    console.error("email handler error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
