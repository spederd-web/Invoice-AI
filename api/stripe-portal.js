// api/stripe-portal.js
// POST { email } -> { url } — redirects user to Stripe Customer Portal
// Env vars: STRIPE_SECRET_KEY, VITE_URL

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    var Stripe = (await import("stripe")).default;
    var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });

    var { email } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    var returnUrl = (process.env.VITE_URL || "https://www.invoice-ai.de") + "/";

    // Find customer by email
    var customers = await stripe.customers.list({ email: email, limit: 1 });

    if (!customers.data.length) {
      // No Stripe customer yet — send to pricing page
      return res.status(200).json({ url: returnUrl + "?page=Pricing" });
    }

    var session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("stripe-portal error:", err);
    return res.status(500).json({ error: err.message });
  }
}
