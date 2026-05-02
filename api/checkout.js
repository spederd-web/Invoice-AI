// api/checkout.js — creates a Stripe Checkout session
// Set STRIPE_SECRET_KEY in Vercel environment variables
// Set NEXT_PUBLIC_URL or VITE_URL to your domain (https://invoice-ai.de)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const stripe = await import("stripe").then(m => m.default(process.env.STRIPE_SECRET_KEY));
  const { plan, email } = req.body;

  // Price IDs — create these in your Stripe Dashboard and paste them here
  const PRICES = {
    solo:   process.env.STRIPE_PRICE_SOLO,    // €19/mo
    studio: process.env.STRIPE_PRICE_STUDIO,  // €59/mo
    agency: process.env.STRIPE_PRICE_AGENCY,  // €149/mo
  };

  const priceId = PRICES[plan];
  if (!priceId) return res.status(400).json({ error: "Invalid plan: " + plan });

  const baseUrl = process.env.VITE_URL || "https://invoice-ai.de";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "sepa_debit"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },   // collects EU VAT numbers
      automatic_tax: { enabled: true },        // Stripe Tax handles EU VAT
      success_url: baseUrl + "?checkout=success&plan=" + plan,
      cancel_url:  baseUrl + "?checkout=cancelled",
      metadata: { plan, source: "invoice-ai.de" },
      subscription_data: {
        trial_period_days: 14,
        metadata: { plan },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
