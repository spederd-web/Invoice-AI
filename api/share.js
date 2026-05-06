// api/share.js — saves or retrieves a shared invoice via Supabase
// Table: shared_invoices (id UUID default gen_random_uuid(), data JSONB, created_at TIMESTAMPTZ default now())
// Run once in Supabase SQL editor:
//   create table shared_invoices (
//     id uuid primary key default gen_random_uuid(),
//     data jsonb not null,
//     created_at timestamptz default now()
//   );
// Env vars needed: SUPABASE_URL, SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // GET ?id=UUID — load a shared invoice
  if (req.method === "GET") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "id required" });

    const { data, error } = await supabase
      .from("shared_invoices")
      .select("data")
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(data.data);
  }

  // POST — save a new shared invoice, return UUID
  if (req.method === "POST") {
    const payload = req.body;
    if (!payload || !payload.inv_number) {
      return res.status(400).json({ error: "inv_number required" });
    }

    const { data, error } = await supabase
      .from("shared_invoices")
      .insert([{ data: payload }])
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save invoice" });
    }

    return res.status(200).json({ id: data.id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
