// api/auth.js — Supabase auth proxy
// Actions: signin, signup, magic, verify
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");

    const { action, email, password, access_token, refresh_token } = req.body;

    // ── verify — exchange magic link token for user session ───────────────────
    // Called client-side after detecting #access_token in URL hash
    if (action === "verify") {
      if (!access_token) return res.status(400).json({ error: "access_token required" });

      // Use anon key for session exchange — service role isn't for client sessions
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token || "",
      });

      if (error) return res.status(401).json({ error: error.message });
      return res.status(200).json({ user: data.user, session: data.session });
    }

    // For all other actions use service role
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ── signin ────────────────────────────────────────────────────────────────
    if (action === "signin") {
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: error.message });
      return res.status(200).json({ user: data.user, session: data.session });
    }

    // ── signup ────────────────────────────────────────────────────────────────
    if (action === "signup") {
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user: data.user, session: data.session });
    }

    // ── magic link ────────────────────────────────────────────────────────────
    if (action === "magic") {
      if (!email) return res.status(400).json({ error: "Email required" });
      const redirectUrl = process.env.VITE_URL
        ? process.env.VITE_URL + "/"
        : "https://www.invoice-ai.de/";
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ sent: true });
    }

    return res.status(400).json({ error: "Unknown action: " + action });

  } catch (err) {
    console.error("auth handler error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
