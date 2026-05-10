// api/webhook.js - Stripe webhook handler
// Updates user plan status in Supabase on checkout, payment, cancellation
//
// In Stripe dashboard -> Webhooks, add endpoint:
//   https://www.invoice-ai.de/api/webhook
// Events to listen for:
//   checkout.session.completed
//   customer.subscription.updated
//   customer.subscription.deleted
//   invoice.payment_failed
//
// Env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise(function(resolve, reject) {
    var chunks = [];
    req.on("data", function(chunk) { chunks.push(chunk); });
    req.on("end", function() { resolve(Buffer.concat(chunks)); });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    var Stripe = (await import("stripe")).default;
    var { createClient } = await import("@supabase/supabase-js");

    var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    var rawBody = await getRawBody(req);
    var sig = req.headers["stripe-signature"];

    var event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    // Helper: get user_id from Stripe customer email
    async function getUserId(customerEmail) {
      if (!customerEmail) return null;
      var { data } = await supabase.auth.admin.listUsers();
      if (!data || !data.users) return null;
      var match = data.users.find(function(u) { return u.email === customerEmail; });
      return match ? match.id : null;
    }

    // Helper: get plan name from price id
    function getPlan(priceId) {
      if (priceId === process.env.STRIPE_PRICE_SOLO)   return "solo";
      if (priceId === process.env.STRIPE_PRICE_STUDIO) return "studio";
      if (priceId === process.env.STRIPE_PRICE_AGENCY) return "agency";
      return "solo";
    }

    // Helper: update profile plan
    async function updatePlan(userId, plan, status) {
      if (!userId) return;
      await supabase.from("profiles").upsert([{
        id: userId,
        plan: plan,
        plan_status: status,
        updated_at: new Date().toISOString(),
      }], { onConflict: "id" });
    }

    if (event.type === "checkout.session.completed") {
      var session = event.data.object;
      var email = session.customer_details && session.customer_details.email;
      var userId = await getUserId(email);
      // Get subscription to find price
      if (session.subscription) {
        var sub = await stripe.subscriptions.retrieve(session.subscription);
        var priceId = sub.items.data[0] && sub.items.data[0].price.id;
        await updatePlan(userId, getPlan(priceId), "active");
      }
    }

    if (event.type === "customer.subscription.updated") {
      var sub = event.data.object;
      var customer = await stripe.customers.retrieve(sub.customer);
      var email = customer.email;
      var userId = await getUserId(email);
      var priceId = sub.items.data[0] && sub.items.data[0].price.id;
      var status = sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "inactive";
      await updatePlan(userId, getPlan(priceId), status);
    }

    if (event.type === "customer.subscription.deleted") {
      var sub = event.data.object;
      var customer = await stripe.customers.retrieve(sub.customer);
      var userId = await getUserId(customer.email);
      await updatePlan(userId, "free", "cancelled");
    }

    if (event.type === "invoice.payment_failed") {
      var inv = event.data.object;
      var customer = await stripe.customers.retrieve(inv.customer);
      var userId = await getUserId(customer.email);
      await updatePlan(userId, null, "payment_failed");
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
