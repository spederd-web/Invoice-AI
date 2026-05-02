// api/loops.js — proxies waitlist signups to Loops.so
// Set LOOPS_API_KEY in Vercel environment variables
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Loops API key not configured" });

  const { email, firstName, lastName, country, userGroup, source } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // 1. Create or update the contact
    const contactRes = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        email,
        firstName: firstName || "",
        lastName:  lastName  || "",
        userGroup: userGroup || "Waitlist",
        country:   country   || "",
        source:    source    || "waitlist",
        subscribed: true,
      }),
    });

    const contactData = await contactRes.json();

    // 2. Trigger the waitlist confirmation email event
    await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        email,
        eventName: "waitlistSignup",
        eventProperties: {
          firstName: firstName || "",
          country:   country   || "",
          userGroup: userGroup || "",
          source:    source    || "waitlist",
        },
      }),
    });

    return res.status(200).json({ success: true, contact: contactData });
  } catch (err) {
    console.error("Loops error:", err);
    return res.status(500).json({ error: "Failed to add contact" });
  }
}
